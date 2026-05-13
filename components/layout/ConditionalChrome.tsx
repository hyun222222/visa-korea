"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isBalawso = pathname?.startsWith("/anti-gravity");

    if (isBalawso) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
