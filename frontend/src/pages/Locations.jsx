import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookingService from '../services/bookingService';
import { extractArray, safeArray } from '../utils/apiHelpers';
import { mockLocations } from '../services/mockData';
import TiltCard from '../components/effects/TiltCard';
import ScrollReveal from '../components/effects/ScrollReveal';
import PageHeading from '../components/typography/PageHeading';
import SectionHeading from '../components/typography/SectionHeading';
import { MapPin, Search, CheckCircle, Car, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await bookingService.getLocations();
        setLocations(extractArray(data, mockLocations));
      } catch (err) {
        console.warn('Locations load caught error, using fallback:', err);
        setLocations(mockLocations);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = safeArray(locations).filter((loc) => {
    if (!loc) return false;
    const q = (search || '').toLowerCase();
    const name = (loc.name || '').toLowerCase();
    const postcode = (loc.postcode || '').toString();
    return name.includes(q) || postcode.includes(q);
  });

  const testCentres = filtered.filter((l) => Boolean(l.is_test_centre));
  const suburbs = filtered.filter((l) => !l.is_test_centre);

  return (
    <div>
      <PageHeading
        className="premium-page-hero--road"
        badge="Greater Adelaide & Regional SA"
        badgeIcon={MapPin}
        liveDot={true}
        title="Service Locations & Official VORT Test Hubs"
        highlightWord="VORT Test Hubs"
        subtitle="We cover all designated South Australian Government test centres and provide door-to-door lesson pickups across metropolitan Adelaide."
      />

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
          <SectionHeading
            eyebrow="Official DIT Hubs"
            title="Designated VORT Test Centres"
            highlightWord="Test Centres"
            align="left"
            size="sm"
            theme="light"
          />

          <div className="grid grid-3">
            {safeArray(testCentres).map((centre, idx) => (
              <ScrollReveal key={centre.id} direction="up" distance={30} delay={idx * 0.08}>
                <TiltCard maxTilt={8} scale={1.02} style={{ height: '100%' }}>
                  <div className="card" style={{ padding: '1.5rem', border: '2px solid var(--color-secondary)', height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }}>
                    <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                        {centre.name}
                      </div>
                      <span className="badge badge-info">Postcode {centre.postcode}</span>
                    </div>

                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                      Official DIT Test Location: <strong>{centre.test_centre_name || centre.name + ' Service Centre'}</strong>
                    </div>

                    <div style={{ fontSize: 'var(--font-size-xs)', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
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

                    <Link to={`/book-test?location_id=${centre.id}`} className="button button-accent button-sm button-full" style={{ marginTop: 'auto' }}>
                      Book Test at {centre.name} <ArrowRight size={14} />
                    </Link>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Section 2: Lesson Coverage Suburbs */}
        <div>
          <SectionHeading
            eyebrow="Door-to-Door Pickup"
            title="Lesson Service Areas & Suburbs"
            highlightWord="Service Areas"
            align="left"
            size="sm"
            theme="light"
          />

          <div className="grid grid-4">
            {safeArray(suburbs).map((sub, idx) => (
              <ScrollReveal key={sub.id} direction="up" distance={25} delay={(idx % 4) * 0.08}>
                <TiltCard maxTilt={8} scale={1.02} style={{ height: '100%' }}>
                  <div className="card" style={{ padding: '1.25rem', height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{sub.name}</span>
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{sub.postcode}</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '1rem', flex: 1 }}>
                      Free instructor home/school pickup
                    </div>
                    <Link to={`/book-lesson?location_id=${sub.id}`} className="button button-outline button-sm button-full" style={{ marginTop: 'auto' }}>
                      Book in {sub.name}
                    </Link>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

