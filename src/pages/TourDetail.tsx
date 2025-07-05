import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; 
import { TourPackage, LanguageContent, PriceDetails } from '../lib/types'; 
import { MapPin, Clock, Tag, Star, Camera, CheckCircle, XCircle } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa'; 
import BookingForm from '../components/BookingForm'; 
import ItineraryDocument from '../components/ItineraryDocument'; 
import { getTourPackageDetail } from '../lib/api'; 
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import ErrorDisplay from '../components/ErrorDisplay';     // Import ErrorDisplay

const TourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language: currentLanguage } = useLanguage();
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'pricing' | 'booking'>('overview'); 
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); 

  const fetchTourDetail = async () => {
    if (!id) {
      navigate('/tours'); 
      return;
    }
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const foundTour = await getTourPackageDetail(id);
      setTour(foundTour);
    } catch (err) {
      console.error("Failed to fetch tour detail:", err);
      setError(t('failedToLoadTourDetails') || 'Failed to load tour details. Please try again later.');
      // Removed direct navigation on error, let ErrorDisplay handle it or user retry
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourDetail();
  }, [id, navigate, t]); 

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <LoadingSpinner /> {/* Use LoadingSpinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <ErrorDisplay message={error} onRetry={fetchTourDetail} /> {/* Use ErrorDisplay with retry */}
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-base text-gray-700">{t('tourNotFound') || 'Tour not found.'}</p>
      </div>
    );
  }

  const getLocalizedContent = (content: LanguageContent) => {
    if (currentLanguage === 'id') return content.id;
    if (currentLanguage === 'ru') return content.ru || content.en;
    return content.en;
  };

  const sortedImages = [...tour.images].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  const tabs = [
    { id: 'overview', label: t('overview') },
    { id: 'itinerary', label: t('itinerary') },
    { id: 'pricing', label: t('pricingTab') },
    { id: 'booking', label: t('booking') }
  ];

  const priceDetails = tour.price as PriceDetails; 
  const adultPrice = priceDetails.adult || 0;
  const childPrice = priceDetails.child || 0;

  const originalPriceNum = tour.original_price ? parseFloat(tour.original_price) : 0;
  const discountPercentage = originalPriceNum > adultPrice
    ? Math.round(((originalPriceNum - adultPrice) / originalPriceNum) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/tours')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={t('backToTours')}
          >
            <FaArrowLeft className="text-lg" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="relative">
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                {discountPercentage}{t('discountOff')}
              </div>
            )}
            <img
              src={`${import.meta.env.VITE_BASE_URL}${sortedImages[selectedImageIndex]?.path}`}
              alt={getLocalizedContent(tour.name)}
              className="w-full h-96 object-cover rounded-2xl shadow-lg mb-4"
            />
            <div className="absolute bottom-6 right-6 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Camera className="w-4 h-4" />
              {selectedImageIndex + 1} / {sortedImages.length}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${image.path}`}
                    alt={`${getLocalizedContent(tour.name)} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{getLocalizedContent(tour.location)}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getLocalizedContent(tour.name)}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getLocalizedContent(tour.duration)}</span>
                </div>
                {tour.code && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>{tour.code}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{tour.rate}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('tourHighlights')}</h3>
              <ul className="space-y-2">
                {tour.highlights.map((highlight) => (
                  <li key={highlight.id} className="flex items-start gap-2"> {/* Use item.id as key */}
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{getLocalizedContent(highlight.description)}</span> 
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-scroll" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tourOverview')}</h2>
                <p className="text-gray-700 leading-relaxed">
                  {getLocalizedContent(tour.overview)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    {t('whatsIncluded')}
                  </h3>
                  <ul className="space-y-3">
                    {tour.included_excluded
                      .filter(item => item.type === 'included')
                      .map((item) => (
                        <li key={item.id} className="flex items-start gap-3"> {/* Use item.id as key */}
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{getLocalizedContent(item.description)}</span> {/* Use .description */}
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <XCircle className="w-6 h-6 text-red-500" />
                    {t('whatsNotIncluded')}
                  </h3>
                  <ul className="space-y-3">
                    {tour.included_excluded
                      .filter(item => item.type === 'excluded')
                      .map((item) => (
                        <li key={item.id} className="flex items-start gap-3"> {/* Use item.id as key */}
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{getLocalizedContent(item.description)}</span> {/* Use .description */}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <ItineraryDocument tour={tour} />
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pricingInfo')}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">{t('category')}</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-900">{t('ageRange')}</th>
                        <th className="text-right py-4 px-6 font-semibold text-gray-900">{t('pricePerPerson')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-6 font-medium text-gray-900">{t('adult')}</td>
                        <td className="py-4 px-6 text-center text-gray-600">{t('ageRangeAdult')}</td>
                        <td className="py-4 px-6 text-right text-xl font-bold text-gray-900">
                          ฿{adultPrice.toLocaleString()} {/* Use parsed adultPrice */}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-6 font-medium text-gray-900">{t('child')}</td>
                        <td className="py-4 px-6 text-center text-gray-600">{t('ageRangeChild')}</td>
                        <td className="py-4 px-6 text-right text-xl font-bold text-gray-900">
                          ฿{childPrice.toLocaleString()} {/* Use parsed childPrice */}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-gray-900">{t('infant')}</td>
                        <td className="py-4 px-6 text-center text-gray-600">{t('ageRangeInfant')}</td>
                        <td className="py-4 px-6 text-right text-xl font-bold text-green-600">
                          {t('free')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('faq')}</h2>
                <div className="space-y-6">
                  {tour.faqs.map((faq) => (
                    <div key={faq.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"> {/* Use faq.id as key */}
                      <h3 className="font-semibold text-gray-900 mb-3">{getLocalizedContent(faq.question)}</h3>
                      <p className="text-gray-700">{getLocalizedContent(faq.answer)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('cancellationPolicy')}</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>{t('freeCancellationPolicy')}</li>
                  <li>{t('halfRefundPolicy')}</li>
                  <li>{t('noRefundPolicy')}</li>
                  <li>{t('weatherRefundPolicy')}</li>
                  <li>{t('policyChanges')}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'booking' && (
            <BookingForm tour={tour} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
