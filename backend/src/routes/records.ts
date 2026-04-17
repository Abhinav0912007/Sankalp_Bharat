// ============================================================
// CarbonLens — Records Routes (Sameera, Phase 1)
// ============================================================
// POST /api/records/upload  — multipart file upload + parse
// POST /api/records/manual  — manual data entry
// GET  /api/records         — list org's emission records
// ============================================================

import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { parseUploadedFile } from '../services/fileParser';
import { processBatch, calculateSingle } from '../services/emissionEngine';
import prisma from '../lib/prisma';
import fs from 'fs';

const router = Router();

// All record routes require auth
router.use(authenticateToken);

// ── POST /api/records/upload ─────────────────────────────────
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ statusCode: 400, message: 'No file uploaded' });
    return;
  }

  try {
    const orgId = req.user!.orgId;

    // Parse file → intermediate activity items (Sameera→Sahiti contract)
    const parsedItems = await parseUploadedFile(req.file.path);

    // Hand off to Sahiti's EmissionEngine
    const result = await processBatch(parsedItems, orgId);

    // Clean up uploaded file after processing
    fs.unlink(req.file.path, () => {});

    res.status(200).json(result);
  } catch (err) {
    console.error('[RECORDS] Upload error:', err);
    // Clean up on error
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    res.status(500).json({ statusCode: 500, message: 'File processing failed' });
  }
});

// ── POST /api/records/manual ─────────────────────────────────
router.post('/manual', async (req: Request, res: Response): Promise<void> => {
  const {
    facilityId,
    sourceType,
    scope,
    category,
    activityValue,
    activityUnit,
    periodMonth,
    periodYear,
  } = req.body as {
    facilityId?: string;
    sourceType?: string;
    scope?: string;
    category?: string;
    activityValue?: number;
    activityUnit?: string;
    periodMonth?: number;
    periodYear?: number;
  };

  // Input validation
  if (!facilityId || !sourceType || !scope || !category || !activityUnit
      || activityValue === undefined || !periodMonth || !periodYear) {
    res.status(400).json({
      statusCode: 400,
      message: 'Missing required fields: facilityId, sourceType, scope, category, activityValue, activityUnit, periodMonth, periodYear',
    });
    return;
  }

  try {
    const orgId = req.user!.orgId;

    // Verify facility belongs to this org
    const facility = await prisma.facility.findFirst({
      where: { id: facilityId, organizationId: orgId },
    });

    if (!facility) {
      res.status(404).json({ statusCode: 404, message: 'Facility not found' });
      return;
    }

    // Get emission calculation from Sahiti's engine
    const calculatedEmissions = await calculateSingle(
      { activityType: sourceType, value: Number(activityValue), unit: activityUnit },
      orgId
    );

    // Persist the record
    const record = await prisma.emissionRecord.create({
      data: {
        organizationId: orgId,
        facilityId,
        sourceType,
        scope,
        category,
        activityValue: Number(activityValue),
        activityUnit,
        calculatedEmissions,
        periodMonth: Number(periodMonth),
        periodYear: Number(periodYear),
        status: 'SUBMITTED',
      },
    });

    res.status(200).json({
      recordId: record.id,
      calculatedEmissions: record.calculatedEmissions,
      status: record.status,
    });
  } catch (err) {
    console.error('[RECORDS] Manual entry error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to save record' });
  }
});

// ── GET /api/records ─────────────────────────────────────────
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.user!.orgId;
    const { scope, facilityId, status } = req.query as Record<string, string>;

    const records = await prisma.emissionRecord.findMany({
      where: {
        organizationId: orgId,
        ...(scope && { scope }),
        ...(facilityId && { facilityId }),
        ...(status && { status }),
      },
      include: {
        facility: { select: { name: true, location: true } },
        emissionFactor: { select: { name: true, factorUnit: true } },
      },
      orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
    });

    res.status(200).json({ records });
  } catch (err) {
    console.error('[RECORDS] List error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to retrieve records' });
  }
});

export default router;
