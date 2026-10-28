import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Award, Car, Clock, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div>
      <section className="page-header">
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
            South Australia Licensing Guide
          </span>
          <h1>How the Vehicle On Road Test (VORT) Works</h1>
          <p>
            Understand the complete path from learner's permit to P1 provisional licence in South Australia, including test hubs, manoeuvres, and scoring.
          </p>
        </div>
      </section>

      <div className="container section">
        {/* Step by step */}
        <div style={{ maxWidth: '850px', margin: '0 auto 4rem auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Your Journey to a South Australian Licence</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '1.25rem' }}>
                1
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Complete 75 Supervised Logbook Hours</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                  Learner drivers under 25 in SA must hold their learner's permit for at least 12 months and log a minimum of 75 hours of driving, including at least 15 hours at night. Drivers 25 and over require at least 6 months on their permit.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '1.25rem' }}>
                2
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Master the 5 Mandatory VORT Manoeuvres</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                  During your VORT test, your authorised examiner will require you to demonstrate slow-speed manoeuvres without mounting the kerb or committing an immediate breach:
                </p>
                <div className="grid grid-2" style={{ gap: '0.5rem', marginTop: '0.75rem', fontSize: 'var(--font-size-xs)' }}>
                  <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                    <CheckCircle size={15} color="var(--color-success)" /> <strong>Parallel Park:</strong> Within 300mm of kerb
                  </div>
                  <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                    <CheckCircle size={15} color="var(--color-success)" /> <strong>Angle Park:</strong> 45-degree kerb alignment
                  </div>
                  <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                    <CheckCircle size={15} color="var(--color-success)" /> <strong>Three-Point Turn:</strong> Smooth 2-way road turn
                  </div>
                  <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                    <CheckCircle size={15} color="var(--color-success)" /> <strong>U-Turn:</strong> Safe intersection or road turn
                  </div>
                  <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                    <CheckCircle size={15} color="var(--color-success)" /> <strong>Hill Start:</strong> Smooth take-off without rollback
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '1.25rem' }}>
                3
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Book Your Official VORT Test Online</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                  Use our live booking portal to select your accredited examiner, test centre hub, and date. Remember that SA DIT requires tests to be locked in at least 3 business days in advance.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '1.25rem' }}>
                4
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Score 90%+ and Receive Your Certificate</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                  You must achieve a pass mark of at least 90% on road law compliance and complete all manoeuvres safely without any immediate fail items (e.g., speeding, stopping on a pedestrian crossing, failing to give way).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--color-primary)', color: '#ffffff' }}>
          <h3 style={{ color: '#ffffff', fontSize: '1.75rem', marginBottom: '0.75rem' }}>Ready to Book Your Official Test?</h3>
          <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto', color: 'rgba(255,255,255,0.85)' }}>
            Check real-time test slots with authorised examiners at Thebarton, Port Adelaide, or Marion.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/book-test" className="button button-accent button-lg">
              Book a VORT Test Now <ArrowRight size={18} />
            </Link>
            <Link to="/lesson-packages" className="button button-outline-white button-lg">
              View Warmup Bundles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

