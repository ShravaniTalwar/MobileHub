import axios from 'axios';
import { handleMockFallback } from './mockFallback';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Pinggy-No-Screen': 'true',
    'ngrok-skip-browser-warning': 'true',
    'Bypass-Tunnel-Reminder': 'true',
  },
});

// Request Interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mobilehub_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle unauthenticated or server errors & static host fallbacks
api.interceptors.response.use(
  (response) => {
    // If a static host (like Netlify or Vercel) serves index.html for /api routes because backend is not attached:
    if (
      typeof response.data === 'string' && 
      (response.data.trim().startsWith('<!DOCTYPE') || response.data.trim().startsWith('<html') || response.data.trim().startsWith('<!doctype'))
    ) {
      const url = response.config.url || '';
      const method = response.config.method || 'GET';
      let payload;
      try {
        payload = response.config.data ? JSON.parse(response.config.data) : undefined;
      } catch (e) {
        payload = response.config.data;
      }
      const mockResult = handleMockFallback(url, method, payload);
      return {
        ...response,
        status: 200,
        statusText: 'OK',
        data: mockResult,
      };
    }
    return response;
  },
  (error) => {
    const url = error.config?.url || '';
    const method = error.config?.method || 'GET';

    // If 404, Network Error, or static host error, use mock fallback so app never crashes
    if (
      error.response?.status === 404 || 
      error.message?.includes('Network Error') || 
      !error.response ||
      (typeof error.response?.data === 'string' && error.response.data.trim().startsWith('<'))
    ) {
      let payload;
      try {
        payload = error.config?.data ? JSON.parse(error.config.data) : undefined;
      } catch (e) {
        payload = error.config?.data;
      }
      const mockResult = handleMockFallback(url, method, payload);
      return Promise.resolve({
        data: mockResult,
        status: 200,
        statusText: 'OK (Mock Fallback)',
        headers: {},
        config: error.config,
      });
    }

    if (error.response?.status === 401) {
      const isAuthUrl = error.config?.url?.includes('/api/auth/login') || error.config?.url?.includes('/api/auth/register');
      if (!isAuthUrl) {
        localStorage.removeItem('mobilehub_token');
        localStorage.removeItem('mobilehub_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
