import { useState, useEffect, useRef } from 'react';
import styles from './CardCollage.module.css';

interface Card {
  id: number;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  backgroundImage?: string;
}

const cardData: Card[] = [
  {
    id: 1,
    title: "THE PRIME VERSE ADVANTAGE",
    description: "Discover exclusive benefits and premium features that set Prime Verse apart from traditional trading platforms.",
    backgroundColor: "linear-gradient(135deg, #20C8EF 0%, #138FA3 100%)",
    textColor: "#ffffff",
    backgroundImage: "/cardimages/card1.png"
  },
  {
    id: 2,
    title: "LEARN TRADING AT YOUR OWN PACE",
    description: "Comprehensive educational resources and tutorials designed for traders of all skill levels.",
    backgroundColor: "linear-gradient(135deg, #2196ED 0%, #186B9E 100%)",
    textColor: "#000000",
    backgroundImage: "/cardimages/card2.png"
  },
  {
    id: 3,
    title: "SYPHON AI",
    description: "Advanced AI-powered trading insights and market analysis to enhance your trading decisions.",
    backgroundColor: "linear-gradient(135deg, #136AEA 0%, #0F4687 100%)",
    textColor: "#ffffff",
    backgroundImage: "/cardimages/card3.png"
  },
  {
    id: 4,
    title: "ORACLE TRADE TRACKER",
    description: "Real-time trade tracking and portfolio management with advanced analytics and reporting.",
    backgroundColor: "linear-gradient(135deg, #1551E8 0%, #103889 100%)",
    textColor: "#ffffff",
    backgroundImage: "/cardimages/card4.png"
  },
  {
    id: 5,
    title: "TRADE ALERTS",
    description: "Instant notifications for market opportunities and important trading signals.",
    backgroundColor: "linear-gradient(135deg, #1E1EF4 0%, #101089 100%)",
    textColor: "#ffffff",
    backgroundImage: "/cardimages/card5.png"
  },
  {
    id: 6,
    title: "LIVE MENTORSHIP CALLS",
    description: "Direct access to experienced traders through live sessions and personalized guidance.",
    backgroundColor: "linear-gradient(135deg, #501CF2 0%, #2B1391 100%)",
    textColor: "#000000",
    backgroundImage: "/cardimages/card6.png"
  },
  {
    id: 7,
    title: "ZONAR MARKET SCANNER",
    description: "Powerful market scanning tools to identify profitable trading opportunities in real-time.",
    backgroundColor: "linear-gradient(135deg, #6E1DED 0%, #3B118C 100%)",
    textColor: "#ffffff",
    backgroundImage: "/cardimages/card7.png"
  },
  {
    id: 8,
    title: "EXCLUSIVE TRAVEL BENEFITS",
    description: "Premium travel perks and exclusive experiences for Prime Verse community members.",
    backgroundColor: "linear-gradient(135deg, #8B1BED 0%, #3E0D72 100%)",
    textColor: "#000000",
    backgroundImage: "/cardimages/card8.png"
  },
  {
    id: 9,
    title: "WEALTH CREATION EDUCATION",
    description: "Comprehensive courses on building long-term wealth through smart trading and investment strategies.",
    backgroundColor: "linear-gradient(135deg, #A61BEF 0%, #560F84 100%)",
    textColor: "#000000",
    backgroundImage: "/cardimages/card9.png"
  },
  {
    id: 10,
    title: "AFFILIATE TRAINING",
    description: "Learn how to build a successful affiliate business and generate passive income streams.",
    backgroundColor: "linear-gradient(135deg, #B018E8 0%, #650E89 100%)",
    textColor: "#ffffff",
    backgroundImage: "/cardimages/card10.png"
  }
];

const CardCollage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSmallPhone, setIsSmallPhone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Determine initial device width and update on resize
    const updateIsSmallPhone = () => {
      if (typeof window !== 'undefined') {
        setIsSmallPhone(window.innerWidth <= 480);
      }
    };
    updateIsSmallPhone();

    const handleScroll = () => {
      if (!containerRef.current) return;
      const cards = Array.from(containerRef.current.querySelectorAll(`.${styles.card}`));

      // Reveal on viewport for larger screens as before
      cards.forEach((card, index) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        if (isInViewport) {
          setVisibleCards(prev => {
            if (!prev.has(index)) {
              const next = new Set(prev);
              next.add(index);
              return next;
            }
            return prev;
          });
        }
      });

      // Mobile stacked logic
      if (typeof window !== 'undefined' && window.innerWidth <= 480) {
        // Determine which card is closest to center
        let closestIdx = 0;
        let closestDist = Number.POSITIVE_INFINITY;
        cards.forEach((card, index) => {
          const rect = (card as HTMLElement).getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const dist = Math.abs(center - window.innerHeight / 2);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = index;
          }
        });
        setActiveIndex(closestIdx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    window.addEventListener('resize', updateIsSmallPhone);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('resize', updateIsSmallPhone);
    };
  }, []);

  return (
    <div className={styles.collageContainer} ref={containerRef}
      onMouseMove={(e) => {
        if (window.innerWidth < 769) return;
        if (!gridRef.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = (-py * 6).toFixed(2);
        const ry = (px * 6).toFixed(2);
        gridRef.current.style.setProperty('--rx', `${rx}deg`);
        gridRef.current.style.setProperty('--ry', `${ry}deg`);
      }}
      onMouseLeave={() => {
        if (!gridRef.current) return;
        gridRef.current.style.setProperty('--rx', '0deg');
        gridRef.current.style.setProperty('--ry', '0deg');
      }}
    >
      <div ref={gridRef} className={`${styles.cardGrid} ${styles.stackedBase}`}>
        {cardData.map((card, index) => (
          <div
            key={card.id}
            className={`${styles.card} ${visibleCards.has(index) ? styles.inView : ''} ${isSmallPhone ? `${styles.stackedCard} ${index === activeIndex ? styles.active : index === activeIndex + 1 ? styles.next : index === activeIndex - 1 ? styles.prev : styles.inactive}` : ''}`}
            style={{ 
              background: card.backgroundColor,
              color: card.textColor
            }}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {card.backgroundImage && (
              <div 
                className={styles.cardImageOverlay}
                style={{
                  backgroundImage: `url("${card.backgroundImage}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
            )}
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <div 
                className={`${styles.cardDescription} ${
                  hoveredCard === card.id ? styles.revealed : ''
                }`}
                style={{ 
                  background: card.backgroundColor,
                  color: card.textColor
                }}
              >
                <h3 className={styles.cardTitleOverlay}>{card.title}</h3>
                <p className={styles.cardDescriptionText}>{card.description}</p>
              </div>
            </div>
            <div className={styles.cardOverlay}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardCollage;