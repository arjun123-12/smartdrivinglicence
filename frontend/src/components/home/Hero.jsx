import React from 'react';
import { Link } from 'react-router-dom';

import {
  ShieldCheck,
  MapPin,
  ChevronDown,
  CalendarDays,
  ArrowRight,
  ArrowUpRight,
  LockKeyhole,
  GraduationCap,
  CarFront,
  Layers3,
  UsersRound,
  Headphones,
  Rocket,
  CheckCircle2,
} from 'lucide-react';

import '../../styles/hero.css';

export default function Hero({
  locations = [],
  services = [],
  searchLocation = '',
  setSearchLocation = () => { },
  searchService = '',
  setSearchService = () => { },
  handleSearchSubmit = () => { },
  heroConfig = {},
}) {
  const isEnabled = ![
    false,
    0,
    '0',
    'false',
  ].includes(heroConfig?.hero_search_enabled);

  const title =
    heroConfig?.hero_search_title ||
    'Find Your Driving Service';

  const subtitle =
    heroConfig?.hero_search_subtitle ||
    'Choose your location and service to get started.';

  const locationLabel =
    heroConfig?.hero_search_location_label ||
    'Your suburb or test centre';

  const serviceLabel =
    heroConfig?.hero_search_service_label ||
    'Service required';

  const buttonText =
    heroConfig?.hero_search_button_text ||
    'Find Available Slots';

  const noteText =
    heroConfig?.hero_search_note ||
    'Easy online booking for your next driving step';

  const benefits = [
    {
      icon: Rocket,
      title: 'Get Started Fast',
      description: 'Easy online booking',
    },
    {
      icon: UsersRound,
      title: 'Local Instructors',
      description: 'Friendly, patient and local',
    },
    {
      icon: ShieldCheck,
      title: 'Test Ready Support',
      description: 'Lessons and practical preparation',
    },
    {
      icon: Headphones,
      title: 'Local Adelaide Service',
      description: 'Across multiple locations',
    },
  ];

  return (
    <section className="sd-hero-v2">

      {/* =================================
          MAIN HERO BANNER
      ================================= */}

      <div className="sdh-banner">

        {/* Background Elements */}

        <div
          className="sdh-photo"
          aria-hidden="true"
        />

        <div
          className="sdh-overlay"
          aria-hidden="true"
        />

        <div
          className="sdh-road-shape"
          aria-hidden="true"
        />

        <div
          className="sdh-bottom-shape"
          aria-hidden="true"
        />

        <div className="sdh-container sdh-main-grid">

          {/* LEFT CONTENT */}

          <div className="sdh-content">

            <div className="sdh-eyebrow">
              <span className="sdh-eyebrow-line" />
              ADELAIDE DRIVING SCHOOL
            </div>

            <h1 className="sdh-title">
              Your Road to
              <br />

              Driving Confidence
              <br />

              <span>Starts Here.</span>
            </h1>

            <div
              className="sdh-title-line"
              aria-hidden="true"
            />

            <p className="sdh-description">
              Book driving lessons and VORT tests online.
              Discover local instructors, compare services,
              and find a convenient time to get on the road
              across Adelaide.
            </p>

            {/* Trust Features */}

            <div className="sdh-trust">

              <div className="sdh-trust-item">
                <span className="sdh-trust-icon">
                  <ShieldCheck size={23} />
                </span>

                <div>
                  <strong>Driving</strong>
                  <span>Instructors</span>
                </div>
              </div>

              <div className="sdh-trust-item">
                <span className="sdh-trust-icon">
                  <CalendarDays size={23} />
                </span>

                <div>
                  <strong>Flexible</strong>
                  <span>Scheduling</span>
                </div>
              </div>

              <div className="sdh-trust-item">
                <span className="sdh-trust-icon">
                  <MapPin size={23} />
                </span>

                <div>
                  <strong>Local</strong>
                  <span>Adelaide Support</span>
                </div>
              </div>

            </div>

            {/* CTA Buttons */}

            <div className="sdh-actions">

              <Link
                to="/book-test"
                className="sdh-btn sdh-btn-primary"
              >
                <CalendarDays size={20} />

                <span>Book a VORT Test</span>

                <ArrowRight size={20} />
              </Link>

              <Link
                to="/book-lesson"
                className="sdh-btn sdh-btn-outline"
              >
                <CarFront size={21} />

                <span>Explore Driving Lessons</span>
              </Link>

            </div>

          </div>

          {/* RIGHT IMAGE AREA */}

          <div className="sdh-visual">

            <Link
              to="/how-it-works"
              className="sdh-glass-card"
            >

              <div className="sdh-glass-icon">
                <GraduationCap size={30} strokeWidth={1.7} />
              </div>

              <div className="sdh-glass-content">

                <span>YOUR DRIVING JOURNEY</span>

                <h2>Prepare. Practise. Drive.</h2>

                <p>
                  Find the right service and take the next
                  step towards becoming a confident driver.
                </p>

              </div>

              <div className="sdh-glass-arrow">
                <ArrowUpRight size={22} />
              </div>

            </Link>

            <div
              className="sdh-image-caption"
              aria-hidden="true"
            >
              <span />
              YOUR JOURNEY. YOUR PACE.
            </div>

          </div>

        </div>

      </div>

      {/* =================================
          FLOATING BOOKING PANEL
      ================================= */}

      <div
        className={`sdh-container sdh-booking-wrapper ${!isEnabled ? 'sdh-no-booking' : ''
          }`}
      >

        {isEnabled && (
          <div className="sdh-booking">

            {/* Booking Navigation Tabs */}

            <div className="sdh-booking-tabs">

              <div className="sdh-tab sdh-tab-active">
                <CarFront size={22} />

                <span>{title}</span>
              </div>

              <Link
                to="/book-lesson"
                className="sdh-tab"
              >
                <CarFront size={21} />
                <span>Book a Driving Lesson</span>
              </Link>

              <Link
                to="/book-test"
                className="sdh-tab"
              >
                <CalendarDays size={21} />
                <span>Book a VORT Test</span>
              </Link>

              <Link
                to="/lesson-packages"
                className="sdh-tab"
              >
                <Layers3 size={21} />
                <span>Explore Packages</span>
              </Link>

            </div>

            {/* Dynamic Booking Form */}

            <form
              className="sdh-booking-form"
              onSubmit={handleSearchSubmit}
            >

              <p className="sdh-form-subtitle">
                {subtitle}
              </p>

              <div className="sdh-form-grid">

                {/* Location */}

                <div className="sdh-field">

                  <label htmlFor="hero-location">
                    <MapPin size={15} />
                    {locationLabel}
                  </label>

                  <div className="sdh-select">

                    <MapPin
                      size={20}
                      className="sdh-select-icon"
                    />

                    <select
                      id="hero-location"
                      value={searchLocation}
                      onChange={(e) =>
                        setSearchLocation(e.target.value)
                      }
                      required
                    >
                      <option value="" disabled>
                        Select your location
                      </option>

                      {(Array.isArray(locations)
                        ? locations
                        : []
                      ).map((loc) => (
                        <option
                          key={loc.id}
                          value={loc.id}
                        >
                          {loc.name} ({loc.postcode})
                          {loc.is_test_centre
                            ? ' ★ DIT Centre'
                            : ''}
                        </option>
                      ))}

                    </select>

                    <ChevronDown
                      size={18}
                      className="sdh-select-chevron"
                    />

                  </div>

                </div>

                {/* Service */}

                <div className="sdh-field">

                  <label htmlFor="hero-service">
                    <Layers3 size={15} />
                    {serviceLabel}
                  </label>

                  <div className="sdh-select">

                    <CalendarDays
                      size={20}
                      className="sdh-select-icon"
                    />

                    <select
                      id="hero-service"
                      value={searchService}
                      onChange={(e) =>
                        setSearchService(e.target.value)
                      }
                      required
                    >
                      <option value="" disabled>
                        Select your service
                      </option>

                      {(Array.isArray(services)
                        ? services
                        : []
                      ).map((srv) => (
                        <option
                          key={srv.id}
                          value={srv.id}
                        >
                          {srv.name}
                          {srv.default_price != null
                            ? ` — from $${srv.default_price} AUD`
                            : ''}
                        </option>
                      ))}

                    </select>

                    <ChevronDown
                      size={18}
                      className="sdh-select-chevron"
                    />

                  </div>

                </div>

                {/* Search Button */}

                <button
                  type="submit"
                  className="sdh-submit"
                >
                  <span>{buttonText}</span>
                  <ArrowRight size={21} />
                </button>

              </div>

              <div className="sdh-form-footer">

                <p>
                  <LockKeyhole size={13} />
                  {noteText}
                </p>

                <span>
                  <CheckCircle2 size={15} />
                  Online Booking
                </span>

              </div>

            </form>

          </div>
        )}

        {/* =================================
            BOTTOM BENEFITS
        ================================= */}

        <div className="sdh-benefits">

          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                className="sdh-benefit"
                key={item.title}
              >

                <span className="sdh-benefit-icon">
                  <Icon size={27} strokeWidth={1.8} />
                </span>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}