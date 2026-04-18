import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Centralized Axios instance for CarbonLens API.
 * - Attaches Bearer token from localStorage
 * - Handles 401 redirects
 * - All data fetched dynamically — no hardcoded data
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      const { logout } = useAuthStore.getState();
      logout();
      window.location.href = '/login';
    } else if (error.response && error.response.status >= 400) {
      const message = error.response.data?.message || error.message || 'An error occurred';
      window.dispatchEvent(new CustomEvent('axios-error', { detail: message }));
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Typed API Helpers ───────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// EmissionRecord shape from API
export interface EmissionRecord {
  id: string;
  organizationId: string;
  facilityId: string;
  facilityName?: string;
  sourceType: string;
  scope: string;
  category: string;
  activityValue: number;
  activityUnit: string;
  emissionFactorId?: string;
  calculatedEmissions: number;
  periodMonth: number;
  periodYear: number;
  status: string;
  createdAt: string;
}

// Issue shape from API
export interface GovernanceIssue {
  id: string;
  organizationId: string;
  recordType: string;
  recordId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED';
  ownerUserId: string | null;
  ownerName?: string;
  dueDate: string | null;
  createdAt: string;
  // Nested record detail (populated by API when expanded)
  linkedRecord?: EmissionRecord;
}

// Facility shape from API
export interface Facility {
  id: string;
  organizationId: string;
  name: string;
  location: string;
  type: string;
}

// Manual entry request
export interface ManualEntryPayload {
  facilityId: string;
  sourceType: string;
  scope: string;
  category: string;
  activityValue: number;
  activityUnit: string;
  periodMonth: number;
  periodYear: number;
  notes?: string;
}

// Manual entry response
export interface ManualEntryResponse {
  recordId: string;
  calculatedEmissions: number;
  status: string;
}
