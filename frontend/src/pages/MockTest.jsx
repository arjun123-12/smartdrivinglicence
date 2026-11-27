import React, { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import BookingWizard from '../components/booking/BookingWizard';
import TiltCard from '../components/effects/TiltCard';
import ScrollReveal from '../components/effects/ScrollReveal';
import MagneticButton from '../components/effects/MagneticButton';
import SectionHeading from '../components/typography/SectionHeading';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  Award,
  AlertTriangle,
  FileCheck,
  ChevronDown,
  ArrowRight,
  MapPin,
  Car,
  Compass,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import '../styles/mock-test.css';

const RoadScenario3D = lazy(() => import('../components/3d/RoadScenario3D'));

export default function MockTest() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  const stages = [
    {
      badge: 'Stage 1',
      title: 'Pre-Drive & Vehicle Check',
      desc: 'Simulate the exact pre-drive vehicle condition and knowledge questions examiners inspect before starting the car.',
      items: [
        'Exterior roadworthy & tyre safety check',
        'Mirror adjustment & blind spot setup',
        'Horn, indicators, and brake light operation',
        'Cabin controls, demisters, and seatbelt check',
      ],
    },
    {
      badge: 'Stage 2',
      title: 'The 5 Slow-Speed Maneuvers',
      desc: 'Marked strictly against South Australian DIT criteria. Every maneuver must be completed with zero immediate fail items.',
      items: [
        'Reverse Parallel Parking (2-car method)',
        '45° and 90° Angle Parking',
        '3-Point Turn in narrow residential streets',
        'U-Turn with full 360° observation checks',
        'Hill Start without roll-back (automatic)',
      ],
    },
    {
      badge: 'Stage 3',
      title: 'General Drive Assessment',
      desc: 'Navigate authentic Adelaide test hub routes (Thebarton, Port Adelaide, Marion) evaluating real-world road law compliance.',
      items: [
        'Speed compliance & school zone awareness',
        'Mandatory head checks on lane changes & turns',
        'Roundabout positioning, signalling & priority',
        'Detailed score debrief (90%+ pass benchmark)',
      ],
    },
  ];

  const faqs = [
    {
      q: 'Why can’t a government examiner conduct my mock test?',
      a: 'Under South Australian Department for Infrastructure and Transport (DIT) regulations, authorised examiners cannot conduct practice assessments for learners they may formally test in the future to preserve absolute regulatory independence. Instead, our senior accredited driving instructors use the exact official DIT score sheet to deliver a completely authentic simulation.',
    },
    {
      q: 'What is the passing score on a VORT mock test?',
      a: 'To achieve a pass, you must score at least 90% across the general drive assessment, complete all 5 slow-speed maneuvers without exceeding the allowed corrections, and commit zero Immediate Fail items (such as speeding, rolling through a stop sign, or failing to give way).',
    },
    {
      q: 'What happens if I make mistakes during the mock test?',
      a: 'That is the entire purpose of a mock test! Making a mistake during a simulation gives you a clear, actionable punch list of areas to refine with your instructor before your real test date—saving you from a costly $240+ re-test fee and weeks of waiting.',
    },
    {
      q: 'Can I do the mock test in my own car or the instructor’s car?',
      a: 'You can choose either! If you plan to take your real VORT in your own vehicle, we can conduct the mock test in it (provided it is roadworthy and registered). Alternatively, you can use our instructor’s dual-controlled car.',
    },
  ];

  return (
    <div className="scene-perspective-container">
      {/* 1. HERO SECTION */}
      <section className="mock-hero premium-page-hero premium-page-hero--road">
        <div className="mock-hero-bg" aria-hidden="true" />
        <div className="mock-hero-container">
          <ScrollReveal direction="down" distance={25}>
            <div className="mock-pill-badge">
              <span className="mock-pill-dot" />
              95%+ First-Time Pass Rate Guarantee Pathway
            </div>

            <h1 className="mock-hero-title">
              VORT Mock Driving Test — <span>Adelaide</span>
            </h1>

            <p className="mock-hero-desc">
              Experience the pressure, routes, and scoring of an official South Australian Vehicle On Road Test before the real thing. Certified instructors score you on the official DIT marking sheet.
            </p>

            <div className="mock-value-ribbon">
              <div className="mock-value-item">
                <Clock size={16} />
                <span>Full 90-Minute Simulation</span>
              </div>
              <div className="mock-value-item">
                <FileCheck size={16} />
                <span>Official DIT Score Sheet</span>
              </div>
              <div className="mock-value-item">
                <Award size={16} />
                <span>90%+ Pass Benchmark</span>
              </div>
              <div className="mock-value-item">
                <MapPin size={16} />
                <span>Thebarton, Port Adelaide & Marion Hubs</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3D MANOEUVRE SIMULATION */}
      <section style={{ padding: '3rem 1rem' }}>
        <div className="container" style={{ maxWidth: '960px', margin: '0 auto' }}>
          <ScrollReveal direction="up" distance={30}>
            <SectionHeading
              eyebrow="3D Manoeuvre Inspection"
              eyebrowIcon={Compass}
              liveDot={true}
              title="Practice Test Scenarios Before You Sit The VORT"
              highlightWord="VORT"
              subtitle="Simulate kerb stops, 3-point turns, and parallel parking in interactive 3D:"
              theme="dark"
              size="md"
            />
            <Suspense fallback={<div className="loading-spinner" style={{ minHeight: '380px' }} />}>
              <RoadScenario3D />
            </Suspense>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. THE 3-STAGE BREAKDOWN */}
      <section className="mock-stages-section">
        <div className="container">
          <SectionHeading
            eyebrow="Official Scoring Criteria"
            eyebrowIcon={Sparkles}
            liveDot={true}
            title="What Your VORT Mock Test Covers"
            highlightWord="VORT Mock Test"
            subtitle="Your accredited instructor replicates the silent, formal conditions of an official government examination so nothing surprises you on the day."
            theme="dark"
            size="md"
          />

          <div className="mock-stages-grid">
            {stages.map((stage, idx) => (
              <ScrollReveal key={idx} direction="up" distance={30} delay={idx * 0.12}>
                <TiltCard maxTilt={8} scale={1.02} style={{ height: '100%' }}>
                  <div className="mock-stage-card" style={{ height: '100%', margin: 0 }}>
                    <span className="mock-stage-badge">{stage.badge}</span>
                    <h3 className="mock-stage-title">{stage.title}</h3>
                    <p className="mock-stage-desc">{stage.desc}</p>
                    <ul className="mock-stage-checklist">
                      {stage.items.map((item, i) => (
                        <li key={i}>
                          <CheckCircle size={15} color="#22c55e" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BOOKING ENGINE WIZARD */}
      <section style={{ padding: 'clamp(40px, 5vw, 64px) 0' }}>
        <div className="mock-booking-card-wrap">
          <div className="mock-booking-card glass-panel-3d" style={{ background: '#ffffff' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '28px',
                paddingBottom: '20px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 850, color: '#0f172a', margin: '0 0 4px' }}>
                  Book Your VORT Mock Test & Assessment
                </h2>
                <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>
                  Select your suburb or preferred test centre hub (Thebarton, Port Adelaide, Marion) to view available slots.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#eaf7ef',
                  border: '1.5px solid #86efac',
                  borderRadius: '14px',
                  padding: '8px 16px',
                  color: '#15803d',
                  textAlign: 'right',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 900 }}>$190 AUD</div>
                <div style={{ fontSize: '11px', fontWeight: 700 }}>90-Min Full Mock Assessment</div>
              </div>
            </div>

            <BookingWizard defaultServiceSlug="vort-mock-test" forcedIsTest={false} />
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION */}
      <section style={{ padding: '3rem 1rem 5rem' }}>
        <div className="container" style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#ffffff', fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>
            Mock Test Common Questions
          </h2>
          <div className="faq-3d-list">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className={`accordion-3d-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="accordion-3d-trigger"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={isOpen}
                  >
                    <span>{f.q}</span>
                    <div className="accordion-3d-icon">
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="accordion-3d-content">
                      <p style={{ margin: 0 }}>{f.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
