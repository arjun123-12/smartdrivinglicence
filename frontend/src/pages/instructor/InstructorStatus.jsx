import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import instructorService from '../../services/instructorService';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Car,
  User,
  Shield,
  Upload,
  RefreshCw,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function InstructorStatus() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Resubmission state (used if changes are requested)
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitForm, setResubmitForm] = useState({
    experience_years: '',
    bio: '',
    car_make: '',
    car_model: '',
    car_year: '',
    car_rego: '',
    doc_wwcc: null,
    doc_licence: null,
    doc_permit: null,
    profile_photo: null,
  });

  const loadStatus = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await instructorService.getApplicationStatus();
      setData(response.data);
      if (response.data) {
        setResubmitForm((prev) => ({
          ...prev,
          experience_years: response.data.experience_years || '',
          bio: response.data.bio || '',
          car_make: response.data.car_make || '',
          car_model: response.data.car_model || '',
          car_year: response.data.car_year || '',
          car_rego: response.data.car_rego || '',
        }));
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/instructor/login', { replace: true });
        return;
      }
      setErrorMessage(err.response?.data?.message || 'Could not load your application status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/instructor/login', { replace: true });
      return;
    }
    loadStatus();
  }, [isAuthenticated]);

  const handleResubmitChange = (e) => {
    const { name, value } = e.target;
    setResubmitForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleResubmitFile = (e, field) => {
    const file = e.target.files?.[0] || null;
    setResubmitForm((prev) => ({ ...prev, [field]: file }));
  };

  const handleResubmitSubmit = async (e) => {
    e.preventDefault();
    setResubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const payload = new FormData();
    if (resubmitForm.experience_years) payload.append('experience_years', resubmitForm.experience_years);
    if (resubmitForm.bio) payload.append('bio', resubmitForm.bio);
    if (resubmitForm.car_make) payload.append('car_make', resubmitForm.car_make);
    if (resubmitForm.car_model) payload.append('car_model', resubmitForm.car_model);
    if (resubmitForm.car_year) payload.append('car_year', resubmitForm.car_year);
    if (resubmitForm.car_rego) payload.append('car_rego', resubmitForm.car_rego.toUpperCase());

    if (resubmitForm.doc_wwcc) payload.append('doc_wwcc', resubmitForm.doc_wwcc);
    if (resubmitForm.doc_licence) payload.append('doc_licence', resubmitForm.doc_licence);
    if (resubmitForm.doc_permit) payload.append('doc_permit', resubmitForm.doc_permit);
    if (resubmitForm.profile_photo) payload.append('profile_photo', resubmitForm.profile_photo);

    try {
      const res = await instructorService.resubmitApplication(payload);
      setSuccessMessage(res.message || 'Application resubmitted successfully!');
      await loadStatus();
    } catch (err) {
      const msgs = err.response?.data?.errors;
      if (msgs) {
        setErrorMessage(msgs[Object.keys(msgs)[0]][0]);
      } else {
        setErrorMessage(err.response?.data?.message || 'Failed to resubmit application.');
      }
    } finally {
      setResubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/instructor/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="section flex-center" style={{ minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ color: '#64748b' }}>Checking instructor accreditation status...</p>
        </div>
      </div>
    );
  }

  const status = data?.verification_status || 'pending_review';
  const isApproved = status === 'approved' || status === 'verified';
  const isChangesRequested = status === 'changes_requested';
  const isPendingReview = status === 'pending_review';

  return (
    <div className="section" style={{ padding: '2.5rem 1rem', minHeight: 'calc(100vh - 160px)', background: 'var(--color-bg-secondary, #f8fafc)' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Instructor Application Portal
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Welcome back, {data?.name || user?.name} ({data?.phone || user?.phone})
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="button button-outline button-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            <CheckCircle size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertTriangle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STATUS CARDS */}

        {/* 1. APPROVED */}
        {isApproved && (
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: '6px solid #16a34a' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-success" style={{ fontSize: '12px', padding: '4px 8px' }}>
                    Accredited & Active
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Verified Driving Instructor</span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#166534', margin: '0.25rem 0 0.5rem 0' }}>
                  Congratulations! Your Instructor Account is Approved
                </h2>
                <p style={{ color: '#334155', fontSize: '0.925rem', lineHeight: 1.5, margin: 0 }}>
                  Your WWCC, driving licence, and instructor permit have been thoroughly verified by our compliance team. Your profile is live in the public instructor directory and Adelaide learners can now book lessons and VORT tests with you.
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '1.5rem', paddingTop: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/instructors" className="button button-primary button-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                View Public Profile <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* 2. PENDING REVIEW */}
        {isPendingReview && (
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: '6px solid #eab308' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef9c3', color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge" style={{ background: '#ca8a04', color: '#fff', fontSize: '12px', padding: '4px 8px' }}>
                    Pending Review
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Submitted {data?.created_at ? new Date(data.created_at).toLocaleDateString() : ''}</span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#854d0e', margin: '0.25rem 0 0.5rem 0' }}>
                  Your Application is Currently Under Compliance Review
                </h2>
                <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.5, margin: 0 }}>
                  Thank you for submitting your accreditation documents. Our administration team is reviewing your Working With Children Check, driver licence, and instructor permit. We verify all instructors within <strong>24 to 48 business hours</strong>. You will be notified once review is complete.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>
                Submitted Compliance Checklist:
              </strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: data?.has_doc_wwcc ? '#16a34a' : '#dc2626' }}>
                  <CheckCircle size={15} /> WWCC Document: Uploaded
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: data?.has_doc_licence ? '#16a34a' : '#dc2626' }}>
                  <CheckCircle size={15} /> Driver Licence: Uploaded
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: data?.has_doc_permit ? '#16a34a' : '#dc2626' }}>
                  <CheckCircle size={15} /> Instructor Permit: Uploaded
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CHANGES REQUESTED */}
        {isChangesRequested && (
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: '6px solid #dc2626' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <span className="badge badge-danger" style={{ fontSize: '12px', padding: '4px 8px' }}>
                  Changes Requested by Admin
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#991b1b', margin: '0.25rem 0 0.5rem 0' }}>
                  Action Required: Please Update Your Application Details
                </h2>
                <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.925rem', marginTop: '0.5rem' }}>
                  <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Admin Feedback:</strong>
                  {data?.admin_feedback || 'Please update your accreditation documents or details as requested.'}
                </div>
              </div>
            </div>

            {/* In-place Resubmission Form */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
                Resubmit Updated Details or Documents
              </h3>

              <form onSubmit={handleResubmitSubmit}>
                <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Instruction Experience (Years)</label>
                    <input
                      type="number"
                      name="experience_years"
                      className="form-control"
                      value={resubmitForm.experience_years}
                      onChange={handleResubmitChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vehicle Registration (Rego)</label>
                    <input
                      type="text"
                      name="car_rego"
                      className="form-control"
                      value={resubmitForm.car_rego}
                      onChange={handleResubmitChange}
                    />
                  </div>
                </div>

                <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Vehicle Make</label>
                    <input
                      type="text"
                      name="car_make"
                      className="form-control"
                      value={resubmitForm.car_make}
                      onChange={handleResubmitChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vehicle Model</label>
                    <input
                      type="text"
                      name="car_model"
                      className="form-control"
                      value={resubmitForm.car_model}
                      onChange={handleResubmitChange}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Bio Description</label>
                  <textarea
                    name="bio"
                    rows={3}
                    className="form-control"
                    value={resubmitForm.bio}
                    onChange={handleResubmitChange}
                  />
                </div>

                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                  <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '0.75rem' }}>
                    Replace Documents (Leave blank to keep existing documents):
                  </strong>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>New WWCC Document (PDF, JPG, PNG)</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleResubmitFile(e, 'doc_wwcc')} />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>New Driver Licence Document (PDF, JPG, PNG)</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleResubmitFile(e, 'doc_licence')} />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>New Instructor Permit Document (PDF, JPG, PNG)</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleResubmitFile(e, 'doc_permit')} />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0' }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>New Profile Photo</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => handleResubmitFile(e, 'profile_photo')} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resubmitting}
                  className="button button-primary"
                  style={{ fontWeight: 700, padding: '0.75rem 1.75rem' }}
                >
                  {resubmitting ? 'Resubmitting Application...' : 'Resubmit Application for Review'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Profile & Vehicle Overview Card */}
        {data && (
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
              Your Instructor Details
            </h3>

            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>
                  Vehicle Information
                </strong>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  <div><strong>Car:</strong> {data.car_make} {data.car_model} ({data.car_year})</div>
                  <div><strong>Transmission:</strong> Automatic</div>
                  <div><strong>Registration:</strong> {data.car_rego || 'Provided'}</div>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>
                  Professional Profile
                </strong>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  <div><strong>Experience:</strong> {data.experience_years} years teaching</div>
                  <div><strong>Languages:</strong> {Array.isArray(data.languages) ? data.languages.join(', ') : 'English'}</div>
                </div>
              </div>
            </div>

            {data.bio && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <strong style={{ fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                  Instructor Bio:
                </strong>
                <p style={{ fontSize: '13px', color: '#334155', margin: 0, fontStyle: 'italic' }}>
                  "{data.bio}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
