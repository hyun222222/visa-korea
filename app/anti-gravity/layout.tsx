import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "balawso | 김앤현 법률사무소",
    description: "변호사 없이도 가능한 지급명령·소액소송·집단소송 안내. 김앤현 법률사무소에서 운영합니다.",
};

export default function AntiGravityLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="font-sans bg-white text-[#00074e] min-h-screen antialiased">
            <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-[#d5e5ff]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/anti-gravity" className="font-bold text-lg tracking-tight text-[#00074e]">
                        balawso
                    </Link>

                    <nav className="flex items-center gap-6 text-sm text-[#00074e]/70">
                        <Link href="#categories" className="hover:text-[#00074e] transition-colors">
                            소송 분야
                        </Link>
                        <Link href="#diagnosis" className="hover:text-[#00074e] transition-colors">
                            자가진단
                        </Link>
                        <Link href="/" className="hover:text-[#00074e] transition-colors">
                            메인
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="min-h-screen">
                {children}
            </main>

            <footer className="border-t border-[#d5e5ff] bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm text-[#00074e]/60">
                        <div>
                            <p className="text-[#00074e] font-bold">balawso</p>
                            <p className="mt-1">김앤현 법률사무소에서 운영합니다.</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <p>© {new Date().getFullYear()} balawso</p>
                            <p className="mt-1 text-xs text-[#00074e]/50">
                                본 페이지의 정보는 일반 안내이며, 구체적 사안은 변호사 상담을 권장합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
