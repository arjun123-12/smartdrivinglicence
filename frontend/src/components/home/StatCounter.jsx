import React, { useEffect, useRef, useState } from 'react';
import { Award, Users, ShieldCheck, Star, Car } from 'lucide-react';
import ScrollReveal from '../effects/ScrollReveal';

export default function StatCounter() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  const stats = [
    {
      value: 98.4,
      suffix: '%',
      label: 'First-Time Pass Rate',
      sublabel: 'Adelaide average is ~62%',
      icon: Award,
      color: '#1B6C31',
      decimals: 1,
    },
    {
      value: 1250,
      suffix: '+',
      label: 'Learners Licensed',
      sublabel: 'Provisional P1 & P2 passed',
      icon: Users,
      color: '#0D2645',
      decimals: 0,
    },
    {
      value: 14,
      suffix: '+ Years',
      label: 'Testing Experience',
      sublabel: 'Senior Accredited Examiners',
      icon: ShieldCheck,
      color: '#1B6C31',
      decimals: 0,
    },
    {
      value: 5.0,
      suffix: ' ★',
      label: 'Google Review Rating',
      sublabel: 'Over 280+ 5-star reviews',
      icon: Star,
      color: '#F59E0B',
      decimals: 1,
    },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const duration = 1800; // 1.8s count animation

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCounts(
              stats.map((s) => {
                const current = s.value * easeOut;
                return s.decimals > 0 ? parseFloat(current.toFixed(s.decimals)) : Math.floor(current);
              })
            );

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={containerRef}
      style={{
        padding: '3rem 1.5rem',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F6F2 100%)',
        borderTop: '1px solid rgba(27, 108, 49, 0.12)',
        borderBottom: '1px solid rgba(13, 38, 69, 0.08)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div
                  className="stat-card-premium"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.75rem 1.5rem',
                    border: '1px solid rgba(13, 38, 69, 0.08)',
                    boxShadow: '0 8px 24px rgba(13, 38, 69, 0.05)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(27, 108, 49, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(13, 38, 69, 0.05)';
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: `${stat.color}15`,
                      border: `1.5px solid ${stat.color}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={24} />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: 900,
                        color: 'var(--color-secondary, #0D2645)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                      }}
                    >
                      {hasAnimated ? counts[i] : 0}
                      <span style={{ color: stat.color, fontSize: '1.4rem' }}>{stat.suffix}</span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--color-text, #0D2645)',
                        marginTop: '0.25rem',
                      }}
                    >
                      {stat.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted, #5A6E7F)',
                        marginTop: '0.15rem',
                      }}
                    >
                      {stat.sublabel}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
