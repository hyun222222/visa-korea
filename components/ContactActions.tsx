import {labels, type Language} from '@/lib/brand';
import {planPrice} from '@/app/visa-review/review-copy';
import {visaReviewOrigin} from '@/lib/visa-review-locales';

const questionLabels = {
  ko: '비자 질문 한 가지 서면검토',
  en: 'Ask a visa lawyer one question',
  zh: '请律师书面解答一个签证问题',
  ja: 'ビザの質問を1件申し込む（英語）',
};

export function ContactActions({lang, showWrittenReview = false}: {lang: Language; showWrittenReview?: boolean}) {
  const t = {
    ko: ['전화 상담', '카카오톡 상담'], en: ['Call the office', 'KakaoTalk consultation'],
    zh: ['电话咨询', 'KakaoTalk咨询'], ja: ['電話で相談', 'KakaoTalkで相談'],
  }[lang];
  const checkoutLanguage = lang === 'ja' ? 'en' : lang;
  return <div className="my-5"><div className="flex flex-wrap gap-3">
    {showWrittenReview && <a className="kh-button" hrefLang={checkoutLanguage}
      href={`${visaReviewOrigin}/visa-review?lang=${checkoutLanguage}&plan=question#apply`}>
      {questionLabels[lang]} · US${planPrice.question}
    </a>}
    <a className="kh-button" href="tel:+821055346843">{t[0]}</a>
    <a className="kh-button" href="https://open.kakao.com/o/saviVYPi" target="_blank" rel="noopener noreferrer">{t[1]}</a>
  </div><p className="mt-3 text-sm">{lang === 'ko' ? '010-5534-6843' : '+82 10-5534-6843'} · {labels[lang].notice}</p></div>;
}
