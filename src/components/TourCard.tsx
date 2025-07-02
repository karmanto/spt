import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { TourPackage } from '../lib/types';
import { MapPin, Clock, Users, Star } from 'lucide-react'; // Import Star icon

interface TourCardProps {
  tour: TourPackage;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const { t, language } = useLanguage();

  // Helper functions for language-specific content
  const getLocalizedContent = (content: { en: string; id?: string; ru?: string }) => {
    if (language === 'id' && content.id) return content.id;
    if (language === 'ru' && content.ru) return content.ru;
    return content.en;
  };

  const tourName = getLocalizedContent(tour.name);
  const tourDuration = getLocalizedContent(tour.duration);
  const tourLocation = getLocalizedContent(tour.location);
  const tourOverview = getLocalizedContent(tour.overview);

  const discountPercentage = tour.originalPrice && tour.originalPrice > tour.price.adult
    ? Math.round(((tour.originalPrice - tour.price.adult) / tour.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer">
      <Link to={`/tours/${tour.id}`}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={`${import.meta.env.VITE_BASE_URL}${tour.images[0]}`}
            alt={tourName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}
          {tour.rate && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{tour.rate}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin className="w-4 h-4" />
            <span>{tourLocation}</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
            {tourName}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {tourOverview}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{tourDuration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{t('groupTour')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-gray-900">
                  ฿{tour.price.adult.toLocaleString()}
                </div>
                {tour.originalPrice && tour.originalPrice > tour.price.adult && (
                  <div className="text-md text-gray-400 line-through decoration-red-500 decoration-2">
                    ฿{tour.originalPrice.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">{t('perAdult')}</div>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center gap-2 group/btn whitespace-nowrap">
              {t('viewDetails')}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TourCard;
