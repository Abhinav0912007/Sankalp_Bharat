import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const INDIAN_FACTORS = [
  { activity_type: 'Electricity', unit: 'kWh', co2e_multiplier: 0.716 },
  { activity_type: 'Diesel', unit: 'liters', co2e_multiplier: 2.68 },
  { activity_type: 'Petrol', unit: 'liters', co2e_multiplier: 2.31 },
  { activity_type: 'Natural Gas', unit: 'scm', co2e_multiplier: 2.022 },
  { activity_type: 'Coal', unit: 'kg', co2e_multiplier: 2.42 },
  { activity_type: 'Water Supply', unit: 'kL', co2e_multiplier: 0.344 },
];

export async function GET() {
  try {
    await supabase.from('emission_factors').delete().gte('co2e_multiplier', 0);
    const { data, error } = await supabase.from('emission_factors').insert(INDIAN_FACTORS).select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully seeded standard Indian emission factors!',
      count: data.length,
      records: data 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
