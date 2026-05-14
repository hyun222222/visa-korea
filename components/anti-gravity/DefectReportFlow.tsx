"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, AlertTriangle, FileText, Check, Loader2 } from "lucide-react";

export function DefectReportFlow() {
    const [step, setStep] = useState(1);
    const [analyzing, setAnalyzing] = useState(false);

    const handleUpload = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setStep(2);
        }, 2000);
    };

    const handleGenerateReport = () => {
        setStep(3);
    };

    return (
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Interactive Area */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl h-full min-h-[400px] flex flex-col">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Camera className="h-10 w-10 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">하자 사진 촬영</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                    균열, 누수, 곰팡이 사진을 업로드하세요. AI가 즉시 하자를 분류합니다.
                                </p>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={analyzing}
                                className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {analyzing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        AI 분석 중...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-5 w-5" />
                                        사진 업로드
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col space-y-6"
                        >
                            <div className="flex items-center gap-3 text-emerald-400 mb-4">
                                <Check className="h-6 w-6" />
                                <span className="font-bold">분석 완료</span>
                            </div>

                            <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                {/* Mock Image Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                    [업로드된 이미지 미리보기]
                                </div>
                                {/* AI Bounding Box Mock */}
                                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-red-500 bg-red-500/10 flex items-start justify-start p-1">
                                    <span className="bg-red-500 text-white text-xs px-1">균열: 0.5mm</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">하자 유형</span>
                                    <span className="text-white">구조적 균열 (Structural Crack)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">심각도</span>
                                    <span className="text-amber-400 font-medium">중간 (보수 필요)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">법적 근거</span>
                                    <span className="text-slate-500">주택법 제46조</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerateReport}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all"
                            >
                                법적 리포트 생성
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                <FileText className="h-10 w-10 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">리포트 생성 완료</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                    "101동 101호 하자 리포트"가 생성되었습니다. 내용증명 발송 준비가 완료되었습니다.
                                </p>
                            </div>
                            <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors w-full max-w-xs">
                                PDF 미리보기
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Side: Context/Info */}
            <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                            <Camera className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">AI 시각 분석</h4>
                            <p className="text-slate-400 text-sm mt-1">
                                50,000장 이상의 하자 이미지를 학습한 AI가 균열, 누수, 곰팡이를 98% 정확도로 식별합니다.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">자동 분류 시스템</h4>
                            <p className="text-slate-400 text-sm mt-1">
                                주택법에 따른 담보책임기간(1, 2, 3, 5, 10년)별로 하자를 자동으로 분류합니다.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">증거 보존</h4>
                            <p className="text-slate-400 text-sm mt-1">
                                모든 사진은 촬영 시각과 위치 정보(GPS)가 메타데이터로 저장되어 법적 증거 능력을 갖습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
