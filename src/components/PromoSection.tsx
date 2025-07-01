import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PromoCard from './PromoCard';
import { CountdownState, Promo } from '../lib/types'; // Import Promo directly
import { getPromos } from '../lib/api'; // Import getPromos

const PromoSection: React.FC = () => {
  const { t } = useLanguage();
  const [promos, setPromos] = useState<Promo[]>([]); // State for fetched promos
  const [countdowns, setCountdowns] = useState<{ [key: number]: CountdownState }>({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  // Effect to fetch promos
  useEffect(() => {
    const fetchPromosData = async () => {
      try {
        setLoading(true);
        const data = await getPromos();
        setPromos(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch promos:', err);
        setError('Failed to load promotions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPromosData();
  }, []); // Empty dependency array: runs once on mount

  // Effect for countdowns, depends on promos
  useEffect(() => {
    if (promos.length === 0 && !loading) { // Only clear if no promos and not loading
      setCountdowns({});
      return;
    }

    const updateCountdowns = () => {
      const now = new Date().getTime();
      const newCountdowns: { [key: number]: CountdownState } = {};

      promos.forEach((promo) => {
        const endTime = new Date(promo.end_date).getTime();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          newCountdowns[promo.id] = { days, hours, minutes, seconds };
        } else {
          // If promo has ended, ensure it's not in countdowns
          if (countdowns[promo.id]) {
            delete newCountdowns[promo.id];
          }
        }
      });

      setCountdowns(newCountdowns);
    };

    // Initial update
    updateCountdowns();

    // Set up interval
    const timer = setInterval(updateCountdowns, 1000);

    // Cleanup on unmount or when promos change
    return () => clearInterval(timer);
  }, [promos, loading]); // Dependency array: re-run when promos or loading state change

  if (loading) {
    return (
      <section id="promo" className="py-16 bg-gray-50 flex justify-center items-center min-h-[300px]">
        <p className="text-lg text-gray-600">{'Loading promotions...'}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="promo" className="py-16 bg-gray-50 flex justify-center items-center min-h-[300px]">
        <p className="text-lg text-red-600">{error}</p>
      </section>
    );
  }

  if (promos.length === 0 && !loading) {
    return (
      <section id="promo" className="py-16 bg-gray-50 flex justify-center items-center min-h-[300px]">
        <p className="text-lg text-gray-600">{t('noPromosAvailable') || 'No promotions available at the moment.'}</p>
      </section>
    );
  }

  return (
    <section id="promo" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#102d5e] mb-4">
            {t('promoDesc1')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('promoDesc2')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200">
          {promos.map((promo) => (
            <PromoCard
              key={promo.id}
              promo={promo}
              countdown={countdowns[promo.id]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
