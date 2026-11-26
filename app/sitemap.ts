import {languages, visaOrigin, visaPublic, type Language} from '@/lib/brand';
import type {MetadataRoute} from 'next';
import {headers} from 'next/headers';
import {getSupabasePosts} from '@/lib/blog-db';
import {isD8Review, d8Updated} from '@/lib/d8-search';
import {reviewMarketAlternates, reviewMarketsInOrder, reviewMarketUrl} from '@/lib/visa-review-locales';
import {koreanGuideHubUrl, koreanReviewTopicSlugs, koreanReviewTopicUrl} from '@/lib/visa-review-ko-topics';
// Reflect a CMS publication/removal immediately; do not retain a build-time list.
export const dynamic = 'force-dynamic';

function postLanguage(slug: string): Language {
  return languages.find(lang => lang !== 'ko' && slug.endsWith(`-${lang}`)) ?? 'ko';
}

function postUrl(slug: string) {
  const lang = postLanguage(slug);
  return `${visaOrigin}${lang === 'ko' ? '' : `/${lang}`}/blog/${slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!visaPublic) return [];
  if ((await headers()).get('x-kimhyun-review-host') === '1') {
    // The guide source links, storefront guidance and public index changed in this revision.
    const discoveryRevision = '2026-11-25';
    return [
      {url: koreanGuideHubUrl, lastModified: discoveryRevision},
      ...reviewMarketsInOrder.map(locale => ({url: reviewMarketUrl(locale), lastModified: discoveryRevision, alternates: {languages: reviewMarketAlternates}})),
      ...koreanReviewTopicSlugs.map(slug => ({url: koreanReviewTopicUrl(slug), lastModified: discoveryRevision})),
    ];
  }
  const core = ['', '/investing-in-korea', '/medical-visa'].flatMap(path => languages.map(locale => ({
    url: `${visaOrigin}/${locale}${path}`,
    lastModified: path === '' || (path === '/medical-visa' && (locale === 'ko' || locale === 'en')) ? '2026-11-16' : '2026-11-10',
    alternates: {languages: {...Object.fromEntries(languages.map(code => [code, `${visaOrigin}/${code}${path}`])), 'x-default': `${visaOrigin}/en${path}`}},
  })));
  // Anchors are page sections, not separate canonical URLs. Do not invent lastmod dates.
  const posts = await getSupabasePosts();
  const publishedSlugs = new Set(posts.map(post => post.slug));
  const postEntries = posts.map(post => {
    const baseSlug = post.slug.replace(/-(en|zh|ja)$/, '');
    const translations = languages
      .map(lang => [lang, lang === 'ko' ? baseSlug : `${baseSlug}-${lang}`] as const)
      .filter(([, slug]) => publishedSlugs.has(slug));
    return {
      url: postUrl(post.slug),
      lastModified: post.modifiedAt ?? (isD8Review(post.slug) ? d8Updated : undefined),
      // Only documented editorial revisions receive a modification date.
      alternates: {languages: Object.fromEntries(translations.map(([lang, slug]) => [lang, postUrl(slug)]))},
    };
  });
  const blogIndexes = languages.map(lang => ({
    url: `${visaOrigin}${lang === 'ko' ? '' : `/${lang}`}/blog`,
    lastModified: lang === 'ko' || lang === 'en' ? '2026-11-16' : d8Updated,
    alternates: {languages: {...Object.fromEntries(languages.map(code => [code, `${visaOrigin}${code === 'ko' ? '' : `/${code}`}/blog`])), 'x-default': `${visaOrigin}/en/blog`}},
  }));
  return [
    ...core,
    {url: `${visaOrigin}/en/visa-refusal-remedy`},
    ...['ko/sns-medical-ad-compliance', 'ko/medical-visa-remedy', 'ko/attraction-registration', 'en/medical-visa-korea', 'zh/refund-dispute', 'ja/refund-dispute'].map(path => ({url: `${visaOrigin}/${path}`, lastModified: path.startsWith('ko/') ? '2026-11-16' : '2026-11-10'})),
    ...['ko', 'en'].map(lang => ({
      url: `${visaOrigin}/${lang}/entry-refusal`,
      alternates: {languages: {ko: `${visaOrigin}/ko/entry-refusal`, en: `${visaOrigin}/en/entry-refusal`, 'x-default': `${visaOrigin}/en/entry-refusal`}},
    })),
    ...blogIndexes,
    ...postEntries,
  ];
}
