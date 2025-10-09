import { useEffect, useRef } from 'react';

const ParticleSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const maxParticles = 40;
    const particles: HTMLDivElement[] = [];

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size (mostly small)
      const sizes = ['small', 'small', 'small', 'medium']; // 75% small, 25% medium
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      particle.classList.add(size);
      
      // Only place particles in non-video areas
      const isTopArea = Math.random() > 0.5;
      
      if (isTopArea) {
        // Top area (above video)
        particle.style.top = Math.random() * 20 + '%';
      } else {
        // Bottom area (below video)  
        particle.style.top = (70 + Math.random() * 30) + '%';
      }
      
      // Random horizontal position
      particle.style.left = Math.random() * 100 + '%';
      
      // Random animation delay for twinkling effect
      particle.style.animationDelay = Math.random() * 3 + 's';
      
      container.appendChild(particle);
      particles.push(particle);
    };

    // Create particles
    for (let i = 0; i < maxParticles; i++) {
      createParticle();
    }

    // Cleanup function
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return <div id="particles-container" ref={containerRef}></div>;
};

export default ParticleSystem;