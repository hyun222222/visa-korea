import {randomInt, randomUUID} from 'node:crypto';
import type {NextRequest} from 'next/server';
import {db} from '@/lib/airport-server';
import {
  ReviewError, digestReview, loadReviewCase, normalizeReviewEmail, notifyReview, publicReviewCase,
  requireReviewEmail, reviewAgreement, reviewCaseId, reviewConfigured, reviewEmail,
  reviewFailure, reviewIntakeOpen, reviewJson, reviewMaterialsSubmissionEnabled, reviewPlans, reviewTermsVersion,
  reviewText, sendReviewEmail, setReviewSession, transitionReviewCase, verifyReviewOrigin,
  usesPayFirstReview, type ReviewCase,
} from '@/lib/visa-review-server';
import {beginCheckout, captureCase, reviewDayMs} from '@/lib/visa-review-workflow';
import {getMaterialsToken, reviewDirectCaseId, setReviewDirectCase} from '@/lib/visa-review-direct';
import {isPaymentTermsLanguage, paymentTerms, paymentTermsAcceptance} from '@/lib/visa-review-terms';

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

async function loadDirectCase(request: NextRequest) {
  const caseId = reviewDirectCaseId(request);
  if (!caseId) return null;
  try {
    const c = await loadReviewCase(caseId);
    return usesPayFirstReview(c) ? c : null;
  } catch (error) {
    if (error instanceof ReviewError && error.status === 404) return null;
    throw error;
  }
}

const orderFields = new Set(['action', 'plan', 'email', 'language', 'termsVersion', 'koreanLaw',
  'immediateReviewAndRefund', 'noVisaGuarantee', 'privacyConsent', 'transferConsent']);

async function createDirectOrder(request: NextRequest, input: Record<string, unknown>) {
  if (Object.keys(input).some((key) => !orderFields.has(key))) throw new ReviewError('Invalid checkout fields.', 422);
  if (input.privacyConsent !== true || input.transferConsent !== true) {
    throw new ReviewError('Confirm the personal data and overseas transfer notices.', 422);
  }
  const language = paymentTermsAcceptance(input);
  if (!language) {
    const fallback = isPaymentTermsLanguage(input.language) ? input.language : 'en';
    throw new ReviewError(paymentTerms[fallback].missingConsent, 422);
  }
  const plan = input.plan;
  if (plan !== 'question' && plan !== 'documents' && plan !== 'strategy') {
    throw new ReviewError('Select a review plan.');
  }
  const email = normalizeReviewEmail(input.email);
  if (!await reviewIntakeOpen()) throw new ReviewError('New reviews are temporarily paused.', 503);

  let c = await loadDirectCase(request);
  if (c?.status === 'capturing') throw new ReviewError('Confirm your existing PayPal payment before starting another.', 409);
  if (!c || (c.status !== 'submitted' && c.status !== 'checkout') ||
    c.email !== email || c.plan !== plan || c.language !== language ||
    !(Date.parse(c.checkout_expires_at ?? '') > Date.now())) {
    const {data, error} = await db().from('visa_review_cases').insert({
      id: randomUUID(), email, name: '', plan, amount_cents: reviewPlans[plan].amountCents, language,
      visa: '', question: '',
      agreement: reviewAgreement(language, '', plan), terms_version: reviewTermsVersion,
      checkout_expires_at: new Date(Date.now() + reviewDayMs).toISOString(),
    }).select('*').single();
    if (error) throw error;
    c = data as ReviewCase;
  }

  try {
    const {orderId, reviewCase} = await beginCheckout(c, request, input);
    return setReviewDirectCase(reviewJson({case: publicReviewCase(reviewCase), orderId}), request, c.id);
  } catch (error) {
    // A lost provider response must not force the browser to create a different case on retry.
    return setReviewDirectCase(reviewFailure(error), request, c.id);
  }
}

async function captureDirectOrder(request: NextRequest, input: Record<string, unknown>) {
  if (Object.keys(input).some((key) => key !== 'action' && key !== 'caseId' && key !== 'orderId')) {
    throw new ReviewError('Invalid payment confirmation fields.', 422);
  }
  const caseId = reviewCaseId(input.caseId);
  if (reviewDirectCaseId(request) !== caseId) throw new ReviewError('Case unavailable.', 404);
  const c = await loadDirectCase(request);
  if (!c) throw new ReviewError('Case unavailable.', 404);
  const paid = await captureCase(c, reviewText(input.orderId, 64));
  return setReviewDirectCase(reviewJson({case: publicReviewCase(paid), materialsToken: getMaterialsToken(paid)}), request, paid.id);
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
    const directCase = await loadDirectCase(request);
    const checkout = {
      open,
      paypalClientId: open ? process.env.VISA_REVIEW_PAYPAL_CLIENT_ID?.trim() || null : null,
      directCase: directCase ? publicReviewCase(directCase) : null,
      directOrderId: directCase && (directCase.status === 'checkout' || directCase.status === 'capturing')
        ? directCase.payment_order_id
        : null,
      materialsToken: directCase ? getMaterialsToken(directCase) : null,
      materialsSubmissionEnabled: reviewMaterialsSubmissionEnabled(),
    };
    if (!email) return reviewJson({cases: [], authenticated: false, ...checkout});
    const {data, error} = await db().from('visa_review_cases').select('*')
      .eq('email', email).order('submitted_at', {ascending: false}).limit(100);
    if (error) throw error;
    return reviewJson({cases: (data as ReviewCase[]).map(publicReviewCase), authenticated: true, ...checkout});
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
    if (input.action === 'create-direct-order') return await createDirectOrder(request, input);
    if (input.action === 'capture-direct-order') return await captureDirectOrder(request, input);
    if (input.action === 'submit') throw new ReviewError('New reviews start from the PayPal checkout. Reload this page to continue.', 410);
    const caseId = reviewCaseId(input.caseId);
    if (input.action === 'cancel' && reviewDirectCaseId(request) === caseId) {
      const c = await loadDirectCase(request);
      if (c) return reviewJson({case: publicReviewCase(await cancelCase(c))});
    }
    const c = await loadReviewCase(caseId, requireReviewEmail(request));
    switch (input.action) {
      case 'checkout': {
        const {approvalUrl} = await beginCheckout(c, request, input);
        return reviewJson({approvalUrl});
      }
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
