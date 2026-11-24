import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import packageService from '../services/packageService';
import instructorService from '../services/instructorService';
import api from '../services/api';
import { extractArray, safeArray } from '../utils/apiHelpers';
import {
  mockLocations,
  mockServices,
  mockPackages,
  mockInstructors,
  mockTestimonials,
  mockFaqs,
} from '../services/mockData';
import Hero from '../components/home/Hero';
import StatCounter from '../components/home/StatCounter';
import BentoServices from '../components/home/BentoServices';
import RoadJourney from '../components/home/RoadJourney';
import InfiniteMarquee from '../components/home/InfiniteMarquee';
import OldWayVsNewWay from '../components/home/OldWayVsNewWay';
import PassedWall from '../components/home/PassedWall';
import WhatIsVort from '../components/home/WhatIsVort';
import StudentStories from '../components/home/StudentStories';
import WhyPreVort from '../components/home/WhyPreVort';
import FaqSection from '../components/home/FaqSection';
import ImportantInfo from '../components/home/ImportantInfo';
import TiltCard from '../components/effects/TiltCard';
import ScrollReveal from '../components/effects/ScrollReveal';
import MagneticButton from '../components/effects/MagneticButton';
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
  const [heroConfig, setHeroConfig] = useState({});

  const [searchLocation, setSearchLocation] = useState('');
  const [searchService, setSearchService] = useState('1'); // default VORT test

  useEffect(() => {
    async function loadData() {
      try {
        const results = await Promise.allSettled([
          bookingService.getLocations(),
          bookingService.getServices(),
          packageService.getPackages(),
          instructorService.getInstructors(),
          api.get('/testimonials'),
          api.get('/faqs'),
          bookingService.getPublicSettings(),
        ]);

        const locs = results[0].status === 'fulfilled' ? extractArray(results[0].value, mockLocations) : mockLocations;
        const servs = results[1].status === 'fulfilled' ? extractArray(results[1].value, mockServices) : mockServices;
        const pkgs = results[2].status === 'fulfilled' ? extractArray(results[2].value, mockPackages) : mockPackages;
        const instrs = results[3].status === 'fulfilled' ? extractArray(results[3].value, mockInstructors) : mockInstructors;
        const tests = results[4].status === 'fulfilled' ? extractArray(results[4].value, mockTestimonials) : mockTestimonials;
        const fqs = results[5].status === 'fulfilled' ? extractArray(results[5].value, mockFaqs) : mockFaqs;
        const pubSettings = results[6].status === 'fulfilled' ? (results[6].value || {}) : {};

        setLocations(locs);
        setServices(servs);
        setPackages(pkgs);
        setInstructors(instrs.slice(0, 4));
        setTestimonials(tests.slice(0, 3));
        setFaqs(fqs.slice(0, 4));
        setHeroConfig(pubSettings);

        if (locs.length > 0 && locs[0]?.id) {
          setSearchLocation(locs[0].id.toString());
        }
      } catch (err) {
        console.warn('Home page loadData caught error, using fallbacks:', err);
        setLocations(mockLocations);
        setServices(mockServices);
        setPackages(mockPackages);
        setInstructors(mockInstructors.slice(0, 4));
        setTestimonials(mockTestimonials.slice(0, 3));
        setFaqs(mockFaqs.slice(0, 4));
        setHeroConfig({});
        if (mockLocations.length > 0) {
          setSearchLocation(mockLocations[0].id.toString());
        }
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
        heroConfig={heroConfig}
      />

      {/* 2. ANIMATED STATISTICS & TRUST INDICATORS */}
      <StatCounter />

      {/* 3. MODERN BENTO GRID DRIVING SERVICES */}
      <BentoServices services={services} />

      {/* 4. OLD WAY VS A1 SMART DRIVING WAY COMPARISON */}
      <OldWayVsNewWay />

      {/* 5. SCROLL-DRIVEN 4-STEP ADELAIDE ROAD JOURNEY */}
      <RoadJourney />

      {/* 6. PASSED WITH A1 SMART DRIVING WALL & 3D TROPHY */}
      <PassedWall />

      {/* 7. INFINITE STUDENT PASS MARQUEE */}
      <InfiniteMarquee />

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
            {safeArray(packages).map((pkg, idx) => (
              <ScrollReveal key={pkg.id} direction="up" distance={30} delay={idx * 0.08}>
                <TiltCard maxTilt={8} scale={1.02} style={{ height: '100%' }}>
                  <div className={`package-card card ${pkg.is_featured ? 'featured' : ''}`} style={{ height: '100%', margin: 0 }}>
                    {pkg.is_featured && <div className="package-badge">Most Popular</div>}
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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

                      <ul className="package-features" style={{ marginBottom: '1.5rem', flex: 1 }}>
                        {safeArray(pkg.features).map((f) => (
                          <li key={f.id || f.feature_text}>
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
                </TiltCard>
              </ScrollReveal>
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
            {safeArray(instructors).map((inst, idx) => (
              <ScrollReveal key={inst.id} direction="up" distance={30} delay={idx * 0.08}>
                <TiltCard maxTilt={8} scale={1.02} style={{ height: '100%' }}>
                  <div className="instructor-card card" style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }}>
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
                      {(inst.bio || 'Professional South Australian accredited driving instructor.').slice(0, 110)}...
                    </p>

                    <div style={{ width: '100%', fontSize: 'var(--font-size-xs)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginBottom: '1rem', textAlign: 'left' }}>
                      <div><strong>Vehicle:</strong> {inst.car_model || 'Dual Control Car'} (Automatic)</div>
                      <div><strong>Rate:</strong> ${inst.base_hourly_rate || '85'}/hr {inst.vort_test_rate > 0 && `| VORT: $${inst.vort_test_rate}`}</div>
                    </div>

                    <Link to={`/book-lesson?instructor_id=${inst.id}`} className="button button-outline button-sm button-full" style={{ marginTop: 'auto' }}>
                      Book with {inst.name ? inst.name.split(' ')[0] : 'Instructor'}
                    </Link>
                  </div>
                </TiltCard>
              </ScrollReveal>
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
      <section className="section" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <ScrollReveal direction="scale" distance={30}>
            <TiltCard maxTilt={6} scale={1.01}>
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(27, 108, 49, 0.95) 0%, rgba(13, 38, 69, 0.95) 100%)',
                  padding: '3.5rem 2rem',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: 'var(--shadow-3d-floating)',
                }}
              >
                <span className="badge-3d" style={{ background: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.4)', color: '#ffffff', marginBottom: '1.25rem' }}>
                  South Australia Official Test Pathway
                </span>
                <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#ffffff', marginBottom: '1rem', fontWeight: 800 }}>
                  Ready to Get Your P-Plates?
                </h2>
                <p style={{ fontSize: '1.15rem', color: '#e2e8f0', marginBottom: '2.5rem', maxWidth: '620px', margin: '0 auto 2.5rem' }}>
                  Book your driving lesson or official South Australian VORT test online today. Instant real-time confirmation with accredited examiners.
                </p>
                <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <MagneticButton as={Link} to="/book-test" variant="gold">
                    <span>Book a VORT Test Now</span>
                    <ArrowRight size={18} />
                  </MagneticButton>
                  <MagneticButton as={Link} to="/contact" variant="outline" style={{ background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                    <Phone size={18} />
                    <span>Contact Support</span>
                  </MagneticButton>
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

