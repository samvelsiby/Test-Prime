import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import styles from './Roadmap.module.css';

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const roadmapData: RoadmapStep[] = [
  {
    id: 1,
    title: "Set Up Your Broker Account",
    description: "Get started by opening your partner broker account. Your broker sponsors your admission into PrimeVerse.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 2,
    title: "Onboarding Made Easy",
    description: "Go through our onboarding — either with live calls or by watching the step-by-step recorded videos.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 3,
    title: "Learn the Basics in Your Language",
    description: "We'll guide you through trading fundamentals in your preferred language so you understand the essentials clearly.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 4,
    title: "Join Live Trading Sessions",
    description: "RSVP to our live trading calls where you'll learn directly from experienced traders in real time.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 5,
    title: "Practice on a Demo Account",
    description: "Build your confidence by practicing with virtual funds before risking any real money.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 6,
    title: "Keep Growing With Courses & Calls",
    description: "Access a full library of recorded lessons and continue sharpening your skills through regular live calls.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 7,
    title: "Go Live & Trade With Support",
    description: "When ready, move into live trading. You'll have access to signals, copy trading, and automation to support your journey.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

const Roadmap: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [lineProgress, setLineProgress] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Spring-smooth the line progress for a fluid feel
  const lineProgressSpring = useSpring(0, {
    stiffness: 120,
    damping: 20,
    mass: 0.5
  });
  const lineHeight = useTransform(lineProgressSpring, (v) => `${v}%`);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const stepId = parseInt(entry.target.getAttribute('data-step-id') || '0');
          if (entry.isIntersecting) {
            setVisibleItems(prev => {
              const newSet = new Set(prev);
              newSet.add(stepId);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const stepElements = document.querySelectorAll('[data-step-id]');
    stepElements.forEach(el => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!timelineRef.current) return;
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const timelineHeight = timelineRef.current.offsetHeight;
      const timelineTop = timelineRect.top;
      const timelineBottom = timelineRect.bottom;

      if (timelineTop > windowHeight) {
        setLineProgress(0);
      } else if (timelineBottom < 0) {
        setLineProgress(95);
      } else {
        const scrolledPastTop = Math.max(0, windowHeight - timelineTop);
        // Cap at 95% so line stops at the step number of the last step
        const progress = Math.min(95, (scrolledPastTop / (timelineHeight + windowHeight)) * 100);
        setLineProgress(progress);
      }
    };

    const handleScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        measure();
      });
    };

    window.addEventListener('scroll', handleScroll);
    measure(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Drive the spring from the computed progress
  useEffect(() => {
    lineProgressSpring.set(lineProgress);
  }, [lineProgress, lineProgressSpring]);

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.5 }
    }
  } as const;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Trading Journey</h2>
          <p className={styles.subtitle}>Follow these steps to become a successful trader with PrimeVerse</p>
        </div>
        
        <div className={styles.timeline} ref={timelineRef}>
          <motion.div className={styles.timelineLine} style={{ height: lineHeight }} />
          {roadmapData.map((step, index) => (
            <motion.div
              key={step.id}
              className={`${styles.timelineItem} ${visibleItems.has(step.id) ? styles.visible : ''} ${index % 2 === 0 ? styles.left : styles.right}`}
              data-step-id={step.id}
              initial="hidden"
              animate={visibleItems.has(step.id) ? 'visible' : 'hidden'}
              variants={itemVariants}
              transition={{ delay: index * 0.05 }}
            >
              <div className={styles.timelineContent}>
                <div className={styles.card}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
              <div className={styles.timelineMarker}>
                <div className={styles.iconContainer}>
                  <span className={styles.icon}>{step.icon}</span>
                </div>
                <div className={styles.stepNumber}>{step.id}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
