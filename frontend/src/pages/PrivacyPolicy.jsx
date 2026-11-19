import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileText, CheckCircle, Mail, Phone, MapPin, Eye, Camera, Users, AlertCircle, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <section className="page-header" style={{ background: 'linear-gradient(135deg, var(--color-secondary-dark) 0%, var(--color-secondary) 100%)', color: '#fff', padding: '3.5rem 1rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', marginBottom: '1rem', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
            <Shield size={16} color="var(--color-accent)" />
            <span>Australian Privacy Principles &amp; Privacy Act 1988 (Cth)</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            A1 Smart Driving Privacy Policy
          </h1>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'rgba(255,255,255,0.85)', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
            Effective Date: November 2026 · Operated by MB &amp; HB GROUP PTY LTD (ABN 92 662 509 720) trading as A1 Smart Driving, Adelaide, South Australia.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="container" style={{ maxWidth: '960px', margin: '-2rem auto 0 auto', padding: '0 1rem' }}>
        {/* Intro Summary Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid var(--color-primary)', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ fontSize: 'var(--font-size-base)', lineHeight: 1.7, color: 'var(--color-text)', margin: 0 }}>
            <strong>A1 Smart Driving</strong> is operated by <strong>MB &amp; HB GROUP PTY LTD</strong> (ABN 92 662 509 720), trading as A1 Smart Driving. This policy explains how we handle personal information when you visit our website (<strong>a1smartdriving.com.au</strong>), contact us, book or attend a driving lesson, or deal with us on behalf of a learner in Adelaide and across South Australia. We comply with applicable Australian privacy laws, including the <em>Privacy Act 1988 (Cth)</em> and the Australian Privacy Principles where they apply to us.
          </p>
        </div>

        {/* Section 1: What We Collect */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <FileText size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-secondary)' }}>1. What We Collect and How We Collect It</h2>
          </div>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            We collect the information reasonably necessary to respond to your enquiry or provide your requested driver training and VORT preparation services. This may include:
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>Contact &amp; Location Details:</strong> Your name, phone number, email address, residential suburb, preferred pickup and drop-off locations, and lesson scheduling availability.</li>
            <li><strong>Booking &amp; Training Records:</strong> Lesson dates, vehicle transmission preference (automatic), driving progress notes, instructor feedback, and logbook milestones.</li>
            <li><strong>Permit &amp; Licence Verification:</strong> Your learner’s permit or current driver's licence status. When required, your instructor will inspect the physical document prior to the drive to verify that you are legally authorized to operate a motor vehicle under South Australian law. <em>Please bring the relevant document to your lesson and keep licence numbers, document scans, and sensitive medical files out of public website forms.</em></li>
            <li><strong>Parent &amp; Guardian Information:</strong> For learners under the age of 18, we collect the name, phone number, and email of a parent or legal guardian who arranges or authorizes lessons.</li>
            <li><strong>Payment &amp; Transaction Records:</strong> Payment confirmation records, date, amount, transaction references, and lesson credit balances. (Full credit card numbers are processed directly through secure PCI-DSS compliant gateways and are never stored on our web servers).</li>
            <li><strong>Accessibility &amp; Health Details:</strong> Any health, sensory, or accessibility information that you voluntarily provide to make safe and comfortable driving lesson arrangements, collected only with your explicit consent.</li>
          </ul>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginTop: '1rem', marginBottom: 0 }}>
            We collect this information directly from you when you enquire online, call, email, or attend a lesson. If essential information required to verify your legal eligibility to drive is withheld, we may be unable to confirm your booking or conduct the lesson.
          </p>
        </div>

        {/* Section 2: How We Use and Share Information */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Users size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-secondary)' }}>2. How We Use and Share Information</h2>
          </div>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            We use personal information to answer enquiries, schedule and deliver driving instruction, maintain student training records, send booking confirmations and SMS/email reminders, manage payments and lesson credits, handle customer service requests, and fulfill safety and South Australian regulatory compliance obligations.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: 0 }}>
            We only share relevant information with your assigned accredited driving instructor and trusted service providers who assist us in operating our booking system, payment gateways, and communications. We may also disclose information to insurers or regulatory authorities (such as the Registrar of Motor Vehicles or South Australian Police) where authorized or required by Australian law. When you book via a third-party platform (such as EzLicence), that platform handles your data according to its own privacy policy.
          </p>
        </div>

        {/* Section 3: Website Data & Marketing */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Eye size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-secondary)' }}>3. Website Data, Cookies &amp; Marketing Messages</h2>
          </div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Website Analytics &amp; Cookies</h3>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            Our website uses cookies and session tools to provide core booking functionality, remember your search preferences, and analyze anonymized site traffic. You can adjust your browser settings to block or delete cookies at any time, though some booking features may require cookies to maintain active state.
          </p>

          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>Marketing Communications (Spam Act 2003 Compliance)</h3>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: 0 }}>
            If we send promotional emails or SMS offers, we ensure clear sender identification from A1 Smart Driving and provide a simple, functional unsubscribe mechanism. We action all unsubscribe requests within five (5) working days. Essential transactional notifications regarding scheduled lessons, reschedules, or booking confirmations will continue to be delivered.
          </p>
        </div>

        {/* Section 4: Storage, Security & Retention */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Lock size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-secondary)' }}>4. Storage, Security and Retention</h2>
          </div>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            We take all reasonable physical, technical, and administrative steps to protect personal information against misuse, interference, loss, unauthorized access, modification, or disclosure.
          </p>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: 0 }}>
            Personal information is retained only for as long as necessary to provide our driving instruction services, satisfy Australian record-keeping and tax requirements, or resolve any potential disputes. When information is no longer needed, we securely destroy or permanently de-identify it. In the unlikely event of an eligible data breach, we adhere to the Notifiable Data Breaches (NDB) scheme under the Privacy Act.
          </p>
        </div>

        {/* Section 5: Customer Photos and Videos on Social Media */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', borderLeft: '4px solid var(--color-accent)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-hover)' }}>
              <Camera size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-secondary)' }}>5. Customer Photos and Videos on Social Media</h2>
          </div>

          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Written Consent Before We Take or Post</h3>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            We celebrate our students' achievements, but your privacy always comes first. We ask for <strong>written permission</strong> before taking any identifiable photo or video for promotional purposes. Before publishing, we show you the proposed image and caption and ask you to approve them in writing. You may choose Facebook, Instagram, both, or neither. Saying yes to a photo, posing with a pass certificate, booking a lesson, or sending us an image does NOT automatically grant permission to post it publicly. Refusing or withdrawing consent has zero effect on your lessons, fees, or service.
          </p>

          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>Learners Under 18 Years of Age</h3>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            For any learner under 18, our strict policy requires written permission from a parent or legal guardian AND the learner’s own clear agreement. If either person declines, withdraws permission, or if authority cannot be verified, the photo will not be published.
          </p>

          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>What We May Show &amp; Privacy Protection</h3>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            We only use approved images and captions. For anyone under 18, we <strong>never</strong> publish full surnames, tag personal accounts, or share school names. We systematically crop, cover, or blur permit numbers, test paperwork, home addresses, contact details, vehicle registration numbers, and any bystander who has not given consent. We never add live location tags.
          </p>

          <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>How to Withdraw Consent or Report a Post</h3>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: 0 }}>
            You may withdraw consent at any time by emailing <a href="mailto:enquiries@a1smartdriving.com.au" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>enquiries@a1smartdriving.com.au</a> or privately messaging our official Facebook or Instagram page. Include the post link or a brief description and we will promptly delete the content from all channels we control.
          </p>
        </div>

        {/* Section 6: Access, Correction & Complaints */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <CheckCircle size={20} />
            </div>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-secondary)' }}>6. Access, Correction &amp; Privacy Complaints</h2>
          </div>
          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
            You have the right to request access to the personal information we hold about you and to ask for corrections if it is inaccurate, out-of-date, or incomplete. To make an enquiry or lodge a privacy complaint, please contact us:
          </p>

          <div style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>A1 Smart Driving Privacy Officer</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>
              <div><strong>Operating Entity:</strong> MB &amp; HB GROUP PTY LTD trading as A1 Smart Driving</div>
              <div><strong>ABN:</strong> 92 662 509 720</div>
              <div><strong>Email:</strong> <a href="mailto:enquiries@a1smartdriving.com.au">enquiries@a1smartdriving.com.au</a></div>
              <div><strong>Phone:</strong> <a href="tel:0430580111">0430 580 111</a></div>
              <div><strong>Location:</strong> Adelaide, South Australia</div>
            </div>
          </div>

          <p style={{ lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: 0 }}>
            We will promptly investigate and respond to your request in writing. If you are not satisfied with our response, you may lodge a complaint with the <strong>Office of the Australian Information Commissioner (OAIC)</strong> at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>www.oaic.gov.au</a> or by calling 1300 363 992.
          </p>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" className="button button-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
