"use client";

import { useEffect, useState } from "react";

interface StatItem {
    label: string;
    value: number;
    suffix: string;
}

const STATS: StatItem[] = [
    { label: "참여 중인 원고", value: 12450, suffix: "명" },
    { label: "청구 권리액", value: 3500, suffix: "억 원" },
    { label: "진행 중인 사건", value: 47, suffix: "건" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
    const [value, setValue] = useState(target);

    useEffect(() => {
        const start = 0;
        const duration = 900;
        const startedAt = performance.now();
        let raf = 0;

        const tick = (t: number) => {
            const progress = Math.min((t - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(start + (target - start) * eased));
            if (progress < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target]);

    return (
        <span className="font-mono text-[#4a5ba3]">
            {value.toLocaleString()}
            <span className="text-base text-[#00074e]/60 ml-1 font-sans">{suffix}</span>
        </span>
    );
}

export function SocialProof() {
    return (
        <section className="w-full border-y border-[#d5e5ff] bg-[#f6f9ff]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="text-left">
                            <p className="text-sm text-[#00074e]/60 mb-2">{stat.label}</p>
                            <p className="text-3xl md:text-4xl font-bold tracking-tight">
                                <Counter target={stat.value} suffix={stat.suffix} />
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 pt-8 border-t border-[#d5e5ff]">
                    <p className="text-xs uppercase text-[#4a5ba3] mb-2 font-bold">
                        최근 진행 결과
                    </p>
                    <p className="text-[#00074e]">
                        <span className="font-bold">△△카드 개인정보 유출 집단소송</span>{" "}
                        1심 승소 — 원고 <span className="font-mono text-[#4a5ba3]">1,240명</span>,
                        인정 배상액 <span className="font-mono text-[#4a5ba3]">24억 원</span>
                        <span className="text-[#00074e]/60"> (2024년 11월)</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
