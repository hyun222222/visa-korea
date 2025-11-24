"use client";

import { useVisaStore } from "@/store/visa-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Step1Personal() {
    const { profile, setProfile } = useVisaStore();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                        id="age"
                        type="number"
                        value={profile.age}
                        onChange={(e) => setProfile({ age: parseInt(e.target.value) || 0 })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="income">Annual Income (KRW)</Label>
                    <Input
                        id="income"
                        type="number"
                        value={profile.income}
                        onChange={(e) => setProfile({ income: parseInt(e.target.value) || 0 })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="education">Highest Education</Label>
                <Select
                    value={profile.education}
                    onValueChange={(value) => setProfile({ education: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Education" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Doctorate">Doctorate</SelectItem>
                        <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                        <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                        <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                        <SelectItem value="High School">High School</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="korean">Korean Language Ability</Label>
                <Select
                    value={profile.koreanLevel}
                    onValueChange={(value) => setProfile({ koreanLevel: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="TOPIK 1">TOPIK 1</SelectItem>
                        <SelectItem value="TOPIK 2">TOPIK 2</SelectItem>
                        <SelectItem value="TOPIK 3">TOPIK 3</SelectItem>
                        <SelectItem value="TOPIK 4">TOPIK 4</SelectItem>
                        <SelectItem value="TOPIK 5">TOPIK 5</SelectItem>
                        <SelectItem value="TOPIK 6">TOPIK 6</SelectItem>
                        <SelectItem value="KIIP Level 5">KIIP Level 5 (Completed)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
