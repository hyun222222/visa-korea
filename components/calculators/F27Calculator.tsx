"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimateWrapper } from "@/components/ui/animate-wrapper";
import { CircularScore } from "@/components/ui/circular-score";
import { ProgressBar } from "@/components/ui/progress-bar";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, FileText, ChevronRight, RefreshCw, Scale } from "lucide-react";

export function F27Calculator() {
    const [score, setScore] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Input, 2: Analysis, 3: Result

    const [formData, setFormData] = useState({
        age: 30,
        education: 'bachelor',
        annualIncome: 35000000,
        koreanLevel: 1,
        socialIntegrationProgram: false
    });

    const calculate = async () => {
        setLoading(true);
        setStep(2);

        // Simulate Processing time
        setTimeout(async () => {
            const res = await fetch('/api/visa/calculate-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visaType: 'F-2-7',
                    profile: formData
                })
            });
            const data = await res.json();
            setScore(data);
            setLoading(false);
            setStep(3);
        }, 1500);
    };

    const reset = () => {
        setScore(null);
        setStep(1);
    }

    return (
        <Card className="w-full overflow-hidden border border-slate-200 shadow-sm bg-white rounded-sm">
            <CardContent className="p-6">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <AnimateWrapper key="input">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-medium">Age</Label>
                                        <Input
                                            type="number"
                                            className="bg-white border-slate-300 focus:ring-primary rounded-sm"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-medium">Annual Income (KRW)</Label>
                                        <Input
                                            type="number"
                                            className="bg-white border-slate-300 focus:ring-primary rounded-sm"
                                            value={formData.annualIncome}
                                            onChange={(e) => setFormData({ ...formData, annualIncome: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Highest Education</Label>
                                    <Select
                                        value={formData.education}
                                        onValueChange={(val) => setFormData({ ...formData, education: val })}
                                    >
                                        <SelectTrigger className="bg-white border-slate-300 rounded-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="doctor">Doctorate (Ph.D)</SelectItem>
                                            <SelectItem value="master">Master's Degree</SelectItem>
                                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                                            <SelectItem value="associate">Associate Degree</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-medium">Korean Ability (TOPIK)</Label>
                                    <Select
                                        value={formData.koreanLevel.toString()}
                                        onValueChange={(val) => setFormData({ ...formData, koreanLevel: parseInt(val) })}
                                    >
                                        <SelectTrigger className="bg-white border-slate-300 rounded-sm"><SelectValue placeholder="Select Level" /></SelectTrigger>
                                        <SelectContent>
                                            {[0, 1, 2, 3, 4, 5, 6].map(level => (
                                                <SelectItem key={level} value={level.toString()}>
                                                    {level === 0 ? 'None' : `TOPIK Level ${level}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    onClick={calculate}
                                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-sm font-medium"
                                    size="lg"
                                >
                                    Calculate Score <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </AnimateWrapper>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-12 space-y-4"
                        >
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <p className="text-sm font-medium text-slate-600">Processing against 2025 criteria...</p>
                        </motion.div>
                    )}

                    {step === 3 && score && (
                        <AnimateWrapper key="result">
                            <div className="space-y-8">
                                <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-6">
                                    <CircularScore score={score.totalScore} max={130} size={140} strokeWidth={6} />
                                    <p className="mt-4 text-sm text-slate-500 font-medium uppercase tracking-wide">Threshold: 80 Points</p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-serif font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                                        <FileText className="h-4 w-4 text-secondary" />
                                        Assessment Report
                                    </h4>

                                    <div className="space-y-5">
                                        {score.breakdown.map((item: any, i: number) => (
                                            <ProgressBar
                                                key={i}
                                                label={item.category}
                                                value={item.score}
                                                max={item.maxPoints}
                                                color={
                                                    item.score / item.maxPoints >= 0.8 ? "bg-green-600" :
                                                        item.score / item.maxPoints >= 0.5 ? "bg-blue-600" : "bg-amber-500"
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 p-4 text-sm text-slate-800 rounded-sm">
                                    <strong className="block font-serif text-primary mb-1">Legal Opinion:</strong>
                                    {score.totalScore < 80
                                        ? "Current score is below the statutory threshold. Increasing TOPIK score is recommended."
                                        : "Score meets the statutory threshold. Prepare income verification documents."
                                    }
                                </div>

                                <Button onClick={reset} variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 rounded-sm">
                                    <RefreshCw className="mr-2 h-4 w-4" /> New Assessment
                                </Button>
                            </div>
                        </AnimateWrapper>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
