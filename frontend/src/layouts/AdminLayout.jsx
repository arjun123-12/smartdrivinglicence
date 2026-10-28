import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import AdminSidebar from '../components/layout/AdminSidebar';

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="dashboard-shell">
        <AdminSidebar />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

