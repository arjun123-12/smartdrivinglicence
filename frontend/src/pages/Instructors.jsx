import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import instructorService from '../services/instructorService';
import bookingService from '../services/bookingService';
import { Star, ShieldCheck, Car, Award, MapPin, ArrowRight } from 'lucide-react';

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filterTransmission, setFilterTransmission] = useState('all');
  const [filterExaminerOnly, setFilterExaminerOnly] = useState(false);
  const [filterLocationId, setFilterLocationId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [insts, locs] = await Promise.all([
          instructorService.getInstructors(),
          bookingService.getLocations(),
        ]);
        setInstructors(insts);
        setLocations(locs);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = instructors.filter((inst) => {
    if (filterTransmission !== 'all') {
      if (inst.car_transmission !== filterTransmission && inst.car_transmission !== 'both') {
        return false;
      }
    }
    if (filterExaminerOnly && !inst.is_examiner) {
      return false;
    }
    if (filterLocationId) {
      const match = inst.locations?.some((l) => l.id.toString() === filterLocationId);
      if (!match) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div>
      <section className="page-header">
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
            Verified & Police Checked
          </span>
          <h1>Accredited Instructors & VORT Examiners</h1>
          <p>
            Connect with highly rated South Australian driving professionals. Experienced in guiding anxious beginners, refining logbook skills, and conducting official VORT testing.
          </p>
        </div>
      </section>

      <div className="container section">
        {/* Filters */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2.5rem', backgroundColor: 'var(--color-surface-subtle)' }}>
          <div className="grid grid-3" style={{ alignItems: 'end', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Transmission</label>
              <select
                className="form-select"
                value={filterTransmission}
                onChange={(e) => setFilterTransmission(e.target.value)}
              >
                <option value="all">All Transmissions</option>
                <option value="auto">Automatic Only</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Filter by Area / Hub</label>
              <select
                className="form-select"
                value={filterLocationId}
                onChange={(e) => setFilterLocationId(e.target.value)}
              >
                <option value="">All Adelaide Locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} {loc.is_test_centre ? '(VORT Hub)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', height: '42px', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                <input
                  type="checkbox"
                  checked={filterExaminerOnly}
                  onChange={(e) => setFilterExaminerOnly(e.target.checked)}
                />
                Authorised VORT Examiners Only
              </label>
            </div>
          </div>
        </div>

        {/* Instructor Cards */}
        <div className="grid grid-3">
          {filtered.map((inst) => (
            <div key={inst.id} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src={inst.profile_image}
                  alt={inst.name}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-surface-subtle)', flexShrink: 0 }}
                />
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{inst.name}</h3>
                  {inst.is_examiner ? (
                    <span className="badge badge-success" style={{ fontSize: '11px' }}>
                      <Award size={12} /> Authorised VORT Examiner
                    </span>
                  ) : (
                    <span className="badge badge-info" style={{ fontSize: '11px' }}>
                      <ShieldCheck size={12} /> Accredited Instructor
                    </span>
                  )}
                  {inst.examiner_accreditation_no && (
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      Accreditation #{inst.examiner_accreditation_no}
                    </div>
                  )}
                </div>
              </div>

              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}>
                {inst.bio}
              </p>

              <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)', marginBottom: '1.25rem' }}>
                <div><strong>Vehicle:</strong> {inst.car_model} ({inst.car_transmission.toUpperCase()})</div>
                <div><strong>Qualifications:</strong> {inst.qualifications || 'Cert IV Transport & Logistics'}</div>
                <div><strong>Hourly Rate:</strong> ${inst.base_hourly_rate} AUD {inst.vort_test_rate > 0 && `| VORT: $${inst.vort_test_rate} AUD`}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/book-lesson?instructor_id=${inst.id}`}
                  className="button button-primary button-sm"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Book Lesson
                </Link>
                {inst.is_examiner && (
                  <Link
                    to={`/book-test?instructor_id=${inst.id}`}
                    className="button button-accent button-sm"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Book VORT Test
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

