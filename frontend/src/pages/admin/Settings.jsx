import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Settings, Shield, Save, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminSettings() {
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
      setSettings(data.settings || []);
      setAuditLogs(data.audit_logs?.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key, val) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: val } : s))
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlertMsg('');
    try {
      await adminService.updateSettings(settings);
      setAlertMsg('Business configuration settings saved.');
      loadSettings();
    } catch {
      alert('Could not update settings.');
    } finally {
      setSaving(false);
    }
  };

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
          <h2>Business Configuration & Audit Trails</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Configure operational thresholds, company contacts, and inspect security audit logs
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

      <div className="grid grid-2" style={{ alignItems: 'start', gap: '2rem' }}>
        {/* Settings Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="var(--color-secondary)" /> General Business Variables
          </h3>

          <form onSubmit={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {settings.map((s) => (
                <div key={s.id} className="form-group" style={{ margin: 0 }}>
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

        {/* Audit Log Table */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} color="var(--color-secondary)" /> Complete Platform Audit Trail
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '550px', overflowY: 'auto' }}>
            {auditLogs.map((log) => (
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
                    {log.action.replaceAll('_', ' ').toUpperCase()}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(log.created_at).toLocaleString()}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

