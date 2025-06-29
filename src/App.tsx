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
// import { LanguageProvider } from './context/LanguageContext'; // No longer needed here
import TourList from './pages/TourList';
import TourDetail from './pages/TourDetail';
import TourLayout from './layouts/TourLayout';

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
    document.head.appendChild(hreflangDefault); // Corrected typo here
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
          </Routes>
        </main>
      </div>
    // </LanguageProvider>
  );
}

export default App;
