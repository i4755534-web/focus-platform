import { create } from 'zustand';

interface SettingsState {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  language: 'ru', // default русский
  setLanguage: (lang) => set({ language: lang }),
}));