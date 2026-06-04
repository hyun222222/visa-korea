"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Scale, Shield, BookOpen, FileText, HelpCircle, 
    CheckCircle, ArrowRight, Upload, 
    Phone, Globe, Sparkles, Loader2, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    TRANSLATIONS, 
    SupportedLang, 
    AI_DIAGNOSIS_QUESTIONS, 
    DIAGNOSIS_RESULTS 
} from "@/lib/translations";
import { Button } from "@/components/ui/button";

export default function MedicalVisaClient({ lang }: { lang: string }) {
    const router = useRouter();
    const currentLang = (TRANSLATIONS[lang as SupportedLang] ? lang : "ko") as SupportedLang;
    const t = TRANSLATIONS[currentLang];

    // AI Diagnosis State
    const [diagType, setDiagType] = useState<'patient' | 'hospital'>('patient');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedEvidence, setSelectedEvidence] = useState<string>('');
    const [diagResult, setDiagResult] = useState<any>(null);

    // Contact Form State
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formChannel, setFormChannel] = useState('');
    const [formMessage, setFormMessage] = useState('');
    const [formFile, setFormFile] = useState<File | null>(null);
    const [formConsent, setFormConsent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    // AI Diagnosis Trigger
    const handleDiagnose = () => {
        if (!selectedCategory) return;
        const results = DIAGNOSIS_RESULTS[currentLang];
        const res = results[selectedCategory as keyof typeof results];
        if (res) {
            setDiagResult(res);
        }
    };

    // Form Submission Trigger
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formConsent) return;
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setFormSuccess(true);
        // Clear inputs
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormChannel('');
        setFormMessage('');
        setFormFile(null);
        setFormConsent(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/10 selection:text-blue-600">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-6"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        Korea Medical Visa Solution Center
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-tight max-w-5xl mx-auto mb-6"
                    >
                        {t.hero.title}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-650 max-w-3xl mx-auto leading-relaxed mb-10 font-light"
                    >
                        {t.hero.desc}
                    </motion.p>
                    <motion.div 
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row justify-center items-center gap-4"
                    >
                        <a href="#ai-diagnostic" className="w-full sm:w-auto px-8 py-4 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 bg-blue-600">
                            {t.hero.ctaPatient} <ArrowRight className="h-4 w-4" />
                        </a>
                        <a href="#services" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-205 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors font-semibold flex items-center justify-center border-slate-200">
                            {t.hero.ctaHospital}
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Trust Bar Section */}
            <section className="py-12 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="text-center text-xs font-semibold text-slate-450 uppercase tracking-widest mb-8 text-slate-550">{t.trust.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-sm font-medium text-slate-600">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center justify-center gap-2 shadow-xs">
                            <Scale className="h-6 w-6 text-blue-600" />
                            <span>{t.trust.lawyer}</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center justify-center gap-2 shadow-xs">
                            <Shield className="h-6 w-6 text-blue-600" />
                            <span>{t.trust.patent}</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center justify-center gap-2 shadow-xs">
                            <FileText className="h-6 w-6 text-blue-600" />
                            <span>{t.trust.tax}</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center justify-center gap-2 shadow-xs">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            <span>{t.trust.wealth}</span>
                        </div>
                        <div className="col-span-2 md:col-span-1 p-4 bg-blue-50/50 rounded-lg border border-blue-100 flex flex-col items-center justify-center gap-2 text-blue-600 font-bold shadow-xs">
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                            <span>{t.trust.moj}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Content Container */}
            <main className="max-w-7xl mx-auto px-4 py-20 space-y-32">

                {/* Medical Visa Section */}
                <section id="visas" className="space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t.visa.title}</h2>
                        <p className="text-slate-650 text-lg leading-relaxed">{t.visa.desc}</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.visa.c33.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">{t.visa.c33.desc}</p>
                            </div>
                            <Link href={`/${currentLang}`} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-1.5 text-sm">
                                자세히 보기 <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.visa.g110.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">{t.visa.g110.desc}</p>
                            </div>
                            <Link href={`/${currentLang}`} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-1.5 text-sm">
                                자세히 보기 <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.visa.regist.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">{t.visa.regist.desc}</p>
                            </div>
                            <Link href={`/${currentLang}#contact`} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-1.5 text-sm">
                                자세히 보기 <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{t.visa.electronic.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">{t.visa.electronic.desc}</p>
                            </div>
                            <Link href={`/${currentLang}#contact`} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center gap-1.5 text-sm">
                                자세히 보기 <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Legal Rights Section */}
                <section id="rights" className="space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t.rights.title}</h2>
                        <p className="text-slate-650 text-lg leading-relaxed">{t.rights.desc}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {t.rights.rightsList.map((right, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0 shadow-xs border border-blue-100">
                                    {idx + 1}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900 text-lg">{right.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{right.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Dispute Resolution Section */}
                <section id="disputes" className="space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t.dispute.title}</h2>
                        <p className="text-slate-650 text-lg leading-relaxed">{t.dispute.desc}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 relative">
                        {t.dispute.steps.map((step, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 text-7xl font-serif font-extrabold text-slate-100 pointer-events-none select-none">{step.num}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{step.title}</h3>
                                <p className="text-sm text-slate-650 leading-relaxed relative z-10">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* AI Diagnosis Interactive Section */}
                <section id="ai-diagnostic" className="scroll-mt-24 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 flex items-center justify-center gap-2">
                            <Sparkles className="h-6 w-6 text-blue-600" /> {t.ai.title}
                        </h2>
                        <p className="text-slate-650 text-lg leading-relaxed">{t.ai.desc}</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl mx-auto overflow-hidden shadow-sm">
                        {/* Tab Switcher */}
                        <div className="flex border-b border-slate-200 bg-slate-50">
                            <button
                                onClick={() => { setDiagType('patient'); setSelectedCategory(''); setSelectedEvidence(''); setDiagResult(null); }}
                                className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 ${diagType === 'patient' ? 'bg-white border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                {t.ai.patientTab}
                            </button>
                            <button
                                onClick={() => { setDiagType('hospital'); setSelectedCategory(''); setSelectedEvidence(''); setDiagResult(null); }}
                                className={`flex-1 py-4 text-center font-bold text-sm transition-colors border-b-2 ${diagType === 'hospital' ? 'bg-white border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                {t.ai.hospitalTab}
                            </button>
                        </div>

                        {/* Interactive Questionnaire Area */}
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold uppercase tracking-wider text-slate-500">
                                    {diagType === 'patient' ? AI_DIAGNOSIS_QUESTIONS.patient[0].label[currentLang] : AI_DIAGNOSIS_QUESTIONS.hospital[0].label[currentLang]}
                                </label>
                                <div className="grid gap-3">
                                    {(diagType === 'patient' ? AI_DIAGNOSIS_QUESTIONS.patient[0].options : AI_DIAGNOSIS_QUESTIONS.hospital[0].options).map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setSelectedCategory(opt.value); setDiagResult(null); }}
                                            className={`p-4 text-left rounded-lg text-sm border transition-all ${selectedCategory === opt.value ? 'bg-blue-50/50 border-blue-600 text-blue-900 font-semibold shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            {opt.label[currentLang]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedCategory && (
                                <div className="space-y-4 pt-4 border-t border-slate-200">
                                    <label className="block text-sm font-semibold uppercase tracking-wider text-slate-500">
                                        {diagType === 'patient' ? AI_DIAGNOSIS_QUESTIONS.patient[1].label[currentLang] : AI_DIAGNOSIS_QUESTIONS.hospital[1].label[currentLang]}
                                    </label>
                                    <div className="grid gap-3">
                                        {(diagType === 'patient' ? AI_DIAGNOSIS_QUESTIONS.patient[1].options : AI_DIAGNOSIS_QUESTIONS.hospital[1].options).map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => { setSelectedEvidence(opt.value); setDiagResult(null); }}
                                                className={`p-4 text-left rounded-lg text-sm border transition-all ${selectedEvidence === opt.value ? 'bg-blue-50/50 border-blue-600 text-blue-900 font-semibold shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                            >
                                                {opt.label[currentLang]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedCategory && selectedEvidence && !diagResult && (
                                <button
                                    onClick={handleDiagnose}
                                    className="w-full py-4 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                                >
                                    {t.ai.submit} <ArrowRight className="h-4 w-4" />
                                </button>
                            )}

                            {/* Result Rendering Card */}
                            <AnimatePresence>
                                {diagResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 15 }}
                                        className="mt-8 p-6 bg-blue-50/30 rounded-xl border border-blue-100 space-y-4 shadow-inner"
                                    >
                                        <div className="flex items-center gap-2 text-blue-700 font-bold text-lg border-b border-blue-150 pb-3 border-blue-100">
                                            <CheckCircle className="h-5 w-5 shrink-0 text-blue-600" />
                                            {diagResult.title}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs uppercase font-bold text-slate-405 tracking-wider text-slate-450">{diagResult.law ? "적용 법령 / Legal Basis" : ""}</span>
                                            <p className="text-sm font-semibold text-slate-800">{diagResult.law}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs uppercase font-bold text-slate-405 tracking-wider text-slate-450">1차 진단 처방 / Remedy Strategy</span>
                                            <p className="text-sm text-slate-650 leading-relaxed">{diagResult.remedy}</p>
                                        </div>
                                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                            <a 
                                                href="#contact" 
                                                onClick={() => setFormMessage(`[AI 진단 연계]\n선택 카테고리: ${selectedCategory}\n증빙서류 유무: ${selectedEvidence}\n\n상세 상담 요청 드립니다.`)}
                                                className="flex-1 py-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors block shadow-xs"
                                            >
                                                변호사 직접 상담 신청하기
                                            </a>
                                            <button 
                                                onClick={() => { setSelectedCategory(''); setSelectedEvidence(''); setDiagResult(null); }}
                                                className="py-3 px-6 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-sm transition-colors"
                                            >
                                                {t.ai.reset}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <p className="text-[11px] text-slate-500 mt-6 text-center">{t.ai.legalNotice}</p>
                        </div>
                    </div>
                </section>

                {/* Priority Services Grid Section */}
                <section id="services" className="scroll-mt-24 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t.services.title}</h2>
                        <p className="text-slate-650 text-lg leading-relaxed">{t.services.desc}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {t.services.list.map((serv, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-200 hover:shadow-md transition-all">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-bold text-slate-900">{serv.title}</h3>
                                        {serv.badge && (
                                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 shadow-xs">{serv.badge}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed mb-6">{serv.desc}</p>
                                </div>
                                {serv.path && (
                                    <Link href={`/${currentLang}#contact`} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors inline-flex items-center gap-1 text-xs">
                                        서비스 알아보기 <ArrowRight className="h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Process Step Section */}
                <section id="process" className="space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t.process.title}</h2>
                        <p className="text-slate-650 text-lg leading-relaxed">{t.process.desc}</p>
                    </div>
                    <div className="grid md:grid-cols-5 gap-6 text-center">
                        {t.process.steps.map((step, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="h-12 w-12 rounded-full bg-white border border-slate-200 text-blue-600 flex items-center justify-center font-serif text-lg font-bold mx-auto shadow-xs">
                                    0{idx + 1}
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">{step.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed px-2">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{t.faq.title}</h2>
                        <p className="text-slate-655 text-lg text-slate-600">{t.faq.desc}</p>
                    </div>
                    <div className="max-w-4xl mx-auto space-y-4">
                        {t.faq.list.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
                                <h3 className="font-bold text-slate-900 flex items-start gap-2 text-md">
                                    <HelpCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                    {item.q}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed pl-7">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Form Section */}
                <section id="contact" className="scroll-mt-24 max-w-4xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl p-8 md:p-12 space-y-8">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-serif font-bold text-slate-900">{t.contactForm.title}</h2>
                        <p className="text-slate-550 text-sm max-w-2xl mx-auto">{t.contactForm.desc}</p>
                    </div>

                    {formSuccess ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-3 text-green-700"
                        >
                            <CheckCircle className="h-10 w-10 mx-auto text-green-600" />
                            <p className="font-bold">{t.contactForm.success}</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.contactForm.name}</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.contactForm.email}</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.contactForm.phone}</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formPhone}
                                        onChange={(e) => setFormPhone(e.target.value)}
                                        placeholder="+82 10-0000-0000"
                                        className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.contactForm.channel}</label>
                                    <input 
                                        type="text" 
                                        value={formChannel}
                                        onChange={(e) => setFormChannel(e.target.value)}
                                        placeholder="WeChat ID / LINE ID / Kakao ID"
                                        className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.contactForm.message}</label>
                                <textarea 
                                    required 
                                    value={formMessage}
                                    onChange={(e) => setFormMessage(e.target.value)}
                                    className="w-full min-h-[120px] bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.contactForm.file}</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                            <p className="text-xs text-slate-500">{formFile ? formFile.name : "클릭하여 서류 파일 첨부"}</p>
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={(e) => { if(e.target.files) setFormFile(e.target.files[0]); }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-2.5">
                                    <input 
                                        type="checkbox" 
                                        id="consent" 
                                        required 
                                        checked={formConsent}
                                        onChange={(e) => setFormConsent(e.target.checked)}
                                        className="mt-1 h-4 w-4 bg-white border-slate-300 text-blue-600 focus:ring-0 rounded cursor-pointer"
                                    />
                                    <label htmlFor="consent" className="text-xs text-slate-500 cursor-pointer select-none leading-relaxed">
                                        {t.contactForm.sensitiveConsent}
                                    </label>
                                </div>
                                <p className="text-[10px] text-slate-450 leading-normal bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-500">
                                    <AlertCircle className="h-3.5 w-3.5 inline mr-1 text-blue-600 align-middle" />
                                    {t.contactForm.sensitiveNotice}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !formConsent}
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {t.contactForm.sending}
                                    </>
                                ) : (
                                    t.contactForm.submit
                                )}
                            </button>
                        </form>
                    )}
                </section>

                {/* Disclaimer / Legal Notice */}
                <section className="bg-slate-100 p-6 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed max-w-4xl mx-auto space-y-2">
                    <h4 className="font-bold text-slate-600 flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-slate-500" /> {t.disclaimer.title}
                    </h4>
                    <p>{t.disclaimer.text}</p>
                </section>

            </main>

            {/* Quick Messenger Float Column */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
                <a 
                    href="https://wa.me/821055346843" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                    title="WhatsApp"
                >
                    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </a>
                <a 
                    href="tel:+821055346843" 
                    className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                    title="Phone"
                >
                    <Phone className="h-5 w-5" />
                </a>
            </div>
        </div>
    );
}
