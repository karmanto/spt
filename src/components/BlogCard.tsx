import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { BlogPost } from '../lib/types';
import { format } from 'date-fns';
import { id, enUS, ru } from 'date-fns/locale';

interface BlogCardProps {
  post: BlogPost;
}

const getLocale = (lang: string) => {
  switch (lang) {
    case 'id': return id;
    case 'en': return enUS;
    case 'ru': return ru;
    default: return enUS;
  }
};

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const { language } = useLanguage();
  const currentLocale = getLocale(language);

  const formattedDate = post.created_at
    ? format(new Date(post.created_at), 'PPP', { locale: currentLocale })
    : '';

  const displayTitle = post.title[language] || post.title.en;
  const displayContent = post.content[language] || post.content.en;
  const displayCategory = post.category?.name[language] || post.category?.name.en;

  // Simple function to strip HTML and truncate
  const stripHtmlAndTruncate = (html: string, maxLength: number) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const textContent = doc.body.textContent || "";
    if (textContent.length > maxLength) {
      return textContent.substring(0, maxLength) + '...';
    }
    return textContent;
  };

  return (
    <div className="bg-surface rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <Link to={`/blog/${post.slug}`} className="block">
        {post.image && (
          <img
            src={post.image}
            alt={displayTitle}
            className="w-full h-56 object-cover object-center"
            loading="lazy"
          />
        )}
        <div className="p-6">
          {displayCategory && (
            <span className="inline-block bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
              {displayCategory}
            </span>
          )}
          <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
            {displayTitle}
          </h3>
          <p className="text-textSecondary text-sm mb-4">
            {formattedDate}
          </p>
          <p className="text-textSecondary text-base line-clamp-3">
            {stripHtmlAndTruncate(displayContent, 150)}
          </p>
          <span className="mt-4 inline-block text-primary hover:underline font-semibold">
            Read More &rarr;
          </span>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
