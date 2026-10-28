import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Search, Filter, Calendar, Clock, Edit, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [editingBooking, setEditingBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Reschedule modal
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const [rescheduleStartTime, setRescheduleStartTime] = useState('');
  const [rescheduleEndTime, setRescheduleEndTime] = useState('');
  const [rescheduling, setRescheduling] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    setLoading(true);
    setAlertMsg('');
    try {
      const data = await adminService.getBookings({ status: statusFilter, search });
      setBookings(data?.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadBookings();
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;
    setUpdatingStatus(true);
    try {
      await adminService.updateBookingStatus(editingBooking.id, {
        booking_status: newStatus,
        notes: statusNotes,
      });
      setAlertMsg(`Booking ${editingBooking.booking_reference} status changed to ${newStatus}.`);
      setEditingBooking(null);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!reschedulingBooking) return;
    setRescheduling(true);
    try {
      await adminService.rescheduleBooking(reschedulingBooking.id, {
        start_time: rescheduleStartTime,
        end_time: rescheduleEndTime,
      });
      setAlertMsg(`Booking ${reschedulingBooking.booking_reference} rescheduled successfully.`);
      setReschedulingBooking(null);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Conflict: Slot unavailable for this instructor.');
    } finally {
      setRescheduling(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Booking Management</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Dispatch, reschedule, and manage learner driving lessons and VORT tests
          </p>
        </div>
        <button onClick={loadBookings} className="button button-sm button-outline">
          <RefreshCw size={14} /> Refresh Records
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-surface-subtle)' }}>
        <form onSubmit={handleSearchSubmit} className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search reference, customer name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="button button-primary">
              <Search size={16} /> Search
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending Payment</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Learner</th>
                <th>Service Type</th>
                <th>Instructor</th>
                <th>Date & Time</th>
                <th>Pickup Location</th>
                <th>Price & Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      {b.booking_reference}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.customer?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{b.customer?.email}</div>
                    </td>
                    <td>{b.service_type?.name}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.instructor?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{b.instructor?.car_model}</div>
                    </td>
                    <td>
                      <div>{new Date(b.start_time).toLocaleDateString()}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-xs)', maxWidth: '200px' }}>
                      {b.pickup_address}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>${b.price_snapshot} AUD</div>
                      <span className={`badge ${b.booking_status === 'confirmed' ? 'badge-success' : b.booking_status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                        {b.booking_status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => {
                            setEditingBooking(b);
                            setNewStatus(b.booking_status);
                            setStatusNotes(b.notes || '');
                          }}
                          className="button button-sm button-outline"
                          title="Change Status"
                        >
                          Status
                        </button>
                        <button
                          onClick={() => {
                            setReschedulingBooking(b);
                            setRescheduleStartTime(b.start_time.replace(' ', 'T').slice(0, 16));
                            setRescheduleEndTime(b.end_time.replace(' ', 'T').slice(0, 16));
                          }}
                          className="button button-sm button-outline"
                          title="Reschedule Date/Time"
                        >
                          Reschedule
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {editingBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <h3>Update Booking Status</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Ref: <strong>{editingBooking.booking_reference}</strong> ({editingBooking.customer?.name})
            </p>

            <form onSubmit={handleStatusSubmit}>
              <div className="form-group">
                <label className="form-label">Select New Status</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending Payment</option>
                  <option value="confirmed">Confirmed / Paid</option>
                  <option value="in_progress">In Progress / Active</option>
                  <option value="completed">Completed / Passed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Internal Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Notes from examiner or instructor scorecard..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingBooking(null)} className="button button-outline">
                  Cancel
                </button>
                <button type="submit" disabled={updatingStatus} className="button button-primary">
                  {updatingStatus ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <h3>Reschedule Appointment</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Ref: <strong>{reschedulingBooking.booking_reference}</strong> (Instructor: {reschedulingBooking.instructor?.name})
            </p>

            <form onSubmit={handleRescheduleSubmit}>
              <div className="form-group">
                <label className="form-label">New Start Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  required
                  value={rescheduleStartTime}
                  onChange={(e) => setRescheduleStartTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New End Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  required
                  value={rescheduleEndTime}
                  onChange={(e) => setRescheduleEndTime(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setReschedulingBooking(null)} className="button button-outline">
                  Cancel
                </button>
                <button type="submit" disabled={rescheduling} className="button button-primary">
                  {rescheduling ? 'Checking Slot...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

