import { Promo, PromoCreatePayload, TourPackage, TourPackageResponse, TourPackageCreatePayload, TourPackageUpdatePayload, LanguageContent, Blog, BlogCreatePayload, BlogUpdatePayload, BlogResponse } from './types';
import { handleAuthError } from './auth'; // Import fungsi handleAuthError
import { slugify } from './utils'; // Import slugify

const API_URL = import.meta.env.VITE_API_URL;
interface FetchOptions extends RequestInit {
  body?: string;
}

const safeJSONParse = <T>(jsonString: string | T): T | string => {
  if (typeof jsonString === 'string') {
    try {
      return JSON.parse(jsonString) as T;
    } catch (e) {
      console.warn("Failed to parse JSON string:", jsonString, e);
      return jsonString; 
    }
  }
  return jsonString; 
};

const parseTourPackageData = (tour: TourPackage): TourPackage => {
  const parsedTour = { ...tour };

  parsedTour.name = safeJSONParse<LanguageContent>(tour.name) as LanguageContent;
  parsedTour.duration = safeJSONParse<LanguageContent>(tour.duration) as LanguageContent;
  parsedTour.location = safeJSONParse<LanguageContent>(tour.location) as LanguageContent;
  parsedTour.overview = safeJSONParse<LanguageContent>(tour.overview) as LanguageContent;

  // Parse the new 'prices' array
  parsedTour.prices = tour.prices.map(p => ({
    ...p,
    service_type: safeJSONParse<LanguageContent>(p.service_type) as LanguageContent,
    description: safeJSONParse<LanguageContent>(p.description) as LanguageContent,
  }));

  parsedTour.highlights = tour.highlights.map(h => ({
    ...h,
    description: safeJSONParse<LanguageContent>(h.description) as LanguageContent
  }));

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

  parsedTour.included_excluded = tour.included_excluded.map(ie => ({
    ...ie,
    description: safeJSONParse<LanguageContent>(ie.description) as LanguageContent
  }));

  parsedTour.faqs = tour.faqs.map(faq => ({
    ...faq,
    question: safeJSONParse<LanguageContent>(faq.question) as LanguageContent,
    answer: safeJSONParse<LanguageContent>(faq.answer) as LanguageContent
  }));

  // Parse cancellation_policies
  parsedTour.cancellation_policies = tour.cancellation_policies.map(cp => ({
    ...cp,
    description: safeJSONParse<LanguageContent>(cp.description) as LanguageContent
  }));

  // Generate slug for URL
  parsedTour.slug = `${slugify(parsedTour.name.en)}-${tour.id}`;

  return parsedTour;
};

// New function to parse Blog data
const parseBlogData = (blog: Blog): Blog => {
  const parsedBlog = { ...blog };
  // Removed safeJSONParse for title and content fields as they are plain strings, not JSON strings.
  // The Blog interface already defines them as strings, so no parsing is needed.

  // Generate slug for URL
  parsedBlog.slug = `${slugify(parsedBlog.title_en)}-${blog.id}`;

  return parsedBlog;
};

// === Fungsi fetch untuk request JSON ===
export const fetchData = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token'); 
  if (token) { 
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    if (response.status === 401) { 
      handleAuthError();
      throw new Error('Unauthorized: Token expired or invalid.'); 
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    } else {
      const errorText = await response.text();
      throw new Error(`API error: ${response.statusText}. Response: ${errorText.substring(0, 200)}...`);
    }
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return null as T; 
  }

  return response.json();
};

// === Fungsi fetch untuk request multipart/form-data (upload file) ===
export const fetchMultipartData = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const headers: HeadersInit = {};
  const token = localStorage.getItem('token'); 
  if (token) { 
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    headers,
    ...options
  });

  if (!response.ok) {
    if (response.status === 401) { 
      handleAuthError();
      throw new Error('Unauthorized: Token expired or invalid.'); 
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    } else {
      const errorText = await response.text();
      throw new Error(`API error: ${response.statusText}. Response: ${errorText.substring(0, 200)}...`);
    }
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return null as T; 
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
  response.data = response.data.map(parseTourPackageData);
  return response;
};

export const getTourPackageDetail = async (id: string) => {
  const tour = await fetchData<TourPackage>(`packages/${id}`);
  return parseTourPackageData(tour);
};

export const addTourPackage = async (tour: TourPackageCreatePayload) => {
  const payloadToSend = {
    ...tour,
    name: JSON.stringify(tour.name),
    duration: JSON.stringify(tour.duration),
    location: JSON.stringify(tour.location),
    // New 'prices' array handling
    prices: tour.prices.map(p => ({
      service_type: JSON.stringify(p.service_type),
      price: p.price,
      description: JSON.stringify(p.description),
    })),
    starting_price: tour.starting_price, // New field
    original_price: tour.original_price,
    rate: tour.rate,
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
    cancellation_policies: tour.cancellation_policies.map(cp => ({
      description: JSON.stringify(cp.description)
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
    ...(tour.name && { name: JSON.stringify(tour.name) }),
    ...(tour.duration && { duration: JSON.stringify(tour.duration) }),
    ...(tour.location && { location: JSON.stringify(tour.location) }),
    // New 'prices' array handling for update
    ...(tour.prices && { prices: tour.prices.map(p => ({
      service_type: JSON.stringify(p.service_type),
      price: p.price,
      description: JSON.stringify(p.description),
    })) }),
    ...(tour.starting_price !== undefined && { starting_price: tour.starting_price }), // New field for update
    ...(tour.original_price !== undefined && { original_price: tour.original_price }),
    ...(tour.rate !== undefined && { rate: tour.rate }),
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
    ...(tour.cancellation_policies && { cancellation_policies: tour.cancellation_policies.map(cp => ({
      description: JSON.stringify(cp.description)
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

// Removed boostTourPackage
// export const boostTourPackage = async (id: number) => {
//   return fetchData<TourPackage>(`packages/${id}/boost-product`, {
//     method: 'POST',
//   });
// };

// New function to swap tour package order
export const swapTourOrder = async (firstPackageId: number, secondPackageId: number) => {
  return fetchData<void>(`packages/swap-order`, {
    method: 'POST',
    body: JSON.stringify({
      first_package_id: firstPackageId,
      second_package_id: secondPackageId,
    }),
  });
};

// ==== API Blog ====
export const getBlogs = async (params?: { per_page?: number; page?: number; search?: string; }) => {
  const query = new URLSearchParams();
  if (params?.per_page) query.append('per_page', params.per_page.toString());
  if (params?.page) query.append('page', params.page.toString());
  if (params?.search) query.append('search', params.search); 

  const queryString = query.toString();
  const endpoint = `blogs${queryString ? `?${queryString}` : ''}`;
  const response = await fetchData<BlogResponse>(endpoint);
  response.data = response.data.map(parseBlogData);
  return response;
};

export const getBlogDetail = async (id: string) => {
  const blog = await fetchData<Blog>(`blogs/${id}`);
  return parseBlogData(blog);
};

export const addBlog = async (blog: BlogCreatePayload) => {
  const formData = new FormData();
  formData.append('title_id', blog.title_id);
  formData.append('title_en', blog.title_en);
  formData.append('title_ru', blog.title_ru);
  formData.append('content_id', blog.content_id);
  formData.append('content_en', blog.content_en);
  formData.append('content_ru', blog.content_ru);
  formData.append('posting_date', blog.posting_date);
  if (blog.image) {
    formData.append('image', blog.image);
  }
  return fetchMultipartData<Blog>('blogs', { method: 'POST', body: formData });
};

export const updateBlog = async (id: number, blog: BlogUpdatePayload) => {
  const formData = new FormData();

  if (blog.title_id) formData.append('title_id', blog.title_id);
  if (blog.title_en) formData.append('title_en', blog.title_en);
  if (blog.title_ru) formData.append('title_ru', blog.title_ru);
  if (blog.content_id) formData.append('content_id', blog.content_id);
  if (blog.content_en) formData.append('content_en', blog.content_en);
  if (blog.content_ru) formData.append('content_ru', blog.content_ru);
  if (blog.posting_date) formData.append('posting_date', blog.posting_date);
  if (blog.image) {
    formData.append('image', blog.image);
  }

  formData.append('_method', 'PUT'); // Laravel expects _method for PUT with form-data

  return fetchMultipartData<Blog>(`blogs/${id}`, {
    method: 'POST', // Use POST with _method for file uploads
    body: formData,
  });
};

export const deleteBlog = async (id: number) =>
  fetchData<void>(`blogs/${id}`, { method: 'DELETE' });
