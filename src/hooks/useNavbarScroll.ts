import { useEffect } from 'react';

export const useNavbarScroll = () => {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar') as HTMLElement;
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        } else {
          navbar.style.background = 'rgba(0, 0, 0, 0.1)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};