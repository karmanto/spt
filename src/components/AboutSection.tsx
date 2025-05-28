import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First block: YouTube video embed */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center mb-6">
          <div 
            className="mb-3"
            data-aos="fade-right"
          >
            <div className="w-full h-0 pb-[56.25%] relative">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/4FjNbNPUaB4"
                title="Simbolon Phuket Tour Overview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <div data-aos="fade-right">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              {t('aboutTitle')}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('aboutDescription')}
            </p>
          </div>
        </div>

        {/* Second block: Founder */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center mb-6">
          <div 
            className="mb-3"
            data-aos="fade-right"
          >
            <img 
              src="./about.jpg" 
              alt="About Simbolon Phuket Tour" 
              className="rounded-lg shadow-lg"
            />
          </div>
          
          <div data-aos="fade-right">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Founder
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('founder')}
            </p>
          </div>
        </div>

        {/* Third block: Legal */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center mb-6">
          <div 
            className="mb-3"
            data-aos="fade-right"
          >
            <img 
              src="./SurinLove.jpg" 
              alt="About Simbolon Phuket Tour" 
              className="rounded-lg shadow-lg"
            />
          </div>

          <div data-aos="fade-right">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Legal
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('legal')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
