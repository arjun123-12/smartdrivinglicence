import React from 'react';
import { ArrowDown, Award, CalendarDays, Clock, Info, ShieldCheck } from 'lucide-react';
import BookingWizard from '../components/booking/BookingWizard';
import ScrollReveal from '../components/effects/ScrollReveal';
import TiltCard from '../components/effects/TiltCard';
import SectionHeading from '../components/typography/SectionHeading';
import '../styles/book-test.css';

const testDetails = [
  {
    Icon: Clock,
    title: 'PreVORT Warmup Option',
    description: 'The Warmup + VORT bundle gives you time to practise the five manoeuvres with your instructor immediately before your test.',
  },
  {
    Icon: ShieldCheck,
    title: 'Dual-Control Vehicle Hire',
    description: 'All tests booked through A1 Smart Driving include vehicle hire and commercial insurance. You sit your test in a 5-Star ANCAP dual-controlled car.',
  },
  {
    Icon: Award,
    title: 'Certificate of Competency',
    description: 'Upon passing with a 90%+ road law score and completing all manoeuvres safely, your examiner issues your electronic Certificate of Competency for Service SA.',
  },
];

export default function BookTest() {
  return (
    <main className="vort-booking-page">
      <section className="vort-booking-hero">
        <div className="container vort-booking-hero__layout">
          <div>
            <SectionHeading
              level="h1"
              eyebrow="South Australia VORT Booking"
              eyebrowIcon={ShieldCheck}
              title="Book a Vehicle On Road Test"
              highlightWord="Road Test"
              highlightVariant="emerald-light"
              subtitle="Schedule your practical driving assessment with an authorised examiner at a South Australian test hub."
              theme="dark"
              align="left"
              size="lg"
              className="vort-booking-heading"
            />
            <nav className="vort-booking-hero__actions" aria-label="Booking page shortcuts">
              <a href="#vort-booking" className="vort-booking-start">Start booking <ArrowDown size={17} aria-hidden="true" /></a>
            </nav>
          </div>

          <ScrollReveal direction="up" distance={24}>
            <TiltCard className="vort-booking-hero__photo" maxTilt={6} scale={1.015}>
              <img src="/images/hero-car.jpg" alt="" />
            </TiltCard>
          </ScrollReveal>
        </div>
      </section>

      <div className="container vort-booking-body">
        <section id="vort-booking" className="vort-booking-section" aria-labelledby="vort-booking-title">
          <SectionHeading
            headingId="vort-booking-title"
            eyebrow="VORT Appointments"
            eyebrowIcon={CalendarDays}
            title="Find Your Test Appointment"
            highlightWord="Test Appointment"
          />

          <aside className="vort-booking-notice" aria-label="South Australian Government DIT notice">
            <span className="vort-booking-icon"><Info size={22} aria-hidden="true" /></span>
            <div>
              <h3>South Australian Government DIT Notice</h3>
              <p>Under Department for Infrastructure and Transport (DIT) regulations, all VORT tests must be booked with at least 3 clear business days' notice. Bring your physical SA Learner's Permit and certified logbook showing 75 hours completed, including 15 night hours.</p>
            </div>
          </aside>

          <div className="vort-booking-wizard premium-booking-wizard">
            <BookingWizard defaultServiceSlug="vort-test" forcedIsTest />
          </div>
        </section>

        <section className="vort-booking-section" aria-labelledby="vort-test-day-title">
          <SectionHeading
            headingId="vort-test-day-title"
            title="What to Expect on Test Day"
            highlightWord="Test Day"
          />
          <div className="vort-booking-details">
            {testDetails.map(({ Icon, title, description }, index) => (
              <ScrollReveal key={title} direction="up" distance={20} delay={index * 0.08}>
                <TiltCard className="vort-booking-detail" maxTilt={6} scale={1.015}>
                  <div className="vort-booking-detail__body">
                    <span className="vort-booking-icon"><Icon size={23} aria-hidden="true" /></span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
