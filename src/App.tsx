// App.tsx
import { useState, useEffect } from 'react';
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
import { LanguageProvider } from './context/LanguageContext';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // SEO here: Dynamic meta tags and structured data updates
  useEffect(() => {
    // SEO here: Set page title dynamically
    document.title = 'Simbolon Phuket Tour - Halal Thailand Tours | Indonesian Guide | Phuket Bangkok Krabi';
    
    // SEO here: Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Simbolon Phuket Tour - Your trusted partner for halal and comfortable travel in Thailand. We provide tour services with Indonesian-speaking guides, halal food, and customizable itineraries for Phuket, Bangkok, Krabi, and Phi Phi Island.');
    }

    // SEO here: Add hreflang for multilingual support
    const existingHreflang = document.querySelectorAll('link[hreflang]');
    existingHreflang.forEach(link => link.remove());

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
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        {/* SEO here: Semantic HTML structure with proper heading hierarchy */}
        <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
        <main role="main">
          <Hero />
          <PromoSection />
          <TopPackages />
          <Testimonials />
          <Advantages />
          <AboutSection />
          <Gallery />
          <FAQ />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  );
}

export default App;