"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scale, Menu, X, Globe } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname() || "";
    const router = useRouter();

    const supportedLangs = ['ko', 'en', 'zh', 'ja'] as const;
    type Lang = typeof supportedLangs[number];
    const pathParts = pathname.split('/');
    const currentLang: Lang = (supportedLangs.includes(pathParts[1] as any) ? pathParts[1] : 'ko') as Lang;

    const changeLanguage = (newLang: Lang) => {
        if (supportedLangs.includes(pathParts[1] as any)) {
            const newParts = [...pathParts];
            newParts[1] = newLang;

            // Handle blog detail page: /[lang]/blog/[slug]
            if (pathParts[2] === 'blog' && pathParts[3]) {
                let baseSlug = pathParts[3];
                for (const suffix of ['-en', '-zh', '-ja']) {
                    if (baseSlug.endsWith(suffix)) {
                        baseSlug = baseSlug.slice(0, -suffix.length);
                        break;
                    }
                }
                if (newLang !== 'ko') {
                    newParts[3] = `${baseSlug}-${newLang}`;
                } else {
                    newParts[3] = baseSlug;
                }
            }

            router.push(newParts.join('/'));
        } else {
            // Handle blog detail page at root level: /blog/[slug] (implicit ko)
            if (pathParts[1] === 'blog' && pathParts[2]) {
                let baseSlug = pathParts[2];
                for (const suffix of ['-en', '-zh', '-ja']) {
                    if (baseSlug.endsWith(suffix)) {
                        baseSlug = baseSlug.slice(0, -suffix.length);
                        break;
                    }
                }
                const newSlug = newLang !== 'ko' ? `${baseSlug}-${newLang}` : baseSlug;
                router.push(`/${newLang}/blog/${newSlug}`);
            } else {
                if (pathname === '/') {
                    router.push(`/${newLang}`);
                } else {
                    router.push(`/${newLang}${pathname}`);
                }
            }
        }
    };

    const m = {
        ko: { about: "소개", check: "자가진단", medical: "의료관광 비자", board: "게시판", contact: "상담 신청" },
        en: { about: "About", check: "Eligibility Check", medical: "Medical Visa", board: "Q&A Board", contact: "Consultation" },
        zh: { about: "关于我们", check: "签证评估", medical: "医疗签证", board: "问答板块", contact: "法律咨询" },
        ja: { about: "紹介", check: "適性診断", medical: "医療ビザ", board: "掲示板", contact: "相談申込み" }
    }[currentLang];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href={`/${currentLang}`} className="flex items-center gap-2">
                    <Scale className="h-6 w-6 text-blue-600" />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900 leading-none">김앤현 법률사무소</span>
                        <span className="text-[10px] text-slate-500 font-medium">Kim & Hyun Law Office</span>
                    </div>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                    <Link href={`/${currentLang}#about`} className="hover:text-blue-600 transition-colors">{m.about}</Link>
                    <Link href={`/${currentLang}#calculators`} className="hover:text-blue-600 transition-colors">{m.check}</Link>
                    <Link href={`/${currentLang}/medical-visa`} className="hover:text-amber-600 text-amber-700 font-semibold transition-colors bg-amber-50 px-2 py-0.5 rounded border border-amber-250/30">{m.medical}</Link>
                    <Link href="/board" className="hover:text-blue-600 transition-colors">{m.board}</Link>
                </nav>

                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mr-2 border border-slate-200 rounded-md px-2 py-1 bg-slate-50">
                        <Globe className="h-3.5 w-3.5 text-slate-500" />
                        <button onClick={() => changeLanguage('ko')} className={`hover:text-blue-600 transition-colors ${currentLang === 'ko' ? 'text-blue-600 font-bold' : ''}`}>KO</button>
                        <span>|</span>
                        <button onClick={() => changeLanguage('en')} className={`hover:text-blue-600 transition-colors ${currentLang === 'en' ? 'text-blue-600 font-bold' : ''}`}>EN</button>
                        <span>|</span>
                        <button onClick={() => changeLanguage('zh')} className={`hover:text-blue-600 transition-colors ${currentLang === 'zh' ? 'text-blue-600 font-bold' : ''}`}>ZH</button>
                        <span>|</span>
                        <button onClick={() => changeLanguage('ja')} className={`hover:text-blue-600 transition-colors ${currentLang === 'ja' ? 'text-blue-600 font-bold' : ''}`}>JA</button>
                    </div>

                    <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
                        Tel: +82 10-5534-6843
                    </Button>
                    <a href="https://wa.me/821055346843" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="hidden md:inline-flex gap-2">
                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-green-600"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            WhatsApp
                        </Button>
                    </a>
                    <Link href={`/${currentLang}#contact`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 hidden md:inline-flex">{m.contact}</Button>
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
                        aria-label="메뉴 열기"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden border-t border-slate-200 bg-white"
                    >
                        <nav className="flex flex-col px-4 py-4 space-y-1">
                            <MobileNavLink href={`/${currentLang}#about`} label={m.about} onClick={() => setMobileOpen(false)} />
                            <MobileNavLink href={`/${currentLang}#calculators`} label={m.check} onClick={() => setMobileOpen(false)} />
                            <MobileNavLink href={`/${currentLang}/medical-visa`} label={m.medical} onClick={() => setMobileOpen(false)} />
                            <MobileNavLink href="/board" label={m.board} onClick={() => setMobileOpen(false)} />

                            <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
                                <a
                                    href="tel:+821055346843"
                                    className="block text-sm text-slate-600 py-2 px-3 rounded-md hover:bg-slate-50"
                                >
                                    📞 +82 10-5534-6843
                                </a>
                                <a
                                    href="https://wa.me/821055346843"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-green-700 font-medium py-2 px-3 rounded-md hover:bg-green-50"
                                >
                                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                    WhatsApp
                                </a>
                                <Link
                                    href={`/${currentLang}#contact`}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 py-2.5 px-4 rounded-md transition-colors"
                                >
                                    {m.contact}
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-sm font-medium text-slate-700 py-2.5 px-3 rounded-md hover:bg-slate-50 hover:text-blue-600 transition-colors"
        >
            {label}
        </Link>
    );
}
