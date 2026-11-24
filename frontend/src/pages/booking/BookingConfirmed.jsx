import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import {
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Home,
  Phone,
  Mail,
} from 'lucide-react';

/**
 * Safely format the verified payment amount from the booking record.
 * Handles numbers, numeric strings like "240.00", and currency strings.
 * Formats using Intl.NumberFormat ('en-AU', 'AUD').
 * Returns "Amount unavailable" if missing, invalid, or non-positive.
 */
export function formatPaymentAmount(booking) {
  if (!booking) return 'Amount unavailable';

  const rawCandidate =
    booking.paid_amount ??
    booking.latest_payment?.amount ??
    booking.latestPayment?.amount ??
    booking.amount ??
    booking.price_snapshot;

  if (rawCandidate === null || rawCandidate === undefined || rawCandidate === '') {
    return 'Amount unavailable';
  }

  let numericAmount;
  if (typeof rawCandidate === 'number') {
    numericAmount = rawCandidate;
  } else if (typeof rawCandidate === 'string') {
    const cleaned = rawCandidate.replace(/[^0-9.-]+/g, '');
    numericAmount = cleaned !== '' ? parseFloat(cleaned) : NaN;
  } else {
    numericAmount = NaN;
  }

  if (isNaN(numericAmount) || !isFinite(numericAmount) || numericAmount <= 0) {
    return 'Amount unavailable';
  }

  try {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (err) {
    return `$${numericAmount.toFixed(2)} AUD`;
  }
}

/**
 * Format appointment date using backend display_date or Australia/Adelaide timezone.
 */
export function formatAppointmentDate(booking) {
  if (!booking) return 'Date unavailable';
  if (booking.display_date) {
    return booking.display_date;
  }
  if (!booking.start_time) return 'Date unavailable';

  try {
    const d = new Date(booking.start_time);
    if (isNaN(d.getTime())) return 'Date unavailable';
    return d.toLocaleDateString('en-AU', {
      timeZone: booking.timezone || 'Australia/Adelaide',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return 'Date unavailable';
  }
}

/**
 * Format appointment time range using backend display_time or Australia/Adelaide timezone.
 */
export function formatAppointmentTime(booking) {
  if (!booking) return 'Time unavailable';
  if (booking.display_time) {
    return booking.display_time;
  }
  if (!booking.start_time || !booking.end_time) return 'Time unavailable';

  try {
    const s = new Date(booking.start_time);
    const e = new Date(booking.end_time);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 'Time unavailable';

    const tz = booking.timezone || 'Australia/Adelaide';
    const startStr = s.toLocaleTimeString('en-AU', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const endStr = e.toLocaleTimeString('en-AU', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return `${startStr} - ${endStr}`;
  } catch (e) {
    return 'Time unavailable';
  }
}

/**
 * Resolve instructor name with robust fallback.
 */
export function getInstructorName(booking) {
  if (!booking) return 'Assigned Instructor';
  if (booking.instructor?.name) return booking.instructor.name;
  if (booking.instructor_name) return booking.instructor_name;
  if (typeof booking.instructor === 'string' && booking.instructor.trim() !== '') {
    return booking.instructor;
  }
  return 'Assigned Instructor';
}

export default function BookingConfirmed() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const sessionId = searchParams.get('session_id');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState(null);
  const [pollCount, setPollCount] = useState(0);

  const pollIntervalRef = useRef(null);

  const fetchStatus = async () => {
    if (!reference) {
      setError('No booking reference provided in URL.');
      setLoading(false);
      setIsPolling(false);
      return;
    }

    try {
      const data = await paymentService.getBookingPaymentStatus(reference, sessionId);
      const b = data.booking || data;
      setBooking(b);

      // Webhook has confirmed payment
      if (b.payment_status === 'paid' || b.booking_status === 'confirmed') {
        setIsPolling(false);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      }
    } catch (err) {
      console.warn('Status poll caught error:', err);
      // If error occurs, keep error state if not found
      if (err.response?.status === 404 || err.response?.status === 403) {
        setError(err.response?.data?.message || 'Booking not found or access denied.');
        setIsPolling(false);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Poll every 2.5 seconds to wait for webhook confirmation
    pollIntervalRef.current = setInterval(() => {
      setPollCount((prev) => {
        if (prev >= 25) {
          // Stop polling after ~60s
          clearInterval(pollIntervalRef.current);
          setIsPolling(false);
          return prev;
        }
        fetchStatus();
        return prev + 1;
      });
    }, 2500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [reference, sessionId]);

  const isConfirmed = booking && (booking.payment_status === 'paid' || booking.booking_status === 'confirmed');

  return (
    <div style={{ backgroundColor: 'var(--color-bg-subtle, #f8fafc)', minHeight: '80vh', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Loading / Awaiting Webhook Confirmation State */}
        {loading || (isPolling && !isConfirmed) ? (
          <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 1.5rem',
                border: '4px solid #e2e8f0',
                borderTop: '4px solid var(--color-primary, #1e3a8a)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text, #0f172a)', marginBottom: '0.5rem' }}>
              Confirming Payment...
            </h2>
            <p style={{ color: 'var(--color-text-muted, #64748b)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
              We received your payment attempt from Stripe. We are awaiting the cryptographically signed webhook to securely lock your appointment into the schedule.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary, #1e3a8a)', fontSize: '0.875rem' }}>
              <RefreshCw size={16} className="animate-spin" /> Verifying with Stripe Sandbox...
            </div>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              .animate-spin { animation: spin 1.5s linear infinite; }
            `}</style>
          </div>
        ) : error ? (
          /* Error State */
          <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.5rem' }}>
              Unable to Verify Booking
            </h2>
            <p style={{ color: 'var(--color-text-muted, #64748b)', marginBottom: '1.5rem' }}>{error}</p>
            <Link to="/book-lesson" className="button button-primary">
              Return to Booking
            </Link>
          </div>
        ) : isConfirmed ? (
          /* Successfully Confirmed by Signed Webhook */
          <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                border: '2px solid #22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: '#16a34a',
              }}
            >
              <CheckCircle size={36} />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <ShieldCheck size={16} /> Stripe Payment Verified
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text, #0f172a)' }}>
                Booking Confirmed!
              </h1>
              <p style={{ color: 'var(--color-text-muted, #64748b)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Your appointment is locked in. A confirmation email has been dispatched.
              </p>
            </div>

            {/* Reference Badge */}
            <div
              style={{
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                border: '1px dashed #cbd5e1',
              }}
            >
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
                Booking Reference
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary, #1e3a8a)', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                {booking.booking_reference}
              </div>
            </div>

            {/* Booking Details Table */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#334155' }}>
                Appointment Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} /> Date:
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {formatAppointmentDate(booking)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} /> Time:
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {formatAppointmentTime(booking)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} /> Instructor:
                  </span>
                  <span style={{ fontWeight: 600 }}>{getInstructorName(booking)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} /> Pickup Address:
                  </span>
                  <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '250px' }}>
                    {booking.pickup_address || 'To be confirmed'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #e2e8f0', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <span style={{ color: '#334155', fontWeight: 700 }}>Total Paid (AUD):</span>
                  <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '1.1rem' }}>
                    {formatPaymentAmount(booking)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link to="/dashboard/bookings" className="button button-primary button-full" style={{ flex: 1 }}>
                View in Dashboard <ArrowRight size={16} />
              </Link>
              <Link to="/book-lesson" className="button button-outline" style={{ flex: 1 }}>
                Book Another Lesson
              </Link>
            </div>
          </div>
        ) : (
          /* Session Pending or Timed Out without confirmation yet */
          <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <Clock size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#b45309', marginBottom: '0.5rem' }}>
              Payment Still Processing
            </h2>
            <p style={{ color: 'var(--color-text-muted, #64748b)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Your payment for booking <strong>{reference}</strong> is being processed by Stripe. If you just completed checkout, your confirmation email will arrive shortly once the bank transfer completes.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button type="button" onClick={() => fetchStatus()} className="button button-primary">
                <RefreshCw size={16} /> Check Status Again
              </button>
              <Link to="/" className="button button-outline">
                <Home size={16} /> Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
