/**
 * Source Type Configuration Map
 * 
 * Defines the dynamic form behavior per emission source type.
 * When a user selects a source type, the form auto-populates:
 * - The activity unit (liters, kWh, km, kg, etc.)
 * - The emission scope (SCOPE_1, SCOPE_2, SCOPE_3)
 * - The GHG category label
 * - Visual styling (color, icon name)
 */

export interface SourceTypeConfig {
  key: string;
  label: string;
  unit: string;
  unitLabel: string;
  scope: string;
  scopeLabel: string;
  category: string;
  color: string;
  iconName: 'LocalGasStation' | 'Bolt' | 'Flight' | 'Delete' | 'ShoppingCart' | 'Propane';
  placeholder: string;
}

const SOURCE_TYPE_CONFIGS: SourceTypeConfig[] = [
  {
    key: 'DIESEL',
    label: 'Diesel',
    unit: 'liters',
    unitLabel: 'Liters (L)',
    scope: 'SCOPE_1',
    scopeLabel: 'Scope 1 — Direct Emissions',
    category: 'Stationary Combustion',
    color: '#D97706',
    iconName: 'LocalGasStation',
    placeholder: 'e.g. 340',
  },
  {
    key: 'PETROL',
    label: 'Petrol / Gasoline',
    unit: 'liters',
    unitLabel: 'Liters (L)',
    scope: 'SCOPE_1',
    scopeLabel: 'Scope 1 — Direct Emissions',
    category: 'Stationary Combustion',
    color: '#EA580C',
    iconName: 'LocalGasStation',
    placeholder: 'e.g. 200',
  },
  {
    key: 'NATURAL_GAS',
    label: 'Natural Gas',
    unit: 'cubic_meters',
    unitLabel: 'Cubic Meters (m³)',
    scope: 'SCOPE_1',
    scopeLabel: 'Scope 1 — Direct Emissions',
    category: 'Stationary Combustion',
    color: '#0891B2',
    iconName: 'Propane',
    placeholder: 'e.g. 1500',
  },
  {
    key: 'ELECTRICITY',
    label: 'Electricity',
    unit: 'kWh',
    unitLabel: 'Kilowatt-hours (kWh)',
    scope: 'SCOPE_2',
    scopeLabel: 'Scope 2 — Indirect (Energy)',
    category: 'Purchased Electricity',
    color: '#7C3AED',
    iconName: 'Bolt',
    placeholder: 'e.g. 5000',
  },
  {
    key: 'TRAVEL',
    label: 'Business Travel',
    unit: 'km',
    unitLabel: 'Kilometers (km)',
    scope: 'SCOPE_3',
    scopeLabel: 'Scope 3 — Value Chain',
    category: 'Business Travel',
    color: '#2563EB',
    iconName: 'Flight',
    placeholder: 'e.g. 12000',
  },
  {
    key: 'WASTE',
    label: 'Waste Generated',
    unit: 'kg',
    unitLabel: 'Kilograms (kg)',
    scope: 'SCOPE_3',
    scopeLabel: 'Scope 3 — Value Chain',
    category: 'Waste Generated in Operations',
    color: '#059669',
    iconName: 'Delete',
    placeholder: 'e.g. 800',
  },
  {
    key: 'PURCHASED_GOODS',
    label: 'Purchased Goods & Services',
    unit: 'kg',
    unitLabel: 'Kilograms (kg)',
    scope: 'SCOPE_3',
    scopeLabel: 'Scope 3 — Value Chain',
    category: 'Purchased Goods & Services',
    color: '#DB2777',
    iconName: 'ShoppingCart',
    placeholder: 'e.g. 5000',
  },
];

export const getSourceTypeConfig = (key: string): SourceTypeConfig | undefined =>
  SOURCE_TYPE_CONFIGS.find((c) => c.key === key);

export default SOURCE_TYPE_CONFIGS;
