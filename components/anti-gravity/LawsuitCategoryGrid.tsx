"use client";

import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
    {
        id: "personal-info",
        title: "개인정보 유출",
        description: "해킹·무단 공유 등 정보 유출 피해. 법정손해배상 청구 가능.",
        href: "#leak-diagnosis",
    },
    {
        id: "apartment",
        title: "아파트 하자",
        description: "균열·누수·결로 등 시공사 책임 하자. 담보 책임 기간 내 청구.",
        href: "#diagnosis",
    },
    {
        id: "state",
        title: "국가 배상",
        description: "공무원의 위법 행위·영조물 하자. 배상심의회 또는 정식 소송.",
        href: "#state-liability",
    },
    {
        id: "consumer",
        title: "소비자 집단 피해",
        description: "기업의 부당 행위로 다수가 입은 피해. 환불·해지·손해배상.",
        href: "#consumer-diagnosis",
    },
];

export function LawsuitCategoryGrid() {
    return (
        <div className="w-full">
            <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-[#00074e] mb-2">
                    소송 분야
                </h2>
                <p className="text-[#00074e]/70">
                    어떤 피해를 입으셨나요? 해당되는 분야를 선택하세요.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#d5e5ff] border border-[#d5e5ff] rounded-lg overflow-hidden">
                {CATEGORIES.map((category) => (
                    <a
                        key={category.id}
                        href={category.href}
                        className="group bg-white p-7 hover:bg-[#f6f9ff] transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-[#00074e] mb-1.5">
                                    {category.title}
                                </h3>
                                <p className="text-sm text-[#00074e]/70 leading-relaxed">
                                    {category.description}
                                </p>
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-[#4a5ba3]/60 group-hover:text-[#4a5ba3] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
