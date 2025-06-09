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
    }, 5000);
    return () => clearInterval(interval);
  }, [length]);

  const slide = slides[current];

  return (
    <section
      id="home"
      className="relative bg-cover bg-center h-screen flex items-center transition-all duration-1000"
      style={{ backgroundImage: `url('${slide.image}')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4"
          data-aos="fade-up"
        >
          {language === 'id' ? slide.heroTitle.id : slide.heroTitle.en}
        </h1>
        <p
          className="text-xl sm:text-2xl text-white mb-8 max-w-3xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {language === 'id' ? slide.heroSubtitle.id : slide.heroSubtitle.en}
        </p>
        <div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center sm:justify-start"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <a
            href="#packages"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            {language === 'id' ? 'Lihat Paket' : 'View Packages'}
          </a>
          <a
            href="https://wa.me/123456789?text=Halo%20Simbolon%20Phuket%20Tour,%20saya%20tertarik%20dengan%20paket%20tour%20Anda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#25d366] hover:bg-[#13a033] transition-colors duration-300"
          >
            {language === 'id' ? 'Hubungi Admin' : 'Contact Admin'}
          </a>
        </div>
      </div>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <a
          href="#promo"
          className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-200 rounded-full flex items-center justify-center"
        >
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;