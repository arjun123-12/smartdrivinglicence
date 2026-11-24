import React from 'react';
import { MapPin, CheckCircle, Award } from 'lucide-react';

export default function InfiniteMarquee() {
  const passes = [
    {
      name: 'Jackson M.',
      suburb: 'Warradale Park',
      badge: 'VORT First Time Pass',
      score: '98%',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=350&q=80',
    },
    {
      name: 'Jatin K.',
      suburb: 'Wynn Vale',
      badge: 'Provisional P1',
      score: '100%',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=350&q=80',
    },
    {
      name: 'Jayden T.',
      suburb: 'Elizabeth',
      badge: 'Passed at DIT Hub',
      score: '96%',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=350&q=80',
    },
    {
      name: 'Jonathan L.',
      suburb: 'Adelaide CBD',
      badge: 'Overseas Conversion',
      score: 'First Attempt',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=350&q=80',
    },
    {
      name: 'Alvin R.',
      suburb: 'Campbelltown',
      badge: 'Logbook Competency',
      score: 'P-Plate Ready',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=350&q=80',
    },
    {
      name: 'Tong W.',
      suburb: 'Norwood',
      badge: 'Pre-VORT + VORT',
      score: 'Passed Today',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=350&q=80',
    },
  ];

  // Duplicate for seamless 100% infinite CSS marquee loop
  const marqueeItems = [...passes, ...passes];

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        padding: '2.5rem 0',
        position: 'relative',
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          gap: '1.25rem',
          width: 'max-content',
          animation: 'marquee-scroll 32s linear infinite',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = 'running';
        }}
      >
        {marqueeItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            style={{
              width: '280px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1rem',
              border: '1px solid rgba(13, 38, 69, 0.08)',
              boxShadow: '0 8px 24px rgba(13, 38, 69, 0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(27, 108, 49, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(13, 38, 69, 0.06)';
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={12} strokeWidth={3} />
              </div>
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#1B6C31',
                  backgroundColor: '#EBF5EE',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  marginBottom: '4px',
                }}
              >
                <Award size={10} /> {item.badge}
              </div>

              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#0D2645',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {item.name}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  color: '#64748B',
                }}
              >
                <MapPin size={12} /> {item.suburb}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
