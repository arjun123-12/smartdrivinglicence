import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import instructorService from '../../services/instructorService';
import {
  UserCheck,
  FileText,
  Car,
  Award,
  AlertCircle,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  HelpCircle
} from 'lucide-react';

const COMMON_LANGUAGES = [
  'English',
  'Mandarin',
  'Arabic',
  'Hindi',
  'Punjabi',
  'Vietnamese',
  'Cantonese',
  'Spanish',
  'Filipino',
  'Persian (Farsi)',
  'Urdu',
];

export default function InstructorSignup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    // Account
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',

    // Documents
    doc_wwcc: null,
    doc_licence: null,
    doc_permit: null,

    // Vehicle
    car_make: '',
    car_model: '',
    car_year: new Date().getFullYear(),
    car_transmission: 'auto',
    car_rego: '',

    // Profile
    experience_years: 3,
    languages: ['English'],
    bio: '',
    profile_photo: null,
  });

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 10 * 1024 * 1024) {
      setErrorMessage(`Selected file for ${field} exceeds the maximum 10MB limit.`);
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: file }));
    setErrorMessage('');
  };

  const toggleLanguage = (lang) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(lang);
      const updated = exists
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages: updated.length ? updated : ['English'] };
    });
  };

  const validateStep = (currentStep) => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!formData.name.trim()) return 'Please enter your full legal name.';
      if (!formData.email.trim() || !formData.email.includes('@')) return 'Please provide a valid email address.';
      if (!formData.phone.trim()) return 'Please provide your Australian mobile number (e.g. 0412 345 678).';
      if (formData.password.length < 8) return 'Password must be at least 8 characters long.';
      if (formData.password !== formData.password_confirmation) return 'Passwords do not match.';
    }
    if (currentStep === 2) {
      if (!formData.doc_wwcc) return 'Please upload your Working With Children Check (WWCC).';
      if (!formData.doc_licence) return 'Please upload your Driving Licence.';
      if (!formData.doc_permit) return 'Please upload your Driving Instructor Permit.';
    }
    if (currentStep === 3) {
      if (!formData.car_make.trim()) return 'Please enter your vehicle make (e.g. Toyota).';
      if (!formData.car_model.trim()) return 'Please enter your vehicle model (e.g. Corolla).';
      if (!formData.car_year || formData.car_year < 2010) return 'Vehicle year must be 2010 or newer for safety compliance.';
      if (!formData.car_rego.trim()) return 'Please enter your vehicle registration number.';
    }
    if (currentStep === 4) {
      if (formData.experience_years < 0) return 'Experience years cannot be negative.';
      if (!formData.bio.trim() || formData.bio.trim().length < 20) return 'Please provide an instructor bio of at least 20 characters.';
    }
    return null;
  };

  const nextStep = () => {
    const error = validateStep(step);
    if (error) {
      setErrorMessage(error);
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setErrorMessage('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateStep(step);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('email', formData.email.trim());
    payload.append('phone', formData.phone.trim());
    payload.append('password', formData.password);
    payload.append('password_confirmation', formData.password_confirmation);

    payload.append('doc_wwcc', formData.doc_wwcc);
    payload.append('doc_licence', formData.doc_licence);
    payload.append('doc_permit', formData.doc_permit);

    payload.append('car_make', formData.car_make.trim());
    payload.append('car_model', formData.car_model.trim());
    payload.append('car_year', formData.car_year);
    payload.append('car_transmission', 'auto');
    payload.append('car_rego', formData.car_rego.trim().toUpperCase());

    payload.append('experience_years', formData.experience_years);
    payload.append('languages', JSON.stringify(formData.languages));
    payload.append('bio', formData.bio.trim());
    if (formData.profile_photo) {
      payload.append('profile_photo', formData.profile_photo);
    }

    try {
      const response = await instructorService.signup(payload);
      // Navigate to phone verification screen with phone and debug OTP info
      navigate(`/instructor/verify-phone?phone=${encodeURIComponent(response.phone || formData.phone)}`, {
        state: {
          phone: response.phone || formData.phone,
          debug_otp: response.debug_otp,
          message: response.message,
        },
      });
    } catch (err) {
      const msgs = err.response?.data?.errors;
      if (msgs) {
        const firstKey = Object.keys(msgs)[0];
        setErrorMessage(msgs[firstKey][0]);
      } else {
        setErrorMessage(err.response?.data?.message || 'Failed to submit application. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ padding: '2.5rem 1rem', minHeight: 'calc(100vh - 160px)', background: 'var(--color-bg-secondary, #f8fafc)' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.6rem', borderRadius: '50%', background: 'rgba(27, 108, 49, 0.1)', color: 'var(--color-primary, #1B6C31)', marginBottom: '0.75rem' }}>
            <Award size={28} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1e293b' }}>
            Join A1 Smart Driving as an Instructor
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            Teach learner drivers across Adelaide with flexible scheduling, guaranteed weekly bookings, and competitive payouts.
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.75rem' }}>
          {[
            { num: 1, label: 'Account', icon: UserCheck },
            { num: 2, label: 'Documents', icon: FileText },
            { num: 3, label: 'Vehicle', icon: Car },
            { num: 4, label: 'Profile', icon: Award },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = step === item.num;
            const isDone = step > item.num;
            return (
              <div
                key={item.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  background: isActive ? '#ffffff' : isDone ? 'rgba(34, 197, 94, 0.1)' : '#ffffff',
                  border: isActive ? '2px solid var(--color-primary, #1B6C31)' : isDone ? '1px solid #22c55e' : '1px solid #e2e8f0',
                  boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: isDone ? '#22c55e' : isActive ? 'var(--color-primary, #1B6C31)' : '#e2e8f0',
                    color: isDone || isActive ? '#ffffff' : '#64748b',
                    flexShrink: 0,
                  }}
                >
                  {isDone ? '✓' : item.num}
                </div>
                <div style={{ display: 'none', md: 'block' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: isActive ? '#0f172a' : '#64748b', lineHeight: 1.2 }}>
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Card */}
        <div className="card" style={{ padding: '2rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.06)' }}>
          <form onSubmit={handleSubmit}>
            {/* STEP 1: ACCOUNT DETAILS */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={20} color="var(--color-primary, #1B6C31)" />
                  Instructor Account Information
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Enter your contact details. An SMS verification code will be sent to your mobile.
                </p>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Full Legal Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={handleTextChange}
                    placeholder="e.g. Johnathan Smith"
                  />
                </div>

                <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      required
                      value={formData.email}
                      onChange={handleTextChange}
                      placeholder="e.g. jsmith@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Australian Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      required
                      value={formData.phone}
                      onChange={handleTextChange}
                      placeholder="0412 345 678"
                    />
                    <small style={{ color: '#64748b', fontSize: '11px' }}>
                      Standard Australian mobile (04xx xxx xxx or +61 4xx xxx xxx)
                    </small>
                  </div>
                </div>

                <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={handleTextChange}
                      placeholder="At least 8 characters"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      name="password_confirmation"
                      className="form-control"
                      required
                      minLength={8}
                      value={formData.password_confirmation}
                      onChange={handleTextChange}
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" onClick={nextStep} className="button button-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Continue to Documents <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: REQUIRED ACCREDITATION DOCUMENTS */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={20} color="var(--color-primary, #1B6C31)" />
                  Required Identity & Accreditation Documents
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  All 3 documents are strictly mandated by South Australian Transport & Child Safety regulations. Documents are stored in secure private storage. Accepted formats: PDF, JPG, PNG (Max 10MB each).
                </p>

                {/* Document 1: WWCC */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>1. Working With Children Check (WWCC) *</strong>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Issued by SA DHS Screening Unit or equivalent.
                      </div>
                    </div>
                    {formData.doc_wwcc && (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Selected
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'doc_wwcc')}
                    style={{ marginTop: '0.5rem' }}
                  />
                  {formData.doc_wwcc && (
                    <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>
                      File: {formData.doc_wwcc.name} ({(formData.doc_wwcc.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>

                {/* Document 2: Driving Licence */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>2. Full Australian Driving Licence *</strong>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Front and back, or clear front scan of your unrestricted driver licence.
                      </div>
                    </div>
                    {formData.doc_licence && (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Selected
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'doc_licence')}
                    style={{ marginTop: '0.5rem' }}
                  />
                  {formData.doc_licence && (
                    <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>
                      File: {formData.doc_licence.name} ({(formData.doc_licence.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>

                {/* Document 3: Driving Instructor Permit */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>3. Driving Instructor Permit (MDI / Certificate IV) *</strong>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Accredited Motor Driving Instructor Authority or VORT Examiner licence card.
                      </div>
                    </div>
                    {formData.doc_permit && (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Selected
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'doc_permit')}
                    style={{ marginTop: '0.5rem' }}
                  />
                  {formData.doc_permit && (
                    <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>
                      File: {formData.doc_permit.name} ({(formData.doc_permit.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button type="button" onClick={prevStep} className="button button-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="button button-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Continue to Vehicle <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: TRAINING VEHICLE */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Car size={20} color="var(--color-primary, #1B6C31)" />
                  Training Vehicle Specifications
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Details of the dual-controlled vehicle you will operate for lessons and VORT tests.
                </p>

                <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Vehicle Make *</label>
                    <input
                      type="text"
                      name="car_make"
                      className="form-control"
                      required
                      value={formData.car_make}
                      onChange={handleTextChange}
                      placeholder="e.g. Toyota, Mazda, Hyundai"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vehicle Model *</label>
                    <input
                      type="text"
                      name="car_model"
                      className="form-control"
                      required
                      value={formData.car_model}
                      onChange={handleTextChange}
                      placeholder="e.g. Corolla, CX-3, i30"
                    />
                  </div>
                </div>

                <div className="grid grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Manufacturing Year *</label>
                    <input
                      type="number"
                      name="car_year"
                      className="form-control"
                      min={2010}
                      max={new Date().getFullYear() + 1}
                      required
                      value={formData.car_year}
                      onChange={handleTextChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Transmission</label>
                    <select
                      name="car_transmission"
                      className="form-select"
                      disabled
                      value={formData.car_transmission}
                    >
                      <option value="auto">Automatic (Strict standard)</option>
                    </select>
                    <small style={{ color: '#64748b', fontSize: '11px' }}>Automatic dual-control fleet only</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Registration Number (Rego) *</label>
                    <input
                      type="text"
                      name="car_rego"
                      className="form-control"
                      required
                      value={formData.car_rego}
                      onChange={handleTextChange}
                      placeholder="e.g. S123ABC"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button type="button" onClick={prevStep} className="button button-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="button button-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Continue to Profile <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: INSTRUCTOR PROFILE */}
            {step === 4 && (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} color="var(--color-primary, #1B6C31)" />
                  Instructor Experience & Bio
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Present yourself to future students. This profile will be published once reviewed and approved by admin.
                </p>

                <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Years of Instruction Experience *</label>
                    <input
                      type="number"
                      name="experience_years"
                      className="form-control"
                      min={0}
                      max={50}
                      required
                      value={formData.experience_years}
                      onChange={handleTextChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Profile Photo (Optional)</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileChange(e, 'profile_photo')}
                    />
                    <small style={{ color: '#64748b', fontSize: '11px' }}>
                      Professional headshot or selfie (Max 5MB)
                    </small>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Languages Spoken (Select all that apply) *</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.35rem' }}>
                    {COMMON_LANGUAGES.map((lang) => {
                      const selected = formData.languages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: selected ? '1px solid var(--color-primary, #1B6C31)' : '1px solid #cbd5e1',
                            background: selected ? 'var(--color-primary, #1B6C31)' : '#ffffff',
                            color: selected ? '#ffffff' : '#334155',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {selected ? '✓ ' : '+ '}{lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Instructor Bio / Description *</label>
                  <textarea
                    name="bio"
                    className="form-control"
                    rows={4}
                    required
                    value={formData.bio}
                    onChange={handleTextChange}
                    placeholder="Tell learners about your teaching style, patience, focus on defensive driving, and test preparation techniques..."
                  />
                  <small style={{ color: '#64748b', fontSize: '11px' }}>Minimum 20 characters.</small>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button type="button" onClick={prevStep} className="button button-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="submit" disabled={loading} className="button button-primary" style={{ padding: '0.75rem 1.75rem', fontWeight: 700 }}>
                    {loading ? 'Submitting Application...' : 'Submit Application & Verify Phone'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Existing Member Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Already an instructor?{' '}
          <Link to="/instructor/login" style={{ color: 'var(--color-primary, #1B6C31)', fontWeight: 700 }}>
            Sign in with SMS OTP
          </Link>
          {' | '}
          <Link to="/instructor/verify-phone" style={{ color: '#2563eb', fontWeight: 600 }}>
            Resume phone verification
          </Link>
        </div>
      </div>
    </div>
  );
}
