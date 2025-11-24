import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const body = await request.json();
    const { title, content, category, is_published } = body;

    const { data, error } = await supabase
        .from('posts')
        .update({ title, content, category, is_published, updated_at: new Date() })
        .eq('id', params.id)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', params.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
