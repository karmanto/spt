import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { heros as slides } from '../data/heros.json';

const Hero: React.FC = () => {
  const { t, language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % length);
    }, 10000);
    return () => clearInterval(interval);
  }, [length]);

  const slide = slides[current];

  return (
    <section
      id="home"
      className="relative bg-cover bg-center h-screen flex items-center transition-all duration-1000"
      style={{ backgroundImage: `url('${slide.image}')` }}
      // SEO here: ARIA label for accessibility and SEO
      aria-label="Hero section showcasing Simbolon Phuket Tour services"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        {/* SEO here: H1 tag for main page heading - most important for SEO */}
        <h1
          className="text-4xl sm:text-3xl md:text-6xl text-center font-bold text-white leading-tight mb-4"
          data-aos="fade-up"
        >
          {language === 'id' ? slide.heroTitle.id : slide.heroTitle.en}
        </h1>
        {/* SEO here: Descriptive paragraph with keywords */}
        <p
          className="text-xl sm:text-2xl text-white text-center mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {language === 'id' ? slide.heroSubtitle.id : slide.heroSubtitle.en}
        </p>
        <div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {/* SEO here: Internal link with descriptive anchor text */}
          <a
            href="#packages"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            aria-label="View our tour packages section"
          >
            {t('viewPackages')}
          </a>
          {/* SEO here: External link with proper attributes */}
          <a
            href="https://wa.me/6281363878631?text=Halo%20Admin%20Simbolon%20Phuket%20Tour,%20saya%20tertarik%20dengan%20paket%20tour%20Anda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#25d366] hover:bg-[#13a033] transition-colors duration-300"
            aria-label="Contact admin via WhatsApp"
          >
            {t('contactAdmin')}
          </a>
        </div>
      </div>
      {/* SEO here: Scroll indicator with proper accessibility */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <a
          href="#promo"
          className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-200 rounded-full flex items-center justify-center"
          aria-label="Scroll to promotions section"
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;