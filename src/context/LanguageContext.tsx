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
  const [language, setLanguage] = useState<Language>('id');

  const t = (key: string): string => {
    const translationKey = key as keyof typeof translations.id;

    if (translations[language] && translations[language][translationKey]) {
      return translations[language][translationKey];
    }
    if (translations.id[translationKey]) {
      return translations.id[translationKey];
    }
    
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
