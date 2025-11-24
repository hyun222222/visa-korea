"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const visaData = [
    {
        category: "Short-Term Visit (C-3)",
        types: [
            { code: "C-3-1", name: "Short-Term General", purpose: "Events, Meetings, Training", period: "90 Days" },
            { code: "C-3-4", name: "Short-Term Business", purpose: "Market Research, Biz Meetings", period: "90 Days" },
            { code: "C-3-9", name: "General Tourist", purpose: "Tourism", period: "90 Days" },
        ]
    },
    {
        category: "Short-Term Employment (C-4)",
        types: [
            { code: "C-4-5", name: "Short-Term Employment", purpose: "Temporary Work, Lectures, Performances", period: "90 Days" },
        ]
    },
    {
        category: "Student & Training (D-2/D-4)",
        types: [
            { code: "D-2-1", name: "Associate Degree", purpose: "College Education", period: "2 Years" },
            { code: "D-2-2", name: "Bachelor Degree", purpose: "University Education", period: "2 Years" },
            { code: "D-4-1", name: "Korean Language", purpose: "Language Training", period: "6 Months" },
        ]
    },
    {
        category: "Corporate Investment (D-8)",
        types: [
            { code: "D-8-1", name: "Incorporated Enterprise", purpose: "Investment in Korean Corp", period: "5 Years" },
            { code: "D-8-3", name: "Individual Enterprise", purpose: "Investment in Korean Business", period: "1 Year" },
            { code: "D-8-4", name: "Technology Startup", purpose: "Intellectual Property / Startup", period: "2 Years" },
        ]
    }
];

export function VisaRequirementsTable() {
    return (
        <div className="space-y-8">
            {visaData.map((category, idx) => (
                <Card key={idx} className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                        <CardTitle className="text-lg font-serif font-bold text-slate-900">
                            {category.category}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[100px]">Code</TableHead>
                                    <TableHead>Visa Type</TableHead>
                                    <TableHead>Purpose</TableHead>
                                    <TableHead className="text-right">Max Period</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {category.types.map((visa) => (
                                    <TableRow key={visa.code}>
                                        <TableCell className="font-medium text-primary">{visa.code}</TableCell>
                                        <TableCell>{visa.name}</TableCell>
                                        <TableCell className="text-slate-600">{visa.purpose}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className="bg-slate-50">
                                                {visa.period}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
