import 'server-only';
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
  reviewIntakeFlagOpen,
  reviewMaterialsSubmissionEnabled,
  reviewPaymentEnvironment,
  reviewPlans,
  reviewBusinessRegistrationNumber,
  sendReviewEmail,
  transitionReviewCase,
  usesPayFirstReview,
  type ReviewCase,
  type ReviewLanguage,
} from './visa-review-server';
import {hasRecordedPaymentConsent, isPaymentTermsLanguage, paymentTerms, paymentTermsAcceptance, paymentTermsSnapshot, paymentTermsVersion} from './visa-review-terms';

export const reviewDayMs = 24 * 60 * 60 * 1000;
const paymentLease = 75_000;
const inactivePrice = 'This checkout uses an earlier price. Start a new request at the current price.';

function recordPaymentAttempt(
  c: ReviewCase,
  phase: 'create' | 'capture' | 'confirm-existing',
  outcome: 'attempted' | 'verified' | 'incomplete' | 'failed',
  error?: unknown,
) {
  const provider = error instanceof PayPalReviewError ? error : undefined;
  console.info('visa-review-payment', {
    phase, outcome, environment: c.payment_environment, plan: c.plan,
    ...(error !== undefined ? {reason: provider?.code ?? 'unexpected'} : {}),
    ...(provider?.providerStatus !== undefined ? {providerStatus: provider.providerStatus} : {}),
  });
}

function recordedPaymentAmount(c: ReviewCase) {
  if (!Number.isSafeInteger(c.amount_cents) || c.amount_cents <= 0) {
    throw new ReviewError('The case amount could not be verified.', 409);
  }
  return c.amount_cents;
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
  const payFirst = usesPayFirstReview(c);
  const entryStatus = payFirst ? 'submitted' : 'accepted';
  if (c.status !== entryStatus && c.status !== 'checkout') {
    throw new ReviewError('This case is not available for checkout.', 409);
  }
  const expires = Date.parse(c.checkout_expires_at ?? '');
  if ((!payFirst && !c.accepted_at) || !Number.isFinite(expires) || Date.now() >= expires) {
    throw new ReviewError('The checkout window has expired. Contact the office with your case reference.', 409);
  }
}

function hasIntakeConsent(c: ReviewCase) {
  if (!usesPayFirstReview(c)) return true;
  const consent = c.payment_consent?.intake;
  return consent?.agreement_version === c.terms_version &&
    consent.personal_data_processing === true && consent.overseas_transfer === true;
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

export async function beginCheckout(c: ReviewCase, request: Request, input: Record<string, unknown>) {
  const language = paymentTermsAcceptance(input);
  if (!language) {
    const fallback = isPaymentTermsLanguage(input.language) ? input.language : c.language;
    throw new ReviewError(paymentTerms[fallback].missingConsent, 422);
  }
  const payFirst = usesPayFirstReview(c);
  if (payFirst && (input.privacyConsent !== true || input.transferConsent !== true)) {
    throw new ReviewError('Confirm the personal data and overseas transfer notices.', 422);
  }
  activeCheckout(c);
  if (!reviewIntakeFlagOpen()) throw new ReviewError('Online intake is currently unavailable.', 503);
  if (!reviewBusinessRegistrationNumber()) {
    throw new ReviewError('Online checkout is unavailable until the office registration details are confirmed.', 503);
  }
  const amountCents = reviewPlans[c.plan]?.amountCents;
  if (!amountCents || c.amount_cents !== amountCents) throw new ReviewError(inactivePrice, 409);
  const environment = paymentEnvironment(c);
  if (!hasRecordedPaymentConsent(c.payment_consent) || !hasIntakeConsent(c) || c.payment_consent.version !== paymentTermsVersion ||
    c.status !== 'checkout' || !c.payment_environment) {
    // Terms and order belong together. Earlier checkout links must not carry a new consent.
    c = await transitionReviewCase(c, {
      status: 'checkout', payment_environment: environment,
      payment_consent: {
        version: paymentTermsVersion, language, accepted_at: new Date().toISOString(), terms: paymentTermsSnapshot(language),
        ...(payFirst ? {intake: {agreement_version: c.terms_version, personal_data_processing: true, overseas_transfer: true}} : {}),
      },
      payment_order_id: null, payment_approval_url: null,
    });
  }
  const consent = c.payment_consent;
  if (!hasRecordedPaymentConsent(consent)) {
    throw new ReviewError(paymentTerms[language].missingConsent, 409);
  }
  if (c.payment_order_id && c.payment_approval_url) {
    return {approvalUrl: c.payment_approval_url, orderId: c.payment_order_id, reviewCase: c};
  }
  recordPaymentAttempt(c, 'create', 'attempted');
  const {orderId, approvalUrl} = await createReviewPayPalOrder({
    ...checkoutUrls(c, request, consent.language),
    caseId: c.id,
    amountCents,
    idempotencyKey: consent.version + '/' + consent.accepted_at,
  }).catch(error => {
    recordPaymentAttempt(c, 'create', 'failed', error);
    throw error;
  });
  recordPaymentAttempt(c, 'create', 'verified');

  // A checkout link is exposed only for an order that was saved on this case.
  const saved = await changeReviewCase(c, {payment_order_id: orderId, payment_approval_url: approvalUrl});
  if (saved) return {approvalUrl, orderId, reviewCase: saved};
  const current = await loadReviewCase(c.id);
  activeCheckout(current);
  if (current.payment_order_id && current.payment_approval_url && current.payment_environment === environment &&
    current.amount_cents === amountCents &&
    hasRecordedPaymentConsent(current.payment_consent) && current.payment_consent.accepted_at === consent.accepted_at) {
    return {approvalUrl: current.payment_approval_url, orderId: current.payment_order_id, reviewCase: current};
  }
  throw new ReviewError('The checkout was updated. Refresh and try again.', 409);
}

const paidStatuses = ['paid', 'in_review', 'delivered', 'refund_requested', 'refunding', 'refunded'];

async function sendPaidNotifications(c: ReviewCase) {
  const texts = {
    en: {
      subject: 'Visa review payment confirmed',
      confirmed: 'Payment confirmed. Sign in with your verified email to see the review deadline.',
      submitMaterials: 'Return to the checkout tab to provide your question and materials.',
      emailMaterials: 'To email your question and any required documents, write to info@kimnhyun.com using the address you entered during payment. Put your case reference in the subject.',
      reviewClock: 'The written review is due within 24 hours after the office confirms your complete materials and accepts the engagement.',
      reference: 'Case reference',
      service: 'Review',
      amount: 'Amount',
      paidTime: 'Payment confirmed',
      captureId: 'PayPal payment reference',
      plans: {question: 'One written question', documents: 'Eligibility and documents', strategy: 'Written legal strategy'},
    },
    ko: {
      subject: '비자 서면검토 결제 확인',
      confirmed: '결제가 확인되었습니다. 인증한 이메일로 접속하면 검토 기한을 확인할 수 있습니다.',
      submitMaterials: '결제하신 탭으로 돌아가 질문과 자료를 제출해 주세요.',
      emailMaterials: '이메일로 제출하려면 결제 시 입력한 주소에서 info@kimnhyun.com으로 질문과 필요한 자료를 보내 주세요. 메일 제목에 접수번호를 적어 주세요.',
      reviewClock: '사무소가 필수 자료의 완비 여부를 확인하고 수임을 확정한 뒤 24시간 안에 서면으로 답변합니다.',
      reference: '접수번호',
      service: '검토 상품',
      amount: '금액',
      paidTime: '결제 확인 시각',
      captureId: 'PayPal 결제 확인번호',
      plans: {question: '질문 1건', documents: '요건·서류 검토', strategy: '복합 쟁점 검토'},
    },
    zh: {
      subject: '签证书面审查付款确认',
      confirmed: '已确认付款。请使用已验证的邮箱登录查看审查截止时间。',
      submitMaterials: '请返回付款页面并提交问题和资料。',
      emailMaterials: '如需通过电子邮件提交，请从您付款时输入的邮箱将问题和所需资料发送至 info@kimnhyun.com，并在邮件主题中注明案件编号。',
      reviewClock: '事务所确认材料齐全并接受委托后，将在24小时内提供书面意见。',
      reference: '案件编号',
      service: '审查服务',
      amount: '金额',
      paidTime: '付款确认时间',
      captureId: 'PayPal 付款编号',
      plans: {question: '一个书面问题', documents: '资格与文件审查', strategy: '复杂问题审查'},
    },
  } as const;
  const language = c.payment_consent?.language ?? c.language;
  const text = texts[language];
  const paidTime = c.paid_at && new Intl.DateTimeFormat(language === 'ko' ? 'ko-KR' : language === 'zh' ? 'zh-CN' : 'en-US', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Seoul',
  }).format(new Date(c.paid_at));
  const paymentDetails = usesPayFirstReview(c)
    ? [
      [
        `${text.reference} ${c.id}`,
        `${text.service} ${text.plans[c.plan]}`,
        `${text.amount} USD ${(c.amount_cents / 100).toFixed(2)}`,
        paidTime && `${text.paidTime} ${paidTime} KST`,
        `${text.captureId} ${c.payment_capture_id}`,
      ].filter(Boolean).join('\n'),
      reviewMaterialsSubmissionEnabled() ? text.submitMaterials : null,
      text.emailMaterials,
      text.reviewClock,
    ]
    : [text.confirmed, c.deadline_at];
  const caseUrl = new URL('/', reviewOrigin);
  caseUrl.searchParams.set('lang', language);
  caseUrl.searchParams.set('reviewCase', c.id);
  await Promise.allSettled([
    notifyReview(c, 'paid'),
    sendReviewEmail(c.email, `[${reviewOffice}] ${text.subject}`, [...paymentDetails, caseUrl.toString(), c.agreement, paymentTermsReceipt(c)]
      .filter(Boolean).join('\n\n'), `visa-review/${c.id}/paid-customer`),
  ]);
}

function leaseIsActive(c: ReviewCase) {
  return Date.now() - Date.parse(c.updated_at) < paymentLease;
}

export async function captureCase(c: ReviewCase, orderId: string, {existingOnly = false} = {}): Promise<ReviewCase> {
  if (!c.payment_order_id || orderId !== c.payment_order_id) {
    throw new ReviewError('This payment does not match the case.', 409);
  }
  if (paidStatuses.includes(c.status) && c.payment_capture_id) return c;
  const hasConsent = hasRecordedPaymentConsent(c.payment_consent) && hasIntakeConsent(c);
  if (!hasConsent && c.status !== 'capturing' && !existingOnly) {
    throw new ReviewError(paymentTerms[c.language].missingConsent, 422);
  }
  const wasCheckout = c.status === 'checkout';
  const expired = !(Date.parse(c.checkout_expires_at ?? '') > Date.now());
  if (c.status === 'capturing') {
    if (leaseIsActive(c)) throw new ReviewError('PayPal is checking this payment. Refresh in a moment.', 409);
  } else {
    if (!wasCheckout) throw new ReviewError('This case is not available for payment.', 409);
    if (!expired && !existingOnly) activeCheckout(c);
  }
  const payFirst = usesPayFirstReview(c);
  if (!c.payment_environment || (!payFirst && !c.accepted_at)) {
    throw new ReviewError('The checkout setup could not be verified.', 409);
  }
  const amountCents = recordedPaymentAmount(c);
  const hasCurrentPrice = amountCents === reviewPlans[c.plan]?.amountCents;
  const confirmOnly = existingOnly || expired || !hasConsent || !hasCurrentPrice;
  const phase = confirmOnly ? 'confirm-existing' : 'capture';
  paymentEnvironment(c);
  c = await transitionReviewCase(c, {status: 'capturing'});

  let payment: Awaited<ReturnType<typeof captureReviewPayPalOrder>>;
  recordPaymentAttempt(c, phase, 'attempted');
  try {
    payment = await captureReviewPayPalOrder({orderId, caseId: c.id, amountCents, existingOnly: confirmOnly});
  } catch (error) {
    const incomplete = error instanceof PayPalReviewError &&
      (error.code === 'not-approved' || error.code === 'capture-pending');
    recordPaymentAttempt(c, phase, incomplete ? 'incomplete' : 'failed', error);
    if (error instanceof PayPalReviewError && error.code === 'not-approved') {
      await changeReviewCase(c, {status: 'checkout'});
      if (!hasCurrentPrice) throw new ReviewError(inactivePrice, 409);
      if (expired) throw new ReviewError('The checkout window has expired and PayPal reports no completed payment.', 409);
      if (existingOnly) throw new ReviewError('PayPal has no completed payment to recover. Return to the original checkout or confirm the existing order there.', 409);
      throw new ReviewError(hasConsent ? 'Approve the order in PayPal and try again.' : paymentTerms[c.language].missingConsent, 409);
    }
    if (error instanceof PayPalReviewError && error.code === 'capture-failed') {
      await changeReviewCase(c, {status: 'checkout'});
      throw new ReviewError('PayPal declined the payment or could not capture it. Cancel this unpaid request before starting a new order.', 409);
    }
    if (error instanceof PayPalReviewError && error.code === 'capture-pending') {
      throw new ReviewError('PayPal has not confirmed the payment yet. Check again shortly.', 409);
    }
    if (confirmOnly && wasCheckout) await changeReviewCase(c, {status: 'checkout'});
    throw error;
  }
  recordPaymentAttempt(c, phase, 'verified');
  const paidAt = payment.capturedAt ?? new Date().toISOString();
  const deadlineAt = payFirst
    ? null
    : new Date(Math.max(Date.parse(c.accepted_at ?? paidAt), Date.parse(paidAt)) + reviewDayMs).toISOString();
  const saved = await changeReviewCase(c, {
    status: 'paid',
    payment_capture_id: payment.captureId,
    paid_at: paidAt,
    deadline_at: deadlineAt,
  });
  if (saved) {
    await sendPaidNotifications(saved);
    return saved;
  }
  const current = await loadReviewCase(c.id);
  if (paidStatuses.includes(current.status) && current.payment_capture_id === payment.captureId) return current;
  throw new ReviewError('PayPal confirmed payment. Refresh to update the case.', 409);
}

export async function refundCase(c: ReviewCase): Promise<ReviewCase> {
  const archived = (c as ReviewCase & {refund_operations?: unknown}).refund_operations;
  if (Array.isArray(archived) && archived.length) {
    throw new ReviewError('An earlier refund operation must be reconciled with PayPal before issuing another refund.', 409);
  }
  if (c.status === 'refunded' && c.refund_id) return c;
  if (!['paid', 'in_review', 'delivered', 'refund_requested', 'refunding'].includes(c.status) ||
    !c.payment_order_id || !c.payment_capture_id || !c.payment_environment) {
    throw new ReviewError('This case does not have a verified payment to refund.', 409);
  }
  if (c.status === 'refunding' && leaseIsActive(c)) {
    if (c.refund_id) return c;
    throw new ReviewError('PayPal is processing the refund. Refresh in a moment.', 409);
  }
  const amountCents = recordedPaymentAmount(c);
  paymentEnvironment(c);
  const {id: caseId, payment_order_id: orderId, payment_capture_id: captureId} = c;
  c = await transitionReviewCase(c, {
    status: 'refunding',
    refund_requested_at: c.refund_requested_at ?? new Date().toISOString(),
  });
  const refund = await refundReviewPayPalCapture({orderId, captureId, caseId, amountCents, refundId: c.refund_id ?? undefined});
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
