import { NextResponse } from 'next/server';
import { getVisaRecommendations, UserProfile } from '@/lib/visa-logic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const profile: UserProfile = body;

        // In a real app, we might fetch additional rules from DB here
        // const rules = await db.query('SELECT * FROM visa_rules');

        const recommendations = getVisaRecommendations(profile);

        return NextResponse.json({ recommendations });
    } catch (error) {
        console.error('Recommendation Error:', error);
        return NextResponse.json(
            { error: 'Failed to process recommendation' },
            { status: 500 }
        );
    }
}
