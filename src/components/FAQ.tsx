import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import faqData from '../data/faq.json';

const FAQ: React.FC = () => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 3;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const displayedFaqs = showAll ? faqData.faqs : faqData.faqs.slice(0, initialDisplayCount);

  const getQuestion = (faq: typeof faqData.faqs[0]) => {
    return language === 'id' ? faq.questionId : faq.questionEn;
  };

  const getAnswer = (faq: typeof faqData.faqs[0]) => {
    return language === 'id' ? faq.answerId : faq.answerEn;
  };

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            data-aos="fade-up"
          >
            {t('faqTitle')}
          </h2>
          <p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t('faqSubtitle')}
          </p>
        </div>
        
        <div className="space-y-4">
          {displayedFaqs.map((faq, index) => (
            <div 
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-lg font-medium text-gray-900">{getQuestion(faq)}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index ? 'max-h-96 py-4' : 'max-h-0 py-0'
                }`}
              >
                <div className="px-6 text-gray-600">{getAnswer(faq)}</div>
              </div>
            </div>
          ))}
        </div>

        {faqData.faqs.length > initialDisplayCount && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300"
            >
              {showAll ? t('show less') : t('show more')}
            </button>
          </div>
        )}
        
        <div 
          className="mt-12 text-center"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('cancellationPolicyTitle')}</h3>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="font-medium text-gray-700 mb-2">{t('cancellationPolicySubtitle')}</p>
            <ul className="space-y-2 text-gray-600 text-left">
              <li>• {t('over30days')}</li>
              <li>• {t('within15to29days')}</li>
              <li>• {t('within1to14days')}</li>
              <li>• {t('noShow')}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;