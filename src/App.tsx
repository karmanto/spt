import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Header 
          mobileMenuOpen={mobileMenuOpen} 
          toggleMobileMenu={toggleMobileMenu} 
        />
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