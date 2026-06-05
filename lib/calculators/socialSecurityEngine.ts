// ─── Social Security Benefit Engine ───────────────────────────────────────────
//
// Estimates the monthly Social Security retirement benefit and how it changes
// with claiming age (62 → 70). This is an ESTIMATE: the SSA computes your benefit
// from 35 years of inflation-indexed earnings; here we approximate your AIME
// (Average Indexed Monthly Earnings) from a steady career income, then apply the
// official PIA bend-point formula and the statutory early/delayed adjustments.
//
// CONSTANTS — Social Security Administration, 2025 (update annually):
//   Bend points (PIA):  $1,226 and $7,391            — SSA 2025
//   Taxable wage base:  $176,100                      — SSA 2025
//   PIA formula: 90% of AIME up to bend1, 32% between bend1–bend2, 15% above.
//   Full Retirement Age (FRA): 67 for those born 1960+; 66–67 for 1955–1959; 66 for 1943–1954.
//   Early reduction: 5/9 of 1%/mo for the first 36 months early, then 5/12 of 1%/mo.
//   Delayed retirement credits: 2/3 of 1%/mo (8%/yr) from FRA to age 70.
//
// Pure & synchronous. Guards zero/negative/NaN.

export interface SocialSecurityInputs {
  birthYear: number;
  /** Steady annual earnings used to approximate AIME (capped at the wage base) */
  annualIncome: number;
  /** Age the user plans to claim (62–70) */
  claimingAge: number;
}

export interface SocialSecurityResult {
  fullRetirementAge: number;     // in years (may be fractional, e.g. 66.83)
  fraLabel: string;              // e.g. "67" or "66 yr 10 mo"
  aime: number;                  // approximate Average Indexed Monthly Earnings
  pia: number;                   // Primary Insurance Amount (monthly benefit at FRA)
  monthlyBenefit: number;        // at the chosen claiming age
  annualBenefit: number;
  pctOfPia: number;              // benefit as % of PIA at the chosen age
  benefitAt62: number;
  benefitAtFra: number;
  benefitAt70: number;
  /** Monthly benefit at each claiming age 62..70 */
  benefitByAge: { x: number; y: number }[];
}

// ── SSA 2025 constants ────────────────────────────────────────────────────────
export const SSA = {
  year: 2025,
  bendPoint1: 1226,
  bendPoint2: 7391,
  wageBase: 176_100,
} as const;

const round = (n: number) => Math.round(n);
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Full Retirement Age in months, per SSA birth-year rules. */
export function fraMonths(birthYear: number): number {
  if (birthYear <= 1937) return 65 * 12;
  if (birthYear <= 1942) return 65 * 12 + (birthYear - 1937) * 2; // +2 mo/yr
  if (birthYear <= 1954) return 66 * 12;
  if (birthYear <= 1959) return 66 * 12 + (birthYear - 1954) * 2; // +2 mo/yr
  return 67 * 12;
}

function fraLabelFromMonths(m: number): string {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  return mo === 0 ? `${y}` : `${y} yr ${mo} mo`;
}

/** PIA from AIME using the SSA bend-point formula. */
function piaFromAime(aime: number): number {
  const b1 = Math.min(aime, SSA.bendPoint1);
  const b2 = Math.max(0, Math.min(aime, SSA.bendPoint2) - SSA.bendPoint1);
  const b3 = Math.max(0, aime - SSA.bendPoint2);
  return 0.9 * b1 + 0.32 * b2 + 0.15 * b3;
}

/** Benefit adjustment factor for claiming at `claimMonths` given `fra` (months). */
function claimFactor(claimMonths: number, fra: number): number {
  const delta = claimMonths - fra;
  if (delta === 0) return 1;
  if (delta < 0) {
    const early = -delta;
    const first36 = Math.min(early, 36);
    const beyond = Math.max(0, early - 36);
    const reduction = first36 * (5 / 9 / 100) + beyond * (5 / 12 / 100);
    return Math.max(0, 1 - reduction);
  }
  // Delayed retirement credits, capped at age 70.
  return 1 + delta * (2 / 3 / 100);
}

export function calculateSocialSecurity(inputs: SocialSecurityInputs): SocialSecurityResult {
  const birthYear = Math.round(inputs.birthYear || 0);
  const annualIncome = Math.max(0, inputs.annualIncome || 0);
  const claimingAge = Math.min(70, Math.max(62, inputs.claimingAge || 62));

  const fra = fraMonths(birthYear || 1970);
  const cappedIncome = Math.min(annualIncome, SSA.wageBase);
  const aime = cappedIncome / 12;
  const pia = piaFromAime(aime);

  const benefitAtAge = (age: number) => {
    // Cap delayed credits at 70.
    const claimMonths = Math.min(age, 70) * 12;
    return pia * claimFactor(claimMonths, fra);
  };

  const monthlyBenefit = benefitAtAge(claimingAge);
  const benefitByAge = [62, 63, 64, 65, 66, 67, 68, 69, 70].map((a) => ({
    x: a,
    y: round(benefitAtAge(a)),
  }));

  return {
    fullRetirementAge: round2(fra / 12),
    fraLabel: fraLabelFromMonths(fra),
    aime: round(aime),
    pia: round(pia),
    monthlyBenefit: round(monthlyBenefit),
    annualBenefit: round(monthlyBenefit * 12),
    pctOfPia: pia > 0 ? Math.round((monthlyBenefit / pia) * 100) : 0,
    benefitAt62: round(benefitAtAge(62)),
    benefitAtFra: round(pia),
    benefitAt70: round(benefitAtAge(70)),
    benefitByAge,
  };
}
