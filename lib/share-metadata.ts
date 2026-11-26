import type {Metadata} from 'next';
import {languages, visaOrigin, type Language} from './brand';
import {visaReviewHost} from './visa-review-locales';

type SharePage = {
  title: string;
  description: string;
  url: string;
  locale?: string;
  siteName?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
};

export function localizedAlternates(
  pathFor: (lang: Language) => string,
  locales: readonly Language[] = languages,
) {
  return Object.fromEntries([
    ...locales.map(lang => [lang, new URL(pathFor(lang), visaOrigin).href]),
    ['x-default', new URL(pathFor('en'), visaOrigin).href],
  ]);
}

export function blogIndexPath(lang: Language) {
  return lang === 'ko' ? '/blog' : `/${lang}/blog`;
}

const cards = {
  guide: {file: 'korea-visa-law', alt: 'Korea Visa Law · Kim & Hyun Law Office'},
  review: {file: 'korea-visa-review', alt: 'Korea visa written review · Kim Hyunjung Law Office'},
  e7: {file: 'e7-job-change-en', alt: 'E-7 job loss and D-10 status · Korea Visa Law'},
  d8: {file: 'd8-investment-zh', alt: '韩国 D-8 投资签证 · 汇款前的核对事项'},
};

export function shareMetadata({title, description, url, locale, siteName, article}: SharePage) {
  const canonical = new URL(url, visaOrigin);
  const review = canonical.hostname === visaReviewHost;
  const card = canonical.pathname === '/en/blog/e7-termination-d10-en' ? cards.e7
    : canonical.pathname === '/zh/blog/d8-visa-guide-zh' ? cards.d8
    : review ? cards.review : cards.guide;
  const images = [{
    url: new URL(`/share/${card.file}.png`, canonical).href,
    width: 1200, height: 630, alt: card.alt,
  }];
  const common = {
    title, description, images, url: canonical.href, locale,
    siteName: siteName ?? (review ? '김현정 법률사무소' : 'Korea Visa Law · Kim & Hyun'),
  };
  return {
    openGraph: article ? {type: 'article', ...common, ...article} : {type: 'website', ...common},
    twitter: {card: 'summary_large_image', title, description, images},
  } satisfies Pick<Metadata, 'openGraph' | 'twitter'>;
}
