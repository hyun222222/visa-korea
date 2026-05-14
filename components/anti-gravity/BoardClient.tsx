"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Users, MessageCircle, Send, Shield, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { CAMPAIGN_TEMPLATES, CampaignCategory } from "@/lib/campaign-templates";

// Category display name mapping
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    'data-leak': '개인정보 유출',
    'apartment-defect': '아파트 하자',
    'state-liability': '국가 배상',
    'consumer-damage': '소비자 집단 피해',
};

export function BoardClient({ id }: { id: string }) {
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchCampaign = async () => {
            try {
                const { data, error: dbError } = await supabase
                    .from('campaigns')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (isMounted) {
                    if (dbError) {
                        console.error("Supabase query error:", dbError);
                        setError("데이터를 불러오는 데 실패했습니다: " + dbError.message);
                    } else if (data) {
                        setCampaign(data);
                    } else {
                        setError("해당 소송 모임을 찾을 수 없습니다.");
                    }
                }
            } catch (err: any) {
                console.error("Error fetching campaign:", err);
                if (isMounted) setError("네트워크 오류가 발생했습니다.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchCampaign();

        return () => { isMounted = false; };
    }, [id]);

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        const post = {
            id: posts.length + 1,
            author: "나(익명)",
            content: newPost,
            date: new Date().toISOString().split('T')[0]
        };

        setPosts([post, ...posts]);
        setNewPost("");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-4">
                <div className="text-red-400 text-xl font-bold">⚠️ 오류 발생</div>
                <p className="text-slate-400 text-center">{error || "데이터를 불러올 수 없습니다."}</p>
                <Link
                    href="/anti-gravity"
                    className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                    메인으로 돌아가기
                </Link>
            </div>
        );
    }

    // Map fields from Supabase data
    const categoryKey = campaign.category || '';
    const categoryName = CATEGORY_DISPLAY_NAMES[categoryKey] || categoryKey;
    const title = campaign.title || '제목 없음';
    const description = campaign.description || '설명이 없습니다.';
    const openChatLink = campaign.open_chat_link || '';
    const participants = campaign.participants || 1;

    // Get template info for board tabs
    const template = CAMPAIGN_TEMPLATES[categoryKey as CampaignCategory];

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <Link href="/anti-gravity" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        목록으로 돌아가기
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <span className="text-indigo-400 font-bold text-sm tracking-wider uppercase">{categoryName}</span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{title}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-slate-300 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                                <Users className="h-5 w-5 text-indigo-500" />
                                <span className="font-bold">{participants.toLocaleString()}</span>명 참여 중
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-400 text-lg leading-relaxed border-l-4 border-indigo-500 pl-4 bg-slate-900/50 py-4 rounded-r-lg">
                        {description}
                    </p>

                    {/* Additional metadata from form */}
                    {campaign.metadata && (
                        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4">
                            <h3 className="text-white font-semibold mb-3">📋 상세 정보</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                {Object.entries(campaign.metadata).map(([key, value]) => {
                                    // Skip common fields already displayed
                                    if (['title', 'description', 'openChatLink'].includes(key)) return null;
                                    if (!value || (Array.isArray(value) && value.length === 0)) return null;

                                    // Find field label from template
                                    const fieldDef = template?.fields.find(f => f.id === key);
                                    const label = fieldDef?.label || key;
                                    const displayValue = Array.isArray(value) ? (value as string[]).join(', ') : String(value);

                                    return (
                                        <div key={key} className="flex gap-2">
                                            <span className="text-slate-500">{label}:</span>
                                            <span className="text-slate-300">{displayValue}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <a
                            href="mailto:info@kimnhyun.com"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                        >
                            <Mail className="h-5 w-5" />
                            변호사에게 문의하기
                        </a>
                        {openChatLink && (
                            <a
                                href={openChatLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 bg-[#FEE500] hover:bg-[#FDD835] text-slate-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="h-5 w-5" />
                                오픈카톡 참여
                            </a>
                        )}
                    </div>
                </div>

                {/* Board Tabs from Template */}
                {template && (
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-indigo-400" />
                            자동 생성된 게시판
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {template.boardTabs.map((tab, index) => (
                                <div key={tab.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <h3 className="font-semibold text-white">{tab.name}</h3>
                                    </div>
                                    <p className="text-sm text-slate-400">{tab.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Board Section */}
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-indigo-400" />
                        참여자 게시판
                    </h2>

                    {/* Write Post */}
                    <form onSubmit={handlePostSubmit} className="mb-8 flex gap-2">
                        <input
                            type="text"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="응원의 한마디나 궁금한 점을 남겨주세요."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button
                            type="submit"
                            className="bg-slate-800 hover:bg-slate-700 text-white px-6 rounded-lg transition-colors"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </form>

                    {/* Post List */}
                    <div className="space-y-4">
                        {posts.length === 0 && (
                            <p className="text-center text-slate-600 py-8">
                                아직 게시글이 없습니다. 첫 번째 글을 남겨보세요!
                            </p>
                        )}
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-950/50 border border-slate-800/50 rounded-lg p-4"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-slate-300">{post.author}</span>
                                    <span className="text-xs text-slate-600">{post.date}</span>
                                </div>
                                <p className="text-slate-400">{post.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
