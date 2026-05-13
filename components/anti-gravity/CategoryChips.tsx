"use client";

interface CategoryChip {
    id: string;
    label: string;
    targetSection: string;
}

const CATEGORIES: CategoryChip[] = [
    { id: "money", label: "떼인 돈", targetSection: "consumer-diagnosis" },
    { id: "apartment", label: "아파트 하자", targetSection: "diagnosis" },
    { id: "privacy", label: "개인정보 유출", targetSection: "leak-diagnosis" },
    { id: "medical", label: "의료·소비자 분쟁", targetSection: "consumer-diagnosis" },
];

export function CategoryChips() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-[#00074e]/60 mr-1">바로가기:</span>
            {CATEGORIES.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    onClick={() => scrollToSection(category.targetSection)}
                    className="px-3.5 py-1.5 bg-[#d5e5ff]/40 border border-[#d5e5ff] hover:border-[#4a5ba3] hover:bg-[#d5e5ff]/70 rounded-full text-sm font-bold text-[#00074e] transition-colors"
                >
                    {category.label}
                </button>
            ))}
        </div>
    );
}
