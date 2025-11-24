"use client";

import { useVisaStore } from "@/store/visa-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, FileText, ArrowRight, Scale } from "lucide-react";
import { AnimateWrapper } from "@/components/ui/animate-wrapper";

export function Step3Review() {
    const { recommendations } = useVisaStore();

    if (recommendations.length === 0) {
        return (
            <div className="text-center py-10 border border-dashed border-slate-300 rounded-sm">
                <p className="text-slate-500">No recommendations generated.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {recommendations.map((rec, index) => (
                <AnimateWrapper key={rec.id} delay={index * 0.1}>
                    <div className={`
                        border rounded-sm p-6 transition-all
                        ${rec.probability === 'HIGH' ? 'border-primary/20 bg-slate-50' : 'border-slate-200 bg-white'}
                    `}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-serif font-bold text-slate-900">{rec.name}</h3>
                                    {rec.probability === 'HIGH' && (
                                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> Highly Recommended
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 font-medium">
                                    Eligibility Status: <span className={`font-bold ${rec.probability === 'HIGH' ? 'text-green-700' :
                                            rec.probability === 'MEDIUM' ? 'text-amber-600' : 'text-red-600'
                                        }`}>{rec.probability}</span>
                                </p>
                            </div>
                            <div className="text-slate-300">
                                <Scale className="h-8 w-8" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">Legal Basis</h4>
                                <ul className="space-y-2">
                                    {rec.reason.map((r, i) => (
                                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2 leading-relaxed">
                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-1">Required Documentation</h4>
                                {rec.requirements.length > 0 ? (
                                    <ul className="space-y-2">
                                        {rec.requirements.map((r, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                                <FileText className="h-3 w-3 text-slate-400" />
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">Standard documentation applies.</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end">
                            <Button className={`
                                ${rec.probability === 'HIGH' ? 'bg-primary hover:bg-primary/90' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}
                                rounded-sm font-medium px-6
                            `}>
                                Initiate Application <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </AnimateWrapper>
            ))}
        </div>
    );
}
