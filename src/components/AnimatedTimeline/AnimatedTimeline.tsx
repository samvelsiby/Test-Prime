import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './AnimatedTimeline.module.css';

type CardData = {
  side: 'left' | 'right';
  title: string;
  description: string;
};

type TimelineCardProps = {
  side: 'left' | 'right';
  title: string;
  description: string;
  index: number;
  totalCards: number;
};

const TimelineCard = ({ side, title, description, index }: TimelineCardProps) => {
  const isLeft = side === 'left';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`${styles.cardWrapper} ${!isLeft ? styles.cardWrapperReverse : ''}`}
    >
      {/* Card */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
      
      {/* Center dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
        className={styles.centerDot}
      >
        <div className={`${styles.dot} ${index % 2 === 0 ? styles.dotEven : styles.dotOdd}`} />
        <div className={styles.stepNumber}>{index + 1}</div>
      </motion.div>
      
      {/* Empty space for other side */}
      <div className={styles.emptySpace} />
    </motion.div>
  );
};

export default function AnimatedTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0.1, 1], ["0%", "100%"]);
  
  const cards: CardData[] = [
    { 
      side: 'left', 
      title: 'Set Up Your Broker Account', 
      description: 'Get started by opening your partner broker account. Your broker sponsors your admission into PrimeVerse.' 
    },
    { 
      side: 'right', 
      title: 'Onboarding Made Easy', 
      description: 'Go through our onboarding — either with live calls or by watching the step-by-step recorded videos.' 
    },
    { 
      side: 'left', 
      title: 'Learn the Basics in Your Language', 
      description: 'We\'ll guide you through trading fundamentals in your preferred language so you understand the essentials clearly.' 
    },
    { 
      side: 'right', 
      title: 'Join Live Trading Sessions', 
      description: 'RSVP to our live trading calls where you\'ll learn directly from experienced traders in real time.' 
    },
    { 
      side: 'left', 
      title: 'Practice on a Demo Account', 
      description: 'Build your confidence by practicing with virtual funds before risking any real money.' 
    },
    { 
      side: 'right', 
      title: 'Go Live & Trade With Support', 
      description: 'When ready, move into live trading. You\'ll have access to signals, copy trading, and automation to support your journey.' 
    },
  ];
  
  return (
    <div className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.header}
        >
          <h1 className={styles.title}>Our Journey</h1>
          <p className={styles.subtitle}>Scroll down to see our amazing features unfold</p>
        </motion.div>
        
        {/* Timeline Container */}
        <div ref={containerRef} className={styles.timelineContainer}>
          {/* Center Line */}
          <div className={styles.centerLine}>
            <motion.div
              style={{ height: lineHeight }}
              className={styles.animatedLine}
            />
          </div>
          
          {/* Cards */}
          <div className={styles.cards}>
            {cards.map((card, index) => (
              <TimelineCard
                key={index}
                side={card.side}
                title={card.title}
                description={card.description}
                index={index}
                totalCards={cards.length}
              />
            ))}
          </div>
        </div>
        
        {/* End Point with Join Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className={styles.endSection}
        >
          {/* Connector segment to link the line to the final dot */}
          <div className={styles.endConnector} />
          {/* Final dot at the end of line */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={styles.finalDot}
          />
          
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
  );
}
