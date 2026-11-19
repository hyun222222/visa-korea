import { copy, plans, planPrice, type Language, type Plan } from '@/app/visa-review/review-copy';
import { reviewSituations, situationPlans } from '@/app/visa-review/review-situations';
import { d8RemittanceGuideSlug, e7TerminationGuideSlug } from '@/lib/visa-practice-guides';

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

const directGuideOffers: Record<string, {language: 'en' | 'zh'; plan: Plan; title: string; detail: string; button: string}> = {
  [e7TerminationGuideSlug]: {
    language: 'en', plan: 'question',
    title: 'Ask a lawyer about your E-7 termination or D-10 application',
    detail: 'Describe one question in up to 600 characters. A lawyer will explain the relevant rule and a next step for your situation. Submit text only.',
    button: 'Start a written review',
  },
  [d8RemittanceGuideSlug]: {
    language: 'zh', plan: 'documents',
    title: '汇款前请律师核对D-8要件',
    detail: '提交一种签证方案及最多两份资料，合计不超过五页。律师将逐项列出已满足、尚未满足及需要确认的要件，并指出需要补充的证明。',
    button: '申请D-8书面核对',
  },
};

export function VisaReviewCta({ slug, lang }: { slug: string; lang: Language | 'ja' }) {
  if (process.env.VISA_REVIEW_OPEN !== 'true') return null;
  const offer = directGuideOffers[slug];
  if (offer?.language === lang) {
    return (
      <aside className="mx-auto max-w-3xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6" lang={offer.language}>
          <h2 className="font-semibold text-slate-900">{offer.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{offer.detail}</p>
          <a hrefLang={offer.language}
            href={`https://review.koreavisalaw.com/visa-review?lang=${offer.language}&plan=${offer.plan}#apply`}
            className="mt-4 inline-flex min-h-11 items-center rounded-md border border-slate-900 bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900">
            {offer.button} · {'US$'}{planPrice[offer.plan]}
          </a>
        </div>
      </aside>
    );
  }
  const situation = situationsBySlug.get(slug.replace(/-(en|zh|ja)$/, ''));
  if (!situation) return null;

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
