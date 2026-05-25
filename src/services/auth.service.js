import api from './api';

const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = data.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async changePassword(currentPassword, newPassword) {
    const { data } = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  },

  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token, password) {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
};

export default authService;
