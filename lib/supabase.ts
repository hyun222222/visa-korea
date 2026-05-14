import { createClient } from '@supabase/supabase-js';

// Fallback to hardcoded credentials if env vars are missing (for Vercel deployment)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://amqnssakcqsdeeunrtfz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcW5zc2FrY3FzZGVldW5ydGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzMzMDMsImV4cCI6MjA4MDIwOTMwM30.2WZCTxl_L6R8UxEdYXXwy1k578ckkmwdAvnBYB2Nflw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
