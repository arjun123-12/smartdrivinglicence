import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { Calendar, Clock, Car, Award, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await bookingService.getCustomerBookings('upcoming');
        setUpcomingBookings(res?.data || []);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--color-primary), #1e4a91)', color: '#ffffff', marginBottom: '2rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
              SA LEARNER DRIVER HUB
            </span>
            <h1 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '0.25rem' }}>
              Welcome back, {user?.name}!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: 'var(--font-size-sm)' }}>
              Manage your upcoming driving appointments, track logbook preparation, and book official VORT assessments.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/book-lesson" className="button button-accent">
              Book Lesson
            </Link>
            <Link to="/book-test" className="button button-outline-white">
              Book VORT Test
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Upcoming Lessons
            </span>
            <Calendar size={20} color="var(--color-secondary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {upcomingBookings.length}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Confirmed on schedule
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Licence State
            </span>
            <Award size={20} color="var(--color-success)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'capitalize' }}>
            {user?.customer_profile?.licence_type || 'Learner (L-Plate)'}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            South Australia (SA)
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Next Target
            </span>
            <Clock size={20} color="var(--color-accent)" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            Official VORT Assessment
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Aim for 90%+ road law compliance
          </div>
        </div>
      </div>

      {/* Next Upcoming Booking Card */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
          <h3>Next Scheduled Appointment</h3>
          <Link to="/dashboard/bookings" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
            View All ({upcomingBookings.length})
          </Link>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: '2rem' }}>
            <div className="loading-spinner" />
          </div>
        ) : upcomingBookings.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <Calendar size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4>No Upcoming Bookings</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: '1rem' }}>
              You don't have any driving lessons or tests scheduled right now.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link to="/book-lesson" className="button button-primary">
                Book a Driving Lesson
              </Link>
              <Link to="/book-test" className="button button-outline">
                Book a VORT Test
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingBookings.slice(0, 2).map((b) => (
              <div
                key={b.id}
                className="card"
                style={{
                  padding: '1.25rem',
                  borderLeft: '4px solid var(--color-secondary)',
                  backgroundColor: 'var(--color-surface-subtle)',
                }}
              >
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                      {b.service_type?.name} with {b.instructor?.name}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      <strong>Time:</strong> {new Date(b.start_time).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })} @ {new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      <strong>Pickup Address:</strong> {b.pickup_address}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
                      {b.booking_status?.toUpperCase()}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Ref: {b.booking_reference}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Helpful Learner Resources */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>South Australia Learner Driver Checkpoints</h3>
        <div className="grid grid-3" style={{ gap: '1rem', fontSize: 'var(--font-size-sm)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>75 Logbook Hours</strong>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Includes 15 mandatory night hours supervised by a full licence holder.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>5 Slow Speed Manoeuvres</strong>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Angle park, parallel park, 3-point turn, U-turn, and hill start.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Service SA Submission</strong>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Upon passing VORT, submit your Certificate of Competency online or in-branch.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

