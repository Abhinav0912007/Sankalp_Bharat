// ============================================================
// CarbonLens — Shared Auth Contract
// ============================================================
// This file is the SINGLE SOURCE OF TRUTH for authentication
// data shapes. Both Atharva (frontend) and Sameera (backend)
// MUST import from this file. Do not duplicate these types.
// ============================================================

/**
 * User roles — exact string values stored in the database.
 * Sameera: User.role column must contain one of these values.
 * Atharva: Used for conditional UI rendering (e.g., admin-only views).
 */
export const UserRole = {
  SUSTAINABILITY_MANAGER: 'SUSTAINABILITY_MANAGER',
  OPERATIONS_ADMIN: 'OPERATIONS_ADMIN',
  SUPPLIER: 'SUPPLIER',
  LEADERSHIP_REVIEWER: 'LEADERSHIP_REVIEWER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * The authenticated user object returned inside LoginResponse.
 *
 * ⚠️  SYNC NOTE: Sameera's DB column is `organizationId` but the
 *     API response uses the shortened key `orgId`. She must rename
 *     when constructing the response object.
 */
export interface AuthUser {
  /** Maps to DB: User.id */
  id: string;

  /** Maps to DB: User.organizationId → renamed to `orgId` in API */
  orgId: string;

  /** Maps to DB: User.role — must match UserRole enum values */
  role: UserRole;

  /** Maps to DB: User.name */
  name: string;
}

/**
 * POST /api/auth/login — Request Body
 * Atharva sends this, Sameera validates against User table.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * POST /api/auth/login — 200 OK Response Body
 *
 * Exact shape:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIs...",
 *   "user": {
 *     "id": "usr_1",
 *     "orgId": "org_1",
 *     "role": "SUSTAINABILITY_MANAGER",
 *     "name": "Asha Verma"
 *   }
 * }
 */
export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/**
 * JWT Payload Claims — what Sameera encodes inside the token.
 * Jiya/Sahiti's middleware decodes this to get orgId.
 *
 * Sameera signs with:
 *   jwt.sign({ userId, orgId, role }, JWT_SECRET, { expiresIn: '24h' })
 */
export interface JwtPayload {
  userId: string;
  orgId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
