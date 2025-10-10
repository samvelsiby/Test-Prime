import React, { useEffect, useRef, useState, useMemo } from 'react';

interface DotPosition {
  x: number;
  y: number;
  element: HTMLElement;
}

const DotGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotGridRef = useRef<HTMLDivElement>(null);
  const dotPositionsRef = useRef<DotPosition[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gridSize, setGridSize] = useState({ rows: 40, cols: 80 });
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  
  // Dynamic grid sizing based on screen size
  useEffect(() => {
    const updateGridSize = () => {
      const width = window.innerWidth;
      
      const baseRows = 40;
      const baseCols = 80;
      
      let scaleFactor = 1;
      
      if (width >= 3840) scaleFactor = 1.5;
      else if (width >= 2560) scaleFactor = 1.25;
      else if (width >= 1920) scaleFactor = 1.125;
      else if (width >= 1400) scaleFactor = 1;
      else if (width >= 1200) scaleFactor = 0.875;
      else if (width >= 1024) scaleFactor = 0.75;
      else if (width >= 768) scaleFactor = 0.625;
      else if (width >= 480) scaleFactor = 0.5;
      else scaleFactor = 0.4;
      
      const rows = Math.round(baseRows * scaleFactor);
      const cols = Math.round(baseCols * scaleFactor);
      
      setGridSize({ rows, cols });
    };

    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, []);

  // Pre-calculate dot positions after grid renders
  useEffect(() => {
    if (!dotGridRef.current) return;
    
    const updatePositions = () => {
      if (!dotGridRef.current) return;
      const gridRect = dotGridRef.current.getBoundingClientRect();
      const dots = dotGridRef.current.children;
      const positions: DotPosition[] = [];
      
      for (let i = 0; i < dots.length; i++) {
        const dotRect = dots[i].getBoundingClientRect();
        positions.push({
          x: dotRect.left + dotRect.width / 2 - gridRect.left,
          y: dotRect.top + dotRect.height / 2 - gridRect.top,
          element: dots[i] as HTMLElement
        });
      }
      
      dotPositionsRef.current = positions;
      setContainerRect(gridRect);
    };
    
    // Small delay to ensure layout is complete
    const timer = setTimeout(updatePositions, 100);
    
    window.addEventListener('resize', updatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
    };
  }, [gridSize]);

  // Optimized mouse tracking and dot updates
  useEffect(() => {
    let animationFrameId: number;
    
    const updateDotBrightness = (mouseX: number, mouseY: number) => {
      if (!containerRect || dotPositionsRef.current.length === 0) return;
      
      const maxDistance = 500;
      const maxDistanceSquared = maxDistance * maxDistance;
      
      const positions = dotPositionsRef.current;
      const len = positions.length;
      
      for (let i = 0; i < len; i++) {
        const pos = positions[i];
        const dx = mouseX - pos.x;
        const dy = mouseY - pos.y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const opacity = 1 - (distance / maxDistance);
          pos.element.style.opacity = opacity.toString();
        } else {
          pos.element.style.opacity = '0';
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRect) return;
      
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;
      
      setMousePos({ x, y });
      
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => updateDotBrightness(x, y));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRect || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const x = touch.clientX - containerRect.left;
      const y = touch.clientY - containerRect.top;
      
      setMousePos({ x, y });
      
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => updateDotBrightness(x, y));
    };

    const container = containerRef.current;
    if (container && containerRect) {
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
  }, [containerRect]);

  // Memoize dots array
  const dots = useMemo(() => {
    const result = [];
    for (let i = 0; i < gridSize.rows * gridSize.cols; i++) {
      result.push(i);
    }
    return result;
  }, [gridSize.rows, gridSize.cols]);

  return (
    <div className="container" ref={containerRef}>
          <div
        ref={dotGridRef}
        className="dotGrid"
            style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
        }}
      >
        {dots.map((index) => (
          <div key={index} className="dot" />
        ))}
      </div>
      
      <div className="content">
        <h1 className="title">
          PRIMEVERSE WAS BUILT TO FIX EVERYTHING THE INDUSTRY GETS WRONG<br />
          GIVING TRADERS REAL EDUCATION, REAL SUPPORT, AND REAL RESULTS
        </h1>
        <div className="button">
          FOR $0. FOREVER.
        </div>
      </div>
      
      <style jsx>{`
        .container {
          width: 100%;
          min-height: 40vh;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          padding: 40px 20px;
        }

        .dotGrid {
          display: grid;
          gap: 12px;
          max-width: 1400px;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          aspect-ratio: 2 / 1;
        }

        .dot {
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #0e90e0;
          opacity: 0;
          will-change: opacity;
        }

        .content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 1200px;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .title {
          font-size: 1.6rem;
          font-weight: normal;
          color: #ffffff;
          letter-spacing: 0.01em;
          margin: 0 0 0 0;
          text-transform: uppercase;
          font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          line-height: 1.1;
          max-width: 1200px;
          white-space: nowrap;
        }

        .button {
          display: inline-block;
          padding: 8px 100px;
          font-size: 2.5rem;
          font-weight: normal;
          color: #ffffff;
          background: linear-gradient(135deg, #0900FF 0%, #0040FF 100%);
          border-radius: 16px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0 0 15px rgba(9, 0, 255, 0.3),
            0 0 30px rgba(0, 64, 255, 0.2),
            0 0 45px rgba(0, 64, 255, 0.1);
          animation: buttonGlow 2s ease-in-out infinite;
          font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .button:hover {
          transform: scale(1.05);
          box-shadow: 
            0 0 20px rgba(9, 0, 255, 0.4),
            0 0 40px rgba(0, 64, 255, 0.3),
            0 0 60px rgba(0, 64, 255, 0.2);
        }

        @keyframes buttonGlow {
          0%, 100% {
            box-shadow: 
              0 0 15px rgba(9, 0, 255, 0.3),
              0 0 30px rgba(0, 64, 255, 0.2),
              0 0 45px rgba(0, 64, 255, 0.1);
          }
          50% {
            box-shadow: 
              0 0 20px rgba(9, 0, 255, 0.4),
              0 0 40px rgba(0, 64, 255, 0.3),
              0 0 60px rgba(0, 64, 255, 0.2);
          }
        }

        @media (max-width: 1024px) {
          .title { font-size: 1.3rem; margin: 0 0 0 0; line-height: 1.1; font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; white-space: nowrap; }
          .button { font-size: 2rem; padding: 6px 80px; font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
          .dotGrid { gap: 9px; }
          .dot { width: 1.5px; height: 1.5px; }
          .container { padding: 35px 20px; }
        }

        @media (max-width: 768px) {
          .container { min-height: 35vh; padding: 30px 15px; }
          .title { font-size: 1rem; line-height: 1.1; margin: 0 0 0 0; font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; white-space: nowrap; }
          .button { font-size: 1.5rem; padding: 5px 60px; font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
          .dotGrid { gap: 7.5px; }
          .dot { width: 1.25px; height: 1.25px; }
        }

        @media (max-width: 480px) {
          .container { padding: 25px 10px; min-height: 30vh; }
          .title { font-size: 0.75rem; margin: 0 0 0 0; line-height: 1.1; font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; white-space: nowrap; }
          .button { font-size: 1.1rem; padding: 4px 40px; font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
          .dotGrid { gap: 6px; }
          .dot { width: 1px; height: 1px; }
        }
      `}</style>
    </div>
  );
};

export default DotGrid;