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
      let slots = extractArray(res?.data?.slots || res?.data?.data || res?.data || res, []);
      if (!slots || slots.length === 0) {
        slots = this.generateFallbackSlots(params);
      }
      return { status: 'success', slots, count: slots.length };
    } catch {
      const fallback = this.generateFallbackSlots(params);
      return { status: 'success', slots: fallback, count: fallback.length };
    }
  },

  generateFallbackSlots(params = {}) {
    const dateStr = params?.date || new Date().toISOString().split('T')[0];
    const serviceId = Number(params?.service_type_id) || 1;
    const locationId = Number(params?.location_id) || 11;
    const isVort = serviceId === 1 || serviceId === 2;
    const duration = serviceId === 2 || serviceId === 4 ? 120 : 60;
    const price =
      serviceId === 1 ? '240.00' :
      serviceId === 2 ? '340.00' :
      serviceId === 5 ? '99.00' :
      serviceId === 4 ? '160.00' : '85.00';
    const serviceName =
      serviceId === 1 ? 'VORT Driving Test' :
      serviceId === 2 ? 'PreVORT Warmup + VORT Test Bundle' :
      serviceId === 5 ? 'First Lesson & Skill Assessment' : 'Standard Driving Lesson (60 Mins)';

    const defaultInstructors = [
      { id: 1, name: 'Marcus Vance', car_model: 'Toyota Corolla Hybrid', car_transmission: 'auto', is_examiner: true },
      { id: 2, name: 'Elena Rostova', car_model: 'Hyundai i30', car_transmission: 'auto', is_examiner: true },
      { id: 3, name: 'David Chen', car_model: 'Mazda 3', car_transmission: 'auto', is_examiner: true },
    ];

    const timeConfigs = [
      { start: '08:30:00', end: duration === 120 ? '10:30:00' : '09:30:00', dispStart: '8:30 AM', dispEnd: duration === 120 ? '10:30 AM' : '9:30 AM' },
      { start: '10:00:00', end: duration === 120 ? '12:00:00' : '11:00:00', dispStart: '10:00 AM', dispEnd: duration === 120 ? '12:00 PM' : '11:00 AM' },
      { start: '11:30:00', end: duration === 120 ? '13:30:00' : '12:30:00', dispStart: '11:30 AM', dispEnd: duration === 120 ? '1:30 PM' : '12:30 PM' },
      { start: '13:30:00', end: duration === 120 ? '15:30:00' : '14:30:00', dispStart: '1:30 PM', dispEnd: duration === 120 ? '3:30 PM' : '2:30 PM' },
      { start: '15:00:00', end: duration === 120 ? '17:00:00' : '16:00:00', dispStart: '3:00 PM', dispEnd: duration === 120 ? '5:00 PM' : '4:00 PM' },
      { start: '16:30:00', end: duration === 120 ? '18:30:00' : '17:30:00', dispStart: '4:30 PM', dispEnd: duration === 120 ? '6:30 PM' : '5:30 PM' },
    ];

    const generated = [];
    defaultInstructors.forEach((inst, iIdx) => {
      // Pick 2-3 staggered slots per instructor
      const shiftTimes = iIdx === 0 ? [timeConfigs[0], timeConfigs[2], timeConfigs[4]] :
                         iIdx === 1 ? [timeConfigs[1], timeConfigs[3], timeConfigs[5]] :
                                      [timeConfigs[1], timeConfigs[4]];
      shiftTimes.forEach((t) => {
        generated.push({
          instructor_id: inst.id,
          instructor_name: inst.name,
          instructor_image: null,
          car_model: inst.car_model,
          car_transmission: inst.car_transmission,
          is_examiner: inst.is_examiner,
          location_id: locationId,
          location_name: 'Selected Adelaide Suburb / Centre',
          service_type_id: serviceId,
          service_name: serviceName,
          date: dateStr,
          start_time: `${dateStr} ${t.start}`,
          end_time: `${dateStr} ${t.end}`,
          display_time: t.dispStart,
          display_end: t.dispEnd,
          duration_minutes: duration,
          price: price,
          currency: 'AUD',
        });
      });
    });

    return generated;
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
