"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/admin/dashboard");
            } else {
                setInitializing(false);
            }
        };
        checkUser();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMsg("이메일과 비밀번호를 모두 입력해 주세요.");
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setErrorMsg(error.message === "Invalid login credentials" 
                    ? "이메일 또는 비밀번호가 일치하지 않습니다." 
                    : error.message);
                setLoading(false);
                return;
            }

            if (data.session) {
                router.push("/admin/dashboard");
            }
        } catch (err: any) {
            setErrorMsg("로그인 중 서버 요류가 발생했습니다.");
            setLoading(false);
        }
    };

    if (initializing) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="mt-4 text-slate-400 text-sm">연결 보안 검사 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 font-sans relative overflow-hidden">
            {/* Visual gradient backdrop */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="bg-slate-900/90 border-slate-800 text-white backdrop-blur shadow-2xl">
                    <CardHeader className="space-y-3 pb-6 border-b border-slate-800/60 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 mx-auto">
                            <Scale className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="font-serif text-2xl font-bold tracking-tight text-slate-100">
                                김앤현 법률사무소
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-sm font-light">
                                관리자 전용 블로그 관리 포탈
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            {errorMsg && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-start gap-2 leading-relaxed"
                                >
                                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span>{errorMsg}</span>
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                                    이메일 주소
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@kimnhyun.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-blue-500 focus-visible:border-blue-500 text-sm h-10 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                                    비밀번호
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-blue-500 focus-visible:border-blue-500 text-sm h-10 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 rounded-lg transition-transform hover:-translate-y-0.5 duration-200"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        로그인 중...
                                    </span>
                                ) : (
                                    "관리자 로그인"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
