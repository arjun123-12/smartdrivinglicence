import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import bookingService from '../../services/bookingService';
import { Plus, Edit, CheckCircle, Shield, Award, Power, RefreshCw } from 'lucide-react';

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    is_examiner: false,
    examiner_accreditation_no: '',
    car_transmission: 'auto',
    car_model: 'Toyota Corolla Hybrid',
    car_year: '2023',
    base_hourly_rate: 85.0,
    vort_test_rate: 240.0,
    location_ids: [],
  });
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [insts, locs] = await Promise.all([
        adminService.getInstructors(),
        bookingService.getLocations(),
      ]);
      setInstructors(insts);
      setLocations(locs);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminService.toggleInstructor(id);
      loadData();
    } catch {
      alert('Could not toggle instructor status.');
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      bio: '',
      is_examiner: false,
      examiner_accreditation_no: '',
      car_transmission: 'auto',
      car_model: 'Toyota Corolla Hybrid',
      car_year: '2023',
      base_hourly_rate: 85.0,
      vort_test_rate: 240.0,
      location_ids: [1, 2],
    });
    setModalOpen(true);
  };

  const openEdit = (inst) => {
    setEditingId(inst.id);
    setFormData({
      name: inst.name,
      email: inst.email,
      phone: inst.phone,
      bio: inst.bio || '',
      is_examiner: inst.is_examiner,
      examiner_accreditation_no: inst.examiner_accreditation_no || '',
      car_transmission: inst.car_transmission,
      car_model: inst.car_model || 'Toyota Corolla Hybrid',
      car_year: inst.car_year || '2023',
      base_hourly_rate: inst.base_hourly_rate,
      vort_test_rate: inst.vort_test_rate,
      location_ids: inst.locations?.map((l) => l.id) || [],
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminService.updateInstructor(editingId, formData);
        setAlertMsg('Instructor details updated successfully.');
      } else {
        await adminService.createInstructor(formData);
        setAlertMsg('New instructor created successfully.');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save instructor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Instructor & Examiner Network</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Manage driver trainer accreditations, examiner status, vehicle fleets, and hourly rates
          </p>
        </div>
        <button onClick={openAdd} className="button button-primary">
          <Plus size={16} /> Add Instructor / Examiner
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
                <th>Instructor / Examiner</th>
                <th>Accreditation & Role</th>
                <th>Vehicle & Transmission</th>
                <th>Rates (AUD)</th>
                <th>Suburbs Covered</th>
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
              ) : instructors.map((inst) => (
                <tr key={inst.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={inst.profile_image}
                        alt={inst.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{inst.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{inst.email} | {inst.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {inst.is_examiner ? (
                      <div>
                        <span className="badge badge-success">VORT Examiner</span>
                        {inst.examiner_accreditation_no && (
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            Accreditation #{inst.examiner_accreditation_no}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="badge badge-info">Driving Instructor</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inst.car_model}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {inst.car_transmission?.toUpperCase()} {inst.car_dual_controls ? '(Dual Controls)' : ''}
                    </div>
                  </td>
                  <td>
                    <div><strong>Lesson:</strong> ${inst.base_hourly_rate}/hr</div>
                    {inst.vort_test_rate > 0 && (
                      <div style={{ fontSize: '11px', color: 'var(--color-secondary)' }}>
                        <strong>VORT:</strong> ${inst.vort_test_rate}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: 'var(--font-size-xs)' }}>
                    {inst.locations?.map((l) => l.name).join(', ') || 'Metropolitan Adelaide'}
                  </td>
                  <td>
                    <span className={`badge ${inst.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {inst.is_active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(inst)} className="button button-sm button-outline">
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleToggle(inst.id)}
                        className={`button button-sm ${inst.is_active ? 'button-outline' : 'button-secondary'}`}
                        title="Toggle Active Status"
                      >
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3>{editingId ? 'Edit Instructor' : 'Add New Instructor / Examiner'}</h3>

            <form onSubmit={handleSave} style={{ marginTop: '1.25rem' }}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hourly Lesson Rate (AUD) *</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    required
                    value={formData.base_hourly_rate}
                    onChange={(e) => setFormData({ ...formData, base_hourly_rate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', height: '42px', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={formData.is_examiner}
                      onChange={(e) => setFormData({ ...formData, is_examiner: e.target.checked })}
                    />
                    Authorised VORT Examiner
                  </label>
                </div>
                {formData.is_examiner && (
                  <div className="form-group">
                    <label className="form-label">Examiner Accreditation No</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.examiner_accreditation_no}
                      onChange={(e) => setFormData({ ...formData, examiner_accreditation_no: e.target.value })}
                      placeholder="e.g. SA-EX-9921"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-3">
                <div className="form-group">
                  <label className="form-label">Vehicle Transmission</label>
                  <select
                    className="form-select"
                    value={formData.car_transmission}
                    onChange={(e) => setFormData({ ...formData, car_transmission: e.target.value })}
                  >
                    <option value="auto">Automatic</option>
                    <option value="manual">Manual</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Car Model</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.car_model}
                    onChange={(e) => setFormData({ ...formData, car_model: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">VORT Rate (AUD)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.vort_test_rate}
                    onChange={(e) => setFormData({ ...formData, vort_test_rate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instructor Bio</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="button button-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="button button-primary">
                  {saving ? 'Saving...' : 'Save Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

