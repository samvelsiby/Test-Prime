import React, { useEffect, useRef, useState } from 'react';
import styles from './DotGrid.module.css';

const DotGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Create a grid of dots
  const rows = 20;
  const cols = 40;
  const dots = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dots.push({ row: i, col: j });
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
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
    };
  }, []);

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
