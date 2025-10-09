import { useEffect, useRef } from 'react';
import styles from './TheTruth.module.css';

const TheTruth = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const problems = [
    {
      id: 1,
      title: 'EMPTY PROMISES, ENDLESS CHARGES',
      description: 'Traders are tired of paying for overpriced courses, signals, and memberships that never deliver. The industry thrives on selling hype and not results. Instead of guidance, people are left with empty content.'
    },
    {
      id: 2,
      title: 'NO REAL SUPPORT OR COMMUNITY',
      description: 'Most platforms leave you on your own. No mentorship. No environment to ask questions. No community to grow with. Trading becomes an isolated, confusing battle where only a few see success.'
    },
    {
      id: 3,
      title: 'FLASHY PRODUCTS, NO VALUE',
      description: 'The industry loves "fancy" dashboards, shiny tools, and complicated gimmicks that looks impressive but don\'t actually help you succeed. That traders need is clarity, not bells and whistles.'
    }
  ];

  return (
    <div ref={sectionRef} className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>THE TRUTH</h2>
          <p className={styles.subtitle}>THE TRADING INDUSTRY IS BROKEN</p>
        </div>

        <div className={styles.cardsGrid}>
          {problems.map((problem, index) => (
            <div 
              key={problem.id} 
              className={styles.card}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <h3 className={styles.cardTitle}>{problem.title}</h3>
              <p className={styles.cardDescription}>{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheTruth;
