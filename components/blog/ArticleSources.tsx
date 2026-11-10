import type { BlogPost } from '@/lib/blog-posts';

const labels = {
  ko: ['검토한 판결·공식 자료', '내용 수정일', '공개 판결 해설은 김앤현의 수행·승소사례와 구별합니다. 신청 시점의 기준과 개별 사실관계를 함께 확인하세요.'],
  en: ['Judgments and official sources', 'Content revised', 'Public-judgment commentary is not a claim of representation or a successful case by this firm. Check the rules at the time of application and the individual facts.'],
  zh: ['判决与官方资料', '内容修订日期', '公开判决解说不代表本所承办或胜诉案例。请同时核对申请时的标准与个别事实。'],
  ja: ['判決・公式資料', '内容改訂日', '公開判決の解説は当事務所の受任・勝訴事例とは異なります。申請時の基準と個別の事実関係を確認してください。'],
};
export function ArticleSources({post, lang = 'ko'}: {post: BlogPost; lang?: string}) {
  if (!post.sources?.length) return null;
  const t = labels[lang as keyof typeof labels] ?? labels.ko;
  return <aside className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-600" aria-label={t[0]}>
    <h2 className="font-semibold text-slate-900">{t[0]}</h2>
    <p className="mt-2">{t[1]}: <time dateTime={post.modifiedAt}>{post.modifiedAt}</time></p>
    <ul className="mt-3 list-disc pl-5 space-y-2">{post.sources.map(source => <li key={source.url}>
      <a className="underline underline-offset-4 hover:text-blue-700" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
    </li>)}</ul>
    <p className="mt-4">{t[2]}</p>
  </aside>;
}
