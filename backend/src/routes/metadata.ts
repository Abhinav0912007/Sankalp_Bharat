import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();
router.use(authenticateToken);

// ── GET /api/metadata/entry-config ───────────────────────────
router.get('/entry-config', async (req: Request, res: Response): Promise<void> => {
  try {
    const factors = await prisma.emissionFactor.findMany();
    
    // Group dynamically
    const config: Record<string, any> = {};

    factors.forEach(f => {
      // Create a friendly grouping key from the factor category/scope
      const groupKey = f.category.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      if (!config[groupKey]) {
        config[groupKey] = {
          label: f.category,
          defaultScope: f.scope,
          units: [],
          categories: []
        };
      }
      
      // Ensure unit exists
      const unitObj = { value: f.factorUnit, label: f.factorUnit };
      if (!config[groupKey].units.some((u: any) => u.value === f.factorUnit)) {
        config[groupKey].units.push(unitObj);
      }
      
      // Ensure specific factor name exists as sub-category
      if (!config[groupKey].categories.includes(f.name)) {
        config[groupKey].categories.push(f.name);
      }
    });

    res.json({ sourceTypes: config });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch entry config' });
  }
});

export default router;
