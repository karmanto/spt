import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; 
import { useLanguage } from '../context/LanguageContext';
import 'flag-icons/css/flag-icons.min.css';
import Footer from '../components/Footer';

const BlogLayout: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // const isTourDetailPage = useMatch('/tours/:id');

  const toggleLanguage = () => {
    const next = language === 'id' ? 'en' : language === 'en' ? 'ru' : 'id';
    setLanguage(next);
  };

  const flagCode = language === 'id' ? 'id' : language === 'en' ? 'us' : 'ru';
  const nextLangLabel = language === 'id' ? 'English' : language === 'en' ? 'Русский' : 'Bahasa Indonesia';
  const logoUrl = "/spt_logo.png"

  return (
    <div className="min-h-screen text-text">
      <header className="bg-white shadow-md px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex justify-start">
            <a href="/" aria-label="Simbolon Phuket Tour Homepage">
              <img
                src={logoUrl}
                alt={t('home')}
                className="h-16 w-auto"
                loading="eager"
                decoding="async"
              />
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className={`flex items-center p-2 mr-2 rounded-md transition-colors ${
                'hover:bg-gray-700'
              }`}
              aria-label={`Switch to ${nextLangLabel}`}
            >
              <span className={`fi fi-${flagCode} h-5 w-5 mr-[5px]`} />
              <span className={`ml-1 text-sm font-medium ${
                'text-black'
              }`}>{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>
      <Outlet context={{ searchTerm, selectedCategory, setSearchTerm, setSelectedCategory }} /> 
      <Footer />
    </div>
  );
};

export default BlogLayout;
