"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, ShieldAlert, Users, Search, ChevronRight, RefreshCw, FileText, Gavel } from "lucide-react";

const QUESTIONS = [
    {
        id: 1,
        question: "유출 사실을 어떻게 알게 되셨나요?",
        description: "증거 확보 여부를 확인합니다.",
        options: [
            { id: "A", text: "기업에서 온 공식 통지서/사과문을 받았다.", next: 2 },
            { id: "B", text: "뉴스 보고 알았는데 내 정보인지 확실치 않다.", next: "RESULT_D" }
        ]
    },
    {
        id: 2,
        question: "유출된 정보에 무엇이 포함되어 있나요?",
        description: "위자료 액수와 승소 가능성을 판별합니다.",
        options: [
            { id: "A", text: "아이디, 암호화된 비밀번호 정도", next: "RESULT_C_SIMPLE" },
            { id: "B", text: "주민등록번호, 계좌번호, 의료정보 등 민감정보", next: 3 }
        ]
    },
    {
        id: 3,
        question: "실제로 금전 피해(보이스피싱 등)나 스팸 폭탄을 맞으셨나요?",
        description: "일반 손해배상 vs 법정 손해배상 적용 여부",
        options: [
            { id: "A", text: "구체적인 금전 피해가 있고 증빙 가능하다.", next: "RESULT_B" },
            { id: "B", text: "찜찜하고 기분 나쁘지만, 딱히 돈 나간 건 없다.", next: 4 }
        ]
    },
    {
        id: 4,
        question: "소송 비용과 시간에 대한 당신의 생각은?",
        description: "사용자의 성향에 따른 최적 전략 매칭",
        options: [
            { id: "A", text: "변호사 비용이 들더라도 끝까지 가서 최대치를 받아내겠다.", next: "RESULT_A" },
            { id: "B", text: "복잡한 건 질색이다. 돈 안 들이고 사과와 소액 배상이면 족하다.", next: "RESULT_C" }
        ]
    }
];

export function LeakDiagnosisTest() {
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
                    title: "스마트 실리파",
                    subtitle: "추천: 법정손해배상 청구 (제39조의2)",
                    message: "내 정신적 고통 증명하느라 애쓰지 마세요. 법이 정한 '법정손해배상'으로 깔끔하게 청구합시다.",
                    description: "실제 피해 입증은 어렵지만 유출은 확실한 상황입니다. 예상 배상액은 10~30만 원이지만 승소 확률은 가장 높습니다.",
                    action: "법정손해배상 청구용 내용증명 생성",
                    icon: Scale,
                    color: "text-indigo-400",
                    bg: "bg-indigo-500/10",
                    border: "border-indigo-500/20"
                };
            case "RESULT_B":
                return {
                    type: "Type B",
                    title: "정의의 응징자",
                    subtitle: "추천: 일반/징벌적 손해배상 소송",
                    message: "이건 단순 실수가 아닙니다. 징벌적 손해배상(3배~5배)까지 노려볼 수 있는 중대 사안입니다.",
                    description: "민감정보 유출에 2차 피해까지 발생했습니다. 변호사와 함께 제대로 된 '금융 치료'를 청구하세요.",
                    action: "전문 변호사 상담 신청",
                    icon: Gavel,
                    color: "text-rose-400",
                    bg: "bg-rose-500/10",
                    border: "border-rose-500/20"
                };
            case "RESULT_C":
            case "RESULT_C_SIMPLE":
                return {
                    type: "Type C",
                    title: "가성비 전략가",
                    subtitle: "추천: 집단분쟁조정 탑승",
                    message: "직접 싸우기엔 탄약(비용)이 아깝습니다. '집단분쟁조정' 버스에 탑승하세요.",
                    description: resultType === "RESULT_C_SIMPLE"
                        ? "단순 ID/PW 유출은 소송 시 기각될 위험이 있습니다. 비용 0원인 분쟁조정이 가장 합리적입니다."
                        : "피해가 경미하거나 소송이 부담스러운 경우, 비용 0원으로 결과만 받아보실 수 있는 분쟁조정을 추천합니다.",
                    action: "집단분쟁조정 신청 바로가기",
                    icon: Users,
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/20"
                };
            case "RESULT_D":
                return {
                    type: "Type D",
                    title: "증거 수집가",
                    subtitle: "추천: 유출 통지 요구 및 신고",
                    message: "아직 공격할 타이밍이 아닙니다. 먼저 증거를 확보하세요.",
                    description: "유출 여부가 불분명합니다. 기업에 '유출 통지'를 요구하고, KISA(118)에 신고부터 하여 확실한 증거를 잡으세요.",
                    action: "유출 통지 요구서 양식 다운로드",
                    icon: Search,
                    color: "text-amber-400",
                    bg: "bg-amber-500/10",
                    border: "border-amber-500/20"
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
                                    개인정보 유출 대응 전략 진단
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
