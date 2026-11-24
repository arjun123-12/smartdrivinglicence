import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'radial-gradient(circle at 50% 15%, rgba(27, 108, 49, 0.08) 0%, #F8FAF8 70%)',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '2.5rem',
          borderRadius: '20px',
          boxShadow: '0 20px 45px rgba(13, 38, 69, 0.08)',
          border: '1px solid var(--color-border, #DCE5DE)',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
            <img
              src="/logo.png"
              alt="A1 Smart Driving"
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-secondary, #0D2645)', marginBottom: '0.35rem' }}>
            Reset Password
          </h1>
          <p style={{ color: 'var(--color-text-muted, #5A6E7F)', fontSize: '0.9rem' }}>
            Enter your account email to receive reset instructions
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <CheckCircle size={28} />
            </div>
            <h4>Check Your Email</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: '0.5rem 0 1.5rem 0' }}>
              If an account matches <strong>{email}</strong>, a password reset link has been dispatched.
            </p>
            <Link to="/login" className="button button-outline button-full">
              <ArrowLeft size={16} /> Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <button type="submit" className="button button-primary button-full button-lg" style={{ marginTop: '1rem' }}>
              Send Reset Link
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/login" style={{ fontSize: 'var(--font-size-sm)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

