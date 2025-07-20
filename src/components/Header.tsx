import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import 'flag-icons/css/flag-icons.min.css';
import { HeaderProps } from '../lib/types'; 

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, toggleMobileMenu }) => {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  const logoUrl = "/spt_logo.png"

  const navLinks = [
    { name: t('home'), href: '#home' },
    { name: t('topPackages'), href: '#packages' },
    { name: t('about'), href: '#about' },
    { name: t('gallery'), href: '#gallery' },
    { name: t('faq'), href: '#faq' },
    { name: t('contact'), href: '#contact' },
    { name: t('blog'), href: '/blogs' }, 
    { name: t('intlTour'), href: '/international-tours' }, 
    { name: t('admin'), href: '/admin' },
  ];

  const toggleLanguage = () => {
    const next = language === 'id' ? 'en' : language === 'en' ? 'ru' : 'id';
    setLanguage(next);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const flagCode = language === 'id' ? 'id' : language === 'en' ? 'us' : 'ru';
  const nextLangLabel = language === 'id' ? 'English' : language === 'en' ? 'Русский' : 'Bahasa Indonesia';

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-4">
        <div className="flex justify-between items-center lg:space-x-4">
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

          <div className="flex items-center mr-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className={`flex items-center p-2 mr-2 rounded-md transition-colors ${
                scrolled || mobileMenuOpen ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
              }`}
              aria-label={`Switch to ${nextLangLabel}`}
            >
              <span className={`fi fi-${flagCode} h-5 w-5 mr-[5px]`} />
              <span className={`ml-1 text-sm font-medium ${
                scrolled || mobileMenuOpen ? 'text-black' : 'text-white'
              }`}>{language.toUpperCase()}</span>
            </button>
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md transition-colors ${
                scrolled || mobileMenuOpen
                  ? 'text-gray-700 hover:text-[#102D5E]'
                  : 'text-white hover:text-blue-200'
              }`}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="hidden lg:flex space-x-8" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-gray-700 hover:text-[#102D5E]'
                    : 'text-white hover:text-blue-200'
                }`}
                aria-label={`Navigate to ${link.name} section`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <button
              onClick={toggleLanguage}
              className={`flex items-center p-2 rounded-md transition-colors ${
                scrolled ? 'hover:bg-gray-100' : 'hover:bg-gray-700'
              }`}
              aria-label={`Switch to ${nextLangLabel}`}
            >
              <span className={`fi fi-${flagCode} h-6 w-6 mr-[5px]`} />
              <span className={`ml-1 text-sm font-medium ${
                scrolled || mobileMenuOpen ? 'text-black' : 'text-white'
              }`}>{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:hidden bg-white shadow-lg`}>
        <nav className="pt-2 pb-4 space-y-1 px-4" role="navigation" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-base font-medium text-gray-700 hover:text-[#102D5E]"
              onClick={toggleMobileMenu}
              aria-label={`Navigate to ${link.name} section`}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
