// ============================================================
// CarbonLens — Organization Routes
// ============================================================
// GET /api/organizations        — get own org details
// GET /api/organizations/users  — list users in org (ADMIN)
// ============================================================

import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { restrictToRole } from '../middleware/roleGuard';
import prisma from '../lib/prisma';

const router = Router();
router.use(authenticateToken);

// ── GET /api/organizations ───────────────────────────────────
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.user!.orgId },
      select: { id: true, name: true, industry: true, reportingYear: true, createdAt: true },
    });

    if (!org) {
      res.status(404).json({ statusCode: 404, message: 'Organization not found' });
      return;
    }

    res.status(200).json({ organization: org });
  } catch (err) {
    console.error('[ORGS] Get error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to retrieve organization' });
  }
});

// ── GET /api/organizations/users (ADMIN / SUSTAINABILITY_MANAGER only) ──
router.get(
  '/users',
  restrictToRole(['ADMIN', 'SUSTAINABILITY_MANAGER']),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        where: { organizationId: req.user!.orgId },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { name: 'asc' },
      });

      res.status(200).json({ users });
    } catch (err) {
      console.error('[ORGS] Users list error:', err);
      res.status(500).json({ statusCode: 500, message: 'Failed to retrieve users' });
    }
  }
);

export default router;
