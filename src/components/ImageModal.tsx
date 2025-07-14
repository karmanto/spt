import React, { useRef, useEffect } from 'react';
import Slider from 'react-slick';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ImageModalProps {
  images: { id: string; path: string; order?: number | null; }[];
  currentIndex: number;
  altText: string; 
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, currentIndex, altText, onClose, onNavigate }) => {
  const sliderRef = useRef<Slider>(null);
  const totalImages = images.length;

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(currentIndex, true); 
    }
  }, [currentIndex]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: currentIndex, 
    arrows: false, 
    swipeToSlide: true,
    draggable: true,
    beforeChange: (next: number) => {
      onNavigate(next); 
    },
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4" 
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-4xl z-20 md:top-0 md:-right-12 hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Close image viewer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative"> 
          <Slider ref={sliderRef} {...sliderSettings}>
            {images.map((image, index) => (
              <div key={image.id} className="relative flex justify-center items-center">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${image.path}`}
                  alt={`${altText} - Image ${index + 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
                />
              </div>
            ))}
          </Slider>
        </div>

        {totalImages > 1 && (
          <button
            className="absolute -left-12 top-1/2 transform -translate-y-1/2 text-white text-3xl hidden md:block hover:text-gray-300 transition-colors focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              sliderRef.current?.slickPrev();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {totalImages > 1 && (
          <button
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 text-white text-3xl hidden md:block hover:text-gray-300 transition-colors focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              sliderRef.current?.slickNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}

        {totalImages > 1 && (
          <div className="flex justify-center mt-4 space-x-8 md:hidden">
            <button
              className="text-white text-2xl hover:text-gray-300 transition-colors focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                sliderRef.current?.slickPrev();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="text-white text-2xl hover:text-gray-300 transition-colors focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                sliderRef.current?.slickNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
