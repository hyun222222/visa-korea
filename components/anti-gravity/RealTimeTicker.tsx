"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Clock } from "lucide-react";

interface TickerItem {
    id: number;
    title: string;
    participants: number;
    status: "모집중" | "마감임박" | "진행중";
    icon: "fire" | "warning" | "check";
}

const MOCK_TICKER_DATA: TickerItem[] = [
    {
        id: 1,
        title: "알리/테무 개인정보 유출 소송",
        participants: 3200,
        status: "모집중",
        icon: "fire",
    },
    {
        id: 2,
        title: "00아파트 하자소송",
        participants: 53,
        status: "마감임박",
        icon: "warning",
    },
    {
        id: 3,
        title: "XX카드 정보유출 집단소송",
        participants: 1200,
        status: "마감임박",
        icon: "warning",
    },
    {
        id: 4,
        title: "△△ 게임사 확률 조작 피해",
        participants: 8900,
        status: "진행중",
        icon: "check",
    },
    {
        id: 5,
        title: "◇◇ 아파트 층간소음 집단소송",
        participants: 267,
        status: "모집중",
        icon: "fire",
    },
];

export function RealTimeTicker() {
    // 티커를 두 번 반복하여 무한 스크롤 효과
    const duplicatedData = [...MOCK_TICKER_DATA, ...MOCK_TICKER_DATA];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "모집중":
                return "text-emerald-400";
            case "마감임박":
                return "text-orange-400";
            case "진행중":
                return "text-blue-400";
            default:
                return "text-slate-400";
        }
    };

    const getIcon = (iconType: string) => {
        switch (iconType) {
            case "fire":
                return "🔥";
            case "warning":
                return "⚠️";
            case "check":
                return "⚖️";
            default:
                return "•";
        }
    };

    return (
        <div className="w-full bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-y border-white/5 py-3 overflow-hidden">
            <div className="relative flex">
                <motion.div
                    className="flex gap-8 whitespace-nowrap"
                    animate={{
                        x: [0, -50 + "%"],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {duplicatedData.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="flex items-center gap-3 px-4"
                        >
                            <span className="text-xl">{getIcon(item.icon)}</span>
                            <span className={`font-semibold ${getStatusColor(item.status)}`}>
                                [{item.status}]
                            </span>
                            <span className="text-white font-medium">
                                {item.title}
                            </span>
                            <span className="flex items-center gap-1 text-indigo-300 font-mono font-semibold">
                                <Users className="h-4 w-4" />
                                +{item.participants.toLocaleString()}명
                            </span>
                            <span className="text-slate-600">|</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
