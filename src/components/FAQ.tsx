import React, { useState } from 'react';
import styles from './FAQ.module.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How much does it cost to join PrimeVerse?",
    answer: "PrimeVerse itself is free. Your broker sponsors your admission when you open a partner broker account. This means you get access to our education, tools, and community without paying upfront program fees."
  },
  {
    id: 2,
    question: "Why do I need to set up a broker account first?",
    answer: "The broker account acts as your trading gateway. By partnering with specific brokers, we ensure that you have the right environment, tools, and support in place from Day 1. It also covers the cost of your PrimeVerse membership."
  },
  {
    id: 3,
    question: "I've never traded before. Can I still join?",
    answer: "Absolutely. PrimeVerse is built for beginners. You'll start with simple onboarding videos and basic trading education (available in your preferred language). We'll also guide you through practicing on a demo account before you ever trade live."
  },
  {
    id: 4,
    question: "Do I need a lot of money to start trading?",
    answer: "No. You can start small and scale up as you grow more confident. Many of our members begin with a demo account, then start live trading with a modest amount that fits their budget."
  },
  {
    id: 5,
    question: "Is trading risky?",
    answer: "Yes — all trading carries risk. That's why we focus heavily on education, demo practice, and risk management before you trade live. We give you the knowledge, tools, and community support to make informed decisions and avoid common pitfalls."
  },
  {
    id: 6,
    question: "What if I don't have much time to learn trading?",
    answer: "You can go at your own pace. Choose between live calls or recorded videos depending on your schedule. Plus, when you're ready, you can use automation and copy signals to trade even if you don't have time to analyze markets yourself."
  },
  {
    id: 7,
    question: "What kind of support will I get?",
    answer: "You're never alone in PrimeVerse. You'll have: Live onboarding calls, Access to recorded step-by-step lessons, Ongoing live trading sessions, A supportive community and mentors, Automation and copy trading tools once you go live."
  },
  {
    id: 8,
    question: "Is this available in my language?",
    answer: "Yes. We provide education and onboarding in multiple languages, so you can learn trading basics and advanced strategies in the way that's most comfortable for you."
  },
  {
    id: 9,
    question: "How long until I can trade live?",
    answer: "It depends on you. Some members move into live trading in a few weeks, while others take more time to study and practice. We encourage you to build confidence on a demo account first, then transition when you're comfortable."
  },
  {
    id: 10,
    question: "What makes PrimeVerse different from other trading groups or courses?",
    answer: "No upfront program fees — your broker sponsorship covers it. A clear step-by-step journey (from zero to live trading). Education in your language. Access to live signals, copy trading, and automation. A long-term supportive community that grows with you."
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>FAQs</h2>
        </div>
        
        <div className={styles.faqList}>
          {faqData.map((item) => (
            <div key={item.id} className={styles.faqItem}>
            <div 
              className={styles.questionContainer}
              onClick={() => toggleItem(item.id)}
            >
              <h3 className={styles.question}>{item.question}</h3>
              <button 
                className={`${styles.toggleButton} ${openItems.has(item.id) ? styles.open : ''}`}
                aria-label="Toggle answer"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M6 9L12 15L18 9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            
            <div className={`${styles.answerContainer} ${openItems.has(item.id) ? styles.expanded : ''}`}>
              <div className={styles.answer}>
                <p>{item.answer}</p>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
