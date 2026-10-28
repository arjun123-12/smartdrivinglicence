import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Plus, Edit, Trash2, CheckCircle, Package } from 'lucide-react';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    lesson_hours: 5,
    lesson_count: 5,
    original_price: 425,
    current_price: 399,
    includes_vort: false,
    includes_pickup: true,
    is_featured: false,
    is_active: true,
    features: [{ feature_text: '', is_highlighted: false }],
  });
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPackages();
      setPackages(data);
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
      short_description: '',
      lesson_hours: 5,
      lesson_count: 5,
      original_price: 425,
      current_price: 399,
      includes_vort: false,
      includes_pickup: true,
      is_featured: false,
      is_active: true,
      features: [
        { feature_text: '5 x 60-minute one-on-one lessons', is_highlighted: true },
        { feature_text: 'Home or school pickup included', is_highlighted: false },
      ],
    });
    setModalOpen(true);
  };

  const openEdit = (pkg) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      short_description: pkg.short_description || '',
      lesson_hours: pkg.lesson_hours,
      lesson_count: pkg.lesson_count,
      original_price: pkg.original_price || '',
      current_price: pkg.current_price,
      includes_vort: pkg.includes_vort,
      includes_pickup: pkg.includes_pickup,
      is_featured: pkg.is_featured,
      is_active: pkg.is_active,
      features: pkg.features?.map((f) => ({ feature_text: f.feature_text, is_highlighted: f.is_highlighted })) || [],
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await adminService.deletePackage(id);
      setAlertMsg('Package deleted.');
      loadPackages();
    } catch {
      alert('Could not delete package.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminService.updatePackage(editingId, formData);
        setAlertMsg('Package updated.');
      } else {
        await adminService.createPackage(formData);
        setAlertMsg('New package created.');
      }
      setModalOpen(false);
      loadPackages();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save package.');
    } finally {
      setSaving(false);
    }
  };

  const addFeatureRow = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { feature_text: '', is_highlighted: false }],
    });
  };

  const updateFeatureRow = (index, text, highlighted) => {
    const updated = [...formData.features];
    updated[index] = { feature_text: text, is_highlighted: highlighted };
    setFormData({ ...formData, features: updated });
  };

  const removeFeatureRow = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Lesson Packages & Bundles</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Configure multi-lesson discounts, VORT test bundles, and marketing highlights
          </p>
        </div>
        <button onClick={openAdd} className="button button-primary">
          <Plus size={16} /> Create Package
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      <div className="grid grid-2">
        {packages.map((pkg) => (
          <div key={pkg.id} className="card" style={{ padding: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>{pkg.name}</h3>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  {pkg.lesson_hours} Hours Total | {pkg.lesson_count} Lessons
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ${pkg.current_price} AUD
                </div>
                {pkg.original_price && (
                  <div style={{ fontSize: 'var(--font-size-xs)', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                    ${pkg.original_price}
                  </div>
                )}
              </div>
            </div>

            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text)', marginBottom: '1rem' }}>
              {pkg.short_description}
            </p>

            <div style={{ fontSize: 'var(--font-size-xs)', marginBottom: '1rem' }}>
              <strong>Inclusions:</strong>
              <ul style={{ margin: '0.25rem 0', paddingLeft: '1.25rem' }}>
                {pkg.features?.map((f, i) => (
                  <li key={i}>{f.feature_text}</li>
                ))}
              </ul>
            </div>

            <div className="flex-between" style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
              <div>
                {pkg.includes_vort && <span className="badge badge-success" style={{ marginRight: '0.5rem' }}>Includes VORT</span>}
                {pkg.is_featured && <span className="badge badge-warning">Featured</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(pkg)} className="button button-sm button-outline">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(pkg.id)} className="button button-sm button-outline" style={{ color: 'var(--color-error)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Package Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h3>{editingId ? 'Edit Package' : 'Create Lesson Package'}</h3>

            <form onSubmit={handleSave} style={{ marginTop: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Package Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kickstarter 5-Hour Package"
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Total Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    required
                    value={formData.lesson_hours}
                    onChange={(e) => setFormData({ ...formData, lesson_hours: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Lesson Count</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={formData.lesson_count}
                    onChange={(e) => setFormData({ ...formData, lesson_count: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Regular Price (AUD)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Discounted Package Price (AUD) *</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={formData.current_price}
                    onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.includes_vort}
                    onChange={(e) => setFormData({ ...formData, includes_vort: e.target.checked })}
                  />
                  Includes VORT Test
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  />
                  Featured Package
                </label>
              </div>

              {/* Features list builder */}
              <div style={{ marginTop: '1rem' }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Bullet Features</label>
                  <button type="button" onClick={addFeatureRow} className="button button-sm button-outline">
                    + Add Feature
                  </button>
                </div>

                {formData.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      value={feat.feature_text}
                      onChange={(e) => updateFeatureRow(idx, e.target.value, feat.is_highlighted)}
                      placeholder="e.g. Home or school pickup included"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeatureRow(idx)}
                      className="button button-sm button-outline"
                      style={{ color: 'var(--color-error)' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="button button-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="button button-primary">
                  {saving ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

