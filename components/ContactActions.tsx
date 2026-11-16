import {labels, type Language} from '@/lib/brand';

export function ContactActions({lang}: {lang: Language}) {
  const t = {
    ko: ['전화 상담', '카카오톡 상담'], en: ['Call the office', 'KakaoTalk consultation'],
    zh: ['电话咨询', 'KakaoTalk咨询'], ja: ['電話で相談', 'KakaoTalkで相談'],
  }[lang];
  return <div className="my-5"><div className="flex flex-wrap gap-3">
    <a className="kh-button" href="tel:01055346843">{t[0]}</a>
    <a className="kh-button" href="https://open.kakao.com/o/saviVYPi" target="_blank" rel="noopener noreferrer">{t[1]}</a>
  </div><p className="mt-3 text-sm">{lang === 'ko' ? '010-5534-6843' : '+82 10-5534-6843'} · {labels[lang].notice}</p></div>;
}
