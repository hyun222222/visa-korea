"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Scale, Menu, X, Globe, ChevronDown } from "lucide-react";
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
        ko: { about: "소개", check: "자가진단", medical: "의료관광 비자", board: "게시판", blog: "블로그", contact: "상담 신청", invest: "한국 투자 가이드" },
        en: { about: "About", check: "Eligibility Check", medical: "Medical Visa", board: "Q&A Board", blog: "Blog", contact: "Consultation", invest: "Investing in Korea" },
        zh: { about: "关于我们", check: "签证评估", medical: "医疗签证", board: "问答板块", blog: "博客", contact: "法律咨询", invest: "投资韩国" },
        ja: { about: "紹介", check: "適性診断", medical: "医療ビザ", board: "掲示板", blog: "ブログ", contact: "相談申込み", invest: "韓国投資" }
    }[currentLang];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all duration-200">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo & Brand Name */}
                <Link href={`/${currentLang}`} className="flex items-center gap-2.5 shrink-0 whitespace-nowrap group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
                        <Scale className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col whitespace-nowrap shrink-0">
                        <span className="text-sm font-bold text-slate-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">김앤현 법률사무소</span>
                        <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase leading-none whitespace-nowrap shrink-0">Kim & Hyun Law Office</span>
                    </div>
                </Link>

                {/* Desktop nav (shown on large screens lg and above, dynamic font sizes/gaps to prevent wrapping) */}
                <nav className="hidden lg:flex items-center gap-0.5 xl:gap-3.5 text-[11px] xl:text-sm font-medium text-slate-650 shrink-0">
                    <Link href={`/${currentLang}#about`} className="px-2.5 py-1.5 rounded-full hover:text-blue-600 hover:bg-slate-50 transition-all duration-200 whitespace-nowrap shrink-0">{m.about}</Link>
                    <Link href={`/${currentLang}#calculators`} className="px-2.5 py-1.5 rounded-full hover:text-blue-600 hover:bg-slate-50 transition-all duration-200 whitespace-nowrap shrink-0">{m.check}</Link>
                    <Link href={`/${currentLang}/medical-visa`} className="px-2.5 py-1.5 rounded-full text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/70 border border-amber-200/50 hover:border-amber-300 transition-all duration-200 whitespace-nowrap font-semibold shadow-sm shrink-0">{m.medical}</Link>
                    <Link href={`/${currentLang}/investing-in-korea`} className="px-2.5 py-1.5 rounded-full hover:text-blue-600 hover:bg-slate-50 transition-all duration-200 whitespace-nowrap shrink-0">{m.invest}</Link>
                    <Link href={currentLang === 'ko' ? '/blog' : `/${currentLang}/blog`} className="px-2.5 py-1.5 rounded-full hover:text-blue-600 hover:bg-slate-50 transition-all duration-200 whitespace-nowrap shrink-0">{m.blog}</Link>
                    <Link href="/board" className="px-2.5 py-1.5 rounded-full hover:text-blue-600 hover:bg-slate-50 transition-all duration-200 whitespace-nowrap shrink-0">{m.board}</Link>
                </nav>

                {/* Right Area: Language switcher & Action buttons */}
                <div className="flex items-center gap-2 xl:gap-3 shrink-0">
                    {/* Premium Dropdown Language Switcher */}
                    <div className="relative group shrink-0">
                        <button className="flex items-center gap-1 bg-slate-100/80 hover:bg-slate-150/80 px-2.5 py-1.5 rounded-full border border-slate-200/40 text-[11px] xl:text-xs font-bold text-slate-700 transition-all duration-200 shrink-0">
                            <Globe className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span className="shrink-0">{currentLang.toUpperCase()}</span>
                            <ChevronDown className="h-3 w-3 text-slate-400 group-hover:rotate-180 transition-transform duration-200 shrink-0" />
                        </button>
                        <div className="absolute right-0 mt-1 hidden group-hover:block bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 min-w-[90px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            {supportedLangs.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => changeLanguage(lang)}
                                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors whitespace-nowrap shrink-0 ${
                                        currentLang === lang
                                            ? "text-blue-600 font-bold bg-blue-50/50"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                                >
                                    {lang === 'ko' ? '한국어 (KO)' : lang === 'en' ? 'English (EN)' : lang === 'zh' ? '中文 (ZH)' : '日本語 (JA)'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* WhatsApp (always visible on desktop headers now) */}
                    <a href="https://wa.me/821055346843" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0">
                        <Button variant="outline" size="sm" className="gap-1.5 h-8.5 text-xs rounded-full border-emerald-200 hover:border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 shadow-sm transition-all duration-200 whitespace-nowrap shrink-0">
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            WhatsApp
                        </Button>
                    </a>

                    {/* Consultation CTA (always visible on desktop headers) */}
                    <Link href={`/${currentLang}#contact`} className="inline-flex shrink-0">
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold h-8.5 text-xs px-4 rounded-full shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all duration-200 whitespace-nowrap shrink-0">{m.contact}</Button>
                    </Link>

                    {/* Mobile hamburger (shown below lg breakpoint) */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all duration-200"
                        aria-label="메뉴 열기"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu (hidden on lg and above) */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden overflow-hidden border-t border-slate-200 bg-white"
                    >
                        <nav className="flex flex-col px-4 py-4 space-y-1">
                            <MobileNavLink href={`/${currentLang}#about`} label={m.about} onClick={() => setMobileOpen(false)} />
                            <MobileNavLink href={`/${currentLang}#calculators`} label={m.check} onClick={() => setMobileOpen(false)} />
                            <MobileNavLink href={`/${currentLang}/medical-visa`} label={m.medical} onClick={() => setMobileOpen(false)} />
                            <MobileNavLink href={`/${currentLang}/investing-in-korea`} label={m.invest} onClick={() => setMobileOpen(false)} />
                            <MobileNavLink href={currentLang === 'ko' ? '/blog' : `/${currentLang}/blog`} label={m.blog} onClick={() => setMobileOpen(false)} />
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
