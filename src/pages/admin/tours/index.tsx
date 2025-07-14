import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPackage, TourPackageResponse } from '../../../lib/types';
import { Plus, Edit, Trash2, Eye, Rocket, Copy } from 'lucide-react'; // Import Copy icon
import { Link } from 'react-router-dom';
import { getTourPackages, deleteTourPackage, boostTourPackage } from '../../../lib/api';
import { FaArrowLeft } from 'react-icons/fa';

export default function AdminTours() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('adminToursCurrentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [itemsPerPage] = useState(10); 
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); 

  useEffect(() => {
    localStorage.setItem('adminToursCurrentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    fetchTours();
  }, [currentPage, itemsPerPage]); 

  const fetchTours = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: TourPackageResponse = await getTourPackages({
        page: currentPage,
        per_page: itemsPerPage,
      });
      setTours(data.data);
      setTotalPages(data.pagination.last_page);
      setTotalItems(data.pagination.total);
      if (data.data.length === 0 && currentPage > 1) {
        setCurrentPage(data.pagination.last_page || 1);
      } else if (currentPage > data.pagination.last_page && data.pagination.last_page > 0) {
        setCurrentPage(data.pagination.last_page);
      } else if (data.pagination.last_page === 0 && currentPage !== 1) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Gagal mengambil tur:', err);
      setError('Gagal memuat data tur. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]); 

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm('Apakah Anda yakin ingin menghapus tur ini?')) return;
      try {
        await deleteTourPackage(id);
        alert('Tur berhasil dihapus!');
        fetchTours(); 
      } catch (err) {
        console.error('Gagal menghapus tur:', err);
        setError('Gagal menghapus tur. Silakan coba lagi.');
      }
    },
    [fetchTours]
  );

  const handleBoost = useCallback(
    async (id: number) => {
      if (!window.confirm('Apakah Anda yakin ingin meningkatkan (boost) tur ini?')) return;
      try {
        await boostTourPackage(id);
        alert('Tur berhasil ditingkatkan!');
        fetchTours();
      } catch (err) {
        console.error('Gagal meningkatkan tur:', err);
        setError('Gagal meningkatkan tur. Silakan coba lagi.');
      }
    },
    [fetchTours]
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; 
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center text-gray-600">
        Memuat data tur...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Tur</h1>
          <Link
            to="/admin/tours/create"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah Tur
          </Link>
        </div>
        
        {/* Tabel Tur */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gambar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Tur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mulai Dari
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tours.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Tidak ada data tur
                    </td>
                  </tr>
                ) : (
                  tours.map((tour) => (
                    <tr key={tour.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tour.images && tour.images.length > 0 ? (
                          <img
                            src={`${tour.images[0].path}`} 
                            alt={tour.name.id || tour.name.en}
                            className="h-16 w-16 rounded object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{tour.name.id || tour.name.en}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tour.location.id || tour.location.en}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tour.starting_price ? (
                          `฿${tour.starting_price.toLocaleString()}`
                        ) : (
                          `tidak ada`
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          {!tour.order && <button
                            onClick={() => handleBoost(tour.id)}
                            className="text-green-600 hover:text-green-800 transition-colors duration-200"
                            title="Tingkatkan Tur"
                          >
                            <Rocket className="h-5 w-5" />
                          </button>}
                          <Link
                              to={`/admin/tours/${tour.id}`}
                              className="text-secondary hover:text-opacity-80 transition-colors duration-200"
                              title="Lihat Detail"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                          <Link
                            to={`/admin/tours/edit/${tour.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/admin/tours/create?copyFrom=${tour.id}`} // Added Copy button
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Salin Tur"
                          >
                            <Copy className="h-5 w-5" />
                          </Link>
                          {!tour.order && <button
                            onClick={() => handleDelete(tour.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6 rounded-lg shadow-md">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> sampai{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari{' '}
                  <span className="font-medium">{totalItems}</span> hasil
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      aria-current={currentPage === page ? 'page' : undefined}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-primary border-primary text-white' // Using primary color for active page
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4 mt-4"> 
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 flex items-center justify-center transition duration-300 ease-in-out"
            title="Kembali ke Dashboard"
          >
            <FaArrowLeft className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
