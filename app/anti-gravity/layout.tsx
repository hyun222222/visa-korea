import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "바로소 | 무중력 소송 플랫폼",
    description: "기울어진 운동장을 바로 세우다. 변호사 없이 가능한 지급명령, 소액소송, 집단소송 플랫폼 바로소.",
};

export default function AntiGravityLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`${outfit.variable} font-sans bg-slate-950 text-slate-50 min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200`}>
            {/* Dark Mode Header */}
            <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/anti-gravity" className="flex items-center gap-2 group">
                            <div className="relative">
                                <Scale className="h-6 w-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full" />
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                balawso
                            </span>
                        </Link>
                    </div>

                    <nav className="flex items-center gap-6">
                        <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            메인으로 돌아가기
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="pt-16 min-h-screen">
                {children}
            </main>

            {/* Dark Mode Footer */}
            <footer className="border-t border-white/10 bg-slate-950 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} 바로소. Powered by 김앤현 법률사무소.
                    </p>
                    <p className="text-slate-600 text-xs mt-2">
                        본 서비스는 프로토타입이며, 실제 법적 효력은 변호사의 검토가 필요합니다.
                    </p>
                </div>
            </footer>
        </div>
    );
}
