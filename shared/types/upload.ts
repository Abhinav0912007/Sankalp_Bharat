// ============================================================
// CarbonLens — Shared Upload Contract
// ============================================================

/**
 * POST /api/records/upload — 200 OK Response
 * Returned by Sameera after processing an uploaded file.
 */
export interface UploadResponse {
  acceptedRows: number;
  flaggedRows: number;
  issuesCreated: number;
}

/**
 * OCR intermediate output (Sameera → Sahiti contract).
 * Sameera's OCR parsers produce this array; Sahiti's
 * EmissionEngine.processBatch() consumes it.
 * The frontend does NOT consume this directly.
 */
export interface ParsedActivityItem {
  activityType: string;
  value: number;
  unit: string;
}
