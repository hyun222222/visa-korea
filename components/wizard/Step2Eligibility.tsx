"use client";

import { useVisaStore } from "@/store/visa-store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export function Step2Eligibility() {
    const { profile, setProfile } = useVisaStore();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                <div className="space-y-0.5">
                    <Label className="text-base">Advanced Sector Employment</Label>
                    <p className="text-sm text-gray-500">
                        Are you working in a designated high-tech or advanced industry?
                    </p>
                </div>
                <Switch
                    checked={profile.advancedSector}
                    onCheckedChange={(checked) => setProfile({ advancedSector: checked })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="career">Years of Professional Experience</Label>
                <Input
                    id="career"
                    type="number"
                    value={profile.careerYears || 0}
                    onChange={(e) => setProfile({ careerYears: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-gray-500">
                    Relevant experience in your field of expertise.
                </p>
            </div>
        </div>
    );
}
