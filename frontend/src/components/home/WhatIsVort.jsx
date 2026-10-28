import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import '../../styles/vort-and-reviews.css';

export default function WhatIsVort() {
  return (
    <section className="vort-intro-section">
      <div className="vort-intro-container">
        <div className="vort-intro-grid">
          {/* Left Layered Illustration */}
          <div className="vort-illustration-wrap" aria-hidden="true">
            {/* L Plate */}
            <div className="vort-plate-l">L</div>

            {/* Checklist Clipboard */}
            <div className="vort-clipboard">
              <div className="vort-clipboard-clip" />
              <div className="vort-clipboard-paper">
                <div className="vort-clipboard-item">
                  <div className="vort-check-box">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <div className="vort-check-line" />
                </div>
                <div className="vort-clipboard-item">
                  <div className="vort-check-box">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <div className="vort-check-line" />
                </div>
                <div className="vort-clipboard-item">
                  <div className="vort-check-box">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <div className="vort-check-line" />
                </div>
              </div>
            </div>

            {/* P Plate */}
            <div className="vort-plate-p">P</div>
          </div>

          {/* Right Text Content */}
          <div>
            <h2 className="vort-intro-title">What is a VORT?</h2>
            <p className="vort-intro-desc">
              A VORT (Vehicle On Road Test) is a practical driving assessment
              conducted by a qualified examiner to evaluate your driving skills
              and road safety knowledge. It&apos;s the final step to obtaining your P1
              provisional licence in South Australia.
            </p>

            <h3 className="vort-who-title">Who Needs a VORT?</h3>
            <ul className="vort-who-list">
              <li className="vort-who-item">
                <Check size={17} strokeWidth={3} />
                <span>
                  <strong>Learners Permit holders</strong> ready to obtain their P1 licence
                </span>
              </li>
              <li className="vort-who-item">
                <Check size={17} strokeWidth={3} />
                <span>
                  <strong>Overseas licence holders</strong> converting to South Australian licence
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Centered CTA */}
        <div className="vort-cta-wrap">
          <Link to="/book-test" className="vort-cta-btn">
            Find My VORT Slot Now
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

