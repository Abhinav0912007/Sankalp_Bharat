// ============================================================
// CarbonLens — Dashboard Routes (stub for Jiya)
// ============================================================
// GET /api/dashboard/summary — emissions summary
// GET /api/dashboard/trends  — monthly trend data
//
// Jiya owns these calculations. These are stubs that return
// live DB aggregations for now. Jiya replaces with optimized
// SQL GROUP BY queries.
// ============================================================

import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();
router.use(authenticateToken);

// ── GET /api/dashboard/summary ───────────────────────────────
router.get('/summary', async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.user!.orgId;

    const scopeGroups = await prisma.emissionRecord.groupBy({
      by: ['scope'],
      where: { organizationId: orgId, status: 'ACCEPTED' },
      _sum: { calculatedEmissions: true },
    });

    let scope1 = 0;
    let scope2 = 0;
    let scope3 = 0;
    for (const g of scopeGroups) {
      if (g.scope === 'SCOPE_1') scope1 = g._sum.calculatedEmissions || 0;
      else if (g.scope === 'SCOPE_2') scope2 = g._sum.calculatedEmissions || 0;
      else if (g.scope === 'SCOPE_3') scope3 = g._sum.calculatedEmissions || 0;
    }

    const totalEmissions = scope1 + scope2 + scope3;

    const openIssues = await prisma.issue.count({
      where: { organizationId: orgId, status: 'OPEN' },
    });

    // Simple quality score: accepted / total records × 100
    const totalRecords = await prisma.emissionRecord.count({ where: { organizationId: orgId } });
    const acceptedRecords = await prisma.emissionRecord.count({
      where: { organizationId: orgId, status: 'ACCEPTED' },
    });
    const dataQualityScore = totalRecords > 0
      ? Math.round((acceptedRecords / totalRecords) * 100)
      : 0;

    res.status(200).json({
      totalEmissions: Math.round(totalEmissions * 100) / 100,
      scope1: Math.round(scope1 * 100) / 100,
      scope2: Math.round(scope2 * 100) / 100,
      scope3Covered: Math.round(scope3 * 100) / 100,
      dataQualityScore,
      openIssues,
    });
  } catch (err) {
    console.error('[DASHBOARD] Summary error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to retrieve dashboard summary' });
  }
});

// ── GET /api/dashboard/trends ────────────────────────────────
router.get('/trends', async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.user!.orgId;

    const groupedRecords = await prisma.emissionRecord.groupBy({
      by: ['periodYear', 'periodMonth'],
      where: { organizationId: orgId, status: 'ACCEPTED' },
      _sum: { calculatedEmissions: true },
      orderBy: [
        { periodYear: 'asc' },
        { periodMonth: 'asc' }
      ]
    });

    // Group by year-month
    const grouped: Record<string, number> = {};
    for (const r of groupedRecords) {
      const key = `${r.periodYear}-${String(r.periodMonth).padStart(2, '0')}`;
      grouped[key] = (grouped[key] ?? 0) + (r._sum.calculatedEmissions || 0);
    }

    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const months = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([key, emissions]) => {
        const monthIdx = parseInt(key.split('-')[1], 10) - 1;
        return {
          month: MONTH_NAMES[monthIdx],
          emissions: Math.round(emissions * 100) / 100,
        };
      });

    res.status(200).json({ months });
  } catch (err) {
    console.error('[DASHBOARD] Trends error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to retrieve trend data' });
  }
});

export default router;
