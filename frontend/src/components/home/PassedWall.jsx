import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, CheckCircle } from 'lucide-react';
import '../../styles/passwall.css';

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
    text: 'New passes every week',
  },
  {
    id: 12,
    name: 'Liezel',
    suburb: 'Gilles Plains',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
];

export default function PassedWall() {
  return (
    <section className="passwall-section">
      <div className="passwall-container">
        {/* Left Column */}
        <div className="passwall-content">
          <div className="passwall-tag">
            <span className="passwall-tag-dot" />
            New P-Platers Every Week
          </div>

          <h2 className="passwall-title">
            Passed with<br />LicenceMate
          </h2>

          <p className="passwall-desc">
            Real Adelaide learners, real P-plates — added to the wall every week.
          </p>

          <Link to="/book-test" className="passwall-btn">
            Book your VORT
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Right Gallery Wall */}
        <div className="passwall-gallery-wrap">
          <div className="passwall-grid">
            {/* Row 1 */}
            <div className="passwall-row">
              {row1Learners.map((learner) => (
                <div key={learner.id} className="passwall-card">
                  <img
                    src={learner.image}
                    alt={`${learner.name} passed driving test in ${learner.suburb}`}
                    className="passwall-card-img"
                    loading="lazy"
                  />
                  <div className="passwall-card-overlay">
                    <div className="passwall-p-plate">P</div>

                    <div className="passwall-card-bottom">
                      <span className="passwall-card-name">{learner.name}</span>
                      <span className="passwall-card-location">
                        <MapPin size={10} color="#ffb52e" />
                        {learner.suburb}
                      </span>
                      <span className="passwall-card-watermark">
                        ● LicenceMate
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div className="passwall-row">
              {row2Learners.map((learner) =>
                learner.isPlaceholder ? (
                  <div key={learner.id} className="passwall-card-placeholder">
                    {learner.text}
                  </div>
                ) : (
                  <div key={learner.id} className="passwall-card">
                    <img
                      src={learner.image}
                      alt={`${learner.name} passed driving test in ${learner.suburb}`}
                      className="passwall-card-img"
                      loading="lazy"
                    />
                    <div className="passwall-card-overlay">
                      <div className="passwall-p-plate">P</div>

                      <div className="passwall-card-bottom">
                        <span className="passwall-card-name">{learner.name}</span>
                        <span className="passwall-card-location">
                          <MapPin size={10} color="#ffb52e" />
                          {learner.suburb}
                        </span>
                        <span className="passwall-card-watermark">
                          ● LicenceMate
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

