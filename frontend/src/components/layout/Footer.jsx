import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import '../../styles/footer.css';

export default function Footer() {
  return (
    <>
      <footer className="site-footer-premium">
        <div className="footer-premium-container">
          <div className="footer-premium-grid">
            {/* 1. Brand Column */}
            <div className="footer-brand-wrap">
              <Link to="/" className="footer-logo-row">
                <span className="footer-logo-badge">L</span>
                <span className="footer-logo-text">LicenceMate</span>
              </Link>

              <p className="footer-tagline">
                Your trusted partner in learning to drive. Book your VORT Test with LicenceMate.
              </p>

              <ul className="footer-contact-list">
                <li className="footer-contact-item">
                  <Mail size={16} />
                  <a href="mailto:support@licencemate.com.au">support@licencemate.com.au</a>
                </li>
                <li className="footer-contact-item">
                  <Phone size={16} />
                  <a href="tel:1300138626">1300 138 626</a>
                </li>
                <li className="footer-contact-item">
                  <MapPin size={16} />
                  <span>101/37-39 Walsh St, Thebarton SA 5031</span>
                </li>
                <li className="footer-contact-item">
                  <MapPin size={16} />
                  <div>
                    <span className="footer-contact-address-title">Sydney · Technical office</span>
                    <span className="footer-contact-address-sub">55 Pyrmont Bridge Road, Pyrmont NSW 2009</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 2. For Learners */}
            <div>
              <h4 className="footer-col-title">FOR LEARNERS</h4>
              <ul className="footer-col-links">
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><Link to="/faqs">Lesson FAQs</Link></li>
                <li><Link to="/faqs">VORT Test FAQs</Link></li>
                <li><Link to="/terms">Learner Terms and Conditions</Link></li>
              </ul>
            </div>

            {/* 3. For Instructors */}
            <div>
              <h4 className="footer-col-title">FOR INSTRUCTORS</h4>
              <ul className="footer-col-links">
                <li><Link to="/instructors">Work with LicenceMate</Link></li>
                <li><Link to="/instructor-terms">Instructor Terms and Conditions</Link></li>
              </ul>
            </div>

            {/* 4. Company */}
            <div>
              <h4 className="footer-col-title">COMPANY</h4>
              <ul className="footer-col-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/locations">Locations</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/contact">Support</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <div className="footer-bottom-left">
              <span className="footer-copyright">
                &copy; {new Date().getFullYear()} LicenceMate. All rights reserved.
              </span>
              <span className="footer-legal-subline">
                LicenceMate Adelaide Driving School · LicenceMate Pty Ltd · ABN 41 690 289 715
              </span>
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

      {/* Floating Chat Bubble Widget (bottom left as shown in reference) */}
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
