import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CarFront, Clock3, Route, Sparkles, Target } from 'lucide-react';
import SectionHeading from '../typography/SectionHeading';
import '../../styles/home-sections.css';


const reasons = [
  {
    Icon: Clock3,
    title: 'Arrive Calm and Prepared',
    description:
      'A 1-hour warm-up lesson right before your test settles test anxiety, refreshes blind spot checks, and tunes your steering feel around the exact Adelaide test centre hub.',
  },
  {
    Icon: CarFront,
    title: 'Dual-Controlled Safety Car',
    description:
      'Option to use our 5-star ANCAP dual-controlled instructor car for both your warmup and official VORT test. Eliminates vehicle compliance risks.',
  },
  {
    Icon: Route,
    title: 'Test Route Familiarisation',
    description:
      'Practice tricky South Australian complex intersections, multi-lane roundabouts, and school zones commonly assessed in your chosen test area.',
  },
  {
    Icon: Target,
    title: '95%+ First-Time Pass Rate',
    description:
      'Warmup students pass significantly higher than cold test candidates. Immediate feedback corrects minor habits before the examiner sits in.',
  },
];

export default function WhyPreVort() {
  return (
    <section className="prevort-section">
      <div className="prevort-container">
        <SectionHeading
          eyebrow="Proven Success Strategy"
          eyebrowIcon={Sparkles}
          liveDot={true}
          title="Why Choose PreVORT Warmup + VORT?"
          highlightWord="PreVORT Warmup"
          subtitle="Experience the dual benefit of immediate pre-test calibration and our accredited dual-controlled training vehicle."
          theme="light"
          size="md"
        />

        <ul className="prevort-grid">
          {reasons.map(({ Icon, title, description }) => (
            <li className="prevort-item" key={title}>
              <span className="prevort-item-icon"><Icon size={22} aria-hidden="true" /></span>
              <div>
                <h3 className="prevort-item-title">{title}</h3>
                <p className="prevort-item-desc">{description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="prevort-cta-wrap">
          <Link to="/book-test" className="prevort-cta-btn">
            <span>Book PreVORT Warmup Bundle</span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
