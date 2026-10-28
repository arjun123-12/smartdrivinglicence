import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  MapPin,
  ChevronDown,
  CalendarDays,
  ArrowRight,
  LockKeyhole,
  Award,
  CheckCircle,
  CarFront,
} from 'lucide-react';
import '../../styles/hero.css';

export default function Hero({
  locations = [],
  services = [],
  searchLocation = '',
  setSearchLocation = () => {},
  searchService = '',
  setSearchService = () => {},
  handleSearchSubmit = () => {},
}) {
  return (
    <section className="hero hero-premium">
      <div className="hero-background" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="container hero-grid hero-premium-grid">
        {/* Left content */}
        <div className="hero-content">
          <span className="section-tag hero-premium-tag">
            <span className="hero-tag-dot" />
            South Australian Driving & VORT Hub
          </span>

          <h1 className="hero-title">
            Your Road to
            <br />
            Driving Confidence
            <br />
            <span>Starts Here.</span>
          </h1>

          <p className="hero-description">
            Book driving lessons and VORT tests online. Discover
            local instructors, compare services, and find a
            convenient time to get on the road across Adelaide.
          </p>

          <div className="hero-trust-row">
            <div className="hero-trust-icon">
              <ShieldCheck size={19} />
            </div>
            <div>
              <strong>Quality-focused driving support</strong>
              <span>Lessons, test preparation and online booking</span>
            </div>
          </div>

          {/* Booking search card */}
          <form
            onSubmit={handleSearchSubmit}
            className="hero-search-card"
          >
            <div className="hero-search-heading">
              <div className="hero-search-icon">
                <Search size={21} />
              </div>
              <div>
                <h2>Find Your Driving Service</h2>
                <p>Choose your location and service to get started.</p>
              </div>
            </div>

            <div className="hero-search-fields">
              <div className="hero-field">
                <label htmlFor="hero-location">
                  Your suburb or test centre
                </label>
                <div className="hero-select-wrap">
                  <MapPin size={18} />
                  <select
                    id="hero-location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    required
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.postcode})
                        {loc.is_test_centre ? ' ★ DIT Centre' : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="hero-select-arrow" />
                </div>
              </div>

              <div className="hero-field">
                <label htmlFor="hero-service">Service required</label>
                <div className="hero-select-wrap">
                  <CalendarDays size={18} />
                  <select
                    id="hero-service"
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    required
                  >
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} — from ${srv.default_price} AUD
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="hero-select-arrow" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="hero-search-submit"
            >
              Find Available Slots
              <ArrowRight size={19} />
            </button>

            <p className="hero-search-note">
              <LockKeyhole size={14} />
              Easy online booking for your next driving step
            </p>
          </form>

          {/* Main calls to action */}
          <div className="hero-actions hero-premium-actions">
            <Link to="/book-test" className="button button-accent button-lg">
              Book a VORT Test <ArrowRight size={17} />
            </Link>

            <Link
              to="/book-lesson"
              className="button button-outline-white button-lg"
            >
              Explore Driving Lessons
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="hero-stats hero-premium-stats">
            <div>
              <div className="hero-stat-value">Online</div>
              <div className="hero-stat-label">Convenient Booking</div>
            </div>
            <div>
              <div className="hero-stat-value">Local</div>
              <div className="hero-stat-label">Adelaide Instructors</div>
            </div>
            <div>
              <div className="hero-stat-value">Flexible</div>
              <div className="hero-stat-label">Service Options</div>
            </div>
          </div>
        </div>

        {/* Right information panel */}
        <div className="hero-visual">
          <div className="hero-floating-badge">
            <span className="hero-live-dot" />
            <span>Start Your Journey</span>
          </div>

          <div className="hero-info-card">
            <div className="hero-info-top">
              <div className="hero-info-icon">
                <Award size={26} />
              </div>
              <div>
                <span className="hero-info-eyebrow">
                  YOUR DRIVING JOURNEY
                </span>
                <h2>Prepare. Practise. Drive.</h2>
              </div>
            </div>

            <p className="hero-info-description">
              Find the right service for your needs and take the next
              step towards becoming a confident driver.
            </p>

            <div className="hero-feature-list">
              <div className="hero-feature">
                <span><CheckCircle size={19} /></span>
                <div>
                  <strong>Driving lessons</strong>
                  <p>Build skills with local instructors.</p>
                </div>
              </div>

              <div className="hero-feature">
                <span><CheckCircle size={19} /></span>
                <div>
                  <strong>VORT test preparation</strong>
                  <p>Prepare for your practical assessment.</p>
                </div>
              </div>

              <div className="hero-feature">
                <span><CheckCircle size={19} /></span>
                <div>
                  <strong>Find your location</strong>
                  <p>Explore available services around Adelaide.</p>
                </div>
              </div>
            </div>

            <Link
              to="/how-it-works"
              className="hero-info-link"
            >
              Discover How It Works
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="hero-bottom-note">
            <div className="hero-bottom-icon">
              <CarFront size={23} />
            </div>
            <div>
              <strong>Every journey starts somewhere.</strong>
              <span>Let's help you take the next step.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

