import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TourPackage, LanguageContent, PriceDetails } from '../../../lib/types';
import { getTourPackageDetail } from '../../../lib/api';
import { FaArrowLeft } from 'react-icons/fa';
import { MapPin, Clock, DollarSign, Star, Image as ImageIcon, List, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// Type guard function to check if price is PriceDetails
function isPriceDetails(price: string | PriceDetails): price is PriceDetails {
  return typeof price === 'object' && price !== null && 'adult' in price && 'child' in price && 'infant' in price;
}

const LanguageContentDisplay: React.FC<{ content: LanguageContent }> = ({ content }) => (
  <div className="text-sm text-gray-700">
    {content.en && <p><strong>EN:</strong> {content.en}</p>}
    {content.id && <p><strong>ID:</strong> {content.id}</p>}
    {content.ru && <p><strong>RU:</strong> {content.ru}</p>}
  </div>
);

export default function ShowTour() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTourDetail(id);
    }
  }, [id]);

  const fetchTourDetail = useCallback(async (tourId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTourPackageDetail(tourId);
      setTour(data);
    } catch (err) {
      console.error('Gagal mengambil detail tur:', err);
      setError('Gagal memuat detail tur. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center text-gray-600">
        Memuat detail tur...
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

  if (!tour) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center text-gray-600">
        Tur tidak ditemukan.
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Detail Tur: {tour.name.id || tour.name.en}</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Umum</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 flex items-center"><MapPin className="h-5 w-5 mr-2 text-primary" /> <strong>Lokasi:</strong> <LanguageContentDisplay content={tour.location} /></p>
              <p className="text-gray-600 flex items-center"><Clock className="h-5 w-5 mr-2 text-primary" /> <strong>Durasi:</strong> <LanguageContentDisplay content={tour.duration} /></p>
              <p className="text-gray-600 flex items-center"><Star className="h-5 w-5 mr-2 text-primary" /> <strong>Rating:</strong> {tour.rate || 'N/A'}</p>
              <p className="text-gray-600"><strong>Kode Tur:</strong> {tour.code || 'N/A'}</p>
              <p className="text-gray-600"><strong>Tags:</strong> {tour.tags || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-primary" /> <strong>Harga Dewasa:</strong> {isPriceDetails(tour.price) ? `Rp ${tour.price.adult.toLocaleString('id-ID')}` : `Rp ${typeof tour.price === 'string' ? parseInt(tour.price).toLocaleString('id-ID') : 'N/A'}`}</p>
              <p className="text-gray-600"><strong>Harga Anak:</strong> {isPriceDetails(tour.price) ? `Rp ${tour.price.child.toLocaleString('id-ID')}` : 'N/A'}</p>
              <p className="text-gray-600"><strong>Harga Bayi:</strong> {isPriceDetails(tour.price) ? `Rp ${tour.price.infant.toLocaleString('id-ID')}` : 'N/A'}</p>
              {tour.original_price && <p className="text-gray-600"><strong>Harga Asli:</strong> Rp {parseInt(tour.original_price).toLocaleString('id-ID')}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Nama Tur</h2>
          <LanguageContentDisplay content={tour.name} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
          <LanguageContentDisplay content={tour.overview} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><ImageIcon className="h-5 w-5 mr-2 text-primary" /> Gambar Tur</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tour.images.length > 0 ? (
              tour.images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={`${API_URL}${image.path}`}
                    alt={`Tour Image ${image.order}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <span className="text-white text-xs">Order: {image.order}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">Tidak ada gambar.</p>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><List className="h-5 w-5 mr-2 text-primary" /> Highlights</h2>
          {tour.highlights.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {tour.highlights.map((highlight, index) => (
                <li key={index} className="text-gray-700">
                  <LanguageContentDisplay content={highlight.description} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Tidak ada highlight.</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><Clock className="h-5 w-5 mr-2 text-primary" /> Itinerary</h2>
          {tour.itineraries.length > 0 ? (
            <div className="space-y-6">
              {tour.itineraries.sort((a, b) => a.day - b.day).map((itinerary) => (
                <div key={itinerary.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Hari {itinerary.day}: <LanguageContentDisplay content={itinerary.title} /></h3>
                  <div className="ml-4 space-y-2">
                    <p className="font-medium text-gray-800">Aktivitas:</p>
                    {itinerary.activities.length > 0 ? (
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        {itinerary.activities.map((activity, idx) => (
                          <li key={idx} className="text-gray-700">
                            <strong>{activity.time}:</strong> <LanguageContentDisplay content={activity.description} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm ml-4">Tidak ada aktivitas.</p>
                    )}
                    <p className="font-medium text-gray-800 mt-2">Makanan:</p>
                    {itinerary.meals.length > 0 ? (
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        {itinerary.meals.map((meal, idx) => (
                          <li key={idx} className="text-gray-700">
                            <LanguageContentDisplay content={meal.description} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm ml-4">Tidak ada makanan.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Tidak ada itinerary.</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Termasuk & Tidak Termasuk</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" /> Termasuk</h3>
              {tour.included_excluded.filter(item => item.type === 'included').length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {tour.included_excluded
                    .filter(item => item.type === 'included')
                    .map((item, index) => (
                      <li key={index} className="text-gray-700">
                        <LanguageContentDisplay content={item.description} />
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500">Tidak ada yang termasuk.</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center"><XCircle className="h-5 w-5 mr-2 text-red-500" /> Tidak Termasuk</h3>
              {tour.included_excluded.filter(item => item.type === 'excluded').length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {tour.included_excluded
                    .filter(item => item.type === 'excluded')
                    .map((item, index) => (
                      <li key={index} className="text-gray-700">
                        <LanguageContentDisplay content={item.description} />
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500">Tidak ada yang tidak termasuk.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><HelpCircle className="h-5 w-5 mr-2 text-primary" /> FAQ</h2>
          {tour.faqs.length > 0 ? (
            <div className="space-y-4">
              {tour.faqs.map((faq, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <p className="font-medium text-gray-900 mb-1"><strong>Q:</strong> <LanguageContentDisplay content={faq.question} /></p>
                  <p className="text-gray-700"><strong>A:</strong> <LanguageContentDisplay content={faq.answer} /></p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Tidak ada FAQ.</p>
          )}
        </div>
      </div>
    </div>
  );
}
