import 'server-only';
import {createHmac, timingSafeEqual} from 'node:crypto';
import {NextResponse, type NextRequest} from 'next/server';
import {db} from './airport-server';
import {reviewPaymentReady} from './visa-review-paypal';
import type {PaymentConsentRecord, PaymentTermsLanguage} from './visa-review-terms';

export const reviewOffice = '김현정 법률사무소';
export const reviewTermsVersion = 'visa-review-2026-11-17-v2';
export const reviewOrigin = 'https://review.koreavisalaw.com';
export const reviewBucket = 'visa-review-private';
export const reviewPlans = {
  question: {amountCents: 5500},
  documents: {amountCents: 9900},
  strategy: {amountCents: 33000},
} as const;
export type ReviewPlan = keyof typeof reviewPlans;
export type ReviewLanguage = PaymentTermsLanguage;
export type ReviewStatus = 'submitted' | 'accepted' | 'checkout' | 'capturing' | 'paid' |
  'in_review' | 'delivered' | 'declined' | 'cancelled' | 'refund_requested' | 'refunding' | 'partially_refunded' | 'refunded';

export type ReviewRefundOperation = {
  id: string;
  amount_cents: number;
  reason: string;
  status: 'requested' | 'pending' | 'completed' | 'failed';
  requested_at: string;
  provider_id: string | null;
  completed_at: string | null;
  settlement_confirmed?: boolean;
  initiated_by?: string;
};

export type ReviewCase = {
  id: string;
  email: string;
  name: string;
  plan: ReviewPlan;
  amount_cents: number;
  visa: string;
  question: string;
  counterparty: string;
  language: ReviewLanguage;
  status: ReviewStatus;
  agreement: string;
  terms_version: string;
  submitted_at: string;
  updated_at: string;
  accepted_at: string | null;
  accepted_by: string | null;
  checkout_expires_at: string | null;
  payment_environment: 'live' | 'sandbox' | null;
  payment_order_id: string | null;
  payment_approval_url: string | null;
  payment_capture_id: string | null;
  payment_consent: PaymentConsentRecord | null;
  paid_at: string | null;
  deadline_at: string | null;
  started_at: string | null;
  delivered_at: string | null;
  result: string | null;
  refund_requested_at: string | null;
  refund_resolved_at: string | null;
  refund_resolution_reason: string | null;
  refund_operations: ReviewRefundOperation[] | null;
  refund_id: string | null;
  refunded_at: string | null;
};

export class ReviewError extends Error {
  constructor(message: string, readonly status = 400) { super(message); }
}

export function reviewJson(value: unknown, status = 200) {
  return NextResponse.json(value, {
    status, headers: {'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow'},
  });
}

export function reviewFailure(error: unknown) {
  return error instanceof ReviewError
    ? reviewJson({error: error.message}, error.status)
    : reviewJson({error: 'The request could not be completed. Please retry or contact the office.'}, 502);
}

export function verifyReviewOrigin(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) throw new ReviewError('Invalid request origin.', 403);
}

const fromAddress = () => process.env.VISA_REVIEW_NOTIFY_FROM || process.env.AIRPORT_NOTIFY_FROM;
const officeAddress = () => process.env.VISA_REVIEW_NOTIFY_TO || process.env.AIRPORT_NOTIFY_TO;

export function reviewConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY &&
    (process.env.VISA_REVIEW_SESSION_SECRET?.length ?? 0) >= 32 &&
    process.env.RESEND_API_KEY && fromAddress() && officeAddress());
}

export function reviewPaymentEnvironment() {
  return process.env.VISA_REVIEW_PAYPAL_ENV?.trim() === 'live' ? 'live' : 'sandbox';
}

export async function reviewIntakeOpen() {
  if (!reviewConfigured() || process.env.VISA_REVIEW_OPEN !== 'true' || !reviewPaymentReady()) return false;
  if (process.env.VERCEL_ENV === 'production' && reviewPaymentEnvironment() !== 'live') return false;
  try {
    const {error} = await db().from('visa_review_cases').select('id,payment_consent,refund_resolved_at,refund_resolution_reason,refund_operations').limit(0);
    return !error;
  } catch {
    return false;
  }
}

export function digestReview(value: string) {
  const secret = process.env.VISA_REVIEW_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new ReviewError('Online intake is currently unavailable.', 503);
  return createHmac('sha256', secret).update(value).digest('hex');
}

const cookieName = 'kv_visa_review';
const sessionAge = 12 * 60 * 60;

export function setReviewSession(response: NextResponse, request: Request, email: string) {
  const payload = Buffer.from(JSON.stringify({email, exp: Math.floor(Date.now() / 1000) + sessionAge})).toString('base64url');
  response.cookies.set(cookieName, payload + '.' + digestReview('session:' + payload), {
    httpOnly: true, sameSite: 'lax', secure: new URL(request.url).protocol === 'https:',
    path: '/api/visa-review', maxAge: sessionAge,
  });
  return response;
}

export function reviewEmail(request: NextRequest) {
  const cookie = request.cookies.get(cookieName)?.value;
  if (!cookie || !reviewConfigured()) return null;
  const [payload, signature, ...rest] = cookie.split('.');
  if (!payload || !/^[a-f0-9]{64}$/.test(signature ?? '') || rest.length || payload.length > 512) return null;
  const expected = digestReview('session:' + payload);
  if (!timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof data.email === 'string' && data.exp >= Date.now() / 1000) return data.email as string;
  } catch { /* Expired or unreadable sessions require a new code. */ }
  return null;
}

export function requireReviewEmail(request: NextRequest) {
  const email = reviewEmail(request);
  if (!email) throw new ReviewError('Verify your email address to continue.', 401);
  return email;
}

export function reviewText(value: unknown, max: number, required = true) {
  if (value == null && !required) return '';
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) {
    throw new ReviewError('Check the required fields and text limits.');
  }
  return value.trim();
}

export function normalizeReviewEmail(value: unknown) {
  const email = reviewText(value, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ReviewError('Enter a valid email address.');
  return email;
}

export function reviewCaseId(value: unknown) {
  if (typeof value !== 'string' || !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(value)) {
    throw new ReviewError('Case unavailable.', 404);
  }
  return value;
}

export async function loadReviewCase(caseId: string, email?: string) {
  const query = db().from('visa_review_cases').select('*').eq('id', caseId);
  const {data, error} = await (email ? query.eq('email', email) : query).maybeSingle();
  if (error) throw error;
  if (!data) throw new ReviewError('Case unavailable.', 404);
  return data as ReviewCase;
}

export async function changeReviewCase(c: ReviewCase, changes: Partial<ReviewCase>) {
  const updatedAt = new Date(Math.max(Date.now(), Date.parse(c.updated_at) + 1)).toISOString();
  const {data, error} = await db().from('visa_review_cases')
    .update({...changes, updated_at: updatedAt})
    .eq('id', c.id).eq('status', c.status).eq('updated_at', c.updated_at).select('*').maybeSingle();
  if (error) throw error;
  return data as ReviewCase | null;
}

export async function transitionReviewCase(c: ReviewCase, changes: Partial<ReviewCase>) {
  const saved = await changeReviewCase(c, changes);
  if (!saved) throw new ReviewError('The case was updated. Refresh and try again.', 409);
  return saved;
}

export function publicReviewCase(c: ReviewCase) {
  const receipt = paymentTermsReceipt(c);
  const refundDecision = c.refund_resolved_at && c.refund_resolution_reason &&
    Date.parse(c.refund_resolved_at) >= Date.parse(c.refund_requested_at ?? '') &&
    !(c.refund_operations ?? []).some((operation) =>
      Date.parse(operation.requested_at) >= Date.parse(c.refund_resolved_at!)) &&
    ['paid', 'in_review', 'delivered', 'partially_refunded'].includes(c.status)
    ? {resolvedAt: c.refund_resolved_at, reason: c.refund_resolution_reason}
    : null;
  return {
    id: c.id, plan: c.plan, amountCents: c.amount_cents,
    status: c.status === 'capturing' ? 'checkout' : c.status === 'refunding' ? 'refund_requested' : c.status,
    deadlineAt: c.deadline_at, paidAt: c.paid_at, checkoutExpiresAt: c.checkout_expires_at,
    submittedAt: c.submitted_at, deliveredAt: c.delivered_at,
    agreement: receipt ? c.agreement + '\n\n' + receipt : c.agreement,
    result: c.delivered_at ? c.result : null,
    refundDecision,
    refundHistory: (c.refund_operations ?? []).map((operation) => ({
      id: operation.id, amountCents: operation.amount_cents, reason: operation.reason, status: operation.status,
      requestedAt: operation.requested_at, completedAt: operation.completed_at,
    })),
    totalRefundedCents: c.refund_operations?.length
      ? c.refund_operations.filter((operation) => operation.status === 'completed')
        .reduce((total, operation) => total + operation.amount_cents, 0)
      : c.status === 'refunded' ? c.amount_cents : 0,
  };
}

export function paymentTermsReceipt(c: ReviewCase) {
  const consent = c.payment_consent;
  if (!consent) return undefined;
  return [consent.terms, consent.version, consent.accepted_at].join('\n\n');
}

export async function sendReviewEmail(to: string, subject: string, text: string, idempotencyKey?: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(5000),
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json',
      ...(idempotencyKey ? {'Idempotency-Key': idempotencyKey} : {}),
    },
    body: JSON.stringify({from: fromAddress(), to, subject, text}),
  });
  if (!response.ok) throw new ReviewError('Email delivery is currently unavailable.', 502);
}

type ReviewEvent = 'submitted' | 'accepted' | 'declined' | 'paid' | 'delivered' | 'refund_requested' | 'refund_declined' | 'refunded';

export async function notifyReview(c: ReviewCase, event: ReviewEvent) {
  const subjects: Record<ReviewEvent, string> = {
    submitted: '비자 서면검토 새 접수',
    accepted: 'Visa review: payment is available / 비자 서면검토 결제 안내',
    declined: 'Visa review: intake update / 비자 서면검토 접수 안내',
    paid: '비자 서면검토 결제 확인',
    delivered: 'Visa review: your written result is ready / 비자 서면검토 완료',
    refund_requested: '비자 서면검토 환불 요청',
    refund_declined: 'Visa review: refund request update / 비자 서면검토 환불 요청 처리',
    refunded: 'Visa review: refund confirmed / 비자 서면검토 환불 완료',
  };
  const office = ['submitted', 'paid', 'refund_requested'].includes(event);
  const instructions = office
    ? '관리자 화면에서 확인하세요.\nhttps://koreavisalaw.com/admin/visa-review'
    : '확인한 이메일로 접속해 진행 상태를 확인하세요.\nSign in with your verified email to view the case.\n' + reviewOrigin + '/?lang=' + c.language;
  const latestRefund = c.refund_operations?.at(-1);
  const eventKey = event === 'refunded' && latestRefund
    ? event + '/' + latestRefund.id
    : (event === 'refund_requested' || event === 'refund_declined') && c.refund_requested_at
    ? event + '/' + c.refund_requested_at
    : event;
  const refundDetails = event === 'refunded' && latestRefund
    ? '\n\nUSD ' + (latestRefund.amount_cents / 100).toFixed(2) + '\n' + latestRefund.reason
    : '';
  try {
    await sendReviewEmail(office ? officeAddress()! : c.email, '[' + reviewOffice + '] ' + subjects[event],
      'Case / 접수번호 ' + c.id + '\n\n' + instructions + refundDetails, 'visa-review/' + c.id + '/' + eventKey);
    return undefined;
  } catch {
    return 'The case was saved, but the email could not be sent. Check its status here.';
  }
}

const agreements = {
  en: 'Email your case details and requested documents to info@kimnhyun.com with your case reference. The office confirms scope and complete materials before accepting payment. A Korean lawyer will deliver the agreed written review within 24 hours once complete materials and payment have both been confirmed. The review covers one applicant and the agreed issue and is limited to the facts and materials you provide. If information is insufficient, we explain what remains uncertain or what is needed. A visa application and representation require a separate engagement. The authorities decide approval. You can request cancellation or a refund online or by emailing the office with your case reference. Cancellations before work starts receive a full refund. Statutory withdrawal, refund and other remedies apply.',
  ko: '사건 설명과 필요한 서류는 접수번호와 함께 info@kimnhyun.com으로 보내 주세요. 사무소는 검토 범위와 필수자료 완비를 확인한 뒤 결제를 받습니다. 결제와 필수자료가 모두 확인된 때부터 한국 변호사가 24시간 안에 합의한 범위의 서면검토 결과를 전달합니다. 신청인 1명과 상품에 포함된 쟁점에 관하여 의뢰인이 제공한 사실과 자료의 범위에서 판단하며, 정보가 부족하면 확인이 어려운 부분과 필요한 자료를 안내합니다. 비자 신청 대행과 출입국 대리는 별도 계약이 필요하며 발급·허가 여부는 관할 기관이 결정합니다. 취소와 환불은 내 접수 내역에서 신청하거나 접수번호를 적어 사무소 이메일로 요청할 수 있습니다. 실제 착수 전 취소는 전액 환불하고 법정 청약철회·환불·구제 권리는 그대로 적용합니다.',
  zh: '请将案件说明和所需资料连同案件编号发送至 info@kimnhyun.com。律所确认审查范围及所需资料齐全后收款。确认款项和所需资料后，韩国执业律师于24小时内交付约定范围的书面意见。服务限一位申请人和约定事项，律师以您提供的事实和材料为判断依据。信息不足时，将说明待确认事项和所需资料。签证代办或代理需另行委托，是否审批由主管机关决定。您可以在案件页面或通过电子邮件提供案件编号申请取消或退款。审查实际开始前取消可获全额退款，法定撤回、退款及其他救济权利仍然有效。',
} satisfies Record<ReviewLanguage, string>;

export function reviewAgreement(language: ReviewLanguage, name: string, plan: ReviewPlan) {
  return [reviewOffice, reviewTermsVersion, agreements[language],
    'Plan / 상품: ' + plan + ' · USD ' + (reviewPlans[plan].amountCents / 100).toFixed(2),
    'Applicant / 신청인: ' + name].join('\n\n');
}
