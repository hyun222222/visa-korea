"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, TrendingUp, Award } from "lucide-react";
import { FadeIn } from "@/components/ui/animate-wrapper";

export function E74Calculator() {
    // Basic Requirements
    const [income, setIncome] = useState<number>(0);
    const [korean, setKorean] = useState<string>(""); // topik2, topik3, topik4+
    const [age, setAge] = useState<number>(0);

    // Bonuses
    const [employerRec, setEmployerRec] = useState(false);
    const [centralGov, setCentralGov] = useState(false);
    const [localGov, setLocalGov] = useState(false);
    const [threeYears, setThreeYears] = useState(false);
    const [ruralArea, setRuralArea] = useState(false);
    const [license, setLicense] = useState(false);
    const [driverLicense, setDriverLicense] = useState(false);

    // Deductions
    const [fines, setFines] = useState<number>(0);
    const [taxDelinquency, setTaxDelinquency] = useState<number>(0);
    const [immigrationViolations, setImmigrationViolations] = useState<number>(0);

    const [result, setResult] = useState<any>(null);

    const calculateScore = () => {
        let scores = {
            income: 0,
            korean: 0,
            age: 0,
            bonuses: 0,
            deductions: 0
        };

        // Income (50-120 points, minimum 50 required)
        if (income >= 50000000) scores.income = 120;
        else if (income >= 45000000) scores.income = 110;
        else if (income >= 40000000) scores.income = 95;
        else if (income >= 35000000) scores.income = 80;
        else if (income >= 30000000) scores.income = 65;
        else if (income >= 25000000) scores.income = 50;
        else scores.income = 0;

        // Korean Language (50-120 points, minimum 50 required)
        if (korean === "topik4" || korean === "kiip4" || korean === "eval81") scores.korean = 120;
        else if (korean === "topik3" || korean === "kiip3" || korean === "eval61") scores.korean = 80;
        else if (korean === "topik2" || korean === "kiip2" || korean === "eval41") scores.korean = 50;
        else scores.korean = 0;

        // Age (10-60 points)
        if (age >= 19 && age <= 26) scores.age = 40;
        else if (age >= 27 && age <= 33) scores.age = 60;
        else if (age >= 34 && age <= 40) scores.age = 30;
        else if (age >= 41) scores.age = 10;

        // Bonuses (max 170 points, can stack except central/local gov)
        if (employerRec) scores.bonuses += 30;
        if (centralGov) scores.bonuses += 50; // If both gov selected, only count one
        else if (localGov) scores.bonuses += 30;
        if (threeYears) scores.bonuses += 20;
        if (ruralArea) scores.bonuses += 20;
        if (license) scores.bonuses += 20;
        if (driverLicense) scores.bonuses += 10;

        // Deductions (max -50 points)
        if (fines === 1) scores.deductions -= 5;
        else if (fines === 2) scores.deductions -= 10;
        else if (fines >= 3) scores.deductions -= 20;

        if (taxDelinquency === 1) scores.deductions -= 5;
        else if (taxDelinquency === 2) scores.deductions -= 10;
        else if (taxDelinquency >= 3) scores.deductions -= 15;

        if (immigrationViolations === 1) scores.deductions -= 5;
        else if (immigrationViolations === 2) scores.deductions -= 10;
        else if (immigrationViolations >= 3) scores.deductions -= 15;

        const total = scores.income + scores.korean + scores.age + scores.bonuses + scores.deductions;

        const eligible = total >= 200 && scores.income >= 50 && scores.korean >= 50;

        let message = "";
        if (eligible) {
            message = `Congratulations! You meet the E-7-4 requirements with ${total} points.`;
        } else {
            if (total < 200) message = `You need ${200 - total} more points to reach the minimum 200.`;
            if (scores.income < 50) message += ` Your income score (${scores.income}) must be at least 50.`;
            if (scores.korean < 50) message += ` Your Korean score (${scores.korean}) must be at least 50.`;
        }

        setResult({ eligible, total, scores, message });
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="font-serif font-bold text-slate-900">E-7-4 K-Point Calculator</h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                    <strong>Requirements:</strong> 300 points total, 200 minimum required
                </p>
                <p className="text-sm text-slate-600">
                    Income & Korean must each score at least 50 points
                </p>
            </div>

            {/* Basic Items */}
            <Card>
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
                    <CardTitle className="text-base font-serif">Basic Items (Max 300)</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Average Annual Income (KRW) - Last 2 Years</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 30000000"
                            value={income || ""}
                            onChange={(e) => setIncome(Number(e.target.value))}
                        />
                        <p className="text-xs text-slate-500">
                            Min 25M KRW (24M for agriculture/fishery) = 50 pts | 50M+ KRW = 120 pts
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Korean Language Proficiency</Label>
                        <Select value={korean} onValueChange={setKorean}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="topik2">TOPIK Level 2 (50 pts)</SelectItem>
                                <SelectItem value="topik3">TOPIK Level 3 (80 pts)</SelectItem>
                                <SelectItem value="topik4">TOPIK Level 4+ (120 pts)</SelectItem>
                                <SelectItem value="kiip2">KIIP Level 2 (50 pts)</SelectItem>
                                <SelectItem value="kiip3">KIIP Level 3 (80 pts)</SelectItem>
                                <SelectItem value="kiip4">KIIP Level 4+ (120 pts)</SelectItem>
                                <SelectItem value="eval41">Pre-evaluation 41-60 (50 pts)</SelectItem>
                                <SelectItem value="eval61">Pre-evaluation 61-80 (80 pts)</SelectItem>
                                <SelectItem value="eval81">Pre-evaluation 81+ (120 pts)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Age</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 30"
                            value={age || ""}
                            onChange={(e) => setAge(Number(e.target.value))}
                        />
                        <p className="text-xs text-slate-500">
                            27-33 years = 60 pts | 19-26 = 40 pts | 34-40 = 30 pts | 41+ = 10 pts
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Bonus Points */}
            <Card>
                <CardHeader className="bg-green-50 border-b border-green-100 py-3">
                    <CardTitle className="text-base font-serif text-green-900">Bonus Points (Max 170)</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="employer">Employer Recommendation (30 pts)</Label>
                        <Switch id="employer" checked={employerRec} onCheckedChange={setEmployerRec} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="central">Central Government Recommendation (50 pts)</Label>
                        <Switch id="central" checked={centralGov} onCheckedChange={setCentralGov} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="local">Local Government Recommendation (30 pts)</Label>
                        <Switch id="local" checked={localGov} onCheckedChange={setLocalGov} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="3years">3+ Years at Current Job (20 pts)</Label>
                        <Switch id="3years" checked={threeYears} onCheckedChange={setThreeYears} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="rural">3+ Years in Rural Area (20 pts)</Label>
                        <Switch id="rural" checked={ruralArea} onCheckedChange={setRuralArea} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="license">License or Korea Degree (20 pts)</Label>
                        <Switch id="license" checked={license} onCheckedChange={setLicense} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="driver">Korea Driver's License (10 pts)</Label>
                        <Switch id="driver" checked={driverLicense} onCheckedChange={setDriverLicense} />
                    </div>
                </CardContent>
            </Card>

            {/* Deductions */}
            <Card>
                <CardHeader className="bg-red-50 border-b border-red-100 py-3">
                    <CardTitle className="text-base font-serif text-red-900">Deductions (Max -50)</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Fines Under 1M KRW (Times)</Label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={fines || ""}
                            onChange={(e) => setFines(Number(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tax Delinquency Restrictions (Times)</Label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={taxDelinquency || ""}
                            onChange={(e) => setTaxDelinquency(Number(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Immigration Law Violations ≤3 times</Label>
                        <Input
                            type="number"
                            min="0"
                            max="3"
                            placeholder="0"
                            value={immigrationViolations || ""}
                            onChange={(e) => setImmigrationViolations(Number(e.target.value))}
                        />
                    </div>
                </CardContent>
            </Card>

            <Button onClick={calculateScore} className="w-full bg-primary text-white hover:bg-primary/90">
                <TrendingUp className="h-4 w-4 mr-2" />
                Calculate My Score
            </Button>

            {result && (
                <FadeIn className={`p-6 rounded-lg border-2 ${result.eligible ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
                    <div className="flex items-start gap-3 mb-4">
                        {result.eligible ? (
                            <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                            <h4 className={`text-xl font-bold mb-2 ${result.eligible ? "text-green-900" : "text-red-900"}`}>
                                {result.eligible ? "✓ Eligible for E-7-4!" : "Not Yet Eligible"}
                            </h4>
                            <p className={`text-sm mb-4 ${result.eligible ? "text-green-800" : "text-red-800"}`}>
                                {result.message}
                            </p>

                            <div className="grid grid-cols-2 gap-4 bg-white rounded-lg p-4 border border-slate-200">
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${result.eligible ? "text-green-600" : "text-red-600"}`}>
                                        {result.total}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">Total Score</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-400">
                                        200
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">Minimum Required</div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Income:</span>
                                    <span className={`font-medium ${result.scores.income >= 50 ? "text-green-600" : "text-red-600"}`}>
                                        {result.scores.income} pts {result.scores.income >= 50 ? "✓" : "✗ (min 50)"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Korean:</span>
                                    <span className={`font-medium ${result.scores.korean >= 50 ? "text-green-600" : "text-red-600"}`}>
                                        {result.scores.korean} pts {result.scores.korean >= 50 ? "✓" : "✗ (min 50)"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Age:</span>
                                    <span className="font-medium text-slate-700">{result.scores.age} pts</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Bonuses:</span>
                                    <span className="font-medium text-green-600">+{result.scores.bonuses} pts</span>
                                </div>
                                {result.scores.deductions < 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Deductions:</span>
                                        <span className="font-medium text-red-600">{result.scores.deductions} pts</span>
                                    </div>
                                )}
                            </div>

                            <Button
                                className="w-full mt-4 bg-primary text-white hover:bg-primary/90"
                                onClick={() => window.open("/documents/e74_점수표.pdf", "_blank")}
                            >
                                View Official Score Table
                            </Button>
                        </div>
                    </div>
                </FadeIn>
            )}
        </div>
    );
}
