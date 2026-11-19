import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Car,
  Menu,
  X,
  UserRound,
  ShieldCheck,
  LogOut,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import '../../styles/navbar.css';

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setResourcesOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (resourceRef.current && !resourceRef.current.contains(event.target)) {
        setResourcesOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setResourcesOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

  return (
    <header className="sd-header">
      <div className="sd-mainbar">
        <div className="sd-container sd-mainbar-inner">
          {/* Brand Logo */}
          <Link to="/" className="sd-brand" onClick={closeMenu}>
            <img
              src="/logo.png"
              alt="A1 Smart Driving"
              className="sd-brand-logo-img"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="sd-desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navClass}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}

            {/* Resources Dropdown */}
            <div className="sd-resource-wrap" ref={resourceRef}>
              <button
                type="button"
                className={`sd-nav-link sd-resource-trigger${resourcesOpen ? ' active' : ''}`}
                onClick={() => setResourcesOpen((open) => !open)}
                aria-expanded={resourcesOpen}
              >
                <span>Resources</span>
                <ChevronDown size={15} className={`sd-chevron-icon ${resourcesOpen ? 'is-open' : ''}`} />
              </button>

              {resourcesOpen && (
                <div className="sd-resource-menu">
                  {resourceItems.map((res) => (
                    <NavLink
                      key={res.to}
                      to={res.to}
                      className={navClass}
                      onClick={closeMenu}
                    >
                      {res.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Header Action Buttons */}
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
                  <span>Book a Test</span>
                  <ArrowUpRight size={16} />
                </Link>
              </>
            )}

            {/* Mobile Toggle Button */}
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

      {/* Mobile Navigation Drawer */}
      <div
        id="sd-mobile-menu"
        className={`sd-mobile-menu${mobileOpen ? ' is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <nav className="sd-mobile-nav" aria-label="Mobile navigation">
          <p className="sd-mobile-label">EXPLORE</p>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navClass}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}

          {resourceItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navClass}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}

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
                  <span>Admin Panel</span>
                </NavLink>
              )}

              <NavLink
                to="/dashboard"
                className={navClass}
                onClick={closeMenu}
              >
                <UserRound size={18} />
                <span>My Dashboard</span>
              </NavLink>

              <button
                type="button"
                className="sd-mobile-logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Log Out</span>
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
                <span>Create Account</span>
                <ArrowUpRight size={15} />
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

      {/* Mobile Backdrop */}
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
