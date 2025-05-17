import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TopPackages: React.FC = () => {
  const { t } = useLanguage();

  const packages = [
    {
      id: 1,
      title: 'James Bond Island',
      description: 'Explore the famous island featured in the James Bond movie "The Man with the Golden Gun".',
      image: 'https://images.pexels.com/photos/1450354/pexels-photo-1450354.jpeg?auto=compress&cs=tinysrgb&w=1600',
      price: 'Rp 1.500.000',
    },
    {
      id: 2,
      title: 'Phi Phi Island',
      description: 'Visit the stunning Phi Phi Islands with crystal clear waters and white sandy beaches.',
      image: 'https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg?auto=compress&cs=tinysrgb&w=1600',
      price: 'Rp 1.800.000',
    },
    {
      id: 3,
      title: 'Phuket City Tour',
      description: 'Discover the cultural and historical sites of Phuket City with our guided tour.',
      image: 'https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&w=1600',
      price: 'Rp 900.000',
    },
    {
      id: 4,
      title: 'Krabi Day Tour',
      description: 'Experience the breathtaking landscapes of Krabi with our full-day tour package.',
      image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1600',
      price: 'Rp 2.200.000',
    },
    {
      id: 5,
      title: 'Bangkok Floating Market',
      description: 'Explore the unique and vibrant floating markets of Bangkok with local guides.',
      image: 'https://images.pexels.com/photos/1167023/pexels-photo-1167023.jpeg?auto=compress&cs=tinysrgb&w=1600',
      price: 'Rp 1.700.000',
    },
    {
      id: 6,
      title: 'Custom Itinerary',
      description: 'Create your own personalized Thailand adventure with our custom itinerary service.',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=1600',
      price: 'Mulai dari Rp 1.000.000',
    },
  ];

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('topPackagesTitle')}
          </h2>
          <p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('topPackagesSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div 
              key={pkg.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">{pkg.price}</span>
                  <a 
                    href={`#package-${pkg.id}`} 
                    className="inline-flex items-center px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary bg-white hover:bg-blue-50 transition-colors duration-300"
                  >
                    {t('viewDetails')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopPackages;