import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

function makeClient(): SupabaseClient {
    if (cached) return cached;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        console.error(
            '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
            'Set them in .env.local for development and in Vercel project Environment Variables for deployment.'
        );
        // Return a no-op client so the build does not crash. Runtime queries will fail
        // with a recognizable error instead of breaking page generation.
        cached = createClient(
            'https://missing-env.invalid',
            'missing-env-key',
            { auth: { persistSession: false } }
        );
        return cached;
    }

    cached = createClient(url, anonKey);
    return cached;
}

export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop: keyof SupabaseClient) {
        const client = makeClient();
        const value = client[prop];
        return typeof value === 'function' ? value.bind(client) : value;
    },
});
