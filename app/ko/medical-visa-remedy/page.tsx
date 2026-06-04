"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Shield, AlertCircle, ArrowLeft, ArrowRight, CheckCircle, FileText } from "lucide-react";

export default function MedicalVisaRemedyPage() {
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-16 px-4 selection:bg-blue-500/10 selection:text-blue-600">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Back Button */}
                <div className="flex justify-between items-center border-b border-slate-200 pb-6">
                    <Link href="/ko" className="text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" /> 메인으로 돌아가기
                    </Link>
                    <span className="text-xs text-blue-650 font-bold tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-blue-600 shadow-xs">
                        2순위 행정구제 서비스
                    </span>
                </div>

                {/* Main Hero Summary */}
                <div className="space-y-4 text-center">
                    <div className="inline-flex h-12 w-12 rounded-full bg-blue-50 items-center justify-center text-blue-600 mb-2 border border-blue-100 shadow-xs">
                        <Shield className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                        의료비자 거부 · 연장 행정구제
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        C-3-3(의료관광), G-1-10(장기치료) 비자 발급이 부당하게 불허되었습니까? 
                        출입국대행 기관 등록 명의의 정밀 소명과 행정심판으로 대응합니다.
                    </p>
                </div>

                {/* Legal Precedent & Analysis */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" /> 재량적 거부 처분에 대한 법적 접근
                    </h2>
                    <div className="space-y-4 text-sm text-slate-650 leading-relaxed">
                        <p>
                            비자 발급은 영사의 광범위한 재량 영역에 속한다는 판례(**대법원 2015두48846**)에 따라, 단순히 서류를 다시 제출하는 것만으로는 2차 거부(Denial)를 면하기 어렵습니다.
                        </p>
                        <p>
                            출입국관리공무원의 거부 처분을 번복시키기 위해서는, 비자 신청인의 재정 보증서류 보완 및 치료 목적의 정당성을 법률적으로 소명하는 **공식 변명疎明서** 작성이 필수적입니다.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-blue-600">
                            <span className="block text-xs font-bold uppercase text-slate-500 mb-1">비자 구제 핵심 입증 포인트</span>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-650 text-xs">
                                <li><strong>치료 필요성 입증:</strong> 국내 의료기관의 정밀 소견서 및 치료 세부 계획의 구체화</li>
                                <li><strong>불법 체류 가능성 해소:</strong> 송금 경로의 증빙, 자본 출처 및 본국과의 사회적·경제적 유대 관계 규명</li>
                                <li><strong>유치기관의 보증 신뢰성:</strong> 출입국대행 기관(김앤현 법률사무소)의 공식 대행 보증서 첨부</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Remedy Procedures */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" /> 행정심판 청구 대행
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            비자 거부 통지를 받은 날로부터 90일 이내에 법무부 행정심판위원회에 처분의 부당성을 다투는 법률 서면을 작성하여 행정심판 청구를 대행합니다.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" /> 재신청 소명 패키지
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            영사의 거부 취지를 정밀 분석하여, 재신청 시 단 한 번에 비자가 허가될 수 있도록 신원보증 및 법률 소명 일체 패키지를 제공합니다.
                        </p>
                    </div>
                </div>

                {/* Instant Assessment Intake Form */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 text-center">의료 비자 거부 무료 사전 분석 신청</h3>
                    <p className="text-slate-550 text-xs text-center max-w-lg mx-auto">
                        영사로부터 받은 거부 통지 사유(예: 입국목적 소명 미흡 등)를 입력해 주시면 변호사가 타당성을 검토해 드립니다.
                    </p>

                    {submitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700 text-sm">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            접수되었습니다. 거부 사유에 관한 법률 검토 결과를 남겨주신 연락처로 발송해 드리겠습니다.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea 
                                required 
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="거부된 비자 종류, 불허 사유 문구 및 진행 상황을 입력해 주세요."
                                className="w-full min-h-[100px] bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 resize-none transition-colors"
                            />
                            <button 
                                type="submit" 
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-xs"
                            >
                                무료 비자 자문 접수하기
                            </button>
                        </form>
                    )}
                </div>

                {/* Footnote */}
                <p className="text-center text-[10px] text-slate-400">
                    ※ 본 구제 대행은 대한민국 행정심판법에 의거한 공식 절차에 따라 진행됩니다.
                </p>
            </div>
        </div>
    );
}
