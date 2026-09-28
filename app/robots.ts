import type {MetadataRoute} from 'next';
import {visaOrigin, visaPublic} from '@/lib/brand';

export default function robots(): MetadataRoute.Robots {
  if (!visaPublic) return {rules: {userAgent: '*', disallow: '/'}};

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
