import type {Language} from '@/lib/brand';

const guides = [
  ['d8-visa-guide', 'D-8 · 투자 구조와 자금', 'D-8 · Investment and funds', 'D-8 · 投资与资金', 'D-8 · 投資と資金'],
  ['f2-points-system', 'F-2-7 · 신청 대상과 점수', 'F-2-7 · Category and points', 'F-2-7 · 类别与积分', 'F-2-7 · 区分と点数'],
  ['f5-permanent-residency', 'F-5 · 영주 요건과 자료', 'F-5 · Permanent residence evidence', 'F-5 · 永住条件与资料', 'F-5 · 永住要件と資料'],
  ['e7-skilled-worker', 'E-7-4 · 고용 요건', 'E-7-4 · Employment conditions', 'E-7-4 · 雇用条件', 'E-7-4 · 雇用条件'],
];
export function VisaReviewLinks({lang}:{lang:Language}) {
  const index={ko:1,en:2,zh:3,ja:4}[lang];
  return <ul className="grid gap-4 sm:grid-cols-2">{guides.map(g=><li key={g[0]}><a className="block rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-500" href={`${lang==='ko'?'':`/${lang}`}/blog/${g[0]}${lang==='ko'?'':`-${lang}`}`}>{g[index]} ↗</a></li>)}</ul>;
}
