import api from '../api/client';

export const getResourceVersions = async (params = {}) => {
  const response = await api.get('/resource-versions/', { params });
  return response.data;
};

export const getResourceVersionById = async (id) => {
  const response = await api.get(`/resource-versions/${id}/`);
  return response.data;
};

export const createResourceVersion = async (payload) => {
  const response = await api.post('/resource-versions/', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateResourceVersion = async (id, payload) => {
  const response = await api.put(`/resource-versions/${id}/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteResourceVersion = async (id) => {
  const response = await api.delete(`/resource-versions/${id}/`);
  return response.data;
};
