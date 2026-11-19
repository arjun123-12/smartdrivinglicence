import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import bookingService from '../../services/bookingService';
import api from '../../services/api';
import { extractArray, safeArray } from '../../utils/apiHelpers';
import { mockInstructors, mockLocations } from '../../services/mockData';
import {
  Plus,
  Edit,
  CheckCircle,
  Shield,
  Award,
  Power,
  RefreshCw,
  FileText,
  Clock,
  AlertTriangle,
  ExternalLink,
  Eye,
  Check,
  X,
  Car
} from 'lucide-react';

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending_review', 'approved', 'changes_requested'

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

  // Application Review Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [requestingChanges, setRequestingChanges] = useState(false);
  const [changeReason, setChangeReason] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        adminService.getInstructors(),
        bookingService.getLocations(),
      ]);

      const insts = results[0].status === 'fulfilled' ? extractArray(results[0].value, mockInstructors) : mockInstructors;
      const locs = results[1].status === 'fulfilled' ? extractArray(results[1].value, mockLocations) : mockLocations;

      setInstructors(insts);
      setLocations(locs);
    } catch (err) {
      console.warn('AdminInstructors load caught error, using fallbacks:', err);
      setInstructors(mockInstructors);
      setLocations(mockLocations);
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
      car_transmission: inst.car_transmission || 'auto',
      car_model: inst.car_model || 'Toyota Corolla Hybrid',
      car_year: inst.car_year || '2023',
      base_hourly_rate: inst.base_hourly_rate,
      vort_test_rate: inst.vort_test_rate,
      location_ids: safeArray(inst.locations).map((l) => l.id),
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

  // Open Application Review Modal
  const openReviewModal = async (inst) => {
    setReviewLoading(true);
    setReviewModalOpen(true);
    setRequestingChanges(false);
    setChangeReason('');
    try {
      const res = await adminService.reviewInstructorApplication(inst.id);
      setReviewData(res.data);
    } catch (err) {
      // Fallback display if offline/mock
      setReviewData({
        id: inst.id,
        name: inst.name,
        email: inst.email,
        phone: inst.phone,
        verification_status: inst.verification_status || 'approved',
        car_make: inst.car_make || 'Toyota',
        car_model: inst.car_model || 'Corolla',
        car_year: inst.car_year || 2023,
        car_rego: inst.car_rego || 'S999ABC',
        car_transmission: inst.car_transmission || 'auto',
        experience_years: inst.experience_years || 5,
        languages: inst.languages || ['English'],
        bio: inst.bio,
        admin_feedback: inst.admin_feedback,
        documents: {
          wwcc: { has_document: true, preview_url: `/api/v1/instructors/${inst.id}/documents/wwcc` },
          licence: { has_document: true, preview_url: `/api/v1/instructors/${inst.id}/documents/licence` },
          permit: { has_document: true, preview_url: `/api/v1/instructors/${inst.id}/documents/permit` },
        },
      });
    } finally {
      setReviewLoading(false);
    }
  };

  // Securely view document blob with Sanctum authorization header
  const viewPrivateDoc = async (instId, type) => {
    try {
      const res = await api.get(`/instructors/${instId}/documents/${type}`, {
        responseType: 'blob',
      });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
      window.open(blobUrl, '_blank');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to open private document. File may not exist.');
    }
  };

  // Approve Application
  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this instructor application? They will become active immediately.')) {
      return;
    }
    setActionProcessing(true);
    try {
      await adminService.approveInstructorApplication(id);
      setAlertMsg('Instructor application approved successfully!');
      setReviewModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve application.');
    } finally {
      setActionProcessing(false);
    }
  };

  // Request Changes
  const handleRequestChanges = async (id) => {
    if (!changeReason.trim() || changeReason.trim().length < 5) {
      alert('Please provide a specific reason of at least 5 characters for requesting changes.');
      return;
    }
    setActionProcessing(true);
    try {
      await adminService.requestInstructorChanges(id, changeReason.trim());
      setAlertMsg('Application status updated to changes requested.');
      setReviewModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request changes.');
    } finally {
      setActionProcessing(false);
    }
  };

  // Filter instructors by tab
  const pendingCount = instructors.filter((i) => i.verification_status === 'pending_review').length;
  const filteredInstructors = instructors.filter((inst) => {
    if (activeTab === 'pending_review') return inst.verification_status === 'pending_review';
    if (activeTab === 'approved') return inst.verification_status === 'approved' || inst.verification_status === 'verified';
    if (activeTab === 'changes_requested') return inst.verification_status === 'changes_requested';
    return true;
  });

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Instructor & Examiner Network</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Manage driver trainer accreditations, examiner status, vehicle fleets, and review onboarding applications
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={openAdd} className="button button-primary">
            <Plus size={16} /> Add Instructor / Examiner
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.5rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'all' ? '2px solid var(--color-primary, #e63946)' : '2px solid transparent',
            color: activeTab === 'all' ? 'var(--color-primary, #e63946)' : '#64748b',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          All ({instructors.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending_review')}
          style={{
            padding: '0.5rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'pending_review' ? '2px solid #ca8a04' : '2px solid transparent',
            color: activeTab === 'pending_review' ? '#ca8a04' : '#64748b',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>Pending Review</span>
          {pendingCount > 0 && (
            <span style={{ background: '#ca8a04', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '11px' }}>
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          style={{
            padding: '0.5rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'approved' ? '2px solid #16a34a' : '2px solid transparent',
            color: activeTab === 'approved' ? '#16a34a' : '#64748b',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Approved & Active
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('changes_requested')}
          style={{
            padding: '0.5rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'changes_requested' ? '2px solid #dc2626' : '2px solid transparent',
            color: activeTab === 'changes_requested' ? '#dc2626' : '#64748b',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Changes Requested
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Instructor / Examiner</th>
                <th>Accreditation & Role</th>
                <th>Compliance Status</th>
                <th>Vehicle & Rego</th>
                <th>Rates (AUD)</th>
                <th>Active</th>
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
              ) : filteredInstructors.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No instructors found for this filter tab.
                  </td>
                </tr>
              ) : (
                filteredInstructors.map((inst) => {
                  const isPending = inst.verification_status === 'pending_review';
                  const isChangesReq = inst.verification_status === 'changes_requested';
                  const isApproved = inst.verification_status === 'approved' || inst.verification_status === 'verified';

                  return (
                    <tr key={inst.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={inst.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
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
                                #{inst.examiner_accreditation_no}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="badge badge-info">Driving Instructor</span>
                        )}
                      </td>
                      <td>
                        {isPending && (
                          <span className="badge" style={{ background: '#fef08a', color: '#854d0e', fontWeight: 700, border: '1px solid #fde047' }}>
                            Pending Review
                          </span>
                        )}
                        {isChangesReq && (
                          <span className="badge badge-danger">
                            Changes Requested
                          </span>
                        )}
                        {isApproved && (
                          <span className="badge badge-success">
                            Approved
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{inst.car_model || 'Dual Control Car'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {(inst.car_transmission || 'auto').toUpperCase()} {inst.car_rego ? `• ${inst.car_rego}` : ''}
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
                      <td>
                        <span className={`badge ${inst.is_active ? 'badge-success' : 'badge-danger'}`}>
                          {inst.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => openReviewModal(inst)}
                            className="button button-sm button-primary"
                            title="Review accreditation documents and application"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={13} /> Review
                          </button>
                          <button onClick={() => openEdit(inst)} className="button button-sm button-outline">
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleToggle(inst.id)}
                            className={`button button-sm ${inst.is_active ? 'button-outline' : 'button-secondary'}`}
                            title="Toggle Active Status"
                          >
                            <Power size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLICATION REVIEW MODAL */}
      {reviewModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '720px', width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.35rem' }}>Instructor Application Review</h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Verification & Accreditation Document Inspection
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            {reviewLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 1rem auto' }} />
                <p>Loading application data...</p>
              </div>
            ) : reviewData ? (
              <div>
                {/* Header Information */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <img
                    src={reviewData.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={reviewData.name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.15rem', color: '#0f172a' }}>{reviewData.name}</h4>
                    <div style={{ fontSize: '13px', color: '#475569' }}>
                      Email: <strong>{reviewData.email}</strong> • Mobile: <strong>{reviewData.phone}</strong>
                    </div>
                    <div style={{ marginTop: '0.4rem' }}>
                      <span className="badge" style={{
                        background: reviewData.verification_status === 'approved' ? '#dcfce7' : reviewData.verification_status === 'pending_review' ? '#fef08a' : '#fee2e2',
                        color: reviewData.verification_status === 'approved' ? '#166534' : reviewData.verification_status === 'pending_review' ? '#854d0e' : '#991b1b',
                        fontWeight: 700,
                      }}>
                        Status: {reviewData.verification_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 1: Professional Experience */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem', marginBottom: '0.6rem' }}>
                    Professional Background & Bio
                  </h5>
                  <div style={{ fontSize: '13px', color: '#1e293b' }}>
                    <div><strong>Instruction Experience:</strong> {reviewData.experience_years || 'N/A'} years</div>
                    <div><strong>Languages Spoken:</strong> {Array.isArray(reviewData.languages) ? reviewData.languages.join(', ') : 'English'}</div>
                    {reviewData.bio && (
                      <p style={{ marginTop: '0.5rem', fontStyle: 'italic', background: '#fdfdfd', padding: '0.6rem', border: '1px solid #f1f5f9', borderRadius: '6px' }}>
                        "{reviewData.bio}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Section 2: Vehicle Specifications */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem', marginBottom: '0.6rem' }}>
                    Training Vehicle Details
                  </h5>
                  <div className="grid grid-3" style={{ gap: '0.75rem', fontSize: '13px', color: '#1e293b' }}>
                    <div><strong>Make & Model:</strong> {reviewData.car_make} {reviewData.car_model}</div>
                    <div><strong>Year:</strong> {reviewData.car_year}</div>
                    <div><strong>Transmission:</strong> {(reviewData.car_transmission || 'auto').toUpperCase()}</div>
                    <div><strong>Registration:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{reviewData.car_rego || 'Not provided'}</span></div>
                  </div>
                </div>

                {/* Section 3: Private Accreditation Documents */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem', marginBottom: '0.6rem' }}>
                    Confidential Accreditation Documents (Private Storage)
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {/* WWCC */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', background: '#fafafa' }}>
                      <FileText size={24} style={{ color: '#2563eb', margin: '0 auto 0.4rem auto' }} />
                      <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '0.4rem' }}>WWCC Check</div>
                      {reviewData.documents?.wwcc?.has_document ? (
                        <button
                          type="button"
                          onClick={() => viewPrivateDoc(reviewData.id, 'wwcc')}
                          className="button button-sm button-outline"
                          style={{ width: '100%', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <ExternalLink size={12} /> View File
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#dc2626' }}>Not uploaded</span>
                      )}
                    </div>

                    {/* Licence */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', background: '#fafafa' }}>
                      <FileText size={24} style={{ color: '#2563eb', margin: '0 auto 0.4rem auto' }} />
                      <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '0.4rem' }}>Driver Licence</div>
                      {reviewData.documents?.licence?.has_document ? (
                        <button
                          type="button"
                          onClick={() => viewPrivateDoc(reviewData.id, 'licence')}
                          className="button button-sm button-outline"
                          style={{ width: '100%', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <ExternalLink size={12} /> View File
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#dc2626' }}>Not uploaded</span>
                      )}
                    </div>

                    {/* Permit */}
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', background: '#fafafa' }}>
                      <FileText size={24} style={{ color: '#2563eb', margin: '0 auto 0.4rem auto' }} />
                      <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '0.4rem' }}>Instructor Permit</div>
                      {reviewData.documents?.permit?.has_document ? (
                        <button
                          type="button"
                          onClick={() => viewPrivateDoc(reviewData.id, 'permit')}
                          className="button button-sm button-outline"
                          style={{ width: '100%', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <ExternalLink size={12} /> View File
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#dc2626' }}>Not uploaded</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Existing Admin Feedback if any */}
                {reviewData.admin_feedback && (
                  <div style={{ padding: '0.75rem 1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '13px', color: '#92400e' }}>
                    <strong>Current Admin Feedback:</strong> {reviewData.admin_feedback}
                  </div>
                )}

                {/* Action Section */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                  {requestingChanges ? (
                    <div>
                      <label className="form-label" style={{ fontWeight: 700 }}>
                        Reason for Requesting Changes *
                      </label>
                      <textarea
                        rows={3}
                        className="form-control"
                        placeholder="Please state clearly what needs to be corrected (e.g. 'WWCC photo is blurry, please re-upload clear scan', 'Registration number does not match vehicle')."
                        value={changeReason}
                        onChange={(e) => setChangeReason(e.target.value)}
                        style={{ marginBottom: '0.75rem' }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setRequestingChanges(false)}
                          className="button button-outline button-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={actionProcessing || !changeReason.trim()}
                          onClick={() => handleRequestChanges(reviewData.id)}
                          className="button button-sm"
                          style={{ background: '#dc2626', color: '#fff' }}
                        >
                          {actionProcessing ? 'Submitting...' : 'Send Changes Request'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setRequestingChanges(true)}
                        className="button button-outline button-sm"
                        style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                      >
                        <AlertTriangle size={14} /> Request Changes
                      </button>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setReviewModalOpen(false)}
                          className="button button-outline button-sm"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          disabled={actionProcessing || reviewData.verification_status === 'approved'}
                          onClick={() => handleApprove(reviewData.id)}
                          className="button button-primary button-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Check size={14} />
                          {reviewData.verification_status === 'approved' ? 'Already Approved' : 'Approve & Activate Instructor'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Add / Edit Instructor Modal */}
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
