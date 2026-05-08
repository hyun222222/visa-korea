"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    'data-leak': '개인정보 유출',
    'apartment-defect': '아파트 하자',
    'state-liability': '국가 배상',
    'consumer-damage': '소비자 집단 피해',
};

const CATEGORY_COLORS: Record<string, string> = {
    'data-leak': 'from-red-500/20 to-red-600/5 border-red-500/30',
    'apartment-defect': 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
    'state-liability': 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
    'consumer-damage': 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
};

const CATEGORY_TEXT_COLORS: Record<string, string> = {
    'data-leak': 'text-red-400',
    'apartment-defect': 'text-blue-400',
    'state-liability': 'text-amber-400',
    'consumer-damage': 'text-emerald-400',
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
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
            </section>
        );
    }

    if (error || campaigns.length === 0) {
        return null; // Don't show section if no campaigns or error
    }

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
                        🔥 진행 중인 소송 모임
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        지금 참여할 수 있는 소송 모임입니다. 같은 피해를 입으셨다면 함께하세요.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign, index) => {
                        const categoryName = CATEGORY_DISPLAY_NAMES[campaign.category] || campaign.category;
                        const colorClass = CATEGORY_COLORS[campaign.category] || 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30';
                        const textColor = CATEGORY_TEXT_COLORS[campaign.category] || 'text-indigo-400';

                        return (
                            <motion.div
                                key={campaign.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link href={`/anti-gravity/board/${campaign.id}`}>
                                    <div className={`bg-gradient-to-br ${colorClass} border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer group h-full`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-xs font-bold tracking-wider uppercase ${textColor}`}>
                                                {categoryName}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(campaign.created_at).toLocaleDateString('ko-KR')}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                                            {campaign.title}
                                        </h3>

                                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                            {campaign.description || '설명이 없습니다.'}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Users className="h-4 w-4" />
                                                <span className="text-sm font-medium">참여하기</span>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
