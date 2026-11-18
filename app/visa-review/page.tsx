import type { Metadata } from 'next';
import ReviewClient from './review-client';
import { copy, type Language, type Plan } from './review-copy';

type Params = {
  lang?: string | string[];
  plan?: string | string[];
  reviewCase?: string | string[];
  token?: string | string[];
  cancelled?: string | string[];
};

type Props = { searchParams: Promise<Params> };

function single(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : undefined;
}

function getLanguage(params: Params): Language {
  const value = single(params.lang);
  return value === 'ko' || value === 'zh' ? value : 'en';
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = getLanguage(await searchParams);
  const url = 'https://review.koreavisalaw.com';
  return {
    title: copy[lang].metaTitle,
    description: copy[lang].description,
    alternates: {
      canonical: lang === 'en' ? url : `${url}/?lang=${lang}`,
      languages: { en: url, ko: `${url}/?lang=ko`, 'zh-CN': `${url}/?lang=zh`, 'x-default': url },
    },
    robots: { index: false, follow: false },
  };
}

export default async function VisaReviewPage({ searchParams }: Props) {
  const params = await searchParams;
  const choice = single(params.plan);
  const plan: Plan = choice === 'documents' || choice === 'strategy' ? choice : 'question';
  return (
    <ReviewClient
      language={getLanguage(params)}
      initialPlan={plan}
      caseOnReturn={single(params.reviewCase)}
      orderOnReturn={single(params.token)}
      cancelledOnReturn={single(params.cancelled) === '1'}
    />
  );
}
