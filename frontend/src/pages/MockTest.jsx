import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BookingWizard from '../components/booking/BookingWizard';
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
} from 'lucide-react';
import '../styles/mock-test.css';

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
        'Hill Start without roll-back (manual & auto)',
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
    <div className="mock-test-page">
      {/* 1. HERO SECTION */}
      <section className="mock-hero">
        <div className="mock-hero-bg" aria-hidden="true" />
        <div className="mock-hero-container">
          <div className="mock-pill-badge">
            <ShieldCheck size={15} />
            Official South Australian DIT Scoring Standards
          </div>

          <h1 className="mock-hero-title">
            Official VORT <span>Mock Driving Test</span> in Adelaide
          </h1>

          <p className="mock-hero-desc">
            A realistic 90-minute trial assessment marked on the authentic South Australian Vehicle On Road Test score sheet. Discover exactly where you stand, eliminate costly $240+ re-test fees, and pass on your first attempt.
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
        </div>
      </section>

      {/* 2. THE 3-STAGE BREAKDOWN */}
      <section className="mock-stages-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span
              style={{
                color: '#16a34a',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Simulate Real Exam Conditions
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 850, color: '#0f172a', margin: '0 0 12px' }}>
              What Your VORT Mock Test Covers
            </h2>
            <p style={{ color: '#64748b', fontSize: '14.5px', maxWidth: '640px', margin: '0 auto', lineHeight: 1.65 }}>
              Your accredited instructor replicates the silent, formal conditions of an official government examination so nothing surprises you on the day.
            </p>
          </div>

          <div className="mock-stages-grid">
            {stages.map((stage, idx) => (
              <div key={idx} className="mock-stage-card">
                <span className="mock-stage-badge">{stage.badge}</span>
                <h3 className="mock-stage-title">{stage.title}</h3>
                <p className="mock-stage-desc">{stage.desc}</p>
                <ul className="mock-stage-checklist">
                  {stage.items.map((item, i) => (
                    <li key={i}>
                      <CheckCircle size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BOOKING ENGINE WIZARD */}
      <section style={{ padding: 'clamp(40px, 5vw, 64px) 0' }}>
        <div className="mock-booking-card-wrap">
          <div className="mock-booking-card">
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
                <span style={{ fontSize: '24px', fontWeight: 900, lineHeight: 1, display: 'block' }}>$160</span>
                <span style={{ fontSize: '11px', fontWeight: 750, textTransform: 'uppercase' }}>90-Min Full Mock Test</span>
              </div>
            </div>

            <BookingWizard defaultServiceSlug="driving-lesson-120" forcedIsTest={false} />
          </div>
        </div>
      </section>

      {/* 4. WHY MOCK TEST IS YOUR BEST INVESTMENT */}
      <section className="mock-why-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 850, color: '#0f172a', margin: '0 0 10px' }}>
              Why a Mock Test is Your Best Investment
            </h2>
            <p style={{ color: '#64748b', fontSize: '14.5px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.65 }}>
              Over 88% of learners who complete a formal mock test pass their official VORT on their first attempt.
            </p>
          </div>

          <div className="mock-why-grid">
            <div className="mock-why-card">
              <div className="mock-why-icon">
                <DollarSign size={24} />
              </div>
              <h4>Avoid Costly $240+ Retests</h4>
              <p>
                Failing the real VORT means re-paying the full government examiner fee and car hire costs. A mock test ensures you only sit the test when you are truly guaranteed to succeed.
              </p>
            </div>

            <div className="mock-why-card">
              <div className="mock-why-icon">
                <AlertTriangle size={24} />
              </div>
              <h4>Catch Immediate Fail Items</h4>
              <p>
                A rolling stop at a STOP sign, creeping over 50 km/h, or omitting a single blind-spot head check results in an automatic exam termination. Discover these habits before test day.
              </p>
            </div>

            <div className="mock-why-card">
              <div className="mock-why-icon">
                <Compass size={24} />
              </div>
              <h4>Master Adelaide Test Hub Routes</h4>
              <p>
                Practice in the actual designated testing zones surrounding Thebarton, Port Adelaide, and Marion customer service centres so you know every turn and tricky intersection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQS ACCORDION */}
      <section style={{ padding: 'clamp(52px, 6vw, 84px) 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 850, color: '#16a34a', margin: '0 0 8px' }}>
              Mock Test FAQs
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Common questions about preparing for and sitting your trial assessment.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 22px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      font: 'inherit',
                      color: '#1e293b',
                      fontSize: '15px',
                      fontWeight: 750,
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      color="#64748b"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 22px 18px', color: '#475569', fontSize: '13.5px', lineHeight: 1.65 }}>
                      <p style={{ margin: 0 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section
        style={{
          background: 'linear-gradient(135deg, #09182d 0%, #0d2847 100%)',
          color: '#ffffff',
          padding: 'clamp(52px, 6vw, 76px) 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 850, margin: '0 0 16px' }}>
            Are You Ready to Pass Your VORT?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', lineHeight: 1.65, margin: '0 0 28px' }}>
            Take our authentic 90-minute trial test, get your official score sheet breakdown, and head into your South Australian test day with absolute confidence.
          </p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="button button-accent button-lg"
            style={{ borderRadius: '9999px', padding: '14px 34px', fontSize: '15.5px', fontWeight: 800 }}
          >
            Book Your VORT Mock Test Now <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}

