"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { CAMPAIGN_TEMPLATES, CampaignCategory, CampaignTemplate } from "@/lib/campaign-templates";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

type Step = 'category' | 'form' | 'confirmation';

export function CreateCampaignModal({ isOpen, onClose, onSubmit }: CreateCampaignModalProps) {
    const [step, setStep] = useState<Step>('category');
    const [selectedCategory, setSelectedCategory] = useState<CampaignCategory | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({
        title: "",
        description: "",
        openChatLink: ""
    });
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const template = selectedCategory ? CAMPAIGN_TEMPLATES[selectedCategory] : null;

    const handleCategorySelect = (category: CampaignCategory) => {
        setSelectedCategory(category);
        setStep('form');
    };

    const handleBack = () => {
        if (step === 'form') {
            setStep('category');
            setSelectedCategory(null);
            setFormData({ title: "", description: "", openChatLink: "" });
        } else if (step === 'confirmation') {
            setStep('form');
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('confirmation');
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Upload File (if exists)
            let evidenceUrl = null;
            if (file) {
                const fileName = `${Date.now()}_${file.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('evidence')
                    .upload(fileName, file);

                if (!uploadError && uploadData) {
                    evidenceUrl = uploadData.path;
                }
            }

            // 2. Insert Campaign Data
            const { data, error } = await supabase
                .from('campaigns')
                .insert({
                    category: selectedCategory,
                    title: formData.title,
                    description: formData.description,
                    open_chat_link: formData.openChatLink,
                    evidence_url: evidenceUrl,
                    metadata: formData, // Store all other dynamic fields
                    status: 'active',
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                console.error("Supabase Error:", error);
                alert("데이터베이스 저장 실패: " + error.message);
                setIsSubmitting(false);
                return;
            }

            if (!data) {
                alert("데이터가 저장되지 않았습니다.");
                setIsSubmitting(false);
                return;
            }

            // 3. Navigate to the new board
            const campaignId = data.id;

            onSubmit({
                ...formData,
                category: selectedCategory,
                template: template,
                id: campaignId
            });

            onClose();
            router.push(`/anti-gravity/board/${campaignId}`);

        } catch (err: any) {
            console.error("Submission Error:", err);
            alert("오류 발생: " + (err.message || "알 수 없는 오류"));
        } finally {
            setIsSubmitting(false);
            // Reset
            setStep('category');
            setSelectedCategory(null);
            setFormData({ title: "", description: "", openChatLink: "" });
            setFile(null);
        }
    };

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal - Fixed Structure with Flexbox Centering */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
                    >
                        {/* Fixed Header */}
                        <div className="flex-shrink-0 p-6 border-b border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">새로운 소송 모임 만들기</h3>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {step === 'category' && '30초면 베이스캠프가 만들어집니다'}
                                        {step === 'form' && '이 정보로 소장 초안이 자동 생성됩니다'}
                                        {step === 'confirmation' && '모임 생성을 확인해주세요'}
                                    </p>
                                </div>
                                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Progress Indicator */}
                            <div className="flex items-center gap-2">
                                <div className={`flex-1 h-1 rounded-full ${step === 'category' ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                                <div className={`flex-1 h-1 rounded-full ${step === 'form' ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                                <div className={`flex-1 h-1 rounded-full ${step === 'confirmation' ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Step 1: Category Selection */}
                            {step === 'category' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <p className="text-slate-300 mb-4">어떤 유형의 소송 모임인가요?</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.values(CAMPAIGN_TEMPLATES).map((template) => (
                                            <CategoryCard
                                                key={template.id}
                                                template={template}
                                                onClick={() => handleCategorySelect(template.id)}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Dynamic Form */}
                            {step === 'form' && template && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <form id="campaign-form" onSubmit={handleFormSubmit} className="space-y-4">
                                        {/* Category Badge */}
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${template.borderColor} ${template.bgGradient}`}>
                                            <template.icon className={`h-4 w-4 ${template.color}`} />
                                            <span className="text-sm font-medium text-white">{template.name}</span>
                                        </div>

                                        {/* Common Fields */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                                모임 이름 (소송 명) *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.title || ""}
                                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                                placeholder="예: 갤럭시 S25 배터리 결함 집단소송"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                                모임 설명 *
                                            </label>
                                            <textarea
                                                required
                                                value={formData.description || ""}
                                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                                placeholder="피해 내용과 소송 취지를 간단히 적어주세요."
                                                rows={3}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                                            />
                                        </div>

                                        {/* Category-Specific Fields */}
                                        {template.fields.map((field) => (
                                            <DynamicField
                                                key={field.id}
                                                field={field}
                                                value={formData[field.id]}
                                                onChange={(value) => handleFieldChange(field.id, value)}
                                            />
                                        ))}

                                        {/* Open Chat Link */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                                오픈카톡방 링크 (선택)
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.openChatLink || ""}
                                                onChange={(e) => handleFieldChange('openChatLink', e.target.value)}
                                                placeholder="https://open.kakao.com/..."
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>

                                        {/* File Upload */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                                증거 자료 (선택)
                                            </label>
                                            <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors cursor-pointer relative">
                                                <input
                                                    type="file"
                                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="h-6 w-6 text-slate-400" />
                                                    <span className="text-sm text-slate-400">
                                                        {file ? file.name : "클릭하여 파일 업로드 (이미지, PDF)"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* Step 3: Confirmation */}
                            {step === 'confirmation' && template && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                        <h4 className="font-bold text-white mb-3">모임 정보</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">카테고리:</span>
                                                <span className="text-white font-medium">{template.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">모임 이름:</span>
                                                <span className="text-white font-medium">{formData.title}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">공개 설정:</span>
                                                <span className="text-white font-medium">
                                                    {template.visibility === 'public' ? '공개' : '비공개 (단지 주민만)'}
                                                </span>
                                            </div>
                                            {file && (
                                                <div className="flex justify-between pt-2 border-t border-slate-700 mt-2">
                                                    <span className="text-slate-400">첨부 파일:</span>
                                                    <span className="text-white font-medium">{file.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                            <Check className="h-5 w-5 text-emerald-400" />
                                            자동 생성될 게시판
                                        </h4>
                                        <div className="space-y-2">
                                            {template.boardTabs.map((tab, index) => (
                                                <div key={tab.id} className="flex items-start gap-3 text-sm">
                                                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{tab.name}</div>
                                                        <div className="text-slate-400 text-xs">{tab.description}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Fixed Footer with Navigation Buttons */}
                        <div className="flex-shrink-0 p-6 border-t border-white/10 bg-slate-900 rounded-b-2xl">
                            {step === 'category' && (
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                >
                                    취소
                                </button>
                            )}

                            {step === 'form' && (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        이전
                                    </button>
                                    <button
                                        type="submit"
                                        form="campaign-form"
                                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors"
                                    >
                                        다음
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {step === 'confirmation' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleBack}
                                        className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        이전
                                    </button>
                                    <button
                                        onClick={handleFinalSubmit}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? '개설 중...' : '모임 개설하기'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Category Selection Card
function CategoryCard({ template, onClick }: { template: CampaignTemplate; onClick: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`p-4 rounded-xl border ${template.borderColor} ${template.bgGradient} hover:border-opacity-50 transition-all text-left group`}
        >
            <template.icon className={`h-8 w-8 ${template.color} mb-2`} />
            <h4 className="font-bold text-white mb-1">{template.name}</h4>
            <p className="text-xs text-slate-400">{template.description}</p>
        </motion.button>
    );
}

// Dynamic Field Component
function DynamicField({ field, value, onChange }: { field: any; value: any; onChange: (value: any) => void }) {
    const baseClassName = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500";

    if (field.type === 'text') {
        return (
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                    {field.label} {field.required && '*'}
                </label>
                <input
                    required={field.required}
                    type="text"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    className={baseClassName}
                />
            </div>
        );
    }

    if (field.type === 'textarea') {
        return (
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                    {field.label} {field.required && '*'}
                </label>
                <textarea
                    required={field.required}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className={`${baseClassName} resize-none`}
                />
            </div>
        );
    }

    if (field.type === 'date') {
        return (
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                    {field.label} {field.required && '*'}
                </label>
                <input
                    required={field.required}
                    type="date"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseClassName}
                />
            </div>
        );
    }

    if (field.type === 'number') {
        return (
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                    {field.label} {field.required && '*'}
                </label>
                <input
                    required={field.required}
                    type="number"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    className={baseClassName}
                />
            </div>
        );
    }

    if (field.type === 'select') {
        return (
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                    {field.label} {field.required && '*'}
                </label>
                <select
                    required={field.required}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseClassName}
                >
                    <option value="">선택하세요</option>
                    {field.options?.map((option: string) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        );
    }

    if (field.type === 'multiselect') {
        const selectedValues = value || [];
        const toggleOption = (option: string) => {
            if (selectedValues.includes(option)) {
                onChange(selectedValues.filter((v: string) => v !== option));
            } else {
                onChange([...selectedValues, option]);
            }
        };

        return (
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                    {field.label} {field.required && '*'}
                </label>
                <div className="flex flex-wrap gap-2">
                    {field.options?.map((option: string) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => toggleOption(option)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedValues.includes(option)
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
