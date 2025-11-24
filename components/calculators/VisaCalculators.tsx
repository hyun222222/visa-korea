"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertCircle, Calculator, BookOpen, Briefcase, Plane, Coins } from "lucide-react";
import { FadeIn } from "@/components/ui/animate-wrapper";
import { E74Calculator } from "./E74Calculator";
import { F2Calculator } from "./F2Calculator";
import { F5Calculator } from "./F5Calculator";

// --- Universal Visa Finder ---
const VisaFinder = () => {
    const [step, setStep] = useState(1);
    const [purpose, setPurpose] = useState("");
    const [result, setResult] = useState<any>(null);

    const reset = () => {
        setStep(1);
        setPurpose("");
        setResult(null);
    };

    const handlePurpose = (val: string) => {
        setPurpose(val);
        if (val === "invest") {
            setResult({
                code: "D-8",
                title: "Corporate Investment (D-8)",
                desc: "For foreign investors establishing a corporation in Korea.",
                reqs: ["Investment of 100M KRW or more", "Own 10% or more of stocks"],
                manualUrl: "/documents/D-8.pdf"
            });
            setStep(3);
        } else if (val === "study") {
            setStep(2);
        } else if (val === "work") {
            setStep(2);
        } else if (val === "visit") {
            setStep(2);
        }
    };

    const handleSecondStep = (val: string) => {
        if (purpose === "study") {
            if (val === "degree") {
                setResult({
                    code: "D-2",
                    title: "Student (D-2)",
                    desc: "For full-time degree programs (Bachelor, Master, PhD) at Korean universities.",
                    reqs: ["Standard Admission Letter", "Proof of Finance (Tuition + Living Expenses)"],
                    manualUrl: "/documents/D-2.pdf"
                });
            } else {
                setResult({
                    code: "D-4",
                    title: "General Training (D-4)",
                    desc: "For Korean language training at university-affiliated language institutes.",
                    reqs: ["Admission to Language Institute", "High School Diploma", "Proof of Finance (~10M KRW)"],
                    manualUrl: "/documents/D-4.pdf"
                });
            }
            setStep(3);
        } else if (purpose === "visit") {
            if (val === "business") {
                setResult({
                    code: "C-3-4",
                    title: "Short-Term Business (C-3-4)",
                    desc: "For market research, business meetings, consultation, etc. (No profit-making activities).",
                    reqs: ["Invitation Letter", "Proof of Employment", "Business Purpose Proof"],
                    manualUrl: "/documents/C-3.pdf"
                });
            } else if (val === "tour") {
                setResult({
                    code: "C-3-9",
                    title: "General Tourist (C-3-9)",
                    desc: "For general tourism, visiting friends, etc.",
                    reqs: ["Valid Passport", "Proof of Funds (if required)"],
                    manualUrl: "/documents/C-3.pdf"
                });
            } else if (val === "work_short") {
                setResult({
                    code: "C-4",
                    title: "Short-Term Employment (C-4)",
                    desc: "For temporary work (less than 90 days) that generates income in Korea.",
                    reqs: ["Employment Contract", "Recommendation Letter (if applicable)"],
                    manualUrl: "/documents/C-4.pdf"
                });
            }
            setStep(3);
        } else if (purpose === "work") {
            if (val === "training") {
                setResult({
                    code: "D-3",
                    title: "Industrial Training (D-3)",
                    desc: "For training at a Korean parent company or partner.",
                    reqs: ["Overseas Investment Report", "Training Plan"],
                    manualUrl: "/documents/D-3.pdf"
                });
            } else {
                setResult({
                    code: "E-7",
                    title: "Specific Activity (E-7)",
                    desc: "For professional employment in designated fields.",
                    reqs: ["Employment Contract", "Relevant Degree/Experience"],
                    manualUrl: "/documents/Visa_Manual_General.pdf"
                });
            }
            setStep(3);
        }
    };

    return (
        <div className="space-y-6">
            {step === 1 && (
                <FadeIn>
                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-4">What is your primary purpose for coming to Korea?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => handlePurpose("visit")}>
                            <Plane className="h-6 w-6 text-primary" />
                            <span>Short Visit / Business</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => handlePurpose("study")}>
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span>Study</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => handlePurpose("work")}>
                            <Briefcase className="h-6 w-6 text-primary" />
                            <span>Work / Training</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-primary hover:bg-primary/5" onClick={() => handlePurpose("invest")}>
                            <Coins className="h-6 w-6 text-primary" />
                            <span>Investment</span>
                        </Button>
                    </div>
                </FadeIn>
            )}

            {step === 2 && purpose === "study" && (
                <FadeIn>
                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-4">What type of program?</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" className="h-16 justify-start px-6" onClick={() => handleSecondStep("degree")}>
                            Degree Program (Bachelor, Master, PhD)
                        </Button>
                        <Button variant="outline" className="h-16 justify-start px-6" onClick={() => handleSecondStep("language")}>
                            Korean Language Training
                        </Button>
                    </div>
                    <Button variant="ghost" className="mt-4" onClick={() => setStep(1)}>Back</Button>
                </FadeIn>
            )}

            {step === 2 && purpose === "visit" && (
                <FadeIn>
                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-4">What is the specific activity?</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" className="h-16 justify-start px-6" onClick={() => handleSecondStep("tour")}>
                            Tourism / Visiting Friends
                        </Button>
                        <Button variant="outline" className="h-16 justify-start px-6" onClick={() => handleSecondStep("business")}>
                            Business Meetings / Market Research (No payment from Korea)
                        </Button>
                        <Button variant="outline" className="h-16 justify-start px-6" onClick={() => handleSecondStep("work_short")}>
                            Short-term Work / Lecture / Performance (Paid by Korea)
                        </Button>
                    </div>
                    <Button variant="ghost" className="mt-4" onClick={() => setStep(1)}>Back</Button>
                </FadeIn>
            )}

            {step === 2 && purpose === "work" && (
                <FadeIn>
                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-4">What is the nature of employment?</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" className="h-16 justify-start px-6" onClick={() => handleSecondStep("professional")}>
                            Professional Job (E-7)
                        </Button>
                        <Button variant="outline" className="h-16 justify-start px-6" onClick={() => handleSecondStep("training")}>
                            Industrial Training at Korean Parent Company (D-3)
                        </Button>
                    </div>
                    <Button variant="ghost" className="mt-4" onClick={() => setStep(1)}>Back</Button>
                </FadeIn>
            )}

            {step === 3 && result && (
                <FadeIn>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-xl font-serif font-bold text-slate-900">{result.title}</h4>
                                <p className="text-sm text-slate-500">Recommended Visa Type</p>
                            </div>
                        </div>
                        <p className="text-slate-700 mb-6">{result.desc}</p>

                        <h5 className="font-medium text-slate-900 mb-3">Key Requirements:</h5>
                        <ul className="space-y-2 mb-6">
                            {result.reqs.map((req: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                                    {req}
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-3">
                            <Button onClick={reset} variant="outline">Start Over</Button>
                            <Button
                                className="bg-primary text-white hover:bg-primary/90"
                                onClick={() => result.manualUrl && window.open(result.manualUrl, '_blank')}
                            >
                                View Detailed Manual
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            )}
        </div>
    );
};

// --- D-8 Calculator ---
const D8Calculator = () => {
    const [amount, setAmount] = useState<number>(0);
    const [share, setShare] = useState<number>(0);
    const [type, setType] = useState("corp");
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        let eligible = false;
        let message = "";

        if (type === "corp") {
            if (amount >= 100000000 && share >= 10) {
                eligible = true;
                message = "Eligible for D-8-1 (Incorporated Enterprise).";
            } else if (amount >= 100000000 && share < 10) {
                message = "Investment amount is sufficient, but ownership must be at least 10% (or hold executive position with contract).";
            } else {
                message = "Investment must be at least 100 Million KRW.";
            }
        } else if (type === "individual") {
            if (amount >= 100000000 && share >= 10) {
                eligible = true;
                message = "Eligible for D-8-3 (Individual Enterprise). Must be Co-Representative with Korean national.";
            } else {
                message = "Investment must be at least 100 Million KRW and 10% ownership.";
            }
        } else if (type === "venture") {
            eligible = true;
            message = "For D-8-2, you need Venture Business Confirmation or Preliminary Venture Business Confirmation.";
        }

        setResult({ eligible, message });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Investment Type</label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="corp">Corporation (D-8-1)</SelectItem>
                            <SelectItem value="venture">Venture (D-8-2)</SelectItem>
                            <SelectItem value="individual">Individual Business (D-8-3)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {type !== "venture" && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Investment Amount (KRW)</label>
                            <Input
                                type="number"
                                placeholder="e.g. 100000000"
                                value={amount || ""}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                            <p className="text-xs text-slate-500">Minimum 100,000,000 KRW required</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Ownership Share (%)</label>
                            <Input
                                type="number"
                                placeholder="e.g. 10"
                                value={share || ""}
                                onChange={(e) => setShare(Number(e.target.value))}
                            />
                            <p className="text-xs text-slate-500">Minimum 10% required</p>
                        </div>
                    </>
                )}
            </div>

            <Button onClick={calculate} className="w-full bg-primary text-white hover:bg-primary/90">
                Check Eligibility
            </Button>

            {result && (
                <FadeIn className={`p-4 rounded-md border ${result.eligible ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <div className="flex items-start gap-3">
                        {result.eligible ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        )}
                        <div>
                            <h4 className={`font-bold ${result.eligible ? "text-green-800" : "text-red-800"}`}>
                                {result.eligible ? "Likely Eligible" : "Requirements Not Met"}
                            </h4>
                            <p className={`text-sm ${result.eligible ? "text-green-700" : "text-red-700"}`}>
                                {result.message}
                            </p>
                        </div>
                    </div>
                </FadeIn>
            )}
        </div>
    );
};

export function VisaCalculators() {
    return (
        <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="font-serif text-2xl text-slate-900 flex items-center gap-2">
                    <Calculator className="h-6 w-6 text-primary" />
                    Visa Eligibility Tools
                </CardTitle>
                <CardDescription>
                    Select a tool to check your eligibility for various Korean visas.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <Tabs defaultValue="finder" className="w-full">
                    <TabsList className="grid w-full grid-cols-6 mb-8">
                        <TabsTrigger value="finder">Finder</TabsTrigger>
                        <TabsTrigger value="e74">E-7-4</TabsTrigger>
                        <TabsTrigger value="f2">F-2</TabsTrigger>
                        <TabsTrigger value="f5">F-5</TabsTrigger>
                        <TabsTrigger value="d8">D-8</TabsTrigger>
                        <TabsTrigger value="student">Student</TabsTrigger>
                    </TabsList>

                    <TabsContent value="finder">
                        <VisaFinder />
                    </TabsContent>

                    <TabsContent value="e74">
                        <div className="space-y-4">
                            <div className="mb-6">
                                <h3 className="text-lg font-serif font-bold text-slate-900">E-7-4 Skilled Worker K-Point System</h3>
                                <p className="text-slate-600">Calculate your eligibility score for the skilled worker visa (숙련기능인력)</p>
                            </div>
                            <E74Calculator />
                        </div>
                    </TabsContent>

                    <TabsContent value="f2">
                        <div className="space-y-4">
                            <div className="mb-6">
                                <h3 className="text-lg font-serif font-bold text-slate-900">F-2 Residence Visa</h3>
                                <p className="text-slate-600">Long-term residence qualification for various categories</p>
                            </div>
                            <F2Calculator />
                        </div>
                    </TabsContent>

                    <TabsContent value="f5">
                        <div className="space-y-4">
                            <div className="mb-6">
                                <h3 className="text-lg font-serif font-bold text-slate-900">F-5 Permanent Residence</h3>
                                <p className="text-slate-600">Explore pathways to permanent residence in Korea (영주권)</p>
                            </div>
                            <F5Calculator />
                        </div>
                    </TabsContent>

                    <TabsContent value="d8">
                        <div className="space-y-4">
                            <div className="mb-6">
                                <h3 className="text-lg font-serif font-bold text-slate-900">Corporate Investment Visa (D-8)</h3>
                                <p className="text-slate-600">Calculate eligibility for foreign investment visas.</p>
                            </div>
                            <D8Calculator />
                        </div>
                    </TabsContent>

                    <TabsContent value="student">
                        <div className="text-center py-12 text-slate-500">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-lg font-medium text-slate-900">Student Visa Calculator</h3>
                            <p>Coming soon. Please use the Visa Finder for basic eligibility.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
