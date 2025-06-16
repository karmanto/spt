// types.ts
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

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface PromoCardProps {
  promo: Promo;
  countdown?: { days: number; hours: number; minutes: number; seconds: number };
}