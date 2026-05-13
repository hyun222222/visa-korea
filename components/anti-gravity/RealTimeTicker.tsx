"use client";

import { motion } from "framer-motion";

interface TickerItem {
    id: number;
    title: string;
    participants: number;
    status: "모집중" | "마감임박" | "진행중";
}

const MOCK_TICKER_DATA: TickerItem[] = [
    { id: 1, title: "알리/테무 개인정보 유출 소송", participants: 3200, status: "모집중" },
    { id: 2, title: "00아파트 하자소송", participants: 53, status: "마감임박" },
    { id: 3, title: "XX카드 정보유출 집단소송", participants: 1200, status: "마감임박" },
    { id: 4, title: "△△ 게임사 확률 조작 피해", participants: 8900, status: "진행중" },
    { id: 5, title: "◇◇ 아파트 층간소음 집단소송", participants: 267, status: "모집중" },
];

function statusClasses(status: TickerItem["status"]) {
    switch (status) {
        case "모집중":
            return "text-[#4a5ba3] bg-[#d5e5ff]/60 border-[#d5e5ff]";
        case "마감임박":
            return "text-red-700 bg-red-50 border-red-200";
        case "진행중":
            return "text-[#00074e]/70 bg-[#f6f9ff] border-[#d5e5ff]";
    }
}

export function RealTimeTicker() {
    const duplicatedData = [...MOCK_TICKER_DATA, ...MOCK_TICKER_DATA];

    return (
        <div className="w-full bg-white border-b border-[#d5e5ff] py-2.5 overflow-hidden">
            <div className="relative flex">
                <motion.div
                    className="flex gap-10 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    {duplicatedData.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="flex items-center gap-3 px-2 text-sm"
                        >
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${statusClasses(item.status)}`}
                            >
                                {item.status}
                            </span>
                            <span className="text-[#00074e]">{item.title}</span>
                            <span className="font-mono text-[#4a5ba3]">
                                {item.participants.toLocaleString()}명 참여
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
