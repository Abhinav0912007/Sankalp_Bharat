// ============================================================
// CarbonLens — Facility Routes
// ============================================================
// GET  /api/facilities     — list org facilities
// POST /api/facilities     — create facility (ADMIN)
// ============================================================

import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { restrictToRole } from '../middleware/roleGuard';
import prisma from '../lib/prisma';

const router = Router();
router.use(authenticateToken);

// ── GET /api/facilities ──────────────────────────────────────
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const facilities = await prisma.facility.findMany({
      where: { organizationId: req.user!.orgId },
      orderBy: { name: 'asc' },
    });
    res.status(200).json({ facilities });
  } catch (err) {
    console.error('[FACILITIES] List error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to retrieve facilities' });
  }
});

// ── POST /api/facilities (ADMIN only) ───────────────────────
router.post(
  '/',
  restrictToRole(['ADMIN', 'SUSTAINABILITY_MANAGER']),
  async (req: Request, res: Response): Promise<void> => {
    const { name, location, type } = req.body as {
      name?: string;
      location?: string;
      type?: string;
    };

    if (!name || !location || !type) {
      res.status(400).json({
        statusCode: 400,
        message: 'Missing required fields: name, location, type',
      });
      return;
    }

    try {
      const facility = await prisma.facility.create({
        data: {
          organizationId: req.user!.orgId,
          name,
          location,
          type,
        },
      });
      res.status(201).json({ facility });
    } catch (err) {
      console.error('[FACILITIES] Create error:', err);
      res.status(500).json({ statusCode: 500, message: 'Failed to create facility' });
    }
  }
);

export default router;
