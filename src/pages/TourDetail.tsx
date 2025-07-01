import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import toursData from '../data/tours.json';
import { TourPackage, LanguageContent } from '../lib/types';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [tourDate, setTourDate] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [hotelPickup, setHotelPickup] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [joinWhatsapp, setJoinWhatsapp] = useState(false);
  const [vegetarianMeal, setVegetarianMeal] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState('overview'); // State for active tab

  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    const foundTour = toursData.find((t) => t.id === id);
    if (foundTour) {
      setTour(foundTour);
      // Set initial total cost
      setTotalCost(foundTour.price.adult * adults + foundTour.price.child * children + foundTour.price.infant * infants);
    } else {
      navigate('/tours'); // Redirect if tour not found
    }
  }, [id, navigate]);

  useEffect(() => {
    if (tour) {
      const calculatedCost =
        tour.price.adult * adults +
        tour.price.child * children +
        tour.price.infant * infants;
      setTotalCost(calculatedCost);
    }
  }, [adults, children, infants, tour]);

  if (!tour) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-base text-gray-700">{t('loadingTourDetails')}</p>
      </div>
    );
  }

  const getLocalizedContent = (content: LanguageContent) => {
    if (language === 'id') return content.id;
    if (language === 'ru') return content.ru || content.en;
    return content.en;
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!tourDate) errors.tourDate = t('tourDateRequired');
    if (adults + children + infants === 0) errors.participants = t('atLeastOneParticipant');
    if (!familyName) errors.familyName = t('familyNameRequired');
    if (!firstName) errors.firstName = t('firstNameRequired');
    if (!email) {
      errors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('invalidEmailFormat');
    }
    if (!phone) errors.phone = t('phoneNumberRequired');
    if (!nationality) errors.nationality = t('nationalityRequired');
    if (!hotelPickup) errors.hotelPickup = t('hotelPickupRequired');
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const bookingDetails = {
        packageName: getLocalizedContent(tour.name),
        tourDate,
        participants: { adults, children, infants },
        totalCost,
        guestInformation: {
          familyName,
          firstName,
          email,
          phone,
          nationality,
          hotelPickup,
          roomNumber,
          pickupTime,
        },
        addOns: {
          joinWhatsapp,
          vegetarianMeal,
        },
      };
      console.log('Booking Confirmed:', bookingDetails);
      alert(t('bookingConfirmedMessage'));
      // Here you would typically send this data to a backend
      resetForm();
    } else {
      alert(t('pleaseCorrectErrors'));
    }
  };

  const resetForm = () => {
    setAdults(1);
    setChildren(0);
    setInfants(0);
    setTourDate('');
    setFamilyName('');
    setFirstName('');
    setEmail('');
    setPhone('');
    setNationality('');
    setHotelPickup('');
    setRoomNumber('');
    setPickupTime('');
    setJoinWhatsapp(false);
    setVegetarianMeal(false);
    setFormErrors({});
  };

  const gallerySettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  const countries = [
    'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Australia', 'United Kingdom', 'United States', 'Canada', 'Germany', 'France', 'Russia', 'China', 'Japan', 'South Korea', 'India', 'Saudi Arabia', 'United Arab Emirates', 'Other'
  ];

  const pickupTimes = [
    '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM'
  ];

  const tabs = [
    { id: 'overview', label: t('overview') },
    { id: 'itinerary', label: t('itinerary') },
    { id: 'faq', label: t('faq') },
    { id: 'policy', label: t('policy') },
    { id: 'booking', label: t('booking') }, // Moved to last
  ];

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/tours')}
          className="mb-4 sm:mb-6 inline-flex items-center px-4 py-1.5 sm:px-5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-xl shadow-lg text-white bg-secondary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <i className="fas fa-arrow-left mr-1.5 sm:mr-2"></i> {t('backToTours')}
        </button>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-10 border border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-3 text-center leading-tight">
            {getLocalizedContent(tour.name)}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center">
            {getLocalizedContent(tour.location)} - {getLocalizedContent(tour.duration)}
          </p>

          {/* Gallery / Photos - Main Display */}
          <div className="mb-8 sm:mb-10" data-aos="fade-up">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5 border-b-4 border-secondary pb-1.5 sm:pb-2">
              {t('galleryTitle')}
            </h2>
            <div className="relative">
              <Slider ref={sliderRef} {...gallerySettings}>
                {tour.images.map((image, index) => (
                  <div key={index} className="px-0.5 sm:px-1">
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}${image}`}
                      alt={`${getLocalizedContent(tour.name)} - ${index + 1}`}
                      className="w-full h-64 sm:h-80 object-cover rounded-lg sm:rounded-xl shadow-lg"
                    />
                  </div>
                ))}
              </Slider>
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full ml-2 sm:ml-3 z-10 hidden md:block hover:bg-opacity-75 transition-colors"
                onClick={() => sliderRef.current?.slickPrev()}
                aria-label={t('previous')}
              >
                <i className="fas fa-chevron-left text-base sm:text-lg"></i>
              </button>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 z-10 hidden md:block hover:bg-opacity-75 transition-colors"
                onClick={() => sliderRef.current?.slickNext()}
                aria-label={t('next')}
              >
                <i className="fas fa-chevron-right text-base sm:text-lg"></i>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-4 sm:mb-6 border-b border-gray-200">
            <nav className="-mb-px flex flex-nowrap overflow-x-auto pb-2 justify-start space-x-2 sm:space-x-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-2 px-3 sm:px-5 text-sm sm:text-base font-medium rounded-t-lg transition-colors duration-200
                    ${activeTab === tab.id
                      ? 'border-b-4 border-primary text-primary bg-primary-50 shadow-inner'
                      : 'border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200">
            {activeTab === 'overview' && (
              <div data-aos="fade-in">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5 border-b-4 border-secondary pb-1.5 sm:pb-2">
                  {t('overview')}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-5">
                  {getLocalizedContent(tour.overview)}
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">{t('highlightsTitle')}</h3>
                <ul className="list-none text-gray-700 space-y-1.5 sm:space-y-2 mb-6">
                  {tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start text-sm sm:text-base">
                      <i className="fas fa-check-circle text-green-500 mr-1.5 sm:mr-2 mt-0.5"></i>
                      <span>{getLocalizedContent(highlight)}</span>
                    </li>
                  ))}
                </ul>

                {/* Included & Excluded Section - Moved here */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5 border-b-4 border-secondary pb-1.5 sm:pb-2">
                  {t('inclusionsExclusionsSectionTitle')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-4 sm:p-5 bg-green-50 rounded-xl shadow-md border border-green-200">
                    <h3 className="text-base sm:text-lg font-bold text-green-800 mb-2 sm:mb-3 border-b-2 border-green-500 pb-1">
                      {t('included')}
                    </h3>
                    <ul className="list-none space-y-1.5 sm:space-y-2 text-gray-700">
                      {tour.included.map((item, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <i className="fas fa-check-circle text-green-600 mr-1.5 sm:mr-2 mt-0.5"></i>
                          <span>{getLocalizedContent(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 sm:p-5 bg-red-50 rounded-xl shadow-md border border-red-200">
                    <h3 className="text-base sm:text-lg font-bold text-red-800 mb-2 sm:mb-3 border-b-2 border-red-500 pb-1">
                      {t('excluded')}
                    </h3>
                    <ul className="list-none space-y-1.5 sm:space-y-2 text-gray-700">
                      {tour.excluded.map((item, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <i className="fas fa-times-circle text-red-600 mr-1.5 sm:mr-2 mt-0.5"></i>
                          <span>{getLocalizedContent(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div data-aos="fade-in">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5 border-b-4 border-secondary pb-1.5 sm:pb-2">
                  {t('itinerary')}
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {tour.itinerary.map((dayPlan, index) => (
                    <div key={index} className="p-4 sm:p-5 bg-blue-50 rounded-xl shadow-md border border-blue-100">
                      <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 sm:mb-3">
                        {t('day')} {dayPlan.day}: {getLocalizedContent(dayPlan.title)}
                      </h3>
                      <ul className="list-none space-y-1.5 sm:space-y-2">
                        {dayPlan.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start text-gray-700 text-sm sm:text-base">
                            <i className="fas fa-arrow-right text-blue-600 mr-1.5 sm:mr-2 mt-0.5"></i>
                            <span>{getLocalizedContent(activity)}</span>
                          </li>
                        ))}
                      </ul>
                      {dayPlan.meals && dayPlan.meals.length > 0 && (
                        <div className="mt-3 sm:mt-4">
                          <h4 className="text-sm sm:text-base font-medium text-gray-800">{t('mealsIncluded')}:</h4>
                          <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm">
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
            )}

            {activeTab === 'faq' && (
              <div data-aos="fade-in">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5 border-b-4 border-secondary pb-1.5 sm:pb-2">
                  {t('faq')}
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {tour.faqs.map((faq, index) => (
                    <details key={index} className="group bg-gray-50 p-3 sm:p-4 rounded-xl shadow-md cursor-pointer border border-gray-100">
                      <summary className="flex justify-between items-center font-semibold text-gray-800 text-sm sm:text-base">
                        {getLocalizedContent(faq.question)}
                        <span className="transform transition-transform duration-200 group-open:rotate-180">
                          <i className="fas fa-chevron-down"></i>
                        </span>
                      </summary>
                      <p className="mt-1.5 sm:mt-2 text-gray-600 leading-relaxed text-xs sm:text-sm">
                        {getLocalizedContent(faq.answer)}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'policy' && (
              <div data-aos="fade-in">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5 border-b-4 border-secondary pb-1.5 sm:pb-2">
                  {t('policy')}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {t('cancellationPolicyText')}
                </p>
              </div>
            )}

            {activeTab === 'booking' && (
              <div data-aos="fade-in">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5 border-b-4 border-secondary pb-1.5 sm:pb-2">
                  {t('booking')} & {t('priceTableTitle')}
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {/* Promotion / Discount Price */}
                  {tour.promotions && (
                    <div className="p-4 sm:p-6 bg-yellow-50 rounded-xl sm:rounded-2xl shadow-xl border border-yellow-200 transform hover:scale-105 transition-transform duration-300">
                      <h2 className="text-lg sm:text-xl font-bold text-yellow-800 mb-2 sm:mb-3 border-b-2 border-yellow-500 pb-1">
                        {t('promotionTitle')}
                      </h2>
                      <p className="text-base sm:text-lg font-bold text-yellow-700 mb-1.5 sm:mb-2">
                        {getLocalizedContent(tour.promotions.type)}: {tour.promotions.discount}% {t('discount')}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700">
                        {t('validUntil')}: {new Date(tour.promotions.validUntil).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  )}

                  {/* Price Table */}
                  <div className="p-4 sm:p-6 bg-primary-50 rounded-xl sm:rounded-2xl shadow-xl border border-primary-200">
                    <h2 className="text-lg sm:text-xl font-bold text-primary-800 mb-2 sm:mb-3 border-b-2 border-primary pb-1">
                      {t('priceTableTitle')}
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-lg shadow-sm">
                        <thead>
                          <tr className="bg-primary-100 text-primary-800 uppercase text-xs sm:text-sm leading-normal">
                            <th className="py-1.5 px-2 sm:py-2 sm:px-3 text-left">{t('category')}</th>
                            <th className="py-1.5 px-2 sm:py-2 sm:px-3 text-left">{t('pricePerPerson')}</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-xs sm:text-sm font-light">
                          <tr className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-1.5 px-2 sm:py-2 sm:px-3 text-left whitespace-nowrap">{t('adult')} (12+)</td>
                            <td className="py-1.5 px-2 sm:py-2 sm:px-3 text-left">
                              {tour.price.adult.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-1.5 px-2 sm:py-2 sm:px-3 text-left whitespace-nowrap">{t('child')} (4-11)</td>
                            <td className="py-1.5 px-2 sm:py-2 sm:px-3 text-left">
                              {tour.price.child.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-100">
                            <td className="py-1.5 px-2 sm:py-2 sm:px-3 text-left whitespace-nowrap">{t('infant')} (0-3)</td>
                            <td className="py-1.5 px-2 sm:py-2 sm:px-3 text-left">{t('free')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <div className="p-4 sm:p-6 bg-accent-50 rounded-xl sm:rounded-2xl shadow-xl border border-accent-200">
                    <h2 className="text-lg sm:text-xl font-bold text-accent-800 mb-2 sm:mb-3 border-b-2 border-accent pb-1">
                      {t('bookingFormTitle')}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      {/* Tour Package Selection */}
                      <div>
                        <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1">
                          {t('packageName')}
                        </label>
                        <input
                          type="text"
                          value={getLocalizedContent(tour.name)}
                          readOnly
                          className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-1.5 px-2 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-gray-100 cursor-not-allowed text-xs sm:text-sm"
                        />
                      </div>

                      {/* Date of Tour */}
                      <div>
                        <label htmlFor="tourDate" className="block text-gray-700 text-xs sm:text-sm font-bold mb-1">
                          {t('dateOfTour')} <span className="text-error">*</span>
                        </label>
                        <input
                          type="date"
                          id="tourDate"
                          value={tourDate}
                          onChange={(e) => setTourDate(e.target.value)}
                          className={`shadow-sm appearance-none border rounded-lg w-full py-1.5 px-2 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs sm:text-sm ${formErrors.tourDate ? 'border-error' : 'border-gray-300'}`}
                          required
                        />
                        {formErrors.tourDate && <p className="text-error text-xs italic mt-1">{formErrors.tourDate}</p>}
                      </div>

                      {/* Participants */}
                      <div className="border border-gray-200 p-3 sm:p-4 rounded-xl bg-gray-50 shadow-inner">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2">{t('participants')} <span className="text-error">*</span></h3>
                        {formErrors.participants && <p className="text-error text-xs italic mb-2">{formErrors.participants}</p>}
                        <div className="space-y-2 sm:space-y-3">
                          {/* Adult */}
                          <div className="flex items-center justify-between">
                            <label className="text-gray-700 text-sm">{t('adult')} (12+)</label>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setAdults(Math.max(0, adults - 1))}
                                className="bg-secondary text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm sm:text-base font-bold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                              >
                                -
                              </button>
                              <span className="text-base sm:text-lg font-semibold w-6 sm:w-7 text-center text-gray-900">{adults}</span>
                              <button
                                type="button"
                                onClick={() => setAdults(adults + 1)}
                                className="bg-secondary text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm sm:text-base font-bold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          {/* Child */}
                          <div className="flex items-center justify-between">
                            <label className="text-gray-700 text-sm">{t('child')} (4-11)</label>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                className="bg-secondary text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm sm:text-base font-bold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                              >
                                -
                              </button>
                              <span className="text-base sm:text-lg font-semibold w-6 sm:w-7 text-center text-gray-900">{children}</span>
                              <button
                                type="button"
                                onClick={() => setChildren(children + 1)}
                                className="bg-secondary text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm sm:text-base font-bold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          {/* Infant */}
                          <div className="flex items-center justify-between">
                            <label className="text-gray-700 text-sm">{t('infant')} (0-3)</label>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setInfants(Math.max(0, infants - 1))}
                                className="bg-secondary text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm sm:text-base font-bold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                              >
                                -
                              </button>
                              <span className="text-base sm:text-lg font-semibold w-6 sm:w-7 text-center text-gray-900">{infants}</span>
                              <button
                                type="button"
                                onClick={() => setInfants(infants + 1)}
                                className="bg-secondary text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm sm:text-base font-bold hover:bg-blue-600 transition-colors duration-200 shadow-md"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-4 text-right">
                          <span className="text-lg sm:text-xl font-extrabold text-primary">
                            {t('totalCost')}: {totalCost.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                          </span>
                        </div>
                      </div>

                      {/* Guest Information */}
                      <div className="border border-gray-200 p-3 sm:p-4 rounded-xl bg-gray-50 shadow-inner">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2">{t('guestInformation')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                          <div>
                            <label htmlFor="familyName" className="block text-gray-700 text-xs sm:text-sm font-bold mb-1">
                              {t('familyName')} <span className="text-error">*</span>
                            </label>
                            <input
                              type="text"
                              id="familyName"
                              value={familyName}
                              onChange={(e) => setFamilyName(e.target.value)}
                              className={`shadow-sm appearance-none border rounded-lg w-full py-1.5 px-2 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs sm:text-sm ${formErrors.familyName ? 'border-error' : 'border-gray-300'}`}
                              required
                            />
                            {formErrors.familyName && <p className="text-error text-xs italic mt-1">{formErrors.familyName}</p>}
                          </div>
                          <div>
                            <label htmlFor="firstName" className="block text-gray-700 text-xs sm:text-sm font-bold mb-1">
                              {t('firstName')} <span className="text-error">*</span>
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className={`shadow-sm appearance-none border rounded-lg w-full py-1.5 px-2 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs sm:text-sm ${formErrors.firstName ? 'border-error' : 'border-gray-300'}`}
                              required
                            />
                            {formErrors.firstName && <p className="text-error text-xs italic mt-1">{formErrors.firstName}</p>}
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-gray-700 text-xs sm:text-sm font-bold mb-1">
                              {t('emailAddress')} <span className="text-error">*</span>
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className={`shadow-sm appearance-none border rounded-lg w-full py-1.5 px-2 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs sm:text-sm ${formErrors.email ? 'border-error' : 'border-gray-300'}`}
                              required
                            />
                            {formErrors.email && <p className="text-error text-xs italic mt-1">{formErrors.email}</p>}
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-gray-700 text-xs sm:text-sm font-bold mb-1">
                              {t('phoneNumber')} <span className="text-error">*</span>
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={`shadow-sm appearance-none border rounded-lg w-full py-1.5 px-2 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs sm:text-sm ${formErrors.phone ? 'border-error' : 'border-gray-300'}`}
                              required
                            />
                            {formErrors.phone && <p className="text-error text-xs italic mt-1">{formErrors.phone}</p>}
                          </div>
                          <div>
                            <label htmlFor="nationality" className="block text-gray-700 text-xs sm:text-sm font-bold mb-1">
                              {t('nationality')} <span className="text-error">*</span>
                            </label>
                            <select
                              id="nationality"
                              value={nationality}
                              onChange={(e) => setNationality(e.target.value)}
                              className={`shadow-sm appearance-none border rounded-lg w-full py-1.5 px-2 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs sm:text-sm ${formErrors.nationality ? 'border-error' : 'border-gray-300'}`}
                              required
                            >
                              <option value="">{t('selectNationality')}</option>
                              {countries.map((country) => (
                                <option key={country} value={country}>{country}</option>
                              ))}
                            </select>
                            {formErrors.nationality && <p className="text-error text-xs italic mt-1">{formErrors.nationality}</p>}
                          </div>
                          <div>
                            <label htmlFor="hotelPickup" className="block text-gray-700 text-xs sm:text-sm font-bold mb-1">
                              {t('hotelPickupFrom')} <span className="text-error">*</span>
                            </label>
                            <input
                              type="text"
                              id="hotelPickup"
                              value={hotelPickup}
                              onChange={(e) => setHotelPickup(e.target.value)}
                              placeholder={t('enterHotelName')}
                              className={`shadow-sm appearance-none border rounded-lg w-full py-1.5 px-2 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs sm:text-sm ${formErrors.hotelPickup ? 'border-error' : 'border-gray-300'}`}
                              required
                            />
                            {formErrors.hotelPickup && <p className="text-error text-xs italic mt-1">{formErrors.hotelPickup}</p>}
                          </div>
                          <div>
                            <label htmlFor="roomNumber" className="block text-gray-700 text-xs sm:text-sm font-bold mb-1">
                              {t('roomNumber')} ({t('optional')})
                            </label>
                            <input
                              type="text"
                              id="roomNumber"
                              value={roomNumber}
                              onChange={(e) => setRoomNumber(e.target.value)}
                              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-1.5 px-2 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="pickupTime" className="block text-gray-700 text-xs sm:text-sm font-bold mb-1">
                              {t('pickupTime')} ({t('optional')})
                            </label>
                            <select
                              id="pickupTime"
                              value={pickupTime}
                              onChange={(e) => setPickupTime(e.target.value)}
                              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-1.5 px-2 sm:py-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-xs sm:text-sm"
                            >
                              <option value="">{t('selectTime')}</option>
                              {pickupTimes.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Optional Add-ons */}
                      <div className="border border-gray-200 p-3 sm:p-4 rounded-xl bg-gray-50 shadow-inner">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2">{t('optionalAddOns')}</h3>
                        <div className="space-y-1.5 sm:space-y-2">
                          <label className="flex items-center text-gray-700 text-xs sm:text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={joinWhatsapp}
                              onChange={(e) => setJoinWhatsapp(e.target.checked)}
                              className="form-checkbox h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary rounded-md focus:ring-primary transition-colors duration-200"
                            />
                            <span className="ml-2">{t('joinWhatsappGroup')}</span>
                          </label>
                          <label className="flex items-center text-gray-700 text-xs sm:text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={vegetarianMeal}
                              onChange={(e) => setVegetarianMeal(e.target.checked)}
                              className="form-checkbox h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary rounded-md focus:ring-primary transition-colors duration-200"
                            />
                            <span className="ml-2">{t('requestVegetarianMeal')}</span>
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mt-4 sm:mt-5">
                        <button
                          type="submit"
                          className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white py-2 px-6 sm:py-2.5 sm:px-7 rounded-xl font-semibold text-sm sm:text-base hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                          <i className="fas fa-check-circle"></i> {t('confirmBooking')}
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="w-full sm:w-auto bg-white text-gray-800 py-2 px-6 sm:py-2.5 sm:px-7 rounded-xl font-medium text-sm sm:text-base border-2 border-gray-300 hover:bg-gray-100 transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 sm:gap-2"
                        >
                          <i className="fas fa-redo"></i> {t('resetForm')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDetail;
