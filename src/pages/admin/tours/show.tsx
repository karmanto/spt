import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TourPackage, LanguageContent, PriceDetails } from '../../../lib/types';
import { getTourPackageDetail, deleteTourPackage } from '../../../lib/api';
import { FaArrowLeft } from 'react-icons/fa';
import { Image as ImageIcon, Edit, Trash2, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// Type guard function to check if price is PriceDetails
function isPriceDetails(price: string | PriceDetails): price is PriceDetails {
  return typeof price === 'object' && price !== null && 'adult' in price && 'child' in price && 'infant' in price;
}

export default function ShowTour() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


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

  const handleDelete = useCallback(async () => {
    if (!id) return;
    if (!window.confirm('Apakah Anda yakin ingin menghapus tur ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteTourPackage(parseInt(id));
      setSuccess('Tur berhasil dihapus!');
      navigate('/admin/tours'); // Redirect to tour list after deletion
    } catch (err: any) {
      console.error('Gagal menghapus tur:', err);
      setError(err.message || 'Terjadi kesalahan saat menghapus tur.');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-lg text-gray-600">Memuat detail tur...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8 flex justify-center items-center">
        <p className="text-lg text-gray-600">Tur tidak ditemukan.</p>
      </div>
    );
  }

  const sortedImages = [...tour.images].sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    return orderA - orderB;
  });

  const renderLanguageContentDisplay = (
    label: string,
    value: LanguageContent | undefined,
  ) => (
    <div className="mb-4 p-5 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500">English</label>
          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
            {value?.en || <span className="text-gray-400 italic">Tidak ada</span>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Indonesian</label>
          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
            {value?.id || <span className="text-gray-400 italic">Tidak ada</span>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Russian</label>
          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
            {value?.ru || <span className="text-gray-400 italic">Tidak ada</span>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-0">
        <button
          type="button"
          onClick={() => navigate('/admin/tours')}
          className="bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 mb-2 flex items-center justify-center transition duration-300 ease-in-out shadow-md"
          title="Kembali ke Daftar Tur"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-grow text-center sm:text-left">
            Detail Tur: {tour.name.id || tour.name.en}
          </h1>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/admin/tours/edit/${tour.id}`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-md"
              title="Edit Tur"
            >
              <Edit className="h-5 w-5 mr-2" /> Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center shadow-md"
              title="Hapus Tur"
              disabled={loading}
            >
              <Trash2 className="h-5 w-5 mr-2" /> {loading ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
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

        <div className="bg-white shadow-xl rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Tur</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {tour.code || <span className="text-gray-400 italic">Tidak ada</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {tour.tags || <span className="text-gray-400 italic">Tidak ada</span>}
                </div>
              </div>
            </div>

            {renderLanguageContentDisplay('Nama Tur', tour.name)}
            {renderLanguageContentDisplay('Durasi', tour.duration)}
            {renderLanguageContentDisplay('Lokasi', tour.location)}
            {renderLanguageContentDisplay('Overview', tour.overview)}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Harga</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Dewasa</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {isPriceDetails(tour.price) ? `฿${tour.price.adult.toLocaleString('id-ID')}` : `฿${typeof tour.price === 'string' ? parseInt(tour.price).toLocaleString('id-ID') : 'N/A'}`}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Anak</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {isPriceDetails(tour.price) ? `฿${tour.price.child.toLocaleString('id-ID')}` : <span className="text-gray-400 italic">N/A</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Bayi</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {isPriceDetails(tour.price) ? `฿${tour.price.infant.toLocaleString('id-ID')}` : <span className="text-gray-400 italic">N/A</span>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Asli (opsional)</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {tour.original_price ? `฿${parseInt(tour.original_price).toLocaleString('id-ID')}` : <span className="text-gray-400 italic">Tidak ada</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (opsional, 0-5)</label>
                <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                  {tour.rate || <span className="text-gray-400 italic">Tidak ada</span>}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Gambar Tur</h2>
            <p className="text-sm text-gray-600 mb-4">Gambar-gambar yang terkait dengan tur ini.</p>
            {sortedImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                {sortedImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white"
                  >
                    <img
                      src={`${API_URL}${image.path}`}
                      alt={`Tour Image ${image.order}`}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <span className="block text-xs font-medium text-gray-600">Urutan: {image.order}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 mb-6 bg-gray-50">
                <ImageIcon className="h-10 w-10 mb-3 text-gray-400" />
                <span className="text-lg font-medium">Tidak ada gambar.</span>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Highlights</h2>
            <div className="space-y-4">
              {tour.highlights.length > 0 ? (
                tour.highlights.map((highlight, index) => (
                  <details key={highlight.id} className="group border border-gray-200 rounded-lg shadow-sm bg-gray-50 animate-slide-up-fade-in" open>
                    <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors">
                      <h3 className="text-lg font-medium text-gray-800">Highlight {index + 1}</h3>
                      <ChevronDown className="h-5 w-5 text-gray-600 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Highlight</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500">English</label>
                          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                            {highlight.description.en || <span className="text-gray-400 italic">Tidak ada</span>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Indonesian</label>
                          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                            {highlight.description.id || <span className="text-gray-400 italic">Tidak ada</span>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Russian</label>
                          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                            {highlight.description.ru || <span className="text-gray-400 italic">Tidak ada</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                ))
              ) : (
                <p className="text-gray-500 p-4 bg-gray-50 rounded-lg shadow-sm">Tidak ada highlight.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Itinerary</h2>
            <div className="space-y-6">
              {tour.itineraries.length > 0 ? (
                tour.itineraries.sort((a, b) => a.day - b.day).map((itinerary) => (
                  <details key={itinerary.id} className="group border border-gray-300 rounded-lg shadow-md bg-gray-50 animate-slide-up-fade-in" open>
                    <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors">
                      <h3 className="text-lg font-medium text-gray-900">Hari {itinerary.day}</h3>
                      <ChevronDown className="h-5 w-5 text-gray-600 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-5 border-t border-gray-300 space-y-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Hari</label>
                        <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                          {itinerary.day}
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Judul Hari</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500">English</label>
                            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                              {itinerary.title.en || <span className="text-gray-400 italic">Tidak ada</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Indonesian</label>
                            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                              {itinerary.title.id || <span className="text-gray-400 italic">Tidak ada</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Russian</label>
                            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                              {itinerary.title.ru || <span className="text-gray-400 italic">Tidak ada</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-3">Aktivitas</h4>
                      <div className="space-y-4">
                        {itinerary.activities.length > 0 ? (
                          itinerary.activities.map((activity, activityIndex) => (
                            <div key={activity.id || activityIndex} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col sm:flex-row sm:items-end gap-4">
                              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                                  <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                                    {activity.time || <span className="text-gray-400 italic">Tidak ada</span>}
                                  </div>
                                </div>
                                <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (EN)</label>
                                    <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                                      {activity.description.en || <span className="text-gray-400 italic">Tidak ada</span>}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (ID)</label>
                                    <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                                      {activity.description.id || <span className="text-gray-400 italic">Tidak ada</span>}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (RU)</label>
                                    <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                                      {activity.description.ru || <span className="text-gray-400 italic">Tidak ada</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg shadow-sm">Tidak ada aktivitas.</p>
                        )}
                      </div>

                      <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Makanan</h4>
                      <div className="space-y-4">
                        {itinerary.meals.length > 0 ? (
                          itinerary.meals.map((meal, mealIndex) => (
                            <div key={meal.id || mealIndex} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col sm:flex-row sm:items-end gap-4">
                              <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (EN)</label>
                                  <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                                    {meal.description.en || <span className="text-gray-400 italic">Tidak ada</span>}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (ID)</label>
                                  <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                                    {meal.description.id || <span className="text-gray-400 italic">Tidak ada</span>}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (RU)</label>
                                  <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                                    {meal.description.ru || <span className="text-gray-400 italic">Tidak ada</span>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg shadow-sm">Tidak ada makanan.</p>
                        )}
                      </div>
                    </div>
                  </details>
                ))
              ) : (
                <p className="text-gray-500 p-4 bg-gray-50 rounded-lg shadow-sm">Tidak ada itinerary.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Termasuk & Tidak Termasuk</h2>
            <div className="space-y-4">
              {tour.included_excluded.length > 0 ? (
                tour.included_excluded.map((item, index) => (
                  <details key={item.id} className="group border border-gray-200 rounded-lg shadow-sm bg-gray-50 animate-slide-up-fade-in" open>
                    <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors">
                      <h3 className="text-lg font-medium text-gray-800">Item {index + 1} ({item.type === 'included' ? 'Termasuk' : 'Tidak Termasuk'})</h3>
                      <ChevronDown className="h-5 w-5 text-gray-600 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                      <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                        {item.type === 'included' ? 'Termasuk' : 'Tidak Termasuk'}
                      </div>
                      <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Deskripsi</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500">English</label>
                          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                            {item.description.en || <span className="text-gray-400 italic">Tidak ada</span>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Indonesian</label>
                          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                            {item.description.id || <span className="text-gray-400 italic">Tidak ada</span>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Russian</label>
                          <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                            {item.description.ru || <span className="text-gray-400 italic">Tidak ada</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                ))
              ) : (
                <p className="text-gray-500 p-4 bg-gray-50 rounded-lg shadow-sm">Tidak ada item termasuk/tidak termasuk.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">FAQ</h2>
            <div className="space-y-4">
              {tour.faqs.length > 0 ? (
                tour.faqs.map((faq, index) => (
                  <details key={faq.id} className="group border border-gray-200 rounded-lg shadow-sm bg-gray-50 animate-slide-up-fade-in" open>
                    <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 rounded-t-lg hover:bg-gray-200 transition-colors">
                      <h3 className="text-lg font-medium text-gray-800">FAQ {index + 1}</h3>
                      <ChevronDown className="h-5 w-5 text-gray-600 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="p-4 border-t border-gray-200 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500">English</label>
                            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                              {faq.question.en || <span className="text-gray-400 italic">Tidak ada</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Indonesian</label>
                            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                              {faq.question.id || <span className="text-gray-400 italic">Tidak ada</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Russian</label>
                            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                              {faq.question.ru || <span className="text-gray-400 italic">Tidak ada</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Jawaban</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500">English</label>
                            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                              {faq.answer.en || <span className="text-gray-400 italic">Tidak ada</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Indonesian</label>
                            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                              {faq.answer.id || <span className="text-gray-400 italic">Tidak ada</span>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500">Russian</label>
                            <div className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow-sm sm:text-sm p-2 min-h-[40px] flex items-center">
                              {faq.answer.ru || <span className="text-gray-400 italic">Tidak ada</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                ))
              ) : (
                <p className="text-gray-500 p-4 bg-gray-50 rounded-lg shadow-sm">Tidak ada FAQ.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
