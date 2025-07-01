import { Promo, PromoCreatePayload } from './types';

const API_URL = import.meta.env.VITE_API_URL + "/api";
interface FetchOptions extends RequestInit {
  body?: string;
}

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
  return response.json();
};

// ==== API Promo ====
export const getPromos = async () => fetchData<Promo[]>('promos');
export const getPromo = async (id: string) => fetchData<Promo>(`promos/${id}`);

export const addPromo = async (promo: PromoCreatePayload) => { // Menggunakan PromoCreatePayload di sini
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
