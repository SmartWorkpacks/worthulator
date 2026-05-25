// ─── Internal API server — Phase 10 ──────────────────────────────────────────
// Express server. Internal use only — no auth, no public exposure.
// Start: npx tsx src/api/server.ts [--port 4000]

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

import { estimateRouter } from './routes/estimate';
import { entityRouter }   from './routes/entity';
import { trendRouter }    from './routes/trend';
import { snapshotRouter } from './routes/snapshot';

// ─── App setup ────────────────────────────────────────────────────────────────

const app = express();

app.use(express.json({ limit: '1mb' }));

// Internal-only: reject requests from outside localhost in production
app.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.socket.remoteAddress ?? '';
  if (process.env['NODE_ENV'] === 'production' && !ip.startsWith('127') && !ip.startsWith('::1')) {
    return res.status(403).json({ error: 'Internal API — access denied' });
  }
  return next();
});

// ─── Request logger ───────────────────────────────────────────────────────────

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(chalk.gray(`  ${req.method} ${req.path}`));
  next();
});

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/estimate',        estimateRouter);
app.use('/api/entity',          entityRouter);
app.use('/api/value-trend',     trendRouter);
app.use('/api/market-snapshot', snapshotRouter);

// ─── 404 ──────────────────────────────────────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found', requestedAt: new Date().toISOString() });
});

// ─── Error handler ────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(chalk.red('[api error]'), err.message);
  res.status(500).json({ error: 'Internal server error', requestedAt: new Date().toISOString() });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = parseInt(process.env['API_PORT'] ?? '4000', 10);

app.listen(PORT, '127.0.0.1', () => {
  console.log(chalk.bold.cyan(`\n  Worthulator Recon API`));
  console.log(chalk.white(`  Listening on http://127.0.0.1:${PORT}`));
  console.log(chalk.gray(''));
  console.log(chalk.gray('  Endpoints:'));
  console.log(chalk.gray(`    GET  /health`));
  console.log(chalk.gray(`    POST /api/estimate/product`));
  console.log(chalk.gray(`    POST /api/estimate/service`));
  console.log(chalk.gray(`    GET  /api/estimate/services`));
  console.log(chalk.gray(`    GET  /api/entity/search?q=...`));
  console.log(chalk.gray(`    GET  /api/entity/stats`));
  console.log(chalk.gray(`    GET  /api/entity/merge-candidates`));
  console.log(chalk.gray(`    GET  /api/entity/:id`));
  console.log(chalk.gray(`    GET  /api/value-trend/:entityId`));
  console.log(chalk.gray(`    GET  /api/market-snapshot`));
  console.log(chalk.gray(`    GET  /api/market-snapshot/:vertical`));
  console.log('');
});

export { app };
