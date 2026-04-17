// ============================================================
// CarbonLens — Issues Routes (Sameera, Phase 2)
// ============================================================
// POST /api/issues              — create issue
// GET  /api/issues              — list org issues
// POST /api/issues/:id/assign   — assign owner
// POST /api/issues/:id/status   — update status
// ============================================================

import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { restrictToRole } from '../middleware/roleGuard';
import prisma from '../lib/prisma';

const router = Router();
router.use(authenticateToken);

// ── POST /api/issues ─────────────────────────────────────────
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { recordId, recordType, title, description, severity } = req.body as {
    recordId?: string;
    recordType?: string;
    title?: string;
    description?: string;
    severity?: string;
  };

  if (!recordId || !recordType || !title || !description) {
    res.status(400).json({
      statusCode: 400,
      message: 'Missing required fields: recordId, recordType, title, description',
    });
    return;
  }

  try {
    const orgId = req.user!.orgId;

    const issue = await prisma.issue.create({
      data: {
        organizationId: orgId,
        recordId,
        recordType: recordType.toUpperCase(),
        title,
        description,
        severity: severity?.toUpperCase() ?? 'MEDIUM',
        status: 'OPEN',
      },
    });

    res.status(201).json({
      issueId: issue.id,
      status: issue.status,
      severity: issue.severity,
    });
  } catch (err) {
    console.error('[ISSUES] Create error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to create issue' });
  }
});

// ── GET /api/issues ──────────────────────────────────────────
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.user!.orgId;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const severity = typeof req.query.severity === 'string' ? req.query.severity : undefined;

    const issues = await prisma.issue.findMany({
      where: {
        organizationId: orgId,
        ...(status && { status: status.toUpperCase() }),
        ...(severity && { severity: severity.toUpperCase() }),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ issues });
  } catch (err) {
    console.error('[ISSUES] List error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to retrieve issues' });
  }
});

// ── POST /api/issues/:id/assign ──────────────────────────────
router.post('/:id/assign', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { ownerUserId } = req.body as { ownerUserId?: string };

  if (!ownerUserId) {
    res.status(400).json({ statusCode: 400, message: 'ownerUserId is required' });
    return;
  }

  try {
    const orgId = req.user!.orgId;

    const issue = await prisma.issue.findFirst({
      where: { id: String(id), organizationId: orgId },
    });

    if (!issue) {
      res.status(404).json({ statusCode: 404, message: 'Issue not found' });
      return;
    }

    const updated = await prisma.issue.update({
      where: { id: String(id) },
      data: { ownerUserId: String(ownerUserId), status: 'IN_PROGRESS' },
    });

    res.status(200).json({
      issueId: updated.id,
      ownerUserId: updated.ownerUserId,
      status: updated.status,
    });
  } catch (err) {
    console.error('[ISSUES] Assign error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to assign issue' });
  }
});

// ── POST /api/issues/:id/status ──────────────────────────────
router.post('/:id/status', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body as { status?: string };

  const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  if (!status || !VALID_STATUSES.includes(status.toUpperCase())) {
    res.status(400).json({
      statusCode: 400,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
    return;
  }

  try {
    const orgId = req.user!.orgId;

    const issue = await prisma.issue.findFirst({
      where: { id: String(id), organizationId: orgId },
    });

    if (!issue) {
      res.status(404).json({ statusCode: 404, message: 'Issue not found' });
      return;
    }

    const updated = await prisma.issue.update({
      where: { id: String(id) },
      data: { status: status!.toUpperCase() },
    });

    res.status(200).json({
      issueId: updated.id,
      status: updated.status,
    });
  } catch (err) {
    console.error('[ISSUES] Status update error:', err);
    res.status(500).json({ statusCode: 500, message: 'Failed to update issue status' });
  }
});

// ── DELETE /api/issues/:id (ADMIN only) ──────────────────────
router.delete(
  '/:id',
  restrictToRole(['ADMIN']),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const orgId = req.user!.orgId;
      const { id } = req.params;

      const issueId = String(id);
      const issue = await prisma.issue.findFirst({ where: { id: issueId, organizationId: orgId } });
      if (!issue) {
        res.status(404).json({ statusCode: 404, message: 'Issue not found' });
        return;
      }

      await prisma.issue.delete({ where: { id: issueId } });
      res.status(204).send();
    } catch (err) {
      console.error('[ISSUES] Delete error:', err);
      res.status(500).json({ statusCode: 500, message: 'Failed to delete issue' });
    }
  }
);

export default router;
