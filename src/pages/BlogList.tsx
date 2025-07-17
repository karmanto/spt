import React, { useState, useEffect, useCallback } from 'react';
import { getBlogs } from '../lib/api';
import { Blog } from '../lib/types';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { useLanguage } from '../context/LanguageContext';
import { Search } from 'lucide-react';

const BlogList: React.FC = () => {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const blogsPerPage = 9; // Number of blogs per page

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBlogs({
        page: currentPage,
        per_page: blogsPerPage,
        search: debouncedSearchTerm,
      });
      setBlogs(response.data);
      setTotalPages(response.pagination.last_page);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError(t('failedToLoadBlogs'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, t]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); 
    }, 2000); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          {t('ourBlog')}
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          {t('blogIntroText')}
        </p>

        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={t('searchBlogsPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorDisplay message={error} onRetry={fetchBlogs} />
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">{t('noBlogsFound')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;
