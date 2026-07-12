import api from './api';

const invoicesService = {
  async getAll(params = {}) {
    const { data } = await api.get('/backoffice/invoices', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/backoffice/invoices/${id}`);
    return data;
  },

  async pay(invoiceId) {
    const { data } = await api.post(`/backoffice/invoices/${invoiceId}/pay`);
    return data;
  },

  // ─── Accessible invoices (via access grants) ───

  async getAccessible(params = {}) {
    const { data } = await api.get('/backoffice/invoices/accessible', { params });
    return data;
  },

  async getAccessibleById(id) {
    const { data } = await api.get(`/backoffice/invoices/accessible/${id}`);
    return data;
  },
};

export default invoicesService;
