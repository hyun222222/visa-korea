export type PaymentTermsLanguage = 'en' | 'ko' | 'zh';
export type PaymentConsentRecord = {
  version: string;
  language: PaymentTermsLanguage;
  accepted_at: string;
  terms: string;
};

const previousPaymentTermsVersion = 'visa-review-payment-2026-11-17-v1';
const secondPaymentTermsVersion = 'visa-review-payment-2026-11-17-v2';
const thirdPaymentTermsVersion = 'visa-review-payment-2026-11-18-v3';
export const paymentTermsVersion = 'visa-review-payment-2026-11-18-v4';

const thirdNoGuarantee = {
  en: 'I understand that I am purchasing a lawyer’s written review and legal advice based on the facts and materials I provide. This service does not guarantee a visa, permission to stay or a favourable decision. Applications, attendance and litigation require a separate agreement. The competent authorities make the final decision.',
  ko: '제공한 사실과 자료에 관한 변호사의 서면검토·법률자문 서비스를 구매함을 확인합니다. 이 서비스는 비자 발급, 체류허가 또는 유리한 처분을 보장하지 않습니다. 신청 대행·출석·소송은 별도 계약이 필요하며 최종 결정은 관할 기관이 합니다.',
  zh: '我确认购买的是律师根据我提供的事实和材料出具书面审查意见及法律咨询的服务。本服务不保证签证、居留许可或有利决定。申请代办、到场代理及诉讼须另行委托，最终决定由主管机关作出。',
} as const;

const previousNoGuarantee = {
  en: 'I understand that the written review does not guarantee a visa. The competent authorities decide whether to issue a visa.',
  ko: '서면검토가 비자 발급을 보장하지 않으며, 발급 여부는 관할 기관이 결정함을 확인합니다.',
  zh: '我确认书面审查不保证获发签证。是否签发签证由主管机关决定。',
} as const;

const previousGoverningLaw = {
  en: 'I agree to the written review terms. This agreement is governed by the law of the Republic of Korea. Any mandatory consumer protections that apply to me remain in effect.',
  ko: '서면검토 이용약관에 동의합니다. 이 계약에는 대한민국 법을 적용하며, 제게 적용되는 강행적 소비자 보호는 그대로 적용됩니다.',
  zh: '我同意书面审查服务条款。本合同适用大韩民国法律，适用于我的强制性消费者保护规定仍然有效。',
} as const;

export const paymentTerms = {
  en: {
    title: 'Required before payment',
    attention: 'Read and confirm each item before continuing to PayPal.',
    governingLaw: 'I agree to the written review terms. The review agreement and payment under it are governed by the law of the Republic of Korea. Any mandatory consumer protections that apply to me remain in effect.',
    startAndRefund: 'I request that the lawyer begin work immediately once payment and all required materials are confirmed. Once two hours have passed since payment was confirmed and the lawyer has actually started work, refunds for a change of mind may be limited where permitted by law.',
    noGuarantee: 'I understand that the written review does not guarantee a visa or permission to stay. The competent authorities make those decisions.',
    refundPolicy: 'We issue a full refund for cancellations requested before the lawyer starts work. Once two hours have passed since payment was confirmed and work has actually started, refunds for a change of mind may be limited where permitted by law. Statutory withdrawal, refund and other remedies remain available.',
    missingConsent: 'Confirm all three payment terms before continuing to PayPal.',
  },
  ko: {
    title: '결제 전 필수 확인',
    attention: 'PayPal로 이동하기 전에 각 항목을 읽고 직접 확인해 주세요.',
    governingLaw: '서면검토 이용약관에 동의합니다. 이 검토 계약과 그에 따른 대금 지급에 대한민국 법을 적용하며, 제게 적용되는 강행적 소비자 보호는 그대로 적용됩니다.',
    startAndRefund: '결제와 필수자료 확인 후 변호사의 즉시 착수를 요청합니다. 결제 확인 후 2시간이 지나고 변호사가 실제로 검토에 착수한 경우, 법이 허용하는 범위에서 단순 변심에 따른 환불이 제한될 수 있음을 확인합니다.',
    noGuarantee: '서면검토가 비자 발급이나 체류 허가를 보장하지 않으며, 그 여부는 관할 기관이 결정함을 확인합니다.',
    refundPolicy: '변호사가 검토에 착수하기 전에 취소를 요청하면 전액 환불합니다. 결제 확인 후 2시간이 지나고 실제로 검토에 착수한 경우, 법이 허용하는 범위에서 단순 변심에 따른 환불이 제한될 수 있습니다. 법정 청약철회·환불 및 기타 구제 권리는 그대로 적용됩니다.',
    missingConsent: 'PayPal로 이동하기 전에 결제 조건 세 가지를 모두 확인해 주세요.',
  },
  zh: {
    title: '付款前必须确认',
    attention: '前往 PayPal 前，请逐项阅读并确认。',
    governingLaw: '我同意书面审查服务条款。本审查合同及依据合同支付的款项适用大韩民国法律，适用于我的强制性消费者保护规定仍然有效。',
    startAndRefund: '我请求律师在确认收款及所需资料齐全后立即开始审查。自确认收款起满两小时且律师已实际开始审查后，因改变主意而申请退款可能在法律允许的范围内受到限制。',
    noGuarantee: '我确认书面审查不保证获发签证或居留许可，是否批准由主管机关决定。',
    refundPolicy: '在律师开始审查前提出取消申请，可获全额退款。自确认收款起满两小时且律师已实际开始审查后，因改变主意而申请退款可能在法律允许的范围内受到限制。法定撤回、退款及其他救济权利仍然有效。',
    missingConsent: '前往 PayPal 前，请确认全部三项付款条款。',
  },
} as const satisfies Record<PaymentTermsLanguage, Record<string, string>>;

export function isPaymentTermsLanguage(value: unknown): value is PaymentTermsLanguage {
  return value === 'en' || value === 'ko' || value === 'zh';
}

export function paymentTermsAcceptance(input: Record<string, unknown>) {
  const {language, termsVersion, koreanLaw, immediateReviewAndRefund, noVisaGuarantee} = input;
  if (!isPaymentTermsLanguage(language) || termsVersion !== paymentTermsVersion ||
    koreanLaw !== true || immediateReviewAndRefund !== true || noVisaGuarantee !== true) return null;
  return language;
}

export function paymentTermsSnapshot(language: PaymentTermsLanguage, version: string = paymentTermsVersion) {
  const {title, governingLaw, startAndRefund, noGuarantee, refundPolicy} = paymentTerms[language];
  const law = version === previousPaymentTermsVersion ? previousGoverningLaw[language] : governingLaw;
  const scope = version === previousPaymentTermsVersion || version === secondPaymentTermsVersion
    ? previousNoGuarantee[language] : version === thirdPaymentTermsVersion ? thirdNoGuarantee[language] : noGuarantee;
  return [title, law, startAndRefund, scope, refundPolicy].join('\n\n');
}

export function hasRecordedPaymentConsent(value: unknown): value is PaymentConsentRecord {
  if (!value || typeof value !== 'object') return false;
  const {version, language, accepted_at, terms} = value as Partial<PaymentConsentRecord>;
  return [paymentTermsVersion, previousPaymentTermsVersion, secondPaymentTermsVersion, thirdPaymentTermsVersion].includes(version ?? '') && isPaymentTermsLanguage(language) &&
    typeof accepted_at === 'string' && Date.parse(accepted_at) <= Date.now() &&
    terms === paymentTermsSnapshot(language, version);
}

type RefundRequestFacts = {
  paid_at?: string | null;
  started_at?: string | null;
  refund_requested_at?: string | null;
  payment_consent?: PaymentConsentRecord | null;
};

export function refundRestrictionConditionsMet({
  paid_at, started_at, refund_requested_at, payment_consent,
}: RefundRequestFacts) {
  if (!hasRecordedPaymentConsent(payment_consent)) return false;

  const acceptedAt = Date.parse(payment_consent.accepted_at);
  const paidAt = Date.parse(paid_at ?? '');
  const startedAt = Date.parse(started_at ?? '');
  const requestedAt = Date.parse(refund_requested_at ?? '');
  const twoHours = 2 * 60 * 60 * 1000;
  return acceptedAt <= paidAt && paidAt <= startedAt && startedAt <= requestedAt && requestedAt - paidAt >= twoHours;
}
