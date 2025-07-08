import React, { useState, useEffect } from 'react';
import { TourPackage } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';

interface BookingFormProps {
  tour: TourPackage;
}

const BookingForm: React.FC<BookingFormProps> = ({ tour }) => {
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [whatsappNumberInput, setWhatsappNumberInput] = useState('');
  const [quantities, setQuantities] = useState<{ [id: number]: number | null }>({});
  const [totalCost, setTotalCost] = useState(0);

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
    if (tour && tour.prices && tour.prices.length > 0) {
      const initialQuantities: { [id: number]: number | null } = {};
      tour.prices.forEach(option => {
        if (option.id !== undefined) {
          initialQuantities[option.id] = null;
        }
      });
      setQuantities(initialQuantities);
    }
  }, [tour]);

  useEffect(() => {
    let calculatedTotal = 0;
    if (tour && tour.prices) {
      tour.prices.forEach(option => {
        if (option.id !== undefined) {
          const qty = quantities[option.id] || 0;
          calculatedTotal += option.price * qty;
        }
      });
    }
    setTotalCost(calculatedTotal);
  }, [quantities, tour]);

  const getLocalizedContent = (content: { en: string; id?: string; ru?: string }) => {
    if (language === 'id') return content.id;
    if (language === 'ru') return content.ru || content.en;
    return content.en;
  };

  const handleQuantityChange = (optionId: number, value: string) => {
    if (value === '') {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [optionId]: null,
      }));
    } else {
      const newQuantity = Math.max(0, parseInt(value) || 0); 
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [optionId]: newQuantity,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tour || !tour.prices || tour.prices.length === 0) {
      alert(t('bookingErrorInvalidTour'));
      return;
    }

    const hasSelections = Object.values(quantities).some(qty => (qty ?? 0) > 0);
    if (!hasSelections) {
      alert(t('atLeastOneParticipant')); 
      return;
    }

    const tourName = getLocalizedContent(tour.name);
    const tourCode = tour.code || 'N/A';

    let serviceDetails = '';
    tour.prices.forEach(option => {
      if (option.id !== undefined) {
        const qty = quantities[option.id] || 0; 
        if (qty > 0) {
          const serviceType = getLocalizedContent(option.service_type);
          const description = getLocalizedContent(option.description);
          serviceDetails += `

- ${serviceType}${description ? ` (${description})` : ''}: ${qty} x ฿${option.price.toLocaleString()} = ฿${(option.price * qty).toLocaleString()}
`;
        }
      }
    });

    const message = `
${t('hello')}! ${t('iWantToBookTour')}

${t('tourName')}: ${tourName} (${tourCode})
${t('fullName')}: ${name}
${t('emailAddress')}: ${email}
${t('dateOfTour')}: ${date}
${t('serviceType')}: ${serviceDetails}
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

        {tour.prices && tour.prices.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('numberOfBookings')}</h3>
            {tour.prices.map((option) => (
              <div key={option.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{getLocalizedContent(option.service_type)} </div>
                  <div className="text-sm text-gray-600 block">{getLocalizedContent(option.description)}</div>
                  <div className="text-md font-bold text-blue-600">฿{parseFloat(String(option.price ?? '')).toLocaleString()}</div>
                </div>
                <div className="w-24 ml-4">
                  <label htmlFor={`quantity-${option.id}`} className="sr-only">{t('quantity')} for {getLocalizedContent(option.service_type)}</label>
                  <input
                    type="number"
                    id={`quantity-${option.id}`}
                    min="0"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 text-center"
                    value={quantities[option.id!] ?? ""}
                    onChange={(e) => handleQuantityChange(option.id!, e.target.value)}
                    aria-label={`${t('quantity')} for ${getLocalizedContent(option.service_type)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">{t('noPricingInfo') || 'No pricing information available for this tour.'}</p>
        )}
        
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
          <span className="text-lg font-semibold text-gray-900">{t('totalCost')}:</span>
          <span className="text-2xl font-bold text-blue-600">฿{totalCost.toLocaleString()}</span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-semibold transition-colors"
          disabled={!tour.prices || tour.prices.length === 0} 
        >
          {t('confirmBooking')}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
