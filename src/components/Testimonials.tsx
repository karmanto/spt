import React from 'react';
import { useLanguage } from '../context/LanguageContext'; // Pastikan ini sesuai path Anda
import testimonialsData from '../data/testimonials.json'; // Sesuaikan path jika berbeda

const Testimonials: React.FC = () => {
  const { t, language } = useLanguage(); // Dapatkan bahasa aktif ('id' atau 'en')

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* SEO here: H2 heading for testimonials section */}
          <h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('testimoni')}
          </h2>
          <p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('testimoniDetail')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <article 
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md"
              data-aos="fade-up"
              data-aos-delay={index * 100 + 200}
              // SEO here: Structured data for reviews
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="flex items-center mb-4">
                {/* SEO here: Customer image with proper alt text */}
                <img 
                  src={testimonial.image} 
                  alt={`${testimonial.name} - Customer from ${testimonial.location}`} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  {/* SEO here: Customer name with structured data */}
                  <h3 className="text-lg font-bold text-gray-900" itemProp="author" itemScope itemType="https://schema.org/Person">
                    <span itemProp="name">{testimonial.name}</span>
                  </h3>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
              {/* SEO here: Star rating with structured data */}
              <div className="flex mb-4" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
                <meta itemProp="bestRating" content="5" />
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg 
                    key={i}
                    className="w-5 h-5 text-yellow-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              {/* SEO here: Review text with structured data */}
              <p className="text-gray-700 italic" itemProp="reviewBody">
                "{
                  language === 'id'
                    ? testimonial.comment_id
                    : language === 'ru'
                    ? testimonial.comment_ru
                    : testimonial.comment_en
                }"
              </p>
              {/* SEO here: Hidden structured data for review subject */}
              <meta itemProp="itemReviewed" itemScope itemType="https://schema.org/TravelAgency" content="Simbolon Phuket Tour" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;