"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, AlertCircle, ArrowLeft, CheckCircle, FileText, Globe } from "lucide-react";

export default function EnglishMedicalVisaPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-16 px-4 selection:bg-blue-500/10 selection:text-blue-600">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Back Button */}
                <div className="flex justify-between items-center border-b border-slate-200 pb-6">
                    <Link href="/en" className="text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" /> Back to Main
                    </Link>
                    <span className="text-xs text-blue-650 font-bold tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-blue-600 shadow-xs">
                        Korea Medical Visa Guide
                    </span>
                </div>

                {/* Main Hero Summary */}
                <div className="space-y-4 text-center">
                    <div className="inline-flex h-12 w-12 rounded-full bg-blue-50 items-center justify-center text-blue-600 mb-2 border border-blue-100 shadow-xs">
                        <Globe className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                        C-3-3 & G-1-10 Medical Visas
                    </h1>
                    <p className="text-slate-650 text-lg max-w-2xl mx-auto leading-relaxed">
                        Complete legal guidance for international patients entering South Korea for cosmetic surgery, wellness, or long-term medical therapies.
                    </p>
                </div>

                {/* Requirements Table Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" /> Requirements & Application Criteria
                    </h2>
                    <div className="space-y-4 text-sm text-slate-650 leading-relaxed">
                        <p>
                            According to the Korean Ministry of Justice guidelines, medical visa applicants must secure an official invitation letter from a legally registered host medical agency.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-blue-650 border-l-blue-600">
                            <span className="block text-xs font-bold uppercase text-slate-500 mb-2">Required Documentation Checklist:</span>
                            <ul className="list-disc pl-5 space-y-2 text-slate-605 text-xs text-slate-600">
                                <li><strong>Invitation Letter:</strong> Issued by a registered hospital or travel agency licensed by the Ministry of Health.</li>
                                <li><strong>Proof of Treatment:</strong> Official medical diagnosis certificate and therapy schedule from the Korean clinic.</li>
                                <li><strong>Financial Sufficiency:</strong> Bank statements proving ability to cover medical expenses and living costs in Korea.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Instant Assessment Intake Form */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 text-center">Free Medical Visa Assessment</h3>
                    <p className="text-slate-500 text-xs text-center max-w-lg mx-auto">
                        Enter your email address and primary nationality to receive an automated legal requirements pack compiled by our attorneys.
                    </p>

                    {submitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700 text-sm">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            Success! The C-3-3/G-1-10 document checklists have been sent to your email.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="email" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your Email Address"
                                className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button 
                                type="submit" 
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-xs"
                            >
                                Send Requirements Checklist
                            </button>
                        </form>
                    )}
                </div>

                {/* Footnote */}
                <p className="text-center text-[10px] text-slate-400">
                    * The C-3-3 visa is for stays under 90 days. The G-1-10 visa supports stays up to 1 year and requires proof of medical necessity.
                </p>
            </div>
        </div>
    );
}
