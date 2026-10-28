import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Calendar, User, LogOut, ArrowRightCircle } from 'lucide-react';

export default function CustomerSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="dashboard-sidebar">
      <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
          Customer Account
        </div>
        <div style={{ fontWeight: 700, fontSize: 'var(--font-size-base)', color: 'var(--color-primary)', marginTop: '0.25rem' }}>
          {user?.name}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>
          {user?.email}
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="dashboard-nav">
          <li className="dashboard-nav-item">
            <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'active' : '')}>
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/dashboard/bookings" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Calendar size={18} />
              <span>My Bookings</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
              <User size={18} />
              <span>My Profile & Licence</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/book-lesson" className="button button-sm button-secondary button-full">
          <ArrowRightCircle size={16} /> Book Next Lesson
        </NavLink>
        <button onClick={handleLogout} className="button button-sm button-outline button-full">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

