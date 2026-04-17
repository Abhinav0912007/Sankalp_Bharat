'use server';

import { createClient } from '@supabase/supabase-js';
import { calculateEmissions, processBatchEmissions } from '@/lib/services/emissions';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function submitManualActivity(formData: FormData) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const orgId = formData.get('organization_id') as string;
  const facilityId = formData.get('facility_id') as string;
  const activityType = formData.get('activity_type') as string;
  const unit = formData.get('unit') as string;
  const value = Number(formData.get('value'));

  try {
    const calc = await calculateEmissions(supabase, activityType, unit, value);
    if (!calc.success) throw new Error(calc.message);

    const { data: factor } = await supabase
      .from('emission_factors')
      .select('id')
      .eq('activity_type', activityType)
      .eq('unit', unit)
      .single();

    const { error } = await supabase.from('activity_records').insert({
      organization_id: orgId,
      facility_id: facilityId,
      emission_factor_id: factor?.id,
      activity_type: activityType,
      unit: unit,
      value: value,
      co2e_total: calc.co2eTotal,
      source: 'MANUAL'
    });

    if (error) {
        if (error.code === '42501') {
            throw new Error("RLS Permission Error: You need to disable RLS on activity_records or set an authenticated session policy to insert.");
        }
        throw new Error(error.message);
    }
    return { success: true, message: `Successfully recorded ${calc.co2eTotal?.toFixed(2)} kgCO2e.` };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function submitCSVBatch(batchData: any[]) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { processedRecords, hasErrors } = await processBatchEmissions(supabase, batchData);
    
    if (hasErrors) {
        return { success: false, message: "Validation failed on some rows. Please verify your variables." };
    }
    return { success: true, message: `Successfully processed ${batchData.length} records in this bulk ingestion payload.` };
}

export async function submitSupplierData(formData: FormData) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const orgId = formData.get('organization_id') as string;
    const supplierId = formData.get('supplier_id') as string;
    const quarter = formData.get('reporting_period') as string;
    const totalEmissions = Number(formData.get('total_co2e_reported'));
    
    const { error } = await supabase.from('supplier_submissions').insert({
        organization_id: orgId,
        supplier_id: supplierId,
        reporting_period: quarter,
        total_co2e_reported: totalEmissions,
        status: 'PENDING'
    });

    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Supplier transmission secured and delivered safely.' };
}
