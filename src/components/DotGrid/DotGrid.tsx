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
  const [gridSize, setGridSize] = useState({ rows: 60, cols: 120 });
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  
  // Dynamic grid sizing based on screen size
  useEffect(() => {
    const updateGridSize = () => {
      const width = window.innerWidth;
      
      const baseRows = 60;
      const baseCols = 120;
      
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
    
    // Use requestAnimationFrame for immediate rendering
    requestAnimationFrame(() => {
      updatePositions();
    });
    
    window.addEventListener('resize', updatePositions);
    return () => {
      window.removeEventListener('resize', updatePositions);
    };
  }, [gridSize]);

  // Optimized mouse tracking and dot updates
  useEffect(() => {
    let animationFrameId: number;
    
    const updateDotBrightness = (mouseX: number, mouseY: number) => {
      if (!containerRect || dotPositionsRef.current.length === 0) return;
      
      const maxDistance = 400;
      const maxDistanceSquared = maxDistance * maxDistance;
      
      const positions = dotPositionsRef.current;
      const len = positions.length;
      
      // Batch DOM updates
      for (let i = 0; i < len; i++) {
        const pos = positions[i];
        const dx = mouseX - pos.x;
        const dy = mouseY - pos.y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const opacity = Math.max(0, 1 - (distance / maxDistance));
          pos.element.style.opacity = opacity.toFixed(2);
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
          width: 100vw;
          min-height: clamp(40vh, 50vh, 60vh);
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          padding: 0;
          margin: 0;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
        }

        .dotGrid {
          display: grid;
          gap: clamp(6px, 1vw, 16px);
          width: 100vw;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: clamp(20px, 3vw, 60px);
        }

        .dot {
          width: clamp(1px, 0.3vw, 6px);
          height: clamp(1px, 0.3vw, 6px);
          border-radius: 50%;
          background: #0e90e0;
          opacity: 0;
          will-change: opacity;
        }

        .content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: clamp(300px, 80vw, 1200px);
          padding: 0 clamp(8px, 2vw, 20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .title {
          font-size: clamp(0.7rem, 4vw, 1.6rem);
          font-weight: normal;
          color: #ffffff;
          letter-spacing: 0.01em;
          margin: 0 0 0 0;
          text-transform: uppercase;
          font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          line-height: 1.1;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .button {
          display: inline-block;
          padding: clamp(4px, 1vw, 8px) clamp(25px, 8vw, 100px);
          font-size: clamp(1rem, 5vw, 2.5rem);
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
          max-width: 90%;
          white-space: normal;
          text-align: center;
          line-height: 1.2;
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
          .title { margin: 0 0 0 0; line-height: 1.1; font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; white-space: nowrap; }
          .button { 
            font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
          }
          .dotGrid { gap: 8px; padding: 30px; }
          .dot { width: 2px; height: 2px; }
          .container { padding: 0; }
        }

        @media (max-width: 768px) {
          .container { min-height: 40vh; padding: 0; }
          .title { 
            line-height: 1.2; 
            margin: 0 0 0 0; 
            font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
          }
          .button { 
            font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
          }
          .dotGrid { gap: 7px; padding: 20px; }
          .dot { width: 1.5px; height: 1.5px; }
        }

        @media (min-width: 1920px) {
          .title { margin: 0 0 0 0; line-height: 1.1; font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; white-space: nowrap; }
          .button { 
            font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
          }
        }

        @media (min-width: 2560px) {
          .title { margin: 0 0 0 0; line-height: 1.1; font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; white-space: nowrap; }
          .button { 
            font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
          }
        }

        @media (min-width: 3840px) {
          .container { padding: 0; min-height: 70vh; }
          .title { font-size: 4.8rem; margin: 0 0 0 0; line-height: 1.1; font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; white-space: nowrap; }
          .button { 
            font-size: 7.5rem; 
            padding: 24px 300px; 
            font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
          }
          .dotGrid { gap: 18px; padding: 80px; }
          .dot { width: 5px; height: 5px; }
        }

        @media (max-width: 480px) {
          .container { padding: 0; min-height: 35vh; }
          .title { 
            margin: 0 0 0 0; 
            line-height: 1.2; 
            font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
          }
          .button { 
            font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
          }
          .dotGrid { gap: 6px; padding: 15px; }
          .dot { width: 1.2px; height: 1.2px; }
        }

        @media (max-width: 360px) {
          .container { padding: 0; min-height: 30vh; }
          .title { 
            margin: 0 0 0 0; 
            line-height: 1.2; 
            font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
          }
          .button { 
            font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
          }
          .dotGrid { gap: 5px; padding: 12px; }
          .dot { width: 1px; height: 1px; }
        }
      `}</style>
    </div>
  );
};

export default DotGrid;