// ============================================================
// CarbonLens — Shared Records Contract
// ============================================================

/**
 * Emission scopes — used across all record types.
 */
export const EmissionScope = {
  SCOPE_1: 'SCOPE_1',
  SCOPE_2: 'SCOPE_2',
  SCOPE_3: 'SCOPE_3',
} as const;

export type EmissionScope = (typeof EmissionScope)[keyof typeof EmissionScope];

/**
 * Record lifecycle statuses.
 */
export const RecordStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;

export type RecordStatus = (typeof RecordStatus)[keyof typeof RecordStatus];

/**
 * POST /api/records/manual — Request Body
 */
export interface ManualRecordRequest {
  facilityId: string;
  sourceType: string;
  scope: EmissionScope;
  category: string;
  activityValue: number;
  activityUnit: string;
  periodMonth: number;
  periodYear: number;
}

/**
 * POST /api/records/manual — 200 OK Response
 */
export interface ManualRecordResponse {
  recordId: string;
  calculatedEmissions: number;
  status: RecordStatus;
}
