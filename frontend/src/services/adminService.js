import api from './api';

export const adminService = {
  // Dashboard
  async getDashboardStats() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  // Bookings
  async getBookings(params = {}) {
    const res = await api.get('/admin/bookings', { params });
    return res.data.data;
  },

  async getBooking(id) {
    const res = await api.get(`/admin/bookings/${id}`);
    return res.data.data;
  },

  async updateBookingStatus(id, payload) {
    const res = await api.put(`/admin/bookings/${id}/status`, payload);
    return res.data;
  },

  async rescheduleBooking(id, payload) {
    const res = await api.post(`/admin/bookings/${id}/reschedule`, payload);
    return res.data;
  },

  // Instructors
  async getInstructors() {
    const res = await api.get('/admin/instructors');
    return res.data.data;
  },

  async createInstructor(data) {
    const res = await api.post('/admin/instructors', data);
    return res.data;
  },

  async updateInstructor(id, data) {
    const res = await api.put(`/admin/instructors/${id}`, data);
    return res.data;
  },

  async toggleInstructor(id) {
    const res = await api.patch(`/admin/instructors/${id}/toggle`);
    return res.data;
  },

  // Packages
  async getPackages() {
    const res = await api.get('/admin/packages');
    return res.data.data;
  },

  async createPackage(data) {
    const res = await api.post('/admin/packages', data);
    return res.data;
  },

  async updatePackage(id, data) {
    const res = await api.put(`/admin/packages/${id}`, data);
    return res.data;
  },

  async deletePackage(id) {
    const res = await api.delete(`/admin/packages/${id}`);
    return res.data;
  },

  // Customers
  async getCustomers(params = {}) {
    const res = await api.get('/admin/customers', { params });
    return res.data.data;
  },

  async getCustomer(id) {
    const res = await api.get(`/admin/customers/${id}`);
    return res.data.data;
  },

  async toggleCustomer(id) {
    const res = await api.patch(`/admin/customers/${id}/toggle`);
    return res.data;
  },

  // Services
  async getServices() {
    const res = await api.get('/admin/services');
    return res.data.data;
  },

  async createService(data) {
    const res = await api.post('/admin/services', data);
    return res.data;
  },

  async updateService(id, data) {
    const res = await api.put(`/admin/services/${id}`, data);
    return res.data;
  },

  // Availability
  async getAvailability(params = {}) {
    const res = await api.get('/admin/availability', { params });
    return res.data;
  },

  async updateSchedule(data) {
    const res = await api.post('/admin/availability/schedule', data);
    return res.data;
  },

  async createException(data) {
    const res = await api.post('/admin/availability/exceptions', data);
    return res.data;
  },

  async deleteException(id) {
    const res = await api.delete(`/admin/availability/exceptions/${id}`);
    return res.data;
  },

  // Payments & Refunds
  async getPayments(params = {}) {
    const res = await api.get('/admin/payments', { params });
    return res.data.data;
  },

  async processRefund(paymentId, data) {
    const res = await api.post(`/admin/payments/${paymentId}/refund`, data);
    return res.data;
  },

  // FAQs
  async getFaqs() {
    const res = await api.get('/admin/faqs');
    return res.data.data;
  },

  async createFaq(data) {
    const res = await api.post('/admin/faqs', data);
    return res.data;
  },

  async updateFaq(id, data) {
    const res = await api.put(`/admin/faqs/${id}`, data);
    return res.data;
  },

  async deleteFaq(id) {
    const res = await api.delete(`/admin/faqs/${id}`);
    return res.data;
  },

  // Testimonials
  async getTestimonials() {
    const res = await api.get('/admin/testimonials');
    return res.data.data;
  },

  async createTestimonial(data) {
    const res = await api.post('/admin/testimonials', data);
    return res.data;
  },

  async toggleTestimonial(id) {
    const res = await api.patch(`/admin/testimonials/${id}/toggle`);
    return res.data;
  },

  async deleteTestimonial(id) {
    const res = await api.delete(`/admin/testimonials/${id}`);
    return res.data;
  },

  // Enquiries
  async getEnquiries(params = {}) {
    const res = await api.get('/admin/enquiries', { params });
    return res.data.data;
  },

  async updateEnquiryStatus(id, data) {
    const res = await api.put(`/admin/enquiries/${id}/status`, data);
    return res.data;
  },

  // Settings
  async getSettings() {
    const res = await api.get('/admin/settings');
    return res.data;
  },

  async updateSettings(settings) {
    const res = await api.post('/admin/settings', { settings });
    return res.data;
  },
};

export default adminService;

