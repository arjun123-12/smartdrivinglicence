import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Compass } from 'lucide-react';
import ScrollReveal from '../effects/ScrollReveal';
import TiltCard from '../effects/TiltCard';
import SectionHeading from '../typography/SectionHeading';
import '../../styles/vort-and-reviews.css';

const RoadScenario3D = lazy(() => import('../3d/RoadScenario3D'));

export default function WhatIsVort() {
  return (
    <section className="vort-intro-section scene-perspective-container">
      <div className="vort-intro-container">
        <SectionHeading
          eyebrow="South Australia Driving Examination"
          eyebrowIcon={Compass}
          liveDot={true}
          title="What is a VORT Driving Test?"
          highlightWord="VORT Driving Test"
          subtitle="A VORT (Vehicle On Road Test) is a practical driving assessment conducted by an authorised examiner to evaluate your safe vehicle control, system of vehicle control, and road law compliance. It is the official pathway to obtaining your P1 provisional licence in South Australia."
          theme="light"
          size="md"
        />

        <div className="vort-intro-grid" style={{ alignItems: 'center' }}>
          {/* Left: Interactive 3D Road Test Manoeuvre Simulation */}
          <ScrollReveal direction="left" distance={50}>
            <Suspense fallback={<div className="loading-spinner" style={{ minHeight: '380px' }} />}>
              <RoadScenario3D />
            </Suspense>
          </ScrollReveal>

          {/* Right Text Content with 3D Depth Card */}
          <ScrollReveal direction="right" distance={50}>
            <TiltCard maxTilt={8} glare={false}>
              <div style={{ padding: '2rem' }}>
                <h3 className="vort-who-title" style={{ marginTop: 0 }}>
                  Who Needs a VORT?
                </h3>
                <ul className="vort-who-list">
                  <li className="vort-who-item">
                    <Check size={18} strokeWidth={3} color="#22c55e" />
                    <span>
                      <strong>Learner's Permit Holders:</strong> Completed required logbook hours and ready to qualify for P-plates.
                    </span>
                  </li>
                  <li className="vort-who-item">
                    <Check size={18} strokeWidth={3} color="#22c55e" />
                    <span>
                      <strong>Overseas Licence Conversions:</strong> Direct conversion test required by Service SA / DIT.
                    </span>
                  </li>
                  <li className="vort-who-item">
                    <Check size={18} strokeWidth={3} color="#22c55e" />
                    <span>
                      <strong>Disqualified or Re-test Drivers:</strong> Court or medical re-examinations.
                    </span>
                  </li>
                </ul>

                <div style={{ marginTop: '1.75rem' }}>
                  <Link to="/book-test" className="magnetic-btn" style={{ textDecoration: 'none' }}>
                    <span>Book Your VORT Test</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
