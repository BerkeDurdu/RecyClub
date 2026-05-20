import axios from 'axios';

// SAD v2 §5.2 — env-driven baseURL.
// Dev: '/api' uses the Vite proxy (vite.config.js).
// Prod: nginx serves the SPA and proxies '/api' to backend:4000 (nginx.conf).
// Override with VITE_API_URL if calling a remote API directly.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rc_token');
      localStorage.removeItem('rc_user');
    }
    return Promise.reject(err);
  }
);

export default api;
