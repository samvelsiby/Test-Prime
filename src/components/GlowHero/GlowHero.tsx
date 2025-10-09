"use client";
import React, { useRef, useEffect } from 'react';
import styles from './GlowHero.module.css';

interface GlowHeroProps {
  title?: string;
  subtitle?: string;
  highlightText?: string;
}

const GlowHero: React.FC<GlowHeroProps> = ({
  title = "CONGRATULATIONS YOU ARE OFFICIALLY ENTERING YOUR PRIME",
  subtitle = "",
  highlightText = "WELCOME TO PRIME VERSE"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    // Create grid particles
    const particles: HTMLDivElement[] = [];
    const spacing = 25; // Space between particles (much denser grid)
    const cols = Math.ceil(window.innerWidth / spacing);
    const rows = Math.ceil(window.innerHeight / spacing);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const particle = document.createElement('div');
        particle.className = styles.particle;
        
        // Grid position
        particle.style.left = (col * spacing) + 'px';
        particle.style.top = (row * spacing) + 'px';
        
        // Store grid position for glow effect
        particle.setAttribute('data-x', String(col * spacing));
        particle.setAttribute('data-y', String(row * spacing));
        
        // Random animation delay for subtle variation
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);
        particles.push(particle);
      }
    }

    particlesRef.current = particles;

    // Spotlight mouse move handler using CSS custom properties
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update spotlight position using CSS variables for smooth performance
      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
      
      // Update spotlight element
      if (spotlight) {
        spotlight.style.left = `${x}px`;
        spotlight.style.top = `${y}px`;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    
    // Also add mouseenter to ensure it works when entering the container
    container.addEventListener('mouseenter', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseMove);
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Spotlight effect */}
      <div 
        ref={spotlightRef}
        className={styles.spotlight}
      />
      
      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>
          {title}
        </h1>
        <h2 className={styles.subtitle}>
          <span className={styles.highlight}>
            <svg className={styles.logo} width="24" height="24" viewBox="0 0 64 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_13_4)">
                <path d="M32.8061 0H21.2364C17.5916 0 13.5612 2.42502 12.2367 5.41464L10.6055 9.09228L8.80054 13.1587C9.52443 12.5848 10.4032 11.977 11.4464 11.4093C15.9447 8.95961 20.2501 9.01823 21.6853 9.09228H35.7554L32.8061 0Z" fill="url(#paint0_linear_13_4)"/>
                <path d="M61.607 0C56.4449 0 51.8866 2.76748 50.3788 6.81844L46.1523 18.1691L51.7096 33L64 0H61.607Z" fill="url(#paint1_linear_13_4)"/>
                <path d="M42.8489 9.30208L41.4043 5.4239C40.2062 2.19979 36.5804 0 32.4741 0H32.2023H21.1194C22.387 0.52758 23.6514 1.05825 24.9191 1.58583C27.9253 2.84153 30.1791 5.04441 31.1654 7.69157L35.8723 20.3319C38.1957 16.6543 40.5223 12.9766 42.8457 9.29899L42.8489 9.30208Z" fill="#015BF9"/>
                <path d="M46.1523 18.1691L42.8489 9.30208C40.5255 12.9797 38.1989 16.6574 35.8755 20.335L38.3285 26.9251C39.672 30.538 43.7372 33.0031 48.3398 33.0031H51.7095L46.1523 18.1722V18.1691Z" fill="url(#paint2_linear_13_4)"/>
                <path d="M0 33H4.48247C8.12723 33 12.1577 30.575 13.4822 27.5854L15.1955 23.7195H4.11578L0 33Z" fill="url(#paint3_linear_13_4)"/>
                <path d="M37.4687 12.5509C34.2823 13.9423 31.333 14.436 29.4015 14.6303H14.7466C11.1018 14.6303 7.07137 17.0553 5.74686 20.045L4.11572 23.7226H29.8535C33.4983 23.7226 37.5287 21.2976 38.8533 18.308L40.4844 14.6303C41.2715 12.8532 42.0586 11.0792 42.8489 9.30208C41.6477 10.277 39.8775 11.5019 37.4687 12.5509Z" fill="white"/>
              </g>
              <defs>
                <linearGradient id="paint0_linear_13_4" x1="30.1128" y1="4.19288" x2="21.8153" y2="5.73213" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EDECED"/>
                  <stop offset="1" stopColor="#EDECED"/>
                </linearGradient>
                <linearGradient id="paint1_linear_13_4" x1="48.2482" y1="24.497" x2="56.6041" y2="9.68157" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1200DE"/>
                  <stop offset="1" stopColor="#005AFF"/>
                </linearGradient>
                <linearGradient id="paint2_linear_13_4" x1="37.5857" y1="17.1572" x2="43.5523" y2="21.1902" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1101DE"/>
                  <stop offset="1" stopColor="#0157FA"/>
                </linearGradient>
                <linearGradient id="paint3_linear_13_4" x1="7.70681" y1="23.5714" x2="7.59238" y2="28.8443" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EDECED"/>
                  <stop offset="1" stopColor="#EDECED"/>
                </linearGradient>
                <clipPath id="clip0_13_4">
                  <rect width="64" height="33" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            {highlightText}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default GlowHero;
