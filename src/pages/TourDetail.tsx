import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; 
import toursData from '../data/tours.json';
import { TourPackage, LanguageContent } from '../lib/types';
import { MapPin, Clock, Users, Star, Camera, CheckCircle, XCircle } from 'lucide-react'; 
import { FaArrowLeft } from 'react-icons/fa'; 
import BookingForm from '../components/BookingForm'; 
import ItineraryDocument from '../components/ItineraryDocument'; 

const TourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language: currentLanguage } = useLanguage();
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'pricing' | 'booking'>('overview'); 
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); 

  useEffect(() => {
    const foundTour = toursData.find((t) => t.id === id);
    if (foundTour) {
      setTour(foundTour);
    } else {
      navigate('/tours'); 
    }
  }, [id, navigate]);

  if (!tour) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-base text-gray-700">{t('loadingTourDetails')}</p>
      </div>
    );
  }

  const getLocalizedContent = (content: LanguageContent) => {
    if (currentLanguage === 'id') return content.id;
    if (currentLanguage === 'ru') return content.ru || content.en;
    return content.en;
  };

  const tabs = [
    { id: 'overview', label: t('overview') },
    { id: 'itinerary', label: t('itinerary') },
    { id: 'pricing', label: t('pricingTab') },
    { id: 'booking', label: t('booking') }
  ];

  const discountPercentage = tour.originalPrice && tour.originalPrice > tour.price.adult
    ? Math.round(((tour.originalPrice - tour.price.adult) / tour.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Bagian utama dengan max-width */}
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
              src={`${import.meta.env.VITE_BASE_URL}${tour.images[selectedImageIndex]}`}
              alt={getLocalizedContent(tour.name)}
              className="w-full h-96 object-cover rounded-2xl shadow-lg mb-4"
            />
            <div className="absolute bottom-6 right-6 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Camera className="w-4 h-4" />
              {selectedImageIndex + 1} / {tour.images.length}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {tour.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${image}`}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {getLocalizedContent(tour.name)}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getLocalizedContent(tour.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{t('groupTour')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{tour.rate}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('tourHighlights')}</h3>
              <ul className="space-y-2">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{getLocalizedContent(highlight)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - full width */}
      <div className="w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
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

      {/* Tab Content - full width background */}
      <div className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tourOverview')}</h2>
                <p className="text-gray-700 leading-relaxed">
                  {getLocalizedContent(tour.overview)}
                </p>
              </div>

              {/* What's Included/Excluded */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    {t('whatsIncluded')}
                  </h3>
                  <ul className="space-y-3">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{getLocalizedContent(item)}</span>
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
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{getLocalizedContent(item)}</span>
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
              {/* Pricing Table */}
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
                          ฿{tour.price.adult.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-6 font-medium text-gray-900">{t('child')}</td>
                        <td className="py-4 px-6 text-center text-gray-600">{t('ageRangeChild')}</td>
                        <td className="py-4 px-6 text-right text-xl font-bold text-gray-900">
                          ฿{tour.price.child.toLocaleString()}
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

              {/* FAQ */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('faq')}</h2>
                <div className="space-y-6">
                  {tour.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <h3 className="font-semibold text-gray-900 mb-3">{getLocalizedContent(faq.question)}</h3>
                      <p className="text-gray-700">{getLocalizedContent(faq.answer)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation Policy */}
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