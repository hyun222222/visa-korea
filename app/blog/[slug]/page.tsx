import {visaOrigin, hubHref} from '@/lib/brand';
import {consultationCopy} from '@/lib/search-content-review';
import Link from "next/link";
import type { Metadata } from "next";
import { ArticleSources } from '@/components/blog/ArticleSources';
import { VisaReviewCta } from '@/components/blog/VisaReviewCta';
import { notFound, permanentRedirect } from "next/navigation";
import { Calendar, Clock, ChevronLeft, MessageCircle, Phone } from "lucide-react";

export const dynamic = 'force-dynamic';
import {
    getCategoryById,
    type BlogBlock,
} from "@/lib/blog-posts";
import { getSupabasePostBySlug, getSupabasePosts } from "@/lib/blog-db";
import {D8ConsultationGuide} from '@/components/blog/D8Guide';
import {isD8Review, d8Updated} from '@/lib/d8-search';

const postLanguage = (slug: string) => /-(en|zh|ja)$/.exec(slug)?.[1] ?? 'ko';
const canonicalPostPath = (slug: string) => `${postLanguage(slug) === 'ko' ? '' : `/${postLanguage(slug)}`}/blog/${slug}`;

async function getCanonicalPost(slug: string) {
    const post = await getSupabasePostBySlug(slug);
    if (!post) notFound();
    if (postLanguage(post.slug) !== 'ko') permanentRedirect(canonicalPostPath(post.slug));
    return post;
}

async function postAlternates(slug: string) {
    const posts = await getSupabasePosts();
    const baseSlug = slug.replace(/-(en|zh|ja)$/, '');
    return Object.fromEntries(posts
        .filter(post => post.slug.replace(/-(en|zh|ja)$/, '') === baseSlug)
        .map(post => [postLanguage(post.slug), `${visaOrigin}${canonicalPostPath(post.slug)}`]));
}

// Pre-render pages that exist in the database at build time.
// Other pages will be generated on-demand at runtime.
export async function generateStaticParams() {
    try {
        const posts = await getSupabasePosts();
        return posts.filter(post => postLanguage(post.slug) === 'ko').map((post) => ({ slug: post.slug }));
    } catch (e) {
        console.error("Error in generateStaticParams:", e);
        return [];
    }
}

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
    const { slug } = await params;
    const post = await getCanonicalPost(slug);
    const cat = getCategoryById(post.category);
    return {
        title: `${post.title} | 김앤현 법률사무소`,
        description: post.excerpt,
        keywords: post.keywords,
        alternates: { canonical: `/blog/${post.slug}`, languages: await postAlternates(post.slug) },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `${visaOrigin}/blog/${post.slug}`,
            siteName: "Kim&Hyun Law Office",
            type: "article",
            publishedTime: post.publishedAt,
            modifiedTime: post.modifiedAt ?? (isD8Review(post.slug) ? d8Updated : undefined),
            authors: [post.author],
            tags: [cat?.label, ...post.keywords].filter(Boolean) as string[],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
        },
    };
}

export default async function BlogPostPage({ params }: RouteParams) {
    const { slug } = await params;
    const post = await getCanonicalPost(slug);

    const category = getCategoryById(post.category);
    const consultation = consultationCopy(post.slug, 'ko');

    // Fetch related posts from database
    const allPosts = await getSupabasePosts();
    const related = allPosts
        .filter((p) => p.category === post.category && p.slug !== post.slug && postLanguage(p.slug) === 'ko')
        .slice(0, 3);

    return (
        <article className="bg-slate-50">
            {/* JSON-LD for individual article */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: post.title,
                        description: post.excerpt,
                        datePublished: post.publishedAt,
                        dateModified: post.modifiedAt ?? (isD8Review(post.slug) ? d8Updated : undefined),
                        citation: post.sources?.map(source => source.url),
                        inLanguage: 'ko',
                        author: {
                            "@type": "Organization",
                            name: post.author,
                            url: visaOrigin,
                        },
                        publisher: {
                            "@type": "LegalService",
                            name: "Kim&Hyun Law Office",
                            url: visaOrigin,
                        },
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": `${visaOrigin}/blog/${post.slug}`,
                        },
                        articleSection: category?.label,
                        keywords: post.keywords.join(", "),
                    }).replace(/</g, '\\u003c'),
                }}
            />

            {/* Back link */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    블로그 목록으로
                </Link>
            </div>

            {/* Article header */}
            <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mb-4">
                    {category && (
                        <Link
                            href="/blog"
                            className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                            {category.label}
                        </Link>
                    )}
                    <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readMinutes}분 분량
                    </span>
                </div>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                    {post.title}
                </h1>
                {post.titleEn && (
                    <p className="mt-3 text-base md:text-lg text-slate-500 italic">
                        {post.titleEn}
                    </p>
                )}
                <p className="mt-6 text-lg text-slate-600 leading-relaxed border-l-4 border-blue-200 pl-4">
                    {post.excerpt}
                </p>
                <p className="mt-6 text-sm text-slate-500">
                    글 · {post.author}
                </p>
            </header>

            {/* Article body */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="prose-like space-y-5">
                    {post.body.map((block, i) => (
                        <BlogBlockRenderer key={i} block={block} />
                    ))}
                </div>
                <ArticleSources post={post} />
            </div>

            <VisaReviewCta slug={post.slug} lang="ko" />
            {isD8Review(post.slug) && <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"><D8ConsultationGuide lang="ko"/></div>}

            {/* CTA — Visa diagnosis + WhatsApp */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-10 shadow-lg">
                    <p className="text-xs font-semibold tracking-widest text-blue-300 uppercase mb-2">
                        Next step
                    </p>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                        {consultation?.title ?? '신청 자료와 통지 내용을 함께 검토합니다'}
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        {consultation?.description ?? '현재 체류자격, 만료일과 투자·고용·가족 자료를 준비하세요. 상담 범위와 비용은 수임 전에 안내합니다.'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="tel:01055346843"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
                        >
                            <Phone className="h-5 w-5" />
                            전화 상담
                        </Link>
                        <a
                            href="https://open.kakao.com/o/saviVYPi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                        >
                            <MessageCircle className="h-5 w-5" />
                            카카오톡 상담
                        </a>
                    </div>
                </div>
            </section>

            <p className="max-w-3xl mx-auto px-4 pb-10 text-sm"><a className="underline" href={hubHref('lawyers/hyunjung/','ko')}>김현정 변호사 경력·자격 확인</a> · <a className="underline" href={hubHref('about/','ko')}>김앤현 법률사무소 소개</a></p>
            {/* Related posts */}
            {related.length > 0 && (
                <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">
                        같은 분야의 다른 글
                    </h2>
                    <ul className="divide-y divide-slate-200">
                        {related.map((rp) => (
                            <li key={rp.slug} className="py-5">
                                <Link
                                    href={`/blog/${rp.slug}`}
                                    className="group block"
                                >
                                    <h3 className="font-serif text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                        {rp.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                                        {rp.excerpt}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </article>
    );
}

function BlogBlockRenderer({ block }: { block: BlogBlock }) {
    switch (block.type) {
        case "h2":
            return (
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mt-10 leading-snug">
                    {block.text}
                </h2>
            );
        case "h3":
            return (
                <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900 mt-8 leading-snug">
                    {block.text}
                </h3>
            );
        case "p":
            return (
                <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                    {block.text}
                </p>
            );
        case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
                <ListTag
                    className={
                        "pl-6 space-y-2 text-base md:text-lg text-slate-700 leading-relaxed " +
                        (block.ordered ? "list-decimal" : "list-disc")
                    }
                >
                    {block.items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ListTag>
            );
        }
        case "callout":
            return (
                <aside className="my-6 rounded-xl border border-amber-200 bg-amber-50/70 p-5">
                    <p className="text-xs font-bold tracking-wider text-amber-800 uppercase mb-1">
                        {block.title}
                    </p>
                    <p className="text-slate-800 leading-relaxed">{block.text}</p>
                </aside>
            );
    }
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
