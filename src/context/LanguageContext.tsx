import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

type Language = 'id' | 'en' | 'ru';
type TranslationKeys = { [key: string]: string };

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

const getLanguageFromLocalStorage = (): Language | null => {
  const storedLang = localStorage.getItem('userLanguage');
  if (storedLang === 'id' || storedLang === 'en' || storedLang === 'ru') {
    return storedLang;
  }
  return null;
};

const saveLanguageToLocalStorage = (lang: Language) => {
  localStorage.setItem('userLanguage', lang);
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const initialLanguage = getLanguageFromLocalStorage() || 'en';
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [currentTranslations, setCurrentTranslations] = useState<TranslationKeys>({});
  const [defaultTranslations, setDefaultTranslations] = useState<TranslationKeys>({});

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveLanguageToLocalStorage(lang);
  }, []);

  // Effect to load translations
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
        setCurrentTranslations(defaultTranslations);
      }
    };

    loadTranslations();
  }, [language]);

  useEffect(() => {
    if (!getLanguageFromLocalStorage()) {
      const detectLanguageFromIP = async () => {
        try {
          const urlGetLanguageFromIp = import.meta.env.VITE_GET_LOCAL_LANGUAGE_URL || 'http://ip-api.com/json/?fields=countryCode';
          const response = await fetch(urlGetLanguageFromIp);
          const data = await response.json();
          let detectedLang: Language = 'en';

          if (data.countryCode) {
            const countryCode = data.countryCode.toLowerCase();
            if (countryCode === 'id') {
              detectedLang = 'id';
            } else if (countryCode === 'ru') {
              detectedLang = 'ru';
            } 
          }
          
          if (language !== detectedLang) {
            setLanguage(detectedLang); 
          }

          saveLanguageToLocalStorage(detectedLang);
        } catch (error) {
          console.error('Failed to detect language from IP:', error);
          setLanguage("en");
          saveLanguageToLocalStorage("en");
        }
      };

      detectLanguageFromIP();
    }
  }, []);

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
