import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import toursData from '../data/tours.json';
import { TourPackage } from '../lib/types';
import TourCard from '../components/TourCard';

interface OutletContext {
  searchTerm: string;
  selectedCategory: string;
}

const TourList: React.FC = () => {
  const { t, language } = useLanguage();
  const { searchTerm, selectedCategory } = useOutletContext<OutletContext>();
  
  const [filteredTours, setFilteredTours] = useState<TourPackage[]>([]);

  useEffect(() => {
    const allTours: TourPackage[] = toursData as TourPackage[];
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const results = allTours.filter(tour => {
      const name = (tour.name[language] || tour.name.en).toLowerCase();
      const location = (tour.location[language] || tour.location.en).toLowerCase();
      const tourTag = tour.tags ? tour.tags.toLowerCase() : '';

      const matchesSearch = (
        name.includes(lowerCaseSearchTerm) ||
        location.includes(lowerCaseSearchTerm)
      );

      if (selectedCategory === 'all') {
        return matchesSearch;
      } else if (selectedCategory === '1_day_trip') {
        return matchesSearch && tourTag === '1_day_trip';
      } else if (selectedCategory === 'open_trip') {
        return matchesSearch && tourTag === 'open_trip';
      } else if (selectedCategory === 'other') {
        return matchesSearch && tourTag === 'private_service';
      }
      return matchesSearch; 
    });
    setFilteredTours(results);
  }, [searchTerm, language, selectedCategory]); 
  
  return (
    <section id="tour-list" className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-text mb-4 leading-tight" data-aos="fade-up">
            {t('tourListTitle')}
          </h2>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            {t('tourListSubtitle')}
          </p>
        </div>

        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredTours.map((tour: TourPackage) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-textSecondary">{t('noToursFound')}</p>
            <p className="text-lg text-textSecondary mt-2">{t('tryDifferentSearch')}</p>
          </div>
        )}
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('tourList.cantFind')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('tourList.customize')}
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 text-lg">
            {t('tourList.contactExperts')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TourList;
