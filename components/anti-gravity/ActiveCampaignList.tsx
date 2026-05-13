"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    'data-leak': '개인정보 유출',
    'apartment-defect': '아파트 하자',
    'state-liability': '국가 배상',
    'consumer-damage': '소비자 집단 피해',
};

interface Campaign {
    id: string;
    title: string;
    category: string;
    description: string;
    status: string;
    created_at: string;
}

export function ActiveCampaignList() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const { data, error: dbError } = await supabase
                    .from('campaigns')
                    .select('id, title, category, description, status, created_at')
                    .eq('status', 'active')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (dbError) {
                    console.error("Error fetching campaigns:", dbError);
                    setError(true);
                } else {
                    setCampaigns(data || []);
                }
            } catch (err) {
                console.error("Network error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    if (loading) {
        return (
            <section className="py-16">
                <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 text-[#4a5ba3] animate-spin" />
                </div>
            </section>
        );
    }

    if (error || campaigns.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <p className="text-xs uppercase r text-[#4a5ba3] font-bold mb-3">
                        Now Active
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#00074e] mb-2">
                        진행 중인 소송 모임
                    </h2>
                    <p className="text-[#00074e]/70">
                        지금 참여할 수 있는 소송 모임입니다. 같은 피해라면 함께하세요.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#d5e5ff] border border-[#d5e5ff] rounded-lg overflow-hidden">
                    {campaigns.map((campaign) => {
                        const categoryName =
                            CATEGORY_DISPLAY_NAMES[campaign.category] || campaign.category;

                        return (
                            <Link
                                key={campaign.id}
                                href={`/anti-gravity/board/${campaign.id}`}
                                className="group bg-white p-6 hover:bg-[#f6f9ff] transition-colors flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-[#4a5ba3] ">
                                        {categoryName}
                                    </span>
                                    <span className="text-xs text-[#4a5ba3]/70 font-mono">
                                        {new Date(campaign.created_at).toLocaleDateString('ko-KR')}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-[#00074e] mb-2 line-clamp-2">
                                    {campaign.title}
                                </h3>

                                <p className="text-sm text-[#00074e]/70 mb-5 line-clamp-2 flex-1">
                                    {campaign.description || '설명이 없습니다.'}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-[#d5e5ff]">
                                    <span className="text-sm font-bold text-[#00074e]">
                                        참여하기
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-[#4a5ba3]/60 group-hover:text-[#4a5ba3] group-hover:translate-x-0.5 transition-all" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
