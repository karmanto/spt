import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getBlogPost } from '../lib/api';
import { BlogPost } from '../lib/types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
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

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError(t('blogPostNotFound'));
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const post = await getBlogPost(slug);
        setBlogPost(post);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError(t('errorFetchingBlogPost'));
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, language, t]);

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
    <div className="bg-background text-text pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-surface rounded-lg shadow-lg overflow-hidden">
          {blogPost.image && (
            <img
              src={blogPost.image}
              alt={blogPost.title[language] || blogPost.title.en}
              className="w-full h-80 object-cover object-center"
            />
          )}
          <div className="p-8">
            <h1 className="text-4xl font-extrabold text-primary mb-4 leading-tight">
              {blogPost.title[language] || blogPost.title.en}
            </h1>
            <div className="text-textSecondary text-sm mb-6 flex items-center space-x-4">
              <span>{formattedDate}</span>
              {blogPost.category && (
                <span className="px-3 py-1 bg-accent text-white rounded-full text-xs font-semibold">
                  {blogPost.category.name[language] || blogPost.category.name.en}
                </span>
              )}
            </div>
            <div
              className="prose prose-lg prose-invert max-w-none text-textSecondary leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blogPost.content[language] || blogPost.content.en }}
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
