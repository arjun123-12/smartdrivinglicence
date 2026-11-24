import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    suburb: '',
    postcode: '',
    licence_type: 'learner',
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await register(formData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msgs = err.response?.data?.errors;
      if (msgs) {
        const firstKey = Object.keys(msgs)[0];
        setErrorMessage(msgs[firstKey][0]);
      } else {
        setErrorMessage(err.response?.data?.message || 'Registration failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
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
          maxWidth: '520px',
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
            Create Learner Account
          </h1>
          <p style={{ color: 'var(--color-text-muted, #5A6E7F)', fontSize: '0.9rem' }}>
            Join A1 Smart Driving to book lessons, schedule your VORT, and track progress
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Liam Smith"
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Phone *</label>
              <input
                type="tel"
                className="form-control"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0412 345 678"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Adelaide Suburb</label>
              <input
                type="text"
                className="form-control"
                value={formData.suburb}
                onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                placeholder="e.g. Campbelltown"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Postcode</label>
              <input
                type="text"
                className="form-control"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                placeholder="e.g. 5074"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Current Licence Type</label>
            <select
              className="form-select"
              value={formData.licence_type}
              onChange={(e) => setFormData({ ...formData, licence_type: e.target.value })}
            >
              <option value="learner">SA Learner Permit (L-Plate)</option>
              <option value="provisional_1">P1 Provisional</option>
              <option value="international">Overseas / International Licence</option>
            </select>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-control"
                required
                minLength="8"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 8 characters"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className="form-control"
                required
                minLength="8"
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                placeholder="Repeat password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button button-primary button-full button-lg"
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

