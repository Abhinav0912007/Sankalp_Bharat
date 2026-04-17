import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { AUTH_HEADER, AUTH_SCHEME } from '@shared/types/api';

// ============================================================
// Pre-configured Axios Instance
// ============================================================
// All API calls throughout the app MUST use this instance.
// It automatically:
//   1. Attaches Bearer {token} to every request
//   2. Auto-logouts on 401 responses
// ============================================================

const api = axios.create({
  baseURL: '', // Empty — Vite proxy handles /api/* → localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────────
// Reads token from Zustand store and attaches Authorization header.
// This is how Jiya/Sahiti's middleware receives the orgId (embedded in JWT).
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers[AUTH_HEADER] = `${AUTH_SCHEME} ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response Interceptor ─────────────────────────────────────
// On 401 Unauthorized → auto logout + redirect to /login.
// This handles expired tokens or revoked sessions.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Only auto-logout if we were previously authenticated
      const { isAuthenticated, logout } = useAuthStore.getState();
      if (isAuthenticated) {
        logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
