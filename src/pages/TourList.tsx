import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { OutletContext, TourPackage } from '../lib/types';
import TourCard from '../components/TourCard';
import { getTourPackages } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import Pagination from '../components/Pagination'; 

const TourList: React.FC = () => {
  const { t } = useLanguage();
  
  const { searchTerm, selectedCategory, setSearchTerm, setSelectedCategory } = useOutletContext<OutletContext>();
  const [initialized, setInitialized] = useState(false);
  
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = sessionStorage.getItem('lastViewedPage');
    if (storedPage) {
      return parseInt(storedPage, 10);
    }
    return 1;
  });

  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const tourCardRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const filtersContainerRef = useRef<HTMLDivElement>(null);

  const prevSearchTermRef = useRef(searchTerm);
  const prevSelectedCategoryRef = useRef(selectedCategory);

  useEffect(() => {
    const storedFilterParams = sessionStorage.getItem('tourFilterParams');
    if (storedFilterParams) {
      try {
        const { search, category } = JSON.parse(storedFilterParams);
        setSearchTerm(search);
        setSelectedCategory(category);
        sessionStorage.removeItem('tourFilterParams'); 
      } catch (e) {
        console.error("Failed to parse tour filter params from sessionStorage", e);
        sessionStorage.removeItem('tourFilterParams');
      }
    }

    setInitialized(true);
  }, [setSearchTerm, setSelectedCategory]); 

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTourPackages({
        page: currentPage, 
        per_page: itemsPerPage,
        search: searchTerm,
        tags: selectedCategory,
        tour_type: 1,
      });
      setTours(response.data);
      setTotalPages(response.pagination.last_page);
      sessionStorage.removeItem('lastViewedPage');
    } catch (err) {
      console.error("Failed to fetch tours:", err);
      setError(t('failedToLoadTours') || 'Failed to load tour packages. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, t]); 

  useEffect(() => {
    const searchTermChanged = searchTerm !== prevSearchTermRef.current;
    const selectedCategoryChanged = selectedCategory !== prevSelectedCategoryRef.current;

    if (searchTermChanged || selectedCategoryChanged) {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }

    prevSearchTermRef.current = searchTerm;
    prevSelectedCategoryRef.current = selectedCategory;
  }, [searchTerm, selectedCategory]); 

  useEffect(() => {
    if (!initialized) return;
    fetchTours();
  }, [initialized, fetchTours]);

  useEffect(() => {
    if (!loading && tours.length > 0) {
      const lastViewedTourId = sessionStorage.getItem('lastViewedTourId');
      if (lastViewedTourId) {
        const tourIdNum = parseInt(lastViewedTourId, 10);
        const targetCard = tourCardRefs.current.get(tourIdNum);
        if (targetCard) {
          requestAnimationFrame(() => {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
          sessionStorage.removeItem('lastViewedTourId'); 
        }
      }
    }
  }, [loading, tours]); 

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilter = (search: string, category: string) => {
    setSearchTerm(search);
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const filterOptions = [
    { 
      label: 'multiDayTrip', 
      search: '',
      category: 'multi_day_trip'
    },
    { 
      label: 'oneDayTrip', 
      search: '',
      category: '1_day_trip',
    },
    { 
      label: 'phiPhiTrip', 
      search: 'Phi',
      category: 'all'
    },
    { 
      label: 'jamesBondTrip', 
      search: 'james bond',
      category: 'all'
    },
    { 
      label: 'rentalTours', 
      search: 'rental',
      category: 'all'
    },
    { 
      label: 'similianTrip', 
      search: 'similan',
      category: 'all'
    },
    { 
      label: 'elephantTour', 
      search: 'elephant',
      category: 'all'
    },
    { 
      label: 'tourGuide', 
      search: 'guide',
      category: 'all'
    },
    { 
      label: 'Zipline & ATV', 
      search: 'zipline & atv',
      category: 'all'
    }
  ];

  return (
    <section id="tour-list" className="pt-10 min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text mb-4 leading-tight" data-aos="fade-up">
            {t('tourListTitle')}
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            {t('tourListSubtitle')}
          </p>
        </div>

        <div 
          ref={filtersContainerRef}
          className="flex overflow-x-auto pb-4 mb-6 -mx-4 px-4 scrollbar-hide"
          data-aos="fade-up" 
          data-aos-delay="200"
        >
          <div className="flex space-x-3 min-w-max">
            {filterOptions.map((option, index) => {
              const isActive = searchTerm === option.search && selectedCategory === option.category;
              return (
                <button
                  key={index}
                  onClick={() => handleFilter(option.search, option.category)}
                  className={`flex items-center px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 ease-in-out shadow-lg whitespace-nowrap
                    ${isActive
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  {t(option.label)}
                </button>
              );
            })}
            <button
              onClick={handleResetFilters}
              className={`flex items-center px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 ease-in-out shadow-lg whitespace-nowrap
                ${selectedCategory === 'all' && searchTerm === ''
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              {t('allTours')}
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay message={error} onRetry={fetchTours} />
        ) : tours.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {tours.map((tour: TourPackage) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  currentPage={currentPage} 
                  ref={(el) => {
                    if (el) {
                      tourCardRefs.current.set(tour.id, el);
                    } else {
                      tourCardRefs.current.delete(tour.id);
                    }
                  }}
                />
              ))}
            </div>
            {totalPages > 1 && ( 
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-textSecondary">{t('noToursFound')}</p>
            <p className="text-lg text-textSecondary mt-2">{t('tryDifferentSearch')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TourList;
