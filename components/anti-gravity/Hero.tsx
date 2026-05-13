"use client";

import { RealTimeTicker } from "./RealTimeTicker";
import { SearchBar } from "./SearchBar";
import { CategoryChips } from "./CategoryChips";

interface HeroProps {
    onCreateCampaign?: () => void;
}

export function Hero({ onCreateCampaign }: HeroProps) {
    return (
        <section className="w-full">
            <RealTimeTicker />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <p className="text-sm font-bold text-[#4a5ba3] mb-5">
                    balawso · 김앤현 법률사무소
                </p>

                <h1 className="text-4xl md:text-5xl font-bold text-[#00074e] leading-tight mb-6">
                    혼자면 포기하게 되는 일,<br />
                    함께라면 끝까지 갑니다.
                </h1>

                <p className="text-lg text-[#00074e]/70 leading-relaxed max-w-2xl mb-10">
                    개인정보 유출, 아파트 하자, 국가배상, 소비자 피해.<br />
                    balawso는 같은 사건의 피해자가 모여 함께 절차를 진행할 수 있도록 돕습니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 mb-10 pb-10 border-b border-[#d5e5ff] text-sm">
                    <div>
                        <p className="text-[#00074e]/60">현재 참여 원고</p>
                        <p className="font-mono font-bold text-[#4a5ba3] text-base mt-0.5">12,450명</p>
                    </div>
                    <div>
                        <p className="text-[#00074e]/60">청구 권리액</p>
                        <p className="font-mono font-bold text-[#4a5ba3] text-base mt-0.5">3,500억 원</p>
                    </div>
                    <div>
                        <p className="text-[#00074e]/60">진행 사건</p>
                        <p className="font-mono font-bold text-[#4a5ba3] text-base mt-0.5">47건</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-12">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            onCreateCampaign?.();
                        }}
                        className="px-6 py-3 bg-[#00074e] text-white rounded-md font-bold hover:bg-[#000a6e] transition-colors"
                    >
                        내 사건 등록하기
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const element = document.getElementById("categories");
                            element?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="px-6 py-3 bg-white border border-[#d5e5ff] text-[#00074e] rounded-md font-bold hover:border-[#4a5ba3] hover:bg-[#f6f9ff] transition-colors"
                    >
                        진행 중인 사건 보기
                    </button>
                </div>

                <div className="mb-10">
                    <SearchBar />
                </div>

                <CategoryChips />

                <p className="mt-12 text-sm text-[#00074e]/60">
                    변호사 선임 없이 가능한 지급명령·소액소송 절차도 안내해 드립니다.
                </p>
            </div>
        </section>
    );
}
