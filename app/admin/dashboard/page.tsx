"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
    getSupabasePosts, 
    createSupabasePost, 
    updateSupabasePost, 
    deleteSupabasePost,
    parseMarkdownToBlocks,
    blocksToMarkdown
} from "@/lib/blog-db";
import { BLOG_CATEGORIES, BlogPost, BlogCategoryId } from "@/lib/blog-posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Plus, 
    Edit, 
    Trash2, 
    LogOut, 
    FileText, 
    BookOpen,
    Eye,
    Globe,
    Settings,
    Loader2,
    X,
    Calendar,
    PenTool
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    
    // Auth State
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Editor Form State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    // Form fields
    const [formSlug, setFormSlug] = useState("");
    const [formTitle, setFormTitle] = useState("");
    const [formTitleEn, setFormTitleEn] = useState("");
    const [formExcerpt, setFormExcerpt] = useState("");
    const [formCategory, setFormCategory] = useState<BlogCategoryId>("investor");
    const [formKeywords, setFormKeywords] = useState("");
    const [formReadMinutes, setFormReadMinutes] = useState(5);
    const [formAuthor, setFormAuthor] = useState("김앤현 법률사무소");
    const [formMarkdown, setFormMarkdown] = useState("");
    const [formPublishedAt, setFormPublishedAt] = useState("");
    const [oldSlug, setOldSlug] = useState(""); // to track updates if slug changes
    
    const [isSaving, setIsSaving] = useState(false);

    // 1. Auth Protection
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/admin");
            } else {
                setUserEmail(session.user.email || "Admin");
                fetchPosts();
            }
        };
        checkAuth();
    }, [router]);

    const fetchPosts = async () => {
        setLoading(true);
        const data = await getSupabasePosts();
        setPosts(data);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin");
    };

    const handleCreateNew = () => {
        setEditMode(false);
        setFormSlug("");
        setFormTitle("");
        setFormTitleEn("");
        setFormExcerpt("");
        setFormCategory("investor");
        setFormKeywords("");
        setFormReadMinutes(5);
        setFormAuthor("김앤현 법률사무소");
        setFormMarkdown("");
        setFormPublishedAt(new Date().toISOString().split("T")[0]);
        setOldSlug("");
        setIsEditorOpen(true);
    };

    const handleEdit = (post: BlogPost) => {
        setEditMode(true);
        setFormSlug(post.slug);
        setFormTitle(post.title);
        setFormTitleEn(post.titleEn || "");
        setFormExcerpt(post.excerpt);
        setFormCategory(post.category);
        setFormKeywords(post.keywords.join(", "));
        setFormReadMinutes(post.readMinutes);
        setFormAuthor(post.author);
        setFormMarkdown(blocksToMarkdown(post.body));
        setFormPublishedAt(post.publishedAt);
        setOldSlug(post.slug);
        setIsEditorOpen(true);
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("정말 이 글을 영구 삭제하시겠습니까? 데이터베이스에서 완전히 제거됩니다.")) return;
        
        try {
            await deleteSupabasePost(slug);
            alert("성공적으로 삭제되었습니다.");
            fetchPosts();
        } catch (err: any) {
            alert(`삭제 실패: ${err.message}`);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formSlug.trim() || !formTitle.trim() || !formExcerpt.trim() || !formMarkdown.trim()) {
            alert("슬러그, 제목, 요약, 본문은 필수 입력 사항입니다.");
            return;
        }

        // Validate slug formatting: english letters, numbers, and hyphens only
        if (!/^[a-z0-9-]+$/.test(formSlug)) {
            alert("슬러그는 소문자 영문, 숫자, 하이픈(-)만 포함할 수 있습니다. (예: visa-d8-basics)");
            return;
        }

        setIsSaving(true);

        const keywordsArray = formKeywords
            .split(",")
            .map(k => k.trim())
            .filter(k => k !== "");

        const parsedBody = parseMarkdownToBlocks(formMarkdown);

        const payload = {
            slug: formSlug,
            title: formTitle,
            titleEn: formTitleEn || undefined,
            excerpt: formExcerpt,
            category: formCategory,
            keywords: keywordsArray,
            readMinutes: formReadMinutes,
            author: formAuthor,
            body: parsedBody,
            publishedAt: formPublishedAt || new Date().toISOString().split("T")[0]
        };

        try {
            if (editMode) {
                // If slug changed, delete old one and create new one, or update with current slug.
                // Supabase query update handles slug mapping.
                await updateSupabasePost(oldSlug, payload);
            } else {
                await createSupabasePost(payload);
            }
            setIsEditorOpen(false);
            fetchPosts();
            alert("게시글이 저장되었습니다.");
        } catch (err: any) {
            alert(`저장 중 오류 발생: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const getCategoryLabel = (catId: BlogCategoryId) => {
        return BLOG_CATEGORIES.find(c => c.id === catId)?.label || catId;
    };

    // Auto-generate slug from English input or a simplified translit
    const handleTitleBlur = () => {
        if (!formSlug && formTitle) {
            // Clean title for a default slug guess
            const autoSlug = formTitle
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "") // remove special chars
                .trim()
                .replace(/\s+/g, "-"); // replace spaces with hyphens
            setFormSlug(autoSlug);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
            {/* Header banner */}
            <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-blue-500" />
                        <h1 className="font-serif text-lg font-bold text-slate-200">
                            Kim&Hyun Blog Portal <span className="text-xs text-blue-500 font-sans font-normal ml-2">Console</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-400 font-mono hidden md:inline-block">
                            Logged in: {userEmail}
                        </span>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-white hover:bg-slate-800 gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            로그아웃
                        </Button>
                    </div>
                </div>
            </header>

            {/* Dashboard Container */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Console controller header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
                                <PenTool className="h-5 w-5 text-blue-500" />
                                블로그 기사 관리
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Supabase 실시간 연동 중. 여기에 올라간 글은 사이트 블로그 페이지에 즉시 노출됩니다.
                            </p>
                        </div>
                        <Button 
                            onClick={handleCreateNew} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2 shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            <Plus className="h-4 w-4" />
                            새 칼럼 작성
                        </Button>
                    </div>

                    {/* Posts list grid */}
                    <Card className="bg-slate-950 border-slate-800 text-slate-200">
                        <CardHeader className="border-b border-slate-800">
                            <CardTitle className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
                                현재 등록된 게시글 목록
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                    <p className="text-xs text-slate-400">데이터베이스 로드 중...</p>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-20 space-y-4">
                                    <FileText className="h-12 w-12 mx-auto text-slate-700" />
                                    <p className="text-sm text-slate-400 font-medium">등록된 블로그 기사가 없습니다.</p>
                                    <Button onClick={handleCreateNew} variant="link" className="text-blue-500">
                                        첫 번째 칼럼 발행하기
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase bg-slate-900/50">
                                                <th className="px-6 py-4">분류</th>
                                                <th className="px-6 py-4">제목</th>
                                                <th className="px-6 py-4">발행일</th>
                                                <th className="px-6 py-4 text-right">작업</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 text-sm">
                                            {posts.map((post) => (
                                                <tr key={post.slug} className="hover:bg-slate-900/30 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                                                            {getCategoryLabel(post.category)}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-slate-200 line-clamp-1">{post.title}</div>
                                                        <div className="text-xs text-slate-500 mt-0.5 font-mono">/blog/{post.slug}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">
                                                        {post.publishedAt}
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            onClick={() => handleEdit(post)}
                                                            className="border-slate-800 hover:bg-slate-800 hover:text-white text-slate-400 h-8"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                            <span className="hidden sm:inline ml-1.5">수정</span>
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            onClick={() => handleDelete(post.slug)}
                                                            className="border-slate-800 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/40 text-slate-500 h-8"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            <span className="hidden sm:inline ml-1.5">삭제</span>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Markdown Full-screen Editor Modal Overlay */}
            <AnimatePresence>
                {isEditorOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 15 }}
                            className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
                        >
                            {/* Editor Header */}
                            <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <PenTool className="h-5 w-5 text-blue-500" />
                                    <h3 className="font-serif font-bold text-slate-100">
                                        {editMode ? "블로그 글 수정" : "새 블로그 글 작성"}
                                    </h3>
                                </div>
                                <button onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Editor Form Body (Scrollable) */}
                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="title" className="text-xs font-semibold text-slate-400 uppercase">제목 (Title) *</Label>
                                        <Input
                                            id="title"
                                            value={formTitle}
                                            onChange={(e) => setFormTitle(e.target.value)}
                                            onBlur={handleTitleBlur}
                                            placeholder="한국 투자비자 D-8 기본 요건 안내"
                                            className="bg-slate-950 border-slate-800 focus-visible:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* English Subtitle */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="titleEn" className="text-xs font-semibold text-slate-400 uppercase">영문 부제 (English Subtitle)</Label>
                                        <Input
                                            id="titleEn"
                                            value={formTitleEn}
                                            onChange={(e) => setFormTitleEn(e.target.value)}
                                            placeholder="Korea D-8 Investor Visa Basic Requirements"
                                            className="bg-slate-950 border-slate-800 focus-visible:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Slug */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="slug" className="text-xs font-semibold text-slate-400 uppercase">슬러그 URL (Slug) *</Label>
                                        <Input
                                            id="slug"
                                            value={formSlug}
                                            onChange={(e) => setFormSlug(e.target.value)}
                                            placeholder="d8-investor-visa-basics"
                                            className="bg-slate-950 border-slate-800 focus-visible:ring-blue-500 font-mono text-xs"
                                            required
                                        />
                                        <p className="text-[10px] text-slate-500">영문 소문자, 숫자, 하이픈(-)만 가능</p>
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="category" className="text-xs font-semibold text-slate-400 uppercase">분류 (Category) *</Label>
                                        <select
                                            id="category"
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value as BlogCategoryId)}
                                            className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                                        >
                                            {BLOG_CATEGORIES.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Published Date */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="publishedAt" className="text-xs font-semibold text-slate-400 uppercase">발행일 (Published At) *</Label>
                                        <Input
                                            id="publishedAt"
                                            type="date"
                                            value={formPublishedAt}
                                            onChange={(e) => setFormPublishedAt(e.target.value)}
                                            className="bg-slate-950 border-slate-800 focus-visible:ring-blue-500 text-xs"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Read Minutes */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="readMinutes" className="text-xs font-semibold text-slate-400 uppercase">소요 시간 (분 단위) *</Label>
                                        <Input
                                            id="readMinutes"
                                            type="number"
                                            value={formReadMinutes}
                                            onChange={(e) => setFormReadMinutes(parseInt(e.target.value))}
                                            min="1"
                                            className="bg-slate-950 border-slate-800 focus-visible:ring-blue-500 text-xs"
                                            required
                                        />
                                    </div>

                                    {/* Author */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="author" className="text-xs font-semibold text-slate-400 uppercase">작성인 (Author) *</Label>
                                        <Input
                                            id="author"
                                            value={formAuthor}
                                            onChange={(e) => setFormAuthor(e.target.value)}
                                            className="bg-slate-950 border-slate-800 focus-visible:ring-blue-500 text-xs"
                                            required
                                        />
                                    </div>

                                    {/* Keywords */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="keywords" className="text-xs font-semibold text-slate-400 uppercase">검색 키워드 (쉼표 구분)</Label>
                                        <Input
                                            id="keywords"
                                            value={formKeywords}
                                            onChange={(e) => setFormKeywords(e.target.value)}
                                            placeholder="D-8 비자, 투자비자, FDI"
                                            className="bg-slate-950 border-slate-800 focus-visible:ring-blue-500 text-xs"
                                        />
                                    </div>
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="excerpt" className="text-xs font-semibold text-slate-400 uppercase">상세 요약 설명 (Excerpt) *</Label>
                                    <textarea
                                        id="excerpt"
                                        value={formExcerpt}
                                        onChange={(e) => setFormExcerpt(e.target.value)}
                                        placeholder="외국인 투자비자 신청 자격 요건을 다룬 실무 가이드 요약..."
                                        className="flex min-h-[70px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Markdown Content Body */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="markdown" className="text-xs font-semibold text-slate-400 uppercase">본문 내용 (Markdown) *</Label>
                                        <span className="text-[10px] text-slate-500">마크다운 서식을 그대로 작성하세요.</span>
                                    </div>
                                    <div className="border border-slate-800 rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 h-96">
                                        {/* Editor Textarea */}
                                        <textarea
                                            id="markdown"
                                            value={formMarkdown}
                                            onChange={(e) => setFormMarkdown(e.target.value)}
                                            placeholder="## 1. 최소 자본금&#10;여기에 세부 본문 내용을 자연스럽게 작성하세요.&#10;&#10;- 리스트 항목 1&#10;- 리스트 항목 2&#10;&#10;[callout] 주의: 강조하고 싶은 법률 자문 내용"
                                            className="w-full h-full p-4 bg-slate-950 border-0 resize-none font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 border-r border-slate-800"
                                            required
                                        />

                                        {/* Simple Markdown Preview */}
                                        <div className="p-4 overflow-y-auto bg-slate-950/40 text-slate-300 text-sm leading-relaxed prose-like space-y-3 select-none">
                                            <div className="text-[10px] font-semibold text-slate-600 border-b border-slate-800 pb-1.5 mb-2 uppercase tracking-wide">실시간 미리보기 화면</div>
                                            {formMarkdown ? (
                                                parseMarkdownToBlocks(formMarkdown).map((block, idx) => {
                                                    switch (block.type) {
                                                        case 'h2':
                                                            return <h2 key={idx} className="font-serif text-lg font-bold text-slate-100 mt-4 leading-snug border-l-2 border-blue-500 pl-2">{block.text}</h2>;
                                                        case 'h3':
                                                            return <h3 key={idx} className="font-serif text-base font-bold text-slate-200 mt-3 leading-snug">{block.text}</h3>;
                                                        case 'p':
                                                            return <p key={idx} className="text-xs text-slate-400 whitespace-pre-wrap">{block.text}</p>;
                                                        case 'list':
                                                            const Tag = block.ordered ? 'ol' : 'ul';
                                                            return (
                                                                <Tag key={idx} className={`pl-5 text-xs text-slate-400 space-y-1 ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
                                                                    {block.items.map((it, i) => <li key={i}>{it}</li>)}
                                                                </Tag>
                                                            );
                                                        case 'callout':
                                                            return (
                                                                <div key={idx} className="border border-amber-900/40 bg-amber-950/20 p-3 rounded-lg text-amber-400/90 text-xs">
                                                                    <div className="font-bold text-[10px] uppercase mb-0.5 tracking-wider">{block.title}</div>
                                                                    <div>{block.text}</div>
                                                                </div>
                                                            );
                                                        default:
                                                            return null;
                                                    }
                                                })
                                            ) : (
                                                <p className="text-slate-600 text-xs italic">본문을 입력하면 미리보기가 생성됩니다.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* Editor Footer */}
                            <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)} className="border-slate-850 text-slate-400 hover:bg-slate-800">
                                    취소
                                </Button>
                                <Button type="button" onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                                    {isSaving ? (
                                        <span className="flex items-center gap-1.5">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            저장 중...
                                        </span>
                                    ) : (
                                        "발행 완료"
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
