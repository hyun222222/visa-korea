import { supabase } from './supabase';
import { blogPostsSortedByDate, getPostBySlug, BlogPost, BlogBlock } from './blog-posts';

/**
 * Parses markdown body into dynamic BlogBlocks.
 */
export function parseMarkdownToBlocks(md: string): BlogBlock[] {
    const blocks: BlogBlock[] = [];
    const lines = md.split(/\r?\n/);
    let currentListItems: string[] = [];
    let isListOrdered = false;

    const flushList = () => {
        if (currentListItems.length > 0) {
            blocks.push({
                type: 'list',
                items: [...currentListItems],
                ordered: isListOrdered
            });
            currentListItems = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === '') {
            flushList();
            continue;
        }

        // List item check
        if (line.startsWith('- ') || line.startsWith('* ')) {
            if (isListOrdered) flushList();
            isListOrdered = false;
            currentListItems.push(line.substring(2).trim());
            continue;
        }

        const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (orderedMatch) {
            if (!isListOrdered) flushList();
            isListOrdered = true;
            currentListItems.push(orderedMatch[2].trim());
            continue;
        }

        // Flush any active list since this is a different block type
        flushList();

        // Headers
        if (line.startsWith('## ')) {
            blocks.push({ type: 'h2', text: line.substring(3).trim() });
        } else if (line.startsWith('### ')) {
            blocks.push({ type: 'h3', text: line.substring(4).trim() });
        }
        // Callout
        else if (line.toLowerCase().startsWith('[callout]')) {
            const content = line.substring(9).trim();
            const colonIndex = content.indexOf(':');
            if (colonIndex !== -1) {
                const title = content.substring(0, colonIndex).trim();
                const text = content.substring(colonIndex + 1).trim();
                blocks.push({ type: 'callout', title, text });
            } else {
                blocks.push({ type: 'callout', title: '참고', text: content });
            }
        }
        // Normal paragraph
        else {
            blocks.push({ type: 'p', text: line });
        }
    }

    flushList();
    return blocks;
}

/**
 * Converts dynamic BlogBlocks back into natural markdown for editing.
 */
export function blocksToMarkdown(blocks: BlogBlock[]): string {
    if (!blocks) return '';
    return blocks.map(block => {
        switch (block.type) {
            case 'h2':
                return `## ${block.text}`;
            case 'h3':
                return `### ${block.text}`;
            case 'p':
                return block.text;
            case 'list':
                return block.items.map((item, idx) => {
                    return block.ordered ? `${idx + 1}. ${item}` : `- ${item}`;
                }).join('\n');
            case 'callout':
                return `[callout] ${block.title}: ${block.text}`;
            default:
                return '';
        }
    }).join('\n\n');
}

/**
 * Fetch all posts from Supabase database (falls back to local static posts if offline or empty).
 */
export async function getSupabasePosts(): Promise<BlogPost[]> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) {
            console.error("Supabase SELECT error, using static fallback:", error);
            return blogPostsSortedByDate;
        }

        if (!data || data.length === 0) {
            return blogPostsSortedByDate;
        }

        return data.map(mapDbPostToBlogPost);
    } catch (err) {
        console.error("Supabase exception, using static fallback:", err);
        return blogPostsSortedByDate;
    }
}

/**
 * Fetch a single post by slug from Supabase (falls back to local static posts if offline).
 */
export async function getSupabasePostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();

        if (error) {
            console.error(`Supabase SELECT by slug (${slug}) error, using fallback:`, error);
            return getPostBySlug(slug);
        }

        if (!data) {
            return getPostBySlug(slug);
        }

        return mapDbPostToBlogPost(data);
    } catch (err) {
        console.error(`Supabase exception for slug ${slug}, using fallback:`, err);
        return getPostBySlug(slug);
    }
}

/**
 * Insert a new blog post into Supabase.
 */
export async function createSupabasePost(post: Omit<BlogPost, 'readMinutes' | 'publishedAt'> & { readMinutes?: number, publishedAt?: string }) {
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
            slug: post.slug,
            title: post.title,
            title_en: post.titleEn,
            excerpt: post.excerpt,
            category: post.category,
            keywords: post.keywords,
            read_minutes: post.readMinutes || 5,
            author: post.author,
            body: post.body,
            published_at: post.publishedAt || new Date().toISOString()
        }])
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

/**
 * Update an existing blog post in Supabase.
 */
export async function updateSupabasePost(slug: string, post: Partial<BlogPost>) {
    const updateData: any = {};
    if (post.title !== undefined) updateData.title = post.title;
    if (post.titleEn !== undefined) updateData.title_en = post.titleEn;
    if (post.excerpt !== undefined) updateData.excerpt = post.excerpt;
    if (post.category !== undefined) updateData.category = post.category;
    if (post.keywords !== undefined) updateData.keywords = post.keywords;
    if (post.readMinutes !== undefined) updateData.read_minutes = post.readMinutes;
    if (post.author !== undefined) updateData.author = post.author;
    if (post.body !== undefined) updateData.body = post.body;
    if (post.publishedAt !== undefined) updateData.published_at = post.publishedAt;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('slug', slug)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

/**
 * Delete a blog post from Supabase by slug.
 */
export async function deleteSupabasePost(slug: string) {
    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('slug', slug);
    
    if (error) throw error;
    return true;
}

function mapDbPostToBlogPost(dbPost: any): BlogPost {
    return {
        slug: dbPost.slug,
        title: dbPost.title,
        titleEn: dbPost.title_en || undefined,
        excerpt: dbPost.excerpt,
        category: dbPost.category,
        keywords: dbPost.keywords || [],
        publishedAt: typeof dbPost.published_at === 'string' 
            ? dbPost.published_at.split('T')[0] 
            : dbPost.published_at,
        readMinutes: dbPost.read_minutes,
        author: dbPost.author,
        body: dbPost.body || []
    };
}
