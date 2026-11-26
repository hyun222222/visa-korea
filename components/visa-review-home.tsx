import {visaPublic, type Language} from '@/lib/brand';
import {koreanGuideHubUrl} from '@/lib/visa-review-ko-topics';
import {reviewMarkets, reviewMarketsInOrder, reviewMarketUrl, visaReviewOrigin} from '@/lib/visa-review-locales';
import styles from './visa-review-home.module.css';

const copy = {
  ko: {
    title: '한국 비자 변호사 서면검토',
    description: '비자 불허, 이직·해고, 투자 서류 등 내 상황을 변호사에게 보내고 이메일로 서면 의견을 받습니다.',
    start: '한국어로 서면검토 신청',
    topics: '한국어 비자 주제 10편 보기',
    languages: '해외 고객용 서비스 안내',
    paymentLanguages: '신청 및 결제 약관은 한국어, 영어, 간체 중국어로 제공됩니다.',
  },
  en: {
    title: 'Korean visa written review',
    description: 'Send a question or documents about your Korean visa, job change or investment to a lawyer and receive a written reply by email.',
    start: 'View services and prices',
    languages: 'Service information in other languages',
    paymentLanguages: 'The application form and payment terms are available in Korean, English and Simplified Chinese.',
  },
  zh: {
    title: '韩国签证律师书面咨询',
    description: '如遇韩国签证被拒、换工作或投资材料等问题，可向律师提交有关情况，并通过电子邮件收到书面意见。',
    start: '查看服务和费用',
    languages: '多语言服务说明',
    paymentLanguages: '申请页面及付款条款提供韩语、英语和简体中文。',
  },
  ja: {
    title: '韓国ビザの弁護士による書面相談',
    description: '韓国のビザ不許可、転職、投資書類などについて弁護士に相談し、書面での回答をメールで受け取れます。',
    start: 'サービス内容と料金を見る',
    languages: '各言語のサービス案内',
    paymentLanguages: 'お申し込み画面と支払い条件は、韓国語・英語・簡体字中国語で確認できます。',
  },
} as const;

export function VisaReviewHome({lang}: {lang: Language}) {
  if (!visaPublic) return null;

  const text = copy[lang];
  const startUrl = lang === 'ko' ? `${visaReviewOrigin}/visa-review?lang=ko#apply` : reviewMarketUrl(lang);

  return (
    <section id="written-review" className={styles.section} aria-labelledby="written-review-heading">
      <div>
        <h2 id="written-review-heading">{text.title}</h2>
        <p>{text.description}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={startUrl}>{text.start}</a>
          {lang === 'ko' && <a className={styles.topics} href={koreanGuideHubUrl}>{copy.ko.topics}</a>}
        </div>
      </div>
      <nav className={styles.languages} aria-label={text.languages}>
        <h3>{text.languages}</h3>
        <ul>
          {reviewMarketsInOrder.map(locale => {
            const {tag, label} = reviewMarkets[locale];
            return <li key={locale}><a href={reviewMarketUrl(locale)} lang={tag} hrefLang={tag}>{label}</a></li>;
          })}
        </ul>
        <p>{text.paymentLanguages}</p>
      </nav>
    </section>
  );
}
