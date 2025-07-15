import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { addBlogPost } from '../../../lib/api';
import { BlogPostCreatePayload } from '../../../lib/types';
import BlogForm from '../../../components/admin/BlogForm';
import Swal from 'sweetalert2';

const CreateBlog: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (data: BlogPostCreatePayload) => {
    try {
      await addBlogPost(data);
      Swal.fire(t('success'), t('blogPostCreatedSuccessfully'), 'success');
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Failed to create blog post:', error);
      Swal.fire(t('error'), t('errorCreatingBlogPost'), 'error');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-primary mb-6">{t('createBlogPost')}</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateBlog;
