import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Instagram as IgIcon } from 'lucide-react';
import { SiYoutube, SiTiktok, SiFacebook } from 'react-icons/si';
import { useLanguage } from '../context/LanguageContext';
// Import flag-icons CSS
import 'flag-icons/css/flag-icons.min.css';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 text-white" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div itemScope itemType="https://schema.org/Organization">
            <h3 className="text-xl font-bold mb-4" itemProp="name">Simbolon Phuket Tour</h3>
            <p className="text-gray-400 mb-4" itemProp="description">{t('footerTagline')}</p>
            {/* Social media links */}
            <div className="flex space-x-4" itemProp="sameAs">
              <a
                href="https://www.instagram.com/SimbolonPhuketTour"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('followInstagram')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <IgIcon size={20} />
              </a>
              <a
                href="https://www.youtube.com/@SimbolonPhuketTour"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('subscribeYoutube')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiYoutube size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@SimbolonPhuketTour"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('followTiktok')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiTiktok size={20} />
              </a>
              <a
                href="https://www.facebook.com/share/197Mwm5CWn/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('subscribeYoutube')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SiFacebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('packages')}</h3>
            <ul className="space-y-2">
              {[t('jbiLink'), t('phiPhiLink'), t('phuketCityLink')].map(item => (
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
            <ul className="space-y-4" itemScope itemType="https://schema.org/TravelAgency">
              <li className="flex items-start" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span className="fi fi-th mr-2 h-5 w-5 flex-shrink-0 mt-1" aria-label="Thailand" />
                <span className="text-gray-400">
                  <span itemProp="streetAddress">128/73 Pracha Uthit Rd. Ratsada</span>,
                  <span itemProp="addressLocality"> Mueang Phuket</span>,
                  <span itemProp="addressCountry"> Thailand</span> -
                  <span itemProp="postalCode">83000</span>
                </span>
              </li>
              <li className="flex items-start" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span className="fi fi-id mr-2 h-5 w-5 flex-shrink-0 mt-1" aria-label="Indonesia" />
                <span className="text-gray-400" itemProp="streetAddress">
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
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-blue-400 flex-shrink-0" />
                <a href="tel:+6282138161130" className="text-gray-400 hover:text-white transition-colors">
                  (+62) 821-3816-1130
                </a>
              </li>
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
            <h3 className="text-xl font-bold mb-4">{t('newsletterTitle')}</h3>
            <p className="text-gray-400 mb-4">{t('newsletterDesc')}</p>
            <form className="flex" aria-label={t('newsletterAria')}>
              <label htmlFor="newsletter-email" className="sr-only">{t('newsletterLabel')}</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder={t('newsletterPlaceholder')}
                className="px-4 py-2 w-full rounded-l-md text-gray-900 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors duration-300"
                aria-label={t('newsletterButtonAria')}
              >
                {t('newsletterButton')}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            {t('allRightsReserved').replace('2025', currentYear.toString())}
          </p>
          <div className="flex space-x-6">
            {[ 'privacyPolicy', 'termsOfService', 'sitemap' ].map(linkKey => (
              <a
                key={linkKey}
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t(linkKey)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
