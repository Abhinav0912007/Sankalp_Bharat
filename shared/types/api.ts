// ============================================================
// CarbonLens — Shared API Contract
// ============================================================
// Common API types and endpoint constants shared between
// frontend and backend. Import from here, never hardcode paths.
// ============================================================

/**
 * Standard error response shape.
 * Sameera: ALL error responses must follow this structure.
 * Atharva: Axios interceptor parses this for user-facing messages.
 */
export interface ApiError {
  statusCode: number;
  message: string;
  details?: string;
}

/**
 * All API endpoint paths — single source of truth.
 * Both frontend Axios calls and backend route registrations
 * should reference these constants.
 */
export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',

  // Records
  RECORDS_UPLOAD: '/api/records/upload',
  RECORDS_MANUAL: '/api/records/manual',
  RECORDS_LIST: '/api/records',

  // Master Data
  ORGANIZATIONS: '/api/organizations',
  FACILITIES: '/api/facilities',

  // Dashboard
  DASHBOARD_SUMMARY: '/api/dashboard/summary',
  DASHBOARD_TRENDS: '/api/dashboard/trends',

  // Suppliers
  SUPPLIERS_LIST: '/api/suppliers',
  SUPPLIER_SUBMIT: '/api/supplier-submissions',

  // Issues / Governance
  ISSUES_LIST: '/api/issues',
  ISSUES_ASSIGN: '/api/issues/:id/assign',
  ISSUES_STATUS: '/api/issues/:id/status',

  // Reports
  REPORTS_GENERATE: '/api/reports/generate',
  REPORTS_LIST: '/api/reports',

  // AI Insights
  INSIGHTS_GENERATE: '/api/insights/generate',
} as const;

/**
 * HTTP header constants
 */
export const AUTH_HEADER = 'Authorization';
export const AUTH_SCHEME = 'Bearer';

/**
 * LocalStorage keys used by the frontend
 */
export const STORAGE_KEYS = {
  AUTH: 'carbonlens-auth',
} as const;
