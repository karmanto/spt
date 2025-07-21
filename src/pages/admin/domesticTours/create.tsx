import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import { TourPackageCreatePayload, LanguageContent } from '../../../lib/types';
import { addTourPackage, uploadTourImage, getTourPackageDetail } from '../../../lib/api'; 
import { FaArrowLeft } from 'react-icons/fa';
import { Plus, Trash2, Image as ImageIcon, ChevronDown } from 'lucide-react';

const initialLanguageContent: LanguageContent = { en: '', id: '', ru: '' }; 

interface ImagePreviewItem {
  id?: number;
  file?: File;
  path: string;
  order: number;
  previewUrl: string;
  isNew: boolean;
}

export default function CreateTour() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 
  const copyFromId = searchParams.get('copyFrom'); 

  const [formData, setFormData] = useState<TourPackageCreatePayload>({
    name: { ...initialLanguageContent },
    tour_type: 2,
    duration: { ...initialLanguageContent },
    location: { ...initialLanguageContent },
    prices: [],
    starting_price: 0,
    overview: { ...initialLanguageContent },
    images: [],
    highlights: [],
    itineraries: [],
    included_excluded: [],
    faqs: [],
    cancellation_policies: [],
    tags: '',
    currency: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<ImagePreviewItem[]>([]);

  useEffect(() => {
    if (copyFromId) {
      const fetchCopiedTour = async () => {
        setLoading(true); 
        setError(null);
        try {
          const copiedTour = await getTourPackageDetail(copyFromId);

          const transformedData: TourPackageCreatePayload = {
            ...copiedTour,
            code: '', 
            order: undefined, 
            starting_price: Number(copiedTour.starting_price) || 0, 
            original_price: copiedTour.original_price ? Number(copiedTour.original_price) : undefined, 
            rate: copiedTour.rate ? Number(copiedTour.rate) : undefined, 
            prices: copiedTour.prices.map(p => ({
              service_type: p.service_type,
              price: p.price,
              description: p.description,
            })),
            highlights: copiedTour.highlights.map(h => ({
              description: h.description,
            })),
            itineraries: copiedTour.itineraries.map(it => ({
              day: it.day,
              title: it.title,
              activities: it.activities.map(act => ({
                time: act.time,
                description: act.description,
              })),
              meals: it.meals.map(meal => ({
                description: meal.description,
              })),
            })),
            included_excluded: copiedTour.included_excluded.map(ie => ({
              type: ie.type,
              description: ie.description,
            })),
            faqs: copiedTour.faqs.map(faq => ({
              question: faq.question,
              answer: faq.answer,
            })),
            cancellation_policies: copiedTour.cancellation_policies.map(cp => ({
              description: cp.description,
            })),
            images: copiedTour.images.map(img => ({
              path: img.path,
              order: img.order,
            })),
          };

          setFormData(transformedData);

          setImagePreviews(copiedTour.images.map(img => ({
            id: img.id, 
            path: img.path,
            order: img.order,
            previewUrl: img.path, 
            isNew: false,
          })));

          setSuccess('Konten tur domestik berhasil disalin. Silakan sesuaikan dan simpan.');
        } catch (err) {
          console.error('Gagal menyalin tur domestik:', err);
          setError('Gagal memuat data tur domestik yang akan disalin. Silakan coba lagi.');
        } finally {
          setLoading(false);
        }
      };

      fetchCopiedTour();
    }
  }, [copyFromId]); 

  useEffect(() => {
    return () => {
      imagePreviews.forEach(img => {
        if (img.isNew && img.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [imagePreviews]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child, grandChild] = name.split('.');
      if (grandChild) { 
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof TourPackageCreatePayload] as LanguageContent),
            [child]: {
              ...((prev[parent as keyof TourPackageCreatePayload] as any)[child] as LanguageContent),
              [grandChild]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof TourPackageCreatePayload] as LanguageContent),
            [child]: value,
          },
        }));
      }
    } else if (name === 'original_price' || name === 'rate' || name === 'starting_price') { 
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value) || undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleArrayItemPropertyChange = useCallback(
    (
      arrayName: keyof TourPackageCreatePayload,
      itemIndex: number,
      propertyName: string,
      value: string | number,
      lang?: 'en' | 'id' | 'ru'
    ) => {
      setFormData((prev) => {
        const array = [...(prev[arrayName] as any[])];
        if (lang) {
          array[itemIndex] = {
            ...array[itemIndex],
            [propertyName]: {
              ...(array[itemIndex][propertyName] as LanguageContent),
              [lang]: value,
            },
          };
        } else {
          array[itemIndex] = {
            ...array[itemIndex],
            [propertyName]: value,
          };
        }
        return { ...prev, [arrayName]: array };
      });
    },
    []
  );

  const handleItineraryActivityMealChange = useCallback(
    (
      dayIndex: number,
      type: 'activities' | 'meals',
      itemIndex: number,
      propertyName: string,
      value: string,
      lang?: 'en' | 'id' | 'ru'
    ) => {
      setFormData((prev) => {
        const newItineraries = [...prev.itineraries];
        const targetArray = newItineraries[dayIndex][type];
        if (lang) {
          (targetArray[itemIndex] as any)[propertyName][lang] = value;
        } else {
          (targetArray[itemIndex] as any)[propertyName] = value;
        }
        return { ...prev, itineraries: newItineraries };
      });
    },
    []
  );

  const addNestedItem = useCallback((field: keyof TourPackageCreatePayload, initialValue: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as any[]), initialValue],
    }));
  }, []);

  const removeNestedItem = useCallback((field: keyof TourPackageCreatePayload, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index),
    }));
  }, []);

  const handleImageFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImageItems: ImagePreviewItem[] = files.map((file, idx) => ({
        file,
        path: '', 
        order: imagePreviews.length + idx, 
        previewUrl: URL.createObjectURL(file),
        isNew: true,
      }));
      setImagePreviews((prev) => [...prev, ...newImageItems]);
      e.target.value = ''; 
    }
  }, [imagePreviews.length]);

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    setImagePreviews((prev) => {
      const removedImage = prev[indexToRemove];
      if (removedImage.isNew && removedImage.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(removedImage.previewUrl);
      }
      return prev.filter((_, index) => index !== indexToRemove);
    });
  }, []);

  const handleImageOrderChange = useCallback((index: number, newOrder: number) => {
    setImagePreviews((prev) => {
      const updatedImages = [...prev];
      const [movedItem] = updatedImages.splice(index, 1);
      updatedImages.splice(newOrder, 0, movedItem);
      return updatedImages.map((item, idx) => ({ ...item, order: idx }));
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const uploadedImagePaths: { path: string; order: number }[] = [];
        for (const img of imagePreviews) {
          if (img.isNew && img.file) {
            const uploaded = await uploadTourImage(img.file);
            uploadedImagePaths.push({ path: uploaded.path, order: img.order });
          } else {
            uploadedImagePaths.push({ path: img.path, order: img.order });
          }
        }

        const payload = {
          ...formData,
          prices: formData.prices.map(p => ({
            service_type: p.service_type,
            price: Number(p.price) || 0,
            description: p.description,
          })),
          starting_price: Number(formData.starting_price) || 0,
          original_price: formData.original_price ? Number(formData.original_price) : undefined,
          rate: formData.rate ? Number(formData.rate) : undefined,
          images: uploadedImagePaths.sort((a, b) => a.order - b.order),
          cancellation_policies: formData.cancellation_policies.map(cp => ({ description: cp.description })),
        };

        await addTourPackage(payload);
        setSuccess('tur domestik berhasil ditambahkan!');
        setFormData({ 
          name: { ...initialLanguageContent },
          tour_type: 2,
          duration: { ...initialLanguageContent },
          location: { ...initialLanguageContent },
          prices: [], 
          starting_price: 0, 
          overview: { ...initialLanguageContent },
          images: [],
          highlights: [],
          itineraries: [],
          included_excluded: [],
          faqs: [],
          cancellation_policies: [],
          tags: '',
          currency: '',
        });
        setImagePreviews([]); 
        navigate('/admin/domestic-tours'); 
      } catch (err: any) {
        console.error('Gagal menambahkan tur domestik:', err);
        setError(err.message || 'Terjadi kesalahan saat menambahkan tur domestik.');
      } finally {
        setLoading(false);
      }
    },
    [formData, imagePreviews, navigate]
  );

  const renderLanguageInput = (
    label: string,
    namePrefix: string,
    value: LanguageContent,
    isTextArea: boolean = false
  ) => (
    <div className="mb-4 p-5 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor={`${namePrefix}.en`} className="block text-xs font-medium text-gray-500">English</label>
          {isTextArea ? (
            <textarea
              id={`${namePrefix}.en`}
              name={`${namePrefix}.en`}
              value={value.en}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
              required
            />
          ) : (
            <input
              type="text"
              id={`${namePrefix}.en`}
              name={`${namePrefix}.en`}
              value={value.en}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
              required
            />
          )}
        </div>
        <div>
          <label htmlFor={`${namePrefix}.id`} className="block text-xs font-medium text-gray-500">Indonesian</label>
          {isTextArea ? (
            <textarea
              id={`${namePrefix}.id`}
              name={`${namePrefix}.id`}
              value={value.id || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
            />
          ) : (
            <input
              type="text"
              id={`${namePrefix}.id`}
              name={`${namePrefix}.id`}
              value={value.id || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
            />
          )}
        </div>
        <div>
          <label htmlFor={`${namePrefix}.ru`} className="block text-xs font-medium text-gray-500">Russian</label>
          {isTextArea ? (
            <textarea
              id={`${namePrefix}.ru`}
              name={`${namePrefix}.ru`}
              value={value.ru || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
            />
          ) : (
            <input
              type="text"
              id={`${namePrefix}.ru`}
              name={`${namePrefix}.ru`}
              value={value.ru || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-0">
        <div className="flex items-center mb-8">
          <button
            type="button"
            onClick={() => navigate('/admin/domestic-tours')}
            className="bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 flex items-center justify-center transition duration-300 ease-in-out mr-4 shadow-md"
            title="Kembali ke Daftar Tur Domestik"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Tur Domestik Baru</h1>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 shadow-md" role="alert">
            <strong className="font-bold">Berhasil!</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 shadow-md" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Kode Tur</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tipe Tur</label>
                <select
                  id="tags"
                  name="tags"
                  value={formData.tags || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                >
                  <option value="">Pilih Tipe Tur</option>
                  <option value="1_day_trip">Day Trip</option>
                  <option value="open_trip">Open Trip</option>
                  <option value="multi_day_trip">Multi-Day Trip</option>
                  <option value="private_service">Other</option>
                </select>
              </div>
            </div>

            {renderLanguageInput('Nama Tur', 'name', formData.name)}
            {renderLanguageInput('Durasi', 'duration', formData.duration)}
            {renderLanguageInput('Lokasi', 'location', formData.location)}
            {renderLanguageInput('Overview', 'overview', formData.overview, true)}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Harga</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Mata Uang</label>
                <input
                  type="text"
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="starting_price" className="block text-sm font-medium text-gray-700 mb-1">Harga Mulai Dari</label>
                <input
                  type="number"
                  id="starting_price"
                  name="starting_price"
                  value={formData.starting_price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-1">Harga Asli (opsional)</label>
                <input
                  type="number"
                  id="original_price"
                  name="original_price"
                  value={formData.original_price || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                />
              </div>
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">Rating (opsional, 0-5)</label>
                <input
                  type="number"
                  id="rate"
                  name="rate"
                  value={formData.rate || ''}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">Opsi Harga</h3>
            <div className="space-y-4">
              {formData.prices.map((priceOption, index) => (
                <details key={index} className="group border border-gray-200 rounded-lg shadow-sm bg-gray-50 animate-slide-up-fade-in" open>
                  <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors">
                    <h4 className="text-lg font-medium text-gray-800">Opsi Harga {index + 1}</h4>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeNestedItem('prices', index); }}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        title="Hapus Opsi Harga"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <ChevronDown className="h-5 w-5 text-gray-600 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Layanan</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor={`price-service-type-en-${index}`} className="block text-xs font-medium text-gray-500">English</label>
                          <input
                            type="text"
                            id={`price-service-type-en-${index}`}
                            value={priceOption.service_type.en}
                            onChange={(e) => handleArrayItemPropertyChange('prices', index, 'service_type', e.target.value, 'en')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="e.g., Adult"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor={`price-service-type-id-${index}`} className="block text-xs font-medium text-gray-500">Indonesian</label>
                          <input
                            type="text"
                            id={`price-service-type-id-${index}`}
                            value={priceOption.service_type.id || ''}
                            onChange={(e) => handleArrayItemPropertyChange('prices', index, 'service_type', e.target.value, 'id')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="e.g., Dewasa (opsional)"
                          />
                        </div>
                        <div>
                          <label htmlFor={`price-service-type-ru-${index}`} className="block text-xs font-medium text-gray-500">Russian</label>
                          <input
                            type="text"
                            id={`price-service-type-ru-${index}`}
                            value={priceOption.service_type.ru || ''}
                            onChange={(e) => handleArrayItemPropertyChange('prices', index, 'service_type', e.target.value, 'ru')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="e.g., Взрослый (opsional)"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor={`price-value-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                      <input
                        type="number"
                        id={`price-value-${index}`}
                        value={priceOption.price}
                        onChange={(e) => handleArrayItemPropertyChange('prices', index, 'price', Number(e.target.value))}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Harga</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor={`price-desc-en-${index}`} className="block text-xs font-medium text-gray-500">English</label>
                          <input
                            type="text"
                            id={`price-desc-en-${index}`}
                            value={priceOption.description.en}
                            onChange={(e) => handleArrayItemPropertyChange('prices', index, 'description', e.target.value, 'en')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="e.g., Per person"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor={`price-desc-id-${index}`} className="block text-xs font-medium text-gray-500">Indonesian</label>
                          <input
                            type="text"
                            id={`price-desc-id-${index}`}
                            value={priceOption.description.id || ''}
                            onChange={(e) => handleArrayItemPropertyChange('prices', index, 'description', e.target.value, 'id')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="e.g., Per orang (opsional)"
                          />
                        </div>
                        <div>
                          <label htmlFor={`price-desc-ru-${index}`} className="block text-xs font-medium text-gray-500">Russian</label>
                          <input
                            type="text"
                            id={`price-desc-ru-${index}`}
                            value={priceOption.description.ru || ''}
                            onChange={(e) => handleArrayItemPropertyChange('prices', index, 'description', e.target.value, 'ru')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="e.g., За человека (opsional)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addNestedItem('prices', { service_type: { ...initialLanguageContent }, price: 0, description: { ...initialLanguageContent } })}
              className="mt-6 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors flex items-center shadow-md"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah Opsi Harga
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Gambar Tur</h2>
            <p className="text-sm text-gray-600 mb-4">Pilih gambar untuk tur. Gambar akan diunggah ke server.</p>
            <div className="mb-6">
              <label htmlFor="image-upload" className="sr-only">Unggah Gambar Baru</label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary/90 transition-colors cursor-pointer"
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
                    <img
                      src={image.previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                        title="Hapus Gambar"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <label htmlFor={`image-order-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Urutan</label>
                      <input
                        type="number"
                        id={`image-order-${index}`}
                        value={image.order}
                        onChange={(e) => handleImageOrderChange(index, parseInt(e.target.value))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-1.5"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {imagePreviews.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 mb-6 bg-gray-50">
                <ImageIcon className="h-10 w-10 mb-3 text-gray-400" />
                <span className="text-lg font-medium">Belum ada gambar yang dipilih.</span>
                <span className="text-sm text-gray-400">Unggah gambar untuk tur Anda.</span>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Highlights</h2>
            <div className="space-y-4">
              {formData.highlights.map((highlight, index) => (
                <details key={index} className="group border border-gray-200 rounded-lg shadow-sm bg-gray-50 animate-slide-up-fade-in" open>
                  <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors">
                    <h3 className="text-lg font-medium text-gray-800">Highlight {index + 1}</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeNestedItem('highlights', index); }}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        title="Hapus Highlight"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <ChevronDown className="h-5 w-5 text-gray-600 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className="p-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Highlight</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor={`highlight-en-${index}`} className="block text-xs font-medium text-gray-500">English</label>
                        <input
                          type="text"
                          id={`highlight-en-${index}`}
                          value={highlight.description.en}
                          onChange={(e) => handleArrayItemPropertyChange('highlights', index, 'description', e.target.value, 'en')}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                          placeholder="English"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`highlight-id-${index}`} className="block text-xs font-medium text-gray-500">Indonesian</label>
                        <input
                          type="text"
                          id={`highlight-id-${index}`}
                          value={highlight.description.id || ''}
                          onChange={(e) => handleArrayItemPropertyChange('highlights', index, 'description', e.target.value, 'id')}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                          placeholder="Indonesian (opsional)"
                        />
                      </div>
                      <div>
                        <label htmlFor={`highlight-ru-${index}`} className="block text-xs font-medium text-gray-500">Russian</label>
                        <input
                          type="text"
                          id={`highlight-ru-${index}`}
                          value={highlight.description.ru || ''}
                          onChange={(e) => handleArrayItemPropertyChange('highlights', index, 'description', e.target.value, 'ru')}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                          placeholder="Russian (opsional)"
                        />
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addNestedItem('highlights', { description: { ...initialLanguageContent } })}
              className="mt-6 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors flex items-center shadow-md"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah Highlight
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Itinerary</h2>
            <div className="space-y-6">
              {formData.itineraries.map((itinerary, dayIndex) => (
                <details key={dayIndex} className="group border border-gray-300 rounded-lg shadow-md bg-gray-50 animate-slide-up-fade-in" open>
                  <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors">
                    <h3 className="text-lg font-medium text-gray-900">Urutan {itinerary.day}</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeNestedItem('itineraries', dayIndex); }}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        title="Hapus Urutan Itinerary"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <ChevronDown className="h-5 w-5 text-gray-600 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className="p-5 border-t border-gray-300 space-y-6">
                    <div className="mb-4">
                      <label htmlFor={`itinerary-day-${dayIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Nomor Urutan</label>
                      <input
                        type="number"
                        id={`itinerary-day-${dayIndex}`}
                        value={itinerary.day}
                        onChange={(e) => handleArrayItemPropertyChange('itineraries', dayIndex, 'day', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                        required
                      />
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Judul Urutan</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor={`itinerary-title-en-${dayIndex}`} className="block text-xs font-medium text-gray-500">English</label>
                          <input
                            type="text"
                            id={`itinerary-title-en-${dayIndex}`}
                            value={itinerary.title.en}
                            onChange={(e) => handleArrayItemPropertyChange('itineraries', dayIndex, 'title', e.target.value, 'en')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="English"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor={`itinerary-title-id-${dayIndex}`} className="block text-xs font-medium text-gray-500">Indonesian</label>
                          <input
                            type="text"
                            id={`itinerary-title-id-${dayIndex}`}
                            value={itinerary.title.id || ''}
                            onChange={(e) => handleArrayItemPropertyChange('itineraries', dayIndex, 'title', e.target.value, 'id')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="Indonesian (opsional)"
                          />
                        </div>
                        <div>
                          <label htmlFor={`itinerary-title-ru-${dayIndex}`} className="block text-xs font-medium text-gray-500">Russian</label>
                          <input
                            type="text"
                            id={`itinerary-title-ru-${dayIndex}`}
                            value={itinerary.title.ru || ''}
                            onChange={(e) => handleArrayItemPropertyChange('itineraries', dayIndex, 'title', e.target.value, 'ru')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="Russian (opsional)"
                          />
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-3">Aktivitas</h4>
                    <div className="space-y-4">
                      {itinerary.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col sm:flex-row sm:items-end gap-4">
                          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="sm:col-span-1">
                              <label htmlFor={`activity-time-${dayIndex}-${activityIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                              <input
                                type="text"
                                id={`activity-time-${dayIndex}-${activityIndex}`}
                                value={activity.time}
                                onChange={(e) => handleItineraryActivityMealChange(dayIndex, 'activities', activityIndex, 'time', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                placeholder="contoh: 08:00"
                                required
                              />
                            </div>
                            <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label htmlFor={`activity-desc-en-${dayIndex}-${activityIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (EN)</label>
                                <input
                                  type="text"
                                  id={`activity-desc-en-${dayIndex}-${activityIndex}`}
                                  value={activity.description.en}
                                  onChange={(e) => handleItineraryActivityMealChange(dayIndex, 'activities', activityIndex, 'description', e.target.value, 'en')}
                                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                  placeholder="English"
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor={`activity-desc-id-${dayIndex}-${activityIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (ID)</label>
                                <input
                                  type="text"
                                  id={`activity-desc-id-${dayIndex}-${activityIndex}`}
                                  value={activity.description.id || ''}
                                  onChange={(e) => handleItineraryActivityMealChange(dayIndex, 'activities', activityIndex, 'description', e.target.value, 'id')}
                                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                  placeholder="Indonesian (opsional)"
                                />
                              </div>
                              <div>
                                <label htmlFor={`activity-desc-ru-${dayIndex}-${activityIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (RU)</label>
                                <input
                                  type="text"
                                  id={`activity-desc-ru-${dayIndex}-${activityIndex}`}
                                  value={activity.description.ru || ''}
                                  onChange={(e) => handleItineraryActivityMealChange(dayIndex, 'activities', activityIndex, 'description', e.target.value, 'ru')}
                                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                  placeholder="Russian (opsional)"
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newItineraries = [...formData.itineraries!];
                              newItineraries[dayIndex].activities.splice(activityIndex, 1);
                              setFormData({ ...formData!, itineraries: newItineraries });
                            }}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-shrink-0"
                            title="Hapus Aktivitas"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newItineraries = [...formData.itineraries!];
                        newItineraries[dayIndex].activities.push({ time: '', description: { ...initialLanguageContent } });
                        setFormData({ ...formData!, itineraries: newItineraries });
                      }}
                      className="mt-4 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors flex items-center text-sm shadow-md"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Tambah Aktivitas
                    </button>

                    <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Makanan</h4>
                    <div className="space-y-4">
                      {itinerary.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col sm:flex-row sm:items-end gap-4">
                          <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label htmlFor={`meal-desc-en-${dayIndex}-${mealIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (EN)</label>
                              <input
                                type="text"
                                id={`meal-desc-en-${dayIndex}-${mealIndex}`}
                                value={meal.description.en}
                                onChange={(e) => handleItineraryActivityMealChange(dayIndex, 'meals', mealIndex, 'description', e.target.value, 'en')}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                placeholder="English"
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor={`meal-desc-id-${dayIndex}-${mealIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (ID)</label>
                              <input
                                type="text"
                                id={`meal-desc-id-${dayIndex}-${mealIndex}`}
                                value={meal.description.id || ''}
                                onChange={(e) => handleItineraryActivityMealChange(dayIndex, 'meals', mealIndex, 'description', e.target.value, 'id')}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                placeholder="Indonesian (opsional)"
                              />
                            </div>
                            <div>
                              <label htmlFor={`meal-desc-ru-${dayIndex}-${mealIndex}`} className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (RU)</label>
                              <input
                                type="text"
                                id={`meal-desc-ru-${dayIndex}-${mealIndex}`}
                                value={meal.description.ru || ''}
                                onChange={(e) => handleItineraryActivityMealChange(dayIndex, 'meals', mealIndex, 'description', e.target.value, 'ru')}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                                placeholder="Russian (opsional)"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newItineraries = [...formData.itineraries!];
                              newItineraries[dayIndex].meals.splice(mealIndex, 1);
                              setFormData({ ...formData!, itineraries: newItineraries });
                            }}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-shrink-0"
                            title="Hapus Makanan"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newItineraries = [...formData.itineraries!];
                        newItineraries[dayIndex].meals.push({ description: { ...initialLanguageContent } });
                        setFormData({ ...formData!, itineraries: newItineraries });
                      }}
                      className="mt-4 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors flex items-center text-sm shadow-md"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Tambah Makanan
                    </button>
                  </div>
                </details>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addNestedItem('itineraries', { day: (formData.itineraries?.length || 0) + 1, title: { ...initialLanguageContent }, activities: [], meals: [] })}
              className="mt-6 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors flex items-center shadow-md"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah Urutan Itinerary
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Termasuk & Tidak Termasuk</h2>
            <div className="space-y-4">
              {formData.included_excluded?.map((item, index) => (
                <details key={index} className="group border border-gray-200 rounded-lg shadow-sm bg-gray-50 animate-slide-up-fade-in" open>
                  <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors">
                    <h3 className="text-lg font-medium text-gray-800">Item {index + 1} ({item.type === 'included' ? 'Termasuk' : 'Tidak Termasuk'})</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeNestedItem('included_excluded', index); }}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        title="Hapus Item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <ChevronDown className="h-5 w-5 text-gray-600 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className="p-4 border-t border-gray-200">
                    <label htmlFor={`included-excluded-type-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                    <select
                      id={`included-excluded-type-${index}`}
                      value={item.type}
                      onChange={(e) => handleArrayItemPropertyChange('included_excluded', index, 'type', e.target.value as 'included' | 'excluded')}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                      required
                    >
                      <option value="included">Termasuk</option>
                      <option value="excluded">Tidak Termasuk</option>
                    </select>
                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Deskripsi</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor={`included-excluded-desc-en-${index}`} className="block text-xs font-medium text-gray-500">English</label>
                        <input
                          type="text"
                          id={`included-excluded-desc-en-${index}`}
                          value={item.description.en}
                          onChange={(e) => handleArrayItemPropertyChange('included_excluded', index, 'description', e.target.value, 'en')}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                          placeholder="English"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`included-excluded-desc-id-${index}`} className="block text-xs font-medium text-gray-500">Indonesian</label>
                        <input
                          type="text"
                          id={`included-excluded-desc-id-${index}`}
                          value={item.description.id || ''}
                          onChange={(e) => handleArrayItemPropertyChange('included_excluded', index, 'description', e.target.value, 'id')}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                          placeholder="Indonesian (opsional)"
                        />
                      </div>
                      <div>
                        <label htmlFor={`included-excluded-desc-ru-${index}`} className="block text-xs font-medium text-gray-500">Russian</label>
                        <input
                          type="text"
                          id={`included-excluded-desc-ru-${index}`}
                          value={item.description.ru || ''}
                          onChange={(e) => handleArrayItemPropertyChange('included_excluded', index, 'description', e.target.value, 'ru')}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                          placeholder="Russian (opsional)"
                        />
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addNestedItem('included_excluded', { type: 'included', description: { ...initialLanguageContent } })}
              className="mt-6 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors flex items-center shadow-md"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah Termasuk/Tidak Termasuk
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">FAQ</h2>
            <div className="space-y-4">
              {formData.faqs?.map((faq, index) => (
                <details key={index} className="group border border-gray-200 rounded-lg shadow-sm bg-gray-50 animate-slide-up-fade-in" open>
                  <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors">
                    <h3 className="text-lg font-medium text-gray-800">FAQ {index + 1}</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeNestedItem('faqs', index); }}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        title="Hapus FAQ"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <ChevronDown className="h-5 w-5 text-gray-600 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor={`faq-q-en-${index}`} className="block text-xs font-medium text-gray-500">English</label>
                          <input
                            type="text"
                            id={`faq-q-en-${index}`}
                            value={faq.question.en}
                            onChange={(e) => handleArrayItemPropertyChange('faqs', index, 'question', e.target.value, 'en')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="English"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor={`faq-q-id-${index}`} className="block text-xs font-medium text-gray-500">Indonesian</label>
                          <input
                            type="text"
                            id={`faq-q-id-${index}`}
                            value={faq.question.id || ''}
                            onChange={(e) => handleArrayItemPropertyChange('faqs', index, 'question', e.target.value, 'id')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="Indonesian (opsional)"
                          />
                        </div>
                        <div>
                          <label htmlFor={`faq-q-ru-${index}`} className="block text-xs font-medium text-gray-500">Russian</label>
                          <input
                            type="text"
                            id={`faq-q-ru-${index}`}
                            value={faq.question.ru || ''}
                            onChange={(e) => handleArrayItemPropertyChange('faqs', index, 'question', e.target.value, 'ru')}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="Russian (opsional)"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Jawaban</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor={`faq-a-en-${index}`} className="block text-xs font-medium text-gray-500">English</label>
                          <textarea
                            id={`faq-a-en-${index}`}
                            value={faq.answer.en}
                            onChange={(e) => handleArrayItemPropertyChange('faqs', index, 'answer', e.target.value, 'en')}
                            rows={3}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="English"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor={`faq-a-id-${index}`} className="block text-xs font-medium text-gray-500">Indonesian</label>
                          <textarea
                            id={`faq-a-id-${index}`}
                            value={faq.answer.id || ''}
                            onChange={(e) => handleArrayItemPropertyChange('faqs', index, 'answer', e.target.value, 'id')}
                            rows={3}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="Indonesian (opsional)"
                          />
                        </div>
                        <div>
                          <label htmlFor={`faq-a-ru-${index}`} className="block text-xs font-medium text-gray-500">Russian</label>
                          <textarea
                            id={`faq-a-ru-${index}`}
                            value={faq.answer.ru || ''}
                            onChange={(e) => handleArrayItemPropertyChange('faqs', index, 'answer', e.target.value, 'ru')}
                            rows={3}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                            placeholder="Russian (opsional)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addNestedItem('faqs', { question: { ...initialLanguageContent }, answer: { ...initialLanguageContent } })}
              className="mt-6 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors flex items-center shadow-md"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah FAQ
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Kebijakan Pembatalan</h2>
            <div className="space-y-4">
              {formData.cancellation_policies?.map((policy, index) => (
                <details key={index} className="group border border-gray-200 rounded-lg shadow-sm bg-gray-50 animate-slide-up-fade-in" open>
                  <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors">
                    <h3 className="text-lg font-medium text-gray-800">Kebijakan {index + 1}</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeNestedItem('cancellation_policies', index); }}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        title="Hapus Kebijakan"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <ChevronDown className="h-5 w-5 text-gray-600 group-open:rotate-180 transition-transform" />
                    </div>
                  </summary>
                  <div className="p-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Kebijakan</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor={`policy-desc-en-${index}`} className="block text-xs font-medium text-gray-500">English</label>
                        <textarea
                          id={`policy-desc-en-${index}`}
                          value={policy.description.en}
                          onChange={(e) => handleArrayItemPropertyChange('cancellation_policies', index, 'description', e.target.value, 'en')}
                          rows={3}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                          placeholder="English"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`policy-desc-id-${index}`} className="block text-xs font-medium text-gray-500">Indonesian</label>
                        <textarea
                          id={`policy-desc-id-${index}`}
                          value={policy.description.id || ''}
                          onChange={(e) => handleArrayItemPropertyChange('cancellation_policies', index, 'description', e.target.value, 'id')}
                          rows={3}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                          placeholder="Indonesian (opsional)"
                        />
                      </div>
                      <div>
                        <label htmlFor={`policy-desc-ru-${index}`} className="block text-xs font-medium text-gray-500">Russian</label>
                        <textarea
                          id={`policy-desc-ru-${index}`}
                          value={policy.description.ru || ''}
                          onChange={(e) => handleArrayItemPropertyChange('cancellation_policies', index, 'description', e.target.value, 'ru')}
                          rows={3}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                          placeholder="Russian (opsional)"
                        />
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addNestedItem('cancellation_policies', { description: { ...initialLanguageContent } })}
              className="mt-6 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors flex items-center shadow-md"
            >
              <Plus className="h-5 w-5 mr-2" /> Tambah Kebijakan Pembatalan
            </button>
          </section>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/domestic-tours')}
              className="px-8 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-8 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan Tur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
