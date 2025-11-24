import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WizardState {
    // Step 1: Personal Info
    name: string;
    residentNumber: string;
    address: string;
    phone: string;
    dependents: number;

    // Step 2: Income & Assets
    monthlyIncome: number;
    totalAssets: number; // 청산가치

    // Step 3: Debts
    securedDebt: number;
    unsecuredDebt: number;
    creditors: any[]; // TODO: Define Creditor type

    // Actions
    setField: (field: string, value: any) => void;
    resetForm: () => void;
}

export const useWizardStore = create<WizardState>()(
    persist(
        (set) => ({
            name: '',
            residentNumber: '',
            address: '',
            phone: '',
            dependents: 1,
            monthlyIncome: 0,
            totalAssets: 0,
            securedDebt: 0,
            unsecuredDebt: 0,
            creditors: [],

            setField: (field, value) => set((state) => ({ ...state, [field]: value })),
            resetForm: () => set({
                name: '',
                residentNumber: '',
                address: '',
                phone: '',
                dependents: 1,
                monthlyIncome: 0,
                totalAssets: 0,
                securedDebt: 0,
                unsecuredDebt: 0,
                creditors: [],
            }),
        }),
        {
            name: 'rehab-wizard-storage',
            storage: createJSONStorage(() => sessionStorage), // Use SessionStorage as per legal requirement
        }
    )
);
