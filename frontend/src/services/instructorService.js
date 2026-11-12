import api from './api';
import { mockInstructors } from './mockData';

export const instructorService = {
  async getInstructors(params = {}) {
    try {
      const res = await api.get('/instructors', { params });
      return res.data.data;
    } catch {
      return mockInstructors;
    }
  },

  async getInstructor(id) {
    try {
      const res = await api.get(`/instructors/${id}`);
      return res.data.data;
    } catch {
      return mockInstructors.find((i) => i.id === Number(id)) || mockInstructors[0];
    }
  },
};

export default instructorService;
