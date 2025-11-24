'use client';

import { useState } from 'react';
import { UserProfile, VisaRecommendation, EducationLevel, KoreanAbility } from '@/lib/visa-logic';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function VisaNavigator() {
    const [profile, setProfile] = useState<UserProfile>({
        age: 30,
        education: 'bachelor',
        income: 35000000,
        korean: 'none',
        experience_years: 0,
        is_advanced_sector: false,
    });

    const [recommendations, setRecommendations] = useState<VisaRecommendation[]>([]);
    const [loading, setLoading] = useState(false);

    const handleRecommend = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });
            const data = await res.json();
            setRecommendations(data.recommendations);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Smart Visa Navigator</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Input Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Age</label>
                        <input
                            type="number"
                            value={profile.age}
                            onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Education</label>
                        <select
                            value={profile.education}
                            onChange={(e) => setProfile({ ...profile, education: e.target.value as EducationLevel })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="high_school">High School</option>
                            <option value="associate">Associate Degree</option>
                            <option value="bachelor">Bachelor's Degree</option>
                            <option value="master">Master's Degree</option>
                            <option value="doctorate">Doctorate</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Annual Income (KRW)</label>
                        <input
                            type="number"
                            value={profile.income}
                            onChange={(e) => setProfile({ ...profile, income: parseInt(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                        <p className="text-xs text-gray-500 mt-1">e.g., 45000000 for 45 Million KRW</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Korean Ability</label>
                        <select
                            value={profile.korean}
                            onChange={(e) => setProfile({ ...profile, korean: e.target.value as KoreanAbility })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="none">None</option>
                            <option value="topik_1">TOPIK 1</option>
                            <option value="topik_2">TOPIK 2</option>
                            <option value="topik_3">TOPIK 3</option>
                            <option value="topik_4">TOPIK 4</option>
                            <option value="topik_5">TOPIK 5</option>
                            <option value="topik_6">TOPIK 6</option>
                            <option value="kiip_5">KIIP Level 5</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={profile.is_advanced_sector}
                            onChange={(e) => setProfile({ ...profile, is_advanced_sector: e.target.checked })}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Work in Advanced/High-Tech Sector?
                        </label>
                    </div>

                    <button
                        onClick={handleRecommend}
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Analyze Eligibility'}
                    </button>
                </div>

                {/* Results */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>

                    {recommendations.length === 0 && !loading && (
                        <p className="text-gray-500 text-sm">Enter your profile to see visa options.</p>
                    )}

                    <div className="space-y-4">
                        {recommendations.map((rec) => (
                            <div key={rec.visa_code} className={`p-4 rounded-md border ${rec.probability === 'high' ? 'bg-green-50 border-green-200' : rec.probability === 'medium' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-gray-800">{rec.visa_name}</h4>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${rec.probability === 'high' ? 'bg-green-200 text-green-800' : rec.probability === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                                        {rec.probability.toUpperCase()}
                                    </span>
                                </div>

                                <div className="mt-2 text-sm text-gray-600">
                                    {rec.reason.map((r, i) => (
                                        <div key={i} className="flex items-start mt-1">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                                            <span>{r}</span>
                                        </div>
                                    ))}
                                    {rec.missing_requirements.map((m, i) => (
                                        <div key={i} className="flex items-start mt-1">
                                            <XCircle className="h-4 w-4 text-red-500 mr-1 mt-0.5 flex-shrink-0" />
                                            <span>{m}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
