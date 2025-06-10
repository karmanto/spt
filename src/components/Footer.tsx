import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Instagram as IgIcon } from 'lucide-react'; // or use lucide-react's Instagram icon
import { SiYoutube, SiTiktok } from 'react-icons/si';
import { useLanguage } from '../context/LanguageContext';
// Import flag-icons CSS
import 'flag-icons/css/flag-icons.min.css';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            {/* SEO here: Company name as heading */}
            <h3 className="text-xl font-bold mb-4">Simbolon Phuket Tour</h3>
            <p className="text-gray-400 mb-4">
              SPT: Tour Lokal Rasa Indonesia di Thailand
            </p>
            {/* SEO here: Social media links with proper attributes */}
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/SimbolonPhuketTour"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow Simbolon Phuket Tour on Instagram"
              >
                <IgIcon size={20} />
              </a>
              <a
                href="https://www.youtube.com/@SimbolonPhuketTour"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Subscribe to Simbolon Phuket Tour YouTube channel"
              >
                <SiYoutube size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@SimbolonPhuketTour"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow Simbolon Phuket Tour on TikTok"
              >
                <SiTiktok size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('packages')}</h3>
            {/* SEO here: Internal navigation links */}
            <ul className="space-y-2">
              {['James Bond Island', 'Phi Phi Island', 'Phuket City Tour'].map(item => (
                <li key={item}>
                  <a href="#packages" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('contact')}</h3>
            {/* SEO here: Contact information with structured data */}
            <ul className="space-y-4" itemScope itemType="https://schema.org/TravelAgency">
              {/* Thailand location */}
              <li className="flex items-start" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span className="fi fi-th mr-2 h-5 w-5 flex-shrink-0 mt-1" aria-label="Thailand" />
                <span className="text-gray-400">
                  <span itemProp="streetAddress">128/73 Pracha Uthit Rd. Ratsada</span>
                  <span itemProp="addressLocality"> Mueang Phuket</span>, 
                  <span itemProp="addressCountry"> Thailand</span> - 
                  <span itemProp="postalCode">83000</span>
                </span>
              </li>
              {/* Indonesia location */}
              <li className="flex items-start">
                <span className="fi fi-id mr-2 h-5 w-5 flex-shrink-0 mt-1" aria-label="Indonesia" />
                <span className="text-gray-400">
                  Jl. Keramat Indah No.9, Medan Tenggara, Kec. Medan Denai, Kota Medan, Sumatera Utara 20228
                </span>
              </li>
              {/* Phone numbers with structured data */}
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <a href="tel:+6281363878631" className="text-gray-400 hover:text-white transition-colors" itemProp="telephone">
                  (+62) 813-6387-8631
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <a href="tel:+6285275106059" className="text-gray-400 hover:text-white transition-colors">
                  (+62) 852-7510-6059
                </a>
              </li>
              {/* Email with structured data */}
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <a href="mailto:simbolonphukettour@gmail.com" className="text-gray-400 hover:text-white transition-colors" itemProp="email">
                  simbolonphukettour@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get special offers and updates.
            </p>
            {/* SEO here: Newsletter form with proper labels */}
            <form className="flex" aria-label="Newsletter subscription">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-md text-gray-900 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors duration-300"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          {/* SEO here: Copyright information */}
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            {t('allRightsReserved').replace('2025', currentYear.toString())}
          </p>
          {/* SEO here: Footer links */}
          <div className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(link => (
              <a key={link} href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;