import type { Metadata } from "next";
import { getSupabasePosts } from "@/lib/blog-db";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { BLOG_CATEGORIES, BlogCategoryId } from "@/lib/blog-posts";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

const TRANSLATIONS = {
    ko: {
        title: "Korea Visa Law Blog | Immigration & Investment Insights — Kim&Hyun Law Office",
        description: "한국 비자·이민·법인설립 실무 칼럼. D-8 투자비자, F-2/F-5 거주·영주권, 외국인 법인설립, 출입국 거절·보완 대응 등 외국인 투자자와 한국 체류 외국인에게 필요한 법률 콘텐츠를 변호사가 직접 정리합니다.",
        badge: "Korea Visa Law · Insights",
        header: "한국 비자·이민 실무 칼럼",
        desc: "김앤현 법률사무소가 직접 정리하는 D-8 투자비자, F-2/F-5 거주·영주권, 외국인 법인설립, 출입국 실무 가이드. 현장에서 자주 보는 오해와 거절 사유를 사례 중심으로 풀어드립니다."
    },
    en: {
        title: "Korea Visa Law Blog | Immigration & Investment Insights — Kim&Hyun Law Office",
        description: "Korean visa, immigration, and company establishment practical columns. D-8 investor visa, F-2/F-5 residence & permanent residency, foreign corporate setup, and refusal remedies analyzed by attorneys.",
        badge: "Korea Visa Law · Insights",
        header: "Korea Visa & Immigration Column",
        desc: "Practical guides on D-8 investor visas, F-2/F-5 residency, foreign corporate registration, and immigration remedies written directly by Kim&Hyun Law Office."
    },
    zh: {
        title: "韩国签证与出入境实务专栏 | 金&贤律师事务所",
        description: "韩国签证、出入境、法人设立实务专栏。金&贤律师出入境合规律师为您梳理D-8投资签证、F-2/F-5在留与永住权、外国人法人设立及拒签救济实务。",
        badge: "Korea Visa Law · Insights",
        header: "韩国签证与出入境实务专栏",
        desc: "由金&贤律师事务所直接整理的D-8投资签证、F-2/F-5在留·永住权、外国人法人设立以及出入境实务指南。为您深度剖析实务中的常见误区与拒签应对方案。"
    },
    ja: {
        title: "韓国ビザ・出入国実務コラム | 金＆賢法律事務所",
        description: "韓国ビザ・出入国・法人設立の実務コラム。D-8投資ビザ、F-2/F-5在留・永住権、外国人法人設立、および発給拒否救済の実務について弁護士が直接解説します。",
        badge: "Korea Visa Law · Insights",
        header: "韓国ビザ・出入国実務コラム",
        desc: "金＆賢法律事務所が直接整理するD-8投資ビザ、F-2/F-5在留・永住権、外国人法人設立、および出入国管理の実務ガイド。現場でよくある誤解や発給拒否理由を事例中心に解説します。"
    }
};

const supportedLangs = ["ko", "en", "zh", "ja"] as const;
type Lang = typeof supportedLangs[number];

export default async function LocalizedBlogIndexPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const lang = resolvedParams.lang as Lang;

    if (!supportedLangs.includes(lang)) {
        notFound();
    }

    const t = TRANSLATIONS[lang];

    // Fetch and filter posts matching current language
    const allPosts = await getSupabasePosts();
    const filteredPosts = allPosts.filter((post) => {
        if (lang === "ko") {
            return !post.slug.endsWith("-en") && !post.slug.endsWith("-zh") && !post.slug.endsWith("-ja");
        } else {
            return post.slug.endsWith(`-${lang}`);
        }
    });

    return (
        <div className="bg-slate-50">
            {/* Page header */}
            <section className="border-b border-slate-200 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
                        {t.badge}
                    </p>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                        {t.header}
                    </h1>
                    <p className="mt-5 text-lg text-slate-650 leading-relaxed max-w-2xl text-slate-600">
                        {t.desc}
                    </p>
                </div>
            </section>

            <BlogIndexClient posts={filteredPosts} lang={lang} />
        </div>
    );
}

export function generateStaticParams() {
    return [
        { lang: "ko" },
        { lang: "en" },
        { lang: "zh" },
        { lang: "ja" }
    ];
}
