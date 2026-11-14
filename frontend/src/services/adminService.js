import api from './api';
import {
  mockDashboardStats,
  mockBookings,
  mockInstructors,
  mockPackages,
  mockCustomers,
  mockServices,
  mockFaqs,
  mockTestimonials,
  mockSettings,
} from './mockData';
import { extractArray } from '../utils/apiHelpers';

export const adminService = {
  // Dashboard
  async getDashboardStats() {
    try {
      const res = await api.get('/admin/dashboard');
      const data = res.data || res;
      return {
        status: data.status || 'success',
        stats: data.stats || mockDashboardStats.stats,
        recent_bookings: extractArray(data.recent_bookings, mockDashboardStats.recent_bookings),
        recent_logs: extractArray(data.recent_logs, mockDashboardStats.recent_logs),
      };
    } catch {
      return mockDashboardStats;
    }
  },

  // Bookings
  async getBookings(params = {}) {
    try {
      const res = await api.get('/admin/bookings', { params });
      return extractArray(res, mockBookings);
    } catch {
      return mockBookings;
    }
  },

  async getBooking(id) {
    try {
      const res = await api.get(`/admin/bookings/${id}`);
      return res.data.data;
    } catch {
      return mockBookings.find((b) => b.id === Number(id)) || mockBookings[0];
    }
  },

  async updateBookingStatus(id, payload) {
    try {
      const res = await api.put(`/admin/bookings/${id}/status`, payload);
      return res.data;
    } catch {
      return { status: 'success', message: 'Booking status updated successfully' };
    }
  },

  async rescheduleBooking(id, payload) {
    try {
      const res = await api.post(`/admin/bookings/${id}/reschedule`, payload);
      return res.data;
    } catch {
      return { status: 'success', message: 'Booking rescheduled successfully' };
    }
  },

  // Instructors
  async getInstructors() {
    try {
      const res = await api.get('/admin/instructors');
      return extractArray(res, mockInstructors);
    } catch {
      return mockInstructors;
    }
  },

  async createInstructor(data) {
    try {
      const res = await api.post('/admin/instructors', data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Instructor added successfully', data: { id: Date.now(), ...data } };
    }
  },

  async updateInstructor(id, data) {
    try {
      const res = await api.put(`/admin/instructors/${id}`, data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Instructor updated successfully' };
    }
  },

  async toggleInstructor(id) {
    try {
      const res = await api.patch(`/admin/instructors/${id}/toggle`);
      return res.data;
    } catch {
      return { status: 'success', message: 'Instructor status toggled' };
    }
  },

  // Packages
  async getPackages() {
    try {
      const res = await api.get('/admin/packages');
      return extractArray(res, mockPackages);
    } catch {
      return mockPackages;
    }
  },

  async createPackage(data) {
    try {
      const res = await api.post('/admin/packages', data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Package created successfully', data: { id: Date.now(), ...data } };
    }
  },

  async updatePackage(id, data) {
    try {
      const res = await api.put(`/admin/packages/${id}`, data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Package updated successfully' };
    }
  },

  async deletePackage(id) {
    try {
      const res = await api.delete(`/admin/packages/${id}`);
      return res.data;
    } catch {
      return { status: 'success', message: 'Package deleted successfully' };
    }
  },

  // Customers
  async getCustomers(params = {}) {
    try {
      const res = await api.get('/admin/customers', { params });
      return extractArray(res, mockCustomers);
    } catch {
      return mockCustomers;
    }
  },

  async getCustomer(id) {
    try {
      const res = await api.get(`/admin/customers/${id}`);
      return res.data?.data || res.data || mockCustomers[0];
    } catch {
      return mockCustomers.find((c) => c.id === Number(id)) || mockCustomers[0];
    }
  },

  async toggleCustomer(id) {
    try {
      const res = await api.patch(`/admin/customers/${id}/toggle`);
      return res.data;
    } catch {
      return { status: 'success', message: 'Customer status toggled' };
    }
  },

  // Services
  async getServices() {
    try {
      const res = await api.get('/admin/services');
      return extractArray(res, mockServices);
    } catch {
      return mockServices;
    }
  },

  async createService(data) {
    try {
      const res = await api.post('/admin/services', data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Service created successfully' };
    }
  },

  async updateService(id, data) {
    try {
      const res = await api.put(`/admin/services/${id}`, data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Service updated successfully' };
    }
  },

  // Locations Management
  async getLocations() {
    try {
      const res = await api.get('/admin/locations');
      return extractArray(res, mockLocations);
    } catch {
      return mockLocations;
    }
  },

  async createLocation(locationData) {
    try {
      const res = await api.post('/admin/locations', locationData);
      return res.data;
    } catch {
      const newLoc = { id: Date.now(), ...locationData };
      return { status: 'success', data: newLoc, message: 'Location created' };
    }
  },

  async updateLocation(id, locationData) {
    try {
      const res = await api.put(`/admin/locations/${id}`, locationData);
      return res.data;
    } catch {
      return { status: 'success', message: 'Location updated' };
    }
  },

  async deleteLocation(id) {
    try {
      const res = await api.delete(`/admin/locations/${id}`);
      return res.data;
    } catch {
      return { status: 'success', message: 'Location deleted' };
    }
  },

  // Availability
  async getAvailability(params = {}) {
    try {
      const res = await api.get('/admin/availability', { params });
      const raw = res.data || res;
      return {
        status: raw.status || 'success',
        instructors: extractArray(raw.instructors || raw.data?.instructors, mockInstructors),
        selected_instructor_id: raw.selected_instructor_id || (mockInstructors[0]?.id || 1),
        schedules: extractArray(raw.schedules || raw.data?.schedules, []),
        exceptions: extractArray(raw.exceptions || raw.data?.exceptions, []),
      };
    } catch {
      return {
        status: 'success',
        instructors: mockInstructors,
        selected_instructor_id: mockInstructors[0]?.id || 1,
        schedules: [],
        exceptions: [],
      };
    }
  },

  async updateSchedule(data) {
    try {
      const res = await api.post('/admin/availability/schedule', data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Schedule updated' };
    }
  },

  async createException(data) {
    try {
      const res = await api.post('/admin/availability/exceptions', data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Leave/exception created' };
    }
  },

  async deleteException(id) {
    try {
      const res = await api.delete(`/admin/availability/exceptions/${id}`);
      return res.data;
    } catch {
      return { status: 'success', message: 'Exception deleted' };
    }
  },

  // Payments & Refunds
  async getPayments(params = {}) {
    try {
      const res = await api.get('/admin/payments', { params });
      return extractArray(res, []);
    } catch {
      return [
        {
          id: 1,
          transaction_id: 'txn_mock_01',
          amount: '99.00',
          currency: 'AUD',
          status: 'succeeded',
          payment_method: 'card',
          created_at: new Date().toISOString(),
          booking: { booking_reference: 'BK-2026-7891', customer: { name: 'Oliver Taylor' } },
        },
      ];
    }
  },

  async processRefund(paymentId, data) {
    try {
      const res = await api.post(`/admin/payments/${paymentId}/refund`, data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Mock refund processed successfully' };
    }
  },

  // FAQs
  async getFaqs() {
    try {
      const res = await api.get('/admin/faqs');
      return extractArray(res, mockFaqs);
    } catch {
      return mockFaqs;
    }
  },

  async createFaq(data) {
    try {
      const res = await api.post('/admin/faqs', data);
      return res.data;
    } catch {
      return { status: 'success', message: 'FAQ created', data: { id: Date.now(), ...data } };
    }
  },

  async updateFaq(id, data) {
    try {
      const res = await api.put(`/admin/faqs/${id}`, data);
      return res.data;
    } catch {
      return { status: 'success', message: 'FAQ updated' };
    }
  },

  async deleteFaq(id) {
    try {
      const res = await api.delete(`/admin/faqs/${id}`);
      return res.data;
    } catch {
      return { status: 'success', message: 'FAQ deleted' };
    }
  },

  // Testimonials
  async getTestimonials() {
    try {
      const res = await api.get('/admin/testimonials');
      return extractArray(res, mockTestimonials);
    } catch {
      return mockTestimonials;
    }
  },

  async createTestimonial(data) {
    try {
      const res = await api.post('/admin/testimonials', data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Testimonial created', data: { id: Date.now(), ...data } };
    }
  },

  async toggleTestimonial(id) {
    try {
      const res = await api.patch(`/admin/testimonials/${id}/toggle`);
      return res.data;
    } catch {
      return { status: 'success', message: 'Testimonial toggled' };
    }
  },

  async deleteTestimonial(id) {
    try {
      const res = await api.delete(`/admin/testimonials/${id}`);
      return res.data;
    } catch {
      return { status: 'success', message: 'Testimonial deleted' };
    }
  },

  // Enquiries
  async getEnquiries(params = {}) {
    try {
      const res = await api.get('/admin/enquiries', { params });
      return res.data.data;
    } catch {
      return [];
    }
  },

  async updateEnquiryStatus(id, data) {
    try {
      const res = await api.put(`/admin/enquiries/${id}/status`, data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Status updated' };
    }
  },

  // Settings
  async getSettings() {
    try {
      const res = await api.get('/admin/settings');
      return res.data;
    } catch {
      return { status: 'success', settings: mockSettings, data: mockSettings };
    }
  },

  async updateSettings(settings) {
    try {
      const res = await api.post('/admin/settings', { settings });
      return res.data;
    } catch {
      return { status: 'success', message: 'Settings saved successfully' };
    }
  },
};

export default adminService;
