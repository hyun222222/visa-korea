import { copy, plans, planPrice, type Language } from '@/app/visa-review/review-copy';
import { reviewSituations, situationPlans } from '@/app/visa-review/review-situations';

type Situation = keyof typeof situationPlans;

const situationsBySlug: ReadonlyMap<string, Situation> = new Map([
  ['d10-jobseeker', 'job-loss'],
  ['e7-skilled-worker', 'job-transfer'],
  ['d8-visa-guide', 'investment'],
  ['d8-investor-visa-basics', 'investment'],
  ['d8-visa-direct-incorporation-pitfalls', 'investment'],
  ['d8-visa-rejection-reasons', 'refusal'],
  ['f6-marriage-visa-refusal-reapplication', 'refusal'],
  ['responding-to-immigration-rfe-and-refusal', 'refusal'],
  ['f2-points-system', 'residence'],
  ['f2-points-system-core', 'residence'],
  ['f5-permanent-residency', 'residence'],
  ['f5-permanent-residence-checklist', 'residence'],
]);

const action = {
  ko: '익명 자가진단 시작',
  en: 'Start an anonymous self-assessment',
  zh: '开始匿名自测',
  ja: '匿名セルフチェックを始める（英語）',
};

export function VisaReviewCta({ slug, lang }: { slug: string; lang: Language | 'ja' }) {
  const situation = situationsBySlug.get(slug.replace(/-(en|zh|ja)$/, ''));
  if (!situation || process.env.VISA_REVIEW_OPEN !== 'true') return null;

  const plan = situationPlans[situation];
  const language = lang === 'ja' ? 'en' : lang;
  const details = reviewSituations[language][situation];

  return (
    <aside className="mx-auto max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <div lang={language}>
          <h2 className="font-semibold text-slate-900">{details.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{details.result}</p>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-900">{action[lang]}</p>
        <div className="mt-2 flex flex-wrap gap-2" lang={language}>
          {plans.map((option) => (
            <a key={option} hrefLang={language}
              href={`https://review.koreavisalaw.com/?lang=${language}&plan=${option}#diagnosis`}
              className={`inline-flex min-h-11 items-center rounded-md border border-slate-900 px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 ${option === plan ? 'bg-slate-900 text-white hover:bg-slate-700' : 'text-slate-900 hover:bg-slate-100'}`}>
              {copy[language].plan[option].title} · {'US$'}{planPrice[option]}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
