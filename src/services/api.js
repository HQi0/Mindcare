import axios from 'axios';

// Base URL diambil dari environment variable, fallback ke localhost
// saat development. Ganti VITE_API_BASE_URL di file .env ketika
// backend sudah tersedia.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor request: tempat menyisipkan token auth nanti
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mindcare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response: penanganan error terpusat
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: tambahkan redirect ke halaman login jika 401,
    // atau toast notification global jika diperlukan.
    return Promise.reject(error);
  }
);

export default api;
