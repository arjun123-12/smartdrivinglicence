import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import bookingService from '../../services/bookingService';
import { extractArray, safeArray } from '../../utils/apiHelpers';
import { mockInstructors } from '../../services/mockData';
import {
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  Calendar,
  AlertCircle,
  MapPin,
  Sparkles,
  Search,
  Check,
  RefreshCw,
} from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AdminAvailability() {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [assignedLocationsCount, setAssignedLocationsCount] = useState(0);
  const [totalLocationsCount, setTotalLocationsCount] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exception form
  const [exDate, setExDate] = useState('');
  const [exReason, setExReason] = useState('Personal leave / holiday');
  const [savingException, setSavingException] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [assigningLocations, setAssigningLocations] = useState(false);
  const [seedingSchedules, setSeedingSchedules] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Live Slot Tester
  const [testDate, setTestDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [testSlots, setTestSlots] = useState([]);
  const [testingSlots, setTestingSlots] = useState(false);

  useEffect(() => {
    loadAvailability(selectedInstructorId);
  }, [selectedInstructorId]);

  const loadAvailability = async (id = '') => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await adminService.getAvailability(id ? { instructor_id: id } : {});
      const insts = extractArray(res?.instructors, mockInstructors);
      setInstructors(insts);

      const activeId = id || res?.selected_instructor_id?.toString() || (insts[0]?.id?.toString() || '1');
      setSelectedInstructorId(activeId);
      setSelectedInstructor(res?.selected_instructor || insts.find((i) => i.id?.toString() === activeId));
      setAssignedLocationsCount(res?.assigned_locations_count ?? 261);
      setTotalLocationsCount(res?.total_locations_count ?? 261);

      // Normalise schedules for all 7 days
      const rawScheds = extractArray(res?.schedules, []);
      const completeScheds = DAYS.map((_, dayIdx) => {
        const found = rawScheds.find((s) => s.day_of_week === dayIdx);
        return {
          day_of_week: dayIdx,
          start_time: found?.start_time ? found.start_time.slice(0, 8) : '08:00:00',
          end_time: found?.end_time ? found.end_time.slice(0, 8) : '17:30:00',
          is_active: found !== undefined ? Boolean(found.is_active) : true,
        };
      });

      setSchedules(completeScheds);
      setExceptions(extractArray(res?.exceptions, []));
    } catch (err) {
      console.warn('AdminAvailability load error, using fallback:', err);
      setInstructors(mockInstructors);
      if (mockInstructors.length > 0) setSelectedInstructorId(mockInstructors[0].id.toString());
      setSchedules(
        DAYS.map((_, dayIdx) => ({
          day_of_week: dayIdx,
          start_time: '08:00:00',
          end_time: '17:30:00',
          is_active: dayIdx !== 0, // Mon-Sat active
        }))
      );
      setExceptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (dayOfWeek, field, value) => {
    setSchedules((prev) => {
      const list = safeArray(prev);
      const exists = list.some((s) => s.day_of_week === dayOfWeek);
      if (exists) {
        return list.map((s) => (s.day_of_week === dayOfWeek ? { ...s, [field]: value } : s));
      }
      return [
        ...list,
        {
          day_of_week: dayOfWeek,
          start_time: '08:00:00',
          end_time: '17:30:00',
          is_active: true,
          [field]: value,
        },
      ];
    });
  };

  const applyPreset = (presetType) => {
    setSchedules((prev) =>
      safeArray(prev).map((s) => {
        if (presetType === 'all7') {
          return { ...s, is_active: true, start_time: '08:00:00', end_time: '17:30:00' };
        }
        if (presetType === 'weekdays') {
          return {
            ...s,
            is_active: s.day_of_week >= 1 && s.day_of_week <= 5,
            start_time: '08:00:00',
            end_time: '17:30:00',
          };
        }
        if (presetType === 'weekend') {
          return {
            ...s,
            is_active: s.day_of_week === 0 || s.day_of_week === 6,
            start_time: '09:00:00',
            end_time: '16:00:00',
          };
        }
        return s;
      })
    );
    setAlertMsg(`Preset "${presetType}" applied to form. Click "Save Weekly Schedule" to confirm.`);
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setSavingSchedule(true);
    setAlertMsg('');
    setErrorMsg('');
    try {
      await adminService.updateSchedule({
        instructor_id: selectedInstructorId,
        schedules: safeArray(schedules).map((s) => ({
          day_of_week: s.day_of_week,
          start_time: s.start_time.length === 5 ? s.start_time + ':00' : s.start_time,
          end_time: s.end_time.length === 5 ? s.end_time + ':00' : s.end_time,
          is_active: Boolean(s.is_active),
        })),
      });
      setAlertMsg('Weekly shift roster saved successfully for this instructor.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update working hours schedule.');
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleAssignAllLocations = async () => {
    if (!selectedInstructorId) return;
    setAssigningLocations(true);
    setAlertMsg('');
    setErrorMsg('');
    try {
      const res = await adminService.assignLocations({
        instructor_id: selectedInstructorId,
        assign_all: true,
      });
      setAlertMsg(res.message || 'Assigned instructor to all Adelaide suburbs and DIT test centres.');
      loadAvailability(selectedInstructorId);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to assign locations.');
    } finally {
      setAssigningLocations(false);
    }
  };

  const handleSeedAllInstructors = async () => {
    if (!confirm('Activate 7-day schedule (Mon-Sun 8:00 AM - 5:30 PM) for this instructor?')) return;
    setSeedingSchedules(true);
    setAlertMsg('');
    setErrorMsg('');
    try {
      const res = await adminService.seedDefaultSchedule(selectedInstructorId);
      setAlertMsg(res.message || '7-day schedule activated.');
      loadAvailability(selectedInstructorId);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to activate default schedule.');
    } finally {
      setSeedingSchedules(false);
    }
  };

  const handleAddException = async (e) => {
    e.preventDefault();
    if (!exDate) return;
    setSavingException(true);
    setAlertMsg('');
    setErrorMsg('');
    try {
      await adminService.createException({
        instructor_id: selectedInstructorId,
        date: exDate,
        is_unavailable: true,
        reason: exReason,
      });
      setAlertMsg('Blackout date / leave saved.');
      setExDate('');
      loadAvailability(selectedInstructorId);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Could not save exception.');
    } finally {
      setSavingException(false);
    }
  };

  const handleDeleteException = async (id) => {
    try {
      await adminService.deleteException(id);
      setAlertMsg('Exception removed.');
      loadAvailability(selectedInstructorId);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Could not delete exception.');
    }
  };

  const handleRunLiveTest = async () => {
    if (!testDate) return;
    setTestingSlots(true);
    try {
      const res = await bookingService.searchAvailability({
        service_type_id: 1, // VORT
        location_id: 11, // Elizabeth
        date: testDate,
        instructor_id: selectedInstructorId,
      });
      setTestSlots(extractArray(res?.slots, []));
    } catch (err) {
      console.warn('Slot test error:', err);
      setTestSlots([]);
    } finally {
      setTestingSlots(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Instructor Availability & Roster</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Configure regular working shifts (Mon–Sun), Adelaide suburb coverage, and blackout dates for bookings
          </p>
        </div>

        {/* Instructor picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            SELECT INSTRUCTOR:
          </span>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '240px', fontWeight: 600 }}
            value={selectedInstructorId}
            onChange={(e) => setSelectedInstructorId(e.target.value)}
          >
            {safeArray(instructors).map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name} {inst.is_examiner ? '★ (VORT Examiner)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Suburb Coverage & Fast Preset Banner */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          backgroundColor: 'var(--color-surface-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
            }}
          >
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              Adelaide Suburb & Test Centre Coverage
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Assigned to{' '}
              <strong style={{ color: 'var(--color-primary)' }}>
                {assignedLocationsCount} / {totalLocationsCount || 261}
              </strong>{' '}
              locations {assignedLocationsCount >= (totalLocationsCount || 261) ? '✓ (Full Greater Adelaide Coverage)' : ''}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAssignAllLocations}
            disabled={assigningLocations}
            className="button button-sm button-outline"
            title="Link this instructor to all 261 Greater Adelaide suburbs and test hubs"
          >
            <Sparkles size={14} /> {assigningLocations ? 'Assigning...' : 'Assign All Adelaide Suburbs & Centres'}
          </button>
          <button
            type="button"
            onClick={handleSeedAllInstructors}
            disabled={seedingSchedules}
            className="button button-sm button-secondary"
            title="Ensure 7-day shifts are active (8:00 AM - 5:30 PM)"
          >
            <RefreshCw size={14} /> {seedingSchedules ? 'Activating...' : 'Activate Full 7-Day Shifts'}
          </button>
        </div>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', gap: '2rem' }}>
        {/* Weekly Shifts */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div className="flex-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--color-secondary)" /> Regular Weekly Working Shifts
            </h3>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => applyPreset('all7')}
                className="button button-xs button-outline"
                title="Mon to Sun 8:00 AM - 5:30 PM"
              >
                All 7 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset('weekdays')}
                className="button button-xs button-outline"
                title="Mon to Fri only"
              >
                Mon–Fri
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveSchedule}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {DAYS.map((dayName, dayIdx) => {
                const sched = schedules.find((s) => s.day_of_week === dayIdx) || {
                  day_of_week: dayIdx,
                  start_time: '08:00:00',
                  end_time: '17:30:00',
                  is_active: false,
                };

                return (
                  <div
                    key={dayIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: sched.is_active ? 'var(--color-surface-subtle)' : '#f8fafc',
                      border: sched.is_active ? '1px solid var(--color-border)' : '1px dashed #cbd5e1',
                      opacity: sched.is_active ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <label
                      style={{
                        width: '120px',
                        fontWeight: 700,
                        fontSize: 'var(--font-size-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        color: sched.is_active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(sched.is_active)}
                        onChange={(e) => handleScheduleChange(dayIdx, 'is_active', e.target.checked)}
                      />
                      {dayName}
                    </label>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
                      <input
                        type="time"
                        className="form-control"
                        style={{ padding: '0.35rem 0.5rem', width: '130px', fontSize: '0.875rem' }}
                        disabled={!sched.is_active}
                        value={sched.start_time?.slice(0, 5) || '08:00'}
                        onChange={(e) => handleScheduleChange(dayIdx, 'start_time', e.target.value)}
                      />
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>to</span>
                      <input
                        type="time"
                        className="form-control"
                        style={{ padding: '0.35rem 0.5rem', width: '130px', fontSize: '0.875rem' }}
                        disabled={!sched.is_active}
                        value={sched.end_time?.slice(0, 5) || '17:30'}
                        onChange={(e) => handleScheduleChange(dayIdx, 'end_time', e.target.value)}
                      />
                    </div>

                    <span
                      className={`badge ${sched.is_active ? 'badge-success' : 'badge-danger'}`}
                      style={{ fontSize: '10px' }}
                    >
                      {sched.is_active ? 'Active' : 'Day Off'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                * Appointments generate automatically within active shift hours.
              </span>
              <button type="submit" disabled={savingSchedule} className="button button-primary">
                {savingSchedule ? 'Saving...' : 'Save Weekly Schedule'}
              </button>
            </div>
          </form>
        </div>

        {/* Leave & Blackout Exceptions + Live Tester */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Add Blackout Date */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--color-secondary)" /> Add Blackout Date / Leave
            </h3>

            <form onSubmit={handleAddException}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Date *</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={exDate}
                  onChange={(e) => setExDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Reason</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={exReason}
                  onChange={(e) => setExReason(e.target.value)}
                  placeholder="e.g. Annual leave, vehicle service, medical"
                />
              </div>

              <button type="submit" disabled={savingException} className="button button-outline button-full">
                <Plus size={16} /> {savingException ? 'Adding...' : 'Mark Full Day Unavailable'}
              </button>
            </form>

            {/* Exceptions list */}
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                UPCOMING LEAVE ENTRIES ({safeArray(exceptions).length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {safeArray(exceptions).length === 0 ? (
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    No upcoming leave or blackout days registered.
                  </div>
                ) : (
                  safeArray(exceptions).map((ex) => (
                    <div
                      key={ex.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'var(--color-surface-subtle)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-size-xs)',
                      }}
                    >
                      <div>
                        <strong>{new Date(ex.date).toLocaleDateString()}</strong>: {ex.reason}
                      </div>
                      <button
                        onClick={() => handleDeleteException(ex.id)}
                        className="button button-sm button-outline"
                        style={{ color: 'var(--color-error)', border: 'none', padding: '0.2rem 0.4rem' }}
                        title="Remove blackout"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Real-Time Live Slot Tester */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fdfbf7', border: '1px solid var(--color-border)' }}>
            <div className="flex-between" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={16} color="var(--color-secondary)" /> Live Appointment Slot Tester
              </div>
              <span className="badge badge-outline" style={{ fontSize: '10px' }}>
                Elizabeth (5112) Test Hub
              </span>
            </div>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Preview customer booking slots generated in real time for this instructor:
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="date"
                className="form-control"
                style={{ fontSize: '0.85rem', padding: '0.35rem 0.5rem' }}
                value={testDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setTestDate(e.target.value)}
              />
              <button
                type="button"
                onClick={handleRunLiveTest}
                disabled={testingSlots}
                className="button button-sm button-outline"
              >
                {testingSlots ? 'Querying...' : 'Test Date'}
              </button>
            </div>

            {testSlots.length > 0 ? (
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  ✓ {testSlots.length} Bookable Slots available on {testDate}:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxHeight: '120px', overflowY: 'auto' }}>
                  {testSlots.slice(0, 12).map((s, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.2rem 0.45rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {s.display_time} (${s.price})
                    </span>
                  ))}
                  {testSlots.length > 12 && (
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
                      +{testSlots.length - 12} more slots
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Click "Test Date" to verify customer slots for {testDate}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
