import React from 'react';
import { Link } from 'react-router-dom';
import { X, CheckSquare, ArrowRight, Layers } from 'lucide-react';
import SectionHeading from '../typography/SectionHeading';
import '../../styles/comparison.css';

export default function OldWayVsNewWay() {
  return (
    <section className="comparison-section">
      {/* <div className="container">
        <SectionHeading
          eyebrow="Modern Test Booking"
          eyebrowIcon={Layers}
          liveDot={true}
          title="Still Booking Tests the Old Way?"
          highlightWord="The Old Way?"
          subtitle="Say goodbye to phone tag, unreturned voicemails, and weeks of waiting."
          theme="light"
          size="lg"
        />

        <div className="comparison-grid">
       
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

       
          <div className="comparison-card comparison-card-new">
            <h3 className="comparison-card-title">The A1 Smart Driving Way</h3>
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

      
        <div className="comparison-cta-wrap">
          <Link to="/book-test" className="comparison-btn">
            Find My VORT Slot Now
            <ArrowRight size={17} />
          </Link>
        </div>
      </div> */}
    </section>
  );
}

