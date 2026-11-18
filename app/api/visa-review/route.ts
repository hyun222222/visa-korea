import {randomInt, randomUUID} from 'node:crypto';
import type {NextRequest} from 'next/server';
import {db} from '@/lib/airport-server';
import {
  ReviewError, digestReview, loadReviewCase, normalizeReviewEmail, notifyReview, publicReviewCase,
  requireReviewEmail, reviewAgreement, reviewCaseId, reviewConfigured, reviewEmail,
  reviewFailure, reviewIntakeOpen, reviewJson, reviewPlans, reviewTermsVersion,
  reviewText, sendReviewEmail, setReviewSession, transitionReviewCase, verifyReviewOrigin,
  type ReviewCase, type ReviewPlan,
} from '@/lib/visa-review-server';
import {beginCheckout, captureCase} from '@/lib/visa-review-workflow';

export const runtime = 'nodejs';
export const maxDuration = 60;

function otpHash(email: string, code: string) {
  return digestReview('code:' + JSON.stringify([email, code]));
}

async function sendCode(request: Request, input: Record<string, unknown>) {
  const email = normalizeReviewEmail(input.email);
  if (input.privacyConsent !== true || input.transferConsent !== true) {
    throw new ReviewError('Confirm the personal data and overseas transfer notices.');
  }
  if (!await reviewIntakeOpen()) {
    const {data, error} = await db().from('visa_review_cases').select('id').eq('email', email).limit(1);
    if (error) throw error;
    if (!data?.length) return reviewJson({ok: true});
  }
  const source = (request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const code = randomInt(1_000_000).toString().padStart(6, '0');
  const {data, error} = await db().rpc('issue_visa_review_code', {
    p_email: email, p_code_hash: otpHash(email, code), p_source_hash: digestReview('source:' + source),
  });
  if (error) throw error;
  if (data) {
    await sendReviewEmail(email, 'Korea visa review verification / 비자 서면검토 이메일 인증',
      '김현정 법률사무소\n\nVerification code / 인증번호 / 验证码\n' + code + '\n\nValid for 10 minutes / 10분간 유효 / 10分钟内有效');
  }
  return reviewJson({ok: true});
}

async function verifyCode(request: Request, input: Record<string, unknown>) {
  const email = normalizeReviewEmail(input.email);
  const code = reviewText(input.code, 6);
  if (!/^\d{6}$/.test(code)) throw new ReviewError('Enter the six-digit code.');
  const {data, error} = await db().rpc('consume_visa_review_code', {p_email: email, p_code_hash: otpHash(email, code)});
  if (error) throw error;
  if (!data) throw new ReviewError('The code is invalid or expired. Request another code.', 401);
  return setReviewSession(reviewJson({ok: true}), request, email);
}

async function submitCase(input: Record<string, unknown>, email: string) {
  if (!await reviewIntakeOpen()) throw new ReviewError('New reviews are temporarily paused.', 503);
  const fields = new Set(['action', 'plan', 'language', 'name', 'consent', 'privacyConsent', 'transferConsent']);
  if (Object.keys(input).some((key) => !fields.has(key))) {
    throw new ReviewError('Email case descriptions and supporting documents to the office using your case reference.', 422);
  }
  if (input.consent !== true || input.privacyConsent !== true || input.transferConsent !== true) {
    throw new ReviewError('Confirm the agreement and personal data notices.');
  }
  const {plan: rawPlan, language} = input;
  if (typeof rawPlan !== 'string' || !Object.hasOwn(reviewPlans, rawPlan)) {
    throw new ReviewError('Select a review plan.');
  }
  const plan = rawPlan as ReviewPlan;
  if (language !== 'en' && language !== 'ko' && language !== 'zh') throw new ReviewError('Select a language.');
  const name = reviewText(input.name, 120);

  const {data, error} = await db().from('visa_review_cases').insert({
    id: randomUUID(), email, name, plan, amount_cents: reviewPlans[plan].amountCents, language,
    visa: '', question: '',
    agreement: reviewAgreement(language, name, plan), terms_version: reviewTermsVersion,
  }).select('*').single();
  if (error) throw error;
  const saved = data as ReviewCase;
  const warning = await notifyReview(saved, 'submitted');
  return reviewJson({case: publicReviewCase(saved), warning}, 201);
}

async function cancelCase(c: ReviewCase) {
  if (['cancelled', 'refund_requested', 'refunding', 'refunded'].includes(c.status)) return c;
  if (['submitted', 'accepted', 'checkout'].includes(c.status)) {
    return transitionReviewCase(c, {status: 'cancelled'});
  }
  if (['paid', 'in_review', 'delivered'].includes(c.status)) {
    const saved = await transitionReviewCase(c, {
      status: 'refund_requested',
      refund_requested_at: new Date().toISOString(),
      refund_resolved_at: null,
      refund_resolution_reason: null,
    });
    await notifyReview(saved, 'refund_requested');
    return saved;
  }
  throw new ReviewError(c.status === 'capturing' ? 'Payment is being confirmed. Check the case again shortly.' : 'This case cannot be cancelled here.', 409);
}

export async function GET(request: NextRequest) {
  try {
    const email = reviewEmail(request);
    const open = await reviewIntakeOpen();
    if (!email) return reviewJson({cases: [], authenticated: false, open});
    const {data, error} = await db().from('visa_review_cases').select('*')
      .eq('email', email).order('submitted_at', {ascending: false}).limit(100);
    if (error) throw error;
    return reviewJson({cases: (data as ReviewCase[]).map(publicReviewCase), authenticated: true, open});
  } catch (error) {
    return reviewFailure(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    verifyReviewOrigin(request);
    if (!reviewConfigured()) throw new ReviewError('Online intake is currently unavailable.', 503);
    const type = request.headers.get('content-type') ?? '';
    const size = Number(request.headers.get('content-length') ?? 0);
    if (type.startsWith('multipart/form-data')) {
      throw new ReviewError('Website uploads are closed. Email the office using your case reference.', 410);
    }
    if (!type.startsWith('application/json')) throw new ReviewError('Invalid request.', 415);
    if (size > 20_000) throw new ReviewError('Request too large.', 413);
    const raw = await request.text();
    if (raw.length > 20_000) throw new ReviewError('Request too large.', 413);
    let input: Record<string, unknown>;
    try {
      input = JSON.parse(raw);
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error();
    } catch {
      throw new ReviewError('Invalid request.');
    }
    if (input.action === 'send-code') return await sendCode(request, input);
    if (input.action === 'verify-code') return await verifyCode(request, input);
    const email = requireReviewEmail(request);
    if (input.action === 'submit') return await submitCase(input, email);
    const c = await loadReviewCase(reviewCaseId(input.caseId), email);
    switch (input.action) {
      case 'checkout':
        return reviewJson(await beginCheckout(c, request, input));
      case 'capture':
        return reviewJson({case: publicReviewCase(await captureCase(c, reviewText(input.orderId, 100)))});
      case 'cancel':
        return reviewJson({case: publicReviewCase(await cancelCase(c))});
      default:
        throw new ReviewError('Unknown action.');
    }
  } catch (error) {
    return reviewFailure(error);
  }
}
