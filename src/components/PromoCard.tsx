// PromoCard.tsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PromoCardProps } from '../utils/types';

const PromoCard: React.FC<PromoCardProps> = ({ promo, countdown }) => {
  const { language } = useLanguage();

  const title = language === 'id' ? promo.titleId : promo.titleEn;
  const description = language === 'id' ? promo.descriptionId : promo.descriptionEn;

  const getBadgeColor = (badge: string): string => {
    switch (badge) {
      case 'limitedTime':
        return 'bg-red-500';
      case 'bestSeller':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  const getBadgeText = (): string => {
    if (language === 'id') {
      return promo.badge === 'limitedTime' ? 'Waktu Terbatas' : 'Terlaris';
    } else {
      return promo.badge === 'limitedTime' ? 'Limited Time' : 'Best Seller';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300">
      <div className="relative">
        <img
          src={promo.image}
          alt={title}
          className="w-full h-full object-contain"
        />
        <div className="absolute top-4 left-4 flex justify-between gap-2">
          <div className={`${getBadgeColor(promo.badge)} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}>
            {getBadgeText()}
          </div>
          {promo.remaining && (
            <div className="bg-gray-800 bg-opacity-75 text-white text-xs font-bold px-3 py-1 rounded-full">
              {language === 'id' ? `${promo.remaining} Sisa` : `${promo.remaining} Spots Left`}
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>

        <div className="flex items-baseline mb-3">
          <span className="text-2xl font-bold text-blue-600">{promo.price}</span>
          <span className="ml-2 text-sm text-gray-500 line-through">{promo.oldPrice}</span>
        </div>

        {countdown && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              {language === 'id' ? 'Berakhir dalam:' : 'Ends in:'}
            </p>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="bg-gray-100 rounded p-1">
                  <span className="text-md font-bold text-blue-600">{countdown.days}</span>
                  <p className="text-xs text-gray-600">{language === 'id' ? 'Hari' : 'Days'}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded p-1">
                  <span className="text-md font-bold text-blue-600">{countdown.hours}</span>
                  <p className="text-xs text-gray-600">{language === 'id' ? 'Jam' : 'Hours'}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded p-1">
                  <span className="text-md font-bold text-blue-600">{countdown.minutes}</span>
                  <p className="text-xs text-gray-600">{language === 'id' ? 'Menit' : 'Minutes'}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gray-100 rounded p-1">
                  <span className="text-md font-bold text-blue-600">{countdown.seconds}</span>
                  <p className="text-xs text-gray-600">{language === 'id' ? 'Detik' : 'Seconds'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
          {language === 'id' ? 'Pesan Sekarang' : 'Book Now'}
        </button>
      </div>
    </div>
  );
};

export default PromoCard;