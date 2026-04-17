// ============================================================
// CarbonLens — Database Seed (Jiya's responsibility for bulk data)
// ============================================================
// This minimal seed creates:
//   - 1 Organization
//   - 3 Users (one per key role)
//   - 2 Facilities
//   - Emission Factors (real IPCC-aligned values)
//
// Run: npm run db:seed
// Jiya will add the 1000 Scope 3 records on top of this.
// ============================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CarbonLens database...\n');

  // ── Organization ────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { id: 'org_1' },
    update: {},
    create: {
      id: 'org_1',
      name: 'Bharat Steel Manufacturing Pvt. Ltd.',
      industry: 'Steel Manufacturing',
      reportingYear: 2026,
    },
  });
  console.log('✅ Organization:', org.name);

  // ── Users ────────────────────────────────────────────────────
  const SALT_ROUNDS = 10;

  const users = [
    {
      id: 'usr_1',
      name: 'Asha Verma',
      email: 'sustainability@carbonlens.demo',
      password: 'demo123',
      role: 'SUSTAINABILITY_MANAGER',
    },
    {
      id: 'usr_2',
      name: 'Rajan Mehta',
      email: 'ops@carbonlens.demo',
      password: 'demo123',
      role: 'OPERATIONS_ADMIN',
    },
    {
      id: 'usr_3',
      name: 'Priya Sharma',
      email: 'admin@carbonlens.demo',
      password: 'admin123',
      role: 'ADMIN',
    },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        organizationId: org.id,
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
      },
    });
    console.log(`✅ User: ${u.name} (${u.role}) — ${u.email} / ${u.password}`);
  }

  // ── Facilities ───────────────────────────────────────────────
  const facilities = [
    { id: 'fac_1', name: 'Pune Manufacturing Plant', location: 'Pune, Maharashtra', type: 'Manufacturing' },
    { id: 'fac_2', name: 'Mumbai Warehouse', location: 'Mumbai, Maharashtra', type: 'Warehouse' },
  ];

  for (const f of facilities) {
    await prisma.facility.upsert({
      where: { id: f.id },
      update: {},
      create: { ...f, organizationId: org.id },
    });
    console.log(`✅ Facility: ${f.name}`);
  }

  // ── Emission Factors (IPCC / GHG Protocol aligned) ──────────
  const factors = [
    {
      id: 'ef_diesel',
      name: 'Diesel Combustion',
      scope: 'SCOPE_1',
      category: 'Fuel Combustion',
      factorValue: 2.68,       // kg CO2e per liter
      factorUnit: 'per liter',
      sourceReference: 'IPCC AR5 / GHG Protocol',
    },
    {
      id: 'ef_petrol',
      name: 'Petrol Combustion',
      scope: 'SCOPE_1',
      category: 'Fuel Combustion',
      factorValue: 2.31,
      factorUnit: 'per liter',
      sourceReference: 'IPCC AR5 / GHG Protocol',
    },
    {
      id: 'ef_lpg',
      name: 'LPG Combustion',
      scope: 'SCOPE_1',
      category: 'Fuel Combustion',
      factorValue: 1.51,
      factorUnit: 'per liter',
      sourceReference: 'IPCC AR5',
    },
    {
      id: 'ef_electricity_india',
      name: 'Grid Electricity — India',
      scope: 'SCOPE_2',
      category: 'Electricity',
      factorValue: 0.716,       // kg CO2e per kWh (CEA 2022-23)
      factorUnit: 'per kWh',
      sourceReference: 'CEA India Grid Emission Factor 2022-23',
    },
    {
      id: 'ef_transport_road',
      name: 'Road Freight',
      scope: 'SCOPE_3',
      category: 'Transportation',
      factorValue: 0.000096,   // kg CO2e per tonne-km
      factorUnit: 'per tonne-km',
      sourceReference: 'GHG Protocol Scope 3 Standard',
    },
    {
      id: 'ef_waste_landfill',
      name: 'Waste to Landfill',
      scope: 'SCOPE_3',
      category: 'Waste',
      factorValue: 0.44,
      factorUnit: 'per kg',
      sourceReference: 'DEFRA 2023',
    },
  ];

  for (const ef of factors) {
    await prisma.emissionFactor.upsert({
      where: { id: ef.id },
      update: {},
      create: ef,
    });
    console.log(`✅ EmissionFactor: ${ef.name} (${ef.factorValue} ${ef.factorUnit})`);
  }

  // ── Suppliers ────────────────────────────────────────────────
  const suppliers = [
    {
      id: 'sup_1',
      name: 'FastMove Logistics Pvt. Ltd.',
      contactName: 'Vikram Singh',
      contactEmail: 'vikram@fastmove.demo',
      category: 'Logistics',
      priorityTier: 1,
    },
    {
      id: 'sup_2',
      name: 'GreenPack Materials',
      contactName: 'Anjali Patel',
      contactEmail: 'anjali@greenpack.demo',
      category: 'Packaging',
      priorityTier: 2,
    },
  ];

  for (const s of suppliers) {
    await prisma.supplier.upsert({
      where: { id: s.id },
      update: {},
      create: { ...s, organizationId: org.id },
    });
    console.log(`✅ Supplier: ${s.name}`);
  }

  console.log('\n🎉 Seed complete!\n');
  console.log('Demo Login Credentials:');
  console.log('  📧 sustainability@carbonlens.demo  /  demo123  (Sustainability Manager)');
  console.log('  📧 ops@carbonlens.demo             /  demo123  (Operations Admin)');
  console.log('  📧 admin@carbonlens.demo           /  admin123 (Admin)\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
