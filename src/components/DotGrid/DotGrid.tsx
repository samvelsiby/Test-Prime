import React, { useEffect, useRef, useState } from 'react';
import styles from './DotGrid.module.css';

const DotGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Create a grid of dots
  const rows = 40;
  const cols = 80;
  const dots = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dots.push({ row: i, col: j });
    }
  }

  useEffect(() => {
    let animationFrameId: number;
    
    const updateDotBrightness = () => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      
      const mouseX = mousePos.x + containerRect.left;
      const mouseY = mousePos.y + containerRect.top;
      
      dotRefs.current.forEach((dot) => {
        if (!dot) return;
        
        const rect = dot.getBoundingClientRect();
        const dotCenterX = rect.left + rect.width / 2;
        const dotCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from mouse to dot center
        const distance = Math.sqrt(
          Math.pow(mouseX - dotCenterX, 2) +
          Math.pow(mouseY - dotCenterY, 2)
        );
        
        // Maximum distance for effect (in pixels)
        const maxDistance = 150;
        
        if (distance < maxDistance) {
          // Calculate brightness based on distance (closer = brighter)
          const brightness = 1 - (distance / maxDistance);
          const opacity = 0.5 + (brightness * 0.5); // Range from 0.5 to 1
          
          dot.style.opacity = opacity.toString();
        } else {
          dot.style.opacity = '0.5';
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(updateDotBrightness);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (containerRef.current && e.touches.length > 0) {
        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        setMousePos({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        });
        
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(updateDotBrightness);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div 
        className={styles.cursorGlow}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />
      
      <div className={styles.dotGrid}>
        {dots.map((dot, index) => (
          <div
            key={index}
            ref={(el) => {
              dotRefs.current[index] = el;
            }}
            className={styles.dot}
            style={{
              '--row': dot.row,
              '--col': dot.col,
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      <div className={styles.content}>
        <h1 className={styles.title}>
          CONGRATULATIONS YOU ARE OFFICIALLY
        </h1>
        <h2 className={styles.subtitle}>
          ENTERING YOUR PRIME
        </h2>
        <div className={styles.button}>
          WELCOME TO PRIME VERSE
        </div>
      </div>
    </div>
  );
};

export default DotGrid;
