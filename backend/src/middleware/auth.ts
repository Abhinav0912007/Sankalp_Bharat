// ============================================================
// CarbonLens — JWT Auth Middleware (Sameera, Phase 2)
// ============================================================
// Verifies Bearer token from Authorization header.
// Attaches decoded payload to req.user for downstream use.
// Jiya and Sahiti's routes depend entirely on req.user.orgId.
// ============================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: string;
  orgId: string;
  role: string;
}

// Extend Express Request to carry the decoded user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      statusCode: 401,
      message: 'Authorization token required',
    });
    return;
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({
      statusCode: 500,
      message: 'Server misconfiguration: JWT_SECRET not set',
    });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        statusCode: 401,
        message: 'Token expired — please log in again',
      });
    } else {
      res.status(401).json({
        statusCode: 401,
        message: 'Invalid token',
      });
    }
  }
}
