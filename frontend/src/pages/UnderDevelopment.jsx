import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function UnderDevelopment() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem 1.5rem',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      {/* Top Header / Logo */}
      <header style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/logo.png"
            alt="A1 Smart Driving"
            style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
          />
        </div>
        <Link
          to="/securelogin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94a3b8',
            fontSize: '0.85rem',
            textDecoration: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.03)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <Lock size={13} />
          <span>Authorized Preview</span>
        </Link>
      </header>

      {/* Main Content Card */}
      <main style={{ maxWidth: '720px', width: '100%', margin: '3rem auto', textAlign: 'center' }}>
        {/* Brand Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(230, 57, 70, 0.15)',
            border: '1px solid rgba(230, 57, 70, 0.4)',
            color: '#ff6b6b',
            padding: '0.45rem 1rem',
            borderRadius: '50px',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
        >
          <Wrench size={16} />
          <span>System Maintenance & Upgrades</span>
        </div>

        {/* Hero Headline */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            margin: '0 0 1.25rem 0',
            color: '#ffffff',
            letterSpacing: '-0.5px',
          }}
        >
          Website Under <span style={{ color: 'var(--color-primary, #1B6C31)' }}>Development</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: '#cbd5e1',
            lineHeight: 1.6,
            margin: '0 auto 2.5rem auto',
            maxWidth: '580px',
          }}
        >
          We are currently upgrading the A1 Smart Driving platform to deliver a faster, more seamless experience for learner drivers and accredited driving instructors across Adelaide.
        </p>

        {/* Urgent Contact & Booking Box */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldCheck size={20} color="var(--color-primary, #1B6C31)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Need to book a lesson or urgent VORT test?
            </h2>
          </div>
          <p style={{ fontSize: '0.925rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
            Our instructor network is still actively operating daily throughout Adelaide. For bookings and enquiries during maintenance, please get in touch directly:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Phone */}
            <a
              href="tel:0430580111"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                background: 'rgba(27, 108, 49, 0.12)',
                border: '1px solid rgba(27, 108, 49, 0.35)',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--color-primary, #1B6C31)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <Phone size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Call or SMS</div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>0430 580 111</div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:enquiries@a1smartdriving.com.au"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <Mail size={18} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Email Enquiries</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  enquiries@a1smartdriving.com.au
                </div>
              </div>
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
            <MapPin size={15} color="var(--color-primary, #1B6C31)" />
            <span>Serving all Metropolitan Adelaide suburbs &amp; DIT Driving Test Hubs</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
        <div>
          &copy; {new Date().getFullYear()} A1 Smart Driving (MB &amp; HB GROUP PTY LTD &middot; ABN 92 662 509 720). All rights reserved.
        </div>
      </footer>
    </div>
  );
}
