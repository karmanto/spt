import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React, { useState } from 'react';
import Slider from 'react-slick';
import { useLanguage } from '../context/LanguageContext';
import galleryData from '../data/gallery.json';
import sptLogo from '/spt_logo.png';

interface GalleryImage {
  id: number;
  url: string;
}

interface GalleryCategory {
  id: number;
  nameId: string;
  nameEn: string;
  nameRu?: string;
  images: GalleryImage[];
}

const Gallery: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const openSlideshow = (category: GalleryCategory) => {
    setSelectedCategory(category);
    setSelectedIndex(0);
  };

  const closeSlideshow = () => {
    setSelectedCategory(null);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCategory) return;
    setSelectedIndex((prev) => (prev + 1) % selectedCategory.images.length);
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCategory) return;
    setSelectedIndex((prev) => (prev - 1 + selectedCategory.images.length) % selectedCategory.images.length);
  };

  const sliderSettings = {
    infinite: true,
    speed: 10000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const getCategoryName = (cat: GalleryCategory) => {
    if (language === 'id') return cat.nameId;
    if (language === 'ru') return cat.nameRu || cat.nameEn;
    return cat.nameEn;
  };

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('galleryTitle')}
          </h2>
          <p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('gallerySubtitle')}
          </p>
        </div>

        <div data-aos="fade-up">
          <Slider {...sliderSettings}>
            {galleryData.galleries.map((cat: GalleryCategory) => (
              <div key={cat.id} className="px-2">
                <div
                  className="relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => openSlideshow(cat)}
                >
                  <img
                    src={cat.images[0].url}
                    alt={getCategoryName(cat)}
                    className="w-full h-64 object-cover"
                  />
                  <img
                    src={sptLogo}
                    alt="logo"
                    className="absolute top-2 right-2 w-8 h-8 opacity-90 rounded-full bg-white"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-800 text-center">
                  {getCategoryName(cat)}
                </h3>
              </div>
            ))}
          </Slider>
        </div>

        {selectedCategory && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={closeSlideshow}
            aria-modal="true"
            role="dialog"
          >
            <div className="relative max-w-3xl max-h-screen p-4">
              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={closeSlideshow}
                aria-label={t('close')}
              >
                &times;
              </button>

              <div className="relative">
                <img
                  src={selectedCategory.images[selectedIndex].url}
                  alt={getCategoryName(selectedCategory)}
                  className="max-w-full max-h-[80vh] object-contain mx-auto"
                />
                <img
                  src={sptLogo}
                  alt="logo"
                  className="absolute top-2 right-2 w-12 h-12 opacity-90 rounded-full bg-white"
                />
              </div>

              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
                onClick={showPrev}
                aria-label={t('previous')}
              >
                ‹
              </button>

              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
                onClick={showNext}
                aria-label={t('next')}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
