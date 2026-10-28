import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Plus, Edit, CheckCircle, Briefcase } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    default_duration_minutes: 60,
    default_price: 85.0,
    is_test: false,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await adminService.getServices();
      setServices(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      default_duration_minutes: 60,
      default_price: 85.0,
      is_test: false,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (srv) => {
    setEditingId(srv.id);
    setFormData({
      name: srv.name,
      description: srv.description || '',
      default_duration_minutes: srv.default_duration_minutes,
      default_price: srv.default_price,
      is_test: srv.is_test,
      is_active: srv.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminService.updateService(editingId, formData);
        setAlertMsg('Service updated successfully.');
      } else {
        await adminService.createService(formData);
        setAlertMsg('Service created successfully.');
      }
      setModalOpen(false);
      loadServices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Service Catalog & VORT Test Types</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Configure driving lesson types, official VORT tests, default durations, and base pricing
          </p>
        </div>
        <button onClick={openAdd} className="button button-primary">
          <Plus size={16} /> Create Service Type
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Standard Duration</th>
                <th>Default Base Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr key={srv.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{srv.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{srv.description}</div>
                    </td>
                    <td>
                      {srv.is_test ? (
                        <span className="badge badge-warning">Official VORT Test</span>
                      ) : (
                        <span className="badge badge-info">Standard Lesson</span>
                      )}
                    </td>
                    <td>{srv.default_duration_minutes} Minutes</td>
                    <td style={{ fontWeight: 800 }}>${srv.default_price} AUD</td>
                    <td>
                      <span className={`badge ${srv.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {srv.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => openEdit(srv)} className="button button-sm button-outline">
                        <Edit size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3>{editingId ? 'Edit Service' : 'Add Service Type'}</h3>

            <form onSubmit={handleSave} style={{ marginTop: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Service Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Standard Driving Lesson (60 Mins)"
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Duration (Minutes) *</label>
                  <input
                    type="number"
                    step="15"
                    className="form-control"
                    required
                    value={formData.default_duration_minutes}
                    onChange={(e) => setFormData({ ...formData, default_duration_minutes: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Base Price (AUD) *</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    required
                    value={formData.default_price}
                    onChange={(e) => setFormData({ ...formData, default_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_test}
                    onChange={(e) => setFormData({ ...formData, is_test: e.target.checked })}
                  />
                  Is Official VORT Test
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="button button-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="button button-primary">
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

