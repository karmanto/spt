import React, { useState, useEffect } from 'react';
import PopupPromoCard from './PopupPromoCard';
import { promos } from '../data/promos.json';
import { Promo, CountdownState } from '../utils/types';

const PromoPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const randomPromo = promos[Math.floor(Math.random() * promos.length)];
    setSelectedPromo(randomPromo);
  }, []);

  useEffect(() => {
    if (!selectedPromo) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTime = new Date(selectedPromo.endDate).getTime();
      const timeLeft = endTime - now;

      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [selectedPromo]);

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('backdrop')) setIsOpen(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen || !selectedPromo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop"
      onClick={handleClickOutside}
    >
      <div
        className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>
        <PopupPromoCard promo={selectedPromo} countdown={countdown} />
      </div>
    </div>
  );
};

export default PromoPopup;