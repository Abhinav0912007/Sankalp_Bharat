// ============================================================
// CarbonLens — Report Routes
// ============================================================
// POST /api/reports/generate — generate a report
// GET  /api/reports          — list org reports
// ============================================================

import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { restrictToRole } from '../middleware/roleGuard';
import prisma from '../lib/prisma';

const router = Router();
router.use(authenticateToken);

// ── POST /api/reports/generate ───────────────────────────────
router.post(
  '/generate',
  restrictToRole(['ADMIN', 'SUSTAINABILITY_MANAGER']),
  async (req: Request, res: Response): Promise<void> => {
    const { reportingPeriod } = req.body as { reportingPeriod?: string };

    if (!reportingPeriod) {
      res.status(400).json({ statusCode: 400, message: 'reportingPeriod is required (e.g. "2026-Q1")' });
      return;
    }

    try {
      const orgId = req.user!.orgId;
      const userId = req.user!.userId;

      const org = await prisma.organization.findUnique({
        where: { id: orgId },
        select: { name: true },
      });

      const report = await prisma.report.create({
        data: {
          organizationId: orgId,
          title: `${org?.name ?? 'Org'} — ${reportingPeriod} ESG Summary`,
          reportingPeriod,
          summary: '',
          status: 'GENERATED',
          generatedByUserId: userId,
        },
      });

      res.status(200).json({
        reportId: report.id,
        title: report.title,
        status: report.status,
      });
    } catch (err) {
      console.error('[REPORTS] Generate error:', err);
      res.status(500).json({ statusCode: 500, message: 'Failed to generate report' });
    }
  }
);

// ── GET /api/reports ─────────────────────────────────────────
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const reports = await prisma.report.findMany({
      where: { organizationId: req.user!.orgId },
      include: {
        generatedBy: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ reports });
  } catch (err) {
    console.error('[REPORTS] List error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to retrieve reports' });
  }
});

export default router;
