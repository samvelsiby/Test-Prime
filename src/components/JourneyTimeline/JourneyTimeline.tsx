"use client";
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import styles from "./JourneyTimeline.module.css";

interface TimelineEntry {
  step: number;
  title: string;
  content: React.ReactNode;
}

const data: TimelineEntry[] = [
  {
    step: 1,
    title: "Set Up Your Broker Account",
    content: (
      <div className={styles.contentCard}>
        <p className={styles.description}>
          Get started by opening your partner broker account. Your broker sponsors your admission into PrimeVerse.
        </p>
      </div>
    ),
  },
  {
    step: 2,
    title: "Onboarding Made Easy",
    content: (
      <div className={styles.contentCard}>
        <p className={styles.description}>
          Go through our onboarding — either with live calls or by watching the step-by-step recorded videos.
        </p>
      </div>
    ),
  },
  {
    step: 3,
    title: "Learn the Basics in Your Language",
    content: (
      <div className={styles.contentCard}>
        <p className={styles.description}>
          We'll guide you through trading fundamentals in your preferred language so you understand the essentials clearly.
        </p>
      </div>
    ),
  },
  {
    step: 4,
    title: "Join Live Trading Sessions",
    content: (
      <div className={styles.contentCard}>
        <p className={styles.description}>
          RSVP to our live trading calls where you'll learn directly from experienced traders in real time.
        </p>
      </div>
    ),
  },
  {
    step: 5,
    title: "Practice on a Demo Account",
    content: (
      <div className={styles.contentCard}>
        <p className={styles.description}>
          Build your confidence by practicing with virtual funds before risking any real money.
        </p>
      </div>
    ),
  },
  {
    step: 6,
    title: "Keep Growing With Courses & Calls",
    content: (
      <div className={styles.contentCard}>
        <p className={styles.description}>
          Access a full library of recorded lessons and continue sharpening your skills through regular live calls.
        </p>
      </div>
    ),
  },
  {
    step: 7,
    title: "Go Live & Trade With Support",
    content: (
      <div className={styles.contentCard}>
        <p className={styles.description}>
          When ready, move into live trading. You'll have access to signals, copy trading, and automation to support your journey.
        </p>
      </div>
    ),
  },
];

export const JourneyTimeline = ({ data: customData }: { data?: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const timelineItems = ref.current.querySelectorAll(`.${styles.timelineItem}`);
      if (timelineItems.length > 0) {
        const firstItem = timelineItems[0] as HTMLElement;
        const lastItem = timelineItems[timelineItems.length - 1] as HTMLElement;
        
        const firstItemTop = firstItem.offsetTop;
        const lastItemTop = lastItem.offsetTop;
        
        // Calculate height from first step to the center of the last step
        const lineHeight = lastItemTop - firstItemTop;
        setHeight(lineHeight);
      }
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const timelineData = customData || data;

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.maxWidth}>
        <h2 className={styles.mainTitle}>
          Your Trading Journey
        </h2>
        <p className={styles.mainSubtitle}>
          Follow these steps to become a successful trader with PrimeVerse
        </p>
      </div>

      <div ref={ref} className={styles.relativeWrapper}>
        {timelineData.map((item, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.stickyWrapper}>
              <div className={styles.circleContainer}>
                <div className={styles.circle}>
                  <div className={styles.stepNumber}>{item.step}</div>
                </div>
              </div>
              <h3 className={styles.itemTitle}>
                {item.title}
              </h3>
            </div>
            <div className={styles.contentWrapper}>{item.content}</div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
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

export default JourneyTimeline;
