import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { extractArray, safeArray } from '../../utils/apiHelpers';
import {
  Settings,
  Shield,
  Save,
  CheckCircle,
  RefreshCw,
  Search,
  MapPin,
  CalendarDays,
  ArrowRight,
  LockKeyhole,
  ExternalLink,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import '../../styles/hero.css';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'general' | 'logs'
  const [settings, setSettings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSettings();
      const rawSettings = data?.settings || (Array.isArray(data) ? data : []);
      setSettings(extractArray(rawSettings, []));

      const rawLogs = data?.audit_logs || data?.logs || [];
      setAuditLogs(extractArray(rawLogs, []));
    } catch {
      setSettings([]);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getSettingVal = (key, fallback = '') => {
    const item = safeArray(settings).find((s) => s.key === key);
    return item?.value !== undefined && item?.value !== null ? item.value : fallback;
  };

  const handleValueChange = (key, val, description = '') => {
    setSettings((prev) => {
      const arr = safeArray(prev);
      const exists = arr.some((s) => s.key === key);
      if (exists) {
        return arr.map((s) => (s.key === key ? { ...s, value: val } : s));
      }
      return [...arr, { key, value: val, description: description || key }];
    });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setAlertMsg('');
    try {
      await adminService.updateSettings(settings);
      setAlertMsg('Configuration settings saved and applied to the live website.');
      loadSettings();
    } catch {
      alert('Could not update settings.');
    } finally {
      setSaving(false);
    }
  };

  // Hero Card State Helpers
  const heroTitle = getSettingVal('hero_search_title', 'Find Your Driving Service');
  const heroSubtitle = getSettingVal(
    'hero_search_subtitle',
    'Choose your location and service to get started.'
  );
  const heroLocationLabel = getSettingVal(
    'hero_search_location_label',
    'Your suburb or test centre'
  );
  const heroServiceLabel = getSettingVal(
    'hero_search_service_label',
    'Service required'
  );
  const heroButtonText = getSettingVal(
    'hero_search_button_text',
    'Find Available Slots'
  );
  const heroNote = getSettingVal(
    'hero_search_note',
    'Easy online booking for your next driving step'
  );
  const heroEnabled = getSettingVal('hero_search_enabled', '1') !== '0';

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Website Configuration &amp; Settings</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Manage the homepage Hero Search Card, operational variables, and review system audit logs
          </p>
        </div>
        <button onClick={loadSettings} className="button button-sm button-outline">
          <RefreshCw size={14} /> Reload Settings
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.75rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className="button"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'hero' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'hero' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'hero' ? 700 : 500,
            borderRadius: 0,
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Search size={16} />
          <span>Hero Search Card</span>
          <span className="badge badge-success" style={{ fontSize: '10px' }}>Homepage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className="button"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'general' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'general' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'general' ? 700 : 500,
            borderRadius: 0,
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Settings size={16} />
          <span>Business &amp; Operational</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className="button"
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'logs' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'logs' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: activeTab === 'logs' ? 700 : 500,
            borderRadius: 0,
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Shield size={16} />
          <span>Audit Trail ({safeArray(auditLogs).length})</span>
        </button>
      </div>

      {/* TAB 1: HERO SEARCH CARD */}
      {activeTab === 'hero' && (
        <div className="grid grid-2" style={{ alignItems: 'start', gap: '2rem' }}>
          {/* Edit Form */}
          <div className="card" style={{ padding: '2rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Search size={20} color="var(--color-primary)" />
                  Hero Search Card Settings
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', margin: '0.25rem 0 0 0' }}>
                  Modify the headings, field labels, call-to-action button, and trust notes
                </p>
              </div>

              {/* Status Toggle */}
              <button
                type="button"
                onClick={() => handleValueChange('hero_search_enabled', heroEnabled ? '0' : '1', 'Show Hero Search Card')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', color: heroEnabled ? 'var(--color-success)' : 'var(--color-text-muted)' }}
                title="Toggle visibility on homepage"
              >
                {heroEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
                  {heroEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Heading Title *
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', float: 'right' }}>hero_search_title</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={heroTitle}
                    onChange={(e) => handleValueChange('hero_search_title', e.target.value, 'Hero search box heading')}
                    placeholder="Find Your Driving Service"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Subheading / Description *
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', float: 'right' }}>hero_search_subtitle</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={heroSubtitle}
                    onChange={(e) => handleValueChange('hero_search_subtitle', e.target.value, 'Hero search box subheading')}
                    placeholder="Choose your location and service to get started."
                  />
                </div>

                <div className="grid grid-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Location Field Label *
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', float: 'right' }}>hero_search_location_label</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={heroLocationLabel}
                      onChange={(e) => handleValueChange('hero_search_location_label', e.target.value, 'Location dropdown label')}
                      placeholder="Your suburb or test centre"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      Service Field Label *
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', float: 'right' }}>hero_search_service_label</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={heroServiceLabel}
                      onChange={(e) => handleValueChange('hero_search_service_label', e.target.value, 'Service dropdown label')}
                      placeholder="Service required"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Button Action Text *
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', float: 'right' }}>hero_search_button_text</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={heroButtonText}
                    onChange={(e) => handleValueChange('hero_search_button_text', e.target.value, 'Search button text')}
                    placeholder="Find Available Slots"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">
                    Bottom Trust / Security Note
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', float: 'right' }}>hero_search_note</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={heroNote}
                    onChange={(e) => handleValueChange('hero_search_note', e.target.value, 'Bottom security note')}
                    placeholder="Easy online booking for your next driving step"
                  />
                </div>

                {/* Quick management shortcuts */}
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-primary)' }}>
                    Dropdown Data Sources Managed In Admin:
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to="/admin/locations" className="button button-sm button-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} /> Manage Suburbs &amp; Centres <ExternalLink size={12} />
                    </Link>
                    <Link to="/admin/services" className="button button-sm button-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CalendarDays size={13} /> Manage Services &amp; Prices <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="submit" disabled={saving} className="button button-primary">
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Hero Search Card'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Live Preview Column */}
          <div style={{ position: 'sticky', top: '1rem' }}>
            <div className="card" style={{ padding: '1.75rem', backgroundColor: '#0D2645', color: '#ffffff' }}>
              <div className="flex-between" style={{ marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8da2bc', fontWeight: 700 }}>
                  Real-Time Homepage Preview
                </span>
                <span className="badge badge-success" style={{ fontSize: '10px' }}>
                  {heroEnabled ? 'Card Active' : 'Hidden'}
                </span>
              </div>

              {/* Exact Hero Search Card Preview */}
              <div className="hero-search-card" style={{ margin: 0, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <div className="hero-search-heading">
                  <div className="hero-search-icon">
                    <Search size={21} />
                  </div>
                  <div>
                    <h2>{heroTitle}</h2>
                    <p>{heroSubtitle}</p>
                  </div>
                </div>

                <div className="hero-search-fields">
                  <div className="hero-field">
                    <label htmlFor="preview-location">{heroLocationLabel}</label>
                    <div className="hero-select-wrap">
                      <MapPin size={18} />
                      <select id="preview-location" defaultValue="1">
                        <option value="1">Marion (5043) ★ DIT Centre</option>
                        <option value="2">Elizabeth (5112) ★ DIT Centre</option>
                        <option value="3">Adelaide CBD (5000)</option>
                      </select>
                      <ChevronDown size={16} className="hero-select-arrow" />
                    </div>
                  </div>

                  <div className="hero-field">
                    <label htmlFor="preview-service">{heroServiceLabel}</label>
                    <div className="hero-select-wrap">
                      <CalendarDays size={18} />
                      <select id="preview-service" defaultValue="1">
                        <option value="1">VORT Driving Test — from $240.00 AUD</option>
                        <option value="2">Standard Driving Lesson (60 Mins) — from $85.00 AUD</option>
                      </select>
                      <ChevronDown size={16} className="hero-select-arrow" />
                    </div>
                  </div>
                </div>

                <button type="button" className="hero-search-submit">
                  {heroButtonText}
                  <ArrowRight size={19} />
                </button>

                <p className="hero-search-note">
                  <LockKeyhole size={14} />
                  {heroNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GENERAL BUSINESS VARIABLES */}
      {activeTab === 'general' && (
        <div className="card" style={{ padding: '2rem', maxWidth: '800px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="var(--color-secondary)" /> General Business Variables
          </h3>

          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {safeArray(settings)
                .filter((s) => !s.key.startsWith('hero_search_'))
                .map((s) => (
                  <div key={s.id || s.key} className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{s.description || s.key}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.key}</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={s.value || ''}
                      onChange={(e) => handleValueChange(s.key, e.target.value)}
                    />
                  </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" disabled={saving} className="button button-primary">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'logs' && (
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} color="var(--color-secondary)" /> Complete Platform Audit Trail
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto' }}>
            {safeArray(auditLogs).length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>No audit log entries found.</p>
            ) : (
              safeArray(auditLogs).map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-size-xs)',
                    borderLeft: '3px solid var(--color-secondary)',
                  }}
                >
                  <div className="flex-between">
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      {String(log.action || 'ACTIVITY').replaceAll('_', ' ').toUpperCase()}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      {log.created_at ? new Date(log.created_at).toLocaleString() : ''}
                    </span>
                  </div>
                  <div style={{ color: 'var(--color-text)', marginTop: '0.25rem' }}>
                    User: <strong>{log.user?.name || 'Guest / Webhook'}</strong> | Target: {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                  </div>
                  {log.ip_address && (
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                      IP: {log.ip_address}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
