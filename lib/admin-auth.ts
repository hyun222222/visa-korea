import {supabase, hasSupabaseConfig} from './supabase';

/** The database is authoritative. A valid session alone never grants editing access. */
export async function isVisaContentAdmin(): Promise<boolean> {
  if (!hasSupabaseConfig) return false;
  try {
    const {data: {session}, error: sessionError} = await supabase.auth.getSession();
    if (sessionError || !session) return false;
    const {data, error} = await supabase.rpc('is_visa_content_admin');
    return !error && data === true;
  } catch { return false; }
}

export async function requireVisaContentAdmin(): Promise<void> {
  if (!await isVisaContentAdmin()) throw new Error('글 관리는 사무소 관리자 계정으로만 이용할 수 있습니다.');
}
