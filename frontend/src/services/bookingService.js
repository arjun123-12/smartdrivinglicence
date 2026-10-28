import api from './api';

export const bookingService = {
  async getServices() {
    const res = await api.get('/services');
    return res.data.data;
  },

  async getLocations(params = {}) {
    const res = await api.get('/locations', { params });
    return res.data.data;
  },

  async searchLocations(q) {
    const res = await api.get('/locations/search', { params: { q } });
    return res.data.data;
  },

  async searchAvailability(params) {
    const res = await api.get('/availability/search', { params });
    return res.data;
  },

  async calculatePrice(payload) {
    const res = await api.post('/bookings/calculate-price', payload);
    return res.data;
  },

  async createBooking(bookingData) {
    const res = await api.post('/bookings', bookingData);
    return res.data;
  },

  async getBooking(reference) {
    const res = await api.get(`/bookings/${reference}`);
    return res.data.booking;
  },

  async getCustomerBookings(tab = 'all') {
    const res = await api.get('/customer/bookings', { params: { tab } });
    return res.data.data;
  },

  async cancelBooking(id, reason) {
    const res = await api.post(`/customer/bookings/${id}/cancel`, { reason });
    return res.data;
  },
};

export default bookingService;

