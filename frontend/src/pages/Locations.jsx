import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { MapPin, Search, CheckCircle, Car, ArrowRight } from 'lucide-react';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await bookingService.getLocations();
        setLocations(data);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = locations.filter((loc) => {
    const q = search.toLowerCase();
    return loc.name.toLowerCase().includes(q) || loc.postcode.includes(q);
  });

  const testCentres = filtered.filter((l) => l.is_test_centre);
  const suburbs = filtered.filter((l) => !l.is_test_centre);

  return (
    <div>
      <section className="page-header">
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
            Greater Adelaide & Regional SA
          </span>
          <h1>Service Locations & Official VORT Test Hubs</h1>
          <p>
            We cover all designated South Australian Government test centres and provide door-to-door lesson pickups across metropolitan Adelaide.
          </p>
        </div>
      </section>

      <div className="container section">
        {/* Search bar */}
        <div className="card" style={{ padding: '1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={20} color="var(--color-text-muted)" />
            <input
              type="text"
              className="form-control"
              style={{ border: 'none', boxShadow: 'none', padding: '0.5rem 0' }}
              placeholder="Search suburb or postcode (e.g. 5000, Thebarton, Campbelltown)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Section 1: Official VORT Test Centres */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="flex" style={{ gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="badge badge-warning" style={{ fontSize: '12px' }}>OFFICIAL DIT HUBS</span>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Designated VORT Test Centres</h2>
          </div>

          <div className="grid grid-3">
            {testCentres.map((centre) => (
              <div key={centre.id} className="card" style={{ padding: '1.5rem', border: '2px solid var(--color-secondary)' }}>
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                    {centre.name}
                  </div>
                  <span className="badge badge-info">Postcode {centre.postcode}</span>
                </div>

                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Official DIT Test Location: <strong>{centre.test_centre_name || centre.name + ' Service Centre'}</strong>
                </div>

                <div style={{ fontSize: 'var(--font-size-xs)', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div className="flex" style={{ gap: '0.4rem', alignItems: 'center' }}>
                    <CheckCircle size={14} color="var(--color-success)" /> VORT test starting point
                  </div>
                  <div className="flex" style={{ gap: '0.4rem', alignItems: 'center' }}>
                    <CheckCircle size={14} color="var(--color-success)" /> Dual-control examiner vehicles
                  </div>
                  <div className="flex" style={{ gap: '0.4rem', alignItems: 'center' }}>
                    <CheckCircle size={14} color="var(--color-success)" /> PreVORT warmups available
                  </div>
                </div>

                <Link to={`/book-test?location_id=${centre.id}`} className="button button-accent button-sm button-full">
                  Book Test at {centre.name} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Lesson Coverage Suburbs */}
        <div>
          <div className="flex" style={{ gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="badge badge-success" style={{ fontSize: '12px' }}>DOOR-TO-DOOR PICKUP</span>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Lesson Service Areas & Suburbs</h2>
          </div>

          <div className="grid grid-4">
            {suburbs.map((sub) => (
              <div key={sub.id} className="card" style={{ padding: '1.25rem' }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{sub.name}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{sub.postcode}</span>
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Free instructor home/school pickup
                </div>
                <Link to={`/book-lesson?location_id=${sub.id}`} className="button button-outline button-sm button-full">
                  Book in {sub.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

