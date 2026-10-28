import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CustomerSidebar from '../components/layout/CustomerSidebar';
import Footer from '../components/layout/Footer';

export default function CustomerLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="dashboard-shell">
        <CustomerSidebar />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

