import React from 'react';
import { Link } from 'react-router-dom';
import { X, CheckSquare, ArrowRight } from 'lucide-react';
import '../../styles/comparison.css';

export default function OldWayVsNewWay() {
  return (
    <section className="comparison-section">
      <div className="container">
        <h2 className="comparison-title">Still Booking Tests the Old Way?</h2>

        <div className="comparison-grid">
          {/* The Old Way */}
          <div className="comparison-card comparison-card-old">
            <h3 className="comparison-card-title">The Old Way</h3>
            <ul className="comparison-list">
              <li className="comparison-item">
                <span className="comparison-icon-red">
                  <X size={18} strokeWidth={2.8} />
                </span>
                <span>Call Examiner 1 → Voicemail → Wait</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-icon-red">
                  <X size={18} strokeWidth={2.8} />
                </span>
                <span>Call Examiner 2 → &ldquo;I&apos;ll check my calendar and call back&rdquo;</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-icon-red">
                  <X size={18} strokeWidth={2.8} />
                </span>
                <span>Finally reach someone → &ldquo;I&apos;m booked for 6 weeks&rdquo;</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-icon-red">
                  <X size={18} strokeWidth={2.8} />
                </span>
                <span>Repeat process...</span>
              </li>
            </ul>
          </div>

          {/* The LicenceMate Way */}
          <div className="comparison-card comparison-card-new">
            <h3 className="comparison-card-title">The LicenceMate Way</h3>
            <ul className="comparison-list">
              <li className="comparison-item">
                <span className="comparison-icon-green">
                  <CheckSquare size={19} strokeWidth={2.2} />
                </span>
                <span>See all 10+ examiners&apos; real availability instantly</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-icon-green">
                  <CheckSquare size={19} strokeWidth={2.2} />
                </span>
                <span>Compare prices transparently</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-icon-green">
                  <CheckSquare size={19} strokeWidth={2.2} />
                </span>
                <span>Book &amp; pay online in 2 minutes</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-icon-green">
                  <CheckSquare size={19} strokeWidth={2.2} />
                </span>
                <span>Get immediate confirmation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="comparison-cta-wrap">
          <Link to="/book-test" className="comparison-btn">
            Find My VORT Slot Now
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

