import React, { useState, useEffect } from 'react';
import { TourPackage, PriceDetails } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';

interface BookingFormProps {
  tour: TourPackage;
}

const BookingForm: React.FC<BookingFormProps> = ({ tour }) => {
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [whatsappNumberInput, setWhatsappNumberInput] = useState(''); // Renamed to avoid conflict
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Get environment variables
  const whatsappContactNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const telegramUsername = import.meta.env.VITE_TELEGRAM_USERNAME;

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); 
    return today.toISOString().split('T')[0]; 
  };

  useEffect(() => {
    setDate(getMinDate()); 
  }, []);

  useEffect(() => {
    if (tour && typeof tour.price !== 'string') {
      const priceDetails = tour.price as PriceDetails;
      const calculatedTotal =
        (adults * (priceDetails.adult || 0)) +
        (children * (priceDetails.child || 0)) +
        (infants * (priceDetails.infant || 0));
      setTotalCost(calculatedTotal);
    }
  }, [adults, children, infants, tour]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tour || typeof tour.price === 'string') {
      alert(t('bookingErrorInvalidTour'));
      return;
    }

    const tourName = tour.name[language] || tour.name.en;
    const tourCode = tour.code || 'N/A';

    const message = `
      ${t('hello')}! ${t('iWantToBookTour')}

      ${t('tourName')}: ${tourName} (${tourCode})
      ${t('fullName')}: ${name}
      ${t('emailAddress')}: ${email}
      ${t('dateOfTour')}: ${date}
      ${t('adults')}: ${adults}
      ${t('children')}: ${children}
      ${t('infants')}: ${infants}
      ${t('totalCost')}: ฿${totalCost.toLocaleString()}
      ${t('myWhatsappNumber')}: ${whatsappNumberInput}

      ${t('lookingForwardToConfirmation')}
    `.trim(); 

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://${language === 'ru' ? `t.me/${telegramUsername}` : `wa.me/${whatsappContactNumber}`}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('bookingFormTitle')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('fullName')}
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
            placeholder={t('enterFullName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('emailAddress')}
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
            placeholder={t('enterEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
            {t('whatsappNumber')}
          </label>
          <input
            type="tel" 
            id="whatsappNumber"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
            placeholder={t('enterWhatsappNumber')}
            value={whatsappNumberInput}
            onChange={(e) => setWhatsappNumberInput(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            {t('dateOfTour')}
          </label>
          <input
            type="date"
            id="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
            min={getMinDate()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
              {t('adult')}
            </label>
            <input
              type="number"
              id="adults"
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
              value={adults}
              onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
              required
            />
          </div>
          <div>
            <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
              {t('child')}
            </label>
            <input
              type="number"
              id="children"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
              value={children}
              onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
              required
            />
          </div>
          <div>
            <label htmlFor="infants" className="block text-sm font-medium text-gray-700 mb-1">
              {t('infant')}
            </label>
            <input
              type="number"
              id="infants"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
              value={infants}
              onChange={(e) => setInfants(Math.max(0, parseInt(e.target.value) || 0))}
              required
            />
          </div>
        </div>
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
          <span className="text-lg font-semibold text-gray-900">{t('totalCost')}:</span>
          <span className="text-2xl font-bold text-blue-600">฿{totalCost.toLocaleString()}</span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-semibold transition-colors"
        >
          {t('confirmBooking')}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
