"use client";

import { motion } from "framer-motion";
import { Mail, Sparkles } from "lucide-react";
import { RealTimeTicker } from "./RealTimeTicker";
import { SearchBar } from "./SearchBar";
import { CategoryChips } from "./CategoryChips";
import { ParticleBackground } from "./ParticleBackground";

interface HeroProps {
    onCreateCampaign?: () => void;
}

export function Hero({ onCreateCampaign }: HeroProps) {
    return (
        <section className="relative min-h-[95vh] flex flex-col overflow-hidden">
            {/* Real-Time Ticker at the very top */}
            <RealTimeTicker />

            {/* Main Hero Content */}
            <div className="flex-1 flex items-center justify-center relative">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                {/* Particle Background */}
                <ParticleBackground />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* BAROSO Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6"
                        >
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                            <span className="text-indigo-400 font-semibold text-sm tracking-wide uppercase">
                                BAROSO
                            </span>
                        </motion.div>

                        {/* Main Headline */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
                                혼자면 포기하지만,
                            </span>
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-blue-400 to-indigo-300 mt-2">
                                뭉치면 &apos;승소&apos;합니다
                            </span>
                        </h1>
                    </motion.div>

                    {/* Sub-headline with real-time data */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12"
                    >
                        <span className="block text-white font-semibold mb-2 text-xl md:text-2xl">
                            지금{" "}
                            <span className="text-indigo-400 font-mono font-bold">12,450명</span>의
                            원고가{" "}
                            <span className="text-emerald-400 font-mono font-bold">3,500억 원</span>의
                            권리를 찾고 있습니다
                        </span>
                        <span className="text-slate-500">
                            더 이상 참지 마세요. 당신의 편을 찾아보세요.
                        </span>
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mb-8"
                    >
                        <SearchBar />
                    </motion.div>

                    {/* Category Chips */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        <CategoryChips />
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onCreateCampaign?.();
                            }}
                            className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full font-semibold hover:from-indigo-500 hover:to-blue-500 transition-all hover:scale-105 shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2 text-lg"
                        >
                            <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                            내 사건 등록하고 동료 모으기
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const element = document.getElementById("categories");
                                element?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="px-8 py-4 bg-white/5 border-2 border-white/20 text-white rounded-full font-semibold hover:bg-white/10 hover:border-white/30 transition-all hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-2 text-lg"
                        >
                            진행 중인 소송 검색
                        </button>
                    </motion.div>

                    {/* Small trust indicator */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="mt-8 text-slate-600 text-sm"
                    >
                        변호사 선임 없이도 가능한 &apos;지급명령&apos;과 &apos;소액소송&apos;을 지원합니다
                    </motion.p>
                </div>

                {/* Floating Elements Animation */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-indigo-500/10 blur-3xl"
                            style={{
                                width: Math.random() * 400 + 200,
                                height: Math.random() * 400 + 200,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -50, 0],
                                x: [0, 30, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 10 + Math.random() * 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
