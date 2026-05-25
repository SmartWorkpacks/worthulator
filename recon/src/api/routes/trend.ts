// ─── /api/value-trend routes ─────────────────────────────────────────────────
// GET /api/value-trend/:entityId?condition=used&days=90

import { Router, Request, Response } from 'express';
import type { ApiResponse, HistoricalSnapshot, ConditionNorm } from '../../types';
import { fetchSnapshots } from '../../db/historyQueries';

export const trendRouter = Router();

// ─── GET /api/value-trend/:entityId ──────────────────────────────────────────

trendRouter.get('/:entityId', async (req: Request, res: Response) => {
  const { entityId } = req.params;
  const condition    = (req.query['condition'] ?? 'unknown') as ConditionNorm;
  const days         = Math.min(parseInt(String(req.query['days'] ?? '90'), 10), 730);

  const snapshots = await fetchSnapshots(entityId!, condition, days);

  // Compute simple moving average (7-day window)
  const withSma = computeSMA(snapshots, 7);

  const r: ApiResponse<{ snapshots: typeof withSma; entityId: string; condition: string; days: number }> = {
    success:     true,
    data:        { snapshots: withSma, entityId: entityId!, condition, days },
    requestedAt: new Date().toISOString(),
  };
  res.json(r);
});

// ─── Moving average helper ────────────────────────────────────────────────────

function computeSMA(
  snaps:      HistoricalSnapshot[],
  windowDays: number,
): Array<HistoricalSnapshot & { sma?: number }> {
  return snaps.map((snap, i) => {
    const windowStart = new Date(snap.snapshotDate);
    windowStart.setDate(windowStart.getDate() - windowDays);

    const window = snaps
      .slice(0, i + 1)
      .filter((s) => new Date(s.snapshotDate) >= windowStart);

    const sma = window.length > 0
      ? Math.round(window.reduce((s, x) => s + x.priceUsd, 0) / window.length)
      : undefined;

    return { ...snap, sma };
  });
}
