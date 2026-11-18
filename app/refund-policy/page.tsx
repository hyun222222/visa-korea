import type {Metadata} from 'next';
import {copy} from '../visa-review/review-copy';
import styles from '../visa-review/review.module.css';
import policy from './policy.module.css';
import {reviewBusinessRegistrationNumber, reviewOffice, reviewOrigin} from '@/lib/visa-review-server';
import {isPaymentTermsLanguage, paymentTerms} from '@/lib/visa-review-terms';

const policyUrl = `${reviewOrigin}/refund-policy`;
const details = {
  ko: {
    scope: '한국 비자 서면검토 서비스에 적용합니다.',
    conditions: '환불 기준',
    unable: '이해충돌이나 검토 범위 등의 이유로 사무소가 사건을 맡을 수 없는 경우 결제액 전액을 환불합니다.',
    statutory: '서비스가 표시·광고 또는 계약과 다르게 제공된 경우에는 법령상 청약철회와 환불을 요청할 수 있습니다. 이 정책은 법으로 보장되는 소비자의 권리를 제한하지 않습니다.',
    request: '환불 요청 방법',
    processing: '환불은 원칙적으로 처음 사용한 결제수단으로 처리합니다. 법정 청약철회에 따른 용역 대금은 청약철회한 날부터 3영업일 이내에 환급합니다. 카드사나 결제서비스에서 환불을 확인할 수 있는 시점은 결제수단에 따라 다를 수 있습니다.',
    service: '서면검토 접수',
  },
  en: {
    scope: 'This policy applies to our Korean visa written review services.',
    conditions: 'When a refund applies',
    unable: 'We refund your full payment if the office cannot take the case because of a conflict of interest, the scope of the review or a similar reason.',
    statutory: 'If the service differs from what was advertised or agreed, you may exercise your statutory withdrawal and refund rights. This policy does not limit any rights you have by law.',
    request: 'How to request a refund',
    processing: 'We generally refund the original payment method. Where Korean statutory withdrawal rules apply, we refund the service fee within three business days of withdrawal. The time for the refund to appear may vary by payment provider.',
    service: 'Written review',
  },
  zh: {
    scope: '本政策适用于韩国签证书面审查服务。',
    conditions: '退款条件',
    unable: '如因利益冲突、超出审查范围等原因本所无法承接案件，将全额退还已付款项。',
    statutory: '如服务与广告说明或合同约定不符，您可依照法律行使撤回和退款权利。本政策不限制您依法享有的消费者权利。',
    request: '退款申请方式',
    processing: '原则上退款将原路退回。适用韩国法定撤回规则时，服务费将在提出撤回之日起三个工作日内退还。具体到账时间因付款方式和支付机构而异。',
    service: '书面审查申请',
  },
} as const;

type Props = {searchParams: Promise<{lang?: string | string[]}>};

export async function generateMetadata({searchParams}: Props): Promise<Metadata> {
  const {lang} = await searchParams;
  const language = isPaymentTermsLanguage(lang) ? lang : 'ko';
  return {
    title: `${copy[language].refundTitle} | ${copy[language].firm}`,
    alternates: {canonical: language === 'ko' ? policyUrl : `${policyUrl}?lang=${language}`},
    robots: {index: false, follow: false},
  };
}

export default async function RefundPolicyPage({searchParams}: Props) {
  const {lang} = await searchParams;
  const language = isPaymentTermsLanguage(lang) ? lang : 'ko';
  const labels = copy[language];
  const content = details[language];
  const businessNumber = reviewBusinessRegistrationNumber();

  return (
    <div className={`${styles.site} ${policy.page}`}>
      <article className={policy.content} aria-labelledby="refund-title">
        <header className={policy.heading}>
          <a href={`/visa-review?lang=${language}#plans`}>{content.service}</a>
          <h1 id="refund-title">{labels.refundTitle}</h1>
          <p>{content.scope}</p>
        </header>
        <section className={policy.section}>
          <h2>{content.conditions}</h2>
          <p>{paymentTerms[language].refundPolicy}</p>
          <p>{content.unable}</p>
          <p>{content.statutory}</p>
        </section>
        <section className={policy.section}>
          <h2>{content.request}</h2>
          <p>{labels.refundInstructions}</p>
          <p><a href="mailto:info@kimnhyun.com">info@kimnhyun.com</a></p>
          <p>{content.processing}</p>
        </section>
        <footer className={styles.footer}>
          <strong>{reviewOffice}</strong>
          <span>{labels.representative}</span>
          {businessNumber && <span>{labels.businessNumber} {businessNumber}</span>}
          <span>서울특별시 서초구 법원로 16, 정곡빌딩 동관 502호</span>
          <span><a href="tel:+82234777600">02-3477-7600</a></span>
        </footer>
      </article>
    </div>
  );
}
