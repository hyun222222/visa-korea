export const visaReviewHost = 'review.koreavisalaw.com';
export const visaReviewOrigin = `https://${visaReviewHost}`;

export const reviewMarkets = {
  mn: {label: 'Монгол', tag: 'mn', checkout: 'en'},
  en: {label: 'English', tag: 'en', checkout: 'en'},
  ne: {label: 'नेपाली', tag: 'ne', checkout: 'en'},
  zh: {label: '简体中文', tag: 'zh-Hans', checkout: 'zh'},
  tl: {label: 'Filipino', tag: 'tl', checkout: 'en'},
  vi: {label: 'Tiếng Việt', tag: 'vi', checkout: 'en'},
  km: {label: 'ខ្មែរ', tag: 'km', checkout: 'en'},
  ja: {label: '日本語', tag: 'ja', checkout: 'en'},
  th: {label: 'ไทย', tag: 'th', checkout: 'en'},
  id: {label: 'Bahasa Indonesia', tag: 'id', checkout: 'en'},
} as const;

export type ReviewMarket = keyof typeof reviewMarkets;
export const reviewMarketsInOrder = Object.keys(reviewMarkets) as ReviewMarket[];

export function isReviewMarket(value: unknown): value is ReviewMarket {
  return typeof value === 'string' && Object.hasOwn(reviewMarkets, value);
}

export function reviewMarketPath(locale: ReviewMarket) {
  return `/visa-review/${locale}`;
}

export function reviewMarketUrl(locale: ReviewMarket) {
  return `${visaReviewOrigin}${reviewMarketPath(locale)}`;
}

export const reviewMarketAlternates = Object.fromEntries([
  ...reviewMarketsInOrder.map(locale => [reviewMarkets[locale].tag, reviewMarketUrl(locale)]),
  ['x-default', reviewMarketUrl('en')],
]);
