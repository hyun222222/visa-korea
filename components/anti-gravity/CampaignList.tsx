"use client";

import { motion } from "framer-motion";
import { Users, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

interface CampaignListProps {
    campaigns: any[];
    onCreateCampaign: () => void;
}

export function CampaignList({ campaigns, onCreateCampaign }: CampaignListProps) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">진행 중인 소송 모임</h2>
                    <p className="text-slate-400">
                        혼자가 아닙니다. 같은 피해를 입은 사람들과 연대하세요.
                    </p>
                </div>
                <button
                    onClick={onCreateCampaign}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="h-5 w-5" />
                    소송 모임 만들기
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign, index) => (
                    <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-slate-900/50 border border-white/10 rounded-xl p-6 hover:bg-slate-800/50 transition-all hover:border-indigo-500/50"
                    >
                        <div className="absolute top-6 right-6">
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20">
                                {campaign.status}
                            </span>
                        </div>

                        <div className="mb-4">
                            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                                {campaign.category}
                            </span>
                            <h3 className="text-xl font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                                {campaign.title}
                            </h3>
                        </div>

                        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                            {campaign.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Users className="h-4 w-4" />
                                <span>{campaign.participants.toLocaleString()}명 참여</span>
                            </div>

                            <Link
                                href={`/anti-gravity/board/${campaign.id}`}
                                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                            >
                                참여하기 <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
