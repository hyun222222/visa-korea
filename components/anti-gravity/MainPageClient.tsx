"use client";

import { useState } from "react";
import { Hero } from "@/components/anti-gravity/Hero";
import { LeakClaimFlow } from "@/components/anti-gravity/LeakClaimFlow";
import { CreateCampaignModal } from "@/components/anti-gravity/CreateCampaignModal";
import { LawsuitCategoryGrid } from "@/components/anti-gravity/LawsuitCategoryGrid";
import { DefectDiagnosisTest } from "@/components/anti-gravity/DefectDiagnosisTest";
import { LeakDiagnosisTest } from "@/components/anti-gravity/LeakDiagnosisTest";
import { StateLiabilityTest } from "@/components/anti-gravity/StateLiabilityTest";
import { ConsumerDiagnosisTest } from "@/components/anti-gravity/ConsumerDiagnosisTest";
import { SocialProof } from "@/components/anti-gravity/SocialProof";

// Mock Data for Campaigns (Lifted state)
const INITIAL_CAMPAIGNS = [
    {
        id: 1,
        title: "A 쇼핑몰 개인정보 유출 집단소송",
        category: "개인정보 침해",
        participants: 1240,
        status: "원고 모집 중",
        description: "2024년 1월 발생한 대규모 해킹 사태에 대한 손해배상 청구 소송입니다.",
    },
    {
        id: 2,
        title: "B 아파트 1단지 지하주차장 누수",
        category: "아파트 하자",
        participants: 45,
        status: "증거 수집 중",
        description: "지하 2층 주차장 천장 누수 및 균열에 대한 시공사 책임 규명.",
    },
    {
        id: 3,
        title: "C 게임사 확률 조작 피해 보상",
        category: "소비자 피해",
        participants: 8900,
        status: "소송 준비 중",
        description: "확률형 아이템 정보 허위 표시에 따른 부당 이득 반환 청구.",
    },
];

export function MainPageClient() {
    const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateCampaign = (newCampaign: any) => {
        setCampaigns((prev) => [
            {
                id: prev.length + 1,
                participants: 1,
                status: "모집 시작",
                ...newCampaign,
            },
            ...prev,
        ]);
    };

    return (
        <div className="flex flex-col gap-0 pb-24">
            <Hero onCreateCampaign={() => setIsModalOpen(true)} />

            <SocialProof />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-32 mt-24">

                <section id="categories" className="scroll-mt-24">
                    <LawsuitCategoryGrid />
                </section>

                <section id="leak-diagnosis" className="scroll-mt-24">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
                            개인정보 유출 대응 전략 진단
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            소송이 무조건 정답은 아닙니다.
                            법정손해배상, 분쟁조정, 집단소송 중 나에게 가장 유리한 전략을 찾아보세요.
                        </p>
                    </div>
                    <LeakDiagnosisTest />
                </section>

                <section id="state-liability" className="scroll-mt-24">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                            국가배상 승소 전략 진단
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            국가라는 거대 권력과 싸우기 막막하신가요?
                            배상심의회(Fast Track)와 정식 소송 중 가장 효율적인 길을 안내해 드립니다.
                        </p>
                    </div>
                    <StateLiabilityTest />
                </section>

                <section id="consumer-diagnosis" className="scroll-mt-24">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-white">
                            소비자 호구 탈출 & 실전 대응 전략
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            배보다 배꼽이 더 큰 소비자 소송, 현명하게 대처하세요.
                            환불, 해지, 손해배상까지 가장 가성비 높은 해결책을 찾아드립니다.
                        </p>
                    </div>
                    <ConsumerDiagnosisTest />
                </section>

                <section id="diagnosis" className="scroll-mt-24">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-white">
                            아파트 하자 소송 승소 가능성 진단
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            우리 아파트, 소송해도 될까?
                            법률 데이터(판례, 제척기간, 당사자 적격)를 기반으로 승소 가능성을 분석해드립니다.
                        </p>
                    </div>
                    <DefectDiagnosisTest />
                </section>


            </div >

            <CreateCampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCampaign}
            />
        </div >
    );
}
