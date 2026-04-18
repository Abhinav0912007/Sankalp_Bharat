// ============================================================
// CarbonLens — Emission Engine (owned by Sahiti)
// ============================================================
// Sameera calls this after file parsing.
// Logic implemented to actually write to the database!
// ============================================================

import prisma from '../lib/prisma';

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
  facilityId?: string;
  facilityName?: string;
  month?: number;
  year?: number;
}

// Sahiti will implement this with real DB emission factor lookups
export async function processBatch(_items: ActivityItem[], _orgId: string): Promise<BatchProcessResult> {
  let acceptedRows = 0;
  let flaggedRows = 0;
  let issuesCreated = 0;

  for (const item of _items) {
    try {
      // 1. Get Calculated Emissions + Factor ID
      const { calculatedEmissions, factorId } = await resolveEmissionsAndFactor(item);

      // 2. Resolve Facility
      let targetFacilityId = 'fac_1'; // fallback
      if (item.facilityId || item.facilityName) {
        const facility = await prisma.facility.findFirst({
          where: { 
            organizationId: _orgId,
            OR: [
              ...(item.facilityId ? [{ id: item.facilityId }] : []),
              ...(item.facilityName ? [{ name: item.facilityName }] : [])
            ]
          }
        });
        if (facility) targetFacilityId = facility.id;
      }

      // 3. Persist Emission Record
      await prisma.emissionRecord.create({
        data: {
          organizationId: _orgId,
          facilityId: targetFacilityId,
          sourceType: item.activityType,
          scope: 'SCOPE_1', // default for MVP if unknown
          category: 'Fuel Combustion', // default
          activityValue: item.value,
          activityUnit: item.unit,
          emissionFactorId: factorId,
          calculatedEmissions,
          periodMonth: item.month || new Date().getMonth() + 1,
          periodYear: item.year || new Date().getFullYear(),
          status: 'SUBMITTED',
        }
      });
      acceptedRows++;
    } catch (e) {
      console.error('[PROCESS_BATCH] Failed row:', item, e);
      flaggedRows++;
      issuesCreated++;
    }
  }

  return { acceptedRows, flaggedRows, issuesCreated };
}

async function resolveEmissionsAndFactor(item: ActivityItem): Promise<{ calculatedEmissions: number, factorId?: string }> {
  let calculatedEmissions = item.value * 1.5; // generic fallback
  let factorId: string | undefined = undefined;

  // Attempt fuzzy lookup from our database of seed factors
  const factors = await prisma.emissionFactor.findMany();
  const lowerActivity = item.activityType.toLowerCase();

  // Keyword mapping to seed data concepts
  let targetSearch = lowerActivity;
  if (lowerActivity.includes('diesel')) targetSearch = 'diesel';
  else if (lowerActivity.includes('petrol') || lowerActivity.includes('gasoline')) targetSearch = 'petrol';
  else if (lowerActivity.includes('lpg')) targetSearch = 'lpg';
  else if (lowerActivity.includes('electricity') || lowerActivity.includes('grid')) targetSearch = 'electricity';
  else if (lowerActivity.includes('waste') || lowerActivity.includes('landfill')) targetSearch = 'waste';

  const matchedFactor = factors.find(f => f.name.toLowerCase().includes(targetSearch) || f.id.toLowerCase().includes(targetSearch));

  if (matchedFactor) {
    calculatedEmissions = item.value * matchedFactor.factorValue;
    factorId = matchedFactor.id;
  } else {
    // If factor not directly found, try hardcoded hackathon fallbacks
    if (lowerActivity.includes('diesel')) calculatedEmissions = item.value * 2.68;
    else if (lowerActivity.includes('petrol')) calculatedEmissions = item.value * 2.31;
    else if (lowerActivity.includes('lpg')) calculatedEmissions = item.value * 1.51;
  }

  return { calculatedEmissions, factorId };
}

// Single record calculation — called from manual entry route
export async function calculateSingle(
  _item: ActivityItem,
  _orgId: string
): Promise<number> {
  const result = await resolveEmissionsAndFactor(_item);
  return result.calculatedEmissions;
}
