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
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-[#4a5ba3]/60 pointer-events-none" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="어떤 일을 당하셨나요? (예: 기업명, 아파트명, 피해 내용)"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#d5e5ff] rounded-md text-[#00074e] placeholder:text-[#00074e]/40 focus:outline-none focus:border-[#4a5ba3] focus:ring-1 focus:ring-[#4a5ba3] transition-colors"
                />
            </div>
        </form>
    );
}
