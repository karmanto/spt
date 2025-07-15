import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { getBlogPosts, deleteBlogPost } from '../../../lib/api';
import { BlogPost } from '../../../lib/types';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorDisplay from '../../../components/ErrorDisplay';
import Pagination from '../../../components/Pagination';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminBlogs: React.FC = () => {
  const { t, language } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  const fetchBlogPosts = async () => {
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

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage, language, t]);

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: t('confirmDelete'),
      text: t('confirmDeleteBlogText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('yesDeleteIt'),
      cancelButtonText: t('cancel'),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBlogPost(id);
          Swal.fire(t('deleted'), t('blogPostDeleted'), 'success');
          fetchBlogPosts(); // Refresh the list
        } catch (err) {
          console.error('Failed to delete blog post:', err);
          Swal.fire(t('error'), t('errorDeletingBlogPost'), 'error');
        }
      }
    });
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
        <ErrorDisplay message={error} onRetry={fetchBlogPosts} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">{t('manageBlogPosts')}</h1>
        <Link
          to="/admin/blogs/create"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-md hover:bg-primary-dark transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          {t('createBlogPost')}
        </Link>
      </div>

      {blogPosts.length === 0 ? (
        <p className="text-center text-textSecondary text-lg">{t('noBlogPostsFound')}</p>
      ) : (
        <div className="overflow-x-auto bg-surface rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  {t('title')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  {t('category')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  {t('image')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  {t('createdAt')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-textSecondary uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {blogPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                    {post.title[language] || post.title.en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                    {post.category ? (post.category.name[language] || post.category.name.en) : t('uncategorized')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                    {post.image && (
                      <img src={post.image} alt={post.title.en} className="h-12 w-12 object-cover rounded-md" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">
                    {new Date(post.created_at).toLocaleDateString(language)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/blogs/${post.id}`} className="text-blue-500 hover:text-blue-700 mr-3" title={t('view')}>
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link to={`/admin/blogs/edit/${post.id}`} className="text-yellow-500 hover:text-yellow-700 mr-3" title={t('edit')}>
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700"
                      title={t('delete')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  );
};

export default AdminBlogs;
