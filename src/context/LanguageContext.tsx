import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from '../data/translations';

type Language = 'id' | 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    // Pastikan key-nya sesuai salah satu kunci di translations.{id,en,ru}
    const translationKey = key as keyof typeof translations.id;

    // 1. Cek di bahasa terpilih
    if (translations[language] && translations[language][translationKey]) {
      return translations[language][translationKey];
    }
    // 2. Fallback ke bahasa Indonesia
    if (translations.id[translationKey]) {
      return translations.id[translationKey];
    }
    // 3. Jika tidak ditemukan di mana pun, kembalikan key
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
