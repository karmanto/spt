import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { getBlogPost, updateBlogPost } from '../../../lib/api';
import { BlogPost, BlogPostUpdatePayload } from '../../../lib/types';
import BlogForm from '../../../components/admin/BlogForm';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorDisplay from '../../../components/ErrorDisplay';
import Swal from 'sweetalert2';

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) {
        setError(t('blogPostNotFound'));
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchedPost = await getBlogPost(id); // Assuming getBlogPost can take ID or slug
        setBlogPost(fetchedPost);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError(t('errorFetchingBlogPost'));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, t]);

  const handleSubmit = async (data: BlogPostUpdatePayload) => {
    if (!id) return;
    try {
      await updateBlogPost(parseInt(id), data);
      Swal.fire(t('success'), t('blogPostUpdatedSuccessfully'), 'success');
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Failed to update blog post:', error);
      Swal.fire(t('error'), t('errorUpdatingBlogPost'), 'error');
    }
  };

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
        <ErrorDisplay message={error} onRetry={() => setBlogPost(null)} />
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

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-primary mb-6">{t('editBlogPost')}</h1>
      <BlogForm onSubmit={handleSubmit} initialData={blogPost} />
    </div>
  );
};

export default EditBlog;
