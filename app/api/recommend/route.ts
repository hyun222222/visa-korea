import { NextResponse } from 'next/server';
import { recommendVisa, UserProfile } from '@/lib/visa-logic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const profile: UserProfile = body;

        // Validate input (Basic)
        if (!profile.age || !profile.income) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const recommendations = recommendVisa(profile);

        return NextResponse.json({ recommendations });
    } catch (error) {
        console.error('Recommendation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
