import { useState, useEffect } from 'react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar" style={{
      position: 'fixed',
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      backgroundColor: 'rgba(20, 30, 53, 0.5)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '31px',
      padding: '0.4rem 1.5rem',
      maxWidth: '900px',
      width: 'calc(100% - 2rem)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '50px',
        width: '100%',
      }}>
        {/* Logo */}
        <div className="nav-brand" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <img 
            src="/favicon.svg" 
            alt="Prime Verse Logo" 
            width="32" 
            height="32"
            style={{ filter: 'brightness(1.2)' }}
          />
        </div>

        {/* Mobile Menu Button & Log in */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="mobile-controls">
          <button
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 255, 0.9) 100%)',
              color: '#0a0f23',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '25px',
              padding: '0.5rem 1.2rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              whiteSpace: 'nowrap',
            }}
            onClick={() => window.open('https://getformly.app/vJXW3N', '_blank')}
          >
            Log in
          </button>
          
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
            aria-label="Toggle menu"
          >
            <span style={{ width: '24px', height: '2px', background: '#fff', borderRadius: '2px', transition: 'all 0.3s' }}></span>
            <span style={{ width: '24px', height: '2px', background: '#fff', borderRadius: '2px', transition: 'all 0.3s' }}></span>
            <span style={{ width: '24px', height: '2px', background: '#fff', borderRadius: '2px', transition: 'all 0.3s' }}></span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <ul style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(1rem, 2vw, 2.5rem)',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
        className="desktop-nav"
        >
          <li>
            <a 
              href="#home" 
              onClick={(e) => handleSmoothScroll(e, '#home')}
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                fontWeight: 500,
                transition: 'color 0.3s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#products" 
              onClick={(e) => handleSmoothScroll(e, '#products')}
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                fontWeight: 500,
                transition: 'color 0.3s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
            >
              Products
            </a>
          </li>
          <li>
            <a 
              href="#testimonials" 
              onClick={(e) => handleSmoothScroll(e, '#testimonials')}
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                fontWeight: 500,
                transition: 'color 0.3s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
            >
              Testimonials
            </a>
          </li>
          <li>
            <a 
              href="#faq" 
              onClick={(e) => handleSmoothScroll(e, '#faq')}
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                fontWeight: 500,
                transition: 'color 0.3s ease',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
            >
              FAQ
            </a>
          </li>
          <li>
            <button
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 255, 0.9) 100%)',
                color: '#0a0f23',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '25px',
                padding: 'clamp(0.5rem, 1vw, 0.6rem) clamp(1.2rem, 2vw, 1.8rem)',
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 255, 0.9) 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
              onClick={() => window.open('https://getformly.app/vJXW3N', '_blank')}
            >
              Log in
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          background: 'rgba(20, 30, 53, 0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          animation: 'slideDown 0.3s ease-out',
        }}>
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <li>
              <a 
                href="#home" 
                onClick={(e) => {
                  handleSmoothScroll(e, '#home');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '0.75rem 1rem',
                  display: 'block',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#products" 
                onClick={(e) => {
                  handleSmoothScroll(e, '#products');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '0.75rem 1rem',
                  display: 'block',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                Products
              </a>
            </li>
            <li>
              <a 
                href="#testimonials" 
                onClick={(e) => {
                  handleSmoothScroll(e, '#testimonials');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '0.75rem 1rem',
                  display: 'block',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                Testimonials
              </a>
            </li>
            <li>
              <a 
                href="#faq" 
                onClick={(e) => {
                  handleSmoothScroll(e, '#faq');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '0.75rem 1rem',
                  display: 'block',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-controls {
          display: none;
        }

        .desktop-nav {
          display: flex;
        }

        @media (max-width: 768px) {
          .mobile-controls {
            display: flex;
          }

          .desktop-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;