import api from './api';

const notificationsService = {
  async getAll(params = {}) {
    const { data } = await api.get('/backoffice/notifications', { params });
    return data;
  },

  async markAsRead(id) {
    const { data } = await api.patch(`/backoffice/notifications/${id}/read`);
    return data;
  },

  async markAllRead() {
    const { data } = await api.patch('/backoffice/notifications/read-all');
    return data;
  },
};

export default notificationsService;
