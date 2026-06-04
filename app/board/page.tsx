"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    FileText, 
    Plus, 
    Edit, 
    Trash2, 
    X, 
    MessageSquare, 
    Database, 
    CloudOff, 
    Calendar,
    ChevronRight,
    AlertCircle,
    ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    getBoardPosts,
    createBoardPost,
    updateBoardPost,
    deleteBoardPost,
    isAdminLoggedIn,
    BoardPost
} from "@/lib/board-db";

export default function BoardPage() {
    const [posts, setPosts] = useState<BoardPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BoardPost[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isLocalStorageMode, setIsLocalStorageMode] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    
    // UI state
    const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formCategory, setFormCategory] = useState("Notice");
    const [formContent, setFormContent] = useState("");
    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    // 1. Fetch initial posts & check admin status
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const { posts: fetchedPosts, isLocal } = await getBoardPosts();
                setPosts(fetchedPosts);
                setIsLocalStorageMode(isLocal);
            } catch (err) {
                console.error("Failed to load board posts.", err);
            }
        };

        const checkAdmin = async () => {
            try {
                const admin = await isAdminLoggedIn();
                setIsAdmin(admin);
            } catch (err) {
                console.error("Failed to check admin status.", err);
                setIsAdmin(false);
            }
        };

        loadInitialData();
        checkAdmin();
    }, []);

    // 2. Filter posts when state changes
    useEffect(() => {
        let results = posts;
        if (selectedCategory !== "All") {
            results = results.filter(p => p.category === selectedCategory);
        }
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            results = results.filter(
                p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query)
            );
        }
        setFilteredPosts(results);
    }, [posts, searchQuery, selectedCategory]);

    // 3. Create or Update handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle.trim() || !formContent.trim()) {
            alert("제목과 내용을 모두 입력해 주세요.");
            return;
        }

        if (editingPostId) {
            // Update mode
            try {
                const { post: updatedPost, isLocal } = await updateBoardPost(editingPostId, {
                    title: formTitle,
                    content: formContent,
                    category: formCategory,
                });
                setIsLocalStorageMode(isLocal);

                const updatedList = posts.map(p => p.id === editingPostId ? updatedPost : p);
                setPosts(updatedList);
                if (selectedPost && selectedPost.id === editingPostId) setSelectedPost(updatedPost);
            } catch (err) {
                console.error("Failed to update post.", err);
            }
        } else {
            // Create mode
            try {
                const { post: newPost, isLocal } = await createBoardPost({
                    title: formTitle,
                    content: formContent,
                    category: formCategory,
                });
                setIsLocalStorageMode(isLocal);
                setPosts([newPost, ...posts]);
            } catch (err) {
                console.error("Failed to create post.", err);
            }
        }

        closeForm();
    };

    // 4. Delete handler
    const handleDelete = async (postId: string) => {
        if (!confirm("정말 이 글을 삭제하시겠습니까?")) return;

        try {
            const { success, isLocal } = await deleteBoardPost(postId);
            if (success) {
                setIsLocalStorageMode(isLocal);
                setPosts(posts.filter(p => p.id !== postId));
                if (selectedPost && selectedPost.id === postId) setSelectedPost(null);
            }
        } catch (err) {
            console.error("Failed to delete post.", err);
        }
    };

    // UI state controllers
    const openCreateForm = () => {
        setFormTitle("");
        setFormCategory("Notice");
        setFormContent("");
        setEditingPostId(null);
        setIsFormOpen(true);
    };

    const openEditForm = (post: BoardPost) => {
        setFormTitle(post.title);
        setFormCategory(post.category);
        setFormContent(post.content);
        setEditingPostId(post.id);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingPostId(null);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-600/10 selection:text-blue-600">
            {/* Header sub-banner */}
            <div className="bg-slate-900 text-white relative py-12 px-4 border-b border-slate-800">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-amber-500 text-sm font-semibold tracking-wider uppercase">
                            <MessageSquare className="h-4 w-4" />
                            Community & Board
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-100">
                            법률 정보 및 게시판
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base font-light">
                            출입국 고시 및 주요 비자 뉴스, 질문 답변을 공유하는 공간입니다.
                        </p>
                    </div>

                    {/* Sync Status Badge */}
                    <div className="flex items-center gap-3">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur border ${
                            isLocalStorageMode 
                                ? "bg-amber-950/40 text-amber-400 border-amber-500/30" 
                                : "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                        }`}>
                            {isLocalStorageMode ? (
                                <>
                                    <CloudOff className="h-3 w.5 animate-pulse" />
                                    <span>로컬 테스트 모드 (임시 저장)</span>
                                </>
                            ) : (
                                <>
                                    <Database className="h-3 w-3" />
                                    <span>서버 연동 모드 (PostgreSQL)</span>
                                </>
                            )}
                        </div>
                        
                        {isAdmin && (
                            <Button 
                                onClick={openCreateForm} 
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-medium shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                            >
                                <Plus className="h-4 w-4" />
                                글쓰기
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-12">
                {selectedPost ? (
                    /* Detailed Post View */
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 md:p-8 space-y-6"
                    >
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                            <Button 
                                variant="ghost" 
                                onClick={() => setSelectedPost(null)}
                                className="text-slate-600 hover:text-slate-900 gap-2 pl-0 hover:bg-transparent"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                목록으로 돌아가기
                            </Button>

                            {isAdmin && (
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => openEditForm(selectedPost)}
                                        className="gap-1 border-slate-200 text-slate-700 hover:bg-slate-50"
                                    >
                                        <Edit className="h-3.5 w-3.5" />
                                        수정
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleDelete(selectedPost.id)}
                                        className="gap-1 border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        삭제
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge className={
                                    selectedPost.category === "Notice" ? "bg-amber-500 hover:bg-amber-600 text-white" :
                                    selectedPost.category === "Visa News" ? "bg-blue-600 hover:bg-blue-700 text-white" :
                                    "bg-slate-600 hover:bg-slate-700 text-white"
                                }>
                                    {selectedPost.category === "Notice" ? "공지사항" :
                                     selectedPost.category === "Visa News" ? "비자 뉴스" : "Q&A"}
                                </Badge>
                                <span className="text-sm text-slate-500 flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(selectedPost.created_at)}
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">
                                {selectedPost.title}
                            </h2>
                        </div>

                        <div className="text-slate-700 leading-relaxed text-base whitespace-pre-line py-4 border-t border-slate-100">
                            {selectedPost.content}
                        </div>
                    </motion.div>
                ) : (
                    /* Post List View */
                    <div className="space-y-8">
                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            {/* Category Filter Tabs */}
                            <div className="flex gap-2 border-b border-slate-100 md:border-b-0 pb-2 md:pb-0 overflow-x-auto scrollbar-none">
                                {["All", "Notice", "Visa News", "Q&A"].map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                                            selectedCategory === category
                                                ? "bg-slate-900 text-white"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                        }`}
                                    >
                                        {category === "All" ? "전체" :
                                         category === "Notice" ? "공지사항" :
                                         category === "Visa News" ? "비자 뉴스" : "Q&A"}
                                    </button>
                                ))}
                            </div>

                            {/* Search bar */}
                            <div className="relative w-full md:max-w-xs">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="글 제목, 내용 검색..."
                                    className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* List cards */}
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium">검색되거나 등록된 게시글이 없습니다.</p>
                                {isAdmin && (
                                    <Button onClick={openCreateForm} variant="link" className="mt-2 text-blue-600 font-medium">
                                        첫 번째 게시글 작성하기
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredPosts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        layoutId={post.id}
                                        className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
                                        onClick={() => setSelectedPost(post)}
                                    >
                                        <div className="p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <Badge className={
                                                    post.category === "Notice" ? "bg-amber-500/10 text-amber-600 border-amber-200/50" :
                                                    post.category === "Visa News" ? "bg-blue-600/10 text-blue-600 border-blue-200/50" :
                                                    "bg-slate-600/10 text-slate-600 border-slate-200/50"
                                                } variant="outline">
                                                    {post.category === "Notice" ? "공지사항" :
                                                     post.category === "Visa News" ? "비자 뉴스" : "Q&A"}
                                                </Badge>

                                                <span className="text-xs text-slate-400 font-medium">
                                                    {formatDate(post.created_at)}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-3">
                                                    {post.content}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 group-hover:bg-slate-50 transition-colors flex items-center justify-between">
                                            <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                                                자세히 읽기 <ChevronRight className="h-3 w-3" />
                                            </span>

                                            {/* Action quick icons */}
                                            {isAdmin && (
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => openEditForm(post)}
                                                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                                        title="수정"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(post.id)}
                                                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                                        title="삭제"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Slide-in Drawer Modal Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        {/* Background Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={closeForm}
                            className="fixed inset-0 bg-black"
                        />

                        {/* Modal Body */}
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-lg bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden"
                            >
                                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
                                    <h3 className="font-serif font-bold text-lg text-slate-100">
                                        {editingPostId ? "게시글 수정" : "새 게시글 작성"}
                                    </h3>
                                    <button onClick={closeForm} className="text-slate-400 hover:text-white transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-slate-700 font-medium">분류</Label>
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                                        >
                                            <option value="Notice">공지사항 (Notice)</option>
                                            <option value="Visa News">비자 뉴스 (Visa News)</option>
                                            <option value="Q&A">질문 답변 (Q&A)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-slate-700 font-medium">제목</Label>
                                        <Input
                                            type="text"
                                            placeholder="제목을 입력해 주세요."
                                            value={formTitle}
                                            onChange={(e) => setFormTitle(e.target.value)}
                                            className="bg-white border-slate-200 focus-visible:ring-blue-600"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-slate-700 font-medium">내용</Label>
                                        <textarea
                                            placeholder="본문 내용을 입력해 주세요."
                                            value={formContent}
                                            onChange={(e) => setFormContent(e.target.value)}
                                            className="flex min-h-[200px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 leading-relaxed"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                        <Button type="button" variant="outline" onClick={closeForm} className="border-slate-200 text-slate-700">
                                            취소
                                        </Button>
                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                                            {editingPostId ? "수정 완료" : "작성 완료"}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
