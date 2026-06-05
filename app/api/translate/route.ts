import { NextResponse } from 'next/server';
import { BlogBlock } from '@/lib/blog-posts';

async function translateText(text: string, targetLang: string): Promise<string> {
    if (!text || text.trim() === '') return '';
    
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Google Translate response status: ${res.status}`);
        
        const data = await res.json();
        if (data && data[0]) {
            return data[0].map((x: any) => x[0]).join('');
        }
        return text;
    } catch (err) {
        console.error(`Translation API error for target ${targetLang}:`, err);
        return text;
    }
}

async function translateBlock(block: BlogBlock, targetLang: string): Promise<BlogBlock> {
    switch (block.type) {
        case 'h2':
            return {
                type: 'h2',
                text: await translateText(block.text, targetLang)
            };
        case 'h3':
            return {
                type: 'h3',
                text: await translateText(block.text, targetLang)
            };
        case 'p':
            return {
                type: 'p',
                text: await translateText(block.text, targetLang)
            };
        case 'list':
            return {
                type: 'list',
                items: await Promise.all(
                    block.items.map(item => translateText(item, targetLang))
                ),
                ordered: block.ordered
            };
        case 'callout':
            return {
                type: 'callout',
                title: await translateText(block.title, targetLang),
                text: await translateText(block.text, targetLang)
            };
        default:
            return block;
    }
}

export async function POST(request: Request) {
    try {
        const { title, excerpt, body, keywords, targetLang } = await request.json();
        
        if (!title || !targetLang) {
            return NextResponse.json({ error: 'Missing title or targetLang' }, { status: 400 });
        }
        
        // Translate title, excerpt, body blocks, and keywords
        const translatedTitle = await translateText(title, targetLang);
        const translatedExcerpt = excerpt ? await translateText(excerpt, targetLang) : '';
        const translatedBody = body ? await Promise.all(
            body.map((block: BlogBlock) => translateBlock(block, targetLang))
        ) : [];
        const translatedKeywords = keywords ? await Promise.all(
            keywords.map((kw: string) => translateText(kw, targetLang))
        ) : [];
        
        return NextResponse.json({
            title: translatedTitle,
            excerpt: translatedExcerpt,
            body: translatedBody,
            keywords: translatedKeywords
        });
    } catch (err: any) {
        console.error('Translation route handler exception:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
