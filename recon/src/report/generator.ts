// ─── Feasibility report generator ────────────────────────────────────────────
// Converts VerticalAnalysis[] into FeasibilityScore[] + a ranked summary report.

import type {
  VerticalAnalysis,
  FeasibilityScore,
  FeasibilityReport,
  VerticalSlug,
  Verdict,
} from '../types';
import { VERTICAL_CONFIGS } from '../config/verticals';

// ─── Scoring weights ──────────────────────────────────────────────────────────

const WEIGHTS = {
  dataRichness:            0.20,
  normalizationDifficulty: 0.10,   // inverted — harder = lower score
  entityMatchDifficulty:   0.10,   // inverted
  monetizationPotential:   0.25,
  scalability:             0.15,
  seoPotential:            0.20,
};

// ─── Derived scoring helpers ──────────────────────────────────────────────────

function scoreDataRichness(analysis: VerticalAnalysis): number {
  // 0–10 based on normalised count + unique entities
  const byCount    = Math.min(analysis.normalizedCount / 50, 1) * 5;   // 50+ = 5pts
  const byEntities = Math.min(analysis.uniqueEntities   / 10, 1) * 3;   // 10+ = 3pts
  const byPrice    = (1 - analysis.missingPriceRatio)              * 2;  // 100% priced = 2pts
  return Math.round((byCount + byEntities + byPrice) * 10) / 10;
}

function scoreNormDifficulty(analysis: VerticalAnalysis): number {
  // Higher missingPriceRatio + lower entityConfidence = harder
  const pricePenalty  = analysis.missingPriceRatio * 5;
  const entityPenalty = (1 - analysis.avgEntityConfidence) * 5;
  return Math.round((pricePenalty + entityPenalty) * 10) / 10;
}

function scoreEntityMatchDifficulty(analysis: VerticalAnalysis): number {
  const unmatched     = analysis.matchBreakdown['unmatched']    ?? 0;
  const brandOnly     = analysis.matchBreakdown['brand-only']   ?? 0;
  const total         = analysis.normalizedCount || 1;
  const weakMatchRate = (unmatched + brandOnly) / total;
  return Math.round(weakMatchRate * 10 * 10) / 10;
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateFeasibilityScore(
  analysis: VerticalAnalysis,
): FeasibilityScore {
  const vc      = VERTICAL_CONFIGS[analysis.vertical];
  const priors  = vc.priors;

  const dataRichness            = scoreDataRichness(analysis);
  const normalizationDifficulty = scoreNormDifficulty(analysis);
  const entityMatchDifficulty   = scoreEntityMatchDifficulty(analysis);
  const monetizationPotential   = priors.monetizationPotential;
  const seoPotential            = priors.seoPotential;
  const scalability             = Math.round(
    (dataRichness * 0.5 + (10 - normalizationDifficulty) * 0.3 + (10 - entityMatchDifficulty) * 0.2) * 10,
  ) / 10;

  const overallScore = Math.round((
    dataRichness            * WEIGHTS.dataRichness +
    (10 - normalizationDifficulty) * WEIGHTS.normalizationDifficulty +
    (10 - entityMatchDifficulty)   * WEIGHTS.entityMatchDifficulty +
    monetizationPotential   * WEIGHTS.monetizationPotential +
    scalability             * WEIGHTS.scalability +
    seoPotential            * WEIGHTS.seoPotential
  ) * 10) / 10;

  const verdict: Verdict = overallScore >= 7 ? 'build' : overallScore >= 5 ? 'watch' : 'skip';

  return {
    vertical:                analysis.vertical,
    dataRichness,
    normalizationDifficulty,
    entityMatchDifficulty,
    monetizationPotential,
    scalability,
    freshnessRequirement:    priors.freshnessRequirement,
    seoPotential,
    overallScore,
    verdict,
    notes:                   priors.scalabilityNotes,
  };
}

export function generateReport(
  mode:      'mock' | 'live',
  analyses:  VerticalAnalysis[],
): FeasibilityReport {
  const scores  = analyses.map(generateFeasibilityScore);
  const ranked  = [...scores].sort((a, b) => b.overallScore - a.overallScore);
  const topVertical = ranked[0]?.vertical ?? 'electronics' as VerticalSlug;

  const buildList = ranked.filter((s) => s.verdict === 'build').map((s) => s.vertical);
  const recommendation = buildList.length > 0
    ? `Build first: ${buildList.join(', ')}. Highest combined data density, monetisation, and SEO potential.`
    : `No vertical scored above threshold in this run. Expand fixture/live data and re-run.`;

  return {
    generatedAt:    new Date().toISOString(),
    mode,
    verticals:      analyses,
    scores:         ranked,
    topVertical,
    recommendation,
  };
}
