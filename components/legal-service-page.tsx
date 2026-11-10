import type {Language} from '@/lib/brand';

export type ServiceCopy = {lang:Language; title:string; intro:string; sections:[string,string][]; sources:[string,string][]};
const labels = {
  ko: ['의료비자 안내로', '근거 자료 · 2026.11.10 검토', '전화 상담', '카카오톡 상담', '상담 범위·비용과 자료 전달 방법을 먼저 안내합니다. 공개 판결 해설은 이 사무소의 수행·승소사례가 아닙니다.'],
  en: ['Medical visa guide', 'Sources · reviewed 10 November 2026', 'Call the office', 'KakaoTalk consultation', 'We explain the scope, fees and document-sharing arrangements first. Public-judgment commentary is not a claim of representation or a successful case by this firm.'],
  zh: ['医疗签证指南', '依据资料 · 2026.11.10审查', '电话咨询', 'KakaoTalk咨询', '先说明咨询范围、费用及资料提交方法。公开判决解说不代表本所承办或胜诉案例。'],
  ja: ['医療ビザ案内', '根拠資料 · 2026.11.10確認', '電話で相談', 'KakaoTalkで相談', '相談範囲・費用と資料の共有方法を先にご案内します。公開判決の解説は当事務所の受任・勝訴事例ではありません。'],
};
export function LegalServicePage({copy}:{copy:ServiceCopy}) {
  const t=labels[copy.lang];
  return <article className="kh-container max-w-4xl py-16">
    <a className="underline" href={`/${copy.lang}/medical-visa`}>← {t[0]}</a>
    <header className="py-10"><h1 className="font-serif text-3xl md:text-5xl leading-tight">{copy.title}</h1><p className="mt-6 text-lg text-slate-600 leading-relaxed">{copy.intro}</p></header>
    {copy.sections.map(([title,body])=><section key={title} className="bg-white border border-slate-200 rounded-xl p-7 mb-6"><h2 className="text-xl font-semibold mb-4">{title}</h2><p className="leading-relaxed text-slate-700">{body}</p></section>)}
    <aside className="border-t border-slate-200 pt-6"><h2 className="font-semibold">{t[1]}</h2><ul className="list-disc pl-5 my-4 space-y-2">{copy.sources.map(([title,url])=><li key={url}><a className="underline" href={url} target="_blank" rel="noopener noreferrer">{title}</a></li>)}</ul></aside>
    <section className="kh-note my-8"><p>{t[4]}</p><div className="flex flex-wrap gap-4 mt-4"><a className="kh-button" href="tel:+821055346843">{t[2]}</a><a className="kh-button" href="https://open.kakao.com/o/saviVYPi" target="_blank" rel="noopener noreferrer">{t[3]}</a></div></section>
  </article>;
}
