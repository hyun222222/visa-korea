"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Gavel, AlertTriangle, Clock, ChevronRight, RefreshCw, FileText, Landmark } from "lucide-react";

const QUESTIONS = [
    {
        id: 1,
        question: "사고가 언제 발생했나요?",
        description: "국가배상청구권의 소멸시효를 확인합니다.",
        options: [
            { id: "A", text: "3년 이내 (안 날로부터 3년, 있은 날로부터 5년 이내)", next: 2 },
            { id: "B", text: "5년 이상 경과함", next: "RESULT_D" }
        ]
    },
    {
        id: 2,
        question: "무엇 때문에 피해를 보셨나요?",
        description: "책임 유형(인적 과실 vs 영조물 하자)을 분류합니다.",
        options: [
            { id: "A", text: "도로 파손(포트홀), 신호등 고장, 제방 붕괴 등 시설물 문제", next: 3 },
            { id: "B", text: "공무원의 일처리 실수, 부당한 처분, 경찰 미출동 등", next: 4 }
        ]
    },
    {
        id: 3,
        question: "당시 날씨나 상황이 어땠나요?",
        description: "면책 사유(천재지변 등 불가항력)를 확인합니다.",
        options: [
            { id: "A", text: "평범한 날씨였다. (관리 소홀 명백)", next: "RESULT_A" },
            { id: "B", text: "기록적인 폭우, 태풍 등 천재지변 수준이었다.", next: "RESULT_C" }
        ]
    },
    {
        id: 4,
        question: "공무원의 과실을 입증할 증거가 있나요?",
        description: "입증 책임의 난이도를 평가합니다.",
        options: [
            { id: "A", text: "현장 사진, 녹음, CCTV 등 객관적 증거가 있다.", next: "RESULT_B" },
            { id: "B", text: "내 기억 외에는 뚜렷한 물증이 없다.", next: "RESULT_B_WEAK" }
        ]
    }
];

export function StateLiabilityTest() {
    const [currentStep, setCurrentStep] = useState(0);
    const [resultType, setResultType] = useState<string | null>(null);

    const handleAnswer = (next: number | string) => {
        if (typeof next === "string") {
            setResultType(next);
        } else {
            setCurrentStep(next - 1);
        }
    };

    const resetTest = () => {
        setCurrentStep(0);
        setResultType(null);
    };

    const getResult = () => {
        switch (resultType) {
            case "RESULT_A":
                return {
                    type: "Type A",
                    title: "빠른 해결사",
                    subtitle: "추천: 지구배상심의회 신청 (Fast Track)",
                    message: "법원까지 갈 필요 없습니다. '배상심의회'로 4주 내 해결 가능합니다.",
                    description: "영조물(시설물) 하자가 명백한 소액 사건입니다. 비용이 0원인 배상심의회에 신청서만 제출하면 됩니다.",
                    action: "배상심의회 신청서 양식 다운로드",
                    icon: Landmark,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/20"
                };
            case "RESULT_B":
                return {
                    type: "Type B",
                    title: "정면 승부사",
                    subtitle: "추천: 국가배상 청구 소송",
                    message: "심의회에서는 기각될 확률이 높습니다. 법원에서 시비를 가려야 합니다.",
                    description: "공무원의 과실 여부는 다툼의 여지가 많습니다. 확보하신 증거를 바탕으로 정식 소송을 제기해야 합니다.",
                    action: "소송 절차 가이드 확인",
                    icon: Gavel,
                    color: "text-indigo-400",
                    bg: "bg-indigo-500/10",
                    border: "border-indigo-500/20"
                };
            case "RESULT_B_WEAK":
                return {
                    type: "Type B (증거 보강)",
                    title: "신중한 승부사",
                    subtitle: "추천: 정보공개청구 후 소송 검토",
                    message: "증거 없이 소송하면 100% 패소합니다. 증거부터 모아야 합니다.",
                    description: "공무원의 과실을 입증할 물증이 부족합니다. 먼저 '정보공개청구'를 통해 관련 서류나 CCTV를 확보하세요.",
                    action: "정보공개청구 가이드 보기",
                    icon: FileText,
                    color: "text-amber-400",
                    bg: "bg-amber-500/10",
                    border: "border-amber-500/20"
                };
            case "RESULT_C":
                return {
                    type: "Type C",
                    title: "자연재해 피해자",
                    subtitle: "판정: 승소 가능성 낮음 (불가항력)",
                    message: "지자체가 '할 만큼 했다'고 주장하면 이기기 어렵습니다.",
                    description: "천재지변으로 인한 사고는 국가의 책임이 면제될 가능성이 높습니다. 전문 변호사와 '관리 하자의 틈'이 있는지 상담이 필요합니다.",
                    action: "전문 변호사 상담 신청",
                    icon: AlertTriangle,
                    color: "text-rose-400",
                    bg: "bg-rose-500/10",
                    border: "border-rose-500/20"
                };
            case "RESULT_D":
                return {
                    type: "Type D",
                    title: "타임 아웃",
                    subtitle: "판정: 소멸시효 완성",
                    message: "안타깝지만 법적인 권리 행사 기간이 지났습니다.",
                    description: "국가배상청구권은 손해를 안 날로부터 3년, 있은 날로부터 5년이 지나면 소멸합니다.",
                    action: "다른 구제 수단 알아보기",
                    icon: Clock,
                    color: "text-slate-400",
                    bg: "bg-slate-500/10",
                    border: "border-slate-500/20"
                };
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl min-h-[500px] flex flex-col">
                {!resultType ? (
                    <div className="flex-1 flex flex-col">
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-bold text-indigo-400">
                                    Q{currentStep + 1}
                                </span>
                                <span className="text-xs text-slate-500">
                                    국가배상 승소 전략 진단
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 h-1 rounded-full">
                                <div
                                    className="bg-indigo-500 h-1 rounded-full transition-all duration-500"
                                    style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {QUESTIONS[currentStep].question}
                                </h3>
                                <p className="text-slate-400 text-sm mb-8">
                                    {QUESTIONS[currentStep].description}
                                </p>

                                <div className="space-y-3 mt-auto">
                                    {QUESTIONS[currentStep].options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleAnswer(option.next)}
                                            className="w-full text-left p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/50 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-200 group-hover:text-white transition-colors">
                                                    {option.text}
                                                </span>
                                                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center text-center justify-center space-y-6"
                    >
                        {(() => {
                            const result = getResult();
                            if (!result) return null;
                            const Icon = result.icon;
                            return (
                                <>
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 ${result.bg}`}>
                                        <Icon className={`h-10 w-10 ${result.color}`} />
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className={`text-lg font-bold ${result.color}`}>
                                            {result.type} "{result.title}"
                                        </h2>
                                        <h3 className="text-2xl font-bold text-white">
                                            {result.subtitle}
                                        </h3>
                                    </div>

                                    <div className={`p-6 rounded-xl border ${result.border} ${result.bg} max-w-lg`}>
                                        <p className="text-lg font-medium text-white mb-2">
                                            "{result.message}"
                                        </p>
                                        <p className="text-slate-400 text-sm">
                                            {result.description}
                                        </p>
                                    </div>

                                    <button className="w-full max-w-lg flex items-center justify-center gap-2 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors mt-4">
                                        <FileText className="h-5 w-5" />
                                        {result.action}
                                    </button>

                                    <button
                                        onClick={resetTest}
                                        className="text-slate-500 hover:text-white text-sm flex items-center gap-1 mt-4 transition-colors"
                                    >
                                        <RefreshCw className="h-3 w-3" />
                                        테스트 다시하기
                                    </button>
                                </>
                            );
                        })()}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
