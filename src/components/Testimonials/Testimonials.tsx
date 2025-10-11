import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      videoId: "riXina8WsmA"
    },
    {
      videoId: "pzoUqg4nCa4"
    },
    {
      videoId: "s-dfxG5WWuQ"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const radius = 2;
    const particleCount = 8000;

    // Create particle sphere
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Blue colors
      colors[i * 3] = 0.1;
      colors[i * 3 + 1] = 0.4;
      colors[i * 3 + 2] = 1.0;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystem.rotation.x = Math.PI * 0.15;
    scene.add(particleSystem);

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };
    const damping = 0.95;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      rotationVelocity.y = deltaX * 0.005;
      rotationVelocity.x = deltaY * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      previousMousePosition = { 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      rotationVelocity.y = deltaX * 0.005;
      rotationVelocity.x = deltaY * 0.005;
      previousMousePosition = { 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    renderer.domElement.addEventListener('touchmove', onTouchMove);
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (!isDragging) {
        particleSystem.rotation.y += rotationVelocity.y;
        particleSystem.rotation.x += rotationVelocity.x;
        
        rotationVelocity.y *= damping;
        rotationVelocity.x *= damping;
        
        if (Math.abs(rotationVelocity.y) < 0.0001) {
          particleSystem.rotation.y += 0.001;
        }
      } else {
        particleSystem.rotation.y += rotationVelocity.y;
        particleSystem.rotation.x += rotationVelocity.x;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="testimonials-section"
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'radial-gradient(circle at center, #19247F 0%, #050719 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out'
      }}
    >
      {/* Blue header bar */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        padding: '2rem 4rem',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 1
      }}>
        <h2 style={{
          fontFamily: 'Gonero-ExtraExpanded, Arial Black, sans-serif',
          fontSize: '2rem',
          fontWeight: 'normal',
          color: 'white',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: 0,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          TESTIMONIALS
        </h2>
        
        {/* Rotating explore icon - centered and overlapping */}
        <div 
          className="explore-icon"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, 0%)',
            width: '120px',
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            cursor: 'default'
          }}>
          <div style={{
            animation: 'rotate 20s linear infinite',
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="/icons/explore.svg" 
              alt="Explore" 
              width={120} 
              height={120}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Testimonials Cards Section - Shows when explore is clicked */}
      {showTestimonials && (
        <div className="testimonials-reveal" style={{
          width: '100%',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3rem',
          animation: 'slideDown 0.5s ease-out',
          position: 'relative'
        }}>
          {/* Title */}
          <h2 style={{
            fontFamily: 'Gonero-ExtraExpanded, Arial Black, sans-serif',
            fontSize: '2.5rem',
            fontWeight: 'normal',
            color: 'white',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            margin: 0,
            textAlign: 'center'
          }}></h2>

          {/* Desktop Grid - YouTube Videos */}
          <div className="desktop-testimonials" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            width: '100%',
            maxWidth: '1400px'
          }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '1rem',
                transition: 'all 0.3s ease',
                transform: index === 1 ? 'scale(1.15)' : 'scale(0.85)',
                flex: index === 1 ? '0 0 380px' : '0 0 300px',
                zIndex: index === 1 ? 10 : 1,
                boxShadow: 'none'
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '177.78%', // 9:16 aspect ratio for shorts
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '15px'
                }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=0&mute=1&controls=1&showinfo=0&rel=0&modestbranding=1`}
                    title={`Testimonial Video ${index + 1}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '15px'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Carousel - Hidden on desktop */}
          <div className="mobile-testimonials" style={{
            display: 'none',
            width: '100%',
            maxWidth: '500px',
            position: 'relative'
          }}>
            {/* Left Arrow */}
            <button
              onClick={prevTestimonial}
              style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1.5rem',
                zIndex: 10,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ‹
            </button>

            {/* YouTube Video Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: 'none'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '177.78%', // 9:16 aspect ratio for shorts
                height: 0,
                overflow: 'hidden',
                borderRadius: '15px'
              }}>
                <iframe
                  src={`https://www.youtube.com/embed/${testimonials[currentTestimonial].videoId}?autoplay=0&mute=1&controls=1&showinfo=0&rel=0&modestbranding=1`}
                  title={`Testimonial Video ${currentTestimonial + 1}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '15px'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextTestimonial}
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1.5rem',
                zIndex: 10,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ›
            </button>

            {/* Dots Indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '2rem'
            }}>
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: currentTestimonial === index ? 'white' : 'rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content with Three.js globe */}
      <div className="main-content" style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        overflow: 'hidden'
      }}>
        {/* Three.js sphere container */}
        <div 
          ref={mountRef} 
          style={{
            width: 'min(800px, 90vw)',
            height: 'min(800px, 90vw)',
            maxWidth: '1200px',
            maxHeight: '1200px',
            position: 'relative',
            zIndex: 1
          }}
        />

        {/* Left stat - 7000+ students */}
        <div className="stat-left" style={{
          position: 'absolute',
          top: '30%',
          left: '1%',
          zIndex: 2,
          opacity: isVisible ? 1 : 0,
          transition: 'all 1s ease-out 0.5s'
        }}>
          <div style={{
            color: 'white',
            textAlign: 'right',
            paddingRight: '1rem'
          }}>
            <div style={{
              fontFamily: 'Gonero-ExtraExpanded, Arial Black, sans-serif',
              fontSize: '2.5rem',
              fontWeight: 'normal',
              marginBottom: '0.5rem',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>7000+</div>
            <div style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.05em'
            }}>students</div>
          </div>
          
          {/* Line and dot */}
          <svg style={{
            position: 'absolute',
            top: '50%',
            left: '100%',
            transform: 'translateY(-50%)',
            overflow: 'visible',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1s ease-out 0.8s'
          }} width="120" height="4">
            <line x1="0" y1="2" x2="120" y2="2" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="120" cy="2" r="6" fill="#3b82f6" style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))'
            }} />
          </svg>
        </div>

        {/* Right stat - 40+ countries */}
        <div className="stat-right" style={{
          position: 'absolute',
          top: '50%',
          right: '1%',
          zIndex: 2,
          opacity: isVisible ? 1 : 0,
          transition: 'all 1s ease-out 0.7s'
        }}>
          <div style={{
            color: 'white',
            textAlign: 'left',
            paddingLeft: '1rem'
          }}>
            <div style={{
              fontFamily: 'Gonero-ExtraExpanded, Arial Black, sans-serif',
              fontSize: '2.5rem',
              fontWeight: 'normal',
              marginBottom: '0.5rem',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>40+</div>
            <div style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.05em'
            }}>countries</div>
          </div>
          
          {/* Line and dot */}
          <svg style={{
            position: 'absolute',
            top: '50%',
            right: '100%',
            transform: 'translateY(-50%)',
            overflow: 'visible',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1s ease-out 1s'
          }} width="120" height="4">
            <line x1="0" y1="2" x2="120" y2="2" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="0" cy="2" r="6" fill="#3b82f6" style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))'
            }} />
          </svg>
        </div>

        {/* Top Right stat - 10M+ profit withdrawals */}
        <div className="stat-top-right" style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          zIndex: 2,
          opacity: isVisible ? 1 : 0,
          transition: 'all 1s ease-out 0.9s'
        }}>
          <div style={{
            color: 'white',
            textAlign: 'left',
            paddingLeft: '1rem'
          }}>
            <div style={{
              fontFamily: 'Gonero-ExtraExpanded, Arial Black, sans-serif',
              fontSize: '2.5rem',
              fontWeight: 'normal',
              marginBottom: '0.5rem',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>10M+</div>
            <div style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.05em'
            }}>profit withdrawals</div>
          </div>
          
          {/* Line and dot */}
          <svg style={{
            position: 'absolute',
            top: '50%',
            right: '100%',
            transform: 'translateY(-50%)',
            overflow: 'visible',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1s ease-out 1.2s'
          }} width="120" height="4">
            <line x1="0" y1="2" x2="120" y2="2" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="0" cy="2" r="6" fill="#3b82f6" style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))'
            }} />
          </svg>
        </div>

        {/* Bottom Left stat - 4M+ commissions paid */}
        <div className="stat-bottom-left" style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          zIndex: 2,
          opacity: isVisible ? 1 : 0,
          transition: 'all 1s ease-out 1.1s'
        }}>
          <div style={{
            color: 'white',
            textAlign: 'right',
            paddingRight: '1rem'
          }}>
            <div style={{
              fontFamily: 'Gonero-ExtraExpanded, Arial Black, sans-serif',
              fontSize: '2.5rem',
              fontWeight: 'normal',
              marginBottom: '0.5rem',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>4M+</div>
            <div style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.05em'
            }}>commissions paid</div>
          </div>
          
          {/* Line and dot */}
          <svg style={{
            position: 'absolute',
            top: '50%',
            left: '100%',
            transform: 'translateY(-50%)',
            overflow: 'visible',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1s ease-out 1.4s'
          }} width="120" height="4">
            <line x1="0" y1="2" x2="120" y2="2" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="120" cy="2" r="6" fill="#3b82f6" style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))'
            }} />
          </svg>
        </div>

        {/* Mobile Stats Wrapper - Only visible on mobile */}
        <div className="mobile-stats-wrapper" style={{ display: 'none' }}>
          <div className="stat-left" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '1.5rem 1rem',
            backdropFilter: 'blur(10px)',
            flex: '0 0 calc(50% - 0.5rem)',
            maxWidth: '180px'
          }}>
            <div style={{
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'Gonero-ExtraExpanded, Arial Black, sans-serif',
                fontSize: '2rem',
                fontWeight: 'normal',
                marginBottom: '0.5rem',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}>7000+</div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.05em'
              }}>students</div>
            </div>
          </div>

          <div className="stat-right" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '1.5rem 1rem',
            backdropFilter: 'blur(10px)',
            flex: '0 0 calc(50% - 0.5rem)',
            maxWidth: '180px'
          }}>
            <div style={{
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'Gonero-ExtraExpanded, Arial Black, sans-serif',
                fontSize: '2rem',
                fontWeight: 'normal',
                marginBottom: '0.5rem',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}>40+</div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.05em'
              }}>countries</div>
            </div>
          </div>

          <div className="stat-top-right" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '1.5rem 1rem',
            backdropFilter: 'blur(10px)',
            flex: '0 0 calc(50% - 0.5rem)',
            maxWidth: '180px'
          }}>
            <div style={{
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'Gonero-ExtraExpanded, Arial Black, sans-serif',
                fontSize: '2rem',
                fontWeight: 'normal',
                marginBottom: '0.5rem',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}>10M+</div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.05em'
              }}>profit withdrawals</div>
            </div>
          </div>

          <div className="stat-bottom-left" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '1.5rem 1rem',
            backdropFilter: 'blur(10px)',
            flex: '0 0 calc(50% - 0.5rem)',
            maxWidth: '180px'
          }}>
            <div style={{
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'Gonero-ExtraExpanded, Arial Black, sans-serif',
                fontSize: '2rem',
                fontWeight: 'normal',
                marginBottom: '0.5rem',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}>4M+</div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.05em'
              }}>commissions paid</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .desktop-testimonials {
          display: grid;
        }
        
        .mobile-testimonials {
          display: none;
        }
        
        @media (max-width: 768px) {
          .desktop-testimonials {
            display: none !important;
          }
          
          .mobile-testimonials {
            display: block !important;
          }
        }
        
        @media (max-width: 1024px) {
          section > div:nth-child(2) > div:nth-child(2) {
            left: 5% !important;
          }
          
          section > div:nth-child(2) > div:nth-child(3) {
            right: 5% !important;
          }
          
          .stat-top-right {
            right: 15% !important;
            top: 22% !important;
          }
          
          .stat-bottom-left {
            left: 15% !important;
            bottom: 22% !important;
          }
        }
        
        @media (min-width: 1920px) {
          /* Large screens - scale up the sphere */
          .main-content > div:first-child {
            width: 1000px !important;
            height: 1000px !important;
            max-width: 1200px !important;
            max-height: 1200px !important;
          }
        }
        
        @media (min-width: 1440px) and (max-width: 1919px) {
          /* Medium-large screens */
          .main-content > div:first-child {
            width: 900px !important;
            height: 900px !important;
          }
        }
        
        @media (max-width: 768px) {
          /* Remove min-height on mobile to prevent empty space */
          .testimonials-section {
            min-height: auto !important;
          }
          
          section > div:first-child {
            padding: 1.5rem 1.5rem !important;
            justify-content: center !important;
          }
          
          /* Testimonials reveal section on mobile */
          .testimonials-reveal {
            padding: 1.5rem 1rem !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
          
          /* Ensure all children are centered */
          .testimonials-reveal > * {
            align-self: center !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          
          /* Mobile testimonials grid - make it centered */
          .desktop-testimonials {
            display: none !important;
          }
          
          .mobile-testimonials {
            display: block !important;
            width: 100% !important;
            max-width: 280px !important;
            margin: 0 auto !important;
            position: relative !important;
            left: 0 !important;
            right: 0 !important;
            transform: none !important;
          }
          
          /* Center the testimonial card content */
          .mobile-testimonials > div:not(button) {
            margin: 0 auto !important;
            text-align: center !important;
          }
          
          /* Fix mobile testimonial arrows positioning */
          .mobile-testimonials button {
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 10 !important;
          }
          
          .mobile-testimonials button:first-of-type {
            left: -10px !important;
          }
          
          .mobile-testimonials button:last-of-type {
            right: -10px !important;
          }
          
          /* Main content - remove flex: 1 behavior on mobile */
          .main-content {
            flex: none !important;
          }
          
          section > div:first-child h2 {
            font-size: 1.3rem !important;
            text-align: center;
            position: relative;
            z-index: 1;
          }
          
          .explore-icon {
            width: 90px !important;
            height: 90px !important;
            transform: translate(-50%, 20%) !important;
          }
          
          .explore-icon img {
            width: 90px !important;
            height: 90px !important;
          }
          
          /* Main content wrapper - ensure proper layout */
          .main-content {
            padding: 2.5rem 1rem 2rem 1rem !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1rem !important;
            min-height: auto !important;
          }
          
          /* Three.js globe container - smaller on mobile */
          .main-content > div:first-child {
            width: 100% !important;
            max-width: 350px !important;
            height: 350px !important;
            order: 1;
          }
          
          /* Mobile stats wrapper */
          .mobile-stats-wrapper {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 1rem !important;
            width: 100% !important;
            max-width: 400px !important;
            order: 3;
          }
          
          /* Hide desktop positioned stats on mobile */
          .main-content > .stat-left,
          .main-content > .stat-right,
          .main-content > .stat-top-right,
          .main-content > .stat-bottom-left {
            display: none !important;
          }
          
          /* Show only the mobile stats wrapper */
          .mobile-stats-wrapper .stat-left,
          .mobile-stats-wrapper .stat-right,
          .mobile-stats-wrapper .stat-top-right,
          .mobile-stats-wrapper .stat-bottom-left {
            display: flex !important;
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            borderRadius: 15px !important;
            padding: 1.5rem 1rem !important;
            backdropFilter: blur(10px) !important;
            flex: 0 0 calc(50% - 0.5rem) !important;
            max-width: 180px !important;
          }
        
        @media (max-width: 480px) {
          section > div:first-child h2 {
            font-size: 1.1rem !important;
            letter-spacing: 0.1em !important;
          }
          
          .explore-icon {
            width: 80px !important;
            height: 80px !important;
          }
          
          .explore-icon img {
            width: 80px !important;
            height: 80px !important;
          }
          
          
          /* Adjust spacing for very small screens */
          .main-content {
            padding: 2.5rem 1rem 1.5rem 1rem !important;
            gap: 0.5rem !important;
          }
          
          /* Three.js globe smaller on very small screens */
          .main-content > div:first-child {
            max-width: 300px !important;
            height: 300px !important;
          }
          
          /* Mobile stats smaller on very small screens */
          .mobile-stats-wrapper .stat-left > div > div:first-child,
          .mobile-stats-wrapper .stat-right > div > div:first-child {
            font-size: 1.8rem !important;
          }
          
          .mobile-stats-wrapper {
            max-width: 350px !important;
          }
          
          .mobile-stats-wrapper .stat-left,
          .mobile-stats-wrapper .stat-right,
          .mobile-stats-wrapper .stat-top-right,
          .mobile-stats-wrapper .stat-bottom-left {
            padding: 1rem 0.8rem !important;
            max-width: 160px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;