// src/components/TopPackages.tsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { packages } from '../data/packages.json';

const TopPackages: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('topPackages')}
          </h2>
          <p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('topPackagesDetail')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const title = language === 'id' ? pkg.titleId : pkg.titleEn;
            const description = language === 'id' ? pkg.descriptionId : pkg.descriptionEn;

            return (
              <div 
                key={pkg.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 mb-4">{description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">{pkg.price}</span>
                    <a 
                      href={`#package-${pkg.id}`} 
                      className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-300"
                    >
                      {t('viewDetail')}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopPackages;