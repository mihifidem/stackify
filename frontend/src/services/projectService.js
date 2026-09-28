import api from '../api/client';

export const getProjects = async (params = {}) => {
  const response = await api.get('/projects/', { params });
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}/`);
  return response.data;
};

export const createProject = async (payload) => {
  const response = await api.post('/projects/', payload);
  return response.data;
};

export const updateProject = async (id, payload) => {
  const response = await api.put(`/projects/${id}/`, payload);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}/`);
  return response.data;
};
