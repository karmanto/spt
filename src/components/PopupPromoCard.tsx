// PromoCard.tsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PromoCardProps } from '../utils/types';

const PopupPromoCard: React.FC<PromoCardProps> = ({ promo }) => {
  const { language } = useLanguage();

  const title = language === 'id' ? promo.titleId : promo.titleEn;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300">
      <div className="relative">
        <img
          src={promo.image}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-3">

        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
          {language === 'id' ? 'Pesan Sekarang' : 'Book Now'}
        </button>
      </div>
    </div>
  );
};

export default PopupPromoCard;