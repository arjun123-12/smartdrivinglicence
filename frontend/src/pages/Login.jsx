import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Shield, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await login({ email, password });
      const isAdminUser = data.user?.is_admin || data.user?.role === 'admin';
      const isTesterUser = data.user?.is_tester || data.user?.role === 'tester' ||
        (data.user?.email && ['tester@smartdriving.com.au', 'stripetest@smartdriving.com.au'].includes(data.user.email.toLowerCase()));

      if (isAdminUser) {
        if (from && from.startsWith('/admin')) {
          navigate(from, { replace: true });
        } else {
          navigate('/admin', { replace: true });
        }
      } else if (isTesterUser) {
        navigate(from || '/', { replace: true });
      } else {
        if (from && !from.startsWith('/admin')) {
          navigate(from, { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setEmail('admin@smartdriving.com.au');
    setPassword('Password123!');
  };

  const fillCustomer = () => {
    setEmail('learner@smartdriving.com.au');
    setPassword('Password123!');
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
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-muted, #5A6E7F)', fontSize: '0.9rem' }}>
            Sign in to manage your driving lessons, test bookings, and profile
          </p>
        </div>

        {location.search.includes('expired=1') && (
          <div className="alert alert-warning" style={{ fontSize: 'var(--font-size-xs)' }}>
            Your session expired. Please sign in again.
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Email Address</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ borderRadius: '10px', padding: '12px 14px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <div className="flex-between">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-primary, #1B6C31)', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ borderRadius: '10px', padding: '12px 14px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button button-primary button-full button-lg"
            style={{
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '10px',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Fill Buttons */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border, #DCE5DE)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '0.6rem', textAlign: 'center', letterSpacing: '0.05em' }}>
            Quick Demo Login
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={fillAdmin} className="button button-sm button-outline" style={{ flex: 1, fontSize: '12px' }}>
              <Shield size={13} /> Admin
            </button>
            <button type="button" onClick={fillCustomer} className="button button-sm button-outline" style={{ flex: 1, fontSize: '12px' }}>
              <User size={13} /> Learner
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-primary, #1B6C31)' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

