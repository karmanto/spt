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
  descriptionId: string;
  descriptionEn: string;
  price: string;
  oldPrice: string;
  image: string;
  remaining: number;
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