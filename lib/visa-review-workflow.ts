import 'server-only';
import {randomUUID} from 'node:crypto';
import {
  PayPalReviewError,
  captureReviewPayPalOrder,
  createReviewPayPalOrder,
  refundReviewPayPalCapture,
  reviewPaymentReady,
} from './visa-review-paypal';
import {
  changeReviewCase,
  loadReviewCase,
  notifyReview,
  paymentTermsReceipt,
  ReviewError,
  reviewOffice,
  reviewOrigin,
  reviewPaymentEnvironment,
  reviewPlans,
  sendReviewEmail,
  transitionReviewCase,
  type ReviewCase,
  type ReviewLanguage,
  type ReviewRefundOperation,
} from './visa-review-server';
import {hasRecordedPaymentConsent, isPaymentTermsLanguage, paymentTerms, paymentTermsAcceptance, paymentTermsSnapshot, paymentTermsVersion} from './visa-review-terms';

const day = 24 * 60 * 60 * 1000;
const paymentLease = 75_000;

function amountFor(c: ReviewCase) {
  const amount = reviewPlans[c.plan]?.amountCents;
  if (c.plan === 'question' && c.amount_cents === 5000) return c.amount_cents;
  if (!amount || c.amount_cents !== amount) throw new ReviewError('The case amount could not be verified.', 409);
  return amount;
}

function paymentEnvironment(c: ReviewCase) {
  const environment = reviewPaymentEnvironment();
  if (!reviewPaymentReady() || (process.env.VERCEL_ENV === 'production' && environment !== 'live')) {
    throw new ReviewError('Online payments are currently unavailable.', 503);
  }
  if (c.payment_environment && c.payment_environment !== environment) {
    throw new ReviewError('The original payment environment is required to process this case.', 409);
  }
  return environment;
}

function activeCheckout(c: ReviewCase) {
  if (c.status !== 'accepted' && c.status !== 'checkout') {
    throw new ReviewError('This case is not available for checkout.', 409);
  }
  const expires = Date.parse(c.checkout_expires_at ?? '');
  if (!c.accepted_at || !Number.isFinite(expires) || Date.now() >= expires) {
    throw new ReviewError('The checkout window has expired. Contact the office with your case reference.', 409);
  }
}

function checkoutUrls(c: ReviewCase, request: Request, language: ReviewLanguage) {
  const url = new URL(request.url);
  const base = new URL(url.origin);
  base.pathname = base.origin === reviewOrigin ? '/' : '/visa-review';
  base.searchParams.set('lang', language);
  base.searchParams.set('reviewCase', c.id);
  const returnUrl = base.toString();
  base.searchParams.set('cancelled', '1');
  return {returnUrl, cancelUrl: base.toString()};
}

export async function beginCheckout(c: ReviewCase, request: Request, input: Record<string, unknown>): Promise<{approvalUrl: string}> {
  const language = paymentTermsAcceptance(input);
  if (!language) {
    const fallback = isPaymentTermsLanguage(input.language) ? input.language : c.language;
    throw new ReviewError(paymentTerms[fallback].missingConsent, 422);
  }
  activeCheckout(c);
  if (process.env.VISA_REVIEW_OPEN !== 'true') throw new ReviewError('Online intake is currently unavailable.', 503);
  const amountCents = amountFor(c);
  const environment = paymentEnvironment(c);
  if (!hasRecordedPaymentConsent(c.payment_consent) || c.payment_consent.version !== paymentTermsVersion ||
    c.status === 'accepted' || !c.payment_environment) {
    // Terms and order belong together. Earlier checkout links must not carry a new consent.
    c = await transitionReviewCase(c, {
      status: 'checkout', payment_environment: environment,
      payment_consent: {
        version: paymentTermsVersion, language, accepted_at: new Date().toISOString(), terms: paymentTermsSnapshot(language),
      },
      payment_order_id: null, payment_approval_url: null,
    });
  }
  const consent = c.payment_consent;
  if (!hasRecordedPaymentConsent(consent)) {
    throw new ReviewError(paymentTerms[language].missingConsent, 409);
  }
  if (c.payment_order_id && c.payment_approval_url) return {approvalUrl: c.payment_approval_url};
  const {orderId, approvalUrl} = await createReviewPayPalOrder({
    ...checkoutUrls(c, request, consent.language),
    caseId: c.id,
    amountCents,
    idempotencyKey: consent.version + '/' + consent.accepted_at,
  });

  // A checkout link is exposed only for an order that was saved on this case.
  const saved = await changeReviewCase(c, {payment_order_id: orderId, payment_approval_url: approvalUrl});
  if (saved) return {approvalUrl};
  const current = await loadReviewCase(c.id);
  activeCheckout(current);
  if (current.payment_order_id && current.payment_approval_url && current.payment_environment === environment &&
    hasRecordedPaymentConsent(current.payment_consent) && current.payment_consent.accepted_at === consent.accepted_at) {
    return {approvalUrl: current.payment_approval_url};
  }
  throw new ReviewError('The checkout was updated. Refresh and try again.', 409);
}

const paidStatuses = ['paid', 'in_review', 'delivered', 'refund_requested', 'refunding', 'partially_refunded', 'refunded'];

async function sendPaidNotifications(c: ReviewCase) {
  const texts = {
    en: ['Visa review payment confirmed', 'Payment confirmed. Sign in with your verified email to see the review deadline.'],
    ko: ['비자 서면검토 결제 확인', '결제가 확인되었습니다. 인증한 이메일로 접속하면 검토 기한을 확인할 수 있습니다.'],
    zh: ['签证书面审查付款确认', '已确认付款。请使用已验证的邮箱登录查看审查截止时间。'],
  } as const;
  const language = c.payment_consent?.language ?? c.language;
  const [subject, message] = texts[language];
  const caseUrl = new URL('/', reviewOrigin);
  caseUrl.searchParams.set('lang', language);
  caseUrl.searchParams.set('reviewCase', c.id);
  await Promise.allSettled([
    notifyReview(c, 'paid'),
    sendReviewEmail(c.email, `[${reviewOffice}] ${subject}`, [message, c.deadline_at, caseUrl.toString(), c.agreement, paymentTermsReceipt(c)]
      .filter(Boolean).join('\n\n'), `visa-review/${c.id}/paid-customer`),
  ]);
}

function leaseIsActive(c: ReviewCase) {
  return Date.now() - Date.parse(c.updated_at) < paymentLease;
}

export async function captureCase(c: ReviewCase, orderId: string): Promise<ReviewCase> {
  if (!c.payment_order_id || orderId !== c.payment_order_id) {
    throw new ReviewError('This payment does not match the case.', 409);
  }
  if (paidStatuses.includes(c.status) && c.payment_capture_id) return c;
  const hasConsent = hasRecordedPaymentConsent(c.payment_consent);
  if (!hasConsent && c.status !== 'capturing') {
    throw new ReviewError(paymentTerms[c.language].missingConsent, 422);
  }
  if (c.status === 'capturing') {
    if (leaseIsActive(c)) throw new ReviewError('PayPal is checking this payment. Refresh in a moment.', 409);
  } else {
    if (c.status !== 'checkout') throw new ReviewError('This case is not available for payment.', 409);
    activeCheckout(c);
  }
  if (!c.payment_environment || !c.accepted_at) throw new ReviewError('The checkout setup could not be verified.', 409);
  const amountCents = amountFor(c);
  paymentEnvironment(c);
  c = await transitionReviewCase(c, {status: 'capturing'});

  let payment: Awaited<ReturnType<typeof captureReviewPayPalOrder>>;
  try {
    // Legacy captures can be reconciled, but cannot initiate a new charge without consent.
    payment = await captureReviewPayPalOrder({orderId, caseId: c.id, amountCents, existingOnly: !hasConsent});
  } catch (error) {
    if (error instanceof PayPalReviewError && error.code === 'not-approved') {
      await changeReviewCase(c, {status: 'checkout'});
      throw new ReviewError(hasConsent ? 'Approve the order in PayPal and try again.' : paymentTerms[c.language].missingConsent, 409);
    }
    if (error instanceof PayPalReviewError && error.code === 'capture-pending') {
      throw new ReviewError('PayPal has not confirmed the payment yet. Check again shortly.', 409);
    }
    throw error;
  }
  const paidAt = payment.capturedAt ?? new Date().toISOString();
  const completeAt = Math.max(Date.parse(c.accepted_at ?? paidAt), Date.parse(paidAt));
  const saved = await changeReviewCase(c, {
    status: 'paid',
    payment_capture_id: payment.captureId,
    paid_at: paidAt,
    deadline_at: new Date(completeAt + day).toISOString(),
  });
  if (saved) {
    await sendPaidNotifications(saved);
    return saved;
  }
  const current = await loadReviewCase(c.id);
  if (paidStatuses.includes(current.status) && current.payment_capture_id === payment.captureId) return current;
  throw new ReviewError('PayPal confirmed payment. Refresh to update the case.', 409);
}

async function refundLegacyCase(c: ReviewCase): Promise<ReviewCase> {
  if (c.status === 'refunded' && c.refund_id) return c;
  if (!['paid', 'in_review', 'delivered', 'refund_requested', 'refunding'].includes(c.status) ||
    !c.payment_order_id || !c.payment_capture_id || !c.payment_environment) {
    throw new ReviewError('This case does not have a verified payment to refund.', 409);
  }
  if (c.status === 'refunding' && leaseIsActive(c)) {
    if (c.refund_id) return c;
    throw new ReviewError('PayPal is processing the refund. Refresh in a moment.', 409);
  }
  const amountCents = amountFor(c);
  paymentEnvironment(c);
  const {id: caseId, payment_order_id: orderId, payment_capture_id: captureId} = c;
  c = await transitionReviewCase(c, {
    status: 'refunding',
    refund_requested_at: c.refund_requested_at ?? new Date().toISOString(),
  });
  const refund = await refundReviewPayPalCapture({orderId, captureId, caseId, amountCents, refundId: c.refund_id ?? undefined});
  if (refund.status === 'FAILED' || refund.status === 'CANCELLED') {
    return transitionReviewCase(c, {
      status: 'refund_requested', refund_id: refund.refundId,
      refund_operations: [{
        id: randomUUID(), amount_cents: amountCents, reason: 'Earlier full refund did not complete at PayPal.',
        status: 'failed', requested_at: c.refund_requested_at!, provider_id: refund.refundId, completed_at: null,
      }],
    });
  }
  const saved = await changeReviewCase(c, refund.status === 'COMPLETED'
    ? {status: 'refunded', refund_id: refund.refundId, refunded_at: new Date().toISOString()}
    : {refund_id: refund.refundId});
  if (saved) {
    if (saved.status === 'refunded') await notifyReview(saved, 'refunded');
    return saved;
  }
  const current = await loadReviewCase(c.id);
  if (current.refund_id === refund.refundId &&
    (current.status === 'refunded' || (current.status === 'refunding' && refund.status === 'PENDING'))) return current;
  throw new ReviewError('The refund status was updated. Refresh and try again.', 409);
}

export function completedRefundCents(c: ReviewCase) {
  if (!c.refund_operations?.length && c.status === 'refunded') return c.amount_cents;
  const total = (c.refund_operations ?? []).filter((item) => item.status === 'completed')
    .reduce((sum, item) => sum + item.amount_cents, 0);
  if (!Number.isSafeInteger(total) || total < 0 || total > c.amount_cents) {
    throw new ReviewError('The saved refund amounts need to be reconciled.', 409);
  }
  return total;
}

type RefundInstruction = {operationId: string; amountCents: number; reason: string; settlementConfirmed?: boolean; initiatedBy?: string};

export async function refundCase(c: ReviewCase, instruction?: RefundInstruction): Promise<ReviewCase> {
  const history = c.refund_operations ?? [];
  if (!instruction && !history.length) return refundLegacyCase(c);
  if (!c.payment_order_id || !c.payment_capture_id || !c.payment_environment) {
    throw new ReviewError('This case does not have a verified payment to refund.', 409);
  }
  const active = history.find((item) => item.status === 'requested' || item.status === 'pending');
  let operation = instruction ? history.find((item) => item.id === instruction.operationId) : active;
  if (operation && instruction &&
    (operation.amount_cents !== instruction.amountCents || operation.reason !== instruction.reason.trim())) {
    throw new ReviewError('The saved refund instruction has changed. Refresh before retrying.', 409);
  }
  if (operation?.status === 'completed' || operation?.status === 'failed') return c;
  if (c.status === 'refunding' && leaseIsActive(c)) {
    throw new ReviewError('PayPal is processing the saved refund. Refresh in a moment.', 409);
  }
  const amountCents = amountFor(c);
  const remaining = amountCents - completedRefundCents(c);
  // PayPal retains captured-payment refund request IDs for up to 45 days.
  const reconcileOnly = Boolean(operation &&
    Date.now() - Date.parse(operation.requested_at) >= 45 * day);
  if (!operation) {
    if (active || c.status === 'refunding' || !instruction ||
      !['paid', 'in_review', 'delivered', 'refund_requested', 'partially_refunded'].includes(c.status)) {
      throw new ReviewError('Resolve the existing refund before starting another refund.', 409);
    }
    const reason = instruction.reason.trim();
    if (!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(instruction.operationId) ||
      !Number.isSafeInteger(instruction.amountCents) || instruction.amountCents <= 0 ||
      instruction.amountCents > remaining || !reason || reason.length > 2_000) {
      throw new ReviewError('Enter a refund amount within the remaining balance and explain the calculation.', 422);
    }
    const startedBeforeRequest = c.started_at &&
      Date.parse(c.started_at) <= Date.parse(c.refund_requested_at ?? new Date().toISOString());
    if (!startedBeforeRequest && instruction.amountCents !== remaining) {
      throw new ReviewError('A cancellation before work starts requires a full refund.', 409);
    }
    if (instruction.amountCents < remaining && instruction.settlementConfirmed !== true) {
      throw new ReviewError('Confirm the customer agreed to the partial amount and to ending the engagement.', 422);
    }
    operation = {
      id: instruction.operationId, amount_cents: instruction.amountCents, reason,
      status: 'requested', requested_at: new Date().toISOString(), provider_id: null, completed_at: null,
      settlement_confirmed: instruction.settlementConfirmed === true,
      initiated_by: instruction.initiatedBy,
    };
  }
  paymentEnvironment(c);
  const selected = operation;
  const operations = history.some((item) => item.id === selected.id) ? history : [...history, selected];
  c = await transitionReviewCase(c, {
    status: 'refunding', refund_operations: operations,
    refund_requested_at: c.refund_requested_at ?? selected.requested_at,
  });
  const refund = await refundReviewPayPalCapture({
    orderId: c.payment_order_id!, captureId: c.payment_capture_id!, caseId: c.id, amountCents,
    refundAmountCents: selected.amount_cents, operationId: selected.id,
    refundId: selected.provider_id ?? undefined, reconcileOnly,
  });
  const updated: ReviewRefundOperation = {
    ...selected, provider_id: refund.refundId,
    status: refund.status === 'COMPLETED' ? 'completed' : refund.status === 'PENDING' ? 'pending' : 'failed',
    completed_at: refund.status === 'COMPLETED' ? new Date().toISOString() : null,
  };
  const updatedHistory = operations.map((item) => item.id === updated.id ? updated : item);
  const total = completedRefundCents({...c, refund_operations: updatedHistory});
  const saved = await changeReviewCase(c, {
    refund_operations: updatedHistory, refund_id: refund.refundId,
    status: refund.status === 'PENDING' ? 'refunding' : updated.status === 'failed'
      ? total > 0 ? 'partially_refunded' : 'refund_requested'
      : total === amountCents ? 'refunded' : 'partially_refunded',
    refunded_at: total === amountCents ? updated.completed_at : null,
  });
  if (saved) {
    if (updated.status === 'completed') await notifyReview(saved, 'refunded');
    return saved;
  }
  const current = await loadReviewCase(c.id);
  if (current.refund_operations?.some((item) => item.id === updated.id &&
    item.provider_id === updated.provider_id && item.status === updated.status)) return current;
  throw new ReviewError('The refund status was updated. Refresh before retrying.', 409);
}
