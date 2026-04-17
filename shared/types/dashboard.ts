// ============================================================
// CarbonLens — Shared Dashboard Contract
// ============================================================

/**
 * GET /api/dashboard/summary — Response
 * Jiya provides this; Sparsh consumes it directly in Recharts.
 */
export interface DashboardSummary {
  totalEmissions: number;
  scope1: number;
  scope2: number;
  scope3Covered: number;
  dataQualityScore: number;
  openIssues: number;
}

/**
 * Single trend data point.
 */
export interface TrendPoint {
  month: string;
  emissions: number;
}

/**
 * GET /api/dashboard/trends — Response
 */
export interface DashboardTrends {
  months: TrendPoint[];
}
