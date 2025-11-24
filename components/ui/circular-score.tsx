"use client";

import { motion } from "framer-motion";

interface CircularScoreProps {
    score: number;
    max: number;
    size?: number;
    strokeWidth?: number;
}

export function CircularScore({ score, max, size = 120, strokeWidth = 8 }: CircularScoreProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min(100, Math.max(0, (score / max) * 100));
    const offset = circumference - (percentage / 100) * circumference;
    const isPass = score >= 80;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    className="text-gray-200"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Circle */}
                <motion.circle
                    className={isPass ? "text-green-500" : "text-red-500"}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference} // Start empty
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl font-bold text-gray-900"
                >
                    {score}
                </motion.span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${isPass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                    {isPass ? "PASS" : "FAIL"}
                </motion.span>
            </div>
        </div>
    );
}
