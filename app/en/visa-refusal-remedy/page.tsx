"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, AlertCircle, ArrowLeft, CheckCircle, FileText, Scale } from "lucide-react";

export default function EnglishVisaRefusalRemedyPage() {
    const [caseDetails, setCaseDetails] = useState('');
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
                        Immigration Administrative Appeals
                    </span>
                </div>

                {/* Main Hero Summary */}
                <div className="space-y-4 text-center">
                    <div className="inline-flex h-12 w-12 rounded-full bg-blue-50 items-center justify-center text-blue-600 mb-2 border border-blue-100 shadow-xs">
                        <Scale className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                        Visa Denial Remedies & Appeals
                    </h1>
                    <p className="text-slate-650 text-lg max-w-2xl mx-auto leading-relaxed">
                        Was your Korean entry visa denied? Our immigration attorneys draft formal petitions to contest arbitrary visa refusals and secure entry clearances.
                    </p>
                </div>

                {/* Legal Analysis */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" /> Contesting Discretionary Visa Denials
                    </h2>
                    <div className="space-y-4 text-sm text-slate-650 leading-relaxed">
                        <p>
                            Korean Consulates hold broad discretionary power when reviewing visa applications. A secondary denial is highly probable if you simply re-submit identical documents.
                        </p>
                        <p>
                            A successful remedy requires filing a formal **Administrative Appeal** contesting the specific grounds of refusal or drafting a rigorous legal explanation statement backed by an authorized immigration agency.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-blue-600">
                            <span className="block text-xs font-bold uppercase text-slate-500 mb-2">Denial Remonstrance Process:</span>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                                <li><strong>Pre-Evaluation:</strong> Analyze the specific codes cited on the denial notice document.</li>
                                <li><strong>Appeal Petition:</strong> Draft and lodge a formal complaint with the Ministry of Justice within 90 days.</li>
                                <li><strong>Agency Guarantee:</strong> Support the petition with certified sponsor credentials from a licensed law office.</li>
                             </ul>
                        </div>
                    </div>
                </div>

                {/* Intake Form */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 text-center">Consult a Refusal Remedy Attorney</h3>
                    <p className="text-slate-500 text-xs text-center max-w-lg mx-auto">
                        Describe the refusal grounds cited by the consulate to initiate a complimentary case viability assessment.
                    </p>

                    {submitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700 text-sm">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            Submitted successfully. An immigration lawyer will review your details and reach out within 24 hours.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea 
                                required 
                                value={caseDetails}
                                onChange={(e) => setCaseDetails(e.target.value)}
                                placeholder="State the visa category, denial reason code, and any previous visa history."
                                className="w-full min-h-[100px] bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            />
                            <button 
                                type="submit" 
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-xs"
                            >
                                Request Case Review
                            </button>
                        </form>
                    )}
                </div>

                {/* Footnote */}
                <p className="text-center text-[10px] text-slate-400">
                    * Authorized representation services are executed by Kim&Hyun Law Office under Ministry of Justice registration.
                </p>
            </div>
        </div>
    );
}
