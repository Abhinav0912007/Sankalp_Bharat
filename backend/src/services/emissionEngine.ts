// ============================================================
// CarbonLens — Emission Engine Stub (owned by Sahiti)
// ============================================================
// Sameera calls this after file parsing.
// Sahiti will replace this stub with real calculation logic.
// ============================================================

export interface EmissionCalculationResult {
  recordId: string;
  calculatedEmissions: number;
  status: 'ACCEPTED' | 'REJECTED';
}

export interface BatchProcessResult {
  acceptedRows: number;
  flaggedRows: number;
  issuesCreated: number;
}

export interface ActivityItem {
  activityType: string;
  value: number;
  unit: string;
}

// Sahiti will implement this with real DB emission factor lookups
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function processBatch(_items: ActivityItem[], _orgId: string): Promise<BatchProcessResult> {
  // STUB — Sahiti replaces this body with:
  // 1. Look up EmissionFactor from DB for each activityType
  // 2. Multiply activityValue × factorValue → CO2e
  // 3. Persist EmissionRecord rows
  // 4. Flag records exceeding thresholds → create Issue rows
  return {
    acceptedRows: _items.length,
    flaggedRows: 0,
    issuesCreated: 0,
  };
}

// Single record calculation — called from manual entry route
export async function calculateSingle(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _item: ActivityItem,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _orgId: string
): Promise<number> {
  // STUB — Sahiti replaces this with real factor lookup + math
  return 0;
}
