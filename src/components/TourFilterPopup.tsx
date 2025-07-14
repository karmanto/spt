import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TourFilterPopupProps } from '../lib/types';

const TourFilterPopup: React.FC<TourFilterPopupProps> = ({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { t } = useLanguage();

  const categories = [
    { key: 'all', label: t('allTours') },
    { key: '1_day_trip', label: t('oneDayTrip') },
    { key: 'open_trip', label: t('openTrip') },
    { key: 'other', label: t('otherTours') },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black bg-opacity-70 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-2xl p-8 w-full max-w-xl relative transform animate-slide-up-fade-in border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-textSecondary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
          aria-label={t('closeFilter')}
        >
          <X size={28} />
        </button>

        <h3 className="text-xl font-bold text-white mb-8 text-center">{t('filterTours')}</h3>

        <div className="relative w-full mb-8">
          <input
            type="text"
            placeholder={t('searchToursPlaceholder')}
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-border bg-background text-white focus:border-primary focus:ring-primary focus:outline-none transition-all duration-200 text-md shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label={t('searchToursPlaceholder')}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-3 py-1 rounded-full text-md font-semibold transition-all duration-300 ease-in-out shadow-md
                ${selectedCategory === category.key
                  ? 'bg-primary text-white'
                  : 'bg-background text-textSecondary hover:bg-surface-light border border-border'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-secondary text-white rounded-full font-bold text-md hover:bg-blue-600 transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            {t('applyFilters')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourFilterPopup;
