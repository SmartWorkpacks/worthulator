// ─── Subscription Auditor — Pure Calculation Module ───────────────────────────
//
// PURPOSE:
//   Sum recurring subscription categories, project lifetime spend, and compute
//   monthly-compounded investment opportunity cost.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Benchmark averages INJECTED via `data` (costBenchmarks)
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Typical share of subscriptions cut in a focused audit without losing core access.
 * C+R / Deloitte framing: cancel duplicates + unused → ~20% reduction is realistic.
 */
export const DEFAULT_CUT_PCT = 0.20;

/** Days per year for daily cost derivation. */
export const DAYS_PER_YEAR = 365;

/** Default long-run US equity return for opportunity-cost projections. */
export const DEFAULT_ANNUAL_RETURN = 7;

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface SubscriptionAuditorInputs {
  streaming:    number;
  software:     number;
  fitness:      number;
  newsMedia:    number;
  other:        number;
  /** Expected annual investment return (%) */
  annualReturn: number;
}

export interface SubscriptionAuditorData {
  /** National avg household subscription spend $/mo (live benchmark) */
  avgMonthlySubscriptions: number;
  /** National avg streaming-only $/mo (live benchmark) */
  avgStreamingOnly: number;
}

export interface SubscriptionAuditorResult {
  monthlyTotal:          number;
  annualTotal:           number;
  dailyCost:             number;
  twentyYearCost:        number;
  investedValue10:       number;
  investedValue20:       number;
  cutTwentyAnnualSaving: number;
  cutTwentyInvested10:   number;
  vsAvgMonthly:          number;
  vsAvgPct:              number;
  streamingPct:          number;
  softwarePct:           number;
  fitnessPct:            number;
  newsMediaPct:          number;
  otherPct:              number;
  annualReturn:          number;
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Future value of equal monthly contributions (end-of-month ordinary annuity).
 * FV = PMT × ((1 + r)^n − 1) / r
 */
export function monthlyAnnuityFV(
  monthlyPayment: number,
  months: number,
  annualReturnPct: number,
): number {
  const pmt = Math.max(0, monthlyPayment);
  const n   = Math.max(0, Math.round(months));
  if (pmt <= 0 || n <= 0) return 0;
  const r = Math.max(0, annualReturnPct) / 100 / 12;
  if (r === 0) return round2(pmt * n);
  return round2(pmt * ((Math.pow(1 + r, n) - 1) / r));
}

function categoryPct(amount: number, total: number): number {
  if (total <= 0) return 0;
  return round2((amount / total) * 100);
}

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateSubscriptionAuditor(
  inputs: SubscriptionAuditorInputs,
  data: SubscriptionAuditorData,
): SubscriptionAuditorResult {
  const streaming = Math.max(0, Number(inputs.streaming)   || 0);
  const software  = Math.max(0, Number(inputs.software)    || 0);
  const fitness   = Math.max(0, Number(inputs.fitness)     || 0);
  const newsMedia = Math.max(0, Number(inputs.newsMedia)   || 0);
  const other     = Math.max(0, Number(inputs.other)       || 0);
  const annualReturn = clamp(
    Number(inputs.annualReturn) || DEFAULT_ANNUAL_RETURN,
    0,
    20,
  );

  const monthlyTotal = round2(streaming + software + fitness + newsMedia + other);
  const annualTotal  = round2(monthlyTotal * 12);
  const dailyCost    = monthlyTotal > 0 ? round2(annualTotal / DAYS_PER_YEAR) : 0;
  const twentyYearCost = round2(annualTotal * 20);

  const investedValue10 = monthlyAnnuityFV(monthlyTotal, 120, annualReturn);
  const investedValue20 = monthlyAnnuityFV(monthlyTotal, 240, annualReturn);

  const cutTwentyAnnualSaving = round2(annualTotal * DEFAULT_CUT_PCT);
  const cutMonthly          = round2(monthlyTotal * (1 - DEFAULT_CUT_PCT));
  const cutTwentyInvested10 = monthlyAnnuityFV(cutMonthly, 120, annualReturn);

  const avgMonthly = Math.max(0, Number(data.avgMonthlySubscriptions) || 0);
  const vsAvgMonthly = round2(monthlyTotal - avgMonthly);
  const vsAvgPct = avgMonthly > 0
    ? round2((vsAvgMonthly / avgMonthly) * 100)
    : 0;

  return {
    monthlyTotal,
    annualTotal,
    dailyCost,
    twentyYearCost,
    investedValue10,
    investedValue20,
    cutTwentyAnnualSaving,
    cutTwentyInvested10,
    vsAvgMonthly,
    vsAvgPct,
    streamingPct: categoryPct(streaming, monthlyTotal),
    softwarePct:  categoryPct(software,  monthlyTotal),
    fitnessPct:   categoryPct(fitness,   monthlyTotal),
    newsMediaPct: categoryPct(newsMedia, monthlyTotal),
    otherPct:     categoryPct(other,     monthlyTotal),
    annualReturn,
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
