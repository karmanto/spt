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
    // Ensure content is an object before trying to access properties
    if (typeof content === 'object' && content !== null && content[language]) {
      return content[language];
    }
    // Fallback to English if current language content is not available or content is not an object
    if (typeof content === 'object' && content !== null && content.en) {
      return content.en;
    }
    return content; // Return as is if not an object or no localized content found
  };

  // Add a check to ensure tour.itineraries is an array before mapping
  if (!tour || !Array.isArray(tour.itineraries)) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center text-gray-600">
        <p>{t('noItineraryAvailable') || 'No itinerary available for this tour.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('itinerary')}</h2>
      <div className="space-y-8">
        {tour.itineraries.map((dayPlan, index) => ( // Changed from tour.itinerary to tour.itineraries
          <div key={dayPlan.id || index} className="relative pl-8 border-l-2 border-blue-200"> {/* Use dayPlan.id for key */}
            <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {dayPlan.day}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('day')} {dayPlan.day}: {getLocalizedContent(dayPlan.title)}
            </h3>
            <ul className="space-y-2 text-gray-700">
              {dayPlan.activities.map((activity, idx) => (
                <li key={activity.id || idx} className="flex items-start gap-2"> {/* Use activity.id for key */}
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold">{activity.time}</span> - {getLocalizedContent(activity.description)}
                  </span>
                </li>
              ))}
            </ul>
            {dayPlan.meals && dayPlan.meals.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-800">{t('mealsIncluded')}:</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {dayPlan.meals.map((meal, idx) => (
                    <li key={meal.id || idx}>{getLocalizedContent(meal.description)}</li> 
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
