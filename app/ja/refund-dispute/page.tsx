"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, AlertCircle, ArrowLeft, CheckCircle, FileText, Scale } from "lucide-react";

export default function JapaneseRefundDisputePage() {
    const [complaint, setComplaint] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-16 px-4 selection:bg-blue-500/10 selection:text-blue-600">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Back Button */}
                <div className="flex justify-between items-center border-b border-slate-200 pb-6">
                    <Link href="/ja" className="text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" /> メインページへ戻る
                    </Link>
                    <span className="text-xs text-blue-650 font-bold tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-blue-600 shadow-xs">
                        美容整形返金トラブル法律支援
                    </span>
                </div>

                {/* Main Hero Summary */}
                <div className="space-y-4 text-center">
                    <div className="inline-flex h-12 w-12 rounded-full bg-blue-50 items-center justify-center text-blue-600 mb-2 border border-blue-100 shadow-xs">
                        <Scale className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                        韓国美容整形返金トラブル解決
                    </h1>
                    <p className="text-slate-655 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        違法あっせん業者による過剰請求、術後の副作用、または期待通りの結果が得られず返金を希望されますか？金&賢法律事務所が病院との交渉および法的解決を代理します。
                    </p>
                </div>

                {/* Legal Context */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" /> 外国人患者の法的権利および返金請求の根拠
                    </h2>
                    <div className="space-y-4 text-sm text-slate-650 leading-relaxed">
                        <p>
                            韓国の医療法に基づき、医師は施術前に副作用のリスクや手数料構造について十分な**説明義務（インフォームドコンセント）**を尽くす必要があります。義務を怠っていた場合、契約解除による返金請求が可能です。
                        </p>
                        <p>
                            また、無資格のあっせん業者を通じた患者誘致は、韓国では刑事処分の対象となります（医療法第27条第3項違反）。不適切なあっせん手数料の存在は、病院に対して有利に返金交渉を進める強力な材料となります。
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-blue-600">
                            <span className="block text-xs font-bold uppercase text-slate-500 mb-2">主な法的アプローチ：</span>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                                <li><strong>説明義務違反の立証:</strong> 同意書の記述内容や術前カウンセリングの証록を精査し、義務違反を追及します。</li>
                                <li><strong>違法手数料の開示請求:</strong> 手数料の過剰上乗せ分について不당利得返還を請求します。</li>
                                <li><strong>調停の代理申請:</strong> 韓国医療紛争調停仲裁院（K-Medi）等への調停申請を通じた迅速な合意形成。</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Intake Form */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 text-center">無料オンライン返金可否査定</h3>
                    <p className="text-slate-500 text-xs text-center max-w-lg mx-auto">
                        施術内容、お支払い金額、あっせん業者の有無、副作用の状況等をご記入ください。弁護士が返金の可能性を査定します。
                    </p>

                    {submitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700 text-sm">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            受け付けました。担当弁護士がカルテや経緯を確認し、早急に解決方針をご案内いたします。
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea 
                                required 
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                placeholder="施術された部位、支払った金額、トラブルの経緯について簡単にご記入ください。"
                                className="w-full min-h-[100px] bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 resize-none transition-colors"
                            />
                            <button 
                                type="submit" 
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-xs"
                            >
                                無料案情評価を申し込む
                            </button>
                        </form>
                    )}
                </div>

                {/* Footnote */}
                <p className="text-center text-[10px] text-slate-400">
                    * お客様の情報は守秘義務に基づき、厳重に保護されます。
                </p>
            </div>
        </div>
    );
}
