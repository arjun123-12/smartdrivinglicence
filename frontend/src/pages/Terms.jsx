import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, AlertTriangle, ShieldCheck, CheckCircle2, RotateCcw, Phone, Mail, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Terms() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <section className="page-header" style={{ background: 'linear-gradient(135deg, var(--color-secondary-dark) 0%, var(--color-secondary) 100%)', color: '#fff', padding: '3.5rem 1rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', marginBottom: '1rem', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
            <FileText size={16} color="var(--color-accent)" />
            <span>Australian Consumer Law (ACL) Compliant</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Booking Cancellation &amp; Lesson Credit Policy
          </h1>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'rgba(255,255,255,0.85)', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
            Terms and conditions for driving lessons &amp; VORT preparation booked directly with MB &amp; HB GROUP PTY LTD (ABN 92 662 509 720) trading as A1 Smart Driving in Adelaide, South Australia.
          </p>
        </div>
      </section>

      {/* Content Container */}
      <div className="container" style={{ maxWidth: '960px', margin: '-2rem auto 0 auto', padding: '0 1rem' }}>
        {/* Intro Banner */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid var(--color-primary)', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ fontSize: 'var(--font-size-base)', lineHeight: 1.7, color: 'var(--color-text)', margin: 0 }}>
            These terms apply to all driving lessons, driving packages, and VORT preparation booked directly with <strong>MB &amp; HB GROUP PTY LTD</strong> (ABN 92 662 509 720), trading as <strong>A1 Smart Driving</strong>. For lessons booked through any third-party platform (such as EzLicence), please use that platform’s booking and cancellation process and check the terms shown at the time of your booking. Your rights under the <strong>Australian Consumer Law</strong> apply at all times.
          </p>
        </div>

        {/* Section 1: Booking and Payment */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <CheckCircle2 size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-secondary)' }}>1. Booking Confirmation and Payment</h2>
          </div>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', margin: 0 }}>
            A direct booking is confirmed when we send you written confirmation (via email or SMS) and receive the required payment or apply your eligible lesson credit. Your booking confirmation states the lesson date, Adelaide local time (ACST/ACDT), duration, pickup location, and total price. Please check these details carefully upon receipt and notify us promptly if anything requires correction.
          </p>
        </div>

        {/* Section 2: Cancellation & Rescheduling Rules */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Clock size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-secondary)' }}>2. How to Cancel or Reschedule</h2>
          </div>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            To cancel or reschedule a confirmed lesson, send your full name and scheduled lesson date and time by SMS to <strong style={{ color: 'var(--color-text)' }}>0430 580 111</strong> or by email to <a href="mailto:enquiries@a1smartdriving.com.au" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>enquiries@a1smartdriving.com.au</a>. Notice is calculated from the exact time your message reaches either channel to the scheduled lesson start time, including weekends and South Australian public holidays. Rescheduling follows the same notice requirements as cancelling.
          </p>

          {/* Cancellation Schedule Table */}
          <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: 'var(--color-secondary)', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: 'var(--font-size-sm)', fontWeight: 700, width: '38%' }}>Notice Before Scheduled Start</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>Cancellation / Rescheduling Outcome</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-success)' }}>
                    24 hours or more notice
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text)' }}>
                    Reschedule to any available time <strong>without fee</strong>, or receive <strong>100% full lesson credit</strong> for customer cancellation.
                  </td>
                </tr>
                <tr style={{ background: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-accent-hover)' }}>
                    12 hours to under 24 hours notice
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text)' }}>
                    Up to 50% of the lesson fee may be deducted for late notice. Any remaining balance is immediately credited to your account as lesson credit.
                  </td>
                </tr>
                <tr style={{ background: 'var(--color-surface)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--color-error)' }}>
                    Under 12 hours notice or No-Show
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--color-text)' }}>
                    Up to 100% of the lesson price may be deducted. Any remaining amount becomes lesson credit.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--color-primary-light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>
            <strong>Reasonable Loss &amp; Compassionate Waiver:</strong> Any deduction is strictly capped at our reasonable loss resulting from the missed booking after accounting for saved costs and any replacement booking we secure. If another student fills the slot at the same price, there is no deduction. We always consider genuine medical emergencies and exceptional circumstances with compassion and may reduce or waive fees.
          </div>
        </div>

        {/* Section 3: Arrival and Licence Requirements */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <AlertTriangle size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-secondary)' }}>3. Arrival and Licence Requirements</h2>
          </div>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
            <li><strong>Be Ready on Time:</strong> Please be waiting at your agreed pickup location at the confirmed start time with your current physical South Australian learner's permit, provisional licence, or approved overseas licence.</li>
            <li><strong>Late Arrival by Student:</strong> If you arrive late, your lesson will still finish at the scheduled time to prevent delaying subsequent learners. If you are more than 15 minutes late, or if a lesson cannot proceed because you do not have your physical licence or are unfit to drive, the session may be treated as a no-show.</li>
            <li><strong>Instructor Delays:</strong> If your instructor is delayed due to unexpected Adelaide traffic or weather conditions, they will contact you promptly and ensure you receive the full scheduled driving time, or agree on a suitable make-up time remedy.</li>
          </ul>
        </div>

        {/* Section 4: Lesson Credit and Change of Mind */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <RotateCcw size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-secondary)' }}>4. Lesson Credit and Change of Mind</h2>
          </div>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            For customer change-of-mind cancellations on directly booked lessons, we issue lesson credit for the eligible unused balance after any applicable deduction. We do not provide cash or card refunds for simple change of mind unless required by Australian law. For prepaid lesson packages, any late cancellation deduction applies solely to the individual affected lesson (calculated using its allocated package price).
          </p>
          <div style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Key Lesson Credit Rules:</div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: 'var(--font-size-sm)', lineHeight: 1.7, color: 'var(--color-text)', margin: 0 }}>
              <li><strong>No Expiry Date:</strong> Lesson credits have no expiration date and remain valid until used.</li>
              <li><strong>Usable for Any Service:</strong> Credits can be redeemed by the named learner towards any standard driving lesson, double lesson, or VORT preparation booked directly with A1 Smart Driving.</li>
              <li><strong>Written Confirmation:</strong> We confirm all credit balances in writing. If a new booking has a higher rate, you simply pay the difference.</li>
            </ul>
          </div>
        </div>

        {/* Section 5: If A1 Smart Driving Cancels */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <ShieldCheck size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-secondary)' }}>5. Cancellations by A1 Smart Driving</h2>
          </div>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', margin: 0 }}>
            In the event that A1 Smart Driving must cancel a lesson due to instructor illness, mechanical vehicle malfunction, severe weather, or unsafe road conditions, you will be offered your choice of:
            <br />
            <strong>(a)</strong> Rescheduling to a new time at no additional cost,
            <br />
            <strong>(b)</strong> Full 100% lesson credit added to your account, or
            <br />
            <strong>(c)</strong> A prompt, full refund of the amount paid for the cancelled session.
          </p>
        </div>

        {/* Section 6: Australian Consumer Law & Contact */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Phone size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--color-secondary)' }}>6. Australian Consumer Law &amp; Dispute Enquiries</h2>
          </div>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Nothing in these terms excludes, restricts, or modifies any consumer rights or statutory remedies available to you under the <em>Australian Consumer Law (ACL)</em>. Where you are entitled to a refund under the ACL, we will provide it promptly.
          </p>

          <div style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Booking &amp; Cancellation Enquiries:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>
              <div><strong>Operating Company:</strong> MB &amp; HB GROUP PTY LTD trading as A1 Smart Driving</div>
              <div><strong>ABN:</strong> 92 662 509 720</div>
              <div><strong>Email:</strong> <a href="mailto:enquiries@a1smartdriving.com.au">enquiries@a1smartdriving.com.au</a></div>
              <div><strong>SMS / Mobile:</strong> <a href="tel:0430580111">0430 580 111</a></div>
              <div><strong>Location:</strong> Adelaide, South Australia</div>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <Link to="/" className="button button-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Return to Home
          </Link>
          <Link to="/book-lesson" className="button button-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Book a Lesson <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
