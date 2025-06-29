import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Clock, Users } from 'lucide-react';
import toursData from '../data/tours.json';
import { TourPackage } from '../utils/types'; 
import { Link } from 'react-router-dom'; // Ensure Link is imported

const TopPackages: React.FC = () => {
  const { t, language } = useLanguage();

  const tours: TourPackage[] = toursData as TourPackage[];

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
          {tours.map((tour: TourPackage) => ( 
            <div
              key={tour.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group cursor-pointer"
            >
              <Link to={`/tours/${tour.id}`}> {/* Wrap the entire card with Link */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${tour.images[0]}`}
                    alt={tour.name[language]}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {tour.promotions && tour.promotions.discount && tour.promotions.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {tour.promotions.discount}% OFF
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{tour.location[language]}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {tour.name[language]}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {tour.overview[language]}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{tour.duration[language]}</span>
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
                        {tour.originalPrice && (
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
          ))}
        </div>

        <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="200">
          <Link
            to="/tours"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            {t('viewAllPackages')}
            <svg className="ml-3 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopPackages;
