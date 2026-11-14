import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { extractArray, safeArray } from '../../utils/apiHelpers';
import { MapPin, Plus, Edit, Trash2, CheckCircle, Search, Star, Power, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    postcode: '',
    state: 'SA',
    test_centre_name: '',
    is_test_centre: false,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const data = await adminService.getLocations();
      setLocations(extractArray(data, []));
    } catch {
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedLocations = async () => {
    if (!window.confirm('Import 260+ authentic South Australia suburbs & official DIT test centres?')) return;
    setSeeding(true);
    try {
      const res = await adminService.seedLocations();
      setAlertMsg(res.message || 'South Australia locations imported successfully.');
      await loadLocations();
    } catch {
      setAlertMsg('Failed to import locations.');
    } finally {
      setSeeding(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormError('');
    setFormData({
      name: '',
      postcode: '',
      state: 'SA',
      test_centre_name: '',
      is_test_centre: false,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (loc) => {
    setEditingId(loc.id);
    setFormError('');
    setFormData({
      name: loc.name,
      postcode: loc.postcode,
      state: loc.state || 'SA',
      test_centre_name: loc.test_centre_name || '',
      is_test_centre: Boolean(loc.is_test_centre),
      is_active: loc.is_active !== undefined ? Boolean(loc.is_active) : true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingId) {
        const res = await adminService.updateLocation(editingId, formData);
        setAlertMsg(res?.message || 'Location updated successfully.');
      } else {
        const res = await adminService.createLocation(formData);
        if (res?.warning) {
          setAlertMsg(res.warning);
        } else {
          setAlertMsg('New location created successfully.');
        }
      }
      setModalOpen(false);
      await loadLocations();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save location.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (loc) => {
    try {
      await adminService.updateLocation(loc.id, {
        ...loc,
        is_active: !loc.is_active,
      });
      loadLocations();
    } catch {
      alert('Could not toggle location status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this location? Instructors linked to this location may be affected.')) return;
    try {
      await adminService.deleteLocation(id);
      setAlertMsg('Location removed.');
      loadLocations();
    } catch {
      alert('Could not delete location.');
    }
  };

  const filtered = safeArray(locations).filter((loc) => {
    if (!loc) return false;
    const matchesSearch =
      (loc.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loc.postcode || '').toString().includes(searchTerm);

    if (filterType === 'test_centres') return matchesSearch && loc.is_test_centre;
    if (filterType === 'suburbs') return matchesSearch && !loc.is_test_centre;
    return matchesSearch;
  });

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Suburbs &amp; DIT Test Centres</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Manage the locations and official DIT hubs displayed in the Hero Search Card and booking wizards
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleSeedLocations}
            disabled={seeding}
            className="button button-outline"
            title="Import 260+ authentic South Australian suburbs and DIT testing centres"
          >
            <RefreshCw size={15} style={{ animation: seeding ? 'spin 1s linear infinite' : 'none' }} />
            {seeding ? 'Importing SA Locations...' : 'Import 260+ SA Locations'}
          </button>
          <button onClick={openAdd} className="button button-primary">
            <Plus size={16} /> Add Location / Centre
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="var(--color-text-muted)" />
            <input
              type="text"
              className="form-control"
              placeholder="Search suburb name or postcode (e.g. Elizabeth, 5043)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setFilterType('all')}
              className={`button button-sm ${filterType === 'all' ? 'button-primary' : 'button-outline'}`}
            >
              All ({safeArray(locations).length})
            </button>
            <button
              onClick={() => setFilterType('test_centres')}
              className={`button button-sm ${filterType === 'test_centres' ? 'button-primary' : 'button-outline'}`}
            >
              DIT Centres ({safeArray(locations).filter((l) => l.is_test_centre).length})
            </button>
            <button
              onClick={() => setFilterType('suburbs')}
              className={`button button-sm ${filterType === 'suburbs' ? 'button-primary' : 'button-outline'}`}
            >
              Standard Suburbs ({safeArray(locations).filter((l) => !l.is_test_centre).length})
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Location / Suburb</th>
                <th>Postcode</th>
                <th>State</th>
                <th>Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : safeArray(filtered).length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--color-text-muted)' }}>
                    <MapPin size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                      No locations found matching your filter criteria.
                    </div>
                    <p style={{ fontSize: 'var(--font-size-sm)', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
                      Populate your database and Hero dropdown with over 260 authentic South Australian suburbs and DIT testing centres.
                    </p>
                    <div style={{ display: 'inline-flex', gap: '0.75rem' }}>
                      <button onClick={openAdd} className="button button-primary button-sm">
                        <Plus size={15} /> Add Single Location
                      </button>
                      <button onClick={handleSeedLocations} disabled={seeding} className="button button-outline button-sm">
                        <RefreshCw size={15} style={{ animation: seeding ? 'spin 1s linear infinite' : 'none' }} />
                        {seeding ? 'Importing SA Locations...' : 'Import 260+ SA Locations'}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                safeArray(filtered).map((loc) => (
                  <tr key={loc.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={16} />
                        <span>{loc.name}</span>
                      </div>
                      {loc.test_centre_name && (
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '1.4rem' }}>
                          {loc.test_centre_name}
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{loc.postcode}</td>
                    <td>{loc.state || 'SA'}</td>
                    <td>
                      {loc.is_test_centre ? (
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Star size={11} fill="currentColor" /> DIT Test Centre
                        </span>
                      ) : (
                        <span className="badge badge-info">Standard Suburb</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${loc.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {loc.is_active ? 'Active on Hero' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleToggle(loc)}
                          className="button button-sm button-outline"
                          title={loc.is_active ? 'Deactivate' : 'Activate'}
                        >
                          <Power size={14} color={loc.is_active ? 'var(--color-success)' : 'var(--color-text-muted)'} />
                        </button>
                        <button
                          onClick={() => openEdit(loc)}
                          className="button button-sm button-outline"
                          title="Edit location"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(loc.id)}
                          className="button button-sm button-outline"
                          style={{ color: 'var(--color-error)' }}
                          title="Delete location"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <h3>{editingId ? 'Edit Location' : 'Add New Location'}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: '0.25rem 0 1.25rem 0' }}>
              Locations configured here immediately populate the Hero Search Dropdown on the homepage.
            </p>

            {formError && (
              <div className="alert alert-error" style={{ marginBottom: '1rem', fontSize: 'var(--font-size-sm)' }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Suburb / Location Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Marion"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postcode *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. 5043"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">DIT Centre Name (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Marion DIT Centre"
                    value={formData.test_centre_name}
                    onChange={(e) => setFormData({ ...formData, test_centre_name: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.is_test_centre}
                    onChange={(e) => setFormData({ ...formData, is_test_centre: e.target.checked })}
                  />
                  <span>Mark as Official DIT VORT Test Hub (displays ★ DIT Centre in search)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span>Active &amp; Visible in Hero Search Dropdown</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="button button-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="button button-primary">
                  {saving ? 'Saving...' : editingId ? 'Update Location' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

