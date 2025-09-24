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
    backgroundColor: "linear-gradient(135deg, #0D15E4 0%, #0157FA 100%)",
    textColor: "#ffffff",
    backgroundImage: "/images/Shakehands.jpg"
  },
  {
    id: 2,
    title: "LEARN TRADING AT YOUR OWN PACE",
    description: "Comprehensive educational resources and tutorials designed for traders of all skill levels.",
    backgroundColor: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
    textColor: "#000000",
    backgroundImage: "/images/Writingh.png"
  },
  {
    id: 3,
    title: "SYPHON AI",
    description: "Advanced AI-powered trading insights and market analysis to enhance your trading decisions.",
    backgroundColor: "linear-gradient(135deg, #60098F 0%, #BC61ED 100%)",
    textColor: "#ffffff"
  },
  {
    id: 4,
    title: "ORACLE TRADE TRACKER",
    description: "Real-time trade tracking and portfolio management with advanced analytics and reporting.",
    backgroundColor: "linear-gradient(135deg, #4D26ED 0%, #6946FE 100%)",
    textColor: "#ffffff",
    backgroundImage: "/images/Oracle.png"
  },
  {
    id: 5,
    title: "TRADE ALERTS",
    description: "Instant notifications for market opportunities and important trading signals.",
    backgroundColor: "linear-gradient(135deg, #858B9E 0%, #D0D3DB 100%)",
    textColor: "#000000"
  },
  {
    id: 6,
    title: "LIVE MENTORSHIP CALLS",
    description: "Direct access to experienced traders through live sessions and personalized guidance.",
    backgroundColor: "linear-gradient(135deg, #0820A8 0%, #106DF8 100%)",
    textColor: "#ffffff",
    backgroundImage: "/images/Livecalls.png"
  },
  {
    id: 7,
    title: "ZONAR MARKET SCANNER",
    description: "Powerful market scanning tools to identify profitable trading opportunities in real-time.",
    backgroundColor: "linear-gradient(135deg, #810184 0%, #B916E7 100%)",
    textColor: "#ffffff",
    backgroundImage: "/images/Zonar.png"
  },
  {
    id: 8,
    title: "EXCLUSIVE TRAVEL BENEFITS",
    description: "Premium travel perks and exclusive experiences for Prime Verse community members.",
    backgroundColor: "linear-gradient(135deg, #858C9E 0%, #D7DAE2 100%)",
    textColor: "#000000",
    backgroundImage: "/images/Plane.png"
  },
  {
    id: 9,
    title: "WEALTH CREATION EDUCATION",
    description: "Comprehensive courses on building long-term wealth through smart trading and investment strategies.",
    backgroundColor: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
    textColor: "#000000",
    backgroundImage: "/images/Money.png"
  },
  {
    id: 10,
    title: "AFFILIATE TRAINING",
    description: "Learn how to build a successful affiliate business and generate passive income streams.",
    backgroundColor: "linear-gradient(135deg, #0F0CE2 0%, #0157FA 100%)",
    textColor: "#ffffff"
  }
];

const CardCollage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const cards = containerRef.current.querySelectorAll(`.${styles.card}`);
      
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isInViewport) {
          setVisibleCards(prev => {
            if (!prev.has(index)) {
              const newSet = new Set(prev);
              newSet.add(index);
              return newSet;
            }
            return prev;
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.collageContainer} ref={containerRef}>
      <div className={styles.cardGrid}>
        {cardData.map((card, index) => (
          <div
            key={card.id}
            className={`${styles.card} ${visibleCards.has(index) ? styles.inView : ''}`}
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
