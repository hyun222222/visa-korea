"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Shield, AlertCircle, ArrowLeft, ArrowRight, CheckCircle, FileText } from "lucide-react";

export default function AttractionRegistrationPage() {
    const [bizName, setBizName] = useState('');
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
                        3순위 B2B 서비스
                    </span>
                </div>

                {/* Main Hero Summary */}
                <div className="space-y-4 text-center">
                    <div className="inline-flex h-12 w-12 rounded-full bg-blue-50 items-center justify-center text-blue-600 mb-2 border border-blue-100 shadow-xs">
                        <FileText className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                        외국인 환자 유치기관 등록 · 전자비자
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        보건복지부 유치기관 공식 등록 대행부터 법무부 지정 우수유치기관 신청, 
                        대리 온라인 전자비자 발급을 위한 종합 행정 및 세무 컨설팅을 제공합니다.
                    </p>
                </div>

                {/* Requirements and Legal Basis */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" /> 유치업자 등록 법정 요건 및 우수기관 혜택
                    </h2>
                    <div className="space-y-4 text-sm text-slate-650 leading-relaxed">
                        <p>
                            대한민국 의료 해외진출 및 외국인환자 유치 지원에 관한 법률 제6조에 의거, 무등록 유치 및 영리 알선 행위는 **형사 처벌 및 병원 영업정지**의 강력한 사법적 처분이 뒤따릅니다.
                        </p>
                        <p>
                            합법적인 외국인 환자 유치를 위해서는 보건복지부에 공식 등록해야 하며, 지정 기준 충족 및 매년 사업 실적 보고를 정확히 준수해야 지침 위반 제재를 피할 수 있습니다.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-blue-600">
                            <span className="block text-xs font-bold uppercase text-slate-500 mb-1">유치업자 주요 등록 요건</span>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                                <li><strong>자본금 요건:</strong> 법인 또는 개인 자산 규모 1억 원 이상 입증</li>
                                <li><strong>보증보험 가입:</strong> 1억 원 이상의 인허가보증보험 가입 필수</li>
                                <li><strong>우수유치기관 지정:</strong> 지정 시 초청서류 간소화 및 온라인 전자비자 대리 신청 권한 획득</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Professional Services */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" /> 보건복지부 등록 대행
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            신청 서류 작성, 보증보험 증권 발급 대행, 보건산업진흥원 실적 보고 요령 교육까지 완전한 합법 등록 프로세스를 밀착 수행합니다.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Scale className="h-5 w-5 text-blue-600" /> 우수유치기관 패키지
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            법무부 고시 우수유치기관 지정을 목표로 초청 실적 누적 세무 감사, 불법 체류 방지 신원보증 프로세스 검증 전략 컨설팅을 제공합니다.
                        </p>
                    </div>
                </div>

                {/* Free Pre-Qualification Check Form */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 text-center">유치기관 등록 자격 무료 요건 진단</h3>
                    <p className="text-slate-500 text-xs text-center max-w-lg mx-auto">
                        자사의 설립 자본금 현황 및 주사업 종류를 기재해 주시면 등록 실무 적격성을 사전 평가해 드립니다.
                    </p>

                    {submitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700 text-sm">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            성공적으로 접수되었습니다. 담당 자문단이 상세 적격 검토 문서를 메일 또는 메신저로 발송해 드리겠습니다.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text" 
                                required 
                                value={bizName}
                                onChange={(e) => setBizName(e.target.value)}
                                placeholder="병원명 또는 회사명 및 담당자 연락처"
                                className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button 
                                type="submit" 
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-xs"
                            >
                                무료 자격 검증 신청하기
                            </button>
                        </form>
                    )}
                </div>

                {/* Footnote */}
                <p className="text-center text-[10px] text-slate-400">
                    ※ 본 컨설팅은 보건복지부 지정 요건 공식 매뉴얼을 준수하여 작성됩니다.
                </p>
            </div>
        </div>
    );
}
