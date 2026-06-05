// ─── Job Offer Comparison ─────────────────────────────────────────────────────
//
// Compares two job offers on TOTAL EFFECTIVE COMPENSATION rather than headline
// salary: salary + annual benefits value − annual commute cost. Surfaces the
// monthly take-home gap, multi-year gaps, the benefits and commute deltas, and
// the 10-year wealth gap if the monthly difference were invested.
//
// Pure module: no dataset reads, no React. The investment-return assumption is
// injected via `data` so the projection stays testable and overridable.
// ─────────────────────────────────────────────────────────────────────────────

export interface JobOfferInputs {
  salaryA: number;
  salaryB: number;
  commuteCostA: number;
  commuteCostB: number;
  benefitsValueA: number;
  benefitsValueB: number;
}

export interface JobOfferData {
  /** Annual investment return assumption for the wealth-gap projection (%). Default 7. */
  investReturnPct?: number;
}

export interface JobOfferResult {
  /** Job A total effective comp: salary + benefits − commute */
  effectiveA: number;
  /** Job B total effective comp */
  effectiveB: number;
  /** effectiveA − effectiveB (positive ⇒ A wins) */
  difference: number;
  /** Monthly take-home gap (difference ÷ 12) */
  monthlyGap: number;
  /** Cumulative gap over 5 years (nominal) */
  fiveYearGap: number;
  /** Cumulative gap over 10 years (nominal) */
  tenYearGap: number;
  /** benefitsValueA − benefitsValueB (positive ⇒ A has richer benefits) */
  benefitsGap: number;
  /** commuteCostA − commuteCostB (positive ⇒ A's commute costs more ⇒ B advantage) */
  commuteGap: number;
  /** 10-year wealth gap if the monthly difference were invested at the assumed return */
  tenYearInvestedGap: number;
  [key: string]: number;
}

export function calculateJobOffer(
  inputs: JobOfferInputs,
  data: JobOfferData = {},
): JobOfferResult {
  const r = (data.investReturnPct ?? 7) / 100;

  const effA = inputs.salaryA + inputs.benefitsValueA - inputs.commuteCostA;
  const effB = inputs.salaryB + inputs.benefitsValueB - inputs.commuteCostB;
  const difference = effA - effB;
  const monthlyGap = difference / 12;

  // Future value of the monthly gap invested for 10 years (ordinary annuity).
  const i = r / 12;
  const n = 120;
  const fvFactor = i > 0 ? (Math.pow(1 + i, n) - 1) / i : n;
  const tenYearInvestedGap = monthlyGap * fvFactor;

  return {
    effectiveA: Math.round(effA),
    effectiveB: Math.round(effB),
    difference: Math.round(difference),
    monthlyGap: Math.round(monthlyGap),
    fiveYearGap: Math.round(difference * 5),
    tenYearGap: Math.round(difference * 10),
    benefitsGap: Math.round(inputs.benefitsValueA - inputs.benefitsValueB),
    commuteGap: Math.round(inputs.commuteCostA - inputs.commuteCostB),
    tenYearInvestedGap: Math.round(tenYearInvestedGap),
  };
}
