import api from '../api/client';

export const getRepositories = async (params = {}) => {
  const response = await api.get('/repositories/', { params });
  return response.data;
};

export const getRepositoryById = async (id) => {
  const response = await api.get(`/repositories/${id}/`);
  return response.data;
};

export const createRepository = async (payload) => {
  const response = await api.post('/repositories/', payload);
  return response.data;
};

export const updateRepository = async (id, payload) => {
  const response = await api.put(`/repositories/${id}/`, payload);
  return response.data;
};

export const deleteRepository = async (id) => {
  const response = await api.delete(`/repositories/${id}/`);
  return response.data;
};
