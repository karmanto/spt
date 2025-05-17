import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div 
            className="mb-10 lg:mb-0"
            data-aos="fade-right"
          >
            <img 
              src="https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1600" 
              alt="About Simbolon Phuket Tour" 
              className="rounded-lg shadow-lg"
            />
          </div>
          
          <div data-aos="fade-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {t('aboutTitle')}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {t('aboutDescription')}
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('packageInclusionsTitle')}</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>✓ {t('transportation')}</li>
                  <li>✓ {t('guide')}</li>
                  <li>✓ {t('entranceTickets')}</li>
                  <li>✓ {t('meals')}</li>
                  <li>✓ {t('accommodation')}</li>
                  <li>✓ {t('tax')}</li>
                  <li>✓ {t('guideTips')}</li>
                </ul>
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{t('notIncluded')}</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>✗ {t('personalExpenses')}</li>
                  <li>✗ {t('otherExpenses')}</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('bookingPolicyTitle')}</h3>
                <ol className="space-y-1 text-gray-600">
                  <li>{t('confirmation')}</li>
                  <li>{t('reservationTime')}</li>
                  <li>{t('childPolicy')}</li>
                </ol>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('additionalInfoTitle')}</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• {t('muslimPrayer')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;