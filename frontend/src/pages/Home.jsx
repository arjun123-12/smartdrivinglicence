import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import packageService from '../services/packageService';
import instructorService from '../services/instructorService';
import api from '../services/api';
import Hero from '../components/home/Hero';
import OldWayVsNewWay from '../components/home/OldWayVsNewWay';
import PassedWall from '../components/home/PassedWall';
import WhatIsVort from '../components/home/WhatIsVort';
import StudentStories from '../components/home/StudentStories';
import WhyPreVort from '../components/home/WhyPreVort';
import FaqSection from '../components/home/FaqSection';
import ImportantInfo from '../components/home/ImportantInfo';
import {
  Car,
  Calendar,
  CheckCircle,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  ArrowRight,
  Sparkles,
  Phone,
  HelpCircle,
  Clock,
  Award,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  // Search widget states
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);

  const [searchLocation, setSearchLocation] = useState('');
  const [searchService, setSearchService] = useState('1'); // default VORT test

  useEffect(() => {
    async function loadData() {
      try {
        const [locsRes, servsRes, pkgsRes, instrsRes, testsRes, faqsRes] = await Promise.all([
          bookingService.getLocations(),
          bookingService.getServices(),
          packageService.getPackages(),
          instructorService.getInstructors(),
          api.get('/testimonials'),
          api.get('/faqs'),
        ]);

        setLocations(locsRes);
        setServices(servsRes);
        setPackages(pkgsRes);
        setInstructors(instrsRes.slice(0, 4));
        setTestimonials(testsRes.data.data.slice(0, 3));
        setFaqs(faqsRes.data.data.slice(0, 4));

        if (locsRes.length > 0) {
          setSearchLocation(locsRes[0].id.toString());
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/book-test?location_id=${searchLocation}&service_id=${searchService}`);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <Hero
        locations={locations}
        services={services}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        searchService={searchService}
        setSearchService={setSearchService}
        handleSearchSubmit={handleSearchSubmit}
      />

      {/* 2. OLD WAY VS LICENCEMATE WAY COMPARISON */}
      <OldWayVsNewWay />

      {/* 2. HOW IT WORKS */}
      <section className="section section-subtle">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple 4-Step Process</span>
            <h2 className="section-title">How Booking Works</h2>
            <p className="section-description">
              Getting your P-plates in South Australia is easy. Book your accredited instructor or VORT examiner in under 3 minutes.
            </p>
          </div>

          <div className="grid grid-4">
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <MapPin size={28} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>1. Choose Location</div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Select your Adelaide suburb or preferred test centre hub (Thebarton, Port Adelaide, Marion).
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Calendar size={28} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>2. Pick Date & Time</div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Real-time appointment slots from our verified database with immediate availability confirmation.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <ShieldCheck size={28} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>3. Secure Reservation</div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Instant card payment with atomic double-booking prevention and email confirmation.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <Car size={28} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>4. Pass Your Test</div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Your instructor meets you with a dual-control vehicle. Score 90%+ and obtain your Certificate of Competency!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PASSED WITH LICENCEMATE WALL */}
      <PassedWall />

      {/* 4. WHAT IS A VORT? */}
      <WhatIsVort />

      {/* 5. REAL SUCCESS STORIES FROM OUR STUDENTS */}
      <StudentStories />

      {/* 6. WHY CHOOSE PREVORT WARMUP + VORT? */}
      <WhyPreVort />

      {/* 4. POPULAR LESSON PACKAGES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Save with Package Bundles</span>
            <h2 className="section-title">South Australia Lesson Packages</h2>
            <p className="section-description">
              Compare package hours, pre-test warmups, and VORT exam inclusions. Backed by our high pass rate guarantee.
            </p>
          </div>

          <div className="grid grid-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`package-card card ${pkg.is_featured ? 'featured' : ''}`}>
                {pkg.is_featured && <div className="package-badge">Most Popular</div>}
                <div className="card-body">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{pkg.name}</h3>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {pkg.lesson_hours} Hours Total ({pkg.lesson_count} Lessons)
                  </div>

                  <div className="package-price">
                    ${pkg.current_price}
                    {pkg.original_price && (
                      <span className="package-price-original">${pkg.original_price}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Includes GST & Dual-Control Car</div>

                  <p style={{ fontSize: 'var(--font-size-xs)', margin: '1rem 0', color: 'var(--color-text)' }}>
                    {pkg.short_description}
                  </p>

                  <ul className="package-features">
                    {pkg.features?.map((f) => (
                      <li key={f.id}>
                        <CheckCircle size={15} color={f.is_highlighted ? 'var(--color-secondary)' : 'var(--color-success)'} style={{ flexShrink: 0 }} />
                        <span>{f.feature_text}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/book-lesson?package_id=${pkg.id}`}
                    className={`button button-full ${pkg.is_featured ? 'button-accent' : 'button-primary'}`}
                    style={{ marginTop: 'auto' }}
                  >
                    Select Package
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/first-lesson" className="button button-outline button-lg">
              Not sure which package fits your logbook hours? Take our 60-Second Quiz <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED INSTRUCTORS & EXAMINERS */}
      <section className="section section-subtle">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Qualified Professionals</span>
            <h2 className="section-title">Meet Our Adelaide Instructors & Examiners</h2>
            <p className="section-description">
              All instructors hold current South Australian Motor Driving Instructor licenses, Working with Children clearances, and dual-controlled 5-star ANCAP vehicles.
            </p>
          </div>

          <div className="grid grid-4">
            {instructors.map((inst) => (
              <div key={inst.id} className="instructor-card card">
                <img
                  src={inst.profile_image}
                  alt={inst.name}
                  style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', border: '3px solid #ffffff', boxShadow: 'var(--shadow-sm)' }}
                />
                <h4 style={{ marginBottom: '0.25rem' }}>{inst.name}</h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  {inst.is_examiner ? (
                    <span className="badge badge-success">Authorised VORT Examiner</span>
                  ) : (
                    <span className="badge badge-info">Accredited Instructor</span>
                  )}
                </div>

                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '1rem', flex: 1 }}>
                  {inst.bio?.slice(0, 110)}...
                </p>

                <div style={{ width: '100%', fontSize: 'var(--font-size-xs)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginBottom: '1rem', textAlign: 'left' }}>
                  <div><strong>Vehicle:</strong> {inst.car_model} ({inst.car_transmission.toUpperCase()})</div>
                  <div><strong>Rate:</strong> ${inst.base_hourly_rate}/hr {inst.vort_test_rate > 0 && `| VORT: $${inst.vort_test_rate}`}</div>
                </div>

                <Link to={`/book-lesson?instructor_id=${inst.id}`} className="button button-outline button-sm button-full">
                  Book with {inst.name.split(' ')[0]}
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/instructors" className="button button-outline">
              View All Instructors & Test Hubs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <FaqSection faqs={faqs} />

      {/* 9. IMPORTANT INFORMATION */}
      <ImportantInfo />

      {/* 7. BOTTOM CTA */}
      <section className="section section-primary" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Get Your P-Plates?</h2>
          <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: '2rem' }}>
            Book your driving lesson or official South Australian VORT test online today. Instant confirmation with accredited examiners.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/book-test" className="button button-accent button-lg">
              Book a VORT Test Now
            </Link>
            <Link to="/contact" className="button button-outline-white button-lg">
              <Phone size={18} /> Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

