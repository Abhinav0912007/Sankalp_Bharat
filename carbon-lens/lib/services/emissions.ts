import { SupabaseClient } from '@supabase/supabase-js';

export interface CalculationResult {
  success: boolean;
  co2eTotal?: number;
  message?: string;
}

export async function calculateEmissions(
  supabase: SupabaseClient,
  activityType: string,
  unit: string,
  value: number
): Promise<CalculationResult> {
  try {
    const { data: factor, error } = await supabase
      .from('emission_factors')
      .select('co2e_multiplier')
      .eq('activity_type', activityType)
      .eq('unit', unit)
      .single();

    if (error || !factor) {
      return { success: false, message: `Calculation failed: No emission factor found for ${activityType} measured in ${unit}.` };
    }

    return { success: true, co2eTotal: value * Number(factor.co2e_multiplier) };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function processBatchEmissions(
  supabase: SupabaseClient,
  batch: Array<{ activityType: string; unit: string; value: number }>
) {
  const processedRecords = [];
  let hasErrors = false;

  for (const item of batch) {
    const calculation = await calculateEmissions(supabase, item.activityType, item.unit, item.value);
    processedRecords.push({ ...item, status: calculation.success ? 'SUCCESS' : 'FAILED', co2eTotal: calculation.co2eTotal || null, errorMessage: calculation.message || null });
    if (!calculation.success) hasErrors = true;
  }
  return { processedRecords, hasErrors };
}
