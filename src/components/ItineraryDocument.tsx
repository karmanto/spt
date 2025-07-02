import React from 'react';
import { TourPackage } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import { Clock } from 'lucide-react';

interface ItineraryDocumentProps {
  tour: TourPackage;
}

const ItineraryDocument: React.FC<ItineraryDocumentProps> = ({ tour }) => {
  const { t, language } = useLanguage();

  const getLocalizedContent = (content: any) => {
    if (typeof content === 'object' && content[language]) {
      return content[language];
    }
    return content;
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('itinerary')}</h2>
      <div className="space-y-8">
        {tour.itinerary.map((dayPlan, index) => (
          <div key={index} className="relative pl-8 border-l-2 border-blue-200">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {dayPlan.day}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('day')} {dayPlan.day}: {getLocalizedContent(dayPlan.title)}
            </h3>
            <ul className="space-y-2 text-gray-700">
              {dayPlan.activities.map((activity, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{getLocalizedContent(activity)}</span>
                </li>
              ))}
            </ul>
            {dayPlan.meals && dayPlan.meals.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-800">{t('mealsIncluded')}:</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {dayPlan.meals.map((meal, idx) => (
                    <li key={idx}>{getLocalizedContent(meal)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDocument;
