import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'id' | 'en' | 'ru';
type TranslationKeys = { [key: string]: string }; // Define a type for translation keys

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
  const [currentTranslations, setCurrentTranslations] = useState<TranslationKeys>({});
  const [defaultTranslations, setDefaultTranslations] = useState<TranslationKeys>({}); 

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const defaultModule = await import(`../locales/id.json`);
        setDefaultTranslations(defaultModule.default);

        const module = await import(`../locales/${language}.json`);
        setCurrentTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        setCurrentTranslations(defaultTranslations);
      }
    };

    loadTranslations();
  }, [language, defaultTranslations]);

  const t = (key: string): string => {
    if (currentTranslations[key]) {
      return currentTranslations[key];
    }
    if (defaultTranslations[key]) {
      return defaultTranslations[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
