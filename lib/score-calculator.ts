export interface ScoreBreakdown {
    category: string;
    score: number;
    maxPoints: number;
    details: string;
}

export interface ScoreResult {
    visaType: string;
    totalScore: number;
    passScore: number;
    passed: boolean;
    breakdown: ScoreBreakdown[];
}

export interface F27Profile {
    age: number;
    education: 'doctor' | 'master' | 'bachelor' | 'associate' | 'none';
    annualIncome: number; // KRW
    koreanLevel: number; // 0-6 (TOPIK)
    socialIntegrationProgram: boolean; // KIIP completion
    volunteerHours?: number;
    taxPaymentRecord?: boolean;
}

// 2025 GNI Estimate (KRW)
const GNI_KRW = 45000000;

export class ScoreCalculator {
    static calculateF27(profile: F27Profile): ScoreResult {
        const breakdown: ScoreBreakdown[] = [];
        let total = 0;

        // 1. Age (Max 25)
        let ageScore = 0;
        if (profile.age >= 18 && profile.age <= 24) ageScore = 20;
        else if (profile.age >= 25 && profile.age <= 29) ageScore = 25;
        else if (profile.age >= 30 && profile.age <= 34) ageScore = 23;
        else if (profile.age >= 35 && profile.age <= 39) ageScore = 20;
        else if (profile.age >= 40 && profile.age <= 44) ageScore = 12;
        else if (profile.age >= 45 && profile.age <= 50) ageScore = 8;
        else if (profile.age >= 51) ageScore = 3;

        breakdown.push({ category: 'Age', score: ageScore, maxPoints: 25, details: `${profile.age} years old` });
        total += ageScore;

        // 2. Education (Max 35) - Simplified
        let eduScore = 0;
        if (profile.education === 'doctor') eduScore = 35; // STEM doctor could be higher
        else if (profile.education === 'master') eduScore = 30; // STEM master could be higher
        else if (profile.education === 'bachelor') eduScore = 26;
        else if (profile.education === 'associate') eduScore = 20;

        breakdown.push({ category: 'Education', score: eduScore, maxPoints: 35, details: profile.education });
        total += eduScore;

        // 3. Income (Max 60) - Based on GNI
        let incomeScore = 0;
        const ratio = profile.annualIncome / GNI_KRW;

        if (ratio >= 2.0) incomeScore = 60; // 100M+ roughly
        else if (ratio >= 1.5) incomeScore = 50;
        else if (ratio >= 1.0) incomeScore = 40;
        else if (ratio >= 0.9) incomeScore = 30; // 30M+
        else if (ratio >= 0.8) incomeScore = 20;

        breakdown.push({
            category: 'Annual Income',
            score: incomeScore,
            maxPoints: 60,
            details: `${(profile.annualIncome / 1000000).toFixed(1)}M KRW (${ratio.toFixed(2)}x GNI)`
        });
        total += incomeScore;

        // 4. Korean Ability (Max 20)
        let langScore = 0;
        if (profile.koreanLevel >= 5 || profile.socialIntegrationProgram) langScore = 20;
        else if (profile.koreanLevel === 4) langScore = 15;
        else if (profile.koreanLevel === 3) langScore = 10;
        else if (profile.koreanLevel === 2) langScore = 5;
        else if (profile.koreanLevel === 1) langScore = 3;

        breakdown.push({
            category: 'Korean Ability',
            score: langScore,
            maxPoints: 20,
            details: `TOPIK ${profile.koreanLevel} / KIIP ${profile.socialIntegrationProgram ? 'Yes' : 'No'}`
        });
        total += langScore;

        // Bonus Points (Simplified)
        // ... could add more here

        return {
            visaType: 'F-2-7',
            totalScore: total,
            passScore: 80,
            passed: total >= 80,
            breakdown
        };
    }
}
