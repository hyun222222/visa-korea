"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
    onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(query);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500" />

                <div className="relative flex items-center">
                    <Search className="absolute left-6 h-6 w-6 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="어떤 억울한 일을 당하셨나요?"
                        className="w-full pl-16 pr-6 py-5 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-full text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-lg"
                    />
                </div>
            </div>

            {/* Alternative Placeholder Text */}
            <p className="text-center text-slate-500 text-sm mt-3">
                예: 기업명, 아파트명, 피해 내용을 입력해보세요
            </p>
        </form>
    );
}
