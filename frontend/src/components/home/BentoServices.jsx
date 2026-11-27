import React from 'react';
import { Link } from 'react-router-dom';
import TiltCard from '../effects/TiltCard';
import ScrollReveal from '../effects/ScrollReveal';
import SectionHeading from '../typography/SectionHeading';
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
    <section className="public-pattern-surface"
      style={{
        padding: '5rem 1.5rem',
        backgroundColor: 'var(--color-background, #F8FAF8)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <SectionHeading
          eyebrow="Elite Automotive Training"
          eyebrowIcon={Sparkles}
          liveDot={true}
          title="Everything You Need to Get on Adelaide Roads"
          highlightWord="Adelaide Roads"
          subtitle="Tailored South Australian driver education—from your very first steering wheel touch to official VORT test day in an ANCAP 5-star dual-control vehicle."
          theme="light"
          size="lg"
        />

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
                <article className="bento-vort">
                  <div>
                    <span className="bento-vort__badge"><Award size={16} aria-hidden="true" /> Most Popular Service</span>
                    <h3>VORT Test &amp; Vehicle Hire</h3>
                    <p>Book your practical test with an authorised examiner.</p>
                    <ul className="bento-vort__features">
                      <li><CheckCircle2 size={16} aria-hidden="true" /> 45-minute warm-up</li>
                      <li><CheckCircle2 size={16} aria-hidden="true" /> Dual-control car hire</li>
                    </ul>
                  </div>
                  <div className="bento-vort__footer">
                    <div className="bento-vort__price">
                      <span>From</span>
                      <strong>$240.00</strong>
                      <span>AUD</span>
                    </div>
                    <Link to="/book-test" className="button button-primary bento-vort__book">
                      Book VORT Test <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
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
