import api from './api';
import { mockInstructors } from './mockData';
import { extractArray } from '../utils/apiHelpers';

export const instructorService = {
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
};

export default instructorService;
