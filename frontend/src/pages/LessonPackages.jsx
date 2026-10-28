import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import packageService from '../services/packageService';
import {
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Award,
  Car,
  Compass,
} from 'lucide-react';
import '../styles/packages-page.css';

export default function LessonPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [calcHours, setCalcHours] = useState(10);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await packageService.getPackages();
        setPackages(data);
      } catch (err) {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  // Filtered packages
  const filteredPackages = packages.filter((pkg) => {
    if (activeFilter === 'fast-track') return pkg.lesson_hours <= 5;
    if (activeFilter === 'popular') return pkg.is_featured;
    if (activeFilter === 'comprehensive') return pkg.lesson_hours >= 10;
    return true;
  });

  // Calculator figures
  const standardSingleRate = 140;
  const packageDiscountRate = 126;
  const payAsYouGoTotal = calcHours * standardSingleRate;
  const packageTotal = calcHours * packageDiscountRate;
  const totalSavings = payAsYouGoTotal - packageTotal;

  const faqs = [
    {
      q: 'Can I switch instructors if I am not satisfied?',
      a: 'Yes, 100%! We prioritize your comfort and confidence. You can switch to any other accredited instructor across Adelaide at any time directly through your dashboard with zero transfer fees.',
    },
    {
      q: 'How long do I have to use my package lessons?',
      a: 'All lesson packages are valid for 12 months from the date of purchase. You can book and space out your lessons whenever fits your work, study, and life schedule.',
    },
    {
      q: 'What is included in the free home pickup?',
      a: 'Your instructor will pick you up and drop you off directly from your home, high school, university campus, or workplace anywhere in metropolitan Adelaide and designated test suburbs.',
    },
    {
      q: 'How does the Pass Guarantee work?',
      a: 'Our higher tier packages (including the 10-Hour and 20-Hour packages) include mock VORT tests and intensive maneuver clinics. If you follow your instructor’s roadmap and happen to not pass on your first attempt, we cover your pre-test refresher lesson for free!',
    },
  ];

  return (
    <div className="packages-page">
      {/* 1. HERO SECTION */}
      <section className="pkg-hero">
        <div className="pkg-hero-bg" aria-hidden="true" />
        <div className="pkg-hero-container">
          <div className="pkg-pill-badge">
            <span className="pkg-pill-dot" />
            Save Up to $220 with Bundled Driving Hours
          </div>

          <h1 className="pkg-hero-title">
            Flexible Lesson Packages <span>Designed to Pass</span>
          </h1>

          <p className="pkg-hero-desc">
            Structured driving paths from complete beginner to official VORT test readiness. Every package includes free Adelaide door-to-door pickup, dual-control modern vehicles, and accredited 1-on-1 coaching.
          </p>

          <div className="pkg-value-ribbon">
            <div className="pkg-value-item">
              <DollarSign size={17} />
              <span>Discounted $126/hr Package Rate</span>
            </div>
            <div className="pkg-value-item">
              <MapPin size={17} />
              <span>Free Door-to-Door Pickup</span>
            </div>
            <div className="pkg-value-item">
              <Compass size={17} />
              <span>100% Flexible — Switch Instructors Anytime</span>
            </div>
            <div className="pkg-value-item">
              <ShieldCheck size={17} />
              <span>Pass Guarantee Options Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. $99 FIRST LESSON PROMO BANNER */}
      <div className="container" style={{ marginTop: '-24px', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #86efac',
            borderRadius: '18px',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 8px 30px rgba(22, 163, 74, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                backgroundColor: '#eaf7ef',
                color: '#15803d',
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                New to SmartDriving? Start with our $99 First Lesson Pack
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                Includes 60-min assessment + custom P-Plate Roadmap. 100% of your $99 is credited toward any 6+ package!
              </p>
            </div>
          </div>

          <Link
            to="/book-lesson"
            className="button button-accent"
            style={{ borderRadius: '9999px', padding: '10px 22px', fontSize: '13.5px', fontWeight: 800 }}
          >
            Claim $99 First Lesson <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* 3. PACKAGES GRID WITH GOAL FILTERS */}
      <section style={{ padding: 'clamp(40px, 5vw, 64px) 0' }}>
        <div className="container">
          <div className="pkg-filter-bar">
            <button
              type="button"
              className={`pkg-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Packages
            </button>
            <button
              type="button"
              className={`pkg-filter-btn ${activeFilter === 'popular' ? 'active' : ''}`}
              onClick={() => setActiveFilter('popular')}
            >
              Most Popular
            </button>
            <button
              type="button"
              className={`pkg-filter-btn ${activeFilter === 'fast-track' ? 'active' : ''}`}
              onClick={() => setActiveFilter('fast-track')}
            >
              Fast-Track (5 Hours)
            </button>
            <button
              type="button"
              className={`pkg-filter-btn ${activeFilter === 'comprehensive' ? 'active' : ''}`}
              onClick={() => setActiveFilter('comprehensive')}
            >
              Comprehensive (10-20 Hours)
            </button>
          </div>

          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="loading-spinner" />
            </div>
          ) : (
            <div className="pkg-grid-main">
              {filteredPackages.map((pkg) => {
                const hourlyRate = Math.round(Number(pkg.current_price) / Number(pkg.lesson_hours));
                return (
                  <div
                    key={pkg.id}
                    className={`pkg-card-premium ${pkg.is_featured ? 'featured' : ''}`}
                  >
                    {pkg.is_featured && (
                      <span className="pkg-badge-top">Top Recommendation</span>
                    )}

                    <h3 className="pkg-card-title">{pkg.name}</h3>
                    <span className="pkg-card-hours">
                      {pkg.lesson_hours} Hours Total ({pkg.lesson_count} Lessons)
                    </span>

                    <div className="pkg-card-pricing">
                      <span className="pkg-price-now">${pkg.current_price}</span>
                      {pkg.original_price && (
                        <span className="pkg-price-old">${pkg.original_price}</span>
                      )}
                    </div>
                    <span className="pkg-hourly-rate">
                      ~${hourlyRate}/Hour · Save ${Number(pkg.original_price || 0) - Number(pkg.current_price)}
                    </span>

                    <p className="pkg-card-desc">{pkg.short_description}</p>

                    <div className="pkg-inclusions-title">What's Included:</div>
                    <ul className="pkg-features-list">
                      {pkg.features?.map((f) => (
                        <li key={f.id} className="pkg-feature-item">
                          <CheckCircle size={15} />
                          <span>{f.feature_text}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={`/book-lesson?package_id=${pkg.id}`}
                      className={`pkg-book-btn ${pkg.is_featured ? 'accent' : 'primary'}`}
                    >
                      Book This Package
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. INTERACTIVE PACKAGE SAVINGS CALCULATOR */}
      <section className="pkg-calc-section">
        <div className="container">
          <div className="pkg-calc-card">
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span
                style={{
                  display: 'inline-block',
                  color: '#16a34a',
                  fontWeight: 800,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}
              >
                Instant Pricing Transparency
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 850, color: '#0f172a', margin: 0 }}>
                Calculate Your Package Savings
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '36px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 750 }}>
                  <span style={{ color: '#1e293b' }}>Select Hours You Plan to Drive:</span>
                  <span style={{ color: '#16a34a', fontSize: '18px', fontWeight: 850 }}>{calcHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={calcHours}
                  onChange={(e) => setCalcHours(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#16a34a', cursor: 'pointer' }}
                />
                <div className="flex-between" style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  <span>5 Hours (Starter)</span>
                  <span>15 Hours (Standard)</span>
                  <span>30 Hours (Full Prep)</span>
                </div>

                <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>
                    <span>Standard Pay-As-You-Go ($140/hr):</span>
                    <span style={{ textDecoration: 'line-through' }}>${payAsYouGoTotal} AUD</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, color: '#15803d' }}>
                    <span>Bundled Package Rate ($126/hr):</span>
                    <span>${packageTotal} AUD</span>
                  </div>
                </div>
              </div>

              {/* Total Savings Highlight */}
              <div
                style={{
                  backgroundColor: '#09182d',
                  color: '#ffffff',
                  borderRadius: '18px',
                  padding: '28px 24px',
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(9, 24, 45, 0.2)',
                }}
              >
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffb52e', fontWeight: 850 }}>
                  You Save Instantly
                </span>
                <div style={{ fontSize: 'clamp(36px, 4vw, 44px)', fontWeight: 900, color: '#ffb52e', margin: '6px 0' }}>
                  ${totalSavings}
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: '0 0 16px' }}>
                  Plus free door-to-door pickup & logbook verification included!
                </p>
                <Link
                  to="/book-lesson"
                  className="button button-accent button-full"
                  style={{ borderRadius: '10px', fontWeight: 800 }}
                >
                  Book Lessons Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INCLUSIONS COMPARISON MATRIX */}
      <section className="pkg-matrix-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 850, color: '#0f172a', margin: '0 0 8px' }}>
              Complete Package Comparison Matrix
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Compare exact features, inclusions, and pass support across our package plans.
            </p>
          </div>

          <div className="pkg-matrix-table-wrap">
            <table className="pkg-matrix-table">
              <thead>
                <tr>
                  <th>Inclusions & Features</th>
                  <th>Single Lesson</th>
                  <th>5-Hour Pack</th>
                  <th>10-Hour Pack</th>
                  <th>20-Hour Pack</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Hourly Rate Equivalent</strong></td>
                  <td>$140/hr</td>
                  <td>~$80/hr</td>
                  <td>~$76/hr</td>
                  <td>~$74/hr</td>
                </tr>
                <tr>
                  <td><strong>Free Door-to-Door Pickup</strong></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                </tr>
                <tr>
                  <td><strong>SA Logbook Hours Sign-Off</strong></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                </tr>
                <tr>
                  <td><strong>All 5 VORT Slow-Speed Maneuvers</strong></td>
                  <td>Optional</td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                </tr>
                <tr>
                  <td><strong>Instructor-Marked Mock VORT Test</strong></td>
                  <td>—</td>
                  <td>—</td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /> (x2 Tests)</td>
                </tr>
                <tr>
                  <td><strong>Official VORT Test Car Hire</strong></td>
                  <td>—</td>
                  <td>Optional Upgrade</td>
                  <td>Optional Upgrade</td>
                  <td><CheckCircle size={17} color="#16a34a" /> Included</td>
                </tr>
                <tr>
                  <td><strong>Free Instructor Switching Anytime</strong></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                  <td><CheckCircle size={17} color="#16a34a" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. FAQS ACCORDION */}
      <section style={{ padding: 'clamp(52px, 6vw, 84px) 0', backgroundColor: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 850, color: '#16a34a', margin: '0 0 8px' }}>
              Package Questions Answered
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Everything you need to know about purchasing, booking, and managing your package hours.
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

      {/* 7. BOTTOM CTA */}
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
            Ready to Save on Your Driving Lessons?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', lineHeight: 1.65, margin: '0 0 28px' }}>
            Pick a package today, schedule your lessons online whenever convenient, and learn with Adelaide’s top-rated accredited instructors.
          </p>
          <Link
            to="/book-lesson"
            className="button button-accent button-lg"
            style={{ borderRadius: '9999px', padding: '14px 34px', fontSize: '15.5px', fontWeight: 800 }}
          >
            Explore Lesson Packages & Book <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
