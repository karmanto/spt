import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

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
  const [canPan, setCanPan] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

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
    beforeChange: (_: number, newIndex: number) => {
      onNavigate(newIndex);
      if (transformRef.current) {
        transformRef.current.resetTransform();
        setCanPan(false);
      }
    },
  };

  if (!images.length) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        <Slider ref={sliderRef} {...sliderSettings}>
          {images.map((image, idx) => (
            <div key={image.id} className="relative flex justify-center items-center">
              <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={5}
                limitToBounds={true}
                doubleClick={{ disabled: false, mode: canPan ? "reset" : "zoomIn" }}
                pinch={{ disabled: true }}
                wheel={{ disabled: true }}
                
                panning={{
                  disabled: !canPan,
                  allowLeftClickPan: true,
                  allowRightClickPan: true,
                  wheelPanning: false,
                }}

                onZoomStop={(ref) => {
                  setCanPan(ref.state.scale > 1);
                }}

                onTransformed={(ref) => {
                  setCanPan(ref.state.scale > 1);
                }}
              >
                <TransformComponent>
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${image.path}`}
                    alt={`${altText} — Image ${idx + 1}`}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-xl cursor-grab"
                    style={{ touchAction: 'none' }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageModal;
