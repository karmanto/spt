import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBlog } from '../../../lib/api';
import { BlogCreatePayload } from '../../../lib/types';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BlogCreatePayload>({
    title_id: '',
    title_en: '',
    title_ru: '',
    content_id: '',
    content_en: '',
    content_ru: '',
    posting_date: new Date().toISOString().split('T')[0], // Default to today's date
    image: undefined,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | React.ChangeEvent<HTMLTextAreaElement>>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, image: undefined }));
      setImagePreview(null);
    }
  };

  const handleContentChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title_id.trim()) newErrors.title_id = "Judul (ID) wajib diisi.";
    if (!formData.title_en.trim()) newErrors.title_en = "Judul (EN) wajib diisi.";
    if (!formData.content_id.trim()) newErrors.content_id = "Konten (ID) wajib diisi.";
    if (!formData.content_en.trim()) newErrors.content_en = "Konten (EN) wajib diisi.";
    if (!formData.posting_date) newErrors.posting_date = "Tanggal posting wajib diisi.";
    if (!formData.image) newErrors.image = "Gambar wajib diunggah.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Mohon perbaiki kesalahan pada formulir.");
      return;
    }

    setLoading(true);
    try {
      await addBlog(formData);
      toast.success("Blog berhasil dibuat!");
      navigate('/admin/blogs');
    } catch (err) {
      console.error("Failed to create blog:", err);
      toast.error("Gagal membuat blog.");
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/admin/blogs')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
          aria-label="Kembali ke Blog"
        >
          <ArrowLeft className="text-lg" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Buat Blog Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="title_id" className="block text-sm font-medium text-gray-700 mb-1">
              Judul Blog (ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title_id"
              name="title_id"
              value={formData.title_id}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.title_id ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
            />
            {errors.title_id && <p className="mt-1 text-sm text-red-600">{errors.title_id}</p>}
          </div>
          <div>
            <label htmlFor="title_en" className="block text-sm font-medium text-gray-700 mb-1">
              Judul Blog (EN) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title_en"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.title_en ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
            />
            {errors.title_en && <p className="mt-1 text-sm text-red-600">{errors.title_en}</p>}
          </div>
          <div>
            <label htmlFor="title_ru" className="block text-sm font-medium text-gray-700 mb-1">
              Judul Blog (RU)
            </label>
            <input
              type="text"
              id="title_ru"
              name="title_ru"
              value={formData.title_ru}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="content_id" className="block text-sm font-medium text-gray-700 mb-1">
            Konten Blog (ID) <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            theme="snow"
            value={formData.content_id}
            onChange={(value) => handleContentChange(value, 'content_id')}
            modules={modules}
            formats={formats}
            className={errors.content_id ? 'border border-red-500 rounded-md' : ''}
          />
          {errors.content_id && <p className="mt-1 text-sm text-red-600">{errors.content_id}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="content_en" className="block text-sm font-medium text-gray-700 mb-1">
            Konten Blog (EN) <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            theme="snow"
            value={formData.content_en}
            onChange={(value) => handleContentChange(value, 'content_en')}
            modules={modules}
            formats={formats}
            className={errors.content_en ? 'border border-red-500 rounded-md' : ''}
          />
          {errors.content_en && <p className="mt-1 text-sm text-red-600">{errors.content_en}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="content_ru" className="block text-sm font-medium text-gray-700 mb-1">
            Konten Blog (RU)
          </label>
          <ReactQuill
            theme="snow"
            value={formData.content_ru}
            onChange={(value) => handleContentChange(value, 'content_ru')}
            modules={modules}
            formats={formats}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="posting_date" className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Posting <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="posting_date"
            name="posting_date"
            value={formData.posting_date}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.posting_date ? 'border-red-500' : 'border-gray-300'} shadow-sm p-2`}
          />
          {errors.posting_date && <p className="mt-1 text-sm text-red-600">{errors.posting_date}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Gambar Blog <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${errors.image ? 'border border-red-500 rounded-md' : ''}`}
          />
          {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Image Preview" className="max-w-full h-auto rounded-md shadow object-contain" />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Membuat..." : "Buat Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
