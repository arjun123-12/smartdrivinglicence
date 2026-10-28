import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('smartdriving_token', response.data.token);
      localStorage.setItem('smartdriving_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data) {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('smartdriving_token', response.data.token);
      localStorage.setItem('smartdriving_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async me() {
    const response = await api.get('/auth/me');
    if (response.data.user) {
      localStorage.setItem('smartdriving_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('smartdriving_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async changePassword(data) {
    const response = await api.put('/auth/password', data);
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore if token already revoked
    } finally {
      localStorage.removeItem('smartdriving_token');
      localStorage.removeItem('smartdriving_user');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('smartdriving_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('smartdriving_token');
  },
};

export default authService;

