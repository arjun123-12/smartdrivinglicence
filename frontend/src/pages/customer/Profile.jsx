import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { User, Shield, CheckCircle, AlertCircle, Save, KeyRound } from 'lucide-react';

export default function CustomerProfile() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    licence_number: user?.customer_profile?.licence_number || '',
    licence_state: user?.customer_profile?.licence_state || 'SA',
    licence_type: user?.customer_profile?.licence_type || 'learner',
    date_of_birth: user?.customer_profile?.date_of_birth || '',
    emergency_contact_name: user?.customer_profile?.emergency_contact_name || '',
    emergency_contact_phone: user?.customer_profile?.emergency_contact_phone || '',
    address: user?.customer_profile?.address || '',
    suburb: user?.customer_profile?.suburb || '',
    postcode: user?.customer_profile?.postcode || '',
  });

  const [passForm, setPassForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [changingPass, setChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await authService.updateProfile(profileForm);
      updateUser(res.user);
      setProfileSuccess('Profile details updated successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passForm.password !== passForm.password_confirmation) {
      setPassError('New passwords do not match.');
      return;
    }
    setChangingPass(true);
    setPassSuccess('');
    setPassError('');

    try {
      await authService.changePassword(passForm);
      setPassSuccess('Your password has been changed.');
      setPassForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password. Verify your current password.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>My Profile & Driver Credentials</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: '2rem' }}>
        Maintain your South Australian licensing information and contact details for instructors
      </p>

      {/* Profile Form Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={20} color="var(--color-secondary)" /> Learner Driver Information
        </h3>

        {profileSuccess && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-control"
                disabled
                value={user?.email || ''}
                style={{ backgroundColor: 'var(--color-surface-subtle)' }}
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Mobile Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="0412 345 678"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={profileForm.date_of_birth}
                onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
              />
            </div>
          </div>

          <hr style={{ borderColor: 'var(--color-border)', margin: '1.5rem 0' }} />

          <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            Licensing Details (Service SA Verification)
          </h4>

          <div className="grid grid-3">
            <div className="form-group">
              <label className="form-label">SA Driver Licence / Client No</label>
              <input
                type="text"
                className="form-control"
                value={profileForm.licence_number}
                onChange={(e) => setProfileForm({ ...profileForm, licence_number: e.target.value })}
                placeholder="e.g. P1234567"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Licence State</label>
              <select
                className="form-select"
                value={profileForm.licence_state}
                onChange={(e) => setProfileForm({ ...profileForm, licence_state: e.target.value })}
              >
                <option value="SA">South Australia (SA)</option>
                <option value="VIC">Victoria (VIC)</option>
                <option value="NSW">New South Wales (NSW)</option>
                <option value="QLD">Queensland (QLD)</option>
                <option value="WA">Western Australia (WA)</option>
                <option value="OVERSEAS">Overseas Authority</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Current Stage</label>
              <select
                className="form-select"
                value={profileForm.licence_type}
                onChange={(e) => setProfileForm({ ...profileForm, licence_type: e.target.value })}
              >
                <option value="learner">Learner (L-Plate)</option>
                <option value="provisional_1">P1 Provisional</option>
                <option value="provisional_2">P2 Provisional</option>
                <option value="full">Full Unrestricted</option>
                <option value="international">International / Overseas</option>
              </select>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--color-border)', margin: '1.5rem 0' }} />

          <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            Default Pickup Address & Emergency Contact
          </h4>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              className="form-control"
              value={profileForm.address}
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              placeholder="Street address for home lesson pickups"
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Suburb</label>
              <input
                type="text"
                className="form-control"
                value={profileForm.suburb}
                onChange={(e) => setProfileForm({ ...profileForm, suburb: e.target.value })}
                placeholder="e.g. Campbelltown"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Postcode</label>
              <input
                type="text"
                className="form-control"
                value={profileForm.postcode}
                onChange={(e) => setProfileForm({ ...profileForm, postcode: e.target.value })}
                placeholder="e.g. 5074"
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Emergency Contact Name</label>
              <input
                type="text"
                className="form-control"
                value={profileForm.emergency_contact_name}
                onChange={(e) => setProfileForm({ ...profileForm, emergency_contact_name: e.target.value })}
                placeholder="e.g. Parent / Spouse Name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact Phone</label>
              <input
                type="tel"
                className="form-control"
                value={profileForm.emergency_contact_phone}
                onChange={(e) => setProfileForm({ ...profileForm, emergency_contact_phone: e.target.value })}
                placeholder="0412 999 888"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" disabled={savingProfile} className="button button-primary">
              <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <KeyRound size={20} color="var(--color-secondary)" /> Update Password
        </h3>

        {passSuccess && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handlePassSubmit}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={passForm.current_password}
              onChange={(e) => setPassForm({ ...passForm, current_password: e.target.value })}
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">New Password (Min 8 chars)</label>
              <input
                type="password"
                className="form-control"
                required
                minLength="8"
                value={passForm.password}
                onChange={(e) => setPassForm({ ...passForm, password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                required
                minLength="8"
                value={passForm.password_confirmation}
                onChange={(e) => setPassForm({ ...passForm, password_confirmation: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" disabled={changingPass} className="button button-outline">
              {changingPass ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

