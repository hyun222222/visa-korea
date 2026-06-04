import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-posts'

export const dynamic = 'force-static'

const SITE_URL = 'https://koreavisalaw.com'

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    const corePages: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${SITE_URL}/#about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/#calculators`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/#requirements`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/blog`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    const postPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    return [...corePages, ...postPages]
}
