import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getBlogPosts } from '../lib/api';
import { BlogPost } from '../lib/types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';

const BlogList: React.FC = () => {
  const { t, language } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10; 

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getBlogPosts({ page: currentPage, per_page: postsPerPage });
        setBlogPosts(response.data);
        setTotalPages(response.pagination.last_page);
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        setError(t('errorFetchingBlogPosts'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, language, t]);

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
        <ErrorDisplay message={error} onRetry={() => setCurrentPage(1)} />
      </div>
    );
  }

  return (
    <div className="bg-background text-text pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-primary text-center mb-12 animate-fade-in-up">
          {t('ourBlog')}
        </h1>

        {blogPosts.length === 0 ? (
          <p className="text-center text-textSecondary text-lg">{t('noBlogPostsFound')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default BlogList;
