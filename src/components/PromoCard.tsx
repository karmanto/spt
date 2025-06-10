import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PromoCardProps } from '../utils/types';

const PromoCard: React.FC<PromoCardProps> = ({ promo, countdown }) => {
  const { t, language } = useLanguage();

  const title = language === 'id' ? promo.titleId : promo.titleEn;
  const description = language === 'id' ? promo.descriptionId : promo.descriptionEn;

  // Build WhatsApp message and link
  const whatsappNumber = '6281363878631';
  const message = language === 'id'
    ? `Saya ingin memesan promo berikut:\n\nNama Promo: ${title}\nHarga: ${promo.price}\nDeskripsi: ${description}`
    : `I want to book the following promo:\n\nPromo Name: ${title}\nPrice: ${promo.price}\nDescription: ${description}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

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
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 text-center">{description}</p>

        <div className="flex flex-col space-y-1 mb-2 text-center">
          <span className="text-xs uppercase tracking-wider text-gray-500 pl-1">
            {t('startFrom')}
          </span>
          <div className="flex items-center space-x-3 justify-center">
            <span className="text-3xl font-extrabold text-blue-700 tracking-tight">
              {promo.price}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm font-medium text-black line-through decoration-2 decoration-red-500 decoration-solid">
              {promo.oldPrice}
            </span>
          </div>
        </div>

        {countdown && (
          <div className="mb-4">
            <div className="text-center">
              <div className="bg-gray-100 rounded p-1 w-auto">
                <span className="text-md font-bold text- mr-1">{countdown.days}</span>
                <span className="text-xs text-gray-600">{t('dayRemaining')}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-1 px-3 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {t('bookNow')}
          </a>

          <a
            href={promo.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-gray-800 py-1 px-3 rounded-xl font-medium text-lg border-2 border-blue-500 hover:bg-blue-50 transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {t('viewDetail')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;