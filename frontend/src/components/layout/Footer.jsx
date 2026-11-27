import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare, Clock, MessageCircle } from 'lucide-react';
import '../../styles/footer.css';

const shareUrl = encodeURIComponent('https://a1smartdriving.com.au/');

export default function Footer() {
  return (
    <>
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
              <div className="footer-bottom-legal-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms &amp; Conditions</Link>
                <Link to="/terms">Cancellation &amp; Lesson Credit Policy</Link>
                <span className="footer-imprint">Erry Imprints</span>
              </div>
            </div>

            <div className="footer-social-links">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer noopener"
                className="footer-social-icon footer-social-icon--facebook"
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
                className="footer-social-icon footer-social-icon--instagram"
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
              <a
                href={`https://wa.me/?text=${shareUrl}`}
                target="_blank"
                rel="noreferrer noopener"
                className="footer-social-icon footer-social-icon--whatsapp"
                aria-label="Share on WhatsApp"
                title="Share on WhatsApp"
              >
                <MessageCircle size={20} aria-hidden="true" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noreferrer noopener"
                className="footer-social-icon footer-social-icon--linkedin"
                aria-label="Share on LinkedIn"
                title="Share on LinkedIn"
              >
                <span className="footer-linkedin-mark" aria-hidden="true">in</span>
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
