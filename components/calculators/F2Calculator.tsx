"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Home, TrendingUp, Users, Building2 } from "lucide-react";
import { FadeIn } from "@/components/ui/animate-wrapper";

export function F2Calculator() {
    const [category, setCategory] = useState<string>("");
    const [result, setResult] = useState<any>(null);

    const categories = [
        {
            id: "f2-7",
            title: "F-2-7: Residence (Point System)",
            desc: "For skilled professionals with E-1~E-7, D-5~D-9 visas",
            requirements: [
                "Total 80+ points out of 170",
                "Age, Education, Income, Korean Language",
                "3+ years on current visa (or exempt if income 40M+ KRW)"
            ],
            icon: <TrendingUp className="h-6 w-6" />,
            manualUrl: "/documents/거주비자F2.pdf"
        },
        {
            id: "f2-1",
            title: "F-2-1: F-5 Visa Holder's Spouse",
            desc: "Spouse of permanent resident (F-5)",
            requirements: [
                "Valid marriage to F-5 holder",
                "Proof of relationship"
            ],
            icon: <Users className="h-6 w-6" />,
            manualUrl: "/documents/거주비자F2.pdf"
        },
        {
            id: "f2-2",
            title: "F-2-2: Child of Korean National",
            desc: "Minor foreign child of Korean citizen",
            requirements: [
                "Parent is Korean national",
                "Proof of parentage",
                "Minor (under 19)"
            ],
            icon: <Users className="h-6 w-6" />,
            manualUrl: "/documents/거주비자F2.pdf"
        },
        {
            id: "f2-4",
            title: "F-2-4: Foreign Investor",
            desc: "Investment of USD 500K+ with 2+ Korean employees",
            requirements: [
                "Invested USD 500,000 or more",
                "Employed 2+ Korean nationals",
                "Maintained D-8 visa for 3+ years"
            ],
            icon: <Building2 className="h-6 w-6" />,
            manualUrl: "/documents/거주비자F2.pdf"
        },
        {
            id: "f2-5",
            title: "F-2-5: Long-term Resident (7 years)",
            desc: "7+ years continuous residence on eligible visa",
            requirements: [
                "7+ years continuous residence",
                "Eligible visa types (E-1~E-7, D-7~D-9, etc.)",
                "Good conduct"
            ],
            icon: <Home className="h-6 w-6" />,
            manualUrl: "/documents/거주비자F2.pdf"
        }
    ];

    const handleSelect = (cat: string) => {
        const selected = categories.find(c => c.id === cat);
        if (selected) {
            setCategory(cat);
            setResult(selected);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="font-serif font-bold text-slate-900 mb-2">About F-2 Residence Visa</h3>
                <p className="text-sm text-slate-600">
                    F-2 visa is a long-term residence visa with multiple subcategories. Select your situation below to learn which F-2 type you may qualify for.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Select Your Situation:</label>
                <Select value={category} onValueChange={handleSelect}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose F-2 category..." />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {result && (
                <FadeIn>
                    <Card className="border-2 border-primary/20 bg-primary/5">
                        <CardHeader className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    {result.icon}
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-serif">{result.title}</CardTitle>
                                    <p className="text-sm text-slate-600 mt-1">{result.desc}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium text-slate-900 mb-3">Key Requirements:</h4>
                                <ul className="space-y-2">
                                    {result.requirements.map((req: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {category === "f2-7" && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <p className="text-sm text-amber-900 font-medium">
                                        📊 F-2-7 uses a detailed point system. Factors include:
                                    </p>
                                    <ul className="text-sm text-amber-800 mt-2 space-y-1 ml-4">
                                        <li>• Age (max 15pts)</li>
                                        <li>• Education (max 25pts, bonus for STEM)</li>
                                        <li>• Korean Language (max 20pts)</li>
                                        <li>• Annual Income (max 60pts)</li>
                                        <li>• Bonuses: Volunteering, domestic degree, etc.</li>
                                    </ul>
                                </div>
                            )}

                            <Button
                                className="w-full bg-primary text-white hover:bg-primary/90"
                                onClick={() => window.open(result.manualUrl, '_blank')}
                            >
                                View Full Manual (Korean)
                            </Button>
                        </CardContent>
                    </Card>
                </FadeIn>
            )}

            {!result && (
                <div className="text-center py-12 text-slate-400">
                    <Home className="h-12 w-12 mx-auto mb-3" />
                    <p>Select a category above to see requirements</p>
                </div>
            )}
        </div>
    );
}
