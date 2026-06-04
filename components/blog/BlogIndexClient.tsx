"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import {
    BLOG_CATEGORIES,
    getCategoryById,
    type BlogPost,
    type BlogCategoryId,
} from "@/lib/blog-posts";

interface Props {
    posts: BlogPost[];
    lang?: string;
}

type Filter = "all" | BlogCategoryId;

const UI_TEXTS = {
    ko: { all: "전체", readMinutes: "분 분량", readMore: "자세히 보기", empty: "해당 카테고리에 아직 등록된 글이 없습니다." },
    en: { all: "All", readMinutes: "min read", readMore: "Read details", empty: "No articles have been registered in this category yet." },
    zh: { all: "全部", readMinutes: "分钟阅读", readMore: "查看详情", empty: "该类别下暂无已发布的文章。" },
    ja: { all: "すべて", readMinutes: "分 読了", readMore: "詳細を見る", empty: "このカテゴリに登録されている記事はまだありません。" }
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

const getCategoryDesc = (cat: any, lang: string) => {
    const mapping: Record<string, Record<string, string>> = {
        ko: {
            investor: "D-8 기업투자, 외국인 투자 적격 심사, 자본금/송금 실무.",
            "f-residence": "거주비자 점수제, 영주권 요건, 장기체류 전환 전략.",
            corporate: "외국인 법인설립, FDI 신고, 정관/임원 구성 실무.",
            "immigration-practice": "심사 보완 요청, 거절 대응, 체류기간 연장, 재입국 허가.",
            "case-analysis": "실제 사건 진행 경과와 시사점."
        },
        en: {
            investor: "D-8 corporate investment, FDI screening, and remittance procedures.",
            "f-residence": "Points-based visa, permanent residency, and long-term residency strategies.",
            corporate: "Foreign incorporation, FDI declarations, and corporate governance.",
            "immigration-practice": "Request for supplements, denial remedies, extension of stay, and re-entry.",
            "case-analysis": "Actual case studies, resolutions, and key takeaways."
        },
        zh: {
            investor: "D-8公司投资、外国投资合规审查、资本金汇款实务。",
            "f-residence": "在留签证打分制、永住权条件、长期滞留转换策略。",
            corporate: "外国人法人设立、FDI申报、章程与高管设置实务。",
            "immigration-practice": "审查补交材料、拒签应对、延长滞留期限、再入境许可。",
            "case-analysis": "实际案件办理过程与启示。"
        },
        ja: {
            investor: "D-8企業投資、外国人投資の適格審査、資本金・送金の実務。",
            "f-residence": "在留ビザ点数制、永住権要件、長期滞在への変更戦略。",
            corporate: "外国人法人設立、FDI申告、定款・役員構成の実務。",
            "immigration-practice": "補完要求、発給拒否への対応、在留期間の延長、再入国許可。",
            "case-analysis": "実際の事件の進捗経過と教訓。"
        }
    };
    return mapping[lang]?.[cat.id] || cat.description;
};

export function BlogIndexClient({ posts, lang = "ko" }: Props) {
    const [filter, setFilter] = useState<Filter>("all");
    const ui = UI_TEXTS[lang as keyof typeof UI_TEXTS] || UI_TEXTS.ko;

    const visiblePosts = useMemo(
        () => (filter === "all" ? posts : posts.filter((p) => p.category === filter)),
        [filter, posts],
    );

    const activeCategoryDescription =
        filter !== "all" ? getCategoryDesc(getCategoryById(filter), lang) : undefined;

    // Resolve details path base: /blog/[slug] (implicit ko) or /[lang]/blog/[slug]
    const getPostLink = (slug: string) => {
        return lang === "ko" ? `/blog/${slug}` : `/${lang}/blog/${slug}`;
    };

    return (
        <>
            {/* Category chips */}
            <section className="border-b border-slate-200 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-wrap gap-2">
                        <CategoryChip
                            label={ui.all}
                            active={filter === "all"}
                            onClick={() => setFilter("all")}
                        />
                        {BLOG_CATEGORIES.map((cat) => (
                            <CategoryChip
                                key={cat.id}
                                label={getCategoryLabel(cat, lang)}
                                active={filter === cat.id}
                                onClick={() => setFilter(cat.id)}
                            />
                        ))}
                    </div>
                    {activeCategoryDescription && (
                        <p className="mt-3 text-sm text-slate-500">
                            {activeCategoryDescription}
                        </p>
                    )}
                </div>
            </section>

            {/* Post list */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {visiblePosts.length === 0 ? (
                    <p className="text-slate-500 text-center py-16">
                        {ui.empty}
                    </p>
                ) : (
                    <ul className="divide-y divide-slate-200">
                        {visiblePosts.map((post) => {
                            const cat = getCategoryById(post.category);
                            return (
                                <li key={post.slug} className="py-8 first:pt-0">
                                    <Link
                                        href={getPostLink(post.slug)}
                                        className="group block"
                                    >
                                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mb-3">
                                            {cat && (
                                                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                                                    {getCategoryLabel(cat, lang)}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatDate(post.publishedAt)}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {post.readMinutes}{ui.readMinutes}
                                            </span>
                                        </div>
                                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                                            {post.title}
                                        </h2>
                                        {post.titleEn && (
                                            <p className="mt-1 text-sm text-slate-500 italic">
                                                {post.titleEn}
                                            </p>
                                        )}
                                        <p className="mt-3 text-slate-650 leading-relaxed text-slate-600">
                                            {post.excerpt}
                                        </p>
                                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 group-hover:gap-2 transition-all">
                                            {ui.readMore}
                                            <ChevronRight className="h-4 w-4" />
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </>
    );
}

function CategoryChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={
                "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors " +
                (active
                     ? "bg-blue-600 text-white border-blue-600"
                     : "bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:text-blue-700")
            }
        >
            {label}
        </button>
    );
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
