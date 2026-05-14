"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, Check } from "lucide-react";

export function LeakClaimFlow() {
    const [loading, setLoading] = useState(false);
    const [isDelegated, setIsDelegated] = useState(false);

    const handleDelegate = () => {
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoading(false);
            setIsDelegated(true);
        }, 1500);
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
            <div className="space-y-8">

                <div className="bg-slate-950 rounded-xl p-6 space-y-4 border border-white/5">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <span className="text-slate-400">대상 사건</span>
                        <span className="text-white font-medium">A 쇼핑몰 해킹 (2024)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <span className="text-slate-400">예상 법정 손해배상액</span>
                        <span className="text-indigo-400 font-bold text-xl">300,000 원</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400">법적 근거</span>
                        <span className="text-slate-500 text-sm">개인정보보호법 제39조의2</span>
                    </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-400">
                        위임 시 착수금은 0원이며, 승소 시에만 성공보수가 발생합니다.
                        패소하더라도 비용을 청구하지 않습니다.
                    </p>
                </div>

                <button
                    onClick={handleDelegate}
                    disabled={loading || isDelegated}
                    className={`w-full font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${isDelegated
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                >
                    {loading ? (
                        "처리 중..."
                    ) : isDelegated ? (
                        <>
                            <Check className="h-5 w-5" />
                            위임 완료 (참여되었습니다)
                        </>
                    ) : (
                        <>
                            배상금 신청 시작하기 (1-Click) <ChevronRight className="h-5 w-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
