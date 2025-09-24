import { useState } from 'react';
import styles from './SystemsShowcase.module.css';

interface System {
  id: number;
  name: string;
  title: string;
  description: string;
  features: string[];
}

const systemsData: System[] = [
  {
    id: 1,
    name: "Oracle",
    title: "AUTOMATE YOUR CAPITAL GROWTH",
    description: "Oracle is an automated trade journal built for serious traders. It connects directly to your trading account, capturing every trade and turning raw data into powerful insights. No more spreadsheets or missed entries — just a clean, visual dashboard showing your win rates, risk-to-reward, drawdowns, and performance patterns. With built-in journaling and behavior tracking, Oracle helps you uncover strengths, correct weaknesses, and develop the consistency needed to trade like a professional.",
    features: []
  },
  {
    id: 2,
    name: "Zonar",
    title: "AUTOMATE YOUR CAPITAL GROWTH",
    description: "Zonar is a next-generation Smart Money Concepts (SMC) indicator built for traders who want clarity, precision, and confidence in the markets. It automatically highlights key market structure shifts, liquidity zones, supply and demand imbalances, and high-probability setups  giving you the same perspective institutional traders use, without the guesswork. With real-time alerts, customizable settings, and an intuitive dashboard, Zonar transforms raw price action into actionable insights. Whether you're trading forex, indices, or commodities, Zonar equips you with the edge to spot opportunities faster and execute with discipline. Trade smarter. Trade with Zonar.",
    features: []
  },
  {
    id: 3,
    name: "SyphonAI",
    title: "AUTOMATE YOUR CAPITAL GROWTH", 
    description: "SyphonAI is a fully automated trading strategy built to deliver consistent monthly growth while maintaining strict risk control. Developed and proven over three years of live market testing with multi–seven-figure capital, it combines algorithmic precision with disciplined risk management to reduce emotional decision-making and enhance performance. Through our partnership with PuPrime, you retain full control of your funds with regulated security, insured accounts, and seamless copy trading. Our model is performance-based  you keep the majority of profits, and we only earn when you do.",
    features: []
  }
];

const SystemsShowcase = () => {
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);

  const handleCardClick = (systemId: number) => {
    setSelectedSystem(selectedSystem === systemId ? null : systemId);
  };

  const handleCloseClick = () => {
    setSelectedSystem(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>AUTOMATE YOUR CAPITAL GROWTH</h2>
      </div>
      
      <div className={`${styles.systemsGrid} ${selectedSystem ? styles.revealed : ''}`}>
        {systemsData.map((system) => (
          <div
            key={system.id}
            className={`${styles.systemCard} ${
              selectedSystem === system.id ? styles.active : ''
            } ${selectedSystem && selectedSystem !== system.id ? styles.inactive : ''}`}
            onClick={() => handleCardClick(system.id)}
          >
            <div className={styles.cardContent}>
              <h3 className={styles.systemName}>{system.name}</h3>
            </div>
            
            {selectedSystem === system.id && (
              <div className={styles.revealedContent}>
                <div className={styles.revealedHeader}>
                  <button 
                    className={styles.closeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseClick();
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <div className={styles.revealedBody}>
                  <div className={styles.contentArea}>
                    <div className={styles.centerSection}>
                      <h3 className={styles.systemNameLarge}>{system.name}</h3>
                      <p className={styles.description}>{system.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemsShowcase;
