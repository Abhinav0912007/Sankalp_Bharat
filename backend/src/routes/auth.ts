// ============================================================
// CarbonLens — Auth Routes (Sameera, Phase 1)
// ============================================================
// POST /api/auth/login
//   → Validates email+password against DB
//   → Returns { token, user: { id, orgId, role, name } }
//   → This exact shape is what Atharva's authStore expects.
// ============================================================

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = Router();

// ── POST /api/auth/login ────────────────────────────────────
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  // Input validation
  if (!email || !password) {
    res.status(400).json({
      statusCode: 400,
      message: 'Email and password are required',
    });
    return;
  }

  try {
    // Find user by email (includes org for orgId)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { organization: true },
    });

    // Use constant-time comparison even for missing users
    // This prevents timing attacks that reveal valid emails
    if (!user) {
      await bcrypt.compare(password, '$2b$10$invalidhashfortimingprotection000000000000000000000000');
      res.status(401).json({
        statusCode: 401,
        message: 'Invalid email or password',
      });
      return;
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      res.status(401).json({
        statusCode: 401,
        message: 'Invalid email or password',
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ statusCode: 500, message: 'Server misconfiguration' });
      return;
    }

    // ── Build JWT payload (exact contract for Jiya/Sahiti middleware) ──
    const payload = {
      userId: user.id,
      orgId: user.organizationId,
      role: user.role,
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '24h') as jwt.SignOptions['expiresIn'],
    });

    // ── Response shape — Atharva's authStore depends on this exactly ──
    res.status(200).json({
      token,
      user: {
        id: user.id,
        orgId: user.organizationId, // DB column is organizationId, API key is orgId
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('[AUTH] Login error:', err);
    res.status(500).json({
      statusCode: 500,
      message: 'Login failed. Please try again.',
    });
  }
});

export default router;
