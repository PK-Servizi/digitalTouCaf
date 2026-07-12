import api from './api';

const serviceRequestsService = {
  async getAll(params = {}) {
    const { data } = await api.get('/backoffice/service-requests', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/backoffice/service-requests/${id}`);
    return data;
  },

  async create(request) {
    const { data } = await api.post('/backoffice/service-requests', request);
    return data;
  },

  async uploadDocuments(requestId, files) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const { data } = await api.post(
      `/backoffice/service-requests/${requestId}/documents`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data;
  },

  async getDocuments(requestId) {
    const { data } = await api.get(
      `/backoffice/service-requests/${requestId}/documents`,
    );
    return data;
  },

  async getAssignedServices() {
    const { data } = await api.get('/backoffice/services');
    return data;
  },

  // ─── Resubmit after additional info requested ───

  async resubmit(requestId, notes) {
    const { data } = await api.post(`/backoffice/service-requests/${requestId}/resubmit`, { notes });
    return data;
  },
};

export default serviceRequestsService;
