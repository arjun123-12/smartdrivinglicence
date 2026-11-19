import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import instructorService from '../../services/instructorService';
import {
  Smartphone,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Info
} from 'lucide-react';

export default function InstructorVerifyPhone() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();

  // Query parameter or location state for resuming verification
  const queryPhone = new URLSearchParams(location.search).get('phone') || location.state?.phone || '';
  const initialDebugOtp = location.state?.debug_otp || null;

  const [phone, setPhone] = useState(queryPhone);
  const [otpCode, setOtpCode] = useState(initialDebugOtp ? String(initialDebugOtp) : '');
  const [debugOtp, setDebugOtp] = useState(initialDebugOtp);
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => Math.max(c - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMessage('Please enter your Australian mobile number.');
      return;
    }
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await instructorService.verifyPhone({
        phone: phone.trim(),
        otp_code: otpCode.trim(),
      });

      if (response.token && response.user) {
        setAuthSession(response.user, response.token);
      }

      // Navigate to status screen
      navigate('/instructor/status', {
        replace: true,
        state: { message: response.message || 'Phone verified successfully! Your application is now under review.' },
      });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
        err.response?.data?.errors?.otp_code?.[0] ||
        'Verification failed. Please check the code and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    if (!phone.trim()) {
      setErrorMessage('Please provide your mobile number to resend the code.');
      return;
    }

    setResending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await instructorService.resendOtp({ phone: phone.trim() });
      setSuccessMessage(response.message || 'New verification code sent via SMS.');
      setCooldown(60);
      if (response.debug_otp) {
        setDebugOtp(response.debug_otp);
        setOtpCode(String(response.debug_otp));
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to resend SMS code. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="section flex-center" style={{ minHeight: 'calc(100vh - 160px)', padding: '2.5rem 1rem', background: 'var(--color-bg-secondary, #f8fafc)' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2.25rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(230, 57, 70, 0.1)', color: 'var(--color-primary, #e63946)', margin: '0 auto 0.75rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Smartphone size={26} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem', color: '#0f172a' }}>
            Verify Mobile Number
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Enter the 6-digit verification code sent to your Australian mobile.
          </p>
        </div>

        {debugOtp && (
          <div style={{ padding: '0.75rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '13px', color: '#1e40af' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '2px' }}>
              <Info size={16} /> Local Sandbox SMS Code:
            </div>
            <span>Use test OTP: <strong style={{ letterSpacing: '2px', fontSize: '15px' }}>{debugOtp}</strong> (Logged in Laravel log)</span>
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

        <form onSubmit={handleVerify}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Registered Mobile Number *</label>
            <input
              type="tel"
              className="form-control"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0412 345 678"
            />
            <small style={{ color: '#64748b', fontSize: '11px' }}>
              You can change this if resuming verification from another device.
            </small>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">6-Digit SMS Verification Code *</label>
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
              Code expires in 10 minutes (maximum 5 attempts before lockout)
            </small>
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className="button button-primary"
            style={{ width: '100%', padding: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}
          >
            {loading ? 'Verifying Code...' : 'Verify Phone & Submit Application'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            style={{
              background: 'none',
              border: 'none',
              cursor: cooldown > 0 || resending ? 'not-allowed' : 'pointer',
              color: cooldown > 0 ? '#94a3b8' : 'var(--color-primary, #e63946)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
            }}
          >
            <RefreshCw size={14} className={resending ? 'spin' : ''} />
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend SMS code'}
          </button>

          <Link to="/instructor/login" style={{ color: '#64748b', textDecoration: 'none' }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
