import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Star, CheckCircle, Trash2, Power, Plus } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    suburb: '',
    rating: 5,
    feedback: '',
    test_type: 'VORT Test Passed First Go',
    instructor_name: 'Marcus Vance',
    is_approved: true,
  });
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const data = await adminService.getTestimonials();
      setTestimonials(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await adminService.toggleTestimonial(id);
      loadTestimonials();
    } catch {
      alert('Could not toggle approval status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await adminService.deleteTestimonial(id);
      setAlertMsg('Testimonial removed.');
      loadTestimonials();
    } catch {
      alert('Could not delete testimonial.');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.createTestimonial(formData);
      setAlertMsg('Testimonial added successfully.');
      setModalOpen(false);
      loadTestimonials();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save review.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Student Testimonial Moderation</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Moderate learner reviews, test pass success stories, and website social proof
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="button button-primary">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      <div className="grid grid-3">
        {testimonials.map((t) => (
          <div key={t.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" />
                ))}
              </div>
              <span className={`badge ${t.is_approved ? 'badge-success' : 'badge-warning'}`}>
                {t.is_approved ? 'Published' : 'Pending'}
              </span>
            </div>

            <p style={{ fontSize: 'var(--font-size-sm)', fontStyle: 'italic', color: 'var(--color-text)', flex: 1, marginBottom: '1rem' }}>
              "{t.feedback}"
            </p>

            <div style={{ fontSize: 'var(--font-size-xs)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700 }}>{t.name} ({t.suburb}, SA)</div>
              <div style={{ color: 'var(--color-text-muted)' }}>{t.test_type} | {t.instructor_name}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleToggle(t.id)}
                className={`button button-sm ${t.is_approved ? 'button-outline' : 'button-secondary'}`}
              >
                {t.is_approved ? 'Unpublish' : 'Approve & Publish'}
              </button>
              <button onClick={() => handleDelete(t.id)} className="button button-sm button-outline" style={{ color: 'var(--color-error)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3>Add Student Testimonial</h3>

            <form onSubmit={handleCreate} style={{ marginTop: '1.25rem' }}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Student Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Suburb *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.suburb}
                    onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Test Result Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.test_type}
                    onChange={(e) => setFormData({ ...formData, test_type: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Star Rating (1-5)</label>
                  <select
                    className="form-select"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Student Feedback *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  required
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="button button-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="button button-primary">
                  {saving ? 'Saving...' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

