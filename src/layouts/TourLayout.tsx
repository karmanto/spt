import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TourFilterPopup from '../components/TourFilterPopup';
import { useLanguage } from '../context/LanguageContext';
import 'flag-icons/css/flag-icons.min.css';

const TourLayout: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleLanguage = () => {
    const next = language === 'id' ? 'en' : language === 'en' ? 'ru' : 'id';
    setLanguage(next);
  };

  const handleOpenFilterPopup = () => {
    setIsFilterPopupOpen(true);
  };

  const handleCloseFilterPopup = () => {
    setIsFilterPopupOpen(false);
  };

  const flagCode = language === 'id' ? 'id' : language === 'en' ? 'us' : 'ru';
  const nextLangLabel = language === 'id' ? 'English' : language === 'en' ? 'Русский' : 'Bahasa Indonesia';
  const logoUrl = `${import.meta.env.VITE_BASE_URL}/spt_logo.png`

  return (
    <div className="min-h-screen text-text">
      <header className="bg-surface shadow-sm px-4 sm:px-6 lg:px-8 sticky top-0 z-50 border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex justify-start">
            <a href="/" aria-label="Simbolon Phuket Tour Homepage">
              <img
                src={logoUrl}
                alt={t('heroTitle')}
                className="h-16 w-auto"
                loading="eager"
                decoding="async"
              />
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleOpenFilterPopup}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              aria-label={t('filterButtonAria')}
            >
              <i className="fas fa-filter mr-2"></i> {t('filterTours')}
            </button>
            <button
              onClick={toggleLanguage}
              className={`flex items-center p-2 mr-2 rounded-md transition-colors ${
                'hover:bg-gray-700'
              }`}
              aria-label={`Switch to ${nextLangLabel}`}
            >
              <span className={`fi fi-${flagCode} h-5 w-5 mr-[5px]`} />
              <span className={`ml-1 text-sm font-medium ${
                'text-white'
              }`}>{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>
      <Outlet context={{ searchTerm, selectedCategory }} /> 

      <TourFilterPopup
        isOpen={isFilterPopupOpen}
        onClose={handleCloseFilterPopup}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
};

export default TourLayout;
