import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  XCircle,
  Calendar,
  User,
  CreditCard,
} from 'lucide-react';

export default function BookingCancelled() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference');
  const sessionId = searchParams.get('session_id');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resuming, setResuming] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [error, setError] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      if (!reference) {
        setLoading(false);
        return;
      }
      try {
        const data = await paymentService.getBookingPaymentStatus(reference, sessionId);
        const b = data.booking || data;
        setBooking(b);

        if (b.expires_at) {
          const expTime = new Date(b.expires_at).getTime();
          if (Date.now() > expTime || b.booking_status === 'cancelled') {
            setIsExpired(true);
          }
        }
      } catch (err) {
        console.warn('Cancelled page status error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, [reference, sessionId]);

  const handleResume = async () => {
    if (!reference) return;
    setResuming(true);
    setError(null);
    try {
      const res = await paymentService.resumeStripeCheckoutSession(reference);
      if (res && res.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        throw new Error('Unable to resume checkout session.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'The hold for this slot has expired. Please select a new slot.');
      setIsExpired(true);
      setResuming(false);
    }
  };

  const handleRelease = async () => {
    if (!reference) {
      navigate('/book-lesson');
      return;
    }
    setReleasing(true);
    setError(null);
    try {
      await paymentService.cancelStripeCheckoutSession(reference);
      navigate('/book-lesson');
    } catch (err) {
      // Regardless, go back to booking
      navigate('/book-lesson');
    } finally {
      setReleasing(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-subtle, #f8fafc)', minHeight: '80vh', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              border: '2px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#d97706',
            }}
          >
            <AlertTriangle size={36} />
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-text, #0f172a)', marginBottom: '0.5rem' }}>
            Payment Incomplete
          </h1>
          <p style={{ color: 'var(--color-text-muted, #64748b)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 1.5rem' }}>
            You cancelled or exited the Stripe checkout window.
            {!isExpired && booking ? ' Your appointment slot is temporarily reserved while the checkout session is active.' : ' Your hold has been released.'}
          </p>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          {booking && !isExpired && (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', textAlign: 'left', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Reserved Ref:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary, #1e3a8a)' }}>{booking.booking_reference}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>Service:</span>
                <span style={{ fontWeight: 600 }}>{booking.service_type?.name || 'Driving Lesson'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#64748b' }}>Date & Time:</span>
                <span style={{ fontWeight: 600 }}>
                  {new Date(booking.start_time).toLocaleDateString()} @ {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Total Payable:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary, #1e3a8a)' }}>
                  ${Number(booking.price_snapshot).toFixed(2)} AUD
                </span>
              </div>
            </div>
          )}

          {/* Action options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!isExpired && (
              <button
                type="button"
                onClick={handleResume}
                disabled={resuming || loading}
                className="button button-accent button-full button-lg"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <CreditCard size={18} />
                {resuming ? 'Reopening Stripe Checkout...' : 'Resume Payment Now'}
              </button>
            )}

            <button
              type="button"
              onClick={handleRelease}
              disabled={releasing}
              className="button button-outline button-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <XCircle size={18} />
              {releasing ? 'Releasing slot...' : 'Cancel & Choose Another Slot'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
