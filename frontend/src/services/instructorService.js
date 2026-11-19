import api from './api';
import { mockInstructors } from './mockData';
import { extractArray } from '../utils/apiHelpers';

export const instructorService = {
  // Public directory lookup (approved only)
  async getInstructors(params = {}) {
    try {
      const res = await api.get('/instructors', { params });
      return extractArray(res, mockInstructors);
    } catch {
      return mockInstructors;
    }
  },

  async getInstructor(id) {
    try {
      const res = await api.get(`/instructors/${id}`);
      return res.data?.data || res.data || mockInstructors[0];
    } catch {
      return mockInstructors.find((i) => i.id === Number(id)) || mockInstructors[0];
    }
  },

  // Instructor Onboarding & SMS Verification
  async signup(formData) {
    const res = await api.post('/instructors/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async verifyPhone(payload) {
    const res = await api.post('/instructors/verify-phone', payload);
    return res.data;
  },

  async resendOtp(payload) {
    const res = await api.post('/instructors/resend-otp', payload);
    return res.data;
  },

  // SMS OTP Login
  async sendLoginOtp(payload) {
    const res = await api.post('/auth/instructor/send-otp', payload);
    return res.data;
  },

  async verifyLoginOtp(payload) {
    const res = await api.post('/auth/instructor/verify-otp', payload);
    return res.data;
  },

  // Private Application Status & Resubmission
  async getApplicationStatus() {
    const res = await api.get('/instructors/me/application');
    return res.data;
  },

  async resubmitApplication(formData) {
    const res = await api.post('/instructors/me/resubmit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getDocumentUrl(instructorId, type) {
    const base = api.defaults.baseURL || '/api/v1';
    return `${base}/instructors/${instructorId}/documents/${type}`;
  },
};

export default instructorService;
