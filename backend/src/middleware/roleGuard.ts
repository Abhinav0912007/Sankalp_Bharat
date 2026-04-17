// ============================================================
// CarbonLens — Role Guard Middleware (Sameera, Phase 3)
// ============================================================
// Call AFTER authenticateToken. Rejects with 403 if role
// is not in the allowed list.
//
// Usage:
//   router.delete('/sensitive', authenticateToken, restrictToRole(['ADMIN']), handler)
// ============================================================

import { Request, Response, NextFunction } from 'express';

export function restrictToRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        statusCode: 401,
        message: 'Not authenticated',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        statusCode: 403,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
      return;
    }

    next();
  };
}
