// API Client - Axios instance with auth interceptor
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token for admin routes
api.interceptors.request.use((config) => {
  const token = Cookies.get('khareef_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('khareef_admin_token');
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin-login';
      }
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const loginAdmin = (email, password) =>
  api.post('/auth/login', { email, password });

export const verifyToken = (token) =>
  api.post('/auth/verify', { token });

// ---- Products ----
export const getProducts = (params) =>
  api.get('/products', { params });

export const getProduct = (id) =>
  api.get(`/products/${id}`);

export const getAdminProducts = () =>
  api.get('/products/admin/all');

export const createProduct = (data) =>
  api.post('/products', data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

export const uploadProductImage = (imageBase64, fileName, mimeType) =>
  api.post('/products/upload-image', { imageBase64, fileName, mimeType });

// ---- Categories ----
export const getCategories = () =>
  api.get('/categories');

export const createCategory = (data) =>
  api.post('/categories', data);

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`);

// ---- Orders ----
export const createOrder = (data) =>
  api.post('/orders', data);

export const getOrders = () =>
  api.get('/orders');

export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });

export default api;
