import { useCallback } from 'react';

export const useSmoothScroll = () => {
  const scrollToElement = useCallback((href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, []);

  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToElement(href);
  }, [scrollToElement]);

  return { handleSmoothScroll, scrollToElement };
};