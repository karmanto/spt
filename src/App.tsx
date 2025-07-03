// App.tsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import PromoSection from './components/PromoSection';
import TopPackages from './components/TopPackages';
import Testimonials from './components/Testimonials';
import Advantages from './components/Advantages';
import AboutSection from './components/AboutSection';
import Gallery from './components/Gallery';
import FAQ from './components/FAQ';
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
import CreatePromo from './pages/admin/promos/create'; // Import CreatePromo
import EditPromo from './pages/admin/promos/edit';     // Import EditPromo
import ShowPromo from './pages/admin/promos/show';     // Import ShowPromo
import AdminTours from './pages/admin/tours';          // Import AdminTours
import CreateTour from './pages/admin/tours/create';   // Import CreateTour
import EditTour from './pages/admin/tours/edit';       // Import EditTour
import ShowTour from './pages/admin/tours/show';       // Import ShowTour

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set page title dynamically
    document.title = 'Simbolon Phuket Tour - Halal Thailand Tours | Indonesian Guide | Phuket Bangkok Krabi';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Simbolon Phuket Tour - Your trusted partner for halal and comfortable travel in Thailand. We provide tour services with Indonesian-speaking guides, halal food, and customizable itineraries for Phuket, Bangkok, Krabi, and Phi Phi Island.'
      );
    }

    // Remove any existing hreflang links
    document.querySelectorAll('link[hreflang]').forEach(link => link.remove());

    // English
    const hreflangEn = document.createElement('link');
    hreflangEn.rel = 'alternate';
    hreflangEn.hreflang = 'en';
    hreflangEn.href = 'https://simbolonphukettour.com/';
    document.head.appendChild(hreflangEn);

    // Indonesian
    const hreflangId = document.createElement('link');
    hreflangId.rel = 'alternate';
    hreflangId.hreflang = 'id';
    hreflangId.href = 'https://simbolonphukettour.com/';
    document.head.appendChild(hreflangId);

    // Russian
    const hreflangRu = document.createElement('link');
    hreflangRu.rel = 'alternate';
    hreflangRu.hreflang = 'ru';
    hreflangRu.href = 'https://simbolonphukettour.com/ru'; 
    document.head.appendChild(hreflangRu);

    // Default
    const hreflangDefault = document.createElement('link');
    hreflangDefault.rel = 'alternate';
    hreflangDefault.hreflang = 'x-default';
    hreflangDefault.href = 'https://simbolonphukettour.com/';
    document.head.appendChild(hreflangDefault);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    // <LanguageProvider> // LanguageProvider is now in main.tsx
      <div className="min-h-screen bg-white">
        <main role="main">
          <Routes>
            <Route path="/" element={
              <>
                <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
                <Hero />
                <PromoSection />
                <TopPackages />
                <Testimonials />
                <Advantages />
                <AboutSection />
                <Gallery />
                <FAQ />
                <Footer />
                <WhatsAppButton />
              </>
            } />

            <Route element={<TourLayout />}>
              <Route path="/tours" element={<TourList />} />
              <Route path="/tours/:id" element={<TourDetail />} />
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
          </Routes>
        </main>
      </div>
  );
}

export default App;
