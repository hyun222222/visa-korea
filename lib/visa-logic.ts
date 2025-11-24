import { ScoreCalculator, F27Profile } from './score-calculator';

export interface UserProfile {
    age: number;
    education: string;
    income: number;
    koreanLevel: string; // "None", "TOPIK 1", etc.
    advancedSector: boolean;
    careerYears?: number;
}

export interface VisaRecommendation {
    id: string;
    name: string;
    probability: 'HIGH' | 'MEDIUM' | 'LOW';
    reason: string[];
    requirements: string[];
}

const GNI_KRW = 45000000; // 2025 Estimate

export function getVisaRecommendations(profile: UserProfile): VisaRecommendation[] {
    const recommendations: VisaRecommendation[] = [];

    // Parse Korean Level
    let topikLevel = 0;
    let kiipCompleted = false;
    if (profile.koreanLevel.includes('TOPIK')) {
        topikLevel = parseInt(profile.koreanLevel.replace('TOPIK ', ''));
    } else if (profile.koreanLevel.includes('KIIP Level 5')) {
        topikLevel = 6; // Equivalent for points usually
        kiipCompleted = true;
    }

    const incomeRatio = profile.income / GNI_KRW;

    // 1. Top-Tier Visa (E-7-T / E-7-S)
    // Requirement: Advanced sector + High income OR Advanced degree + High income
    if (profile.advancedSector) {
        const isHighIncome = incomeRatio >= 1.5; // Simplified check
        const isAdvancedDegree = ['Master\'s Degree', 'Doctorate'].includes(profile.education);

        if (isHighIncome || isAdvancedDegree) {
            recommendations.push({
                id: 'top-tier',
                name: 'Top-Tier (E-7-S/T)',
                probability: 'HIGH',
                reason: [
                    'Targeting Advanced/High-Tech Sector',
                    `Income is ${(incomeRatio).toFixed(1)}x GNI`,
                    'Fast-track permanent residency eligibility'
                ],
                requirements: [
                    'Employment contract in advanced sector',
                    'Recommendation from relevant ministry (for some tracks)'
                ]
            });
        }
    }

    // 2. E-7-1 (Professional)
    // Requirement: Master's+ OR Bachelor's + 1yr exp OR 5yr exp
    let e7Prob: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    const e7Reasons: string[] = [];

    if (['Master\'s Degree', 'Doctorate'].includes(profile.education)) {
        e7Prob = 'HIGH';
        e7Reasons.push('Master\'s degree or higher exempts experience requirement');
    } else if (profile.education === 'Bachelor\'s Degree' && (profile.careerYears || 0) >= 1) {
        e7Prob = 'HIGH';
        e7Reasons.push('Bachelor\'s degree + 1 year experience');
    } else if ((profile.careerYears || 0) >= 5) {
        e7Prob = 'MEDIUM'; // Harder without degree
        e7Reasons.push('5+ years of experience (Degree exemption possible)');
    }

    if (incomeRatio < 0.8) {
        e7Prob = 'LOW';
        e7Reasons.push('Warning: Income below 80% GNI is risky for E-7-1');
    }

    recommendations.push({
        id: 'e-7-1',
        name: 'E-7-1 (Professional)',
        probability: e7Prob,
        reason: e7Reasons,
        requirements: [
            'Employment contract with Korean company',
            'Company must meet 20% foreign hire ratio limit'
        ]
    });

    // 3. F-2-7 (Points)
    const f27Profile: F27Profile = {
        age: profile.age,
        education: mapEducationToLevel(profile.education),
        annualIncome: profile.income,
        koreanLevel: topikLevel,
        socialIntegrationProgram: kiipCompleted
    };

    const f27Result = ScoreCalculator.calculateF27(f27Profile);

    recommendations.push({
        id: 'f-2-7',
        name: 'F-2-7 (Points-Based)',
        probability: f27Result.passed ? 'HIGH' : 'LOW',
        reason: [
            `Calculated Score: ${f27Result.totalScore} / 80`,
            ...f27Result.breakdown.map(b => `${b.category}: ${b.score}pts`)
        ],
        requirements: [
            'Must reach 80 points',
            'Employment or definite job offer required'
        ]
    });

    // Sort by probability
    const probScore = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    return recommendations.sort((a, b) => probScore[b.probability] - probScore[a.probability]);
}

function mapEducationToLevel(edu: string): F27Profile['education'] {
    if (edu.includes('Doctor')) return 'doctor';
    if (edu.includes('Master')) return 'master';
    if (edu.includes('Bachelor')) return 'bachelor';
    if (edu.includes('Associate')) return 'associate';
    return 'none';
}
