import React, { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CarFront, CircleDot, Route, ShieldCheck } from 'lucide-react';
import SectionHeading from '../typography/SectionHeading';
import '../../styles/vort-practice.css';

const RoadScenario3D = lazy(() => import('../3d/RoadScenario3D'));

const benefits = [
  { Icon: CarFront, label: 'Real Test Scenarios' },
  { Icon: Route, label: 'Step-by-Step Guidance' },
  { Icon: ShieldCheck, label: 'Build Confidence' },
];

export default function WhatIsVort() {
  const [simulatorOpen, setSimulatorOpen] = useState(false);

  return (
    <section className="vort-practice" aria-labelledby="vort-practice-heading">
      <div className="vort-practice__banner">
        <div className="vort-practice__images" aria-hidden="true">
          <img className="vort-practice__car" src="/images/hero-car.jpg" alt="" loading="lazy" />
          <img className="vort-practice__inset" src="/images/hero-driving.jpg" alt="" loading="lazy" />
        </div>

        <div className="vort-practice__content">
          <SectionHeading
            headingId="vort-practice-heading"
            eyebrow="VORT Practice Simulator"
            eyebrowIcon={CircleDot}
            liveDot
            title="Practice VORT Manoeuvres Like the Real Test"
            highlightWord="VORT"
            subtitle="Use our interactive VORT simulator to learn, practice and build confidence for your Provisional Licence test in South Australia."
            align="left"
            size="md"
            className="vort-practice__heading"
          />

          <ul className="vort-practice__benefits">
            {benefits.map(({ Icon, label }) => (
              <li key={label}>
                <span><Icon aria-hidden="true" /></span>
                {label}
              </li>
            ))}
          </ul>

          <Link to="/book-test" className="vort-practice__book">
            <CalendarDays aria-hidden="true" />
            Book Your VORT Test
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>

      <details className="vort-practice__simulator" onToggle={(event) => setSimulatorOpen(event.currentTarget.open)}>
        <summary>Open the interactive VORT simulator</summary>
        {simulatorOpen && (
          <Suspense fallback={<p role="status">Loading simulator…</p>}>
            <RoadScenario3D />
          </Suspense>
        )}
      </details>
    </section>
  );
}
