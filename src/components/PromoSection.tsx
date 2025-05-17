import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const PromoSection: React.FC = () => {
  const { t } = useLanguage();
  const [countdowns, setCountdowns] = useState<{ [key: number]: CountdownState }>({});

  const promos = [
    {
      id: 1,
      title: 'James Bond Island Tour',
      price: 'Rp 1.500.000',
      oldPrice: 'Rp 2.000.000',
      image: 'https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg?auto=compress&cs=tinysrgb&w=1600',
      badge: 'limitedTime',
      remaining: 5,
      endDate: '2026-04-01T00:00:00',
    },
    {
      id: 2,
      title: 'Phuket City Tour',
      price: 'Rp 900.000',
      oldPrice: 'Rp 1.200.000',
      image: 'https://images.pexels.com/photos/1480867/pexels-photo-1480867.jpeg?auto=compress&cs=tinysrgb&w=1600',
      badge: 'limitedTime',
      remaining: 8,
      endDate: '2026-03-25T00:00:00',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      
      const newCountdowns = promos.reduce((acc, promo) => {
        const endTime = new Date(promo.endDate).getTime();
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          
          acc[promo.id] = { days, hours, minutes, seconds };
        }
        
        return acc;
      }, {} as { [key: number]: CountdownState });
      
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getBadgeColor = (badge: string) => {
    switch(badge) {
      case 'limitedTime':
        return 'bg-red-500';
      case 'bestSeller':
        return 'bg-primary';
      default:
        return 'bg-green-500';
    }
  };

  const getBadgeText = (badge: string) => {
    switch(badge) {
      case 'limitedTime':
        return t('limitedTime');
      case 'bestSeller':
        return t('bestSeller');
      default:
        return badge;
    }
  };

  return (
    <section id="promo" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('promoTitle')}
          </h2>
          <p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('promoSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promos.map((promo, index) => (
            <div 
              key={promo.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={index * 100 + 200}
            >
              <div className="relative">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`${getBadgeColor(promo.badge)} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}>
                    {getBadgeText(promo.badge)}
                  </span>
                  {promo.remaining && (
                    <span className="bg-gray-800 bg-opacity-75 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {promo.remaining} {t('spotsLeft')}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{promo.title}</h3>
                <div className="flex items-baseline mb-3">
                  <span className="text-2xl font-bold text-primary">{promo.price}</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">{promo.oldPrice}</span>
                </div>
                {countdowns[promo.id] && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">{t('endsIn')}:</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <div className="bg-gray-100 rounded p-1">
                          <span className="text-md font-bold text-primary">{countdowns[promo.id].days}</span>
                          <p className="text-xs text-gray-600">{t('days')}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-100 rounded p-1">
                          <span className="text-md font-bold text-primary">{countdowns[promo.id].hours}</span>
                          <p className="text-xs text-gray-600">{t('hours')}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-100 rounded p-1">
                          <span className="text-md font-bold text-primary">{countdowns[promo.id].minutes}</span>
                          <p className="text-xs text-gray-600">{t('minutes')}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-gray-100 rounded p-1">
                          <span className="text-md font-bold text-primary">{countdowns[promo.id].seconds}</span>
                          <p className="text-xs text-gray-600">{t('seconds')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors duration-300">
                  {t('bookNow')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;