import { useParams, useNavigate } from 'react-router-dom';
import { getPromo, updatePromo } from '../../../lib/api';
import { Promo } from '../../../lib/types';
import { useState, useEffect } from 'react';
import { FaSave, FaArrowLeft } from 'react-icons/fa'; // Import icons

const API_URL = import.meta.env.VITE_API_URL;

export default function EditPromo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [promo, setPromo] = useState<Promo | null>(null);
  const [titleId, setTitleId] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [descriptionId, setDescriptionId] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionRu, setDescriptionRu] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDataPromo = async () => {
      try {
        const data = await getPromo(id);
        setPromo(data);
        setTitleId(data.title_id);
        setTitleEn(data.title_en);
        setTitleRu(data.title_ru);
        setDescriptionId(data.description_id);
        setDescriptionEn(data.description_en);
        setDescriptionRu(data.description_ru);
        setPrice(data.price);
        setPdfUrl(data.pdf_url);
        setOldPrice(data.old_price || '');
        setEndDate(data.end_date.split('T')[0]);
      } catch (error) {
        console.error('Gagal mengambil promo:', error);
      }
    };
    fetchDataPromo();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const updatedPromo: Partial<Omit<Promo, 'id' | 'image'>> & { image?: File } = {
        title_id: titleId,
        title_en: titleEn,
        title_ru: titleRu,
        description_id: descriptionId,
        description_en: descriptionEn,
        description_ru: descriptionRu,
        price: price,
        old_price: oldPrice || undefined,
        end_date: endDate,
        pdf_url: pdfUrl,
        image: image || undefined,
      };
      await updatePromo(Number(id), updatedPromo);
      navigate('/admin/promos');
    } catch (error) {
      console.error('Gagal mengupdate promo:', error);
    }
  };

  if (!promo) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-4">Edit Promo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Judul (ID)</label>
          <input type="text" value={titleId} onChange={(e) => setTitleId(e.target.value)} className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Judul (EN)</label>
          <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Judul (RU)</label>
          <input type="text" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi (ID)</label>
          <textarea value={descriptionId} onChange={(e) => setDescriptionId(e.target.value)} className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={3} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi (EN)</label>
          <textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={3} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi (RU)</label>
          <textarea value={descriptionRu} onChange={(e) => setDescriptionRu(e.target.value)} className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" rows={3} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Harga</label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Harga Lama (Opsional)</label>
          <input type="text" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal Berakhir</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">URL PDF</label>
          <input type="url" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gambar</label>
          <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) { setImage(e.target.files[0]); } }} className="p-2 mt-1 block w-full" />
          {promo.image && !image && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Gambar saat ini:</p>
              <img
                src={`${API_URL}/storage/${promo.image}`}
                alt="Current Promo Image"
                className="h-20 w-20 rounded object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex space-x-4"> {/* Flex container for buttons */}
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 flex items-center justify-center transition duration-300 ease-in-out"
            title="Simpan Perubahan"
          >
            <FaSave className="text-lg" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/promos')}
            className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 flex items-center justify-center transition duration-300 ease-in-out"
            title="Kembali ke Daftar Promo"
          >
            <FaArrowLeft className="text-lg" />
          </button>
        </div>
      </form>
    </div>
  );
}
