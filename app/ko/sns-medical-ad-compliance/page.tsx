"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Shield, AlertCircle, ArrowLeft, ArrowRight, CheckCircle, FileText } from "lucide-react";

export default function SnsMedicalAdCompliance() {
    const [auditUrl, setAuditUrl] = useState('');
    const [auditFormSubmitted, setAuditFormSubmitted] = useState(false);

    const handleAuditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAuditFormSubmitted(true);
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
                        1순위 B2B 법률 서비스
                    </span>
                </div>

                {/* Main Hero Summary */}
                <div className="space-y-4 text-center">
                    <div className="inline-flex h-12 w-12 rounded-full bg-blue-50 items-center justify-center text-blue-600 mb-2 border border-blue-100 shadow-xs">
                        <Scale className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                        SNS 의료광고 컴플라이언스
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        인스타그램, 위챗, 소홍서(小红书) 의료광고의 법적 리스크를 선제적으로 제거합니다. 
                        영업정지 및 형사고발 위기 차단 솔루션.
                    </p>
                </div>

                {/* Risk and Precedent Info */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" /> 왜 SNS 의료광고 컴플라이언스가 시급한가?
                    </h2>
                    <div className="space-y-4 text-sm text-slate-650 leading-relaxed">
                        <p>
                            보건복지부 및 관할 보건소는 불법 의료광고 모니터링을 대대적으로 전개하여, 최근 <strong>366건의 불법 광고 및 과장 광고를 적발</strong>하고 의료기관 업무정지 및 행정처분을 내렸습니다.
                        </p>
                        <p>
                            특히 **서울행정법원 2024구합74779 판결**에 따라, 비공개 폐쇄형 SNS 플랫폼(위챗 단톡방, 소홍서 비공개 메시지 등)을 활용한 광고 역시 **의료광고 사전심의 대상**으로 간주되어 단속의 표적이 되고 있습니다.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-blue-600">
                            <span className="block text-xs font-bold uppercase text-slate-500 mb-1">핵심 적발 유형</span>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                                <li>시술 후 부작용을 고지하지 않거나 누락한 경우 (의료법 위반)</li>
                                <li>치료 효과를 보장하는 표현을 기재하거나 수술 전후 비교 사진의 오남용</li>
                                <li>환자 유치 목적의 불법 알선수수료/할인율 제시 (의료법 제27조 3항 위반)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Services Rendered Card */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" /> SNS 광고 사전심의 컨설팅
                        </h3>
                        <p className="text-xs text-slate-605 leading-relaxed text-slate-600">
                            매주 집행할 SNS 이미지, 카드뉴스, 영상 대본의 문구를 대한의사협회 의료광고 심의위원회 기준에 맞게 사전 필터링 및 조율을 진행합니다.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" /> 월 리테이너 자문 서비스
                        </h3>
                        <p className="text-xs text-slate-605 leading-relaxed text-slate-600">
                            다국어(영어·중국어·일본어) 마케팅 채널 전체를 분기별로 상시 정밀 모니터링하여 보건소 불시 검열 및 행정처분 위험을 완전 예방합니다.
                        </p>
                    </div>
                </div>

                {/* Instant Online Audit Form */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 text-center">우선순위 SNS 광고 무료 1차 자가진단</h3>
                    <p className="text-slate-500 text-xs text-center max-w-lg mx-auto">
                        자사에서 운영 중인 마케팅 URL 또는 업로드 문서의 링크를 입력하시면 법적 위반 가능성을 검토해 드립니다.
                    </p>

                    {auditFormSubmitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700 text-sm">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            접수되었습니다. 변호사가 직접 해당 광고 채널을 모니터링한 뒤 결과를 안내해 드리겠습니다.
                        </div>
                    ) : (
                        <form onSubmit={handleAuditSubmit} className="space-y-4">
                            <input 
                                type="url" 
                                required 
                                value={auditUrl}
                                onChange={(e) => setAuditUrl(e.target.value)}
                                placeholder="체크가 필요한 인스타그램, 웹사이트, 소홍서 계정 주소"
                                className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button 
                                type="submit" 
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-xs"
                            >
                                무료 자문 접수 신청하기
                            </button>
                        </form>
                    )}
                </div>

                {/* Disclaimer Footnote */}
                <p className="text-center text-[10px] text-slate-400">
                    ※ 본 사전 검토는 김앤현 법률사무소의 1차 가이드라인이며, 법원의 최종 사법 판단을 구속하지 않습니다.
                </p>
            </div>
        </div>
    );
}
