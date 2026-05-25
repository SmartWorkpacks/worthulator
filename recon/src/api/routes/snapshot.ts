// ─── /api/market-snapshot routes ─────────────────────────────────────────────
// GET /api/market-snapshot/:vertical
// Returns current price distribution across all entities in a vertical

import { Router, Request, Response } from 'express';
import type { ApiResponse, VerticalSlug } from '../../types';
import { getRegistry }           from '../../entity/registry';
import { getAllSourceStats }      from '../../ingestion/sourceScorer';

export const snapshotRouter = Router();

const VALID_VERTICALS: VerticalSlug[] = ['electronics', 'luxury', 'sneakers', 'home-services'];

// ─── GET /api/market-snapshot/:vertical ──────────────────────────────────────

snapshotRouter.get('/:vertical', (req: Request, res: Response) => {
  const vertical = req.params['vertical'] as VerticalSlug;

  if (!VALID_VERTICALS.includes(vertical)) {
    return res.status(400).json({
      success: false,
      error:   `Unknown vertical "${vertical}". Valid: ${VALID_VERTICALS.join(', ')}`,
      requestedAt: new Date().toISOString(),
    });
  }

  const registry = getRegistry();
  const entities = registry.all().filter((e) => e.vertical === vertical);

  const snapshot = {
    vertical,
    entityCount:  entities.length,
    entities:     entities.map((e) => ({
      id:            e.id,
      canonicalName: e.canonicalName,
      brand:         e.brand,
      model:         e.model,
      priceRange:    e.priceRangeLow && e.priceRangeHigh
        ? [e.priceRangeLow, e.priceRangeHigh]
        : null,
      aliasCount:    e.aliases.length,
    })),
    sourceStats:  getAllSourceStats().filter((s) =>
      entities.length > 0  // only show stats relevant to this vertical
    ),
    snapshotAt:   new Date().toISOString(),
  };

  const r: ApiResponse<typeof snapshot> = {
    success:     true,
    data:        snapshot,
    requestedAt: new Date().toISOString(),
  };
  res.json(r);
});

// ─── GET /api/market-snapshot — all verticals summary ────────────────────────

snapshotRouter.get('/', (_req, res: Response) => {
  const registry = getRegistry();

  const summary = VALID_VERTICALS.map((v) => ({
    vertical:    v,
    entityCount: registry.all().filter((e) => e.vertical === v).length,
  }));

  res.json({
    success:     true,
    data:        { verticals: summary, totalEntities: registry.count() },
    requestedAt: new Date().toISOString(),
  });
});
