import Head from 'next/head';
import styles from '../styles/Launch.module.css';

export default function Launch() {
  return (
    <>
      <Head>
        <title>Prime Verse Launch - Live Stream</title>
        <meta name="description" content="Watch the Prime Verse launch live stream" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#015BF9" />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <img 
              src="/favicon.svg" 
              alt="Prime Verse Logo" 
              className={styles.logo}
            />
            <h1 className={styles.title}>PRIME VERSE LAUNCH</h1>
          </div>
          <p className={styles.subtitle}>Live Stream Event</p>
        </div>

        <div className={styles.streamContainer}>
          <iframe 
            src="https://player.castr.com/live_f843b5b098cd11f0969601e2b769e2cd" 
            width="100%" 
            style={{
              aspectRatio: '16/9',
              minHeight: '340px'
            }}
            frameBorder="0" 
            scrolling="no" 
            allow="autoplay" 
            allowFullScreen
          />
        </div>

        <div className={styles.footer}>
          <p className={styles.footerText}>Experience the future of trading with Prime Verse</p>
        </div>
      </div>
    </>
  );
}
