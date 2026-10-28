import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../../styles/home-sections.css';

const reasons = [
  {
    id: 1,
    title: 'Arrive Calm and Prepared',
    description:
      'Get a 1-hour warmup lesson right before your test to settle your nerves and practice around the test start point with an experienced instructor.',
  },
  {
    id: 2,
    title: 'Last-Minute Feedback & Tips',
    description:
      'Receive expert guidance on what examiners look for and get personalized tips on areas to focus on during your test.',
  },
  {
    id: 3,
    title: 'Practice in the Test Area',
    description:
      'Familiarize yourself with the roads, intersections, and roundabouts you may encounter during your official VORT test.',
  },
  {
    id: 4,
    title: 'Use the Same Car for Your Test',
    description:
      "Option to upgrade and use the instructor's car throughout both the warmup lesson and the official VORT test — no surprises on test day.",
  },
];

export default function WhyPreVort() {
  return (
    <section className="prevort-section">
      <div className="prevort-container">
        <h2 className="prevort-title">Why Choose PreVORT Warmup + VORT?</h2>

        <div className="prevort-card">
          <div className="prevort-grid">
            {reasons.map((r) => (
              <div key={r.id} className="prevort-item">
                <h3 className="prevort-item-title">{r.title}</h3>
                <p className="prevort-item-desc">{r.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="prevort-cta-wrap">
          <Link to="/book-test" className="prevort-cta-btn">
            Find My VORT Slot Now
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

