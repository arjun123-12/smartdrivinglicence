import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public Pages
import Home from '../pages/Home';
import BookTest from '../pages/BookTest';
import BookLesson from '../pages/BookLesson';
import FirstLesson from '../pages/FirstLesson';
import MockTest from '../pages/MockTest';
import LessonPackages from '../pages/LessonPackages';
import HowItWorks from '../pages/HowItWorks';
import Locations from '../pages/Locations';
import Instructors from '../pages/Instructors';
import About from '../pages/About';
import Contact from '../pages/Contact';
import FAQs from '../pages/FAQs';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';

// Customer Pages
import CustomerDashboard from '../pages/customer/Dashboard';
import CustomerBookings from '../pages/customer/Bookings';
import CustomerProfile from '../pages/customer/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminBookings from '../pages/admin/Bookings';
import AdminInstructors from '../pages/admin/Instructors';
import AdminPackages from '../pages/admin/Packages';
import AdminCustomers from '../pages/admin/Customers';
import AdminServices from '../pages/admin/Services';
import AdminAvailability from '../pages/admin/Availability';
import AdminPayments from '../pages/admin/Payments';
import AdminFaqs from '../pages/admin/FAQs';
import AdminTestimonials from '../pages/admin/Testimonials';
import AdminSettings from '../pages/admin/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/book-test" element={<BookTest />} />
        <Route path="/book-lesson" element={<BookLesson />} />
        <Route path="/first-lesson" element={<FirstLesson />} />
        <Route path="/mock-test" element={<MockTest />} />
        <Route path="/lesson-packages" element={<LessonPackages />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Customer Protected Pages with CustomerLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      {/* Admin Protected Pages with AdminLayout */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="instructors" element={<AdminInstructors />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="availability" element={<AdminAvailability />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="faqs" element={<AdminFaqs />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

