import { supabase } from './supabase';

export interface BoardPost {
    id: string;
    title: string;
    content: string;
    category: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

const LOCAL_STORAGE_KEY = 'visa_korea_posts';

const DEFAULT_POSTS: BoardPost[] = [
    {
        id: "post-1",
        title: "2026년 하반기 E-7-4 비자 전환 신청 일정 안내",
        content: "2026년 하반기 숙련기능인력(E-7-4) 전환 신청 일정이 공고되었습니다. 이번 선발은 K-Point 선발 기준이 전년 대비 소폭 조정되었으므로, 본 사이트의 E-7-4 계산기를 이용해 자격 요건을 미리 진단해 보시기 바랍니다.\n\n[주요 변경 내용]\n1. 소득 조건 배점 변경\n2. 한국어 능력 가점 항목 신설\n\n신청 기간: 2026년 9월 1일 ~ 9월 15일\n접수 방법: 하이코리아(HiKorea) 온라인 신청",
        category: "Notice",
        is_published: true,
        created_at: "2026-06-01T09:00:00.000Z",
        updated_at: "2026-06-01T09:00:00.000Z"
    },
    {
        id: "post-2",
        title: "F-2-7 점수제 비자 연장 심사 기준 강화 조치 요약",
        content: "법무부 출입국관리국에서 F-2-7 우수인재 거주 비자 소지자의 연장 신청 시 소득 증빙 요건 및 한국어 성적 검증을 강화하겠다는 지침을 내렸습니다.\n\n특히 직전 연도 소득이 GNI 1배수 미만일 경우 가점이 대폭 차감되며 연장 기간이 제한될 수 있습니다. 연장 만료일이 3개월 미만으로 남으신 분들은 소득금액증명원 및 TOPIK 유효기간을 확인하시어 대비해 주시기 바랍니다.",
        category: "Visa News",
        is_published: true,
        created_at: "2026-05-28T14:30:00.000Z",
        updated_at: "2026-05-28T14:30:00.000Z"
    },
    {
        id: "post-3",
        title: "D-10 구직 비자에서 E-7 특정활동 비자 변경 시 인턴십 경력 인정",
        content: "Q: 한국 대학 졸업 후 D-10 비자로 구직 중인데, 국내 IT 벤처기업에서 3개월 동안 근무했습니다. 이 인턴 경력이 E-7 고용추천서 발급이나 실무 경력 1년 기준에 반영될 수 있을까요?\n\nA: D-10 구직 비자 상태에서의 합법적인 인턴 활동(출입국 사전 신고 완료 및 인턴 허용 요건 충족 건)은 E-7 고용추천서 발급 시 우호적인 참작 요소가 됩니다. 다만, 법적인 실무 경력 조건(학사 소지자 1년 경력 요건) 자체를 대체할 수는 없으므로 정식 학위 취득 시점 이후의 상근직 근무 경력증명서가 필요합니다.",
        category: "Q&A",
        is_published: true,
        created_at: "2026-05-25T11:15:00.000Z",
        updated_at: "2026-05-25T11:15:00.000Z"
    }
];

/**
 * Check if Supabase is properly configured (not using placeholder values).
 */
function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    return url !== '' && !url.includes('placeholder');
}

// ──────────────────────────────────────────────
// READ
// ──────────────────────────────────────────────

export async function getBoardPosts(): Promise<{ posts: BoardPost[]; isLocal: boolean }> {
    if (!isSupabaseConfigured()) {
        return { posts: getLocalPosts(), isLocal: true };
    }

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase posts SELECT error:", error);
            return { posts: getLocalPosts(), isLocal: true };
        }

        if (!data || data.length === 0) {
            return { posts: getLocalPosts(), isLocal: true };
        }

        return { posts: data as BoardPost[], isLocal: false };
    } catch (err) {
        console.error("Supabase posts exception:", err);
        return { posts: getLocalPosts(), isLocal: true };
    }
}

// ──────────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────────

export async function createBoardPost(post: {
    title: string;
    content: string;
    category: string;
    is_published?: boolean;
}): Promise<{ post: BoardPost; isLocal: boolean }> {
    if (!isSupabaseConfigured()) {
        return { post: createLocalPost(post), isLocal: true };
    }

    try {
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                title: post.title,
                content: post.content,
                category: post.category,
                is_published: post.is_published ?? true
            }])
            .select()
            .single();

        if (error) throw error;
        return { post: data as BoardPost, isLocal: false };
    } catch (err) {
        console.error("Supabase create failed, using localStorage:", err);
        return { post: createLocalPost(post), isLocal: true };
    }
}

// ──────────────────────────────────────────────
// UPDATE
// ──────────────────────────────────────────────

export async function updateBoardPost(id: string, updates: {
    title?: string;
    content?: string;
    category?: string;
    is_published?: boolean;
}): Promise<{ post: BoardPost; isLocal: boolean }> {
    if (!isSupabaseConfigured()) {
        return { post: updateLocalPost(id, updates), isLocal: true };
    }

    try {
        const { data, error } = await supabase
            .from('posts')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return { post: data as BoardPost, isLocal: false };
    } catch (err) {
        console.error("Supabase update failed, using localStorage:", err);
        return { post: updateLocalPost(id, updates), isLocal: true };
    }
}

// ──────────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────────

export async function deleteBoardPost(id: string): Promise<{ success: boolean; isLocal: boolean }> {
    if (!isSupabaseConfigured()) {
        deleteLocalPost(id);
        return { success: true, isLocal: true };
    }

    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true, isLocal: false };
    } catch (err) {
        console.error("Supabase delete failed, using localStorage:", err);
        deleteLocalPost(id);
        return { success: true, isLocal: true };
    }
}

// ──────────────────────────────────────────────
// AUTH HELPERS
// ──────────────────────────────────────────────

export async function isAdminLoggedIn(): Promise<boolean> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return !!session;
    } catch {
        return false;
    }
}

// ──────────────────────────────────────────────
// LOCAL STORAGE HELPERS (Fallback)
// ──────────────────────────────────────────────

function getLocalPosts(): BoardPost[] {
    if (typeof window === 'undefined') return DEFAULT_POSTS;
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
        try {
            return JSON.parse(raw) as BoardPost[];
        } catch {
            return DEFAULT_POSTS;
        }
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
}

function saveLocalPosts(posts: BoardPost[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
}

function createLocalPost(input: { title: string; content: string; category: string; is_published?: boolean }): BoardPost {
    const posts = getLocalPosts();
    const newPost: BoardPost = {
        id: "local-" + Math.random().toString(36).substr(2, 9),
        title: input.title,
        content: input.content,
        category: input.category,
        is_published: input.is_published ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    const updated = [newPost, ...posts];
    saveLocalPosts(updated);
    return newPost;
}

function updateLocalPost(id: string, updates: Partial<BoardPost>): BoardPost {
    const posts = getLocalPosts();
    let updatedPost: BoardPost | null = null;
    const newPosts = posts.map(p => {
        if (p.id === id) {
            updatedPost = { ...p, ...updates, updated_at: new Date().toISOString() };
            return updatedPost;
        }
        return p;
    });
    saveLocalPosts(newPosts);
    return updatedPost || posts[0];
}

function deleteLocalPost(id: string): void {
    const posts = getLocalPosts();
    saveLocalPosts(posts.filter(p => p.id !== id));
}
