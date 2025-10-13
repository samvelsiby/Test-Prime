import React, { useEffect, useRef, useState } from 'react';

const DotGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight * 0.6
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);
    
    const spacing = 20;
    const dotRadius = 2;
    const mouseRadius = 200;
    
    const dots: {x: number, y: number}[] = [];
    for (let x = spacing; x < dimensions.width; x += spacing) {
      for (let y = spacing; y < dimensions.height; y += spacing) {
        dots.push({ x, y });
      }
    }
    
    let mouseX = -1000;
    let mouseY = -1000;
    
    const draw = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      dots.forEach(dot => {
        const dx = mouseX - dot.x;
        const dy = mouseY - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let opacity = 0.3; // Base visibility for all dots
        let scale = 1;
        
        if (distance < mouseRadius) {
          const factor = 1 - (distance / mouseRadius);
          // Smooth easing function
          const eased = factor * factor * (3 - 2 * factor);
          opacity = 0.3 + eased * 0.7; // Fade to full opacity
          scale = 1 + eased * 1.5; // Scale up to 2.5x size
        }
        
        ctx.fillStyle = `rgba(14, 144, 224, ${opacity})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius * scale, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      draw();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseX = touch.clientX - rect.left;
      mouseY = touch.clientY - rect.top;
      draw();
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    draw();
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [dimensions]);

  return (
    <div className="container">
      <canvas ref={canvasRef} className="dotCanvas" />
      
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

        .dotCanvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: all;
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
          pointer-events: none;
        }

        .title {
          font-size: clamp(0.7rem, 4vw, 1.6rem);
          font-weight: normal;
          color: #ffffff;
          letter-spacing: 0.01em;
          margin: 0 0 20px 0;
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
          pointer-events: all;
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

        @media (max-width: 768px) {
          .container { min-height: 40vh; padding: 0; }
          .title { 
            line-height: 1.2; 
            margin: 0 0 15px 0; 
            font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
          }
          .button { 
            font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
          }
        }

        @media (max-width: 480px) {
          .container { padding: 0; min-height: 35vh; }
          .title { 
            margin: 0 0 12px 0; 
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
        }

        @media (min-width: 1920px) {
          .title { margin: 0 0 25px 0; line-height: 1.1; font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; white-space: nowrap; }
          .button { 
            font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
          }
        }

        @media (min-width: 3840px) {
          .container { padding: 0; min-height: 70vh; }
          .title { font-size: 4.8rem; margin: 0 0 40px 0; line-height: 1.1; font-family: 'Gonero-Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; white-space: nowrap; }
          .button { 
            font-size: 7.5rem; 
            padding: 24px 300px; 
            font-family: 'Gonero-SemiExpanded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
};

export default DotGrid;