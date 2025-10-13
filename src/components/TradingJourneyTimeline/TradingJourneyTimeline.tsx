"use client";
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import styles from "./TradingJourneyTimeline.module.css";

interface TimelineStep {
  step: number;
  title: string;
  description: string;
  icon: string;
  side: 'left' | 'right';
}

const timelineData: TimelineStep[] = [
  {
    step: 1,
    title: "SET UP YOUR BROKER ACCOUNT",
    description: "Get started by opening your partner broker account. Your broker sponsors your admission into PrimeVerse.",
    icon: "/timeline/Set up broker.png",
    side: 'right'
  },
  {
    step: 2,
    title: "ONBOARDING MADE EASY",
    description: "Go through our onboarding - either with live calls or by watching the step-by-step recorded videos.",
    icon: "/timeline/Onboarding made easy.png",
    side: 'left'
  },
  {
    step: 3,
    title: "LEARN THE BASICS IN YOUR LANGUAGE",
    description: "We'll guide you through trading fundamentals in your preferred language so you understand the essentials clearly.",
    icon: "/timeline/Basics in your language.png",
    side: 'right'
  },
  {
    step: 4,
    title: "JOIN LIVE TRADING SESSIONS",
    description: "RSVP to our live trading calls where you'll learn directly from experienced traders in real time.",
    icon: "/timeline/Join Live.png",
    side: 'left'
  },
  {
    step: 5,
    title: "PRACTICE ON A DEMO ACCOUNT",
    description: "Build your confidence by practicing with virtual funds before risking any real money.",
    icon: "/timeline/_demo_account.png",
    side: 'right'
  },
  {
    step: 6,
    title: "KEEP GROWING WITH COURSES & CALLS",
    description: "Access a full library of recorded lessons and continue sharpening your skills through regular live calls.",
    icon: "/timeline/Keep_growing_with_courses.png",
    side: 'left'
  },
  {
    step: 7,
    title: "GO LIVE & TRADE WITH SUPPORT",
    description: "When ready, move into live trading. You'll have access to signals, copy trading, and automation to support your journey.",
    icon: "/timeline/Learn Basics.png",
    side: 'right'
  }
];

export const TradingJourneyTimeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [topOffset, setTopOffset] = useState(0);

  useEffect(() => {
    const calculateLinePosition = () => {
      if (ref.current) {
        const timelineItems = ref.current.querySelectorAll(`.${styles.timelineItem}`);
        if (timelineItems.length > 0) {
          const firstItem = timelineItems[0] as HTMLElement;
          const lastItem = timelineItems[timelineItems.length - 1] as HTMLElement;
          
          // Get the vertical center of each item (where checkpoint is)
          const firstItemCenter = firstItem.offsetTop + (firstItem.offsetHeight / 2);
          const lastItemCenter = lastItem.offsetTop + (lastItem.offsetHeight / 2);
          
          // Calculate height from first checkpoint to last checkpoint
          const lineHeight = lastItemCenter - firstItemCenter;
          setHeight(lineHeight);
          setTopOffset(firstItemCenter);
        }
      }
    };

    // Calculate on mount
    calculateLinePosition();

    // Recalculate on window resize
    window.addEventListener('resize', calculateLinePosition);
    
    // Recalculate after images load
    const timer = setTimeout(calculateLinePosition, 500);

    return () => {
      window.removeEventListener('resize', calculateLinePosition);
      clearTimeout(timer);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.maxWidth}>
        <h2 className={styles.mainTitle}>
          YOUR TRADING JOURNEY
        </h2>
        <p className={styles.mainSubtitle}>
          Follow these steps to become a successful trader with PrimeVerse
        </p>
      </div>

      <div ref={ref} className={styles.relativeWrapper}>
        {timelineData.map((item, index) => (
          <motion.div 
            key={index} 
            className={`${styles.timelineItem} ${styles[item.side]}`}
            initial={{ 
              opacity: 0, 
              x: item.side === 'left' ? -100 : 100 
            }}
            whileInView={{ 
              opacity: 1, 
              x: 0 
            }}
            exit={{ 
              opacity: 0, 
              x: item.side === 'left' ? -100 : 100 
            }}
            viewport={{ once: false, margin: "0px 0px -10% 0px", amount: 0.2 }}
            transition={{ 
              duration: 0.5, 
              delay: 0,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <motion.div 
              className={styles.stepContent}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: false, margin: "0px 0px -10% 0px", amount: 0.2 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <div className={styles.iconContainer}>
                <img 
                  src={item.icon} 
                  alt={`Step ${item.step}`}
                  className={styles.stepIcon}
                />
              </div>
              <div className={styles.textContent}>
                <h3 className={styles.stepTitle}>
                  {item.title}
                </h3>
                <p className={styles.stepDescription}>
                  {item.description}
                </p>
              </div>
            </motion.div>
            {/* Checkpoint circle on the timeline */}
            <motion.div 
              className={styles.checkpoint}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              viewport={{ once: false, margin: "0px 0px -10% 0px", amount: 0.2 }}
              transition={{ 
                duration: 0.3, 
                delay: 0.15,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            ></motion.div>
          </motion.div>
        ))}
        
        {/* Animated timeline line */}
        <div
          style={{
            height: height + "px",
            top: topOffset + "px",
          }}
          className={styles.absoluteLine}
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className={styles.gradientLine}
          />
        </div>
      </div>
    </div>
  );
};

export default TradingJourneyTimeline;
