import { NextResponse } from 'next/server';
import { ScoreCalculator, F27Profile } from '@/lib/score-calculator';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { visaType, profile } = body;

        if (visaType === 'F-2-7') {
            const result = ScoreCalculator.calculateF27(profile as F27Profile);
            return NextResponse.json(result);
        }

        return NextResponse.json(
            { error: 'Unsupported visa type for scoring' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Scoring Error:', error);
        return NextResponse.json(
            { error: 'Failed to calculate score' },
            { status: 500 }
        );
    }
}
