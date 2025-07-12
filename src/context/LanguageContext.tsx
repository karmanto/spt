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

// Helper function to determine initial language based on browser settings
const getInitialLanguage = (): Language => {
  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('id')) {
    return 'id';
  }
  if (browserLanguage.startsWith('ru')) {
    return 'ru';
  }
  // Default to 'en' if browser language is not 'id' or 'ru'
  // The useEffect will handle fallback to 'id' if 'en' fails to load
  return 'en';
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage()); // Set initial language dynamically
  const [currentTranslations, setCurrentTranslations] = useState<TranslationKeys>({});
  const [defaultTranslations, setDefaultTranslations] = useState<TranslationKeys>({}); 

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Always load 'id' as the default fallback
        const defaultModule = await import(`../locales/id.json`);
        setDefaultTranslations(defaultModule.default);

        // Load the selected language
        const module = await import(`../locales/${language}.json`);
        setCurrentTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fallback to default translations if the selected language file fails to load
        setCurrentTranslations(defaultTranslations);
      }
    };

    loadTranslations();
  }, [language, defaultTranslations]); // Re-run when language or defaultTranslations change

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
