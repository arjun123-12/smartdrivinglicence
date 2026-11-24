import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare, ArrowRight, ShieldCheck, Award, Car, Clock } from 'lucide-react';
import '../../styles/footer.css';

export default function Footer() {
  return (
    <>
      {/* Pre-Footer High-Impact Automotive CTA */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0A1E35 0%, #07172B 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '4rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(27, 108, 49, 0.3)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#4ade80',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1.25rem',
            }}
          >
            <Award size={15} /> South Australia Official Test Pathway
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '1rem',
            }}
          >
            Ready to Pass Your Driving Test First Time?
          </h2>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '650px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Book your driving lesson or official VORT driving test with Adelaide’s top-rated accredited examiners. Real-time availability with instant appointment confirmation.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              to="/book-test"
              className="button button-accent button-lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '14px 28px',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.35)',
              }}
            >
              Book a VORT Test <ArrowRight size={18} />
            </Link>

            <Link
              to="/book-lesson"
              className="button button-outline button-lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '14px 28px',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: '12px',
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Car size={18} /> Book Driving Lesson
            </Link>

            <a
              href="tel:0430580111"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#4ade80',
                fontSize: '0.95rem',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
              }}
            >
              <Phone size={16} /> Call 0430 580 111
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer-premium">
        <div className="footer-premium-container">
          <div className="footer-premium-grid">
            {/* 1. Brand Column */}
            <div className="footer-brand-wrap">
              <Link to="/" className="footer-logo-row">
                <img
                  src="/logo.png"
                  alt="A1 Smart Driving"
                  className="footer-logo-img"
                />
              </Link>

              <p className="footer-tagline">
                Your trusted partner in learning to drive. Book accredited driving lessons &amp; official VORT Test with A1 Smart Driving across Greater Adelaide.
              </p>

              <ul className="footer-contact-list">
                <li className="footer-contact-item">
                  <Mail size={16} />
                  <a href="mailto:enquiries@a1smartdriving.com.au">enquiries@a1smartdriving.com.au</a>
                </li>
                <li className="footer-contact-item">
                  <Phone size={16} />
                  <a href="tel:0430580111">0430 580 111</a>
                </li>
                <li className="footer-contact-item">
                  <MapPin size={16} />
                  <span>Adelaide, South Australia</span>
                </li>
                <li className="footer-contact-item">
                  <Clock size={16} />
                  <span>Mon – Sun: 7:00 AM – 7:00 PM</span>
                </li>
              </ul>
            </div>

            {/* 2. For Learners */}
            <div>
              <h4 className="footer-col-title">FOR LEARNERS</h4>
              <ul className="footer-col-links">
                <li><Link to="/book-test">Book VORT Test</Link></li>
                <li><Link to="/book-lesson">Driving Lessons</Link></li>
                <li><Link to="/lesson-packages">Discount Packages</Link></li>
                <li><Link to="/mock-test">Pre-VORT Mock Test</Link></li>
                <li><Link to="/first-lesson">First Lesson Guide</Link></li>
                <li><Link to="/how-it-works">Licence Roadmap</Link></li>
                <li><Link to="/faqs">Frequently Asked Questions</Link></li>
              </ul>
            </div>

            {/* 3. Adelaide Test Hubs */}
            <div>
              <h4 className="footer-col-title">TEST CENTRES</h4>
              <ul className="footer-col-links">
                <li><Link to="/locations">Thebarton DIT Hub</Link></li>
                <li><Link to="/locations">Marion Test Centre</Link></li>
                <li><Link to="/locations">Port Adelaide DIT Hub</Link></li>
                <li><Link to="/locations">Regency Park Test Centre</Link></li>
                <li><Link to="/locations">Gawler Service SA Hub</Link></li>
                <li><Link to="/locations">Modbury / Tea Tree Gully</Link></li>
                <li><Link to="/locations">Noarlunga Centre Hub</Link></li>
              </ul>
            </div>

            {/* 4. Instructors & Company */}
            <div>
              <h4 className="footer-col-title">INSTRUCTORS &amp; COMPANY</h4>
              <ul className="footer-col-links">
                <li><Link to="/instructors">Instructor Directory</Link></li>
                <li><Link to="/instructor/signup">Apply as Instructor</Link></li>
                <li><Link to="/instructor/login">Instructor SMS Portal</Link></li>
                <li><Link to="/about">About A1 Smart Driving</Link></li>
                <li><Link to="/contact">Contact Support</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms &amp; Conditions</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <div className="footer-bottom-left">
              <span className="footer-copyright">
                &copy; {new Date().getFullYear()} A1 Smart Driving. All rights reserved.
              </span>
              <span className="footer-legal-subline">
                MB &amp; HB GROUP PTY LTD trading as A1 Smart Driving · ABN 92 662 509 720 · Adelaide, South Australia
              </span>
              <div className="footer-bottom-legal-links">
                <Link to="/privacy">Privacy Policy</Link>
                <span className="sep">·</span>
                <Link to="/terms">Terms &amp; Conditions</Link>
                <span className="sep">·</span>
                <Link to="/terms">Cancellation &amp; Lesson Credit Policy</Link>
              </div>
            </div>

            <div className="footer-social-links">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer noopener"
                className="footer-social-icon"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                className="footer-social-icon"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Bubble Widget */}
      <Link
        to="/contact"
        className="footer-floating-chat"
        aria-label="Contact and Support"
        title="Chat & Support"
      >
        <MessageSquare size={22} />
      </Link>
    </>
  );
}
