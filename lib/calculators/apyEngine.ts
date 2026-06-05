// ─── APY (Annual Percentage Yield) Engine ─────────────────────────────────────
//
// Converts a stated (nominal) annual interest rate plus a compounding frequency
// into the APY — the real, effective yield once compounding is included — and
// projects how a deposit grows.
//
//   APY = (1 + r/n)^n − 1
//     r = nominal annual rate (decimal), n = compounding periods per year
//   Balance(t) = P · (1 + r/n)^(n·t)
//
// The key insight: more frequent compounding raises the APY above the stated rate,
// and APY (not the nominal rate) is what lets you compare accounts apples-to-apples.
//
// Pure & synchronous. Guards zero/negative/NaN.

export type CompoundingFrequency = "annually" | "quarterly" | "monthly" | "daily";

export const COMPOUNDING_PER_YEAR: Record<CompoundingFrequency, number> = {
  annually: 1,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export interface ApyInputs {
  principal: number;
  /** Stated / nominal annual interest rate, in percent (e.g. 4.3) */
  nominalRatePct: number;
  compounding: CompoundingFrequency;
  termYears: number;
}

export interface ApyResult {
  apyPct: number;              // effective annual yield, %
  nominalRatePct: number;
  /** APY minus nominal rate — the bonus from compounding (percentage points) */
  compoundingBonusPct: number;
  firstYearInterest: number;   // principal × APY
  balanceAfterTerm: number;
  interestEarned: number;      // balanceAfterTerm − principal
  /** APY at each compounding frequency, for a comparison chart */
  apyByFrequency: { label: string; amount: number }[];
  /** Balance by year over the term, for a growth line chart */
  balanceCurve: { x: number; y: number }[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const round = (n: number) => Math.round(n);
const round4 = (n: number) => Math.round(n * 10000) / 10000;

function apyDecimal(rDecimal: number, n: number): number {
  if (rDecimal <= 0 || n <= 0) return Math.max(0, rDecimal);
  return Math.pow(1 + rDecimal / n, n) - 1;
}

export function calculateApy(inputs: ApyInputs): ApyResult {
  const principal = Math.max(0, inputs.principal || 0);
  const nominalRatePct = Math.max(0, inputs.nominalRatePct || 0);
  const termYears = Math.max(0, inputs.termYears || 0);
  const n = COMPOUNDING_PER_YEAR[inputs.compounding] ?? 12;

  const r = nominalRatePct / 100;
  const apy = apyDecimal(r, n);
  const apyPct = round4(apy * 100);

  const balanceAfterTerm =
    r > 0 ? principal * Math.pow(1 + r / n, n * termYears) : principal;
  const interestEarned = balanceAfterTerm - principal;

  const apyByFrequency = (Object.keys(COMPOUNDING_PER_YEAR) as CompoundingFrequency[]).map(
    (freq) => ({
      label: freq.charAt(0).toUpperCase() + freq.slice(1),
      amount: round4(apyDecimal(r, COMPOUNDING_PER_YEAR[freq]) * 100),
    }),
  );

  const years = Math.max(1, Math.ceil(termYears));
  const balanceCurve = Array.from({ length: years + 1 }, (_, y) => ({
    x: y,
    y: round(r > 0 ? principal * Math.pow(1 + r / n, n * y) : principal),
  }));

  return {
    apyPct,
    nominalRatePct: round2(nominalRatePct),
    compoundingBonusPct: round4(apyPct - nominalRatePct),
    firstYearInterest: round(principal * apy),
    balanceAfterTerm: round(balanceAfterTerm),
    interestEarned: round(interestEarned),
    apyByFrequency,
    balanceCurve,
  };
}
