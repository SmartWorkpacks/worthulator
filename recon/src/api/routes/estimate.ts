// ─── /api/estimate routes ─────────────────────────────────────────────────────
// POST /api/estimate/product  — MarketValueEngine
// POST /api/estimate/service  — FormulaEstimationEngine

import { Router, Request, Response } from 'express';
import type { ApiEstimateRequest, ApiResponse, MarketValuation, FormulaEstimate, ConditionNorm, FormulaInput } from '../../types';
import { MarketValueEngine }     from '../../valuation/marketEngine';
import { FormulaEstimationEngine } from '../../valuation/formulaEngine';

export const estimateRouter = Router();

const marketEngine  = new MarketValueEngine();
const formulaEngine = new FormulaEstimationEngine();

// ─── POST /api/estimate/product ───────────────────────────────────────────────

estimateRouter.post('/product', (req: Request, res: Response) => {
  const body  = req.body as ApiEstimateRequest;
  const { entity, condition, region } = body;

  if (!entity) {
    const r: ApiResponse<null> = { success: false, error: '"entity" is required', requestedAt: new Date().toISOString() };
    return res.status(400).json(r);
  }

  const norm: ConditionNorm = (['new', 'used', 'refurbished', 'unknown'] as const).includes(condition as ConditionNorm)
    ? condition as ConditionNorm
    : 'unknown';

  // Market engine requires in-memory listings. Pass empty array for now —
  // listings are injected via the /api/estimate/product/bulk or a phase-4 run.
  const result = marketEngine.valuate({ entity, condition: norm, region }, []);

  const r: ApiResponse<MarketValuation> = {
    success:     true,
    data:        result,
    requestedAt: new Date().toISOString(),
  };
  return res.json(r);
});

// ─── POST /api/estimate/service ───────────────────────────────────────────────

estimateRouter.post('/service', (req: Request, res: Response) => {
  const body = req.body as ApiEstimateRequest;
  const { serviceType, region, specs } = body;

  if (!serviceType || !region) {
    const r: ApiResponse<null> = { success: false, error: '"serviceType" and "region" are required', requestedAt: new Date().toISOString() };
    return res.status(400).json(r);
  }

  const input: FormulaInput = {
    serviceType,
    region,
    specs: specs ?? {},
  };

  const result = formulaEngine.estimate(input);

  const r: ApiResponse<FormulaEstimate> = {
    success:     true,
    data:        result,
    requestedAt: new Date().toISOString(),
  };
  return res.json(r);
});

// ─── GET /api/estimate/services — list supported formula services ─────────────

estimateRouter.get('/services', (_req: Request, res: Response) => {
  res.json({
    success:     true,
    data:        formulaEngine.supportedServices(),
    requestedAt: new Date().toISOString(),
  });
});
