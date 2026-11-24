import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../effects/ScrollReveal';
import TiltCard from '../effects/TiltCard';
import MagneticButton from '../effects/MagneticButton';
import SectionHeading from '../typography/SectionHeading';
import {
  Compass,
  FileCheck,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Clock,
  Car,
  Sparkles,
} from 'lucide-react';

export default function RoadJourney() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: "Learner's Permit & First Lesson",
      subtitle: 'Build Rock-Solid Confidence',
      desc: 'Obtain your SA learner permit and book your introductory driving lesson. Your accredited instructor introduces dual-control vehicle mechanics, blind spot checks, and stress-free steering in quiet residential Adelaide streets.',
      icon: Compass,
      badge: 'Step 1: The Foundation',
      highlights: [
        'Dual-control automatic car safety',
        'Introductory skill assessment',
        'Stress-free calm atmosphere',
      ],
      link: '/book-lesson',
      linkText: 'Book Intro Lesson',
    },
    {
      step: '02',
      title: 'Logbook Progression & Hazard Skills',
      subtitle: 'Master Adelaide Arterials',
      desc: 'Log compulsory supervised hours (75 hours including 15 at night). Practice complex multilane intersections, Britannia roundabout navigation, freeway merging, and night driving with professional signoffs.',
      icon: Clock,
      badge: 'Step 2: Experience',
      highlights: [
        'Arterial & night road conditions',
        'South Australian road rule mastery',
        'Online Hazard Perception Test prep',
      ],
      link: '/lesson-packages',
      linkText: 'View Lesson Packages',
    },
    {
      step: '03',
      title: 'Pre-VORT Mock Maneuvers Masterclass',
      subtitle: 'Zero Critical Errors',
      desc: 'Rehearse the 5 mandatory VORT maneuvers: Reverse Parallel Park, 3-Point Turn, Kerb Stop, Angle Parking, and U-Turn. Evaluated against official DIT criteria so no unexpected surprises occur on test day.',
      icon: FileCheck,
      badge: 'Step 3: Test Readiness',
      highlights: [
        'Exact test route simulation',
        'Reverse parallel park precision',
        'Mock score sheet debrief',
      ],
      link: '/mock-test',
      linkText: 'Check Test Criteria',
    },
    {
      step: '04',
      title: 'Pass VORT & Claim P-Plates',
      subtitle: 'Drive Solo Across Australia',
      desc: 'Sit your official VORT driving test with an Authorised Examiner at an official Adelaide testing centre (Marion, Thebarton, Port Adelaide, Regency Park). Warm up right before test, pass, and celebrate your P-plates!',
      icon: Award,
      badge: 'Step 4: Freedom',
      highlights: [
        '45-min pre-test warmup drive',
        'Dual-control vehicle test hire',
        'Direct Service SA pass submission',
      ],
      link: '/book-test',
      linkText: 'Book VORT Test',
    },
  ];

  return (
    <section
      style={{
        padding: '5.5rem 1.5rem',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F6F2 50%, #FFFFFF 100%)',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <SectionHeading
          eyebrow="The Adelaide Licence Journey"
          eyebrowIcon={Compass}
          liveDot={true}
          title="From Learner Ls to Provisional Ps in 4 Simple Steps"
          highlightWord="Provisional Ps"
          subtitle="No guesswork, no stress. Follow our proven South Australian training roadmap designed to get you test-ready and licensed with first-time confidence."
          theme="light"
          size="lg"
        />

        {/* 4-Step Interactive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
            position: 'relative',
          }}
        >
          {steps.map((st, i) => {
            const IconComponent = st.icon;
            const isSelected = activeStep === i;

            return (
              <ScrollReveal key={st.step} delay={i * 0.12}>
                <TiltCard maxTilt={6} glareOpacity={0.25}>
                  <div
                    onClick={() => setActiveStep(i)}
                    style={{
                      backgroundColor: isSelected ? 'var(--color-secondary, #0D2645)' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text, #0D2645)',
                      borderRadius: '20px',
                      padding: '2.25rem 1.75rem',
                      height: '100%',
                      border: isSelected
                        ? '2px solid rgba(27, 108, 49, 0.8)'
                        : '1px solid var(--color-border, #DCE5DE)',
                      boxShadow: isSelected
                        ? '0 20px 45px rgba(13, 38, 69, 0.25), 0 0 25px rgba(27, 108, 49, 0.25)'
                        : '0 10px 30px rgba(13, 38, 69, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div>
                      {/* Top Step Pill & Number */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '1.5rem',
                        }}
                      >
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '14px',
                            backgroundColor: isSelected
                              ? 'rgba(27, 108, 49, 0.4)'
                              : 'var(--color-primary-light, #EBF5EE)',
                            color: isSelected ? '#4ade80' : 'var(--color-primary, #1B6C31)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconComponent size={24} />
                        </div>

                        <span
                          style={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            color: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(13, 38, 69, 0.1)',
                            fontFamily: 'monospace',
                          }}
                        >
                          {st.step}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: isSelected ? '#4ade80' : 'var(--color-primary, #1B6C31)',
                          marginBottom: '0.4rem',
                        }}
                      >
                        {st.badge}
                      </div>

                      <h3
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          lineHeight: 1.25,
                          marginBottom: '0.75rem',
                          color: isSelected ? '#FFFFFF' : 'var(--color-secondary, #0D2645)',
                        }}
                      >
                        {st.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                          color: isSelected ? 'rgba(255, 255, 255, 0.75)' : 'var(--color-text-muted, #5A6E7F)',
                          marginBottom: '1.5rem',
                        }}
                      >
                        {st.desc}
                      </p>

                      {/* Bullet Highlights */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {st.highlights.map((h) => (
                          <div
                            key={h}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.825rem',
                              color: isSelected ? '#E2E8F0' : '#334155',
                            }}
                          >
                            <CheckCircle2
                              size={14}
                              color={isSelected ? '#4ade80' : 'var(--color-primary, #1B6C31)'}
                              style={{ flexShrink: 0 }}
                            />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: isSelected ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                      <Link
                        to={st.link}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: isSelected ? '#4ade80' : 'var(--color-primary, #1B6C31)',
                          textDecoration: 'none',
                        }}
                      >
                        {st.linkText} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
