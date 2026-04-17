// ============================================================
// CarbonLens — Shared Prisma Client Singleton
// ============================================================
// Import this everywhere instead of `new PrismaClient()` to
// avoid exhausting DB connections in development.
// ============================================================

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;
