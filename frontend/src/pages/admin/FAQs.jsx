import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Plus, Edit, Trash2, CheckCircle, HelpCircle } from 'lucide-react';

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: 'vort',
    question: '',
    answer: '',
    display_order: 1,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getFaqs();
      setFaqs(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      category: 'vort',
      question: '',
      answer: '',
      display_order: faqs.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (faq) => {
    setEditingId(faq.id);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
      is_active: faq.is_active,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ entry?')) return;
    try {
      await adminService.deleteFaq(id);
      setAlertMsg('FAQ deleted.');
      loadFaqs();
    } catch {
      alert('Could not delete FAQ.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await adminService.updateFaq(editingId, formData);
        setAlertMsg('FAQ updated.');
      } else {
        await adminService.createFaq(formData);
        setAlertMsg('New FAQ created.');
      }
      setModalOpen(false);
      loadFaqs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save FAQ.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Frequently Asked Questions Moderation</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Manage learner questions, South Australian licensing rules, and VORT test requirements
          </p>
        </div>
        <button onClick={openAdd} className="button button-primary">
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq) => (
          <div key={faq.id} className="card" style={{ padding: '1.25rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-info" style={{ textTransform: 'uppercase' }}>{faq.category}</span>
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-primary)' }}>{faq.question}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => openEdit(faq)} className="button button-sm button-outline">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(faq.id)} className="button button-sm button-outline" style={{ color: 'var(--color-error)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '2rem' }}>
            <h3>{editingId ? 'Edit FAQ' : 'Add FAQ'}</h3>

            <form onSubmit={handleSave} style={{ marginTop: '1.25rem' }}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="vort">VORT Testing</option>
                    <option value="lessons">Driving Lessons</option>
                    <option value="packages">Packages & Pricing</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Question *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Answer *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="button button-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="button button-primary">
                  {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

