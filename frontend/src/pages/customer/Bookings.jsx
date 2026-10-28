import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import { Calendar, Clock, MapPin, Car, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function CustomerBookings() {
  const [tab, setTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadBookings();
  }, [tab]);

  const loadBookings = async () => {
    setLoading(true);
    setAlertMsg('');
    try {
      const data = await bookingService.getCustomerBookings(tab);
      setBookings(data?.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    if (!cancelModalBooking || !cancelReason) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(cancelModalBooking.id, cancelReason);
      setAlertMsg('Your booking has been cancelled.');
      setCancelModalBooking(null);
      setCancelReason('');
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>My Bookings & Lessons</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            View your upcoming driving sessions, review instructor notes, and manage schedule
          </p>
        </div>
        <Link to="/book-lesson" className="button button-primary">
          Book Another Lesson
        </Link>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
        <button
          className={`button ${tab === 'upcoming' ? 'button-primary' : 'button-outline'}`}
          onClick={() => setTab('upcoming')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}
        >
          Upcoming Bookings
        </button>
        <button
          className={`button ${tab === 'past' ? 'button-primary' : 'button-outline'}`}
          onClick={() => setTab('past')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}
        >
          Past Lessons & Tests
        </button>
        <button
          className={`button ${tab === 'all' ? 'button-primary' : 'button-outline'}`}
          onClick={() => setTab('all')}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}
        >
          All Records
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '300px' }}>
          <div className="loading-spinner" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
          <h3>No Bookings Found in This View</h3>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            {tab === 'upcoming'
              ? "You don't have any upcoming lessons booked. Reserve your next practice or test session today."
              : 'No past booking records found.'}
          </p>
          <Link to="/book-lesson" className="button button-primary">
            Schedule a Lesson Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {bookings.map((booking) => {
            const isCancelled = booking.booking_status === 'cancelled';
            const isCompleted = booking.booking_status === 'completed';
            const isConfirmed = booking.booking_status === 'confirmed';

            return (
              <div key={booking.id} className="card" style={{ padding: '1.5rem' }}>
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                      Reference: {booking.booking_reference}
                    </span>
                    <h3 style={{ fontSize: '1.35rem', margin: '0.25rem 0 0 0', color: 'var(--color-primary)' }}>
                      {booking.service_type?.name}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {isConfirmed && <span className="badge badge-success">Confirmed</span>}
                    {isCancelled && <span className="badge badge-danger">Cancelled</span>}
                    {isCompleted && <span className="badge badge-info">Completed</span>}
                    {booking.payment_status === 'paid' && <span className="badge badge-success">Paid (${booking.price_snapshot} AUD)</span>}
                  </div>
                </div>

                <div className="grid grid-3" style={{ fontSize: 'var(--font-size-sm)', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>DATE & TIME</div>
                    <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>
                      {new Date(booking.start_time).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div>
                      {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>INSTRUCTOR</div>
                    <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{booking.instructor?.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {booking.instructor?.car_model} ({booking.instructor?.car_transmission?.toUpperCase()})
                    </div>
                  </div>

                  <div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>MEETING / PICKUP ADDRESS</div>
                    <div style={{ fontWeight: 600, marginTop: '0.2rem' }}>{booking.pickup_address}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {booking.location?.name}
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div style={{ fontSize: 'var(--font-size-xs)', backgroundColor: 'var(--color-surface-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                    <strong>Your Notes:</strong> {booking.notes}
                  </div>
                )}

                {/* Actions */}
                {isConfirmed && new Date(booking.start_time) > new Date() && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                    <button
                      onClick={() => setCancelModalBooking(booking)}
                      className="button button-sm button-outline"
                      style={{ color: 'var(--color-error)' }}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
            <h3 style={{ color: 'var(--color-error)', marginBottom: '0.5rem' }}>Cancel Driving Appointment?</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Are you sure you want to cancel booking <strong>{cancelModalBooking.booking_reference}</strong>? Per policy, free cancellation requires 24 hours notice.
            </p>

            <form onSubmit={handleCancel}>
              <div className="form-group">
                <label className="form-label">Reason for cancellation *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Work schedule conflict, illness, etc."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setCancelModalBooking(null)} className="button button-outline">
                  Keep Booking
                </button>
                <button type="submit" disabled={cancelling} className="button button-danger">
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

