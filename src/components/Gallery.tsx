import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Gallery: React.FC = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/9482125/pexels-photo-9482125.jpeg?auto=compress&cs=tinysrgb&w=1600',
      alt: 'James Bond Island',
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/3538245/pexels-photo-3538245.jpeg?auto=compress&cs=tinysrgb&w=1600',
      alt: 'Phuket Beach',
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1600',
      alt: 'Thai Temple',
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/2506920/pexels-photo-2506920.jpeg?auto=compress&cs=tinysrgb&w=1600',
      alt: 'Bangkok Skyline',
    }
  ];

  const openLightbox = (src: string) => {
    setSelectedImage(src);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={image.id}
              className="overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={index * 50}
              onClick={() => openLightbox(image.src)}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={closeLightbox}
          >
            <div className="relative max-w-4xl max-h-screen p-4">
              <button 
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={closeLightbox}
              >
                &times;
              </button>
              <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;