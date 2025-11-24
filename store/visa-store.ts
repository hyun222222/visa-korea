import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, VisaRecommendation } from '@/lib/visa-logic';

interface VisaState {
    // Profile Data
    profile: UserProfile;

    // Recommendations
    recommendations: VisaRecommendation[];

    // Actions
    setProfile: (profile: Partial<UserProfile>) => void;
    setRecommendations: (recs: VisaRecommendation[]) => void;
    reset: () => void;
}

export const useVisaStore = create<VisaState>()(
    persist(
        (set) => ({
            profile: {
                age: 30,
                education: 'Bachelor\'s Degree',
                income: 35000000,
                koreanLevel: 'None',
                advancedSector: false,
                careerYears: 0
            },
            recommendations: [],

            setProfile: (newProfile) => set((state) => ({
                profile: { ...state.profile, ...newProfile }
            })),

            setRecommendations: (recommendations) => set({ recommendations }),

            reset: () => set({
                profile: {
                    age: 30,
                    education: 'Bachelor\'s Degree',
                    income: 35000000,
                    koreanLevel: 'None',
                    advancedSector: false,
                    careerYears: 0
                },
                recommendations: []
            })
        }),
        {
            name: 'visa-korea-storage',
        }
    )
);
