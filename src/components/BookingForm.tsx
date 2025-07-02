import React from 'react';
import { TourPackage } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';

interface BookingFormProps {
  tour: TourPackage;
}

const BookingForm: React.FC<BookingFormProps> = ({ tour }) => {
  const { t, language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('bookingFormSubmitted'));
    console.log('Booking form submitted for tour:', tour.name[language]);
    // In a real application, you would handle form submission here
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={t('enterFullName')}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={t('enterEmail')}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
            {t('numberOfParticipants')}
          </label>
          <input
            type="number"
            id="participants"
            min="1"
            defaultValue="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
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
