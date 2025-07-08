import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, altText, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 backdrop-blur-sm"
      onClick={onClose} 
    >
      <div
        className="relative max-w-full max-h-full bg-surface rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 scale-95 animate-fade-in"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-gray-800 bg-opacity-50 rounded-full p-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Close image viewer"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-full max-h-[90vh] object-contain" 
        />
      </div>
    </div>
  );
};

export default ImageModal;
