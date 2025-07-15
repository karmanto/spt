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

export interface TourCancellationPolicy {
  id: number;
  package_id: number; 
  description: LanguageContent;
  created_at: string;
  updated_at: string;
}

export interface TourPriceOption {
  id?: number; 
  service_type: LanguageContent; 
  price: number;
  description: LanguageContent; 
  created_at?: string;
  updated_at?: string;
}

export interface TourPackage {
  id: number;
  code?: string;
  name: LanguageContent;
  duration: LanguageContent;
  location: LanguageContent;
  prices: TourPriceOption[]; 
  starting_price: string; 
  original_price?: string; 
  rate?: string;
  images: TourImage[];
  overview: LanguageContent;
  highlights: TourHighlight[];
  itineraries: TourItinerary[];
  included_excluded: TourIncludedExcluded[];
  faqs: TourFAQ[];
  cancellation_policies: TourCancellationPolicy[];
  tags?: string;
  order?: number; 
  created_at: string;
  updated_at: string;
}

export interface TourPackageResponse {
  data: TourPackage[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface TourPackageCreatePayload {
  code?: string;
  name: LanguageContent;
  duration: LanguageContent;
  location: LanguageContent;
  prices: { 
    service_type: LanguageContent;
    price: number;
    description: LanguageContent;
  }[];
  starting_price: number; 
  original_price?: number; 
  rate?: number; 
  images: { path: string; order: number }[]; 
  overview: LanguageContent;
  highlights: { description: LanguageContent }[]; 
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
  order?: number;
}

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

export interface OutletContext {
  searchTerm: string;
  selectedCategory: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
}

export interface BookingFormProps {
  tour: TourPackage;
}

export interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export interface HeaderProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export interface ImageModalProps {
  images: { id: string; path: string; order?: number | null; }[];
  currentIndex: number;
  altText: string; 
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export interface ItineraryDocumentProps {
  tour: TourPackage;
}

export interface TourCardProps {
  tour: TourPackage;
  currentPage: number; 
}

export interface TourFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

// New interfaces for Blog
export interface BlogImage {
  id: number;
  imageable_type: string;
  imageable_id: number;
  path: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: number;
  name: LanguageContent;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: LanguageContent;
  content: LanguageContent;
  image: string; // URL of the main image
  category_id: number;
  category?: BlogCategory; // Optional, can be eager loaded
  created_at: string;
  updated_at: string;
}

export interface BlogPostResponse {
  data: BlogPost[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface BlogPostCreatePayload {
  title: LanguageContent;
  content: LanguageContent;
  image?: File; // For file upload
  category_id: number;
}

export interface BlogPostUpdatePayload extends Partial<BlogPostCreatePayload> {
  _method?: 'PUT'; // For Laravel form data PUT simulation
}

export interface BlogCardProps {
  post: BlogPost;
}
