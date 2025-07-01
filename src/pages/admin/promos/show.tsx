import { useParams, useNavigate } from 'react-router-dom';
import { getPromo, deletePromo } from '../../../lib/api';
import { Promo } from '../../../lib/types';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa'; // Import icons

const API_URL = import.meta.env.VITE_API_URL;

export default function ShowPromo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [promo, setPromo] = useState<Promo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Promo ID is missing.');
      setLoading(false);
      return;
    }
    const fetchPromoDetails = async () => {
      try {
        const data = await getPromo(id);
        setPromo(data);
      } catch (err) {
        console.error('Failed to fetch promo details:', err);
        setError('Gagal memuat detail promo.');
      } finally {
        setLoading(false);
      }
    };
    fetchPromoDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Apakah Anda yakin ingin menghapus promo ini?')) {
      return;
    }
    try {
      await deletePromo(Number(id));
      navigate('/admin/promos');
    } catch (err) {
      console.error('Failed to delete promo:', err);
      alert('Gagal menghapus promo.');
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto py-8 px-2 text-center">Memuat...</div>;
  }

  if (error) {
    return <div className="max-w-3xl mx-auto py-8 px-2 text-red-600 text-center">{error}</div>;
  }

  if (!promo) {
    return <div className="max-w-3xl mx-auto py-8 px-2 text-center">Promo tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Detail Promo: {promo.title_id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Informasi Umum</h2>
          <p className="mb-2"><strong className="text-gray-600">Judul (ID):</strong> {promo.title_id}</p>
          <p className="mb-2"><strong className="text-gray-600">Judul (EN):</strong> {promo.title_en}</p>
          <p className="mb-2"><strong className="text-gray-600">Judul (RU):</strong> {promo.title_ru}</p>
          <p className="mb-2"><strong className="text-gray-600">Harga:</strong> {promo.price}</p>
          {promo.old_price && <p className="mb-2"><strong className="text-gray-600">Harga Lama:</strong> <s className="text-red-500">{promo.old_price}</s></p>}
          <p className="mb-2"><strong className="text-gray-600">Tanggal Berakhir:</strong> {new Date(promo.end_date).toLocaleDateString('id-ID')}</p>
          <p className="mb-2"><strong className="text-gray-600">URL PDF:</strong> <a href={promo.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{promo.pdf_url}</a></p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Deskripsi</h2>
          <p className="mb-2"><strong className="text-gray-600">Deskripsi (ID):</strong> {promo.description_id}</p>
          <p className="mb-2"><strong className="text-gray-600">Deskripsi (EN):</strong> {promo.description_en}</p>
          <p className="mb-2"><strong className="text-gray-600">Deskripsi (RU):</strong> {promo.description_ru}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Gambar Promo</h2>
        {promo.image ? (
          <img
            src={`${API_URL}/storage/${promo.image}`}
            alt={`Gambar Promo: ${promo.title_id}`}
            className="max-w-full h-auto rounded-lg shadow-md object-cover"
            style={{ maxHeight: '300px' }}
          />
        ) : (
          <p className="text-gray-500">Tidak ada gambar untuk promo ini.</p>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => navigate(`/admin/promos/edit/${promo.id}`)}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center"
          title="Edit Promo"
        >
          <FaEdit className="text-lg" />
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out flex items-center justify-center"
          title="Hapus Promo"
        >
          <FaTrash className="text-lg" />
        </button>
        <button
          onClick={() => navigate('/admin/promos')}
          className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out flex items-center justify-center"
          title="Kembali ke Daftar Promo"
        >
          <FaArrowLeft className="text-lg" />
        </button>
      </div>
    </div>
  );
}
