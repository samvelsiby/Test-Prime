import { useState, useEffect, useRef } from 'react';
import styles from './SystemsShowcase.module.css';

interface System {
  id: number;
  name: string;
  title: string;
  description: string;
  features: string[];
}

const systemsData: System[] = [
  {
    id: 1,
    name: "Oracle",
    title: "Tools to let grow",
    description: "Oracle is an automated trade journal built for serious traders. It connects directly to your trading account, capturing every trade and turning raw data into powerful insights. No more spreadsheets or missed entries — just a clean, visual dashboard showing your win rates, risk-to-reward, drawdowns, and performance patterns. With built-in journaling and behavior tracking, Oracle helps you uncover strengths, correct weaknesses, and develop the consistency needed to trade like a professional.",
    features: []
  },
  {
    id: 2,
    name: "Zonar",
    title: "Tools to let grow",
    description: "Zonar is a next-generation Smart Money Concepts (SMC) indicator built for traders who want clarity, precision, and confidence in the markets. It automatically highlights key market structure shifts, liquidity zones, supply and demand imbalances, and high-probability setups  giving you the same perspective institutional traders use, without the guesswork. With real-time alerts, customizable settings, and an intuitive dashboard, Zonar transforms raw price action into actionable insights. Whether you're trading forex, indices, or commodities, Zonar equips you with the edge to spot opportunities faster and execute with discipline. Trade smarter. Trade with Zonar.",
    features: []
  },
  {
    id: 3,
    name: "SyphonAI",
    title: "Tools to let grow", 
    description: "SyphonAI is a fully automated trading strategy built to deliver consistent monthly growth while maintaining strict risk control. Developed and proven over three years of live market testing with multi–seven-figure capital, it combines algorithmic precision with disciplined risk management to reduce emotional decision-making and enhance performance. Through our partnership with PuPrime, you retain full control of your funds with regulated security, insured accounts, and seamless copy trading. Our model is performance-based  you keep the majority of profits, and we only earn when you do.",
    features: []
  }
];

const SystemsShowcase = () => {
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Disable individual component animation - now handled by unified flow
    // const observer = new IntersectionObserver(
    //   (entries) => {
    //     entries.forEach((entry) => {
    //       if (entry.isIntersecting) {
    //         setIsVisible(true);
    //         // Preload images when component becomes visible
    //         preloadImages();
    //       }
    //     });
    //   },
    //   { threshold: 0.2 }
    // );

    // if (containerRef.current) {
    //   observer.observe(containerRef.current);
    // }

    // return () => observer.disconnect();
    
    // Always visible and preload images immediately
    setIsVisible(true);
    preloadImages();
  }, []);

  const preloadImages = () => {
    if (imagesLoaded) return;
    
    const imageUrls = [
      'https://imagedelivery.net/-TAsjfo4iCAfiV6-gO1zSg/e53bb48e-c3ff-49e3-6757-a16b6fe2a300/public',
      'https://imagedelivery.net/-TAsjfo4iCAfiV6-gO1zSg/02ef02aa-52d3-4af8-94db-56af4c257800/public',
      'https://imagedelivery.net/-TAsjfo4iCAfiV6-gO1zSg/e518fbc6-8e0f-4493-de90-6d76e1fc9600/public'
    ];

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    imageUrls.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.src = url;
    });
  };

  useEffect(() => {
    let rafId: number | null = null;
    let lastScrollTime = 0;
    const throttleDelay = 16; // ~60fps
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < throttleDelay) return;
      
      if (rafId !== null) return;
      
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current || selectedSystem) {
          rafId = null;
          return;
        }

        const containerTop = containerRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const scrollProgress = Math.max(0, Math.min(1, 1 - containerTop / windowHeight));

        cardsRef.current.forEach((card, index) => {
          if (card) {
            const offset = (index - 1) * 20; // Reduced offset for smoother performance
            const translateY = -scrollProgress * offset;
            card.style.transform = `translateY(${translateY}px)`;
          }
        });
        
        lastScrollTime = now;
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [selectedSystem]);

  const handleCardClick = (systemId: number) => {
    if (selectedSystem === systemId) {
      // Close the currently selected card
      handleCloseClick();
    } else {
      // Open a new card
      setIsClosing(false);
      setSelectedSystem(systemId);
    }
  };

  const handleCloseClick = () => {
    setIsClosing(true);
    // Wait for close animation to complete before removing the selected system
    setTimeout(() => {
      setSelectedSystem(null);
      setIsClosing(false);
    }, 1200); // Match the CSS animation duration
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>GROW SMARTER WITH THE RIGHT TOOLS</h2>
      </div>
      
      <div className={`${styles.systemsGrid} ${selectedSystem ? styles.revealed : ''}`}>
        {systemsData.map((system, index) => (
          <div
            key={system.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            className={`${styles.systemCard} ${
              selectedSystem === system.id ? styles.active : ''
            } ${selectedSystem && selectedSystem !== system.id ? styles.inactive : ''} ${
              isClosing && selectedSystem === system.id ? styles.closing : ''
            }`}
            style={{ animationDelay: `${index * 0.2}s` }}
            onClick={() => handleCardClick(system.id)}
          >
            <div className={styles.cardContent}>
              <h3 className={styles.systemName}>{system.name}</h3>
            </div>
            
            {selectedSystem === system.id && (
              <div className={styles.revealedContent}>
                <div className={styles.revealedHeader}>
                  <button 
                    className={styles.closeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseClick();
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <div className={styles.revealedBody}>
                  <div className={styles.contentArea}>
                    <div className={styles.centerSection}>
                      <h3 className={styles.systemNameLarge}>{system.name}</h3>
                      <p className={styles.description}>{system.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemsShowcase;
