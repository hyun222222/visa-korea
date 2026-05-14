"use client";

import { useState } from "react";
import { Hero } from "@/components/anti-gravity/Hero";
import { CreateCampaignModal } from "@/components/anti-gravity/CreateCampaignModal";
import { LawsuitCategoryGrid } from "@/components/anti-gravity/LawsuitCategoryGrid";
import { DefectDiagnosisTest } from "@/components/anti-gravity/DefectDiagnosisTest";
import { LeakDiagnosisTest } from "@/components/anti-gravity/LeakDiagnosisTest";
import { StateLiabilityTest } from "@/components/anti-gravity/StateLiabilityTest";
import { ConsumerDiagnosisTest } from "@/components/anti-gravity/ConsumerDiagnosisTest";
import { ActiveCampaignList } from "@/components/anti-gravity/ActiveCampaignList";

const SECTIONS = [
    {
        id: "leak-diagnosis",
        eyebrow: "01 · 개인정보 유출",
        title: "개인정보 유출 대응 전략 진단",
        description: "소송이 무조건 정답은 아닙니다. 법정손해배상·분쟁조정·집단소송 중 가장 유리한 전략을 안내합니다.",
        Component: LeakDiagnosisTest,
    },
    {
        id: "state-liability",
        eyebrow: "02 · 국가배상",
        title: "국가배상 승소 전략 진단",
        description: "거대 권력과 싸우기 막막하신가요? 배상심의회(Fast Track)와 정식 소송 중 효율적인 경로를 비교해 드립니다.",
        Component: StateLiabilityTest,
    },
    {
        id: "consumer-diagnosis",
        eyebrow: "03 · 소비자 피해",
        title: "소비자 호구 탈출 & 실전 대응 전략",
        description: "배보다 배꼽이 더 큰 소비자 소송, 환불·해지·손해배상까지 가성비 높은 해결책을 찾아드립니다.",
        Component: ConsumerDiagnosisTest,
    },
    {
        id: "diagnosis",
        eyebrow: "04 · 아파트 하자",
        title: "아파트 하자 소송 승소 가능성 진단",
        description: "판례·제척기간·당사자 적격을 기반으로 승소 가능성을 분석해 드립니다.",
        Component: DefectDiagnosisTest,
    },
];

export function MainPageClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <Hero onCreateCampaign={() => setIsModalOpen(true)} />

            <ActiveCampaignList />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <section id="categories" className="scroll-mt-20 py-20">
                    <LawsuitCategoryGrid />
                </section>

                {SECTIONS.map(({ id, eyebrow, title, description, Component }) => (
                    <section
                        key={id}
                        id={id}
                        className="scroll-mt-20 py-20 border-t border-[#d5e5ff]"
                    >
                        <div className="mb-10 max-w-3xl">
                            <p className="text-xs uppercase text-[#4a5ba3] font-bold mb-3">
                                {eyebrow}
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#00074e] mb-3">
                                {title}
                            </h2>
                            <p className="text-[#00074e]/70 leading-relaxed">
                                {description}
                            </p>
                        </div>
                        <Component />
                    </section>
                ))}
            </div>

            <CreateCampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={() => { }}
            />
        </div>
    );
}
