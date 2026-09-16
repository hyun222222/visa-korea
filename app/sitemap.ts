import {visaPublic} from '@/lib/brand';
import type {MetadataRoute} from 'next';
import {getSupabasePosts} from '@/lib/blog-db';
export const revalidate = 3600;
const origin = 'https://koreavisalaw.com';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!visaPublic) return [];
  const core = ['ko', 'en', 'zh', 'ja'].map(locale => ({
    url: `${origin}/${locale}`,
    alternates: {languages: Object.fromEntries(['ko', 'en', 'zh', 'ja'].map(code => [code, `${origin}/${code}`]))},
  }));
  // Anchors are page sections, not separate canonical URLs. Do not invent lastmod dates.
  const posts = await getSupabasePosts();
  return [...core, {url: `${origin}/blog`}, ...posts.map(post => ({url: `${origin}/blog/${post.slug}`}))];
}
