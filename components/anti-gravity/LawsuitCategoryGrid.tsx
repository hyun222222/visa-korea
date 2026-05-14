"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Home, Scale, Users, ChevronRight } from "lucide-react";

const CATEGORIES = [
    {
        id: "personal-info",
        title: "개인정보 유출",
        description: "해킹, 무단 공유로 인한 내 정보 유출 피해",
        icon: ShieldAlert,
        gradient: "from-rose-500/20 to-orange-500/20",
        border: "group-hover:border-rose-500/50",
        text: "group-hover:text-rose-400",
    },
    {
        id: "apartment",
        title: "아파트 하자",
        description: "균열, 누수, 결로 등 시공사 책임 하자",
        icon: Home,
        gradient: "from-emerald-500/20 to-teal-500/20",
        border: "group-hover:border-emerald-500/50",
        text: "group-hover:text-emerald-400",
    },
    {
        id: "state",
        title: "국가 배상",
        description: "공무원의 위법 행위나 영조물 하자로 인한 피해",
        icon: Scale,
        gradient: "from-blue-500/20 to-indigo-500/20",
        border: "group-hover:border-blue-500/50",
        text: "group-hover:text-blue-400",
    },
    {
        id: "consumer",
        title: "소비자 집단 피해",
        description: "기업의 부당 행위로 인한 다수의 소비자 피해",
        icon: Users,
        gradient: "from-violet-500/20 to-purple-500/20",
        border: "group-hover:border-violet-500/50",
        text: "group-hover:text-violet-400",
    },
];

export function LawsuitCategoryGrid() {
    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">소송 분야 찾기</h2>
                <p className="text-slate-400">어떤 피해를 입으셨나요? 해당되는 분야를 선택하세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {CATEGORIES.map((category, index) => (
                    <motion.button
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative flex flex-col items-start p-6 rounded-xl bg-slate-900/50 border border-white/5 hover:bg-slate-800/50 transition-all duration-300 text-left w-full"
                    >
                        {/* Gradient Background on Hover */}
                        <div
                            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        />

                        {/* Border Highlight */}
                        <div className={`absolute inset-0 rounded-xl border border-transparent ${category.border} transition-colors duration-300`} />

                        <div className="relative z-10 w-full">
                            <div className={`p-3 rounded-lg bg-slate-950/50 w-fit mb-4 ${category.text} transition-colors`}>
                                <category.icon className="h-6 w-6" />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
                                {category.title}
                            </h3>
                            <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-2 mb-4 h-10">
                                {category.description}
                            </p>

                            <div className="flex items-center text-xs font-medium text-slate-500 group-hover:text-white transition-colors">
                                자세히 보기 <ChevronRight className="h-3 w-3 ml-1" />
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
