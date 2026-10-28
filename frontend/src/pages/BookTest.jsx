import React from 'react';
import BookingWizard from '../components/booking/BookingWizard';
import { Award, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function BookTest() {
  return (
    <div>
      <section className="page-header">
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
            Official South Australia VORT Booking
          </span>
          <h1>Book a Vehicle On Road Test (VORT)</h1>
          <p>
            Schedule your practical driving test with an authorised South Australian examiner at accredited testing centres including Thebarton, Port Adelaide, and Marion.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '2rem var(--spacing-lg)' }}>
        {/* Important notice banner */}
        <div className="alert alert-info" style={{ maxWidth: '900px', margin: '0 auto 2rem auto' }}>
          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong>South Australian Government VORT Notice:</strong>
            <div style={{ marginTop: '0.25rem', fontSize: 'var(--font-size-xs)', lineHeight: 1.5 }}>
              By SA Department for Infrastructure and Transport (DIT) regulations, all VORT tests must be booked with at least 3 clear business days' notice. Ensure you bring your current physical SA Learner's Permit and certified logbook with 75 hours completed (including 15 night hours).
            </div>
          </div>
        </div>

        {/* Wizard */}
        <BookingWizard defaultServiceSlug="vort-test" forcedIsTest={true} />

        {/* Test details guide */}
        <div className="grid grid-3" style={{ maxWidth: '900px', margin: '3rem auto 0 auto' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-base)' }}>
              <Clock size={18} color="var(--color-secondary)" /> PreVORT Warmup Option
            </h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              We strongly recommend the 120-min Warmup + VORT bundle. Your instructor takes you through the 5 manoeuvres immediately before test time to calm nerves.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-base)' }}>
              <ShieldCheck size={18} color="var(--color-secondary)" /> Dual-Control Vehicle Hire
            </h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              All tests booked through SmartDriving include full vehicle hire and commercial insurance. You sit your test in the examiner's 5-Star ANCAP rated modern vehicle.
            </p>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-base)' }}>
              <Award size={18} color="var(--color-secondary)" /> Certificate of Competency
            </h4>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Upon passing with 90%+ road law score and completing all manoeuvres safely, your examiner issues your electronic Certificate of Competency for Service SA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

