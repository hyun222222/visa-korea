import { BoardClient } from "@/components/anti-gravity/BoardClient";

export const dynamic = 'force-dynamic';

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <BoardClient id={id} />;
}
