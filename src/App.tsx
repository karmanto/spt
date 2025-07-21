// App.tsx
import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Login from './pages/Login';
import TourList from './pages/TourList';
import TourDetail from './pages/TourDetail';
import TourLayout from './layouts/TourLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import AdminPromos from './pages/admin/promos';
import CreatePromo from './pages/admin/promos/create';
import EditPromo from './pages/admin/promos/edit';
import ShowPromo from './pages/admin/promos/show';
import AdminTours from './pages/admin/tours';
import CreateTour from './pages/admin/tours/create';
import EditTour from './pages/admin/tours/edit';
import ShowTour from './pages/admin/tours/show';
import { setAuthErrorHandler } from './lib/auth';
import LoadingSpinner from './components/LoadingSpinner'; 

import IntlTourList from './pages/IntlTourList';
import IntlTourDetail from './pages/IntlTourDetail';
import IntlAdminTours from './pages/admin/intlTours';
import IntlCreateTour from './pages/admin/intlTours/create';
import IntlEditTour from './pages/admin/intlTours/edit';
import IntlShowTour from './pages/admin/intlTours/show';

import DomesticTourList from './pages/DomesticTourList';
import DomesticTourDetail from './pages/DomesticTourDetail';
import DomesticAdminTours from './pages/admin/domesticTours';
import DomesticCreateTour from './pages/admin/domesticTours/create';
import DomesticEditTour from './pages/admin/domesticTours/edit';
import DomesticShowTour from './pages/admin/domesticTours/show';

// New Blog Imports
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const AdminBlog = lazy(() => import('./pages/admin/blogs'));
const CreateBlog = lazy(() => import('./pages/admin/blogs/create'));
const EditBlog = lazy(() => import('./pages/admin/blogs/edit'));
const ShowBlog = lazy(() => import('./pages/admin/blogs/show'));

const LazyPromoSection = lazy(() => import('./components/PromoSection'));
const LazyTopPackages = lazy(() => import('./components/TopPackages'));

const LazyTestimonials = lazy(() => import('./components/Testimonials'));
const LazyAdvantages = lazy(() => import('./components/Advantages'));
const LazyAboutSection = lazy(() => import('./components/AboutSection'));
const LazyFAQ = lazy(() => import('./components/FAQ'));
const LazyGallery = lazy(() => import('./components/Gallery')); 

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Simbolon Phuket Tour - Halal Thailand Tours | Indonesian Guide | Phuket Bangkok Krabi';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Simbolon Phuket Tour - Your trusted partner for halal and comfortable travel in Thailand. We provide tour services with Indonesian-speaking guides, halal food, and customizable itineraries for Phuket, Bangkok, Krabi, and Phi Phi Island.'
      );
    }

    document.querySelectorAll('link[hreflang]').forEach(link => link.remove());

    const hreflangEn = document.createElement('link');
    hreflangEn.rel = 'alternate';
    hreflangEn.hreflang = 'en';
    hreflangEn.href = 'https://simbolonphukettour.com/';
    document.head.appendChild(hreflangEn);

    const hreflangId = document.createElement('link');
    hreflangId.rel = 'alternate';
    hreflangId.hreflang = 'id';
    hreflangId.href = 'https://simbolonphukettour.com/';
    document.head.appendChild(hreflangId);

    const hreflangRu = document.createElement('link');
    hreflangRu.rel = 'alternate';
    hreflangRu.hreflang = 'ru';
    hreflangRu.href = 'https://simbolonphukettour.com/ru';
    document.head.appendChild(hreflangRu);

    const hreflangDefault = document.createElement('link');
    hreflangDefault.rel = 'alternate';
    hreflangDefault.hreflang = 'x-default';
    hreflangDefault.href = 'https://simbolonphukettour.com/';
    document.head.appendChild(hreflangDefault);

    setAuthErrorHandler(() => {
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
      <div className="min-h-screen bg-white">
        <main role="main">
          <Routes>
            <Route path="/" element={
              <>
                <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
                <Hero />
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-gray-50"><LoadingSpinner /></div>}>
                  <LazyPromoSection />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-white"><LoadingSpinner /></div>}>
                  <LazyTopPackages />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-gray-50"><LoadingSpinner /></div>}>
                  <LazyTestimonials />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-white"><LoadingSpinner /></div>}>
                  <LazyAdvantages />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-gray-50"><LoadingSpinner /></div>}>
                  <LazyAboutSection />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-white"><LoadingSpinner /></div>}>
                  <LazyGallery />
                </Suspense>
                <Suspense fallback={<div className="flex justify-center items-center h-64 py-16 bg-white"><LoadingSpinner /></div>}>
                  <LazyFAQ />
                </Suspense>
                <Footer />
                <WhatsAppButton />
              </>
            } />

            <Route element={<TourLayout />}>
              <Route path="/tours" element={<TourList />} />
              <Route path="/tours/:slug" element={<TourDetail />} />
            </Route>

            <Route element={<TourLayout />}>
              <Route path="/international-tours" element={<IntlTourList />} />
              <Route path="/international-tours/:slug" element={<IntlTourDetail />} />
            </Route>

            <Route element={<TourLayout />}>
              <Route path="/domestic-tours" element={<DomesticTourList />} />
              <Route path="/domestic-tours/:slug" element={<DomesticTourDetail />} />
            </Route>

            <Route element={<TourLayout />}>
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
            </Route>
            <Route
              path="/admin/promos"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminPromos />} />
              <Route path="create" element={<CreatePromo />} />
              <Route path="edit/:id" element={<EditPromo />} />
              <Route path=":id" element={<ShowPromo />} />
            </Route>
            <Route
              path="/admin/tours"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminTours />} />
              <Route path="create" element={<CreateTour />} />
              <Route path="edit/:id" element={<EditTour />} />
              <Route path=":id" element={<ShowTour />} />
            </Route>
            <Route
              path="/admin/international-tours"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<IntlAdminTours />} />
              <Route path="create" element={<IntlCreateTour />} />
              <Route path="edit/:id" element={<IntlEditTour />} />
              <Route path=":id" element={<IntlShowTour />} />
            </Route>
            <Route
              path="/admin/domestic-tours"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DomesticAdminTours />} />
              <Route path="create" element={<DomesticCreateTour />} />
              <Route path="edit/:id" element={<DomesticEditTour />} />
              <Route path=":id" element={<DomesticShowTour />} />
            </Route>
            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminBlog />} />
              <Route path="create" element={<CreateBlog />} />
              <Route path="edit/:id" element={<EditBlog />} />
              <Route path=":id" element={<ShowBlog />} />
            </Route>
          </Routes>
        </main>
      </div>
  );
}

export default App;
