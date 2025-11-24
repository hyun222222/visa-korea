"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    value: number;
    max: number;
    label: string;
    color?: string;
}

export function ProgressBar({ value, max, label, color = "bg-blue-600" }: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className="w-full space-y-1">
            <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>{label}</span>
                <span>{value} / {max}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
