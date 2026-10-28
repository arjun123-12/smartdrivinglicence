import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, HeartHandshake, Car, Users, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div>
      <section className="page-header">
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
            Our Mission & Credentials
          </span>
          <h1>About SmartDriving South Australia</h1>
          <p>
            Dedicated to creating safer, more confident drivers across Adelaide and South Australia with transparent pricing, instant online bookings, and accredited VORT examiners.
          </p>
        </div>
      </section>

      <div className="container section">
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '3rem', marginBottom: '4rem' }}>
          <div>
            <span className="section-tag">Modern Driver Education</span>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Empowering South Australian Learners Since 2018
            </h2>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '1rem' }}>
              SmartDriving was established to eliminate the frustration of calling multiple driving schools, leaving voicemails, and waiting days for test date confirmations.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              We combined an intuitive real-time appointment booking platform with South Australia's most respected independent instructors and authorised VORT examiners. Every instructor in our network is personally vetted, holds current Department for Infrastructure and Transport accreditation, and adheres to strict safety protocols.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/book-test" className="button button-accent">
                Book a Test <ArrowRight size={16} />
              </Link>
              <Link to="/lesson-packages" className="button button-outline">
                View Packages
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', background: 'var(--color-primary-light)', border: 'none' }}>
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--color-primary)' }}>Our Core Standards</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <ShieldCheck size={24} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700 }}>100% Police & WWCC Checked</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    All instructors hold valid Working with Children clearances and Department of Transport accreditation.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Car size={24} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700 }}>5-Star ANCAP Safety Rated Cars</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    Dual-control fitted, late-model vehicles fully insured for commercial driving instruction.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Award size={24} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700 }}>High First-Time Pass Rates</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    Our students consistently outperform state averages, boasting a 94.8% first-time VORT pass rate.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

