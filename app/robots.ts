import type {MetadataRoute} from 'next';
import {headers} from 'next/headers';
import {visaOrigin, visaPublic} from '@/lib/brand';
import {visaReviewOrigin} from '@/lib/visa-review-locales';

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!visaPublic) return {rules: {userAgent: '*', disallow: '/'}};
  if ((await headers()).get('x-kimhyun-review-host') === '1') {
    return {rules: {userAgent: '*', allow: '/', disallow: ['/admin', '/api/']}, sitemap: `${visaReviewOrigin}/sitemap.xml`};
  }

  return {
    // Search crawlers share the same public-page scope. This does not require
    // adding a separate permission for model-training crawlers.
    rules: {
      userAgent: ['*', 'Googlebot', 'Bingbot', 'Yeti', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User'],
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${visaOrigin}/sitemap.xml`,
  };
}
