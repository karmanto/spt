import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const { t } = useLanguage();

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
        </div>
      </header>
      <Outlet /> 
    </div>
  );
};

export default AdminLayout;
