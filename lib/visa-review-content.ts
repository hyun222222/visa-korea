export const reviewContentSlugs = [
  'f4-visa', 'e7-visa', 'e7-job-loss', 'd10-visa', 'visa-status-check',
  'visa-refusal', 'reentry', 'f2-7-visa', 'f5-visa', 'd8-visa',
] as const;

const contentFiles = new Map<string, string>([
  ['/ko', 'ko/index.html'],
  ...reviewContentSlugs.map((slug): [string, string] => [`/ko/${slug}`, `ko/${slug}/index.html`]),
  ['/assets/kvl.css', 'assets/kvl.css'],
  ['/robots.txt', 'robots.txt'],
  ['/sitemap.xml', 'sitemap.xml'],
  ['/llms.txt', 'llms.txt'],
]);

export function reviewContentFile(pathname: string) {
  const path = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const file = contentFiles.get(path);
  return file ? '/visa-review-content/' + file : null;
}

export function legacyReviewLanguage(pathname: string) {
  const path = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (path === '/ko/review') return 'ko';
  if (path === '/en/review') return 'en';
  return null;
}
