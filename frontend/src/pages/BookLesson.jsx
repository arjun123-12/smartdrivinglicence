import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BookingWizard from '../components/booking/BookingWizard';
import {
  Car,
  MapPin,
  CheckCircle,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Award,
  FileText,
  DollarSign,
  Compass,
} from 'lucide-react';
import '../styles/first-lesson.css';

export default function BookLesson() {
  // Estimator State
  const [logbookHours, setLogbookHours] = useState(15);
  const [transmission, setTransmission] = useState('auto');
  const [confidence, setConfidence] = useState('beginner');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  // Calculation for the P-Plate Roadmap
  const calculateRecommendation = () => {
    let baseLessons = 10;
    if (logbookHours < 10) baseLessons = 12;
    else if (logbookHours < 30) baseLessons = 10;
    else if (logbookHours < 55) baseLessons = 7;
    else baseLessons = 4;

    if (confidence === 'nervous') baseLessons += 2;
    if (confidence === 'confident') baseLessons = Math.max(3, baseLessons - 2);

    return {
      hours: baseLessons,
      stage:
        logbookHours < 25
          ? 'Foundation & Vehicle Control'
          : logbookHours < 60
          ? 'Traffic Strategy & 5 Maneuvers'
          : 'VORT Mock Test Polish',
    };
  };

  const rec = calculateRecommendation();

  const faqs = [
    {
      q: 'How does the $99 package credit work?',
      a: 'When you complete your $99 first lesson, you can test out our instructor with zero pressure. If you decide to continue your journey by purchasing any lesson package of 6 or more hours, your entire $99 is subtracted from the package price—making your first lesson completely free!',
    },
    {
      q: 'Can you pick me up from my school, university, or workplace?',
      a: 'Yes! Free door-to-door pickup and drop-off are included anywhere across metropolitan Adelaide and outer test suburbs. Just enter your pickup address when confirming your booking.',
    },
    {
      q: 'What if I have never driven a car before?',
      a: 'That is completely fine! Our government-accredited driving instructors are exceptionally patient, kind, and experienced with first-time drivers. All vehicles feature dual-control pedals so your instructor can assist at any time.',
    },
    {
      q: 'What do I need to bring to my first driving lesson?',
      a: 'You only need to bring your valid South Australian Learner’s Permit (or interim paper permit) and your official South Australian Driving Companion logbook (or app logbook login) so your instructor can sign off your completed hours.',
    },
    {
      q: 'Can I choose between an automatic and a manual car?',
      a: 'Yes! We have modern 5-star ANCAP dual-controlled vehicles in both automatic and manual transmissions available across Adelaide.',
    },
  ];

  return (
    <div className="first-lesson-page">
      {/* 1. HERO SECTION */}
      <section className="fl-hero">
        <div className="fl-hero-bg" aria-hidden="true" />
        <div className="fl-hero-container">
          <div className="fl-pill-badge">
            <span className="fl-pill-dot" />
            Special Introductory Offer — Save Over 25%
          </div>

          <h1 className="fl-hero-title">
            Your First Driving Lesson — <span>Just $99</span>
          </h1>

          <p className="fl-hero-desc">
            Get behind the wheel with an accredited Adelaide instructor. Includes a full 60-minute driving lesson, objective skills assessment, and your custom P-Plate Roadmap. Plus, 100% of your $99 is credited toward any package of 6+ lessons!
          </p>

          <div className="fl-value-ribbon">
            <div className="fl-value-item">
              <MapPin size={17} />
              <span>Free Door-to-Door Pickup</span>
            </div>
            <div className="fl-value-item">
              <Award size={17} />
              <span>Full Skills Assessment</span>
            </div>
            <div className="fl-value-item">
              <Compass size={17} />
              <span>Personalised P-Plate Roadmap</span>
            </div>
            <div className="fl-value-item">
              <DollarSign size={17} />
              <span>100% Credited to Packages</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE BOOKING ENGINE WIZARD */}
      <section className="fl-booking-section" id="booking-engine">
        <div className="container">
          <div className="fl-booking-card">
            <div className="fl-booking-header">
              <div className="fl-booking-title-group">
                <h2>Select Your Location & Available Time Slot</h2>
                <p>Choose your Adelaide suburb to view real-time available appointments with accredited instructors.</p>
              </div>

              <div className="fl-price-badge">
                <span className="fl-price-amount">$99</span>
                <span className="fl-price-sub">Introductory Special</span>
              </div>
            </div>

            <BookingWizard defaultServiceSlug="first-lesson-assessment" forcedIsTest={false} />
          </div>
        </div>
      </section>

      {/* 3. WHAT'S INCLUDED IN YOUR $99 FIRST LESSON */}
      <section className="fl-included-section">
        <div className="container">
          <h2 className="fl-section-title">What’s Included in Your $99 First Lesson</h2>
          <p className="fl-section-desc">
            Everything you need to start your driving journey with confidence, clarity, and zero stress.
          </p>

          <div className="fl-features-grid">
            {/* Card 1 */}
            <div className="fl-feature-card">
              <div className="fl-feature-icon-wrap">
                <Clock size={24} />
              </div>
              <h3 className="fl-feature-title">60-Minute 1-on-1 Lesson</h3>
              <p className="fl-feature-desc">
                Settle your nerves in a modern 5-star ANCAP dual-controlled car with an accredited, patient instructor. Learn at your own pace without pressure.
              </p>
            </div>

            {/* Card 2 */}
            <div className="fl-feature-card">
              <div className="fl-feature-icon-wrap">
                <FileText size={24} />
              </div>
              <h3 className="fl-feature-title">Full Skills Assessment</h3>
              <p className="fl-feature-desc">
                Your instructor evaluates vehicle control, steering, speed management, mirrors, and safety awareness to highlight your current strengths.
              </p>
            </div>

            {/* Card 3 */}
            <div className="fl-feature-card">
              <div className="fl-feature-icon-wrap">
                <Compass size={24} />
              </div>
              <h3 className="fl-feature-title">Custom P-Plate Roadmap</h3>
              <p className="fl-feature-desc">
                Receive an honest, tailored step-by-step plan showing exactly how many practice hours and lessons you need to achieve a 90%+ VORT pass score.
              </p>
            </div>

            {/* Card 4 */}
            <div className="fl-feature-card">
              <div className="fl-feature-icon-wrap">
                <DollarSign size={24} />
              </div>
              <h3 className="fl-feature-title">100% Credit Guarantee</h3>
              <p className="fl-feature-desc">
                If you continue learning with us on any package of 6 or more hours, your entire $99 fee is deducted from the total—making your first lesson free!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE P-PLATE ROADMAP ESTIMATOR */}
      <section className="fl-estimator-section">
        <div className="container">
          <h2 className="fl-section-title">Interactive P-Plate Roadmap Estimator</h2>
          <p className="fl-section-desc">
            Estimate your path to your P-plates based on your current logbook hours and driving background.
          </p>

          <div className="fl-estimator-card">
            <div className="fl-estimator-grid">
              {/* Controls */}
              <div>
                {/* Logbook Slider */}
                <div className="fl-slider-group">
                  <div className="fl-slider-header">
                    <span>Current Supervised Logbook Hours</span>
                    <span className="fl-slider-val">{logbookHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="75"
                    step="5"
                    value={logbookHours}
                    onChange={(e) => setLogbookHours(Number(e.target.value))}
                    className="fl-slider-input"
                  />
                  <div className="flex-between" style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                    <span>0 hrs (New Learner)</span>
                    <span>35 hrs (Halfway)</span>
                    <span>75+ hrs (SA VORT Requirement)</span>
                  </div>
                </div>

                {/* Transmission Preference */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 750, color: '#1e293b', marginBottom: '8px' }}>
                    Vehicle Transmission
                  </label>
                  <div className="fl-radio-group">
                    <button
                      type="button"
                      className={`fl-radio-btn ${transmission === 'auto' ? 'active' : ''}`}
                      onClick={() => setTransmission('auto')}
                    >
                      <Car size={16} /> Automatic Car
                    </button>
                    <button
                      type="button"
                      className={`fl-radio-btn ${transmission === 'manual' ? 'active' : ''}`}
                      onClick={() => setTransmission('manual')}
                    >
                      <Car size={16} /> Manual Car
                    </button>
                  </div>
                </div>

                {/* Confidence Level */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 750, color: '#1e293b', marginBottom: '8px' }}>
                    Current Confidence Behind the Wheel
                  </label>
                  <div className="fl-radio-group">
                    <button
                      type="button"
                      className={`fl-radio-btn ${confidence === 'nervous' ? 'active' : ''}`}
                      onClick={() => setConfidence('nervous')}
                    >
                      Nervous / Beginner
                    </button>
                    <button
                      type="button"
                      className={`fl-radio-btn ${confidence === 'moderate' ? 'active' : ''}`}
                      onClick={() => setConfidence('moderate')}
                    >
                      Moderate
                    </button>
                    <button
                      type="button"
                      className={`fl-radio-btn ${confidence === 'confident' ? 'active' : ''}`}
                      onClick={() => setConfidence('confident')}
                    >
                      Confident
                    </button>
                  </div>
                </div>
              </div>

              {/* Result Preview Box */}
              <div className="fl-estimator-result">
                <span className="fl-result-badge">Personalised Recommendation</span>
                <div className="fl-result-hours">
                  {rec.hours} <span>Lessons</span>
                </div>
                <div className="fl-result-label">Recommended for Test Readiness</div>

                <ul className="fl-result-checklist">
                  <li>
                    <CheckCircle size={15} color="#22c55e" />
                    <span>Focus: <strong>{rec.stage}</strong></span>
                  </li>
                  <li>
                    <CheckCircle size={15} color="#22c55e" />
                    <span>All 5 VORT Slow-Speed Maneuvers</span>
                  </li>
                  <li>
                    <CheckCircle size={15} color="#22c55e" />
                    <span>Official SA DIT Test Route Practice</span>
                  </li>
                </ul>

                <a href="#booking-engine" className="fl-result-btn">
                  Start with $99 First Lesson
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3-STEP PROCESS */}
      <section className="fl-steps-section">
        <div className="container">
          <h2 className="fl-section-title">How Your First Lesson Works</h2>
          <p className="fl-section-desc">
            Three simple steps to getting on the road and working towards your provisional licence.
          </p>

          <div className="fl-steps-grid">
            <div className="fl-step-card">
              <div className="fl-step-number">1</div>
              <h3 className="fl-step-title">Book Online in 2 Minutes</h3>
              <p className="fl-step-desc">
                Select your Adelaide suburb, choose automatic or manual, and pick a convenient day and time from live instructor availability.
              </p>
            </div>

            <div className="fl-step-card">
              <div className="fl-step-number">2</div>
              <h3 className="fl-step-title">We Meet at Your Doorstep</h3>
              <p className="fl-step-desc">
                Your accredited instructor picks you up directly from your home, school, university, or workplace with a dual-controlled vehicle.
              </p>
            </div>

            <div className="fl-step-card">
              <div className="fl-step-number">3</div>
              <h3 className="fl-step-title">Drive & Unlock Your Roadmap</h3>
              <p className="fl-step-desc">
                Enjoy your 60-minute lesson, get your logbook signed, and receive your personalized P-Plate Roadmap outlining your path to passing.
              </p>
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="fl-guarantee-wrap">
            <div className="fl-guarantee-icon">
              <ShieldCheck size={32} />
            </div>
            <div className="fl-guarantee-text">
              <h4>100% Peace of Mind Guarantee</h4>
              <p>
                All our driving instructors hold current South Australian Motor Driving Instructor licenses, Department of Human Services (DHS) Working with Children clearances, and dual-controlled modern vehicles with comprehensive insurance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FIRST LESSON FAQS */}
      <section className="fl-included-section" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <h2 className="fl-section-title">First Lesson FAQs</h2>
          <p className="fl-section-desc">
            Common questions from South Australian learners starting their first lesson.
          </p>

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
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
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

      {/* 7. BOTTOM CTA BANNER */}
      <section className="fl-cta-banner">
        <div className="fl-cta-container">
          <h2 className="fl-cta-title">Ready to Start Your Driving Journey?</h2>
          <p className="fl-cta-desc">
            Book your $99 first lesson today. Get your logbook signed, assess your skills, and unlock your custom P-Plate Roadmap with an accredited Adelaide instructor.
          </p>
          <a
            href="#booking-engine"
            className="button button-accent button-lg"
            style={{ borderRadius: '9999px', padding: '14px 34px', fontSize: '15.5px', fontWeight: 800 }}
          >
            Book Your First Lesson for $99 Now <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
