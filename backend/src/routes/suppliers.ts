// ============================================================
// CarbonLens — Supplier Routes (stub for Jiya)
// ============================================================
// GET  /api/suppliers        — list org suppliers
// POST /api/supplier-submissions — submit scope 3 data
// GET  /api/supplier-submissions — list submissions
// ============================================================

import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();
router.use(authenticateToken);

// ── GET /api/suppliers ───────────────────────────────────────
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { organizationId: req.user!.orgId },
      include: { _count: { select: { submissions: true } } },
      orderBy: { priorityTier: 'asc' },
    });
    res.status(200).json({ suppliers });
  } catch (err) {
    console.error('[SUPPLIERS] List error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to retrieve suppliers' });
  }
});

// ── POST /api/supplier-submissions ──────────────────────────
router.post('/submissions', async (req: Request, res: Response): Promise<void> => {
  const { supplierId, scope3Category, activityValue, activityUnit, reportingPeriod, notes } =
    req.body as {
      supplierId?: string;
      scope3Category?: string;
      activityValue?: number;
      activityUnit?: string;
      reportingPeriod?: string;
      notes?: string;
    };

  if (!supplierId || !scope3Category || activityValue === undefined || !activityUnit || !reportingPeriod) {
    res.status(400).json({
      statusCode: 400,
      message: 'Missing required fields: supplierId, scope3Category, activityValue, activityUnit, reportingPeriod',
    });
    return;
  }

  try {
    const orgId = req.user!.orgId;

    // Verify supplier belongs to this org
    const supplier = await prisma.supplier.findFirst({
      where: { id: supplierId, organizationId: orgId },
    });
    if (!supplier) {
      res.status(404).json({ statusCode: 404, message: 'Supplier not found' });
      return;
    }

    // Simple data quality score: based on completeness
    const dataQualityScore = notes ? 85 : 70;

    const submission = await prisma.supplierSubmission.create({
      data: {
        supplierId,
        organizationId: orgId,
        scope3Category,
        activityValue: Number(activityValue),
        activityUnit,
        reportingPeriod,
        dataQualityScore,
        notes: notes ?? '',
        status: 'SUBMITTED',
      },
    });

    res.status(200).json({
      submissionId: submission.id,
      dataQualityScore: submission.dataQualityScore,
      status: submission.status,
    });
  } catch (err) {
    console.error('[SUPPLIERS] Submission error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to submit supplier data' });
  }
});

// ── GET /api/supplier-submissions ───────────────────────────
router.get('/submissions', async (req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await prisma.supplierSubmission.findMany({
      where: { organizationId: req.user!.orgId },
      include: { supplier: { select: { name: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ submissions });
  } catch (err) {
    console.error('[SUPPLIERS] Submissions list error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to retrieve submissions' });
  }
});

export default router;
