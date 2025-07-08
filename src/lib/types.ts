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
  id?: string;
  ru?: string;
}

// New interfaces for TourPackage nested data based on API response
export interface TourImage {
  id: number;
  imageable_type: string;
  imageable_id: number;
  path: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface TourHighlight {
  id: number;
  package_id: number;
  description: LanguageContent;
  created_at: string;
  updated_at: string;
}

export interface TourActivity {
  id: number;
  itinerary_id: number;
  time: string;
  description: LanguageContent;
  created_at: string;
  updated_at: string;
}

export interface TourMeal {
  id: number;
  itinerary_id: number;
  description: LanguageContent;
  created_at: string;
  updated_at: string;
}

export interface TourItinerary {
  id: number;
  package_id: number;
  day: number;
  title: LanguageContent;
  created_at: string;
  updated_at: string;
  activities: TourActivity[];
  meals: TourMeal[];
}

export interface TourIncludedExcluded {
  id: number;
  package_id: number;
  type: 'included' | 'excluded';
  description: LanguageContent;
  created_at: string;
  updated_at: string;
}

export interface TourFAQ {
  id: number;
  package_id: number;
  question: LanguageContent;
  answer: LanguageContent;
  created_at: string;
  updated_at: string;
}

// New interface for Tour Cancellation Policy
export interface TourCancellationPolicy {
  id: number;
  package_id: number; // Optional, if linked to package in DB
  description: LanguageContent;
  created_at: string;
  updated_at: string;
}

// Define the new structure for tour price options
export interface TourPriceOption {
  id?: number; // Optional, if coming from DB with an ID
  service_type: LanguageContent; // e.g., "Adult", "Child", "Private Tour"
  price: number;
  description: LanguageContent; // e.g., "Per person", "Minimum 2 pax"
  created_at?: string;
  updated_at?: string;
}

// Updated TourPackage interface to match API response
export interface TourPackage {
  id: number;
  code?: string;
  name: LanguageContent;
  duration: LanguageContent;
  location: LanguageContent;
  prices: TourPriceOption[]; // Changed from 'price' to 'prices' array
  starting_price: string; // New field for "harga mulai dari"
  original_price?: string; // API returns as string, keep for potential discount display
  rate?: string;
  images: TourImage[];
  overview: LanguageContent;
  highlights: TourHighlight[];
  itineraries: TourItinerary[];
  included_excluded: TourIncludedExcluded[];
  faqs: TourFAQ[];
  cancellation_policies: TourCancellationPolicy[];
  tags?: string;
  created_at: string;
  updated_at: string;
}

// New interface for the API response wrapper for tour lists
export interface TourPackageResponse {
  data: TourPackage[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// Payload for creating a new TourPackage
export interface TourPackageCreatePayload {
  code?: string;
  name: LanguageContent;
  duration: LanguageContent;
  location: LanguageContent;
  prices: { // New structure for prices
    service_type: LanguageContent;
    price: number;
    description: LanguageContent;
  }[];
  starting_price: number; // Assuming number for input, API might convert to string
  original_price?: number; // Assuming number for input, API might convert to string
  rate?: number; // Assuming number for input, API might convert to string
  images: { path: string; order: number }[]; // For payload, sending paths
  overview: LanguageContent;
  highlights: { description: LanguageContent }[]; // For payload, only description
  itineraries: {
    day: number;
    title: LanguageContent;
    activities: { time: string; description: LanguageContent }[];
    meals: { description: LanguageContent }[];
  }[];
  included_excluded: { type: 'included' | 'excluded'; description: LanguageContent }[];
  faqs: { question: LanguageContent; answer: LanguageContent }[];
  cancellation_policies: { description: LanguageContent }[];
  tags?: string;
}

// Payload for updating a TourPackage (all fields optional)
export interface TourPackageUpdatePayload extends Partial<TourPackageCreatePayload> {}

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
