"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, RefreshCw, FileText, Calculator } from "lucide-react";

// Questions Logic
const QUESTIONS = [
    {
        id: 1,
        question: "아파트 사용승인일(준공일)로부터 얼마나 지났나요?",
        description: "법적 근거: 담보책임기간 (집합건물법 제9조의2)",
        options: [
            { id: "A", text: "2년 미만 (골든타임)", score: 30, next: 2 },
            { id: "B", text: "3년 ~ 5년 (주요 항목 만료 가능성)", score: 20, next: 2 },
            { id: "C", text: "10년 이상 (제척기간 만료 위험)", score: 0, next: 2, warning: "10년이 경과하면 법적으로 하자보수를 청구하기 매우 어렵습니다." }
        ]
    },
    {
        id: 2,
        question: "현재 입주자대표회의(또는 비대위)의 상황은 어떤가요?",
        description: "법적 근거: 당사자 적격 (소송 수행 권한)",
        options: [
            { id: "A", text: "소송 진행에 적극적이며, 과반수 동의를 받는 중이다.", score: 30, next: 3 },
            { id: "B", text: "대표회의가 미온적이거나 구성이 불투명하다.", score: 10, next: 3, warning: "소송을 위해서는 입주민 과반수의 채권양도 동의가 필수적입니다." },
            { id: "C", text: "아직 논의된 바 없다.", score: 10, next: 3 }
        ]
    },
    {
        id: 3,
        question: "하자 입증을 위한 증거 자료가 있나요?",
        description: "법적 근거: 입증 책임 및 감정",
        options: [
            { id: "A", text: "준공 도면과 현재 하자 사진을 확보했다.", score: 20, next: 4 },
            { id: "B", text: "눈에 보이는 하자 사진만 있다.", score: 10, next: 4 },
            { id: "C", text: "아직 확보된 자료가 없다.", score: 0, next: 4 }
        ]
    },
    {
        id: 4,
        question: "시공사 측에서 하자보수를 해준 적이 있나요?",
        description: "법적 근거: 소멸시효 중단 및 책임 제한",
        options: [
            { id: "A", text: "전혀 없거나, 요청했으나 거절당했다.", score: 20, next: "RESULT" },
            { id: "B", text: "일부 보수를 받았으나 여전히 하자가 있다.", score: 10, next: "RESULT" },
            { id: "C", text: "합의서를 작성하고 보수 비용을 받았다.", score: 0, next: "RESULT", warning: "합의서(부제소 합의)를 작성했다면 추가 소송이 불가능할 수 있습니다." }
        ]
    }
];

export function DefectDiagnosisTest() {
    const [currentStep, setCurrentStep] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (score: number, next: number | string) => {
        setTotalScore((prev) => prev + score);

        if (next === "RESULT") {
            setShowResult(true);
        } else {
            setCurrentStep(next as number - 1);
        }
    };

    const resetTest = () => {
        setCurrentStep(0);
        setTotalScore(0);
        setShowResult(false);
    };

    const getResult = () => {
        if (totalScore >= 80) {
            return {
                grade: "A",
                title: "소송 강력 추천 (승소 확률 높음)",
                message: "중력을 거스를 준비 완료! 승소 확률이 매우 높습니다.",
                description: "골든타임입니다. 지금 바로 채권양도증서와 내용증명을 준비하여 소송을 시작하세요.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
                icon: CheckCircle
            };
        } else if (totalScore >= 50) {
            return {
                grade: "B",
                title: "조건부 진행 (증거 보강 필요)",
                message: "연료가 부족합니다. 증거를 더 모아야 뜹니다.",
                description: "승소 가능성은 있으나, 입주민 동의율을 높이고 구체적인 하자 증거(도면 대조)를 보강해야 합니다.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20",
                icon: AlertTriangle
            };
        } else {
            return {
                grade: "C",
                title: "진행 신중 / 불가 (리스크 높음)",
                message: "지금 이륙하면 추락합니다. 소송보다 협상을 추천합니다.",
                description: "제척기간이 만료되었거나 당사자 적격 요건이 부족합니다. 무리한 소송보다는 시공사와의 협상을 우선 고려하세요.",
                color: "text-rose-400",
                bg: "bg-rose-500/10",
                border: "border-rose-500/20",
                icon: XCircle
            };
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl min-h-[500px] flex flex-col">
                {!showResult ? (
                    <div className="flex-1 flex flex-col">
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-bold text-indigo-400">
                                    STEP {currentStep + 1} / {QUESTIONS.length}
                                </span>
                                <span className="text-xs text-slate-500">
                                    아파트 하자 승소 가능성 진단
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
                                            onClick={() => handleAnswer(option.score, option.next)}
                                            className="w-full text-left p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/50 transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-200 group-hover:text-white transition-colors">
                                                    {option.text}
                                                </span>
                                                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                            {option.warning && (
                                                <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {option.warning}
                                                </p>
                                            )}
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
                            const Icon = result.icon;
                            return (
                                <>
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 ${result.bg}`}>
                                        <Icon className={`h-10 w-10 ${result.color}`} />
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className={`text-3xl font-bold ${result.color}`}>
                                            Grade {result.grade}
                                        </h2>
                                        <h3 className="text-xl font-bold text-white">
                                            {result.title}
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

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-4">
                                        <button className="flex items-center justify-center gap-2 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors">
                                            <FileText className="h-5 w-5" />
                                            필요 서류 다운로드
                                        </button>
                                        <button className="flex items-center justify-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-colors">
                                            <Calculator className="h-5 w-5" />
                                            예상 비용 계산기
                                        </button>
                                    </div>

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
