import React from 'react';
import { Link } from 'react-router-dom';
import TiltCard from '../effects/TiltCard';
import ScrollReveal from '../effects/ScrollReveal';
import MagneticButton from '../effects/MagneticButton';
import {
  Car,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  Globe,
} from 'lucide-react';

export default function BentoServices({ services = [] }) {
  return (
    <section
      style={{
        padding: '5rem 1.5rem',
        background: 'var(--color-background, #F8FAF8)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-primary-light, #EBF5EE)',
              color: 'var(--color-primary, #1B6C31)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={16} /> Elite Automotive Training
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 900,
              color: 'var(--color-secondary, #0D2645)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            Everything You Need to Get on Adelaide Roads
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--color-text-muted, #5A6E7F)',
              marginTop: '1rem',
              lineHeight: 1.6,
            }}
          >
            Tailored South Australian driver education—from your very first steering wheel touch to official VORT test day in an ANCAP 5-star dual-control vehicle.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1.5rem',
          }}
        >
          {/* 1. Large Hero Bento Card: Official VORT Test Prep & Car Hire (7 cols desktop) */}
          <div style={{ gridColumn: 'span 12', '@media(min-width: 992px)': { gridColumn: 'span 7' } }} className="bento-col-7">
            <ScrollReveal delay={0.1}>
              <TiltCard maxTilt={7} glareOpacity={0.25}>
                <div
                  style={{
                    backgroundColor: 'var(--color-secondary, #0D2645)',
                    color: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 20px 45px rgba(13, 38, 69, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Subtle Background Glow Accent */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10%',
                      right: '-10%',
                      width: '300px',
                      height: '300px',
                      background: 'radial-gradient(circle, rgba(27, 108, 49, 0.4) 0%, transparent 70%)',
                      filter: 'blur(40px)',
                      pointerEvents: 'none',
                    }}
                  />

                  <div>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'rgba(27, 108, 49, 0.35)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        color: '#4ade80',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <Award size={14} /> Most Popular Service
                    </div>

                    <h3 style={{ fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.2 }}>
                      Official VORT Test &amp; Vehicle Hire Package
                    </h3>

                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '520px' }}>
                      Complete Vehicle On Road Test (VORT) package with accredited Authorised Examiner. Includes a 45-minute warm-up drive right before your test, car hire for the test, and government submission upon passing.
                    </p>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem',
                        marginTop: '1.5rem',
                        marginBottom: '2rem',
                      }}
                    >
                      {[
                        'Dual-control Toyota Corolla Hybrid',
                        'Warm-up mock maneuvers included',
                        'Marion, Port Adelaide & Regency Park',
                        'Direct DIT score submission',
                      ].map((item) => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#E2E8F0' }}>
                          <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting From</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF' }}>$240.00 <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>AUD</span></div>
                    </div>
                    <MagneticButton>
                      <Link
                        to="/book-test"
                        className="button button-accent"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '12px 24px',
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          borderRadius: '12px',
                        }}
                      >
                        Book VORT Test <ArrowRight size={16} />
                      </Link>
                    </MagneticButton>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>

          {/* 2. Bento Card: First-Time Learner Lessons (5 cols desktop) */}
          <div style={{ gridColumn: 'span 12', '@media(min-width: 992px)': { gridColumn: 'span 5' } }} className="bento-col-5">
            <ScrollReveal delay={0.2}>
              <TiltCard maxTilt={8} glareOpacity={0.2}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    height: '100%',
                    border: '1px solid var(--color-border, #DCE5DE)',
                    boxShadow: '0 16px 36px rgba(13, 38, 69, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--color-primary-light, #EBF5EE)',
                        color: 'var(--color-primary, #1B6C31)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <Car size={26} />
                    </div>

                    <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-secondary, #0D2645)', marginBottom: '0.5rem' }}>
                      Standard Driving Lessons
                    </h3>

                    <p style={{ color: 'var(--color-text-muted, #5A6E7F)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      Zero-stress, patient private lessons for beginner and intermediate drivers. Full 75-hour logbook signoffs and defensive road craft.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                        <CheckCircle2 size={15} color="#1B6C31" /> Free home, school, or work pickup
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                        <CheckCircle2 size={15} color="#1B6C31" /> Dual-control automatic transmission
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                        <CheckCircle2 size={15} color="#1B6C31" /> Logbook competency progression
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary, #1B6C31)' }}>
                      $85.00 <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>/ hr</span>
                    </div>
                    <Link
                      to="/book-lesson"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--color-primary, #1B6C31)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                      }}
                    >
                      Book Lesson <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>

          {/* 3. Bento Card: Pre-VORT Mock Driving Test (4 cols desktop) */}
          <div style={{ gridColumn: 'span 12', '@media(min-width: 992px)': { gridColumn: 'span 4' } }} className="bento-col-4">
            <ScrollReveal delay={0.25}>
              <TiltCard maxTilt={8} glareOpacity={0.2}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '2rem',
                    height: '100%',
                    border: '1px solid var(--color-border, #DCE5DE)',
                    boxShadow: '0 12px 30px rgba(13, 38, 69, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <FileCheck size={22} />
                    </div>

                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary, #0D2645)', marginBottom: '0.4rem' }}>
                      Pre-VORT Mock Test
                    </h4>
                    <p style={{ color: 'var(--color-text-muted, #5A6E7F)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      Identical scoring conditions to the actual DIT test. Uncover any critical errors before your official attempt.
                    </p>
                  </div>

                  <Link
                    to="/mock-test"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#2563EB',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    View Mock Test Criteria <ArrowRight size={14} />
                  </Link>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>

          {/* 4. Bento Card: Overseas Licence Conversion (4 cols desktop) */}
          <div style={{ gridColumn: 'span 12', '@media(min-width: 992px)': { gridColumn: 'span 4' } }} className="bento-col-4">
            <ScrollReveal delay={0.3}>
              <TiltCard maxTilt={8} glareOpacity={0.2}>
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '2rem',
                    height: '100%',
                    border: '1px solid var(--color-border, #DCE5DE)',
                    boxShadow: '0 12px 30px rgba(13, 38, 69, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        backgroundColor: '#FEF3C7',
                        color: '#D97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <Globe size={22} />
                    </div>

                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary, #0D2645)', marginBottom: '0.4rem' }}>
                      Overseas Conversion
                    </h4>
                    <p style={{ color: 'var(--color-text-muted, #5A6E7F)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      Convert your international licence to an unrestricted Australian SA driver licence quickly and painlessly.
                    </p>
                  </div>

                  <Link
                    to="/book-test"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#D97706',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    Conversion Guidance <ArrowRight size={14} />
                  </Link>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>

          {/* 5. Bento Card: Lesson Discount Packages (4 cols desktop) */}
          <div style={{ gridColumn: 'span 12', '@media(min-width: 992px)': { gridColumn: 'span 4' } }} className="bento-col-4">
            <ScrollReveal delay={0.35}>
              <TiltCard maxTilt={8} glareOpacity={0.2}>
                <div
                  style={{
                    backgroundColor: 'linear-gradient(135deg, #EBF5EE 0%, #FFFFFF 100%)',
                    borderRadius: '20px',
                    padding: '2rem',
                    height: '100%',
                    border: '1.5px solid var(--color-primary-subtle, #D2E7D7)',
                    boxShadow: '0 12px 30px rgba(27, 108, 49, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--color-primary-light, #EBF5EE)',
                        color: 'var(--color-primary, #1B6C31)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <Sparkles size={22} />
                    </div>

                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary, #0D2645)', marginBottom: '0.4rem' }}>
                      Bundle &amp; Save Packages
                    </h4>
                    <p style={{ color: 'var(--color-text-muted, #5A6E7F)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      Save up to $150 with our 5-hour and 10-hour discounted packs with priority weekend scheduling.
                    </p>
                  </div>

                  <Link
                    to="/lesson-packages"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--color-primary, #1B6C31)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    Explore Packages <ArrowRight size={14} />
                  </Link>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 992px) {
          .bento-col-7 { grid-column: span 7 !important; }
          .bento-col-5 { grid-column: span 5 !important; }
          .bento-col-4 { grid-column: span 4 !important; }
        }
      `}</style>
    </section>
  );
}
