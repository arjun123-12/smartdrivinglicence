import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import ScrollReveal from '../effects/ScrollReveal';
import TiltCard from '../effects/TiltCard';
import '../../styles/home-sections.css';

const VehicleInspection3D = lazy(() => import('../3d/VehicleInspection3D'));

const reasons = [
  {
    id: 1,
    title: 'Arrive Calm and Prepared',
    description:
      'A 1-hour warm-up lesson right before your test settles test anxiety, refreshes blind spot checks, and tunes your steering feel around the exact Adelaide test centre hub.',
  },
  {
    id: 2,
    title: 'Dual-Controlled Safety Car',
    description:
      'Option to use our 5-star ANCAP dual-controlled instructor car for both your warmup and official VORT test. Eliminates vehicle compliance risks.',
  },
  {
    id: 3,
    title: 'Test Route Familiarisation',
    description:
      'Practice tricky South Australian complex intersections, multi-lane roundabouts, and school zones commonly assessed in your chosen test area.',
  },
  {
    id: 4,
    title: '95%+ First-Time Pass Rate',
    description:
      'Warmup students pass significantly higher than cold test candidates. Immediate feedback corrects minor habits before the examiner sits in.',
  },
];

export default function WhyPreVort() {
  return (
    <section className="prevort-section scene-perspective-container">
      <div className="prevort-container">
        <ScrollReveal direction="up" distance={35}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge-3d" style={{ marginBottom: '0.75rem' }}>
              <Sparkles size={14} /> Proven Success Strategy
            </span>
            <h2 className="prevort-title">Why Choose PreVORT Warmup + VORT?</h2>
            <p style={{ color: '#94a3b8', maxWidth: '720px', margin: '0 auto', fontSize: '1.05rem' }}>
              Experience the dual benefit of immediate pre-test calibration and our accredited dual-controlled training vehicle.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          {/* Left Column: Interactive 3D Vehicle Inspection */}
          <ScrollReveal direction="left" distance={45}>
            <Suspense fallback={<div className="loading-spinner" style={{ minHeight: '380px' }} />}>
              <VehicleInspection3D />
            </Suspense>
          </ScrollReveal>

          {/* Right Column: 3D Reason Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reasons.map((r, index) => (
              <ScrollReveal key={r.id} direction="right" distance={30} delay={index * 0.1}>
                <TiltCard maxTilt={6} scale={1.01}>
                  <div style={{ padding: '1.25rem 1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.4rem 0', color: '#86efac', fontSize: '1.1rem', fontWeight: 700 }}>
                      {r.title}
                    </h3>
                    <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.55 }}>
                      {r.description}
                    </p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal direction="up" distance={30} delay={0.3}>
          <div className="prevort-cta-wrap" style={{ marginTop: '2.5rem' }}>
            <Link to="/book-test" className="magnetic-btn" style={{ textDecoration: 'none' }}>
              <span>Book PreVORT Warmup Bundle</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
