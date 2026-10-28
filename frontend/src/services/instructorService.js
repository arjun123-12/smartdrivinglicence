import api from './api';

export const instructorService = {
  async getInstructors(params = {}) {
    const res = await api.get('/instructors', { params });
    return res.data.data;
  },

  async getInstructor(id) {
    const res = await api.get(`/instructors/${id}`);
    return res.data.data;
  },
};

export default instructorService;

