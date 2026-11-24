import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import instructorService from '../../services/instructorService';
import {
  Smartphone,
  Lock,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Info,
  Car
} from 'lucide-react';

export default function InstructorLogin() {
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();

  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [debugOtp, setDebugOtp] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => Math.max(c - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMessage('Please enter your registered Australian mobile number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await instructorService.sendLoginOtp({ phone: phone.trim() });
      setSuccessMessage(response.message || 'Verification code sent to your mobile.');
      setCooldown(60);
      if (response.debug_otp) {
        setDebugOtp(response.debug_otp);
        setOtpCode(String(response.debug_otp));
      }
      setStep(2);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data?.errors?.phone?.[0] ||
        'Could not send OTP. Please check your mobile number or sign up.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await instructorService.verifyLoginOtp({
        phone: phone.trim(),
        otp_code: otpCode.trim(),
      });

      if (response.token && response.user) {
        setAuthSession(response.user, response.token);
      }

      // If approved, or pending/changes_requested, route to status
      navigate('/instructor/status', {
        replace: true,
        state: { message: response.message },
      });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data?.errors?.otp_code?.[0] ||
        'Failed to verify code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await instructorService.sendLoginOtp({ phone: phone.trim() });
      setSuccessMessage(response.message || 'New login code sent.');
      setCooldown(60);
      if (response.debug_otp) {
        setDebugOtp(response.debug_otp);
        setOtpCode(String(response.debug_otp));
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not resend code.');
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
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--color-primary-light, #EBF5EE)',
              color: 'var(--color-primary, #1B6C31)',
              margin: '0 auto 0.75rem auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Car size={26} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', color: '#0f172a' }}>
            Instructor Portal Login
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Passwordless, secure SMS OTP login for registered driving instructors and examiners
          </p>
        </div>

        {debugOtp && (
          <div style={{ padding: '0.75rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '13px', color: '#1e40af' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '2px' }}>
              <Info size={16} /> Sandbox Test SMS Code:
            </div>
            <span>Use OTP: <strong style={{ letterSpacing: '2px', fontSize: '15px' }}>{debugOtp}</strong></span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
            <ShieldCheck size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Registered Mobile Number *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  className="form-control"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0412 345 678"
                  autoFocus
                />
              </div>
              <small style={{ color: '#64748b', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                Format: 04xx xxx xxx or +61 4xx xxx xxx
              </small>
            </div>

            <button
              type="submit"
              disabled={loading || !phone.trim()}
              className="button button-primary"
              style={{ width: '100%', padding: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? 'Sending SMS Code...' : 'Send Login Code via SMS'}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: '1rem', padding: '0.6rem 0.75rem', background: '#f1f5f9', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <span style={{ color: '#475569' }}>Sending code to: <strong>{phone}</strong></span>
              <button
                type="button"
                onClick={() => { setStep(1); setOtpCode(''); setDebugOtp(null); }}
                style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
              >
                Change
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Enter 6-Digit SMS Code *</label>
              <input
                type="text"
                maxLength={6}
                className="form-control"
                required
                style={{
                  fontSize: '1.5rem',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="••••••"
                autoFocus
              />
              <small style={{ color: '#64748b', fontSize: '11px', display: 'block', textAlign: 'center', marginTop: '4px' }}>
                Valid for 10 minutes (maximum 5 attempts)
              </small>
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="button button-primary"
              style={{ width: '100%', padding: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}
            >
              {loading ? 'Logging In...' : 'Verify & Sign In'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: cooldown > 0 || loading ? 'not-allowed' : 'pointer',
                  color: cooldown > 0 ? '#94a3b8' : 'var(--color-primary, #1B6C31)',
                  fontWeight: 600,
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RefreshCw size={13} className={loading ? 'spin' : ''} />
                {cooldown > 0 ? `Resend SMS in ${cooldown}s` : 'Resend SMS code'}
              </button>
            </div>
          </form>
        )}

        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          <div>
            Want to teach with us?{' '}
            <Link to="/instructor/signup" style={{ color: 'var(--color-primary, #1B6C31)', fontWeight: 700 }}>
              Apply as Instructor
            </Link>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            Looking for customer login?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>
              Learner / Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
