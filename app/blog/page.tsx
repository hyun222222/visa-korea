import type { Metadata } from "next";
import { blogPostsSortedByDate } from "@/lib/blog-posts";
import { BlogIndexClient } from "@/components/blog/BlogIndexClient";

export const metadata: Metadata = {
    title: "Korea Visa Law Blog | Immigration & Investment Insights — Kim&Hyun Law Office",
    description:
        "한국 비자·이민·법인설립 실무 칼럼. D-8 투자비자, F-2/F-5 거주·영주권, 외국인 법인설립, 출입국 거절·보완 대응 등 외국인 투자자와 한국 체류 외국인에게 필요한 법률 콘텐츠를 변호사가 직접 정리합니다.",
    keywords: [
        "한국 비자 블로그",
        "한국 이민 변호사 블로그",
        "D-8 투자비자",
        "F-2 비자",
        "F-5 영주권",
        "외국인 법인설립",
        "Korea visa blog",
        "Korea immigration lawyer blog",
        "Seoul immigration attorney",
    ],
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "Korea Visa Law Blog — Kim&Hyun Law Office",
        description:
            "한국 비자·이민·법인설립 실무를 변호사가 직접 정리하는 법률 칼럼.",
        url: "https://koreavisalaw.com/blog",
        siteName: "Kim&Hyun Law Office",
        type: "website",
    },
};

export default function BlogIndexPage() {
    return (
        <div className="bg-slate-50">
            {/* Page header */}
            <section className="border-b border-slate-200 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-3">
                        Korea Visa Law · Insights
                    </p>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                        한국 비자·이민 실무 칼럼
                    </h1>
                    <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-2xl">
                        김앤현 법률사무소가 직접 정리하는 D-8 투자비자, F-2/F-5 거주·영주권,
                        외국인 법인설립, 출입국 실무 가이드. 현장에서 자주 보는
                        오해와 거절 사유를 사례 중심으로 풀어드립니다.
                    </p>
                </div>
            </section>

            <BlogIndexClient posts={blogPostsSortedByDate} />
        </div>
    );
}
