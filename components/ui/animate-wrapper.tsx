"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimateWrapperProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function AnimateWrapper({ children, className, delay = 0 }: AnimateWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function FadeIn({ children, className, delay = 0 }: AnimateWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
