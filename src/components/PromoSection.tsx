import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PromoCard from './PromoCard';
import { promos } from '../data/promos.json';
import { CountdownState } from '../utils/types';

const PromoSection: React.FC = () => {
  const { language } = useLanguage();
  const [countdowns, setCountdowns] = useState<{ [key: number]: CountdownState }>({});

  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date().getTime();
      const newCountdowns: { [key: number]: CountdownState } = {};

      promos.forEach((promo) => {
        const endTime = new Date(promo.endDate).getTime();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          newCountdowns[promo.id] = { days, hours, minutes, seconds };
        }
      });

      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const timer = setInterval(updateCountdowns, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="promo" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#102d5e] mb-4">
            {language === 'id' ? 'Promo Terbatas' : 'Limited Time Offers'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {language === 'id' 
              ? 'Nikmati penawaran spesial kami dengan diskon eksklusif hanya untuk waktu terbatas.' 
              : 'Enjoy our special offers with exclusive discounts for limited time only.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promos.map((promo) => (
            <PromoCard 
              key={promo.id} 
              promo={promo} 
              countdown={countdowns[promo.id]} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;