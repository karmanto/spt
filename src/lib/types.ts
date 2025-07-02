export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Promo {
  id: number;
  title_id: string;
  title_en: string;
  title_ru: string;
  description_id: string;
  description_en: string;
  description_ru: string;
  price: string;
  old_price?: string;
  image: string; 
  end_date: string;
  pdf_url: string;
}

export interface PromoCreatePayload extends Omit<Promo, 'id' | 'image'> {
  image?: File; 
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
  rate?: string;
  images: string[];
  overview: LanguageContent;
  highlights: LanguageContent[];
  itinerary: {
    day: number;
    title: LanguageContent;
    activities: LanguageContent[];
    meals: LanguageContent[];
  }[];
  included: LanguageContent[];
  excluded: LanguageContent[];
  faqs: {
    question: LanguageContent;
    answer: LanguageContent;
  }[];
  originalPrice?: number;
  tags?: string;
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
