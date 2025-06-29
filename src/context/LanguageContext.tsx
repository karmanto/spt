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
  const [defaultTranslations, setDefaultTranslations] = useState<TranslationKeys>({}); // To store 'id' as fallback

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Load default (ID) translations first for fallback
        const defaultModule = await import(`../locales/id.json`);
        setDefaultTranslations(defaultModule.default);

        // Load selected language translations
        const module = await import(`../locales/${language}.json`);
        setCurrentTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fallback to default translations if selected language fails
        setCurrentTranslations(defaultTranslations);
      }
    };

    loadTranslations();
  }, [language, defaultTranslations]); // Re-run when language changes or default translations are loaded

  const t = (key: string): string => {
    // Try to get translation from current language
    if (currentTranslations[key]) {
      return currentTranslations[key];
    }
    // Fallback to default (ID) translations
    if (defaultTranslations[key]) {
      return defaultTranslations[key];
    }
    // If not found in any, return the key itself
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
