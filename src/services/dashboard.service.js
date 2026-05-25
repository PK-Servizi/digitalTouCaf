import api from './api';

const dashboardService = {
  async getStats() {
    const { data } = await api.get('/backoffice/dashboard');
    return data;
  },
};

export default dashboardService;
