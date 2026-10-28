import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Car,
  Menu,
  X,
  UserRound,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Phone,
  Sparkles,
} from 'lucide-react';
import '../../styles/navbar.css';

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => {
    setMobileOpen(false);
    setResourcesOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { to: '/book-test', label: 'Book a Test' },
    { to: '/book-lesson', label: 'Driving Lessons' },
    { to: '/lesson-packages', label: 'Packages' },
    { to: '/instructors', label: 'Instructors' },
    { to: '/locations', label: 'Locations' },
  ];

  const resourceItems = [
    { to: '/first-lesson', label: 'First Lesson Quiz' },
    { to: '/mock-test', label: 'VORT Mock Test' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/faqs', label: 'FAQs' },
    { to: '/about', label: 'About Us' },
  ];

  const navClass = ({ isActive }) =>
    `sd-nav-link${isActive ? ' active' : ''}`;

  const renderNavItems = (items) =>
    items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={navClass}
        onClick={closeMenu}
      >
        {item.label}
      </NavLink>
    ));

  return (
    <header className="sd-header">
      {/* Slim announcement bar */}
      <div className="sd-topbar">
        <div className="sd-container sd-topbar-inner">
          <p>
            <Sparkles size={14} />
            <span>Your journey to confident driving starts here.</span>
          </p>

          <a href="tel:+61000000000" className="sd-topbar-contact">
            <Phone size={14} />
            <span>Talk to our team</span>
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="sd-mainbar">
        <div className="sd-container sd-mainbar-inner">
          <Link to="/" className="sd-brand" onClick={closeMenu}>
            <span className="sd-brand-icon">
              <Car size={27} strokeWidth={2.2} />
            </span>

            <span className="sd-brand-copy">
              <span className="sd-brand-name">
                Smart<span>Driving</span>
              </span>
              <span className="sd-brand-tagline">
                DRIVE WITH CONFIDENCE
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="sd-desktop-nav"
            aria-label="Main navigation"
          >
            {renderNavItems(navItems)}

            <div className="sd-resource-wrap">
              <button
                type="button"
                className={`sd-nav-link sd-resource-trigger${resourcesOpen ? ' active' : ''
                  }`}
                onClick={() => setResourcesOpen((open) => !open)}
                aria-expanded={resourcesOpen}
              >
                Resources
                <ChevronDown
                  size={15}
                  className={resourcesOpen ? 'sd-chevron-open' : ''}
                />
              </button>

              {resourcesOpen && (
                <div className="sd-resource-menu">
                  {renderNavItems(resourceItems)}
                </div>
              )}
            </div>
          </nav>

          {/* Account actions */}
          <div className="sd-header-actions">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="sd-admin-link"
                    onClick={closeMenu}
                  >
                    <ShieldCheck size={17} />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="sd-account-button"
                  onClick={closeMenu}
                >
                  <UserRound size={17} />
                  <span>Dashboard</span>
                </Link>

                <button
                  type="button"
                  className="sd-logout-button"
                  onClick={handleLogout}
                  aria-label="Log out"
                  title="Log out"
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="sd-login-button"
                  onClick={closeMenu}
                >
                  Log In
                </Link>

                <Link
                  to="/book-test"
                  className="sd-cta-button"
                  onClick={closeMenu}
                >
                  Book a Test
                  <span aria-hidden="true">↗</span>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="sd-mobile-toggle"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileOpen}
              aria-controls="sd-mobile-menu"
            >
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      <div
        id="sd-mobile-menu"
        className={`sd-mobile-menu${mobileOpen ? ' is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <nav className="sd-mobile-nav" aria-label="Mobile navigation">
          <p className="sd-mobile-label">EXPLORE</p>

          {renderNavItems(navItems)}
          {renderNavItems(resourceItems)}

          <div className="sd-mobile-divider" />

          <p className="sd-mobile-label">YOUR ACCOUNT</p>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={navClass}
                  onClick={closeMenu}
                >
                  <ShieldCheck size={18} />
                  Admin Panel
                </NavLink>
              )}

              <NavLink
                to="/dashboard"
                className={navClass}
                onClick={closeMenu}
              >
                <UserRound size={18} />
                My Dashboard
              </NavLink>

              <button
                type="button"
                className="sd-mobile-logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Log Out
              </button>
            </>
          ) : (
            <div className="sd-mobile-account-actions">
              <Link
                to="/login"
                className="sd-mobile-login"
                onClick={closeMenu}
              >
                Log In
              </Link>

              <Link
                to="/register"
                className="sd-cta-button sd-mobile-cta"
                onClick={closeMenu}
              >
                Create Account <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}

          <div className="sd-mobile-promo">
            <span className="sd-mobile-promo-icon">
              <Car size={22} />
            </span>
            <div>
              <strong>Ready to hit the road?</strong>
              <p>Take the next step towards your licence.</p>
              <Link to="/book-test" onClick={closeMenu}>
                Get started <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          className="sd-mobile-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}