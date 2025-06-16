// src/components/TopPackages.tsx
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { useState } from 'react';
import Slider from 'react-slick';
import { useLanguage } from '../context/LanguageContext';
import { packages } from '../data/packages.json';

// Komponen Modal untuk Gallery
const GalleryModal = ({ 
  isOpen, 
  onClose, 
  images,
  initialIndex
}: {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
}) => {
  if (!isOpen) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialIndex,
    arrows: true,
    adaptiveHeight: true
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-4xl z-50 hover:text-gray-300 transition-colors"
          aria-label={useLanguage().t('closeGallery')}
        >
          &times;
        </button>
        
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} className="outline-none">
              <div className="flex justify-center items-center h-[80vh]">
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

const TopPackages: React.FC = () => {
  const { t, language } = useLanguage();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);

  const openGallery = (gallery: string[], index: number = 0) => {
    setCurrentGallery(gallery);
    setInitialSlideIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <section id="packages" className="py-16 bg-white">
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={currentGallery}
        initialIndex={initialSlideIndex}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('topPackages')}
          </h2>
          <p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('topPackagesDetail')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const title = language === 'id' ? pkg.titleId : language === 'en' ? pkg.titleEn : pkg.titleRu;
            const description = language === 'id' ? pkg.descriptionId : language === 'en' ? pkg.descriptionEn : pkg.descriptionRu;
            const galleryImages = pkg.gallery || [];

            return (
              <div 
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300"
                key={pkg.id}
              >
                <div className="relative">
                  <img
                    src={pkg.image}
                    alt={title}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => openGallery(
                      [pkg.image, ...galleryImages], 
                      0
                    )}
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">{description}</p>

                  <div className="flex flex-col space-y-1 mb-5 text-center">
                    <div className="flex items-center space-x-3 justify-center">
                      <span className="text-3xl font-extrabold text-blue-700 tracking-tight">
                        {pkg.price}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm font-medium text-black line-through decoration-2 decoration-red-500 decoration-solid">
                        {pkg.oldPrice}
                      </span>
                    </div>
                  </div>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white text-gray-800 py-1 px-3 rounded-xl font-medium text-lg border-2 border-blue-500 hover:bg-blue-50 transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {t('viewDetail')}
                    </a>
                  </div>
                </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopPackages;