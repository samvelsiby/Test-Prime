import { useEffect, useRef, useState } from 'react';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="testimonials-section">
      {/* Header with circular logo */}
      <div className="testimonials-header">
        <h2 className="testimonials-title">TESTIMONIALS</h2>
        <div className="testimonials-logo">
          <div className="logo-circle">
            <div className="logo-inner">
              <div className="anchor-icon">⚓</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="testimonials-content">
        {/* Large circular element */}
        <div className="large-circle"></div>
        
        {/* Statistics */}
        <div className={`stat-item stat-students ${isVisible ? 'animate-in' : ''}`}>
          <div className="stat-number">7000+</div>
          <div className="stat-label">students</div>
          <div className="stat-line"></div>
        </div>
        
        <div className={`stat-item stat-countries ${isVisible ? 'animate-in' : ''}`}>
          <div className="stat-number">40+</div>
          <div className="stat-label">countries</div>
          <div className="stat-line"></div>
        </div>
      </div>

      {/* Bottom heading */}
      <div className="testimonials-bottom">
        <h3 className="main-heading">AUTOMATE YOUR CAPITAL GROWTH</h3>
      </div>
    </section>
  );
};

export default Testimonials;
