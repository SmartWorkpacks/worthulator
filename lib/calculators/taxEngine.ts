import { getUSTaxData, getUKTaxData, type SupportedYear, type USTaxBracket } from "@/data/tax";

export type TaxCountry = "US" | "UK";
export type TaxFilingStatus = "single" | "married";

export interface TaxInputs {
  country: TaxCountry;
  annualIncome: number; // gross income before tax
  filingStatus: TaxFilingStatus; // US only — selects brackets + standard deduction
  stateRatePct: number; // US only — top marginal state income tax rate (0 = no state tax)
  year?: SupportedYear; // tax year (defaults to 2026)
}

export interface TaxResult {
  country: TaxCountry;
  currency: "USD" | "GBP";
  taxYear: string;
  grossIncome: number;
  allowance: number; // US standard deduction / UK personal allowance (after taper)
  taxableIncome: number;
  incomeTax: number; // US federal income tax / UK income tax
  socialSecurity: number; // US FICA Social Security (UK: 0)
  medicare: number; // US Medicare incl. additional 0.9% (UK: 0)
  nationalInsurance: number; // UK NI (US: 0)
  stateTax: number; // US state income tax (UK: 0)
  totalTax: number;
  afterTaxIncome: number;
  effectiveTaxRate: number; // totalTax / gross (0–1)
  incomeTaxEffectiveRate: number; // incomeTax / gross (0–1)
  marginalRate: number; // marginal income-tax band rate (0–1)
  takeHomePct: number; // after-tax as % of gross
  breakdown: { label: string; amount: number; colorClass: string }[];
  incomeImpact: { income: number; totalTax: number; effectiveRate: number }[];
}

// US federal standard deductions — IRS (lib/dataStore.ts TAX_DEFAULTS, 2026).
const STANDARD_DEDUCTION: Record<TaxFilingStatus, number> = {
  single: 14_600,
  married: 29_200,
};

// Additional Medicare tax (ACA): 0.9% on wages above threshold — IRS.
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD: Record<TaxFilingStatus, number> = {
  single: 200_000,
  married: 250_000,
};

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Progressive marginal tax over IRS-style brackets ({ up, rate }). */
function progressiveTax(taxable: number, brackets: USTaxBracket[]): { tax: number; marginal: number } {
  let tax = 0;
  let lower = 0;
  let marginal = brackets.length > 0 ? brackets[0].rate : 0;
  for (const b of brackets) {
    if (taxable <= lower) break;
    const slice = Math.min(taxable, b.up) - lower;
    tax += slice * b.rate;
    marginal = b.rate;
    lower = b.up;
  }
  return { tax: Math.max(0, tax), marginal };
}

interface CoreTax {
  allowance: number;
  taxableIncome: number;
  incomeTax: number;
  socialSecurity: number;
  medicare: number;
  nationalInsurance: number;
  stateTax: number;
  totalTax: number;
  marginalRate: number;
}

function computeUS(gross: number, input: TaxInputs, year: SupportedYear): CoreTax {
  const data = getUSTaxData(year);
  const allowance = STANDARD_DEDUCTION[input.filingStatus];
  const taxableIncome = Math.max(0, gross - allowance);
  const brackets = input.filingStatus === "married" ? data.bracketsMarried : data.bracketsSingle;
  const { tax: incomeTax, marginal: marginalRate } = progressiveTax(taxableIncome, brackets);

  const socialSecurity = Math.min(gross, data.ssWageBase) * data.ssRate;
  const addlThreshold = ADDITIONAL_MEDICARE_THRESHOLD[input.filingStatus];
  const medicare = gross * data.medicareRate + Math.max(0, gross - addlThreshold) * ADDITIONAL_MEDICARE_RATE;

  const stateRate = clamp(safeNum(input.stateRatePct), 0, 20) / 100;
  const stateTax = gross * stateRate;

  const totalTax = incomeTax + socialSecurity + medicare + stateTax;
  return {
    allowance,
    taxableIncome,
    incomeTax,
    socialSecurity,
    medicare,
    nationalInsurance: 0,
    stateTax,
    totalTax,
    marginalRate,
  };
}

function computeUK(gross: number, year: SupportedYear): CoreTax {
  const data = getUKTaxData(year);
  let personalAllowance = data.personalAllowance;
  if (gross > data.paTaperStart) {
    personalAllowance = Math.max(0, personalAllowance - (gross - data.paTaperStart) / 2);
  }
  const taxableIncome = Math.max(0, gross - personalAllowance);

  let incomeTax = 0;
  let marginalRate = 0;
  for (const band of data.taxBands) {
    if (taxableIncome <= band.from) continue;
    const slice = Math.min(taxableIncome, band.to) - band.from;
    incomeTax += slice * band.rate;
    marginalRate = band.rate;
  }

  let nationalInsurance = 0;
  if (gross > data.niPrimary) {
    nationalInsurance += (Math.min(gross, data.niUpper) - data.niPrimary) * data.niMainRate;
  }
  if (gross > data.niUpper) {
    nationalInsurance += (gross - data.niUpper) * data.niUpperRate;
  }

  const totalTax = incomeTax + nationalInsurance;
  return {
    allowance: personalAllowance,
    taxableIncome,
    incomeTax,
    socialSecurity: 0,
    medicare: 0,
    nationalInsurance,
    stateTax: 0,
    totalTax,
    marginalRate,
  };
}

function totalTaxFor(gross: number, input: TaxInputs, year: SupportedYear): number {
  const core = input.country === "UK" ? computeUK(gross, year) : computeUS(gross, input, year);
  return core.totalTax;
}

export function calculateTax(input: TaxInputs): TaxResult {
  const resolvedYear: SupportedYear = input.year ?? (2026 as SupportedYear);
  const gross = clamp(safeNum(input.annualIncome), 0, 100_000_000);
  const isUK = input.country === "UK";
  const currency: "USD" | "GBP" = isUK ? "GBP" : "USD";
  const taxYear = (isUK ? getUKTaxData(resolvedYear) : getUSTaxData(resolvedYear)).taxYear;

  const core = isUK ? computeUK(gross, resolvedYear) : computeUS(gross, input, resolvedYear);

  const afterTaxIncome = Math.max(0, gross - core.totalTax);
  const effectiveTaxRate = gross > 0 ? core.totalTax / gross : 0;
  const incomeTaxEffectiveRate = gross > 0 ? core.incomeTax / gross : 0;
  const takeHomePct = gross > 0 ? (afterTaxIncome / gross) * 100 : 0;

  const payroll = core.socialSecurity + core.medicare + core.nationalInsurance;
  const breakdown = isUK
    ? [
        { label: "Income tax", amount: round2(core.incomeTax), colorClass: "bg-blue-400" },
        { label: "National Insurance", amount: round2(core.nationalInsurance), colorClass: "bg-amber-400" },
      ]
    : [
        { label: "Federal income tax", amount: round2(core.incomeTax), colorClass: "bg-blue-400" },
        { label: "FICA (SS + Medicare)", amount: round2(payroll), colorClass: "bg-amber-400" },
        { label: "State income tax", amount: round2(core.stateTax), colorClass: "bg-rose-400" },
      ];

  // Progressivity curve: total tax across a band of incomes centered on the user's.
  const base = gross > 0 ? gross : 75_000;
  const multipliers = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const incomeImpact = Array.from(new Set(multipliers.map((m) => Math.round((base * m) / 1000) * 1000))).map(
    (income) => {
      const tt = totalTaxFor(income, input, resolvedYear);
      return {
        income,
        totalTax: round2(tt),
        effectiveRate: income > 0 ? round2((tt / income) * 100) : 0,
      };
    },
  );

  return {
    country: input.country,
    currency,
    taxYear,
    grossIncome: round2(gross),
    allowance: round2(core.allowance),
    taxableIncome: round2(core.taxableIncome),
    incomeTax: round2(core.incomeTax),
    socialSecurity: round2(core.socialSecurity),
    medicare: round2(core.medicare),
    nationalInsurance: round2(core.nationalInsurance),
    stateTax: round2(core.stateTax),
    totalTax: round2(core.totalTax),
    afterTaxIncome: round2(afterTaxIncome),
    effectiveTaxRate: round2(effectiveTaxRate * 1000) / 1000,
    incomeTaxEffectiveRate: round2(incomeTaxEffectiveRate * 1000) / 1000,
    marginalRate: core.marginalRate,
    takeHomePct: round2(takeHomePct),
    breakdown,
    incomeImpact,
  };
}
