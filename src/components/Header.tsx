import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { convertGoogleDriveUrlToThumbnail } from '../utils/imageUtils';

interface HeaderProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, toggleMobileMenu }) => {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  const logoUrl = '/spt_logo.png';

  const navLinks = [
    { name: t('home'), href: '#home' },
    { name: t('packages'), href: '#packages' },
    { name: t('about'), href: '#about' },
    { name: t('gallery'), href: '#gallery' },
    { name: t('faq'), href: '#faq' },
    { name: t('contact'), href: '#contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-4">
        <div className="flex justify-between items-center md:space-x-4">
          <div className="flex justify-start">
            <a href="#" className="flex items-center">
              <img 
                src={logoUrl} 
                alt="Simbolon Phuket Tour" 
                className="h-16 w-auto"
              />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center mr-2 md:hidden">
            <button 
              onClick={toggleLanguage}
              className={`flex items-center p-2 mr-2 rounded-md ${
                scrolled ? 'text-gray-700 hover:text-[#102D5E]' : 'text-white hover:text-blue-200'
              }`}
              aria-label="Toggle language"
            >
              <Globe size={16} />
              <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
            </button>
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md ${
                scrolled ? 'text-gray-700 hover:text-[#102D5E]' : 'text-white hover:text-blue-200'
              }`}
              aria-expanded="false"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled 
                    ? 'text-gray-700 hover:text-[#102D5E]' 
                    : 'text-white hover:text-blue-200'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Language toggle - Desktop */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={toggleLanguage}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-[#102D5E]' : 'text-white hover:text-blue-200'
              }`}
            >
              <Globe size={18} className="mr-1" />
              <span>{language === 'id' ? 'ID' : 'EN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:hidden bg-white shadow-lg`}
      >
        <div className="pt-2 pb-4 space-y-1 px-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block py-2 text-base font-medium text-gray-700 hover:text-[#102D5E]"
              onClick={toggleMobileMenu}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;