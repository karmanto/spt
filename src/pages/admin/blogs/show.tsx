import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { getBlogPost } from '../../../lib/api';
import { BlogPost } from '../../../lib/types';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorDisplay from '../../../components/ErrorDisplay';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { id, enUS, ru } from 'date-fns/locale';

const getLocale = (lang: string) => {
  switch (lang) {
    case 'id': return id;
    case 'en': return enUS;
    case 'ru': return ru;
    default: return enUS;
  }
};

const ShowBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError(t('blogPostNotFound'));
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const post = await getBlogPost(id); // Assuming getBlogPost can take ID or slug
        setBlogPost(post);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError(t('errorFetchingBlogPost'));
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, language, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <ErrorDisplay message={t('blogPostNotFound')} />
      </div>
    );
  }

  const currentLocale = getLocale(language);
  const formattedDate = blogPost.created_at
    ? format(new Date(blogPost.created_at), 'PPP', { locale: currentLocale })
    : '';

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">{t('blogPostDetails')}</h1>
        <Link
          to="/admin/blogs"
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('backToList')}
        </Link>
      </div>

      <div className="bg-surface rounded-lg shadow-lg p-6 md:p-8">
        {blogPost.image && (
          <div className="mb-6">
            <img
              src={blogPost.image}
              alt={blogPost.title[language] || blogPost.title.en}
              className="w-full h-96 object-cover rounded-md"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-textSecondary">{t('title')} (ID)</h3>
            <p className="text-text text-xl">{blogPost.title.id || '-'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-textSecondary">{t('title')} (EN)</h3>
            <p className="text-text text-xl">{blogPost.title.en || '-'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-textSecondary">{t('title')} (RU)</h3>
            <p className="text-text text-xl">{blogPost.title.ru || '-'}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-textSecondary">{t('category')}</h3>
            <p className="text-text text-xl">
              {blogPost.category ? (blogPost.category.name[language] || blogPost.category.name.en) : t('uncategorized')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-textSecondary">{t('createdAt')}</h3>
            <p className="text-text text-xl">{formattedDate}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-textSecondary mb-2">{t('content')} (ID)</h3>
          <div
            className="prose prose-invert max-w-none text-textSecondary"
            dangerouslySetInnerHTML={{ __html: blogPost.content.id || '-' }}
          />
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-textSecondary mb-2">{t('content')} (EN)</h3>
          <div
            className="prose prose-invert max-w-none text-textSecondary"
            dangerouslySetInnerHTML={{ __html: blogPost.content.en || '-' }}
          />
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-textSecondary mb-2">{t('content')} (RU)</h3>
          <div
            className="prose prose-invert max-w-none text-textSecondary"
            dangerouslySetInnerHTML={{ __html: blogPost.content.ru || '-' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowBlog;
