import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Package,
  UserCheck,
  Briefcase,
  Clock,
  CreditCard,
  HelpCircle,
  MessageSquareQuote,
  Settings,
  Mail,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="dashboard-sidebar" style={{ width: '270px' }}>
      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="badge badge-warning" style={{ fontSize: '10px' }}>ADMIN CONSOLE</span>
          <NavLink to="/" target="_blank" title="View Public Website" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
            <ExternalLink size={14} />
          </NavLink>
        </div>
        <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', marginTop: '0.4rem' }}>
          {user?.name}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          System Administrator
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
        <ul className="dashboard-nav">
          <li className="dashboard-nav-item">
            <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/admin/bookings" className={({ isActive }) => (isActive ? 'active' : '')}>
              <CalendarCheck size={17} />
              <span>Bookings</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/admin/instructors" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Users size={17} />
              <span>Instructors & Examiners</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/admin/availability" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Clock size={17} />
              <span>Availability & Leave</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/admin/packages" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Package size={17} />
              <span>Lesson Packages</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/admin/services" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Briefcase size={17} />
              <span>Services</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/admin/customers" className={({ isActive }) => (isActive ? 'active' : '')}>
              <UserCheck size={17} />
              <span>Customers</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/admin/payments" className={({ isActive }) => (isActive ? 'active' : '')}>
              <CreditCard size={17} />
              <span>Payments & Refunds</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/admin/faqs" className={({ isActive }) => (isActive ? 'active' : '')}>
              <HelpCircle size={17} />
              <span>FAQs</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/admin/testimonials" className={({ isActive }) => (isActive ? 'active' : '')}>
              <MessageSquareQuote size={17} />
              <span>Testimonials</span>
            </NavLink>
          </li>
          <li className="dashboard-nav-item">
            <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Settings size={17} />
              <span>Business Settings & Logs</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
        <button onClick={handleLogout} className="button button-sm button-outline button-full">
          <LogOut size={16} /> Admin Logout
        </button>
      </div>
    </aside>
  );
}

