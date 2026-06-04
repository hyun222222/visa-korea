import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, ChevronLeft, MessageCircle, ClipboardCheck } from "lucide-react";
import {
    blogPosts,
    blogPostsSortedByDate,
    getPostBySlug,
    getCategoryById,
    type BlogBlock,
} from "@/lib/blog-posts";

// Required for `output: 'export'` — pre-render every post at build.
export async function generateStaticParams() {
    return blogPosts.map((post) => ({ slug: post.slug }));
}

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) {
        return {
            title: "찾을 수 없는 글 | Korea Visa Law",
        };
    }
    const cat = getCategoryById(post.category);
    return {
        title: `${post.title} | Korea Visa Law Blog`,
        description: post.excerpt,
        keywords: post.keywords,
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://koreavisalaw.com/blog/${post.slug}`,
            siteName: "Kim&Hyun Law Office",
            type: "article",
            publishedTime: post.publishedAt,
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
    const post = getPostBySlug(slug);
    if (!post) {
        notFound();
    }

    const category = getCategoryById(post.category);

    // Related posts: same category, exclude current, max 3
    const related = blogPostsSortedByDate
        .filter((p) => p.category === post.category && p.slug !== post.slug)
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
                        dateModified: post.publishedAt,
                        author: {
                            "@type": "Organization",
                            name: post.author,
                            url: "https://koreavisalaw.com",
                        },
                        publisher: {
                            "@type": "LegalService",
                            name: "Kim&Hyun Law Office",
                            url: "https://koreavisalaw.com",
                        },
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": `https://koreavisalaw.com/blog/${post.slug}`,
                        },
                        articleSection: category?.label,
                        keywords: post.keywords.join(", "),
                    }),
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
            </div>

            {/* CTA — Visa diagnosis + WhatsApp */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-10 shadow-lg">
                    <p className="text-xs font-semibold tracking-widest text-blue-300 uppercase mb-2">
                        Next step
                    </p>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                        본인 사례에 바로 대입해보세요
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        칼럼은 일반 가이드입니다. 실제 자격·서류·기한은 사례마다 다르므로,
                        자가 진단 도구로 본인 조건을 먼저 확인하시거나, 변호사에게 직접
                        상담하시는 것이 가장 안전합니다.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/#calculators"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
                        >
                            <ClipboardCheck className="h-5 w-5" />
                            비자 가능성 진단받기
                        </Link>
                        <a
                            href="https://wa.me/821055346843"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                        >
                            <MessageCircle className="h-5 w-5" />
                            WhatsApp 상담하기
                        </a>
                    </div>
                </div>
            </section>

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
