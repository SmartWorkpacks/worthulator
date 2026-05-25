// ─── /api/entity routes ───────────────────────────────────────────────────────
// GET  /api/entity/search?q=...&limit=10
// GET  /api/entity/:id
// GET  /api/entity/stats

import { Router, Request, Response } from 'express';
import type { ApiResponse, EntityRecord } from '../../types';
import { getRegistry }   from '../../entity/registry';
import { findMergeCandidates } from '../../entity/merger';

export const entityRouter = Router();

// ─── GET /api/entity/search ───────────────────────────────────────────────────

entityRouter.get('/search', (req: Request, res: Response) => {
  const q     = String(req.query['q'] ?? '').trim();
  const limit = Math.min(parseInt(String(req.query['limit'] ?? '10'), 10), 50);

  if (!q) {
    return res.status(400).json({ success: false, error: '"q" query param is required', requestedAt: new Date().toISOString() });
  }

  const registry = getRegistry();
  const results  = registry.search(q, limit);

  const r: ApiResponse<EntityRecord[]> = {
    success:     true,
    data:        results,
    requestedAt: new Date().toISOString(),
  };
  return res.json(r);
});

// ─── GET /api/entity/stats ────────────────────────────────────────────────────

entityRouter.get('/stats', (_req: Request, res: Response) => {
  const registry = getRegistry();
  const all      = registry.all();

  const byVertical = all.reduce<Record<string, number>>((acc, e) => {
    acc[e.vertical] = (acc[e.vertical] ?? 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data:    { total: registry.count(), byVertical },
    requestedAt: new Date().toISOString(),
  });
});

// ─── GET /api/entity/merge-candidates ────────────────────────────────────────

entityRouter.get('/merge-candidates', (_req: Request, res: Response) => {
  const candidates = findMergeCandidates(0.85);
  res.json({
    success:     true,
    data:        candidates,
    requestedAt: new Date().toISOString(),
  });
});

// ─── GET /api/entity/:id ──────────────────────────────────────────────────────

entityRouter.get('/:id', (req: Request, res: Response) => {
  const registry = getRegistry();
  const entity   = registry.getById(req.params['id']!);

  if (!entity) {
    return res.status(404).json({ success: false, error: 'Entity not found', requestedAt: new Date().toISOString() });
  }

  res.json({ success: true, data: entity, requestedAt: new Date().toISOString() });
});
