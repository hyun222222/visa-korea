"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { TrendingUp, Users, DollarSign } from "lucide-react";

interface StatItem {
    label: string;
    value: number;
    suffix: string;
    icon: typeof TrendingUp;
    color: string;
}

const STATS: StatItem[] = [
    {
        label: "현재 참여 중인 원고",
        value: 12450,
        suffix: "명",
        icon: Users,
        color: "from-blue-500 to-indigo-500",
    },
    {
        label: "찾고 있는 권리",
        value: 3500,
        suffix: "억 원",
        icon: DollarSign,
        color: "from-emerald-500 to-teal-500",
    },
    {
        label: "진행 중인 소송",
        value: 47,
        suffix: "건",
        icon: TrendingUp,
        color: "from-violet-500 to-purple-500",
    },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const animation = animate(count, target, {
            duration: 2,
            ease: "easeOut",
        });

        return animation.stop;
    }, [count, target]);

    useEffect(() => {
        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayValue(latest);
        });

        return () => unsubscribe();
    }, [rounded]);

    return (
        <span className="font-mono font-bold text-3xl md:text-4xl">
            {displayValue.toLocaleString()}
            <span className="text-2xl ml-1">{suffix}</span>
        </span>
    );
}

export function SocialProof() {
    return (
        <section className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        지금 이 순간에도
                    </h2>
                    <p className="text-slate-400 text-lg">
                        수많은 사람들이 바로소와 함께 권리를 찾고 있습니다
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STATS.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                        >
                            {/* Gradient Background */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`} />

                            <div className="relative bg-slate-900/90 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center">
                                <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${stat.color} bg-opacity-10 mb-4`}>
                                    <stat.icon className={`h-8 w-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} strokeWidth={2.5} />
                                </div>

                                <div className="mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                                    <Counter target={stat.value} suffix={stat.suffix} />
                                </div>

                                <p className="text-slate-400 font-medium">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Wins Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 p-6 bg-slate-900/50 backdrop-blur-sm border border-emerald-500/20 rounded-xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/20 rounded-full">
                            <span className="text-lg">🎉</span>
                        </div>
                        <h3 className="text-xl font-bold text-emerald-400">최근 승소 사례</h3>
                    </div>
                    <p className="text-slate-300">
                        <span className="font-semibold text-white">△△카드 개인정보 유출 소송</span>{" "}
                        집단소송 1심 승소! 원고 1,240명, 총 배상액 24억 원 인정
                    </p>
                    <p className="text-slate-500 text-sm mt-2">2024년 11월 승소</p>
                </motion.div>
            </div>
        </section>
    );
}
