-- CarbonLens Initial Schema (Supabase PostgreSQL)

-- 1. Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Facilities
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Emission Factors
CREATE TABLE emission_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_type TEXT NOT NULL, -- e.g., 'Electricity', 'Fuel'
    unit TEXT NOT NULL,          -- e.g., 'kWh', 'liters'
    co2e_multiplier NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Activity Records
CREATE TABLE activity_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    emission_factor_id UUID NOT NULL REFERENCES emission_factors(id) ON DELETE RESTRICT,
    activity_type TEXT NOT NULL,
    unit TEXT NOT NULL,
    value NUMERIC NOT NULL,
    co2e_total NUMERIC, -- This is the calculated result
    source TEXT DEFAULT 'MANUAL', -- e.g., 'CSV_UPLOAD', 'MANUAL'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Supplier Submissions
CREATE TABLE supplier_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    reporting_period TEXT, -- e.g., '2025-Q1'
    total_co2e_reported NUMERIC,
    status TEXT DEFAULT 'PENDING', -- e.g., 'PENDING', 'APPROVED', 'REJECTED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Issues (Governance / Validation)
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    record_id UUID REFERENCES activity_records(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES supplier_submissions(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'OPEN', -- e.g., 'OPEN', 'RESOLVED', 'FALSE_POSITIVE'
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);
