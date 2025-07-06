import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { TourPackage } from '../lib/types';
import TourCard from '../components/TourCard';
import { getTourPackages } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner'; 
import ErrorDisplay from '../components/ErrorDisplay';     

interface OutletContext {
  searchTerm: string;
  selectedCategory: string;
}

const TourList: React.FC = () => {
  const { t, language } = useLanguage(); // Destructure language here
  const { searchTerm, selectedCategory } = useOutletContext<OutletContext>();
  
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; 

  // Environment variables for contact
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const telegramUsername = import.meta.env.VITE_TELEGRAM_USERNAME;

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
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

  const handleContactExperts = () => {
    const isRussian = language === 'ru';
    const whatsappMessage = encodeURIComponent(t('whatsappMessage'));
    
    let url = '';
    if (isRussian) {
      url = `https://t.me/${telegramUsername}?text=${whatsappMessage}`;
    } else {
      url = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    }
    window.open(url, '_blank', 'noopener noreferrer');
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
          <LoadingSpinner />
        ) : error ? (
          <ErrorDisplay message={error} onRetry={fetchTours} />
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
      <div className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('tourList.cantFind')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('tourList.customize')}
          </p>
          <button 
            onClick={handleContactExperts} 
            className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white ${language ==="ru" ? "bg-[#0088cc] hover:bg-[#006699]" : "bg-[#25d366] hover:bg-[#13a033]"} transition-colors duration-300`}
          >
            {t('tourList.contactExperts')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TourList;
