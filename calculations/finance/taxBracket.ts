// ─── Tax Bracket Calculator — Pure Calculation Module ─────────────────────────
//
// PURPOSE:
//   Compute U.S. federal income tax from gross income using the 2025 progressive
//   brackets and the standard deduction for the chosen filing status. Returns the
//   tax owed plus the two numbers people confuse: the EFFECTIVE rate (total tax ÷
//   gross) and the MARGINAL rate (the bracket the last dollar lands in).
//
//   This deliberately replaces the old stub, which merely divided a user-entered
//   "taxes paid" by income. Here the tax is computed from first principles so the
//   marginal-vs-effective story is real, not self-reported.
//
// SCOPE: Federal ordinary income tax only — excludes FICA, state, and credits.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

export type FilingStatus = "single" | "married" | "hoh";

export interface TaxBracketInputs {
  grossIncome:         number;       // $
  filingStatus:        FilingStatus;
  pretaxContributions: number;       // $ 401k / HSA / traditional IRA
}

export interface TaxBracketResult {
  taxableIncome:     number;
  federalTax:        number;
  effectiveRate:     number;  // % of gross income
  marginalRate:      number;  // % top bracket reached
  afterTaxIncome:    number;  // gross − federal tax
  standardDeduction: number;
  /** Effective rate measured against taxable income, for context */
  effectiveOnTaxable: number;
  [key: string]: number;
}

interface Bracket {
  upTo: number;   // upper threshold of this bracket (Infinity for top)
  rate: number;   // decimal
}

// 2025 tax year — taxable-income thresholds (post-deduction).
const BRACKETS_2025: Record<FilingStatus, Bracket[]> = {
  single: [
    { upTo: 11_925,  rate: 0.10 },
    { upTo: 48_475,  rate: 0.12 },
    { upTo: 103_350, rate: 0.22 },
    { upTo: 197_300, rate: 0.24 },
    { upTo: 250_525, rate: 0.32 },
    { upTo: 626_350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  married: [
    { upTo: 23_850,  rate: 0.10 },
    { upTo: 96_950,  rate: 0.12 },
    { upTo: 206_700, rate: 0.22 },
    { upTo: 394_600, rate: 0.24 },
    { upTo: 501_050, rate: 0.32 },
    { upTo: 751_600, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
  hoh: [
    { upTo: 17_000,  rate: 0.10 },
    { upTo: 64_850,  rate: 0.12 },
    { upTo: 103_350, rate: 0.22 },
    { upTo: 197_300, rate: 0.24 },
    { upTo: 250_500, rate: 0.32 },
    { upTo: 626_350, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single:  15_000,
  married: 30_000,
  hoh:     22_500,
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateTaxBracket(inputs: TaxBracketInputs): TaxBracketResult {
  const grossIncome  = Math.max(0, Number(inputs.grossIncome) || 0);
  const pretax       = Math.max(0, Number(inputs.pretaxContributions) || 0);
  const status: FilingStatus =
    inputs.filingStatus === "married" || inputs.filingStatus === "hoh"
      ? inputs.filingStatus
      : "single";

  const standardDeduction = STANDARD_DEDUCTION_2025[status];
  const taxableIncome = Math.max(0, grossIncome - pretax - standardDeduction);

  const brackets = BRACKETS_2025[status];
  let federalTax = 0;
  let lower = 0;
  let marginalRate = brackets[0].rate;

  for (const b of brackets) {
    if (taxableIncome > lower) {
      const sliceTop = Math.min(taxableIncome, b.upTo);
      federalTax += (sliceTop - lower) * b.rate;
      marginalRate = b.rate;
      lower = b.upTo;
    } else {
      break;
    }
  }

  // If income falls below the first threshold, marginal is the first rate
  // (or 0 if there is literally no taxable income).
  if (taxableIncome <= 0) marginalRate = 0;

  return {
    taxableIncome:      round2(taxableIncome),
    federalTax:         round2(federalTax),
    effectiveRate:      grossIncome > 0 ? round2((federalTax / grossIncome) * 100) : 0,
    marginalRate:       round2(marginalRate * 100),
    afterTaxIncome:     round2(grossIncome - federalTax),
    standardDeduction,
    effectiveOnTaxable: taxableIncome > 0 ? round2((federalTax / taxableIncome) * 100) : 0,
  };
}
