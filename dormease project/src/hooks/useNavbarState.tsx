
import { useState, useEffect } from 'react';

export const useNavbarState = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<number | null>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolling to true when user is actively scrolling
      if (currentScrollY !== lastScrollY) {
        setIsScrolling(true);
        setLastScrollY(currentScrollY);
      }
      
      // Clear any existing timeout
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }
      
      // Set a new timeout to detect when scrolling stops
      const timeout = window.setTimeout(() => {
        setIsScrolling(false);
      }, 200); // Slightly increased timeout for smoother transition
      
      setScrollTimeout(timeout as unknown as number);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollY, scrollTimeout]);

  return { isScrolling, lastScrollY };
};
