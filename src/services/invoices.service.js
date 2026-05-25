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
};

export default invoicesService;
