import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Shield, AlertCircle, ArrowRight, UserCheck, ArrowLeft } from 'lucide-react';

export default function SecureLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await login({ email, password }, { isSecureLogin: true, require_preview: true });
      // Redirect to the normal homepage so previewer can test the full site
      navigate('/', { replace: true });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.message ||
        'Authentication failed. Please verify your administrator or tester credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setEmail('admin@smartdriving.com.au');
    setPassword('Password123!');
  };

  const fillTester = () => {
    setEmail('tester@smartdriving.com.au');
    setPassword('Password123!');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          background: '#ffffff',
          borderRadius: '16px',
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
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(27, 108, 49, 0.1)',
              color: 'var(--color-primary, #1B6C31)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
            }}
          >
            <Lock size={22} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#0f172a' }}>
            Private Preview Sign In
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            Enter your Administrator or Authorized Tester credentials to preview the website during development.
          </p>
        </div>

        {errorMessage && (
          <div
            className="alert alert-error"
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Authorized Email Address
            </label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smartdriving.com.au"
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button button-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '8px',
            }}
          >
            {loading ? 'Authenticating Preview...' : 'Enter Site Preview'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Fills */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.6rem', textAlign: 'center' }}>
            Quick Demo Fill
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={fillAdmin}
              className="button button-outline button-sm"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px' }}
            >
              <Shield size={12} /> Fill Admin
            </button>
            <button
              type="button"
              onClick={fillTester}
              className="button button-outline button-sm"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px' }}
            >
              <UserCheck size={12} /> Fill Tester
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#64748b',
              fontSize: '0.85rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} /> Back to Under Development page
          </Link>
        </div>
      </div>
    </div>
  );
}
