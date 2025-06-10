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

  // SEO disini
  useEffect(() => {
    document.title = 'Simbolon Phuket Tour - Halal & Comfortable Travel in Thailand';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Your trusted partner for halal and comfortable travel in Thailand. We provide tour services with Indonesian-speaking guides, halal food, and customizable itineraries.');
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
        <main>
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