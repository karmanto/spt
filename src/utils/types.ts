export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Promo {
  id: number;
  titleId: string;
  titleEn: string;
  titleRu?: string;
  descriptionId: string;
  descriptionEn: string;
  descriptionRu?: string;
  price: string;
  oldPrice: string;
  image: string;
  endDate: string;
  pdfUrl: string;
}

export interface PromoData {
  promos: Promo[];
}

export interface PromoCardProps {
  promo: Promo;
  countdown?: { days: number; hours: number; minutes: number; seconds: number };
}

export interface LanguageContent {
  en: string;
  id: string;
  ru: string;
}

export interface TourPackage {
  id: string;
  name: LanguageContent;
  duration: LanguageContent;
  location: LanguageContent;
  price: {
    adult: number;
    child: number;
    infant: number;
  };
  images: string[];
  overview: LanguageContent;
  highlights: LanguageContent[];
  itinerary: {
    day: number;
    title: LanguageContent;
    activities: LanguageContent[];
    meals: LanguageContent[];
    accommodation?: LanguageContent;
  }[];
  included: LanguageContent[];
  excluded: LanguageContent[];
  promotions?: {
    type: LanguageContent;
    discount: number;
    validUntil: string;
  };
  faqs: {
    question: LanguageContent;
    answer: LanguageContent;
  }[];
  originalPrice?: number;
}

export interface Advantage {
  id: number;
  titleKey: string;
  descriptionKey: string;
  iconName: string;
}

export interface HeroSlide {
  image: string;
  heroTitle: LanguageContent;
  heroSubtitle: LanguageContent;
}

export interface FAQItem {
  id: number;
  questionId: string;
  questionEn: string;
  questionRu?: string;
  answerId: string;
  answerEn: string;
  answerRu?: string;
}

export interface FAQData {
  faqs: FAQItem[];
}

export interface GalleryImage {
  id: number;
  url: string;
}

export interface GalleryCategory {
  id: number;
  nameId: string;
  nameEn: string;
  nameRu?: string;
  images: GalleryImage[];
}

export interface GalleryData {
  galleries: GalleryCategory[];
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  comment_id: string;
  comment_en: string;
  comment_ru?: string; 
  rating: number;
  image: string;
}
