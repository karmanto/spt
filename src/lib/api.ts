import { Promo, PromoCreatePayload, TourPackage, TourPackageResponse, TourPackageCreatePayload, TourPackageUpdatePayload, LanguageContent, PriceDetails } from './types';

const API_URL = import.meta.env.VITE_API_URL + "/api";
interface FetchOptions extends RequestInit {
  body?: string;
}

// Helper function to safely parse JSON strings
const safeJSONParse = <T>(jsonString: string | T): T | string => {
  if (typeof jsonString === 'string') {
    try {
      return JSON.parse(jsonString) as T;
    } catch (e) {
      console.warn("Failed to parse JSON string:", jsonString, e);
      return jsonString; // Return original string if parsing fails
    }
  }
  return jsonString; // Return as is if not a string
};

// Helper function to parse a single TourPackage object
const parseTourPackageData = (tour: TourPackage): TourPackage => {
  const parsedTour = { ...tour };

  // Parse LanguageContent fields
  parsedTour.name = safeJSONParse<LanguageContent>(tour.name) as LanguageContent;
  parsedTour.duration = safeJSONParse<LanguageContent>(tour.duration) as LanguageContent;
  parsedTour.location = safeJSONParse<LanguageContent>(tour.location) as LanguageContent;
  parsedTour.overview = safeJSONParse<LanguageContent>(tour.overview) as LanguageContent;

  // Parse price field
  parsedTour.price = safeJSONParse<PriceDetails>(tour.price) as PriceDetails;

  // Parse highlights
  parsedTour.highlights = tour.highlights.map(h => ({
    ...h,
    description: safeJSONParse<LanguageContent>(h.description) as LanguageContent
  }));

  // Parse itineraries and their nested activities/meals
  parsedTour.itineraries = tour.itineraries.map(it => ({
    ...it,
    title: safeJSONParse<LanguageContent>(it.title) as LanguageContent,
    activities: it.activities.map(act => ({
      ...act,
      description: safeJSONParse<LanguageContent>(act.description) as LanguageContent
    })),
    meals: it.meals.map(meal => ({
      ...meal,
      description: safeJSONParse<LanguageContent>(meal.description) as LanguageContent
    }))
  }));

  // Parse included_excluded
  parsedTour.included_excluded = tour.included_excluded.map(ie => ({
    ...ie,
    description: safeJSONParse<LanguageContent>(ie.description) as LanguageContent
  }));

  // Parse faqs
  parsedTour.faqs = tour.faqs.map(faq => ({
    ...faq,
    question: safeJSONParse<LanguageContent>(faq.question) as LanguageContent,
    answer: safeJSONParse<LanguageContent>(faq.answer) as LanguageContent
  }));

  return parsedTour;
};

// === Fungsi fetch untuk request JSON ===
export const fetchData = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (options.method && options.method !== 'GET') {
    headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers,
    ...options
  });
  if (!response.ok) {
    // Try to parse error as JSON, fallback to text if not JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    } else {
      const errorText = await response.text();
      throw new Error(`API error: ${response.statusText}. Response: ${errorText.substring(0, 200)}...`);
    }
  }
  return response.json();
};

// === Fungsi fetch untuk request multipart/form-data (upload file) ===
export const fetchMultipartData = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  // Jangan set Content-Type karena browser akan mengatur boundary-nya secara otomatis
  const headers: HeadersInit = {};
  if (options.method && options.method !== 'GET') {
    headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers,
    ...options
  });
  if (!response.ok) {
    // Try to parse error as JSON, fallback to text if not JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    } else {
      const errorText = await response.text();
      throw new Error(`API error: ${response.statusText}. Response: ${errorText.substring(0, 200)}...`);
    }
  }
  return response.json();
};

// ==== API Promo ====
export const getPromos = async () => fetchData<Promo[]>('promos');
export const getPromo = async (id: string) => fetchData<Promo>(`promos/${id}`);

export const addPromo = async (promo: PromoCreatePayload) => { 
  const formData = new FormData();
  formData.append('title_id', promo.title_id);
  formData.append('title_en', promo.title_en);
  formData.append('title_ru', promo.title_ru);
  formData.append('description_id', promo.description_id);
  formData.append('description_en', promo.description_en);
  formData.append('description_ru', promo.description_ru);
  formData.append('price', promo.price);
  if (promo.old_price) {
    formData.append('old_price', promo.old_price);
  }
  formData.append('end_date', promo.end_date);
  formData.append('pdf_url', promo.pdf_url);
  if (promo.image) {
    formData.append('image', promo.image);
  }
  return fetchMultipartData<Promo>('promos', { method: 'POST', body: formData });
};

export const updatePromo = async (
  id: number,
  promo: Partial<Omit<Promo, 'id' | 'image'>> & { image?: File }) => {
  const formData = new FormData();

  if (promo.title_id)       formData.append('title_id', promo.title_id);
  if (promo.title_en)       formData.append('title_en', promo.title_en);
  if (promo.title_ru)       formData.append('title_ru', promo.title_ru);
  if (promo.description_id) formData.append('description_id', promo.description_id);
  if (promo.description_en) formData.append('description_en', promo.description_en);
  if (promo.description_ru) formData.append('description_ru', promo.description_ru);
  if (promo.price)         formData.append('price', promo.price);
  if (promo.old_price)      formData.append('old_price', promo.old_price);
  if (promo.end_date) formData.append('end_date', promo.end_date);
  if (promo.pdf_url)  formData.append('pdf_url', promo.pdf_url);
  if (promo.image) {
    formData.append('image', promo.image);
  }

  formData.append('_method', 'PUT');

  return fetchMultipartData<Promo>(`promos/${id}`, {
    method: 'POST',
    body: formData,
  });
};

export const deletePromo = async (id: number) =>
  fetchData<void>(`promos/${id}`, { method: 'DELETE' });

// ==== API Tour Packages ====
export const getTourPackages = async (params?: { per_page?: number; page?: number; min_rate?: number; search?: string; tags?: string; }) => {
  const query = new URLSearchParams();
  if (params?.per_page) query.append('per_page', params.per_page.toString());
  if (params?.page) query.append('page', params.page.toString());
  if (params?.min_rate) query.append('min_rate', params.min_rate.toString());
  if (params?.search) query.append('search', params.search); 
  if (params?.tags && params.tags !== 'all') { 
    query.append('tags', params.tags === 'other' ? 'private_service' : params.tags); 
  }

  const queryString = query.toString();
  const endpoint = `packages${queryString ? `?${queryString}` : ''}`;
  const response = await fetchData<TourPackageResponse>(endpoint);
  // Parse each tour package in the response data
  response.data = response.data.map(parseTourPackageData);
  return response;
};

export const getTourPackageDetail = async (id: string) => {
  const tour = await fetchData<TourPackage>(`packages/${id}`);
  // Parse the single tour package
  return parseTourPackageData(tour);
};

export const addTourPackage = async (tour: TourPackageCreatePayload) => {
  const payloadToSend = {
    ...tour,
    name: JSON.stringify(tour.name),
    duration: JSON.stringify(tour.duration),
    location: JSON.stringify(tour.location),
    price: JSON.stringify(tour.price),
    overview: JSON.stringify(tour.overview),
    highlights: tour.highlights.map(h => ({
      description: JSON.stringify(h.description)
    })),
    itineraries: tour.itineraries.map(it => ({
      day: it.day,
      title: JSON.stringify(it.title),
      activities: it.activities.map(act => ({
        time: act.time,
        description: JSON.stringify(act.description)
      })),
      meals: it.meals.map(meal => ({
        description: JSON.stringify(meal.description)
      })),
    })),
    included_excluded: tour.included_excluded.map(ie => ({
      type: ie.type,
      description: JSON.stringify(ie.description)
    })),
    faqs: tour.faqs.map(faq => ({
      question: JSON.stringify(faq.question),
      answer: JSON.stringify(faq.answer)
    })),
  };

  return fetchData<TourPackage>('packages', {
    method: 'POST',
    body: JSON.stringify(payloadToSend),
  });
};

export const updateTourPackage = async (id: number, tour: TourPackageUpdatePayload) => {
  const payloadToSend = {
    ...tour,
    // Only stringify if the field exists in the payload
    ...(tour.name && { name: JSON.stringify(tour.name) }),
    ...(tour.duration && { duration: JSON.stringify(tour.duration) }),
    ...(tour.location && { location: JSON.stringify(tour.location) }),
    ...(tour.price && { price: JSON.stringify(tour.price) }),
    ...(tour.overview && { overview: JSON.stringify(tour.overview) }),
    ...(tour.highlights && { highlights: tour.highlights.map(h => ({
      description: JSON.stringify(h.description)
    })) }),
    ...(tour.itineraries && { itineraries: tour.itineraries.map(it => ({
      day: it.day,
      title: JSON.stringify(it.title),
      activities: it.activities.map(act => ({
        time: act.time,
        description: JSON.stringify(act.description)
      })),
      meals: it.meals.map(meal => ({
        description: JSON.stringify(meal.description)
      })),
    })) }),
    ...(tour.included_excluded && { included_excluded: tour.included_excluded.map(ie => ({
      type: ie.type,
      description: JSON.stringify(ie.description)
    })) }),
    ...(tour.faqs && { faqs: tour.faqs.map(faq => ({
      question: JSON.stringify(faq.question),
      answer: JSON.stringify(faq.answer)
    })) }),
  };

  return fetchData<TourPackage>(`packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payloadToSend),
  });
};

export const deleteTourPackage = async (id: number) => {
  return fetchData<void>(`packages/${id}`, {
    method: 'DELETE',
  });
};

export const uploadTourImage = async (imageFile: File): Promise<{ path: string; full_url: string }> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  return fetchMultipartData<{ path: string; full_url: string }>('packages/upload-image', {
    method: 'POST',
    body: formData,
  });
};
