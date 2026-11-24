import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Award, Car, Clock, ArrowRight, ShieldCheck, FileText, Compass } from 'lucide-react';
import TiltCard from '../components/effects/TiltCard';
import ScrollReveal from '../components/effects/ScrollReveal';
import MagneticButton from '../components/effects/MagneticButton';

const RoadScenario3D = lazy(() => import('../components/3d/RoadScenario3D'));

export default function HowItWorks() {
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
              <ShieldCheck size={14} /> South Australia Official Licensing Guide
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '1rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
              How the Vehicle On Road Test (VORT) Works
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
              Understand the complete path from learner's permit to P1 provisional licence in South Australia, including test hubs, manoeuvres, and scoring benchmarks.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container section">
        {/* Interactive 3D Manoeuvre Showcase */}
        <div style={{ maxWidth: '960px', margin: '0 auto 4rem auto' }}>
          <ScrollReveal direction="up" distance={30}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="badge-3d" style={{ marginBottom: '0.5rem' }}>
                <Compass size={14} /> Interactive 3D Simulation
              </span>
              <h2 style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 800 }}>
                Visualise the 5 Mandatory Manoeuvres
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
                Test criteria require safe vehicle control, accurate mirror observation, and blind spot checks. Toggle between manoeuvres in 3D:
              </p>
            </div>
            <Suspense fallback={<div className="loading-spinner" style={{ minHeight: '380px' }} />}>
              <RoadScenario3D />
            </Suspense>
          </ScrollReveal>
        </div>

        {/* Step by step */}
        <div style={{ maxWidth: '960px', margin: '0 auto 4rem auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', color: '#ffffff', fontSize: '2rem', fontWeight: 800 }}>
            Your 4-Step Journey to a South Australian Licence
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ScrollReveal direction="up" distance={30} delay={0.1}>
              <TiltCard maxTilt={6} scale={1.01}>
                <div style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1B6C31 0%, #22c55e 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '1.25rem', boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)' }}>
                    1
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#ffffff' }}>Complete 75 Supervised Logbook Hours</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                      Learner drivers under 25 in SA must hold their learner's permit for at least 12 months and log a minimum of 75 hours of driving, including at least 15 hours at night. Drivers 25 and over require at least 6 months on their permit.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={30} delay={0.2}>
              <TiltCard maxTilt={6} scale={1.01}>
                <div style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1B6C31 0%, #22c55e 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '1.25rem', boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)' }}>
                    2
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#ffffff' }}>Master the 5 Mandatory VORT Manoeuvres</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                      During your VORT test, your authorised examiner will require you to demonstrate slow-speed manoeuvres without mounting the kerb or committing an immediate breach:
                    </p>
                    <div className="grid grid-2" style={{ gap: '0.75rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
                      <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                        <CheckCircle size={16} color="#22c55e" /> <strong>Parallel Park:</strong> Within 300mm of kerb
                      </div>
                      <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                        <CheckCircle size={16} color="#22c55e" /> <strong>Angle Park:</strong> 45-degree kerb alignment
                      </div>
                      <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                        <CheckCircle size={16} color="#22c55e" /> <strong>Three-Point Turn:</strong> Smooth 2-way road turn
                      </div>
                      <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                        <CheckCircle size={16} color="#22c55e" /> <strong>U-Turn:</strong> Safe intersection or road turn
                      </div>
                      <div className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                        <CheckCircle size={16} color="#22c55e" /> <strong>Hill Start:</strong> Smooth take-off without rollback
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={30} delay={0.3}>
              <TiltCard maxTilt={6} scale={1.01}>
                <div style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1B6C31 0%, #22c55e 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '1.25rem', boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)' }}>
                    3
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#ffffff' }}>Book Your Official VORT Test Online</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                      Use our live booking portal to select your accredited examiner, test centre hub, and date. Remember that SA DIT requires tests to be locked in at least 3 business days in advance.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={30} delay={0.4}>
              <TiltCard maxTilt={6} scale={1.01}>
                <div style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1B6C31 0%, #22c55e 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0, fontSize: '1.25rem', boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)' }}>
                    4
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#ffffff' }}>Score 90%+ and Receive Your Certificate</h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                      You must achieve a pass mark of at least 90% on road law compliance and complete all manoeuvres safely without any immediate fail items.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>
        </div>

        {/* CTA Banner */}
        <ScrollReveal direction="scale" distance={30}>
          <TiltCard maxTilt={6} scale={1.01}>
            <div
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(27, 108, 49, 0.95) 0%, rgba(13, 38, 69, 0.95) 100%)',
                color: '#ffffff',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: 'var(--shadow-3d-floating)',
              }}
            >
              <h3 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '0.75rem', fontWeight: 800 }}>Ready to Book Your Official Test?</h3>
              <p style={{ maxWidth: '620px', margin: '0 auto 2rem auto', color: '#e2e8f0', fontSize: '1.1rem' }}>
                Check real-time test slots with authorised examiners at Thebarton, Port Adelaide, Marion, and Modbury.
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <MagneticButton as={Link} to="/book-test" variant="gold">
                  <span>Book a VORT Test Now</span>
                  <ArrowRight size={18} />
                </MagneticButton>
                <MagneticButton as={Link} to="/lesson-packages" variant="outline" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                  <span>View Warmup Bundles</span>
                </MagneticButton>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>
      </div>
    </div>
  );
}
