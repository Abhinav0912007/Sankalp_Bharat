// ============================================================
// CarbonLens Backend — Express App Entry Point
// ============================================================
// Sameera's Phase 1 deliverable.
// Sets up Express, registers all route groups, starts server.
// ============================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before anything else
dotenv.config();

// Route imports
import authRoutes from './routes/auth';
import recordRoutes from './routes/records';
import issueRoutes from './routes/issues';
import organizationRoutes from './routes/organizations';
import facilityRoutes from './routes/facilities';
import dashboardRoutes from './routes/dashboard';
import supplierRoutes from './routes/suppliers';
import reportRoutes from './routes/reports';

const app = express();
const PORT = parseInt(process.env.PORT ?? '5000', 10);

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (temp storage during hackathon)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Health Check ────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Route Registration ──────────────────────────────────────
// All routes live under /api/ prefix
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/reports', reportRoutes);

// ── 404 Handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Route not found',
  });
});

// ── Global Error Handler ────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ CarbonLens API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});

export default app;
