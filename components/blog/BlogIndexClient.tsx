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
}

type Filter = "all" | BlogCategoryId;

export function BlogIndexClient({ posts }: Props) {
    const [filter, setFilter] = useState<Filter>("all");

    const visiblePosts = useMemo(
        () => (filter === "all" ? posts : posts.filter((p) => p.category === filter)),
        [filter, posts],
    );

    const activeCategoryDescription =
        filter !== "all" ? getCategoryById(filter)?.description : undefined;

    return (
        <>
            {/* Category chips */}
            <section className="border-b border-slate-200 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-wrap gap-2">
                        <CategoryChip
                            label="전체"
                            active={filter === "all"}
                            onClick={() => setFilter("all")}
                        />
                        {BLOG_CATEGORIES.map((cat) => (
                            <CategoryChip
                                key={cat.id}
                                label={cat.label}
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
                        해당 카테고리에 아직 등록된 글이 없습니다.
                    </p>
                ) : (
                    <ul className="divide-y divide-slate-200">
                        {visiblePosts.map((post) => {
                            const cat = getCategoryById(post.category);
                            return (
                                <li key={post.slug} className="py-8 first:pt-0">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="group block"
                                    >
                                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 mb-3">
                                            {cat && (
                                                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                                                    {cat.label}
                                                </span>
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
                                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                                            {post.title}
                                        </h2>
                                        {post.titleEn && (
                                            <p className="mt-1 text-sm text-slate-500 italic">
                                                {post.titleEn}
                                            </p>
                                        )}
                                        <p className="mt-3 text-slate-600 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 group-hover:gap-2 transition-all">
                                            전문 읽기
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
