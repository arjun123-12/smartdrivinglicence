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
      if (from) {
        navigate(from, { replace: true });
      } else if (data.user?.is_admin || data.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
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
    <div className="section flex-center" style={{ minHeight: 'calc(100vh - 150px)', padding: '2rem 1rem' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.25rem', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="brand-icon" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', margin: '0 auto 0.75rem auto' }}>
            <LogIn size={22} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Sign In</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Access your SmartDriving lessons, bookings, and profile
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
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: 'var(--font-size-xs)' }}>
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
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button button-primary button-full button-lg"
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Fill Buttons */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
            Quick Demo Login Buttons
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={fillAdmin} className="button button-sm button-outline" style={{ flex: 1 }}>
              <Shield size={14} /> Admin Account
            </button>
            <button type="button" onClick={fillCustomer} className="button button-sm button-outline" style={{ flex: 1 }}>
              <User size={14} /> Learner Account
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

