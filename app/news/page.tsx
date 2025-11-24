"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/animate-wrapper";
import { Loader2, Calendar, Tag } from "lucide-react";

interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
}

export default function NewsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-serif font-bold text-slate-900 sm:text-4xl mb-4">Legal News & Updates</h1>
                    <p className="text-lg text-slate-600">
                        Latest immigration policy changes and notices from Kim&Hyun Law Office.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        No posts available at the moment.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post, index) => (
                            <FadeIn key={post.id} delay={index * 0.1}>
                                <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white rounded-sm">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground">
                                                <Tag className="w-3 h-3 mr-1" />
                                                {post.category}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl font-serif font-bold text-slate-900">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {post.content}
                                        </p>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
