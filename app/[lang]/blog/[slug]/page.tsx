import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, ChevronLeft, MessageCircle, ClipboardCheck } from "lucide-react";

export const dynamic = 'force-dynamic';
import {
    getCategoryById,
    type BlogBlock,
} from "@/lib/blog-posts";
import { getSupabasePostBySlug, getSupabasePosts } from "@/lib/blog-db";

const UI_TEXTS = {
    ko: {
        back: "블로그 목록으로",
        readMinutes: "분 분량",
        authorPrefix: "글 ·",
        ctaTitle: "본인 사례에 바로 대입해보세요",
        ctaDesc: "칼럼은 일반 가이드입니다. 실제 자격·서류·기한은 사례마다 다르므로, 자가 진단 도구로 본인 조건을 먼저 확인하시거나, 변호사에게 직접 상담하시는 것이 가장 안전합니다.",
        ctaDiag: "비자 가능성 진단받기",
        ctaWhatsapp: "WhatsApp 상담하기",
        relatedTitle: "같은 분야의 다른 글"
    },
    en: {
        back: "Back to Blog List",
        readMinutes: "min read",
        authorPrefix: "By",
        ctaTitle: "Apply Directly to Your Case",
        ctaDesc: "This column is a general guide. Actual requirements vary, so check your eligibility with our diagnostic tool or consult an attorney directly.",
        ctaDiag: "Check Visa Eligibility",
        ctaWhatsapp: "Chat via WhatsApp",
        relatedTitle: "Related Articles"
    },
    zh: {
        back: "返回专栏列表",
        readMinutes: "分钟阅读",
        authorPrefix: "作者 ·",
        ctaTitle: "结合您的实际案例进行评估",
        ctaDesc: "本专栏仅供参考。实际资格和申请材料因人而异，建议先使用在线评估工具或直接向律师咨询。",
        ctaDiag: "评估签证可能性",
        ctaWhatsapp: "WhatsApp 法律咨询",
        relatedTitle: "同类其他文章"
    },
    ja: {
        back: "コラム一覧に戻る",
        readMinutes: "分 読了",
        authorPrefix: "著者 ·",
        ctaTitle: "ご自身のケースで診断してみましょう",
        ctaDesc: "コラムは一般的な案内です。実際の要件は事例ごとに異なるため、適性診断ツールで確認するか、弁護士へ直接相談することをお勧めします。",
        ctaDiag: "ビザの可能性を診断する",
        ctaWhatsapp: "WhatsAppで相談する",
        relatedTitle: "関連コラム"
    }
};

const getCategoryLabel = (cat: any, lang: string) => {
    if (lang === 'en') return cat.labelEn;
    if (lang === 'zh') {
        const mapping: Record<string, string> = {
            investor: "投资签证",
            "f-residence": "在留与永住",
            corporate: "法人设立",
            "immigration-practice": "出入境实务",
            "case-analysis": "案例分析"
        };
        return mapping[cat.id] || cat.label;
    }
    if (lang === 'ja') {
        const mapping: Record<string, string> = {
            investor: "投資ビザ",
            "f-residence": "在留と永住",
            corporate: "法人設立",
            "immigration-practice": "出入国実務",
            "case-analysis": "事例分析"
        };
        return mapping[cat.id] || cat.label;
    }
    return cat.label; // ko
};

const supportedLangs = ["ko", "en", "zh", "ja"] as const;
type Lang = typeof supportedLangs[number];

interface RouteParams {
    params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
    try {
        const posts = await getSupabasePosts();
        const params: { lang: string; slug: string }[] = [];
        posts.forEach((post) => {
            if (post.slug.endsWith("-en")) {
                params.push({ lang: "en", slug: post.slug });
            } else if (post.slug.endsWith("-zh")) {
                params.push({ lang: "zh", slug: post.slug });
            } else if (post.slug.endsWith("-ja")) {
                params.push({ lang: "ja", slug: post.slug });
            } else {
                params.push({ lang: "ko", slug: post.slug });
            }
        });
        return params;
    } catch (e) {
        console.error("Error in generateStaticParams:", e);
        return [];
    }
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
    const { lang, slug } = await params;
    const post = await getSupabasePostBySlug(slug);
    if (!post) {
        return {
            title: "Not Found | Korea Visa Law",
        };
    }
    const cat = getCategoryById(post.category);
    const resolvedCatLabel = cat ? getCategoryLabel(cat, lang) : "";
    return {
        title: `${post.title} | Korea Visa Law Blog`,
        description: post.excerpt,
        keywords: post.keywords,
        alternates: { canonical: `/${lang}/blog/${post.slug}` },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://koreavisalaw.com/${lang}/blog/${post.slug}`,
            siteName: "Kim&Hyun Law Office",
            type: "article",
            publishedTime: post.publishedAt,
            authors: [post.author],
            tags: [resolvedCatLabel, ...post.keywords].filter(Boolean) as string[],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
        },
    };
}

export default async function BlogPostPage({ params }: RouteParams) {
    const { lang, slug } = await params;

    if (!supportedLangs.includes(lang as Lang)) {
        notFound();
    }

    const t = UI_TEXTS[lang as Lang];
    const post = await getSupabasePostBySlug(slug);
    if (!post) {
        notFound();
    }

    const category = getCategoryById(post.category);

    // Fetch related posts from database matching the same language and category
    const allPosts = await getSupabasePosts();
    const related = allPosts
        .filter((p) => {
            const sameCategory = p.category === post.category && p.slug !== post.slug;
            if (!sameCategory) return false;
            if (lang === "ko") {
                return !p.slug.endsWith("-en") && !p.slug.endsWith("-zh") && !p.slug.endsWith("-ja");
            } else {
                return p.slug.endsWith(`-${lang}`);
            }
        })
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
                            "@id": `https://koreavisalaw.com/${lang}/blog/${post.slug}`,
                        },
                        articleSection: category ? getCategoryLabel(category, lang) : undefined,
                        keywords: post.keywords.join(", "),
                    }),
                }}
            />

            {/* Back link */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    href={`/${lang}/blog`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {t.back}
                </Link>
            </div>

            {/* Article header */}
            <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mb-4">
                    {category && (
                        <Link
                            href={`/${lang}/blog`}
                            className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                            {getCategoryLabel(category, lang)}
                        </Link>
                    )}
                    <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readMinutes} {t.readMinutes}
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
                <p className="mt-6 text-lg text-slate-650 leading-relaxed border-l-4 border-blue-200 pl-4 text-slate-600">
                    {post.excerpt}
                </p>
                <p className="mt-6 text-sm text-slate-500">
                    {t.authorPrefix} {post.author}
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
                        {t.ctaTitle}
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        {t.ctaDesc}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/${lang}#calculators`}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
                        >
                            <ClipboardCheck className="h-5 w-5" />
                            {t.ctaDiag}
                        </Link>
                        <a
                            href="https://wa.me/821055346843"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                        >
                            <MessageCircle className="h-5 w-5" />
                            {t.ctaWhatsapp}
                        </a>
                    </div>
                </div>
            </section>

            {/* Related posts */}
            {related.length > 0 && (
                <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">
                        {t.relatedTitle}
                    </h2>
                    <ul className="divide-y divide-slate-200">
                        {related.map((rp) => (
                            <li key={rp.slug} className="py-5">
                                <Link
                                    href={`/${lang}/blog/${rp.slug}`}
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
