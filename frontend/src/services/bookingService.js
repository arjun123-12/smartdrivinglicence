import api from './api';
import { mockServices, mockLocations } from './mockData';
import { extractArray } from '../utils/apiHelpers';

export const bookingService = {
  async getServices() {
    try {
      const res = await api.get('/services');
      return extractArray(res, mockServices);
    } catch {
      return mockServices;
    }
  },

  async getLocations(params = {}) {
    try {
      const res = await api.get('/locations', { params });
      return extractArray(res, mockLocations);
    } catch {
      return mockLocations;
    }
  },

  async searchLocations(q) {
    try {
      const res = await api.get('/locations/search', { params: { q } });
      return extractArray(res, mockLocations);
    } catch {
      if (!q) return mockLocations;
      const lower = q.toLowerCase();
      return mockLocations.filter(
        (l) => l.name?.toLowerCase().includes(lower) || l.postcode?.includes(lower)
      );
    }
  },

  async searchAvailability(params) {
    try {
      const res = await api.get('/availability/search', { params });
      const slots = extractArray(res?.data?.slots || res?.data?.data || res?.data || res, []);
      return { status: 'success', slots, count: slots.length };
    } catch {
      return { status: 'success', slots: [], count: 0 };
    }
  },

  async calculatePrice(payload) {
    try {
      const res = await api.post('/bookings/calculate-price', payload);
      return res.data;
    } catch {
      return { status: 'success', total_price: '99.00', formatted_price: '$99.00 AUD' };
    }
  },

  async createBooking(bookingData) {
    try {
      const res = await api.post('/bookings', bookingData);
      return res.data;
    } catch {
      return {
        status: 'success',
        message: 'Demo Booking created successfully',
        booking: {
          id: Date.now(),
          booking_reference: 'BK-' + Math.floor(100000 + Math.random() * 900000),
          ...bookingData,
        },
      };
    }
  },

  async getBooking(reference) {
    try {
      const res = await api.get(`/bookings/${reference}`);
      return res.data.booking;
    } catch {
      return {
        id: 101,
        booking_reference: reference || 'BK-DEMO-999',
        customer: { name: 'Oliver Taylor', email: 'oliver@example.com' },
        service_type: { name: 'First Lesson & Skill Assessment ($99 Special)' },
        booking_status: 'confirmed',
      };
    }
  },

  async getCustomerBookings(tab = 'all') {
    try {
      const res = await api.get('/customer/bookings', { params: { tab } });
      return extractArray(res, []);
    } catch {
      return [];
    }
  },

  async cancelBooking(id, reason) {
    try {
      const res = await api.post(`/customer/bookings/${id}/cancel`, { reason });
      return res.data;
    } catch {
      return { status: 'success', message: 'Booking cancelled' };
    }
  },

  async getPublicSettings() {
    try {
      const res = await api.get('/settings/public');
      return res.data?.settings || res.data || {};
    } catch {
      return {};
    }
  },
};

export default bookingService;
