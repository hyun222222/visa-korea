import {visaPublic} from '@/lib/brand';
import type {MetadataRoute} from 'next';
import {getSupabasePosts} from '@/lib/blog-db';
export const revalidate = 3600;
const origin = 'https://koreavisalaw.com';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!visaPublic) return [];
  const locales = ['ko', 'en', 'zh', 'ja'];
  const core = ['', '/investing-in-korea', '/medical-visa'].flatMap(path => locales.map(locale => ({
    url: `${origin}/${locale}${path}`,
    alternates: {languages: Object.fromEntries(locales.map(code => [code, `${origin}/${code}${path}`]))},
  })));
  // Anchors are page sections, not separate canonical URLs. Do not invent lastmod dates.
  const posts = await getSupabasePosts();
  return [...core, {url: `${origin}/blog`}, ...posts.map(post => ({url: `${origin}/blog/${post.slug}`}))];
}
