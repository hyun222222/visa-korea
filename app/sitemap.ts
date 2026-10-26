import {languages, visaOrigin, visaPublic, type Language} from '@/lib/brand';
import type {MetadataRoute} from 'next';
import {getSupabasePosts} from '@/lib/blog-db';
import {isD8Review, d8Updated} from '@/lib/d8-search';
export const revalidate = 3600;

function postLanguage(slug: string): Language {
  return languages.find(lang => lang !== 'ko' && slug.endsWith(`-${lang}`)) ?? 'ko';
}

function postUrl(slug: string) {
  const lang = postLanguage(slug);
  return `${visaOrigin}${lang === 'ko' ? '' : `/${lang}`}/blog/${slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!visaPublic) return [];
  const core = ['', '/investing-in-korea', '/medical-visa'].flatMap(path => languages.map(locale => ({
    url: `${visaOrigin}/${locale}${path}`,
    lastModified: path === '' || path === '/investing-in-korea' ? d8Updated : undefined,
    alternates: {languages: Object.fromEntries(languages.map(code => [code, `${visaOrigin}/${code}${path}`]))},
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
      lastModified: isD8Review(post.slug) ? d8Updated : undefined,
      // The data model exposes a publication date, not a verified modification date.
      alternates: {languages: Object.fromEntries(translations.map(([lang, slug]) => [lang, postUrl(slug)]))},
    };
  });
  const blogIndexes = languages.map(lang => ({
    url: `${visaOrigin}${lang === 'ko' ? '' : `/${lang}`}/blog`,
    lastModified: d8Updated,
    alternates: {languages: Object.fromEntries(languages.map(code => [code, `${visaOrigin}${code === 'ko' ? '' : `/${code}`}/blog`]))},
  }));
  return [
    ...core,
    ...['ko', 'en'].map(lang => ({
      url: `${visaOrigin}/${lang}/entry-refusal`,
      alternates: {languages: {ko: `${visaOrigin}/ko/entry-refusal`, en: `${visaOrigin}/en/entry-refusal`}},
    })),
    ...blogIndexes,
    ...postEntries,
  ];
}
