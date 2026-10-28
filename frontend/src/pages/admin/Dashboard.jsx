import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import {
  DollarSign,
  CalendarCheck,
  Users,
  UserCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminService.getDashboardStats();
        setData(res);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentBookings = data?.recent_bookings || [];
  const recentLogs = data?.recent_logs || [];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Operations Dashboard</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Live platform metrics, revenue tracking, and dispatch monitoring
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/admin/bookings" className="button button-sm button-secondary">
            Manage Bookings
          </Link>
          <Link to="/admin/instructors" className="button button-sm button-outline">
            Instructors & Hours
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Total Revenue
            </span>
            <DollarSign size={18} color="var(--color-secondary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            ${stats.total_revenue || '0.00'} AUD
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={12} /> This Month: ${stats.month_revenue || '0.00'} AUD
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Upcoming Bookings
            </span>
            <CalendarCheck size={18} color="var(--color-success)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {stats.upcoming_bookings || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Total all-time: {stats.total_bookings || 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Active Instructors
            </span>
            <Users size={18} color="var(--color-secondary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {stats.active_instructors || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Covering Greater Adelaide
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Learners Registered
            </span>
            <UserCheck size={18} color="var(--color-accent)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {stats.registered_customers || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {stats.pending_enquiries || 0} pending contact enquiries
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', gap: '2rem' }}>
        {/* Recent Bookings */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Bookings</h3>
            <Link to="/admin/bookings" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
              View All Bookings <ArrowRight size={12} />
            </Link>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Customer</th>
                  <th>Instructor</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No recent bookings.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700 }}>{b.booking_reference}</td>
                      <td>{b.customer?.name}</td>
                      <td>{b.instructor?.name}</td>
                      <td>{b.service_type?.name}</td>
                      <td>
                        <span className={`badge ${b.booking_status === 'confirmed' ? 'badge-success' : b.booking_status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                          {b.booking_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Feed */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Audit Activity</h3>
            <Link to="/admin/settings" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
              Full Audit Trail <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    {log.action.replaceAll('_', ' ').toUpperCase()}
                  </div>
                  <div style={{ color: 'var(--color-text-muted)' }}>
                    Entity: {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''} | By: {log.user?.name || 'System / Guest'}
                  </div>
                </div>
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'right' }}>
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

