"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Need to create this or use standard textarea
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Lock } from "lucide-react";

// Simple Textarea component if not exists
function SimpleTextarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState({ title: "", content: "", category: "News" });
    const [loading, setLoading] = useState(false);

    const checkAuth = () => {
        if (password === "admin1234") { // Simple hardcoded password for MVP
            setIsAuthenticated(true);
            fetchPosts();
        } else {
            alert("Incorrect password");
        }
    };

    const fetchPosts = async () => {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data);
    };

    const handleCreate = async () => {
        if (!newPost.title || !newPost.content) return;
        setLoading(true);
        await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        });
        setNewPost({ title: "", content: "", category: "News" });
        fetchPosts();
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        fetchPosts();
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" /> Admin Access
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && checkAuth()}
                            />
                        </div>
                        <Button onClick={checkAuth} className="w-full">Login</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Admin Dashboard</h1>
                    <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Logout</Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Create Post Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> New Post</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input
                                    value={newPost.category}
                                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <SimpleTextarea
                                    className="h-40"
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleCreate} disabled={loading} className="w-full">
                                {loading ? "Publishing..." : "Publish Post"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Post List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {posts.map(post => (
                                    <div key={post.id} className="p-4 border rounded-sm bg-slate-50 flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{post.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{new Date(post.created_at).toLocaleDateString()} • {post.category}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {posts.length === 0 && <p className="text-slate-500 text-center py-4">No posts found.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
