"use client";

import { motion } from "framer-motion";

interface CategoryChip {
    id: string;
    label: string;
    emoji: string;
    targetSection: string;
}

const CATEGORIES: CategoryChip[] = [
    { id: "money", label: "떼인 돈", emoji: "💰", targetSection: "consumer-diagnosis" },
    { id: "apartment", label: "아파트 하자", emoji: "🏠", targetSection: "diagnosis" },
    { id: "privacy", label: "개인정보 유출", emoji: "📱", targetSection: "leak-diagnosis" },
    { id: "medical", label: "의료/소비자", emoji: "💊", targetSection: "consumer-diagnosis" },
];

export function CategoryChips() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="flex flex-wrap justify-center gap-3 mt-8">
            {CATEGORIES.map((category, index) => (
                <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(category.targetSection)}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-indigo-500/50 rounded-full text-white font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20"
                >
                    <span className="text-xl">{category.emoji}</span>
                    <span>{category.label}</span>
                </motion.button>
            ))}
        </div>
    );
}
