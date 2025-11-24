"use client";

import { useState } from "react";
import { useVisaStore } from "@/store/visa-store";
import { Step1Personal } from "./Step1Personal";
import { Step2Eligibility } from "./Step2Eligibility";
import { Step3Review } from "./Step3Review";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

export function VisaWizard() {
    const [step, setStep] = useState(1);
    const { profile, setRecommendations } = useVisaStore();
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (step === 2) {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                const res = await fetch('/api/visa/recommend', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profile)
                });
                const data = await res.json();
                setRecommendations(data.recommendations);
                setStep(3);
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            } finally {
                setLoading(false);
            }
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const steps = [
        { id: 1, name: "Applicant Profile" },
        { id: 2, name: "Professional History" },
        { id: 3, name: "Legal Assessment" }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Formal Stepper */}
            <div className="mb-10 border-b border-slate-200 pb-6">
                <div className="flex items-center justify-center space-x-4">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div className={`flex items-center ${step >= s.id ? 'text-primary' : 'text-slate-400'}`}>
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif font-bold border-2
                                    ${step >= s.id ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white text-slate-500'}
                                `}>
                                    {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                                </div>
                                <span className={`ml-3 text-sm font-medium uppercase tracking-wide ${step >= s.id ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {s.name}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="w-16 h-px bg-slate-300 mx-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Card className="border border-slate-200 shadow-sm bg-white rounded-sm">
                <CardContent className="p-10">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20 space-y-6"
                            >
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                <div className="text-center">
                                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Processing Application Data</h3>
                                    <p className="text-slate-500">Cross-referencing with Immigration Control Act 2025...</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-8 border-b border-slate-100 pb-4">
                                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                                        {step === 1 && "Applicant Personal Information"}
                                        {step === 2 && "Professional Background & Experience"}
                                        {step === 3 && "Eligibility Assessment Report"}
                                    </h2>
                                    <p className="text-slate-500 text-sm">
                                        {step === 1 && "Please provide accurate personal details for preliminary assessment."}
                                        {step === 2 && "Information regarding your employment and career history."}
                                        {step === 3 && "Based on the provided data, the following visa categories are recommended."}
                                    </p>
                                </div>

                                {step === 1 && <Step1Personal />}
                                {step === 2 && <Step2Eligibility />}
                                {step === 3 && <Step3Review />}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!loading && step < 3 && (
                        <div className="flex justify-between mt-10 pt-6 border-t border-slate-100">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={step === 1}
                                className="border-slate-300 text-slate-600 hover:bg-slate-50 rounded-sm px-6"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>

                            <Button
                                onClick={handleNext}
                                className="bg-primary hover:bg-primary/90 text-white rounded-sm px-8 shadow-sm"
                            >
                                {step === 2 ? "Generate Assessment" : "Continue"}
                                {step !== 2 && <ChevronRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex justify-center mt-10 pt-6 border-t border-slate-100">
                            <Button onClick={() => setStep(1)} variant="outline" className="mr-4 border-slate-300 rounded-sm">
                                New Assessment
                            </Button>
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-sm shadow-sm">
                                Download Official Report
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
