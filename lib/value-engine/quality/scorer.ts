// ─── WVE Estimation Quality Scorer — Phase 13 ────────────────────────────────
// Deterministic, zero-dependency quality scoring for registry entities.
// All functions are pure and SSR-safe.

import type { RegistryEntity } from "../entityRegistry/types";
import type {
  QualityAssessment,
  QualityDimension,
  QualityReport,
  QualityTier,
} from "./types";

// ── Tier thresholds ───────────────────────────────────────────────────────
const TIER_THRESHOLDS: Record<QualityTier, number> = {
  premium:  85,
  standard: 65,
  draft:    40,
  blocked:   0,
};

function scoreTier(score: number): QualityTier {
  if (score >= TIER_THRESHOLDS.premium)  return "premium";
  if (score >= TIER_THRESHOLDS.standard) return "standard";
  if (score >= TIER_THRESHOLDS.draft)    return "draft";
  return "blocked";
}

// ── Dimension scorers (each returns 0–100) ─────────────────────────────────

function scoreEstimateConfidence(entity: RegistryEntity): number {
  return entity.quality.estimateConfidence;
}

function scoreBenchmarkConfidence(entity: RegistryEntity): number {
  switch (entity.benchmark.confidenceLevel) {
    case "high":        return 100;
    case "moderate":    return 70;
    case "preliminary": return 40;
  }
}

function scoreDataFreshness(entity: RegistryEntity): number {
  const [year, month] = entity.benchmark.lastUpdated.split("-").map(Number);
  if (!year || !month) return 20;

  // Use a fixed reference date anchored to 2026-05 so tests are stable
  const REF_YEAR = 2026;
  const REF_MONTH = 5;
  const ageMonths = (REF_YEAR - year) * 12 + (REF_MONTH - month);

  if (ageMonths <=  6) return 100;
  if (ageMonths <= 12) return 80;
  if (ageMonths <= 18) return 65;
  if (ageMonths <= 24) return 45;
  if (ageMonths <= 36) return 25;
  return 10;
}

function scoreSeoCompleteness(entity: RegistryEntity): number {
  let score = 0;
  if (entity.seo.primaryKeyword.length > 5)           score += 40;
  if (entity.seo.relatedKeywords.length >= 3)          score += 30;
  else if (entity.seo.relatedKeywords.length >= 1)     score += 15;
  if (entity.seo.includeInSitemap)                     score += 15;
  if (entity.seo.searchVolumeTier !== "niche")         score += 15;
  return Math.min(score, 100);
}

function scoreProfileCompleteness(entity: RegistryEntity): number {
  let score = 0;
  // Benchmark range valid
  if (entity.benchmark.lowUSD > 0 && entity.benchmark.highUSD > entity.benchmark.lowUSD) score += 30;
  // Aliases exist (search quality)
  if (entity.aliases.length >= 3) score += 20;
  else if (entity.aliases.length >= 1) score += 10;
  // Monetization profiled
  if (entity.monetization.averageOrderValue > 0) score += 20;
  // Regional profiled
  if (entity.regional.nationwide || (entity.regional.topMarkets?.length ?? 0) > 0) score += 15;
  // Category populated
  if (entity.category.length > 0) score += 15;
  return Math.min(score, 100);
}

// ── Issue flag collector ───────────────────────────────────────────────────

function collectFlags(entity: RegistryEntity): string[] {
  const flags: string[] = [];

  if (entity.quality.estimateConfidence < 70)
    flags.push(`Low estimate confidence (${entity.quality.estimateConfidence}%)`);

  if (entity.benchmark.confidenceLevel === "preliminary")
    flags.push("Benchmark data is preliminary — needs verification");

  if (entity.seo.relatedKeywords.length < 3)
    flags.push(`Sparse related keywords (${entity.seo.relatedKeywords.length} found, 3+ recommended)`);

  if (entity.aliases.length < 3)
    flags.push(`Few aliases (${entity.aliases.length} found, 3+ recommended for search quality)`);

  const [year, month] = entity.benchmark.lastUpdated.split("-").map(Number);
  if (year && month) {
    const ageMonths = (2026 - year) * 12 + (5 - month);
    if (ageMonths > 24)
      flags.push(`Benchmark data is stale (${Math.floor(ageMonths / 12)} years old)`);
  }

  if (!entity.seo.includeInSitemap && entity.quality.routeEligible)
    flags.push("Route eligible but excluded from sitemap — check seo.includeInSitemap");

  return flags;
}

// ── Main scorer ───────────────────────────────────────────────────────────

/** Compute a full quality assessment for a single entity */
export function computeQuality(entity: RegistryEntity): QualityAssessment {
  const dimensions = {
    estimateConfidence: {
      score:  scoreEstimateConfidence(entity),
      weight: 0.30,
      label:  "Estimate Confidence",
      note:   `${entity.quality.estimateConfidence}% from quality profile`,
    } satisfies QualityDimension,
    benchmarkConfidence: {
      score:  scoreBenchmarkConfidence(entity),
      weight: 0.25,
      label:  "Benchmark Confidence",
      note:   entity.benchmark.confidenceLevel,
    } satisfies QualityDimension,
    dataFreshness: {
      score:  scoreDataFreshness(entity),
      weight: 0.20,
      label:  "Data Freshness",
      note:   `Last updated ${entity.benchmark.lastUpdated}`,
    } satisfies QualityDimension,
    seoCompleteness: {
      score:  scoreSeoCompleteness(entity),
      weight: 0.15,
      label:  "SEO Completeness",
    } satisfies QualityDimension,
    profileCompleteness: {
      score:  scoreProfileCompleteness(entity),
      weight: 0.10,
      label:  "Profile Completeness",
    } satisfies QualityDimension,
  };

  const score = Math.round(
    Object.values(dimensions).reduce((sum, d) => sum + d.score * d.weight, 0),
  );

  const tier = scoreTier(score);
  const routeEligible = entity.quality.routeEligible && score >= entity.seo.minQualityGate;
  const indexEligible = routeEligible && tier !== "draft" && tier !== "blocked";

  return {
    entityId:    entity.id,
    score,
    tier,
    routeEligible,
    indexEligible,
    breakdown:   dimensions,
    flags:       collectFlags(entity),
  };
}

/** Generate a full quality report across a set of entities */
export function generateQualityReport(entities: RegistryEntity[]): QualityReport {
  const assessments = entities.map(computeQuality);
  const counts = { premium: 0, standard: 0, draft: 0, blocked: 0 };
  let totalScore = 0;
  let routeEligible = 0;

  for (const a of assessments) {
    counts[a.tier]++;
    totalScore += a.score;
    if (a.routeEligible) routeEligible++;
  }

  return {
    total:         assessments.length,
    premium:       counts.premium,
    standard:      counts.standard,
    draft:         counts.draft,
    blocked:       counts.blocked,
    routeEligible,
    averageScore:  assessments.length ? Math.round(totalScore / assessments.length) : 0,
    entities:      assessments,
  };
}
