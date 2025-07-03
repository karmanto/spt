import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { TourPackage } from '../lib/types';
import TourCard from '../components/TourCard';
import { getTourPackages } from '../lib/api'; // Import API function

interface OutletContext {
  searchTerm: string;
  selectedCategory: string;
}

const TourList: React.FC = () => {
  const { t } = useLanguage();
  const { searchTerm, selectedCategory } = useOutletContext<OutletContext>();
  
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; 

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTourPackages({
        page: currentPage,
        per_page: itemsPerPage,
        search: searchTerm,
        tags: selectedCategory, 
      });
      setTours(response.data);
      setTotalPages(response.pagination.last_page);
    } catch (err) {
      console.error("Failed to fetch tours:", err);
      setError(t('failedToLoadTours') || 'Failed to load tour packages. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, t]);

  useEffect(() => {
    // Reset to first page when search term or category changes
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Pagination controls rendering
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5; // Number of page buttons to display
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {t('previous')}
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1.5 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
            >
              1
            </button>
            {startPage > 2 && <span className="text-textSecondary">...</span>}
          </>
        )}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors duration-200
              ${currentPage === number
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
          >
            {number}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-textSecondary">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1.5 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {t('next')}
        </button>
      </div>
    );
  };

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

        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-textSecondary">{t('loadingTours') || 'Loading tours...'}</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-2xl text-red-500">{error}</p>
          </div>
        ) : tours.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {tours.map((tour: TourPackage) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
            {renderPagination()}
          </>
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
