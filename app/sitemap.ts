import { MetadataRoute } from 'next'
import { getSupabasePosts } from '@/lib/blog-db'

// Revalidate sitemap at most once an hour so newly published posts show up
// without requiring a fresh deploy.
export const revalidate = 3600

const SITE_URL = 'https://koreavisalaw.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

    let postPages: MetadataRoute.Sitemap = []
    try {
        const posts = await getSupabasePosts()
        postPages = posts.map((post) => ({
            url: `${SITE_URL}/blog/${post.slug}`,
            lastModified: new Date(post.publishedAt),
            changeFrequency: 'monthly',
            priority: 0.7,
        }))
    } catch (e) {
        // If Supabase is unreachable during build, sitemap still ships with core pages.
        console.error('sitemap: failed to load posts from Supabase, returning core pages only', e)
    }

    return [...corePages, ...postPages]
}
