import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './AceternityTimeline.module.css';

type TimelineEntry = {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const timelineData: TimelineEntry[] = [
  {
    step: 1,
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
    step: 2,
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
    step: 3,
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
    step: 4,
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
    step: 5,
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
    step: 6,
    title: "Keep Growing With Courses & Calls",
    description: "Access a full library of recorded lessons and continue sharpening your skills through regular live calls.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    step: 7,
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

export default function AceternityTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Calculate which item should be active based on scroll progress
  const totalItems = timelineData.length;
  const itemProgress = useTransform(scrollYProgress, [0, 1], [0, totalItems]);
  
  useEffect(() => {
    const unsubscribe = itemProgress.on('change', (latest) => {
      const newIndex = Math.min(Math.floor(latest), totalItems - 1);
      setActiveIndex(newIndex);
    });
    
    return unsubscribe;
  }, [itemProgress, totalItems]);

  // Calculate beam height based on active item
  const beamHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className={styles.section}>
      <div className={styles.container}>
        {/* Sticky Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Your Trading Journey</h1>
          <p className={styles.subtitle}>Follow these steps to become a successful trader with PrimeVerse</p>
        </div>

        {/* Timeline Container */}
        <div ref={containerRef} className={styles.timelineContainer}>
          {/* Static timeline line */}
          <div className={styles.timelineLine} />
          
          {/* Animated beam that follows scroll */}
          <motion.div
            className={styles.timelineBeam}
            style={{ height: beamHeight }}
          />

          {/* Timeline Items */}
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Sticky header for each section */}
              <div className={styles.stickyHeader}>
                <div className={styles.stepBadge}>Step {item.step}</div>
                <h2 className={styles.stickyTitle}>{item.title}</h2>
              </div>

              {/* Timeline dot with icon */}
              <div className={styles.timelineDot}>
                <div className={styles.iconWrapper}>{item.icon}</div>
              </div>

              {/* Content card */}
              <motion.div
                className={styles.card}
                animate={{
                  scale: activeIndex === index ? 1.02 : 1,
                  boxShadow: activeIndex === index 
                    ? "0 10px 30px rgba(0, 0, 0, 0.3)"
                    : "0 5px 15px rgba(0, 0, 0, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                <p className={styles.cardDescription}>{item.description}</p>
              </motion.div>
            </motion.div>
          ))}

          {/* End section with CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className={styles.endSection}
          >
            {/* Connector to final dot */}
            <div className={styles.endConnector} />
            
            {/* Final dot */}
            <div className={styles.finalDot} />
            
            {/* Join Now Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.joinButton}
              onClick={() => window.open('https://getformly.app/vJXW3N', '_blank')}
            >
              Join Now
            </motion.button>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={styles.joinText}
            >
              Start your journey today
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}