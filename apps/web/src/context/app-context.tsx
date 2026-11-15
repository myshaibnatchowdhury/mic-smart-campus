'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKey, Language, ThemeMode } from './translations';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [language, setLanguageState] = useState<Language>('bn');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read persisted theme
    const savedTheme = localStorage.getItem('mic_theme') as ThemeMode | null;
    const initialTheme: ThemeMode = savedTheme === 'light' ? 'light' : 'dark';
    setThemeState(initialTheme);
    applyTheme(initialTheme);

    // Read persisted language
    const savedLang = localStorage.getItem('mic_lang') as Language | null;
    const initialLang: Language = savedLang === 'en' ? 'en' : 'bn';
    setLanguageState(initialLang);
    document.documentElement.lang = initialLang;

    setMounted(true);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('mic_theme', mode);
    applyTheme(mode);
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mic_lang', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: TranslationKey): string => {
    const langDict = translations[language] || translations['en'];
    return (langDict as any)[key] || (translations['en'] as any)[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
