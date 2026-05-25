import api from './api';

const customersService = {
  async getAll(params = {}) {
    const { data } = await api.get('/backoffice/customers', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/backoffice/customers/${id}`);
    return data;
  },

  async create(customer) {
    const { data } = await api.post('/backoffice/customers', customer);
    return data;
  },

  async update(id, customer) {
    const { data } = await api.put(`/backoffice/customers/${id}`, customer);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/backoffice/customers/${id}`);
    return data;
  },
};

export default customersService;
