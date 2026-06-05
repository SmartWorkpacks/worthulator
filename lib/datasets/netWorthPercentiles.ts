// ─── US net-worth percentiles by age (reference dataset) ─────────────────────
//
// Source: derived from the Federal Reserve Survey of Consumer Finances (SCF)
// 2022 — the most recent triennial wave. Net worth is highly skewed, so each
// age bracket carries a ladder of percentile anchors (net worth at p10…p99)
// and we interpolate the user's percentile piecewise-linearly between anchors.
//
// These are APPROXIMATE reference anchors, not exact SCF microdata, and are
// intended for "how do I compare?" context — not precise statistical claims.
// Medians track published SCF figures; tail anchors are reasonable estimates.
//
// This is a static reference dataset (SCF releases every ~3 years), so it is
// not "live"/Apify-refreshed — it is a documented benchmark.

export interface NetWorthBracket {
  /** Inclusive lower age bound */
  minAge: number;
  /** Inclusive upper age bound (Infinity for 75+) */
  maxAge: number;
  label: string;
  /** Published SCF 2022 median net worth for the bracket */
  median: number;
  /** Ascending [percentile, netWorth] anchors used for interpolation */
  anchors: Array<[number, number]>;
}

export const NET_WORTH_BRACKETS: NetWorthBracket[] = [
  {
    minAge: 0, maxAge: 34, label: "under 35", median: 39_000,
    anchors: [[10, -5_000], [25, 3_500], [50, 39_000], [75, 120_000], [90, 300_000], [95, 500_000], [99, 1_200_000]],
  },
  {
    minAge: 35, maxAge: 44, label: "35–44", median: 135_600,
    anchors: [[10, 0], [25, 20_000], [50, 135_600], [75, 375_000], [90, 750_000], [95, 1_200_000], [99, 3_000_000]],
  },
  {
    minAge: 45, maxAge: 54, label: "45–54", median: 247_200,
    anchors: [[10, 0], [25, 45_000], [50, 247_200], [75, 620_000], [90, 1_300_000], [95, 2_000_000], [99, 5_000_000]],
  },
  {
    minAge: 55, maxAge: 64, label: "55–64", median: 364_500,
    anchors: [[10, 2_000], [25, 80_000], [50, 364_500], [75, 850_000], [90, 1_800_000], [95, 2_800_000], [99, 7_000_000]],
  },
  {
    minAge: 65, maxAge: 74, label: "65–74", median: 409_900,
    anchors: [[10, 12_000], [25, 120_000], [50, 409_900], [75, 950_000], [90, 2_000_000], [95, 3_200_000], [99, 8_000_000]],
  },
  {
    minAge: 75, maxAge: Infinity, label: "75+", median: 335_600,
    anchors: [[10, 20_000], [25, 130_000], [50, 335_600], [75, 830_000], [90, 1_700_000], [95, 2_600_000], [99, 6_500_000]],
  },
];

export function getNetWorthBracket(age: number): NetWorthBracket {
  return (
    NET_WORTH_BRACKETS.find((b) => age >= b.minAge && age <= b.maxAge) ??
    NET_WORTH_BRACKETS[0]
  );
}

export interface NetWorthPercentile {
  /** Estimated percentile (1–99) within the age bracket */
  percentile: number;
  bracketLabel: string;
  bracketMedian: number;
  /** Multiple of the bracket median the user's net worth represents */
  medianMultiple: number;
}

/**
 * Estimate the percentile rank of `netWorth` within the user's age bracket via
 * piecewise-linear interpolation across the SCF anchors. Clamped to [1, 99].
 */
export function getNetWorthPercentile(age: number, netWorth: number): NetWorthPercentile {
  const bracket = getNetWorthBracket(age);
  const a = bracket.anchors;

  let percentile: number;
  if (netWorth <= a[0][1]) {
    percentile = a[0][0];
  } else if (netWorth >= a[a.length - 1][1]) {
    percentile = a[a.length - 1][0];
  } else {
    percentile = a[a.length - 1][0];
    for (let i = 0; i < a.length - 1; i++) {
      const [pLo, vLo] = a[i];
      const [pHi, vHi] = a[i + 1];
      if (netWorth >= vLo && netWorth <= vHi) {
        const frac = vHi === vLo ? 0 : (netWorth - vLo) / (vHi - vLo);
        percentile = pLo + frac * (pHi - pLo);
        break;
      }
    }
  }

  percentile = Math.max(1, Math.min(99, Math.round(percentile)));
  const bracketMedian = bracket.median;
  const medianMultiple = bracketMedian > 0 ? Math.round((netWorth / bracketMedian) * 100) / 100 : 0;

  return { percentile, bracketLabel: bracket.label, bracketMedian, medianMultiple };
}
