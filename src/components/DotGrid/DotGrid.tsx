import React, { useEffect, useRef, useState } from 'react';
import styles from './DotGrid.module.css';

const DotGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gridSize, setGridSize] = useState({ rows: 40, cols: 80 });
  
  // Dynamic grid sizing based on screen size - maintaining 2:1 aspect ratio
  useEffect(() => {
    const updateGridSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Base grid size for reference (40x80 = 2:1 ratio)
      const baseRows = 40;
      const baseCols = 80;
      const aspectRatio = baseCols / baseRows; // 2:1
      
      let scaleFactor = 1;
      
      if (width >= 3840) {
        // 4K+ screens - 1.5x scale
        scaleFactor = 1.5;
      } else if (width >= 2560) {
        // 1440p+ screens - 1.25x scale
        scaleFactor = 1.25;
      } else if (width >= 1920) {
        // 1080p+ screens - 1.125x scale
        scaleFactor = 1.125;
      } else if (width >= 1400) {
        // Large desktop - 1x scale
        scaleFactor = 1;
      } else if (width >= 1200) {
        // Desktop - 0.875x scale
        scaleFactor = 0.875;
      } else if (width >= 1024) {
        // Tablet landscape - 0.75x scale
        scaleFactor = 0.75;
      } else if (width >= 768) {
        // Tablet portrait - 0.625x scale
        scaleFactor = 0.625;
      } else if (width >= 480) {
        // Mobile landscape - 0.5x scale
        scaleFactor = 0.5;
      } else {
        // Mobile portrait - 0.4x scale
        scaleFactor = 0.4;
      }
      
      // Calculate rows and cols maintaining aspect ratio
      const rows = Math.round(baseRows * scaleFactor);
      const cols = Math.round(baseCols * scaleFactor);
      
      setGridSize({ rows, cols });
    };

    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, []);

  // Create a grid of dots based on dynamic size
  const dots = [];
  for (let i = 0; i < gridSize.rows; i++) {
    for (let j = 0; j < gridSize.cols; j++) {
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
        const maxDistance = 500;
        
        if (distance < maxDistance) {
          // Calculate brightness based on distance (closer = brighter)
          const brightness = 1 - (distance / maxDistance);
          const opacity = brightness; // Range from 0 to 1
          
          dot.style.opacity = opacity.toString();
        } else {
          dot.style.opacity = '0';
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
      
      <div 
        className={styles.dotGrid}
        style={{
          '--rows': gridSize.rows,
          '--cols': gridSize.cols,
        } as React.CSSProperties}
      >
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
