import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { CardCollage, Navigation, TheTruth, MeetMentors, AnimatedTimeline, AceternityTimeline, JourneyTimeline, GlowHero} from '../components';
import SystemsShowcase from '../components/SystemsShowcase/SystemsShowcase';
import Testimonials from '../components/Testimonials/Testimonials';
import Roadmap from '../components/Roadmap/Roadmap';
import FAQ from '../components/FAQ/FAQ';
import Footer from '../components/Footer/Footer';

// Particle System Component
const ParticleSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const maxParticles = 40;
    const particles: HTMLDivElement[] = [];

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size (mostly small)
      const sizes = ['small', 'small', 'small', 'medium']; // 75% small, 25% medium
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      particle.classList.add(size);
      
      // Only place particles in non-video areas
      const isTopArea = Math.random() > 0.5;
      
      if (isTopArea) {
        // Top area (above video)
        particle.style.top = Math.random() * 20 + '%';
      } else {
        // Bottom area (below video)  
        particle.style.top = (70 + Math.random() * 30) + '%';
      }
      
      // Random horizontal position
      particle.style.left = Math.random() * 100 + '%';
      
      // Random animation delay for twinkling effect
      particle.style.animationDelay = Math.random() * 3 + 's';
      
      container.appendChild(particle);
      particles.push(particle);
    };

    // Create particles
    for (let i = 0; i < maxParticles; i++) {
      createParticle();
    }

    // Cleanup function
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return <div id="particles-container" ref={containerRef}></div>;
};

// Background Video Component
const BackgroundVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const loopStartTime = 2.01;
  const loopEndTime = 29.24;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initialize HLS for Cloudflare Stream
    const initializeCloudflareStream = async () => {
      const videoSrc = 'https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/manifest/video.m3u8';
      
      // Dynamically import HLS.js
      const Hls = (await import('hls.js')).default;
      
      if (Hls.isSupported()) {
        console.log('HLS is supported, using HLS.js');
        const hls = new Hls({
          debug: false,
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,
          highBufferWatchdogPeriod: 2,
          nudgeOffset: 0.1,
          nudgeMaxRetry: 3,
          maxFragLookUpTolerance: 0.25,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
        });
        
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          console.log('HLS manifest parsed, starting video');
          video.play().catch(error => {
            console.log('Autoplay failed, will play on user interaction:', error);
          });
        });
        
        hls.on(Hls.Events.ERROR, function(event, data) {
          // Only log fatal errors to reduce console spam
          if (data.fatal) {
            console.error('Fatal HLS error:', data.type, data.details);
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Network error, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media error, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                console.log('Unrecoverable error, falling back to MP4');
                hls.destroy();
                video.src = 'https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/downloads/default.mp4';
                video.load();
                break;
            }
          }
          // Ignore non-fatal buffer stalled errors to reduce console spam
        });
        
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Native HLS support detected');
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(error => {
            console.log('Autoplay failed, will play on user interaction:', error);
          });
        });
      } else {
        console.log('HLS not supported, using MP4 fallback');
        video.src = 'https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/downloads/default.mp4';
      }
    };

    // Video event handlers
    const handleLoadedMetadata = () => {
      console.log('Video loaded, duration:', video.duration);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      if (video.paused) {
        video.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }
    };

    const handleTimeUpdate = () => {
      if (!hasPlayedOnce) {
        // First play - let it play completely
        if (video.currentTime >= video.duration - 0.1) {
          setHasPlayedOnce(true);
          video.currentTime = loopStartTime;
          console.log('First play complete, starting custom loop');
        }
      } else {
        // Subsequent plays - loop from 2.01 to 29.24
        if (video.currentTime >= loopEndTime) {
          video.currentTime = loopStartTime;
          console.log('Loop: jumping back to', loopStartTime);
        }
      }
    };

    const handleEnded = () => {
      console.log('Video ended event triggered');
      setHasPlayedOnce(true);
      video.currentTime = loopStartTime;
      video.play().then(() => {
        console.log('Video restarted successfully');
      }).catch(error => {
        console.error('Error restarting video:', error);
      });
    };

    const handlePause = () => {
      if (!video.ended) {
        console.log('Video paused, resuming...');
        video.play();
      }
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      // Fallback: show a message or alternative content
      const overlay = document.querySelector('.content-overlay') as HTMLElement;
      if (overlay) {
        overlay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    };

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // Initialize video
    initializeCloudflareStream();

    // Cleanup
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [hasPlayedOnce]);

  return (
    <video 
      ref={videoRef}
      id="background-video"
      autoPlay 
      muted 
      playsInline 
      preload="auto"
    >
      <source src="https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/manifest/video.m3u8" type="application/x-mpegURL" />
      <source src="https://customer-pyq7haxijl6gyz2i.cloudflarestream.com/5c79505553e17a1ce57ba51d5da60f28/downloads/default.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

// Button Component with Ripple Effect
const RippleButton = ({ children, className, onClick }: { children: React.ReactNode, className: string, onClick?: () => void }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    // Create ripple effect
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);

    if (onClick) onClick();
  };

  return (
    <button ref={buttonRef} className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

// Main Home Component
export default function Home() {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Font loading detection
    const loadFonts = async () => {
      try {
        // Check if FontFace API is supported
        if ('fonts' in document) {
          // Load the font
          const font = new FontFace('Gonero-ExtraExpanded', 'url(/fonts/Gonero-ExtraExpanded.woff2)');
          await font.load();
          document.fonts.add(font);
          
          // Add class to indicate fonts are loaded
          document.documentElement.classList.add('fonts-loaded');
        } else {
          // Fallback for older browsers - wait a bit then show
          setTimeout(() => {
            document.documentElement.classList.add('fonts-loaded');
          }, 100);
        }
      } catch (error) {
        console.warn('Font loading failed:', error);
        // Still show the text even if font fails to load
        document.documentElement.classList.add('fonts-loaded');
      }
    };

    // Intersection Observer for smooth section transitions
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-10% 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible', 'quick-fade-in');
        }
      });
    }, observerOptions);

    // Scroll handler for hero section
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const contentOverlay = document.querySelector('.content-overlay');
      
      if (scrollY > 100) {
        setIsScrolling(true);
        if (contentOverlay) {
          contentOverlay.classList.add('scrolling-away');
        }
      } else {
        setIsScrolling(false);
        if (contentOverlay) {
          contentOverlay.classList.remove('scrolling-away');
        }
      }
    };

    // Initialize
    loadFonts();
    
    // Set up observers after a short delay to ensure DOM is ready
    setTimeout(() => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => observer.observe(section));
      
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 100);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleWaitlistClick = () => {
    // Open Formly waitlist form
    window.open('https://getformly.app/vJXW3N', '_blank');
  };

  return (
    <>
      <Head>
        <title>Prime Verse - More Than Trading</title>
        <meta name="description" content="Prime Verse - More Than Trading" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#015BF9" />
      </Head>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Background Video */}
      <section id="home" className="hero-section" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', scrollMarginTop: '80px' }}>
        {/* Background Video */}
        <BackgroundVideo />

        {/* Particles only in non-video areas */}
        <ParticleSystem />

        {/* Content Overlay */}
        <div className="content-overlay">
          <div className="hero-content">
            <h1 className="hero-title">PRIME VERSE</h1>
            <p className="hero-subtitle">MORE THAN TRADING</p>
            <div className="hero-buttons">
              <RippleButton className="btn btn-primary" onClick={handleWaitlistClick}>
                JOIN THE WAITLIST
              </RippleButton>
            </div>
          </div>
        </div>
      </section>


        {/* Glow Hero Section */}
        <section id="glow-hero" style={{ scrollMarginTop: '80px' }}>
        <GlowHero 
          title="CONGRATULATIONS YOU ARE OFFICIALLY ENTERING YOUR PRIME"
          highlightText="WELCOME TO PRIME VERSE"
        />
      </section>
    

      {/* The Truth Section */}
      <section>
        <TheTruth />
      </section>

      {/* Card Collage Section */}
      <section id="products" className="cardcollage-section" style={{ minHeight: '100vh', padding: '4rem 0', scrollMarginTop: '80px' }}>
        <CardCollage />
      </section>

      {/* Animated Timeline Section
      <section id="journey" style={{ scrollMarginTop: '80px' }}>
        <AnimatedTimeline />
      </section> */}

     

    
      {/* Testimonials Section */}
      <section id="testimonials" style={{ scrollMarginTop: '80px' }}>
        <Testimonials />
      </section>

      {/* Roadmap Section
      <section>
        <Roadmap />
      </section>

     */}
      {/* Journey Timeline Section */}
      <section id="journey-timeline" style={{ scrollMarginTop: '80px' }}>
        <JourneyTimeline />
      </section>
      {/* Systems Showcase Section */}
      <section>
        <SystemsShowcase />
      </section>

      {/* Meet Your Mentors Section */}
      {/* <section>
        <MeetMentors />
      </section>  */}


      {/* FAQ Section */}
      <section id="faq" style={{ minHeight: '100vh', scrollMarginTop: '80px' }}>
        <FAQ />
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
