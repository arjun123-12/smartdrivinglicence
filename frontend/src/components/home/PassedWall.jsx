import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, CheckCircle, Trophy, Sparkles } from 'lucide-react';
import DepthCarousel from '../effects/DepthCarousel';
import TiltCard from '../effects/TiltCard';
import ScrollReveal from '../effects/ScrollReveal';
import '../../styles/passwall.css';

const TrophyPass3D = lazy(() => import('../3d/TrophyPass3D'));

/* ==========================================
   AUTHENTIC LEARNER PROFILES
========================================== */
const allLearners = [
  {
    id: 1,
    name: 'Jackson',
    suburb: 'Warradale Park',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    feedback: 'Passed first attempt with examiner Satish! Clear guidance and calm test prep.',
  },
  {
    id: 2,
    name: 'Jatin',
    suburb: 'Wynn Vale',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    feedback: 'Warmup lesson in Modbury test centre gave me total confidence on the 3-point turn.',
  },
  {
    id: 3,
    name: 'Jayden',
    suburb: 'Elizabeth',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    feedback: 'Dual-control automatic car was immaculate. Got my P-plates on Saturday morning!',
  },
  {
    id: 4,
    name: 'Jonathan',
    suburb: 'Adelaide CBD',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    feedback: 'Overseas licence converted smoothly in Thebarton hub. 10/10 recommend A1 Smart Driving.',
  },
  {
    id: 5,
    name: 'Alvin',
    suburb: 'Campbelltown',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    feedback: 'Instructors are so patient and experienced. Passed with 98% score.',
  },
  {
    id: 6,
    name: 'Tong',
    suburb: 'Norwood',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
    feedback: 'Booked online in 2 minutes. Transparent pricing with zero hidden fees.',
  },
];

export default function PassedWall() {
  return (
    <section className="passwall-section scene-perspective-container" aria-labelledby="passwall-heading">
      <div className="passwall-container">
        {/* Left Column: Heading & 3D Trophy Shield */}
        <ScrollReveal direction="left" distance={40}>
          <div className="passwall-content">
            <div className="passwall-tag">
              <span className="passwall-tag-dot" />
              CELEBRATING EVERY SOUTH AUSTRALIAN MILESTONE
            </div>

            <h2 id="passwall-heading" className="passwall-title">
              Passed with
              <br />
              <span>A1 Smart</span>
              <br />
              <span>Driving.</span>
            </h2>

            {/* 3D SA P-Plate Trophy Emblem */}
            <Suspense fallback={<div style={{ minHeight: '180px' }} />}>
              <TrophyPass3D />
            </Suspense>

            <p className="passwall-desc">
              Over 1,200 Adelaide drivers have achieved their provisional licence through our accredited network.
              Join South Australia’s highest-rated driving school.
            </p>

            <div className="passwall-content-actions">
              <Link to="/book-test" className="magnetic-btn" style={{ textDecoration: 'none' }}>
                <span>Book Your VORT Test</span>
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Right Column: 3D Depth Carousel of Successful Learners */}
        <ScrollReveal direction="right" distance={40}>
          <DepthCarousel
            items={allLearners}
            renderItem={(learner, idx, isActive) => (
              <TiltCard maxTilt={10} scale={isActive ? 1.05 : 0.95}>
                <div
                  style={{
                    position: 'relative',
                    height: '420px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    background: '#07172b',
                  }}
                >
                  <img
                    src={learner.image}
                    alt={`${learner.name} passed driving test`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isActive ? 'brightness(0.95)' : 'brightness(0.7)',
                      transition: 'filter 0.4s ease',
                    }}
                  />

                  {/* Gradient Scrim */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(7, 23, 43, 0.95) 0%, rgba(7, 23, 43, 0.4) 50%, transparent 100%)',
                    }}
                  />

                  {/* P-Plate Badge Overlay */}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <span
                      style={{
                        background: '#dc2626',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        width: '36px',
                        height: '42px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(220, 38, 38, 0.5)',
                        border: '2px solid #ffffff',
                      }}
                    >
                      P
                    </span>
                  </div>

                  {/* Learner Info */}
                  <div style={{ position: 'relative', zIndex: 2, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#86efac', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      <CheckCircle size={15} /> FIRST-TIME PASS
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#ffffff', fontWeight: 800 }}>
                      {learner.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem', marginBottom: '0.65rem' }}>
                      <MapPin size={13} /> {learner.suburb} (SA)
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.45, fontStyle: 'italic' }}>
                      "{learner.feedback}"
                    </p>
                  </div>
                </div>
              </TiltCard>
            )}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
