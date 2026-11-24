import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import TiltCard from '../components/effects/TiltCard';
import ScrollReveal from '../components/effects/ScrollReveal';
import MagneticButton from '../components/effects/MagneticButton';
import PageHeading from '../components/typography/PageHeading';
import SectionHeading from '../components/typography/SectionHeading';
import CardHeading from '../components/typography/CardHeading';
import { 
  ShieldCheck, 
  Award, 
  Car, 
  Users, 
  CheckCircle, 
  Compass, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  FileCheck2 
} from 'lucide-react';

const VehicleInspection3D = lazy(() => import('../components/3d/VehicleInspection3D'));

export default function About() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <PageHeading
        badge="Adelaide Driving School & VORT Test Preparation"
        badgeIcon={ShieldCheck}
        liveDot={true}
        title="About A1 Smart Driving"
        highlightWord="Smart Driving"
        subtitle="A1 Smart Driving helps Adelaide learners and overseas licence holders build the skills and confidence they need for everyday driving. We work with people taking their first lesson, practising for a test, or getting familiar with South Australian roads."
      >
        <Link to="/book-lesson" className="button button-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          Book a Lesson <ArrowRight size={16} />
        </Link>
        <Link to="/lesson-packages" className="button button-outline" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
          Explore Packages
        </Link>
      </PageHeading>

      {/* Main Container */}
      <div className="container" style={{ maxWidth: '1100px', margin: '-2rem auto 0 auto', padding: '0 1rem' }}>
        
        {/* Core Philosophy Banner */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem', borderTop: '4px solid var(--color-primary)', boxShadow: 'var(--shadow-md)' }}>
          <div className="grid grid-2" style={{ gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <span className="section-tag" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Our Teaching Approach</span>
              <h2 style={{ fontSize: '1.85rem', color: 'var(--color-secondary)', marginBottom: '1rem', fontWeight: 800 }}>
                How We Teach You to Drive
              </h2>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '1rem' }}>
                Tell us what you find difficult—whether it’s starting in busy traffic, choosing a safe gap at an Adelaide roundabout, or getting your reverse parallel parking right. 
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                We break the skill down step-by-step, give you plenty of time to practise in a calm, dual-controlled training car, and provide clear, constructive feedback on what to work on between lessons.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                <CheckCircle size={18} />
                <span>Calm, supportive &amp; structured learning environment</span>
              </div>
            </div>

            <div>
              <Suspense fallback={<div className="loading-spinner" style={{ minHeight: '380px' }} />}>
                <VehicleInspection3D />
              </Suspense>
            </div>
          </div>
        </div>

        {/* The 3 Core Pillars of Training */}
        <div style={{ marginBottom: '3.5rem' }}>
          <SectionHeading
            eyebrow="Comprehensive Services"
            eyebrowIcon={Sparkles}
            title="Tailored Driver Training For Every Stage"
            highlightWord="Every Stage"
            subtitle="Whether you are sitting behind the wheel for the very first time or converting an overseas licence to South Australia, we have you covered."
            theme="light"
            size="md"
          />

          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            {/* Pillar 1: Learner Lessons */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-secondary)', marginBottom: '0.75rem', fontWeight: 700 }}>
                Learner Driving Lessons
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7, flexGrow: 1, marginBottom: '1.25rem' }}>
                Start with smooth steering, progressive braking, and moving off safely. As you progress, we master observation, mirror checks, blind spots, complex multi-lane roundabouts, and busy Adelaide traffic. If there’s a road condition you avoid, we help you conquer it.
              </p>
              <Link to="/book-lesson" className="button button-outline button-sm" style={{ alignSelf: 'flex-start' }}>
                Book Learner Lesson <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 2: VORT Preparation */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', borderTop: '4px solid var(--color-accent)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-hover)', marginBottom: '1.25rem' }}>
                <FileCheck2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-secondary)', marginBottom: '0.75rem', fontWeight: 700 }}>
                VORT Test Preparation
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7, flexGrow: 1, marginBottom: '1.25rem' }}>
                The Vehicle On Road Test (VORT) is a South Australian practical test assessing 5 mandatory slow-speed manoeuvres and general road driving. We conduct structured mock tests, pinpoint errors, and polish your vehicle control so test day feels natural and stress-free.
              </p>
              <Link to="/book-test" className="button button-accent button-sm" style={{ alignSelf: 'flex-start' }}>
                Explore VORT Prep <ArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 3: Overseas Licence Conversion */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--color-secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', marginBottom: '1.25rem' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-secondary)', marginBottom: '0.75rem', fontWeight: 700 }}>
                Overseas Licence Conversion
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7, flexGrow: 1, marginBottom: '1.25rem' }}>
                New to Adelaide? If you already know how to drive, we help you adapt smoothly to South Australian road rules, driving on the left, local give-way protocols, and Australian intersection navigation. We prepare you to pass your conversion practical driving test on the first attempt.
              </p>
              <Link to="/book-lesson" className="button button-outline button-sm" style={{ alignSelf: 'flex-start' }}>
                Book Conversion Lesson <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Our Standards and Accreditations */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '3.5rem', background: 'var(--color-surface-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <SectionHeading
            eyebrow="Safety First"
            eyebrowIcon={ShieldCheck}
            liveDot={true}
            title="Accreditation, Safety & High Pass Rates"
            highlightWord="High Pass Rates"
            subtitle="We take road safety seriously. Every lesson is conducted according to the highest industry standards."
            theme="light"
            size="md"
          />

          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={22} color="var(--color-primary)" />
                <h4 style={{ margin: 0, color: 'var(--color-secondary)' }}>100% Vetted Instructors</h4>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                All instructors hold Department for Infrastructure and Transport (DIT) accreditation, Working With Children Checks (WWCC), and national police clearances.
              </p>
            </div>

            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Car size={22} color="var(--color-primary)" />
                <h4 style={{ margin: 0, color: 'var(--color-secondary)' }}>Dual-Control 5-Star Cars</h4>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                Late-model, 5-Star ANCAP safety-rated training vehicles equipped with certified dual controls and commercial driving school insurance.
              </p>
            </div>

            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Award size={22} color="var(--color-primary)" />
                <h4 style={{ margin: 0, color: 'var(--color-secondary)' }}>Authorised VORT Examiners</h4>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                Senior accredited examiners with deep expertise across all South Australian test routes, helping learners pass with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Coverage Across Adelaide */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '3.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div className="grid grid-2" style={{ gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <span className="section-tag">Adelaide Wide</span>
              <h2 style={{ fontSize: '1.85rem', color: 'var(--color-secondary)', fontWeight: 800, marginBottom: '1rem' }}>
                Covering Greater Adelaide &amp; Official DIT Hubs
              </h2>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.7, marginBottom: '1rem' }}>
                We provide pickup and drop-off driving lessons across Central, North, South, East, and Western Adelaide suburbs.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                We prepare learners for all official Service SA &amp; Department for Infrastructure and Transport (DIT) testing hubs, including:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} color="var(--color-primary)" /> Thebarton DIT Hub</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} color="var(--color-primary)" /> Marion DIT Centre</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} color="var(--color-primary)" /> Port Adelaide Hub</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} color="var(--color-primary)" /> Elizabeth Testing Hub</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} color="var(--color-primary)" /> Gawler Service SA</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} color="var(--color-primary)" /> Modbury Test Centre</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} color="var(--color-primary)" /> Noarlunga Centre</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} color="var(--color-primary)" /> Mount Barker Hills</div>
              </div>
            </div>

            <div style={{ background: 'var(--color-secondary)', color: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '1rem', fontWeight: 700 }}>
                Company Information
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                A1 Smart Driving provides professional driving instruction and practical VORT test preparation throughout Adelaide and regional South Australia.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'var(--font-size-sm)' }}>
                <div><strong>Operating Entity:</strong> MB &amp; HB GROUP PTY LTD</div>
                <div><strong>Trading As:</strong> A1 Smart Driving</div>
                <div><strong>ABN:</strong> 92 662 509 720</div>
                <div><strong>Location:</strong> Adelaide, South Australia</div>
                <div><strong>Email:</strong> <a href="mailto:enquiries@a1smartdriving.com.au" style={{ color: 'var(--color-accent)' }}>enquiries@a1smartdriving.com.au</a></div>
                <div><strong>Phone:</strong> <a href="tel:0430580111" style={{ color: 'var(--color-accent)' }}>0430 580 111</a></div>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to start call to action */}
        <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)', color: '#fff', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>
            Ready to Get Behind the Wheel?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
            Choose a driving lesson, explore our discounted packages, or get in touch if you're unsure where to start.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/book-lesson" className="button button-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              Book a Lesson Now <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="button" style={{ background: '#ffffff', color: 'var(--color-primary)', fontWeight: 700 }}>
              Ask a Question / Contact Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
