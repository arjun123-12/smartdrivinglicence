import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Search, UserCheck, Eye, Power, RefreshCw } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewCustomer, setViewCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCustomers({ search });
      setCustomers(data?.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCustomers();
  };

  const handleToggle = async (id) => {
    try {
      await adminService.toggleCustomer(id);
      loadCustomers();
    } catch {
      alert('Could not toggle customer status.');
    }
  };

  const openCustomerView = async (id) => {
    try {
      const data = await adminService.getCustomer(id);
      setViewCustomer(data);
    } catch {
      alert('Could not load customer details.');
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Customer & Learner Registry</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Registered learner drivers, licence details, and booking logs
          </p>
        </div>
        <button onClick={loadCustomers} className="button button-sm button-outline">
          <RefreshCw size={14} /> Refresh Records
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-surface-subtle)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', maxWidth: '500px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search learner name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="button button-primary">
            <Search size={16} /> Search
          </button>
        </form>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact</th>
                <th>Licence Stage</th>
                <th>Suburb</th>
                <th>Bookings Count</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                    No customer accounts found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{c.name}</td>
                    <td>
                      <div>{c.email}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{c.phone || 'No phone'}</div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                        {c.customer_profile?.licence_type || 'Learner'}
                      </span>
                    </td>
                    <td>{c.customer_profile?.suburb || 'Adelaide'}</td>
                    <td style={{ fontWeight: 700 }}>{c.bookings_count} lessons/tests</td>
                    <td>
                      <span className={`badge ${c.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {c.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => openCustomerView(c.id)} className="button button-sm button-outline">
                          <Eye size={14} /> View
                        </button>
                        <button onClick={() => handleToggle(c.id)} className="button button-sm button-outline" title="Toggle Active">
                          <Power size={14} />
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

      {/* Customer View Modal */}
      {viewCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>{viewCustomer.name}</h3>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  {viewCustomer.email} | {viewCustomer.phone}
                </div>
              </div>
              <button onClick={() => setViewCustomer(null)} className="button button-sm button-outline">
                ✕ Close
              </button>
            </div>

            <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--color-surface-subtle)', marginBottom: '1.5rem', fontSize: 'var(--font-size-sm)' }}>
              <div className="grid grid-2">
                <div><strong>Licence Number:</strong> {viewCustomer.customer_profile?.licence_number || 'Not supplied'}</div>
                <div><strong>Licence Type:</strong> {viewCustomer.customer_profile?.licence_type || 'Learner'}</div>
                <div><strong>Residential Address:</strong> {viewCustomer.customer_profile?.address || '—'}</div>
                <div><strong>Emergency Contact:</strong> {viewCustomer.customer_profile?.emergency_contact_name || '—'}</div>
              </div>
            </div>

            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Booking History ({viewCustomer.bookings?.length || 0})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {viewCustomer.bookings?.length === 0 ? (
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>No bookings yet.</div>
              ) : (
                viewCustomer.bookings?.map((b) => (
                  <div key={b.id} style={{ padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-xs)' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{b.service_type?.name} ({b.booking_reference})</div>
                      <div style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(b.start_time).toLocaleString()} with {b.instructor?.name}
                      </div>
                    </div>
                    <span className={`badge ${b.booking_status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                      {b.booking_status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

