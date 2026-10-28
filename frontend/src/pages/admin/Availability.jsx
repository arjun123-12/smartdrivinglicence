import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Clock, Plus, Trash2, CheckCircle, Calendar, AlertCircle } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AdminAvailability() {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exception form
  const [exDate, setExDate] = useState('');
  const [exReason, setExReason] = useState('Personal leave / holiday');
  const [savingException, setSavingException] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    loadAvailability(selectedInstructorId);
  }, [selectedInstructorId]);

  const loadAvailability = async (id = '') => {
    setLoading(true);
    try {
      const res = await adminService.getAvailability(id ? { instructor_id: id } : {});
      setInstructors(res.instructors || []);
      if (!selectedInstructorId && res.selected_instructor_id) {
        setSelectedInstructorId(res.selected_instructor_id.toString());
      }
      setSchedules(res.schedules || []);
      setExceptions(res.exceptions || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (dayOfWeek, field, value) => {
    setSchedules((prev) =>
      prev.map((s) => (s.day_of_week === dayOfWeek ? { ...s, [field]: value } : s))
    );
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setSavingSchedule(true);
    setAlertMsg('');
    try {
      await adminService.updateSchedule({
        instructor_id: selectedInstructorId,
        schedules: schedules.map((s) => ({
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time,
          is_active: s.is_active,
        })),
      });
      setAlertMsg('Working hours schedule updated.');
    } catch {
      alert('Failed to update working hours.');
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleAddException = async (e) => {
    e.preventDefault();
    if (!exDate) return;
    setSavingException(true);
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
    } catch {
      alert('Could not save exception.');
    } finally {
      setSavingException(false);
    }
  };

  const handleDeleteException = async (id) => {
    try {
      await adminService.deleteException(id);
      setAlertMsg('Exception deleted.');
      loadAvailability(selectedInstructorId);
    } catch {
      alert('Could not delete exception.');
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Instructor Availability & Roster</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
            Configure regular working shifts, holiday blackout dates, and dynamic appointment slots
          </p>
        </div>

        {/* Instructor picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)' }}>INSTRUCTOR:</span>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '220px' }}
            value={selectedInstructorId}
            onChange={(e) => setSelectedInstructorId(e.target.value)}
          >
            {instructors.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {alertMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} />
          <span>{alertMsg}</span>
        </div>
      )}

      <div className="grid grid-2" style={{ alignItems: 'start', gap: '2rem' }}>
        {/* Weekly Shifts */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--color-secondary)" /> Regular Weekly Working Shifts
          </h3>

          <form onSubmit={handleSaveSchedule}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: sched.is_active ? 'var(--color-surface-subtle)' : '#f8fafc',
                      opacity: sched.is_active ? 1 : 0.6,
                    }}
                  >
                    <label style={{ width: '110px', fontWeight: 600, fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={sched.is_active}
                        onChange={(e) => handleScheduleChange(dayIdx, 'is_active', e.target.checked)}
                      />
                      {dayName}
                    </label>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
                      <input
                        type="time"
                        className="form-control"
                        style={{ padding: '0.4rem' }}
                        disabled={!sched.is_active}
                        value={sched.start_time?.slice(0, 5) || '08:00'}
                        onChange={(e) => handleScheduleChange(dayIdx, 'start_time', e.target.value + ':00')}
                      />
                      <span style={{ color: 'var(--color-text-muted)' }}>to</span>
                      <input
                        type="time"
                        className="form-control"
                        style={{ padding: '0.4rem' }}
                        disabled={!sched.is_active}
                        value={sched.end_time?.slice(0, 5) || '17:30'}
                        onChange={(e) => handleScheduleChange(dayIdx, 'end_time', e.target.value + ':00')}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" disabled={savingSchedule} className="button button-primary">
                {savingSchedule ? 'Saving...' : 'Save Weekly Schedule'}
              </button>
            </div>
          </form>
        </div>

        {/* Leave & Blackout Exceptions */}
        <div>
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--color-secondary)" /> Add Blackout Date / Leave
            </h3>

            <form onSubmit={handleAddException}>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={exDate}
                  onChange={(e) => setExDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reason</label>
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
          </div>

          {/* Exceptions List */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Upcoming Leave & Exceptions ({exceptions.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {exceptions.length === 0 ? (
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  No upcoming exceptions or leave booked for this instructor.
                </div>
              ) : (
                exceptions.map((ex) => (
                  <div
                    key={ex.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'var(--color-error-bg)',
                      border: '1px solid var(--color-error-border)',
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
                      style={{ color: 'var(--color-error)', border: 'none', padding: '0.25rem 0.5rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

