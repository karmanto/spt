import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.substring(1); // Remove the '#'
      console.log(`[ScrollToTop] Attempting to scroll to ID: ${id}`);

      // Use a longer timeout to ensure lazy-loaded components have time to render
      const scrollTimeout = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          console.log(`[ScrollToTop] Element with ID "${id}" found. Scrolling...`);
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn(`[ScrollToTop] Element with ID "${id}" not found after 1000ms. Make sure the element exists and has the correct ID.`);
        }
      }, 1000); // Increased delay to 1 second

      return () => clearTimeout(scrollTimeout); // Cleanup timeout on unmount or dependency change
    } else {
      // If no hash, scroll to the top of the page
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Re-run effect when pathname or hash changes

  return null;
};

export default ScrollToTop;
