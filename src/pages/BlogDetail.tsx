import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Blog } from '../lib/types';
import { getBlogDetail } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { FaArrowLeft } from 'react-icons/fa';
import { CalendarDays } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); 
  const navigate = useNavigate();
  const { t, language: currentLanguage } = useLanguage();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogDetail = useCallback(async () => {
    if (!slug) {
      navigate('/blogs');
      return;
    }
    const id = slug.split('-').pop();
    if (!id) {
      setError(t('blogNotFound'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const foundBlog = await getBlogDetail(id); 
      setBlog(foundBlog);
    } catch (err) {
      console.error("Failed to fetch blog detail:", err);
      setError(t('failedToLoadBlogDetails'));
    } finally {
      setLoading(false);
    }
  }, [slug, navigate, t]); 

  useEffect(() => {
    fetchBlogDetail();
  }, [fetchBlogDetail]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <ErrorDisplay message={error} onRetry={fetchBlogDetail} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-base text-gray-700">{t('blogNotFound')}</p>
      </div>
    );
  }

  const getLocalizedTitle = () => {
    if (currentLanguage === 'id') return blog.title_id;
    if (currentLanguage === 'ru') return blog.title_ru || blog.title_en;
    return blog.title_en;
  };

  const getLocalizedContent = () => {
    if (currentLanguage === 'id') return blog.content_id;
    if (currentLanguage === 'ru') return blog.content_ru || blog.content_en;
    return blog.content_en;
  };

  const formattedDate = new Date(blog.posting_date).toLocaleDateString(currentLanguage === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={t('backToBlogs')}
          >
            <FaArrowLeft className="text-lg" />
            <span className="ml-2">{t('backToBlogs')}</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 md:p-10">
          <img
            src={`${import.meta.env.VITE_BASE_URL}/storage/${blog.image}`}
            alt={getLocalizedTitle()}
            className="w-full h-80 object-contain rounded-xl mb-8 shadow-md"
          />

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {getLocalizedTitle()}
          </h1>

          <div className="flex items-center text-gray-500 text-sm mb-8">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>{formattedDate}</span>
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: getLocalizedContent() }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
