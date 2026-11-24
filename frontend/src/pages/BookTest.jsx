import React, { lazy, Suspense } from 'react';
import BookingWizard from '../components/booking/BookingWizard';
import TiltCard from '../components/effects/TiltCard';
import ScrollReveal from '../components/effects/ScrollReveal';
import { Award, Clock, AlertTriangle, ShieldCheck, Compass, CheckCircle } from 'lucide-react';

const RoadScenario3D = lazy(() => import('../components/3d/RoadScenario3D'));

export default function BookTest() {
  return (
    <div className="scene-perspective-container">
      {/* 3D Page Header */}
      <section
        className="page-header"
        style={{
          background: 'linear-gradient(135deg, #07172b 0%, #0d2645 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          padding: '4rem 1.5rem 3.5rem',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <ScrollReveal direction="down" distance={25}>
            <span className="badge-3d" style={{ marginBottom: '1.25rem' }}>
              <ShieldCheck size={14} /> Official South Australia VORT Booking
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '1rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Book a Vehicle On Road Test (VORT)
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
              Schedule your official practical driving assessment with an authorised examiner across accredited South Australian test hubs (Thebarton, Port Adelaide, Marion, Modbury, Gawler).
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container" style={{ padding: '2.5rem var(--spacing-lg)' }}>
        {/* Important Notice Banner */}
        <ScrollReveal direction="up" distance={20}>
          <div
            className="alert alert-info glass-panel-3d"
            style={{
              maxWidth: '960px',
              margin: '0 auto 2.5rem auto',
              background: 'rgba(13, 38, 69, 0.75)',
              borderColor: 'rgba(34, 197, 94, 0.3)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              padding: '1.25rem 1.5rem',
            }}
          >
            <AlertTriangle size={24} color="#ffffff" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#ffffff', fontSize: '1rem' }}>
                South Australian Government DIT Notice:
              </strong>
              <div style={{ marginTop: '0.35rem', fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                Under Department for Infrastructure and Transport (DIT) regulations, all VORT tests must be booked with at least 3 clear business days' notice. You must bring your physical SA Learner's Permit and certified logbook showing 75 hours completed (including 15 night hours).
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Wizard */}
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <BookingWizard defaultServiceSlug="vort-test" forcedIsTest={true} />
        </div>

        {/* 3D Road Test Manoeuvre Guide */}
        <div style={{ maxWidth: '960px', margin: '4rem auto 0 auto' }}>
          <ScrollReveal direction="up" distance={30}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="badge-3d" style={{ marginBottom: '0.5rem' }}>
                <Compass size={14} /> Interactive Test Prep
              </span>
              <h2 style={{ fontSize: '1.85rem', color: '#ffffff', fontWeight: 700 }}>
                Master the Mandatory VORT Manoeuvres
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                Inspect authentic South Australian test manoeuvres simulated in interactive 3D.
              </p>
            </div>
            <Suspense fallback={<div className="loading-spinner" style={{ minHeight: '380px' }} />}>
              <RoadScenario3D />
            </Suspense>
          </ScrollReveal>
        </div>

        {/* Test details guide cards */}
        <div className="grid grid-3" style={{ maxWidth: '960px', margin: '3rem auto 0 auto', gap: '1.5rem' }}>
          <ScrollReveal direction="up" distance={30} delay={0.1}>
            <TiltCard maxTilt={8} scale={1.02} style={{ height: '100%' }}>
              <div style={{ padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.1rem', color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                  <Clock size={20} color="#22c55e" /> PreVORT Warmup Option
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0, flex: 1 }}>
                  We strongly recommend the Warmup + VORT bundle. Your instructor takes you through the 5 manoeuvres immediately before test time to calm nerves.
                </p>
              </div>
            </TiltCard>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={30} delay={0.2}>
            <TiltCard maxTilt={8} scale={1.02} style={{ height: '100%' }}>
              <div style={{ padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.1rem', color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                  <ShieldCheck size={20} color="#22c55e" /> Dual-Control Vehicle Hire
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0, flex: 1 }}>
                  All tests booked through A1 Smart Driving include full vehicle hire and commercial insurance. You sit your test in a modern 5-Star ANCAP dual-controlled car.
                </p>
              </div>
            </TiltCard>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={30} delay={0.3}>
            <TiltCard maxTilt={8} scale={1.02} style={{ height: '100%' }}>
              <div style={{ padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.1rem', color: '#ffffff', margin: '0 0 0.75rem 0' }}>
                  <Award size={20} color="#ffffff" /> Certificate of Competency
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0, flex: 1 }}>
                  Upon passing with 90%+ road law score and completing all manoeuvres safely, your examiner issues your electronic Certificate of Competency for Service SA.
                </p>
              </div>
            </TiltCard>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
