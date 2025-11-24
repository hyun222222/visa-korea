"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Crown, Heart, Briefcase, GraduationCap, Building } from "lucide-react";
import { FadeIn } from "@/components/ui/animate-wrapper";

export function F5Calculator() {
    const [category, setCategory] = useState<string>("");
    const [result, setResult] = useState<any>(null);

    const categories = [
        {
            id: "f5-1",
            title: "F-5-1: General Long-Term Resident",
            desc: "5+ years on D-7, D-8, D-9, E-7, or F-2 visa",
            requirements: [
                "5+ years continuous residence",
                "Income ≥ 2× GNI (~95M KRW in 2025)",
                "KIIP Level 5 or equivalent",
                "No criminal record"
            ],
            icon: <Crown className="h-6 w-6" />,
            manualUrl: "/documents/영주비자f5.pdf"
        },
        {
            id: "f5-2",
            title: "F-5-2: Spouse of Korean National",
            desc: "Married to Korean with F-6-1 visa for 2+ years",
            requirements: [
                "F-6-1 visa for 2+ years",
                "Valid marriage to Korean national",
                "Income ≥ 1× GNI (~47.5M KRW)",
                "KIIP Level 5 or exemption"
            ],
            icon: <Heart className="h-6 w-6" />,
            manualUrl: "/documents/영주비자f5.pdf"
        },
        {
            id: "f5-5",
            title: "F-5-5: High-Amount Investor",
            desc: "USD 500K investment + 5 Korean employees",
            requirements: [
                "Invested USD 500,000 or more",
                "Employed 5+ Korean nationals",
                "Foreign Investment Certificate"
            ],
            icon: <Building className="h-6 w-6" />,
            manualUrl: "/documents/영주비자f5.pdf"
        },
        {
            id: "f5-9",
            title: "F-5-9: PhD (Advanced Field)",
            desc: "PhD in advanced technology field + employed",
            requirements: [
                "PhD from recognized overseas university",
                "Field: IT, biotech, nanotech, etc.",
                "Currently employed in Korea"
            ],
            icon: <GraduationCap className="h-6 w-6" />,
            manualUrl: "/documents/영주비자f5.pdf"
        },
        {
            id: "f5-10",
            title: "F-5-10: Master's/Bachelor's + Employment",
            desc: "Degree + 3 years in Korea + employed",
            requirements: [
                "Bachelor's (advanced field) or Master's",
                "3+ years in Korea",
                "Currently employed",
                "Income ≥ specified amount"
            ],
            icon: <Briefcase className="h-6 w-6" />,
            manualUrl: "/documents/영주비자f5.pdf"
        },
        {
            id: "f5-16",
            title: "F-5-16: From F-2-7 (Point System)",
            desc: "F-2-7 visa holders after 3 years",
            requirements: [
                "Held F-2-7 visa for 3+ years",
                "Income ≥ 2× GNI (~95M KRW)",
                "Maintained qualifying status",
                "KIIP Level 5 or equivalent"
            ],
            icon: <Crown className="h-6 w-6" />,
            manualUrl: "/documents/영주비자f5.pdf"
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
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                    <Crown className="h-8 w-8 text-amber-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-serif font-bold text-amber-900 mb-2">About F-5 Permanent Residence</h3>
                        <p className="text-sm text-amber-800">
                            F-5 is a permanent residence visa with no activity restrictions. There are 27+ subcategories based on your situation. Benefits include 10-year validity, local voting rights, and full access to national health/pension systems.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Select Your Pathway:</label>
                <Select value={category} onValueChange={handleSelect}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose F-5 category..." />
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
                    <Card className="border-2 border-amber-300 bg-amber-50/50">
                        <CardHeader className="space-y-2 bg-gradient-to-r from-amber-100 to-yellow-100">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-amber-600/20 flex items-center justify-center text-amber-700">
                                    {result.icon}
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-serif text-amber-900">{result.title}</CardTitle>
                                    <p className="text-sm text-amber-700 mt-1">{result.desc}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-amber-600" />
                                    Key Requirements:
                                </h4>
                                <ul className="space-y-2">
                                    {result.requirements.map((req: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 pl-4">
                                            <span className="text-amber-600 font-bold">•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-900 font-medium mb-2">
                                    📌 Common Requirements for Most F-5 Types:
                                </p>
                                <ul className="text-sm text-blue-800 space-y-1 ml-4">
                                    <li>• Basic proficiency: KIIP Level 5 or comprehensive test</li>
                                    <li>• Good conduct: No criminal record</li>
                                    <li>• Financial stability: Income/assets above threshold</li>
                                    <li>• Health check: TB screening required</li>
                                </ul>
                            </div>

                            <Button
                                className="w-full bg-amber-600 text-white hover:bg-amber-700"
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
                    <Crown className="h-12 w-12 mx-auto mb-3" />
                    <p>Select a category above to see requirements</p>
                    <p className="text-xs mt-2">Showing 6 of 27+ F-5 pathways</p>
                </div>
            )}
        </div>
    );
}
