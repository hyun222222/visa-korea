"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, AlertCircle, ArrowLeft, CheckCircle, FileText, Scale } from "lucide-react";

export default function ChineseRefundDisputePage() {
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
                    <Link href="/zh" className="text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" /> 返回主页
                    </Link>
                    <span className="text-xs text-blue-650 font-bold tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-blue-600 shadow-xs">
                        赴韩整形退款纠纷法律援助
                    </span>
                </div>

                {/* Main Hero Summary */}
                <div className="space-y-4 text-center">
                    <div className="inline-flex h-12 w-12 rounded-full bg-blue-50 items-center justify-center text-blue-600 mb-2 border border-blue-100 shadow-xs">
                        <Scale className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                        韩国整形退款与医疗纠纷解决
                    </h1>
                    <p className="text-slate-650 text-lg max-w-2xl mx-auto leading-relaxed">
                        遭遇非法整形中介？手术效果不满意或产生严重副作用？金&贤律师事务所代理患者向韩国医院索赔，争取全额或部分退款。
                    </p>
                </div>

                {/* Legal and Consumer Rights */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" /> 韩国法律对外国患者退款与中介费的规定
                    </h2>
                    <div className="space-y-4 text-sm text-slate-650 leading-relaxed">
                        <p>
                            根据韩国《医疗法》及《消费者保护基本法》，医院在术前必须履行**知情同意（说明义务）**。如果医院未如实告知手术并发症、中介手续费比例，或引荐人未在保建福祉部登记，患者有权要求退还手术费。
                        </p>
                        <p>
                            非法招徕患者（无资质黑中介）在韩国属于**严重刑事犯罪**（医疗法第27条第3款）。通过律师函施压，指出医院的违法中介合作行为，是成功迫使医院退款的关键。
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 border-l-4 border-l-blue-600">
                            <span className="block text-xs font-bold uppercase text-slate-500 mb-2">退款维权主要法律依据：</span>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                                <li><strong>说明义务违反：</strong> 术前未充分说明手术风险或收费明细时，合同可依法解除。</li>
                                <li><strong>非法中介合作：</strong> 医院若与未登记中介合作并支付高额佣金，面临停业处罚，患者可据此施压。</li>
                                <li><strong>K-Medi 调解：</strong> 代理向韩国医疗纠纷调解仲裁院申请调解，快速达成具有法律效力的和解协议。</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Intake Form */}
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 text-center">免费在线退款可行性评估</h3>
                    <p className="text-slate-500 text-xs text-center max-w-lg mx-auto">
                        请简单描述您的遭遇（如手术项目、支付的手续费金额、目前的副作用等），律师将评估成功退款的概率。
                    </p>

                    {submitted ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700 text-sm">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                            提交成功！中文律师将尽快与您联系，提供具体维权建议。
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea 
                                required 
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                placeholder="请填写手术名称、消费金额、涉案中介姓名/机构，以及目前的退款诉求。"
                                className="w-full min-h-[100px] bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-500 resize-none transition-colors"
                            />
                            <button 
                                type="submit" 
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-xs"
                            >
                                申请免费案情评估
                            </button>
                        </form>
                    )}
                </div>

                {/* Footnote */}
                <p className="text-center text-[10px] text-slate-400">
                    * 金&贤律师事务所保护患者的一切隐私。所有咨询内容绝对保密。
                </p>
            </div>
        </div>
    );
}
