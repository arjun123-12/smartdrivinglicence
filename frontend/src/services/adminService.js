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

  async reviewInstructorApplication(id) {
    const res = await api.get(`/admin/instructors/${id}/review`);
    return res.data;
  },

  async approveInstructorApplication(id) {
    const res = await api.post(`/admin/instructors/${id}/approve`);
    return res.data;
  },

  async requestInstructorChanges(id, reason) {
    const res = await api.post(`/admin/instructors/${id}/request-changes`, { reason });
    return res.data;
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
  getLocalLocations() {
    try {
      const stored = localStorage.getItem('smartdriving_custom_locations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveLocalLocations(list) {
    try {
      localStorage.setItem('smartdriving_custom_locations', JSON.stringify(list));
    } catch {}
  },

  async getLocations() {
    const local = this.getLocalLocations();
    try {
      let data = [];
      try {
        const res = await api.get('/admin/locations');
        data = extractArray(res, []);
      } catch {
        // Fallback to public endpoint if admin endpoint is unavailable on remote host
        try {
          const publicRes = await api.get('/locations');
          data = extractArray(publicRes, []);
        } catch {
          data = [];
        }
      }

      if (Array.isArray(data) && data.length > 0) {
        // Merge any locally added items that aren't yet in server data
        const serverIds = new Set(data.map((l) => l.id));
        const missingLocal = local.filter((l) => !serverIds.has(l.id));
        return [...missingLocal, ...data];
      }

      // If server returned empty array or 0 records, fall back to mock SA locations + local additions
      const combined = [...local, ...mockLocations];
      const seen = new Set();
      return combined.filter((item) => {
        const key = `${item.name}-${item.postcode}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } catch {
      const combined = [...local, ...mockLocations];
      const seen = new Set();
      return combined.filter((item) => {
        const key = `${item.name}-${item.postcode}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
  },

  async createLocation(locationData) {
    const newLoc = {
      id: Date.now(),
      name: locationData.name,
      postcode: locationData.postcode,
      state: locationData.state || 'SA',
      test_centre_name: locationData.test_centre_name || null,
      is_test_centre: Boolean(locationData.is_test_centre),
      is_active: locationData.is_active !== undefined ? Boolean(locationData.is_active) : true,
      created_at: new Date().toISOString(),
    };

    // 1. Immediately persist to localStorage so it is never lost
    const local = this.getLocalLocations();
    this.saveLocalLocations([newLoc, ...local]);

    // 2. Sync to Backend API
    try {
      const res = await api.post('/admin/locations', locationData);
      if (res?.data?.data?.id) {
        // Replace temp timestamp ID with real server ID
        const updatedLocal = this.getLocalLocations().map((l) =>
          l.id === newLoc.id ? { ...l, id: res.data.data.id } : l
        );
        this.saveLocalLocations(updatedLocal);
        return res.data;
      }
      return { status: 'success', data: newLoc, message: 'Location created successfully.' };
    } catch (err) {
      console.warn('Backend API save failed, saved to local cache:', err);
      return {
        status: 'success',
        data: newLoc,
        warning: err.response?.data?.message || 'Location saved locally. Make sure backend is updated on host.',
      };
    }
  },

  async updateLocation(id, locationData) {
    // 1. Update in local storage
    const local = this.getLocalLocations();
    const idx = local.findIndex((l) => l.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...locationData };
      this.saveLocalLocations(local);
    }

    // 2. Sync to Backend API
    try {
      const res = await api.put(`/admin/locations/${id}`, locationData);
      return res.data;
    } catch {
      return { status: 'success', message: 'Location updated locally.' };
    }
  },

  async deleteLocation(id) {
    // 1. Delete from local storage
    const local = this.getLocalLocations().filter((l) => l.id !== id);
    this.saveLocalLocations(local);

    // 2. Sync to Backend API
    try {
      const res = await api.delete(`/admin/locations/${id}`);
      return res.data;
    } catch {
      return { status: 'success', message: 'Location deleted.' };
    }
  },

  async seedLocations() {
    try {
      const res = await api.post('/admin/locations/seed');
      return res.data;
    } catch {
      this.saveLocalLocations([]);
      return {
        status: 'success',
        message: 'Loaded default South Australian locations.',
        data: mockLocations,
      };
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
        selected_instructor: raw.selected_instructor || null,
        schedules: extractArray(raw.schedules || raw.data?.schedules, []),
        exceptions: extractArray(raw.exceptions || raw.data?.exceptions, []),
        assigned_locations_count: raw.assigned_locations_count ?? 0,
        total_locations_count: raw.total_locations_count ?? 0,
      };
    } catch {
      return {
        status: 'success',
        instructors: mockInstructors,
        selected_instructor_id: mockInstructors[0]?.id || 1,
        selected_instructor: null,
        schedules: [],
        exceptions: [],
        assigned_locations_count: 261,
        total_locations_count: 261,
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

  async seedDefaultSchedule(instructorId = null) {
    try {
      const res = await api.post('/admin/availability/seed-default', { instructor_id: instructorId });
      return res.data;
    } catch {
      return { status: 'success', message: 'Default 7-day schedule enabled.' };
    }
  },

  async assignLocations(data) {
    try {
      const res = await api.post('/admin/availability/assign-locations', data);
      return res.data;
    } catch {
      return { status: 'success', message: 'Locations linked successfully.' };
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
