import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BlogPostCreatePayload, BlogPostUpdatePayload, BlogPost, LanguageContent, BlogCategory } from '../../lib/types';
import { getBlogPosts } from '../../lib/api'; // Reusing getBlogPosts to fetch categories (assuming API supports it or a separate endpoint exists)
import LoadingSpinner from '../LoadingSpinner';
import ErrorDisplay from '../ErrorDisplay';
import { Plus, X } from 'lucide-react';

interface BlogFormProps {
  onSubmit: (data: BlogPostCreatePayload | BlogPostUpdatePayload) => void;
  initialData?: BlogPost | null;
}

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit, initialData }) => {
  const { t, language } = useLanguage();
  const [title, setTitle] = useState<LanguageContent>(initialData?.title || { en: '', id: '', ru: '' });
  const [content, setContent] = useState<LanguageContent>(initialData?.content || { en: '', id: '', ru: '' });
  const [categoryId, setCategoryId] = useState<number | string>(initialData?.category_id || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(initialData?.image || '');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setCategoriesError(null);
      try {
        // Assuming getBlogPosts can return categories or there's a separate endpoint like /blog-categories
        // For now, I'll mock categories or assume getBlogPosts returns them in some way.
        // In a real scenario, you'd have a dedicated API endpoint for categories.
        // For demonstration, let's assume a simple mock or a simplified API call.
        // If your backend has a /blog-categories endpoint:
        // const response = await fetchData<BlogCategory[]>('blog-categories');
        // setCategories(response);

        // Mock categories for now if no specific API for categories exists
        setCategories([
          { id: 1, name: { en: 'Travel Tips', id: 'Tips Perjalanan', ru: 'Советы по путешествиям' }, slug: 'travel-tips', created_at: '', updated_at: '' },
          { id: 2, name: { en: 'Destinations', id: 'Destinasi', ru: 'Направления' }, slug: 'destinations', created_at: '', updated_at: '' },
          { id: 3, name: { en: 'Culture', id: 'Budaya', ru: 'Культура' }, slug: 'culture', created_at: '', updated_at: '' },
        ]);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategoriesError(t('errorFetchingCategories'));
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [t]);

  const handleTitleChange = (lang: keyof LanguageContent, value: string) => {
    setTitle(prev => ({ ...prev, [lang]: value }));
  };

  const handleContentChange = (lang: keyof LanguageContent, value: string) => {
    setContent(prev => ({ ...prev, [lang]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setCurrentImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setCurrentImageUrl('');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: BlogPostCreatePayload | BlogPostUpdatePayload = {
      title,
      content,
      category_id: Number(categoryId),
    };

    if (imageFile) {
      payload.image = imageFile;
    } else if (initialData && !currentImageUrl) {
      // If there was an image initially but it was removed
      // You might need a way to signal to the backend to remove the image
      // For now, if currentImageUrl is empty and no new file, it means no image.
      // Backend should handle this by setting image to null if no file is sent.
    }

    onSubmit(payload);
  };

  if (loadingCategories) {
    return <LoadingSpinner />;
  }

  if (categoriesError) {
    return <ErrorDisplay message={categoriesError} />;
  }

  return (
    <form onSubmit={handleSubmitForm} className="bg-surface p-6 rounded-lg shadow-md space-y-6">
      {/* Title Inputs */}
      <div>
        <label htmlFor="title_en" className="block text-sm font-medium text-textSecondary mb-1">
          {t('title')} (EN) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title_en"
          value={title.en}
          onChange={(e) => handleTitleChange('en', e.target.value)}
          className="w-full p-3 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
          required
        />
      </div>
      <div>
        <label htmlFor="title_id" className="block text-sm font-medium text-textSecondary mb-1">
          {t('title')} (ID)
        </label>
        <input
          type="text"
          id="title_id"
          value={title.id || ''}
          onChange={(e) => handleTitleChange('id', e.target.value)}
          className="w-full p-3 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="title_ru" className="block text-sm font-medium text-textSecondary mb-1">
          {t('title')} (RU)
        </label>
        <input
          type="text"
          id="title_ru"
          value={title.ru || ''}
          onChange={(e) => handleTitleChange('ru', e.target.value)}
          className="w-full p-3 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Content Inputs */}
      <div>
        <label htmlFor="content_en" className="block text-sm font-medium text-textSecondary mb-1">
          {t('content')} (EN) <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content_en"
          value={content.en}
          onChange={(e) => handleContentChange('en', e.target.value)}
          rows={8}
          className="w-full p-3 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="content_id" className="block text-sm font-medium text-textSecondary mb-1">
          {t('content')} (ID)
        </label>
        <textarea
          id="content_id"
          value={content.id || ''}
          onChange={(e) => handleContentChange('id', e.target.value)}
          rows={8}
          className="w-full p-3 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
        ></textarea>
      </div>
      <div>
        <label htmlFor="content_ru" className="block text-sm font-medium text-textSecondary mb-1">
          {t('content')} (RU)
        </label>
        <textarea
          id="content_ru"
          value={content.ru || ''}
          onChange={(e) => handleContentChange('ru', e.target.value)}
          rows={8}
          className="w-full p-3 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
        ></textarea>
      </div>

      {/* Category Select */}
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-textSecondary mb-1">
          {t('category')} <span className="text-red-500">*</span>
        </label>
        <select
          id="category_id"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="w-full p-3 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
          required
        >
          <option value="">{t('selectCategory')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name[language] || cat.name.en}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-textSecondary mb-1">
          {t('image')}
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-3 bg-background border border-border rounded-md text-text file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        {currentImageUrl && (
          <div className="mt-4 relative w-48 h-32">
            <img src={currentImageUrl} alt="Current Blog Post" className="w-full h-full object-cover rounded-md" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              aria-label={t('removeImage')}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        {initialData ? t('updateBlogPost') : t('createBlogPost')}
      </button>
    </form>
  );
};

export default BlogForm;
