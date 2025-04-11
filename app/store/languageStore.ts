import { create } from 'zustand';

interface LanguageState {
  language: string;
  availableLanguages: { code: string; name: string }[];
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'es',
  availableLanguages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    // Add more as needed
  ],
  setLanguage: (lang) => set({ language: lang }),
}));