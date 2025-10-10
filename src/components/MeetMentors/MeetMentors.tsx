import { useEffect, useRef, useState } from 'react';
import styles from './MeetMentors.module.css';

const mentors = [
  { id: 1, name: 'Alex Thompson', role: 'Senior Trading Strategist', experience: '15+ Years' },
  { id: 2, name: 'Sarah Chen', role: 'Risk Management Expert', experience: '12+ Years' },
  { id: 3, name: 'Marcus Rodriguez', role: 'Technical Analysis Pro', experience: '10+ Years' },
  { id: 4, name: 'Emily Watson', role: 'Options Trading Specialist', experience: '8+ Years' },
  { id: 5, name: 'David Kim', role: 'Algorithmic Trading Expert', experience: '14+ Years' },
  { id: 6, name: 'Lisa Johnson', role: 'Market Psychology Coach', experience: '11+ Years' },
  { id: 7, name: 'Robert Zhang', role: 'Commodities Trader', experience: '13+ Years' },
  { id: 8, name: 'Anna Petrov', role: 'Swing Trading Master', experience: '9+ Years' },
];

const SPEED_PX_PER_MS = -0.05; // Negative for right-to-left movement

const MeetMentors = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    // Disable individual component animation - now handled by unified flow
    // const observer = new IntersectionObserver(
    //   ([entry]) => {
    //     if (entry.isIntersecting) {
    //       setIsVisible(true);
    //     }
    //   },
    //   {
    //     threshold: 0.1,
    //     rootMargin: '-50px 0px'
    //   }
    // );

    // if (containerRef.current) {
    //   observer.observe(containerRef.current);
    // }

    // return () => observer.disconnect();
    
    // Always visible - animation handled by unified flow
    setIsVisible(true);
  }, []);

  // Scrolling animation for mentors (right to left)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let rafId: number;
    let lastTs: number | null = null;

    const loop = (ts: number) => {
      if (lastTs == null) lastTs = ts;
      const delta = ts - lastTs;
      lastTs = ts;

      if (!pause) {
        const half = el.scrollWidth / 2;
        el.scrollLeft += delta * SPEED_PX_PER_MS;

        // For right-to-left movement, reset when scrollLeft goes negative
        if (el.scrollLeft <= 0) {
          el.scrollLeft = half;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    // Start from the right side
    setTimeout(() => {
      if (el) {
        el.scrollLeft = el.scrollWidth / 2;
      }
    }, 100);
    
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [pause]);

  const duplicatedMentors = [...mentors, ...mentors];

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.content}>
        <div className={styles.textSection}>
          <h2 className={styles.title}>
            Meet Your Mentors
          </h2>
          <p className={styles.description}>
            Learn from industry experts who have mastered the art of trading. 
            Our mentors bring years of experience and proven strategies to guide 
            your journey in the financial markets.
          </p>
        </div>
        
        <div className={styles.scrollerContainer}>
          <div
            ref={scrollerRef}
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
            className={styles.mentorsScroller}
          >
            {duplicatedMentors.map((mentor, idx) => (
              <div
                key={`${mentor.id}-${idx}`}
                className={styles.mentorCard}
              >
                <div className={styles.mentorImage}>
                  <div className={styles.imagePlaceholder}>
                    <div className={styles.avatarIcon}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className={styles.mentorInfo}>
                  <h3 className={styles.mentorName}>{mentor.name}</h3>
                  <p className={styles.mentorRole}>{mentor.role}</p>
                  <span className={styles.experience}>{mentor.experience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetMentors;
