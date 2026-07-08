// src/utils/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hb_token');
      localStorage.removeItem('hb_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Convenience wrappers ────────────────────────────────────
export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getFeatured: () => api.get('/menu/featured'),
  getOne: (id) => api.get(`/menu/${id}`),
  create: (data) => api.post('/menu', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/menu/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/menu/${id}`),
  toggle: (id) => api.patch(`/menu/${id}/toggle`),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const reviewAPI = {
  getAll: (featured) => api.get('/reviews', { params: featured ? { featured: true } : {} }),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  create: (data) => api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export const hoursAPI = {
  getAll: () => api.get('/hours'),
  update: (id, data) => api.put(`/hours/${id}`, data),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const analyticsAPI = {
  get: () => api.get('/analytics'),
};

export const reservationAPI = {
  create: (data) => api.post('/reservations', data),
  getAll: (status) => api.get('/reservations', { params: status ? { status } : {} }),
  getCounts: () => api.get('/reservations/counts'),
  updateStatus: (id, status) => api.patch(`/reservations/${id}/status`, { status }),
  delete: (id) => api.delete(`/reservations/${id}`),
};

export const promotionAPI = {
  getAll:  (active) => api.get('/promotions', { params: active ? { active: true } : {} }),
  create:  (data)   => api.post('/promotions', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:  (id, data) => api.put(`/promotions/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:  (id)     => api.delete(`/promotions/${id}`),
  toggle:  (id)     => api.patch(`/promotions/${id}/toggle`),
};

export const qrAPI = {
  getMenu: () => api.get('/qrcode/menu'),
};
