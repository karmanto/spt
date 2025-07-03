import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TourPackageUpdatePayload, LanguageContent } from '../../../lib/types';
import { getTourPackageDetail, updateTourPackage, uploadTourImage } from '../../../lib/api';
import { FaArrowLeft } from 'react-icons/fa';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

const initialLanguageContent: LanguageContent = { en: '', id: '', ru: '' };

interface ImagePreviewItem {
  id?: number; 
  file?: File; 
  path: string; 
  order: number;
  previewUrl: string; 
  isNew: boolean; 
}

export default function EditTour() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TourPackageUpdatePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<ImagePreviewItem[]>([]);

  useEffect(() => {
    if (id) {
      fetchTourData(id);
    }
  }, [id]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(img => {
        if (img.isNew && img.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [imagePreviews]);

  const fetchTourData = useCallback(async (tourId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTourPackageDetail(tourId);
      setFormData({
        code: data.code || '',
        name: data.name,
        duration: data.duration,
        location: data.location,
        price: data.price,
        original_price: data.original_price ? parseFloat(data.original_price) : undefined,
        rate: data.rate ? parseFloat(data.rate) : undefined,
        overview: data.overview,
        highlights: data.highlights.map(h => ({ description: h.description })),
        itineraries: data.itineraries.map(it => ({
          day: it.day,
          title: it.title,
          activities: it.activities.map(act => ({ time: act.time, description: act.description })),
          meals: it.meals.map(meal => ({ description: meal.description })),
        })),
        included_excluded: data.included_excluded.map(ie => ({ type: ie.type, description: ie.description })),
        faqs: data.faqs.map(faq => ({ question: faq.question, answer: faq.answer })),
        tags: data.tags || '',
      });

      setImagePreviews(data.images.map(img => ({
        id: img.id,
        path: img.path,
        order: img.order,
        previewUrl: `${import.meta.env.VITE_API_URL}${img.path}`, 
        isNew: false,
      })).sort((a, b) => a.order - b.order)); 
    } catch (err) {
      console.error('Gagal mengambil data tur:', err);
      setError('Gagal memuat data tur untuk diedit. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!formData) return;

    if (name.includes('.')) {
      const [parent, child, grandChild] = name.split('.');
      if (grandChild) { 
        setFormData((prev) => ({
          ...prev!,
          [parent]: {
            ...(prev![parent as keyof TourPackageUpdatePayload] as LanguageContent),
            [child]: {
              ...((prev![parent as keyof TourPackageUpdatePayload] as any)[child] as LanguageContent),
              [grandChild]: value,
            },
          },
        }));
      } else { 
        setFormData((prev) => ({
          ...prev!,
          [parent]: {
            ...(prev![parent as keyof TourPackageUpdatePayload] as LanguageContent),
            [child]: value,
          },
        }));
      }
    } else if (name.includes('price.')) {
      const priceKey = name.split('.')[1] as 'adult' | 'child' | 'infant';
      setFormData((prev) => ({
        ...prev!,
        price: {
          ...prev!.price!,
          [priceKey]: parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev!, [name]: value }));
    }
  }, [formData]);

  const handleNestedArrayChange = useCallback(
    (
      index: number,
      field: keyof TourPackageUpdatePayload,
      subField: string,
      value: string,
      lang?: 'en' | 'id' | 'ru',
      grandChildField?: string
    ) => {
      setFormData((prev) => {
        if (!prev) return null;
        const array = [...(prev[field] as any[])];
        if (lang) {
          if (grandChildField) { 
            array[index] = {
              ...array[index],
              [subField]: {
                ...(array[index][subField] as any),
                [grandChildField]: {
                  ...(array[index][subField][grandChildField] as LanguageContent),
                  [lang]: value,
                },
              },
            };
          } else { 
            array[index] = {
              ...array[index],
              [subField]: {
                ...(array[index][subField] as LanguageContent),
                [lang]: value,
              },
            };
          }
        } else { 
          array[index] = {
            ...array[index],
            [subField]: value,
          };
        }
        return { ...prev, [field]: array };
      });
    },
    []
  );

  const addNestedItem = useCallback((field: keyof TourPackageUpdatePayload, initialValue: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: [...(prev[field] as any[]), initialValue],
      };
    });
  }, []);

  const removeNestedItem = useCallback((field: keyof TourPackageUpdatePayload, index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: (prev[field] as any[]).filter((_, i) => i !== index),
      };
    });
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
      if (!id || !formData) return;

      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const finalImagesPayload: { path: string; order: number }[] = [];

        for (const img of imagePreviews) {
          if (img.isNew && img.file) {
            const uploaded = await uploadTourImage(img.file);
            finalImagesPayload.push({ path: uploaded.path, order: img.order });
          } else if (!img.isNew) {
            finalImagesPayload.push({ path: img.path, order: img.order });
          }
        }

        const payload = {
          ...formData,
          price: {
            adult: Number(formData.price?.adult),
            child: Number(formData.price?.child),
            infant: Number(formData.price?.infant),
          },
          original_price: formData.original_price ? Number(formData.original_price) : undefined,
          rate: formData.rate ? Number(formData.rate) : undefined,
          images: finalImagesPayload.sort((a, b) => a.order - b.order),  
        };

        await updateTourPackage(parseInt(id), payload);
        setSuccess('Tur berhasil diperbarui!');
        navigate('/admin/tours');
      } catch (err: any) {
        console.error('Gagal memperbarui tur:', err);
        setError(err.message || 'Terjadi kesalahan saat memperbarui tur.');
      } finally {
        setLoading(false);
      }
    },
    [id, formData, imagePreviews, navigate]
  );

  const renderLanguageInput = (
    label: string,
    namePrefix: string,
    value: LanguageContent | undefined,
    isTextArea: boolean = false
  ) => (
    <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div>
        <label htmlFor={`${namePrefix}.en`} className="block text-xs font-medium text-gray-500">English</label>
        {isTextArea ? (
          <textarea
            id={`${namePrefix}.en`}
            name={`${namePrefix}.en`}
            value={value?.en || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        ) : (
          <input
            type="text"
            id={`${namePrefix}.en`}
            name={`${namePrefix}.en`}
            value={value?.en || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        )}
      </div>
      <div className="mt-2">
        <label htmlFor={`${namePrefix}.id`} className="block text-xs font-medium text-gray-500">Indonesian</label>
        {isTextArea ? (
          <textarea
            id={`${namePrefix}.id`}
            name={`${namePrefix}.id`}
            value={value?.id || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        ) : (
          <input
            type="text"
            id={`${namePrefix}.id`}
            name={`${namePrefix}.id`}
            value={value?.id || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        )}
      </div>
      <div className="mt-2">
        <label htmlFor={`${namePrefix}.ru`} className="block text-xs font-medium text-gray-500">Russian</label>
        {isTextArea ? (
          <textarea
            id={`${namePrefix}.ru`}
            name={`${namePrefix}.ru`}
            value={value?.ru || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        ) : (
          <input
            type="text"
            id={`${namePrefix}.ru`}
            name={`${namePrefix}.ru`}
            value={value?.ru || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center text-gray-600">
        Memuat data tur...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center text-gray-600">
        Data tur tidak ditemukan atau gagal dimuat.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate('/admin/tours')}
            className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 flex items-center justify-center transition duration-300 ease-in-out mr-4"
            title="Kembali ke Daftar Tur"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Tur: {formData.name?.id || formData.name?.en}</h1>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Berhasil!</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Dasar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Kode Tur</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (pisahkan dengan koma)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="contoh: adventure,beach,family"
              />
            </div>
          </div>

          {renderLanguageInput('Nama Tur', 'name', formData.name)}
          {renderLanguageInput('Durasi', 'duration', formData.duration)}
          {renderLanguageInput('Lokasi', 'location', formData.location)}
          {renderLanguageInput('Overview', 'overview', formData.overview, true)}

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Harga</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="price.adult" className="block text-sm font-medium text-gray-700">Harga Dewasa</label>
              <input
                type="number"
                id="price.adult"
                name="price.adult"
                value={formData.price?.adult || 0}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="price.child" className="block text-sm font-medium text-gray-700">Harga Anak</label>
              <input
                type="number"
                id="price.child"
                name="price.child"
                value={formData.price?.child || 0}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="price.infant" className="block text-sm font-medium text-gray-700">Harga Bayi</label>
              <input
                type="number"
                id="price.infant"
                name="price.infant"
                value={formData.price?.infant || 0}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="original_price" className="block text-sm font-medium text-gray-700">Harga Asli (opsional)</label>
              <input
                type="number"
                id="original_price"
                name="original_price"
                value={formData.original_price || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rating (opsional, 0-5)</label>
              <input
                type="number"
                id="rate"
                name="rate"
                value={formData.rate || ''}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Gambar Tur</h2>
          <p className="text-sm text-gray-600 mb-4">Pilih gambar untuk tur. Gambar akan diunggah ke server.</p>
          <div className="mb-4">
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">Unggah Gambar Baru</label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleImageFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/90"
            />
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {imagePreviews.map((image, index) => (
                <div key={image.id || index} className="relative group border border-gray-200 rounded-md overflow-hidden shadow-sm">
                  <img
                    src={image.previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Hapus Gambar"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-2 bg-gray-100">
                    <label htmlFor={`image-order-${index}`} className="block text-xs font-medium text-gray-600">Urutan</label>
                    <input
                      type="number"
                      id={`image-order-${index}`}
                      value={image.order}
                      onChange={(e) => handleImageOrderChange(index, parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {imagePreviews.length === 0 && (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md text-gray-500 mb-6">
              <ImageIcon className="h-8 w-8 mr-2" />
              <span>Belum ada gambar yang dipilih.</span>
            </div>
          )}

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Highlights</h2>
          {formData.highlights?.map((highlight, index) => (
            <div key={index} className="flex items-end gap-4 mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700">Deskripsi Highlight</label>
                <input
                  type="text"
                  value={highlight.description.en}
                  onChange={(e) => handleNestedArrayChange(index, 'highlights', 'description', e.target.value, 'en')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                  placeholder="English"
                  required
                />
                <input
                  type="text"
                  value={highlight.description.id || ''}
                  onChange={(e) => handleNestedArrayChange(index, 'highlights', 'description', e.target.value, 'id')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                  placeholder="Indonesian (opsional)"
                />
                <input
                  type="text"
                  value={highlight.description.ru || ''}
                  onChange={(e) => handleNestedArrayChange(index, 'highlights', 'description', e.target.value, 'ru')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Russian (opsional)"
                />
              </div>
              <button
                type="button"
                onClick={() => removeNestedItem('highlights', index)}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addNestedItem('highlights', { description: { ...initialLanguageContent } })}
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors flex items-center mb-6"
          >
            <Plus className="h-5 w-5 mr-2" /> Tambah Highlight
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Itinerary</h2>
          {formData.itineraries?.map((itinerary, dayIndex) => (
            <div key={dayIndex} className="mb-6 p-6 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Hari {dayIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeNestedItem('itineraries', dayIndex)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor={`itinerary-day-${dayIndex}`} className="block text-sm font-medium text-gray-700">Nomor Hari</label>
                <input
                  type="number"
                  id={`itinerary-day-${dayIndex}`}
                  value={itinerary.day}
                  onChange={(e) => handleNestedArrayChange(dayIndex, 'itineraries', 'day', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4 p-4 border border-gray-200 rounded-md bg-white">
                <label className="block text-sm font-medium text-gray-700 mb-2">Judul Hari</label>
                <input
                  type="text"
                  value={itinerary.title.en}
                  onChange={(e) => handleNestedArrayChange(dayIndex, 'itineraries', 'title', e.target.value, 'en')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                  placeholder="English"
                  required
                />
                <input
                  type="text"
                  value={itinerary.title.id || ''}
                  onChange={(e) => handleNestedArrayChange(dayIndex, 'itineraries', 'title', e.target.value, 'id')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                  placeholder="Indonesian (opsional)"
                />
                <input
                  type="text"
                  value={itinerary.title.ru || ''}
                  onChange={(e) => handleNestedArrayChange(dayIndex, 'itineraries', 'title', e.target.value, 'ru')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Russian (opsional)"
                />
              </div>

              <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2">Aktivitas</h4>
              {itinerary.activities.map((activity, activityIndex) => (
                <div key={activityIndex} className="flex items-end gap-4 mb-3 p-3 border border-gray-200 rounded-md bg-white">
                  <div className="flex-grow">
                    <label htmlFor={`activity-time-${dayIndex}-${activityIndex}`} className="block text-sm font-medium text-gray-700">Waktu</label>
                    <input
                      type="text"
                      id={`activity-time-${dayIndex}-${activityIndex}`}
                      value={activity.time}
                      onChange={(e) => {
                        const newItineraries = [...formData.itineraries!];
                        newItineraries[dayIndex].activities[activityIndex].time = e.target.value;
                        setFormData({ ...formData!, itineraries: newItineraries });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="contoh: 08:00"
                      required
                    />
                    <label className="block text-sm font-medium text-gray-700 mt-2">Deskripsi Aktivitas</label>
                    <input
                      type="text"
                      value={activity.description.en}
                      onChange={(e) => {
                        const newItineraries = [...formData.itineraries!];
                        newItineraries[dayIndex].activities[activityIndex].description.en = e.target.value;
                        setFormData({ ...formData!, itineraries: newItineraries });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                      placeholder="English"
                      required
                    />
                    <input
                      type="text"
                      value={activity.description.id || ''}
                      onChange={(e) => {
                        const newItineraries = [...formData.itineraries!];
                        newItineraries[dayIndex].activities[activityIndex].description.id = e.target.value;
                        setFormData({ ...formData!, itineraries: newItineraries });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                      placeholder="Indonesian (opsional)"
                    />
                    <input
                      type="text"
                      value={activity.description.ru || ''}
                      onChange={(e) => {
                        const newItineraries = [...formData.itineraries!];
                        newItineraries[dayIndex].activities[activityIndex].description.ru = e.target.value;
                        setFormData({ ...formData!, itineraries: newItineraries });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Russian (opsional)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newItineraries = [...formData.itineraries!];
                      newItineraries[dayIndex].activities.splice(activityIndex, 1);
                      setFormData({ ...formData!, itineraries: newItineraries });
                    }}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newItineraries = [...formData.itineraries!];
                  newItineraries[dayIndex].activities.push({ time: '', description: { ...initialLanguageContent } });
                  setFormData({ ...formData!, itineraries: newItineraries });
                }}
                className="bg-secondary text-white px-3 py-1 rounded-md hover:bg-secondary/90 transition-colors flex items-center text-sm mb-4"
              >
                <Plus className="h-4 w-4 mr-1" /> Tambah Aktivitas
              </button>

              <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2">Makanan</h4>
              {itinerary.meals.map((meal, mealIndex) => (
                <div key={mealIndex} className="flex items-end gap-4 mb-3 p-3 border border-gray-200 rounded-md bg-white">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">Deskripsi Makanan</label>
                    <input
                      type="text"
                      value={meal.description.en}
                      onChange={(e) => {
                        const newItineraries = [...formData.itineraries!];
                        newItineraries[dayIndex].meals[mealIndex].description.en = e.target.value;
                        setFormData({ ...formData!, itineraries: newItineraries });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                      placeholder="English"
                      required
                    />
                    <input
                      type="text"
                      value={meal.description.id || ''}
                      onChange={(e) => {
                        const newItineraries = [...formData.itineraries!];
                        newItineraries[dayIndex].meals[mealIndex].description.id = e.target.value;
                        setFormData({ ...formData!, itineraries: newItineraries });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                      placeholder="Indonesian (opsional)"
                    />
                    <input
                      type="text"
                      value={meal.description.ru || ''}
                      onChange={(e) => {
                        const newItineraries = [...formData.itineraries!];
                        newItineraries[dayIndex].meals[mealIndex].description.ru = e.target.value;
                        setFormData({ ...formData!, itineraries: newItineraries });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Russian (opsional)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newItineraries = [...formData.itineraries!];
                      newItineraries[dayIndex].meals.splice(mealIndex, 1);
                      setFormData({ ...formData!, itineraries: newItineraries });
                    }}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newItineraries = [...formData.itineraries!];
                  newItineraries[dayIndex].meals.push({ description: { ...initialLanguageContent } });
                  setFormData({ ...formData!, itineraries: newItineraries });
                }}
                className="bg-secondary text-white px-3 py-1 rounded-md hover:bg-secondary/90 transition-colors flex items-center text-sm"
              >
                <Plus className="h-4 w-4 mr-1" /> Tambah Makanan
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addNestedItem('itineraries', { day: (formData.itineraries?.length || 0) + 1, title: { ...initialLanguageContent }, activities: [], meals: [] })}
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors flex items-center mt-6 mb-6"
          >
            <Plus className="h-5 w-5 mr-2" /> Tambah Hari Itinerary
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Termasuk & Tidak Termasuk</h2>
          {formData.included_excluded?.map((item, index) => (
            <div key={index} className="flex items-end gap-4 mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex-grow">
                <label htmlFor={`included-excluded-type-${index}`} className="block text-sm font-medium text-gray-700">Tipe</label>
                <select
                  id={`included-excluded-type-${index}`}
                  value={item.type}
                  onChange={(e) => handleNestedArrayChange(index, 'included_excluded', 'type', e.target.value as 'included' | 'excluded')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                >
                  <option value="included">Termasuk</option>
                  <option value="excluded">Tidak Termasuk</option>
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-2">Deskripsi</label>
                <input
                  type="text"
                  value={item.description.en}
                  onChange={(e) => handleNestedArrayChange(index, 'included_excluded', 'description', e.target.value, 'en')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                  placeholder="English"
                  required
                />
                <input
                  type="text"
                  value={item.description.id || ''}
                  onChange={(e) => handleNestedArrayChange(index, 'included_excluded', 'description', e.target.value, 'id')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                  placeholder="Indonesian (opsional)"
                />
                <input
                  type="text"
                  value={item.description.ru || ''}
                  onChange={(e) => handleNestedArrayChange(index, 'included_excluded', 'description', e.target.value, 'ru')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Russian (opsional)"
                />
              </div>
              <button
                type="button"
                onClick={() => removeNestedItem('included_excluded', index)}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addNestedItem('included_excluded', { type: 'included', description: { ...initialLanguageContent } })}
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors flex items-center mb-6"
          >
            <Plus className="h-5 w-5 mr-2" /> Tambah Termasuk/Tidak Termasuk
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">FAQ</h2>
          {formData.faqs?.map((faq, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => removeNestedItem('faqs', index)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <label className="block text-sm font-medium text-gray-700">Pertanyaan</label>
              <input
                type="text"
                value={faq.question.en}
                onChange={(e) => handleNestedArrayChange(index, 'faqs', 'question', e.target.value, 'en')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                placeholder="English"
                required
              />
              <input
                type="text"
                value={faq.question.id || ''}
                onChange={(e) => handleNestedArrayChange(index, 'faqs', 'question', e.target.value, 'id')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                placeholder="Indonesian (opsional)"
              />
              <input
                type="text"
                value={faq.question.ru || ''}
                onChange={(e) => handleNestedArrayChange(index, 'faqs', 'question', e.target.value, 'ru')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Russian (opsional)"
              />

              <label className="block text-sm font-medium text-gray-700 mt-4">Jawaban</label>
              <textarea
                value={faq.answer.en}
                onChange={(e) => handleNestedArrayChange(index, 'faqs', 'answer', e.target.value, 'en')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                placeholder="English"
                required
              />
              <textarea
                value={faq.answer.id || ''}
                onChange={(e) => handleNestedArrayChange(index, 'faqs', 'answer', e.target.value, 'id')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm mb-2"
                placeholder="Indonesian (opsional)"
              />
              <textarea
                value={faq.answer.ru || ''}
                onChange={(e) => handleNestedArrayChange(index, 'faqs', 'answer', e.target.value, 'ru')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Russian (opsional)"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addNestedItem('faqs', { question: { ...initialLanguageContent }, answer: { ...initialLanguageContent } })}
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors flex items-center mb-6"
          >
            <Plus className="h-5 w-5 mr-2" /> Tambah FAQ
          </button>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/tours')}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
