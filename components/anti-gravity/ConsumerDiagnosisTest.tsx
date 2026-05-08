"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Scale, FileText, AlertTriangle, ChevronRight, RefreshCw, ShoppingBag, Gavel } from "lucide-react";

const QUESTIONS = [
    {
        id: 1,
        question: "피해 금액이 대략 얼마인가요?",
        description: "비용 효율성(가성비)을 따져 최적의 절차를 안내합니다.",
        options: [
            { id: "A", text: "30만 원 미만 (소액 사건)", next: 2 },
            { id: "B", text: "30만 원 ~ 3,000만 원 (일반적인 피해)", next: 2 },
            { id: "C", text: "피해자가 수백 명이고 총액이 매우 크다", next: "RESULT_B" }
        ]
    },
    {
        id: 2,
        question: "어떤 종류의 피해인가요?",
        description: "법적 쟁점(해지권, 하자 담보 책임 등)을 파악합니다.",
        options: [
            { id: "A", text: "헬스장, 인강 등 장기 계약 중도 해지 거부", next: "RESULT_A" },
            { id: "B", text: "물건을 샀는데 하자가 있다 (불량품)", next: 3 },
            { id: "C", text: "기업의 약관 자체가 불공정하다", next: "RESULT_B" }
        ]
    },
    {
        id: 3,
        question: "제품의 하자를 증명할 수 있나요?",
        description: "입증 책임은 원칙적으로 소비자에게 있습니다.",
        options: [
            { id: "A", text: "명확한 사진/영상이나 전문가(수리기사) 소견서가 있다.", next: 4 },
            { id: "B", text: "그냥 내가 쓰다 보니 고장 났는데, 불량 같다.", next: "RESULT_D" }
        ]
    },
    {
        id: 4,
        question: "혼자 싸우시나요, 동료가 있나요?",
        description: "집단분쟁조정 요건(50인 이상)을 확인합니다.",
        options: [
            { id: "A", text: "나 혼자다.", next: "RESULT_C" },
            { id: "B", text: "인터넷 카페에 같은 피해자가 50명 넘게 모여 있다.", next: "RESULT_B" }
        ]
    }
];

export function ConsumerDiagnosisTest() {
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
                    title: "스마트 환불 사냥꾼",
                    subtitle: "추천: 내용증명 + 소비자원 신고",
                    message: "변호사 쓸 돈으로 맛있는 거 사 드세요.",
                    description: "법적으로 '중도 해지'는 강력하게 보장됩니다. 내용증명 한 통이면 대부분 해결됩니다. 안 되면 한국소비자원에 신고하세요.",
                    action: "계약 해지 통보용 내용증명 작성",
                    icon: FileText,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/20"
                };
            case "RESULT_B":
                return {
                    type: "Type B",
                    title: "연대의 지휘자",
                    subtitle: "추천: 집단분쟁조정 신청",
                    message: "혼자 싸우면 계란이지만, 50명이 모이면 바위를 깹니다.",
                    description: "피해자가 50명 이상이면 '집단분쟁조정'이 가능합니다. 비용은 0원이며, 성립 시 재판상 화해와 같은 효력이 있습니다.",
                    action: "집단분쟁조정 신청 가이드",
                    icon: Users,
                    color: "text-violet-400",
                    bg: "bg-violet-500/10",
                    border: "border-violet-500/20"
                };
            case "RESULT_C":
                return {
                    type: "Type C",
                    title: "정밀 타격가",
                    subtitle: "추천: 전자소송 지급명령",
                    message: "말로는 안 통하는 상대군요. 법원의 힘을 빌립시다.",
                    description: "증거가 확실하고 피해액이 있다면, 저렴하고 빠른 '지급명령'을 신청하여 상대방을 압박하고 강제집행 권한을 얻으세요.",
                    action: "나홀로 소송(지급명령) 템플릿",
                    icon: Gavel,
                    color: "text-indigo-400",
                    bg: "bg-indigo-500/10",
                    border: "border-indigo-500/20"
                };
            case "RESULT_D":
                return {
                    type: "Type D",
                    title: "증거 수집가",
                    subtitle: "추천: 전문가 진단 우선",
                    message: "지금 소송하면 100% 집니다.",
                    description: "심증만으로는 이길 수 없습니다. 제조사 서비스센터 내역서나 사설 감정 등 '객관적 하자 입증 자료'부터 확보해야 합니다.",
                    action: "증거 수집 체크리스트",
                    icon: AlertTriangle,
                    color: "text-rose-400",
                    bg: "bg-rose-500/10",
                    border: "border-rose-500/20"
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
                                <span className="text-sm font-bold text-violet-400">
                                    Q{currentStep + 1}
                                </span>
                                <span className="text-xs text-slate-500">
                                    소비자 호구 탈출 & 실전 대응 전략 진단
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 h-1 rounded-full">
                                <div
                                    className="bg-violet-500 h-1 rounded-full transition-all duration-500"
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
                                            className="w-full text-left p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-violet-600/20 hover:border-violet-500/50 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-200 group-hover:text-white transition-colors">
                                                    {option.text}
                                                </span>
                                                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-all" />
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

                                    <button className="w-full max-w-lg flex items-center justify-center gap-2 p-4 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-bold transition-colors mt-4">
                                        <ShoppingBag className="h-5 w-5" />
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
