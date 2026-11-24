import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import GlobalAtmosphere from '../components/3d/GlobalAtmosphere';
import { useAuth } from '../context/AuthContext';
import { useLenisSmoothScroll } from '../hooks/useLenisSmoothScroll';
import { Lock, LogOut } from 'lucide-react';

export default function PublicLayout() {
  const { isDevelopmentMode, hasPreviewAccess, user, logout } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Initialize smooth scrolling synchronized with GSAP ScrollTrigger
  useLenisSmoothScroll();

  return (
    <div
      className={`scene-perspective-container ${isHomePage ? 'has-homepage-hero' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: 'var(--color-background, #F8FAF8)',
      }}
    >
      {/* Global 3D Ambient WebGL Background */}
      <GlobalAtmosphere />

      {isDevelopmentMode && hasPreviewAccess && (
        <div
          style={{
            background: 'linear-gradient(90deg, #0d2645 0%, #1b6c31 100%)',
            color: '#ffffff',
            padding: '0.45rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            position: 'sticky',
            top: 0,
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Lock size={13} />
            <span>
              <strong>Private Preview Active:</strong> Logged in as{' '}
              {user?.name || user?.email || 'Authorized Previewer'} ({user?.role === 'admin' ? 'Administrator' : 'QA Tester'})
            </span>
          </div>
          <button
            type="button"
            onClick={logout}
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <LogOut size={11} />
            <span>Exit Preview</span>
          </button>
        </div>
      )}

      <Navbar isHomePage={isHomePage} />

      <main key={location.pathname} className={`immersive-page-wrapper ${isHomePage ? 'is-homepage-main' : ''}`} style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
