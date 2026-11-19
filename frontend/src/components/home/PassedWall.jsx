import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  CheckCircle,
  Trophy,
  ArrowUpRight,
} from 'lucide-react';

import '../../styles/passwall.css';

/* ==========================================
   LEARNERS DATA
========================================== */

const row1Learners = [
  {
    id: 1,
    name: 'Jackson',
    suburb: 'Warradale Park',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Jatin',
    suburb: 'Wynn Vale',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Jayden',
    suburb: 'Elizabeth',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Jonathan',
    suburb: 'Adelaide',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Alvin',
    suburb: 'Campbelltown',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    name: 'Anton',
    suburb: 'Flagstaff Hill',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  },
];

const row2Learners = [
  {
    id: 7,
    name: 'Tong',
    suburb: 'Norwood',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    name: 'Tyla',
    suburb: 'Greenwith',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 9,
    name: 'Vishnu',
    suburb: 'Prospect',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 10,
    name: 'Winnie',
    suburb: 'Happy Valley',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 11,
    isPlaceholder: true,
    text: 'Your journey starts here',
  },
  {
    id: 12,
    name: 'Liezel',
    suburb: 'Gilles Plains',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
];

/* ==========================================
   REUSABLE LEARNER CARD
========================================== */

function LearnerCard({ learner, isDemo }) {
  if (learner.isPlaceholder) {
    return (
      <Link
        to="/book-test"
        className="passwall-card-placeholder"
      >
        <div className="passwall-trophy-icon">
          <Trophy size={30} strokeWidth={1.6} />
        </div>

        <div className="passwall-placeholder-content">
          <span>YOUR NEXT MILESTONE</span>

          <strong>{learner.text}</strong>

          <p>Take the next step towards your licence.</p>
        </div>

        <div className="passwall-placeholder-arrow">
          <ArrowUpRight size={19} />
        </div>
      </Link>
    );
  }

  return (
    <article className="passwall-card">
      <img
        src={learner.image}
        alt={
          isDemo
            ? 'Sample learner portrait'
            : `Portrait of ${learner.name}`
        }
        className="passwall-card-img"
        loading="lazy"
        decoding="async"
      />

      <div className="passwall-card-overlay">

        {/* Top badges */}
        <div className="passwall-card-top">
          <div className="passwall-p-plate">P</div>

          <div className="passwall-success-badge">
            {!isDemo && <CheckCircle size={12} />}
            <span>{isDemo ? 'Sample' : 'Passed'}</span>
          </div>
        </div>

        {/* Learner information */}
        <div className="passwall-card-bottom">

          <h3 className="passwall-card-name">
            {learner.name}
          </h3>

          <div className="passwall-card-location">
            <MapPin size={13} />
            <span>{learner.suburb}</span>
          </div>

          <div className="passwall-card-watermark">
            A1 SMART DRIVING
          </div>

        </div>
      </div>
    </article>
  );
}

/* ==========================================
   MAIN PASSED WALL COMPONENT
========================================== */

export default function PassedWall() {
  const galleryRef = useRef(null);

  // Set false only after replacing sample data
  // with genuine learner records and photographs.
  const isDemo = true;

  const scrollGallery = (direction) => {
    if (!galleryRef.current) return;

    const gallery = galleryRef.current;

    const scrollDistance = gallery.clientWidth * 0.65;

    gallery.scrollBy({
      left:
        direction === 'left'
          ? -scrollDistance
          : scrollDistance,
      behavior: window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      className="passwall-section"
      aria-labelledby="passwall-heading"
    >
      <div className="passwall-container">

        {/* LEFT CONTENT */}
        <div className="passwall-content">

          <div className="passwall-tag">
            <span className="passwall-tag-dot" />
            CELEBRATING EVERY MILESTONE
          </div>

          <h2
            id="passwall-heading"
            className="passwall-title"
          >
            Passed with
            <br />
            <span>A1 Smart</span>
            <br />
            <span>Driving.</span>
          </h2>

          <p className="passwall-desc">
            Every driving journey deserves a celebration.
            Take the next step towards confidence,
            independence and your P-plates.
          </p>

          <div className="passwall-content-actions">
            <Link
              to="/book-test"
              className="passwall-btn"
            >
              Book your VORT
              <ArrowRight size={19} />
            </Link>

            <span className="passwall-cta-caption">
              Your journey. Your independence.
            </span>
          </div>

          {/* Gallery navigation */}
          <div className="passwall-navigation">

            <div className="passwall-navigation-label">
              <span>THE WALL OF FAME</span>
              <small>Explore the gallery</small>
            </div>

            <div className="passwall-navigation-buttons">
              <button
                type="button"
                onClick={() => scrollGallery('left')}
                className="passwall-nav-btn"
                aria-label="Scroll gallery left"
                aria-controls="passwall-gallery"
              >
                <ArrowLeft size={19} />
              </button>

              <button
                type="button"
                onClick={() => scrollGallery('right')}
                className="passwall-nav-btn"
                aria-label="Scroll gallery right"
                aria-controls="passwall-gallery"
              >
                <ArrowRight size={19} />
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT GALLERY */}
        <div className="passwall-gallery-wrap">

          <div className="passwall-gallery-heading">
            <div className="passwall-gallery-eyebrow">
              <Trophy size={17} />
              <span>Celebrating success</span>
            </div>

            <span className="passwall-gallery-count">
              {isDemo ? 'Sample gallery' : 'Our learners'}
            </span>
          </div>

          <div
            id="passwall-gallery"
            className="passwall-grid"
            ref={galleryRef}
            tabIndex={0}
            role="region"
            aria-label="Learner gallery"
          >

            {/* First Row */}
            <div className="passwall-row">
              {row1Learners.map((learner) => (
                <LearnerCard
                  key={learner.id}
                  learner={learner}
                  isDemo={isDemo}
                />
              ))}
            </div>

            {/* Second Row */}
            <div className="passwall-row">
              {row2Learners.map((learner) => (
                <LearnerCard
                  key={learner.id}
                  learner={learner}
                  isDemo={isDemo}
                />
              ))}
            </div>

          </div>

          <div className="passwall-gallery-footer">
            <span>
              {isDemo
                ? 'Illustrative gallery • Sample portraits'
                : 'Celebrating our Adelaide learners'}
            </span>

            <div className="passwall-scroll-indicator">
              <span>Scroll to explore</span>
              <ArrowRight size={14} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}