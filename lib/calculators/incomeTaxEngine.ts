import { getUSTaxData, getUKTaxData, type SupportedYear, type USTaxBracket } from "@/data/tax";

export type IncomeTaxCountry = "US" | "UK";
export type IncomeTaxFilingStatus = "single" | "married";

export interface IncomeTaxInputs {
  country: IncomeTaxCountry;
  annualIncome: number; // gross income before tax
  filingStatus: IncomeTaxFilingStatus; // US only — selects brackets + standard deduction
  stateRatePct: number; // US only — top marginal state income tax rate (0 = no state tax)
  year?: SupportedYear; // tax year (defaults to 2026)
}

export interface IncomeTaxBracketRow {
  ratePct: number; // bracket rate as a percentage
  lower: number; // bracket lower bound (taxable income)
  upper: number; // bracket upper bound (Infinity for the top band)
  taxedAmount: number; // taxable income falling in this band
  tax: number; // tax contributed by this band
}

export interface IncomeTaxResult {
  country: IncomeTaxCountry;
  currency: "USD" | "GBP";
  taxYear: string;
  grossIncome: number;
  allowance: number; // US standard deduction / UK personal allowance (after taper)
  taxableIncome: number;
  federalTax: number; // US federal income tax / UK income tax
  stateTax: number; // US state income tax (UK: 0)
  totalIncomeTax: number;
  afterTaxIncome: number; // gross − income tax (excludes payroll tax)
  effectiveTaxRate: number; // totalIncomeTax / gross (0–1)
  marginalRate: number; // marginal band rate (0–1)
  afterTaxPct: number; // after-income-tax as % of gross
  brackets: IncomeTaxBracketRow[]; // per-band detail (only bands with income)
  breakdown: { label: string; amount: number; colorClass: string }[];
  incomeImpact: { income: number; incomeTax: number; effectiveRate: number }[];
}

// US federal standard deductions — IRS (lib/dataStore.ts TAX_DEFAULTS, 2026).
const STANDARD_DEDUCTION: Record<IncomeTaxFilingStatus, number> = {
  single: 14_600,
  married: 29_200,
};

// Graduated fills for the per-bracket bars (low → high rate).
const BRACKET_FILLS = ["bg-sky-300", "bg-sky-400", "bg-blue-400", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-600"];

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

interface BandRow {
  ratePct: number;
  lower: number;
  upper: number;
  taxedAmount: number;
  tax: number;
}

/** Walk IRS-style brackets ({ up, rate }) and return per-band detail + the total. */
function bracketRows(taxable: number, brackets: USTaxBracket[]): { rows: BandRow[]; total: number; marginal: number } {
  const rows: BandRow[] = [];
  let lower = 0;
  let total = 0;
  let marginal = brackets.length > 0 ? brackets[0].rate : 0;
  for (const b of brackets) {
    const upper = b.up;
    const taxedAmount = Math.max(0, Math.min(taxable, upper) - lower);
    if (taxedAmount > 0) {
      const tax = taxedAmount * b.rate;
      rows.push({ ratePct: round2(b.rate * 100), lower, upper, taxedAmount: round2(taxedAmount), tax: round2(tax) });
      total += tax;
      marginal = b.rate;
    }
    lower = upper;
    if (taxable <= lower) break;
  }
  return { rows, total: Math.max(0, total), marginal };
}

/** UK income tax bands use {from, to, rate}. */
function ukBracketRows(
  taxable: number,
  bands: { from: number; to: number; rate: number }[],
): { rows: BandRow[]; total: number; marginal: number } {
  const rows: BandRow[] = [];
  let total = 0;
  let marginal = 0;
  for (const band of bands) {
    if (taxable <= band.from) continue;
    const taxedAmount = Math.min(taxable, band.to) - band.from;
    if (taxedAmount > 0) {
      const tax = taxedAmount * band.rate;
      rows.push({
        ratePct: round2(band.rate * 100),
        lower: band.from,
        upper: band.to,
        taxedAmount: round2(taxedAmount),
        tax: round2(tax),
      });
      total += tax;
      marginal = band.rate;
    }
  }
  return { rows, total: Math.max(0, total), marginal };
}

function federalTaxFor(gross: number, input: IncomeTaxInputs, year: SupportedYear): number {
  if (input.country === "UK") {
    const data = getUKTaxData(year);
    let pa = data.personalAllowance;
    if (gross > data.paTaperStart) pa = Math.max(0, pa - (gross - data.paTaperStart) / 2);
    const taxable = Math.max(0, gross - pa);
    return ukBracketRows(taxable, data.taxBands).total;
  }
  const data = getUSTaxData(year);
  const taxable = Math.max(0, gross - STANDARD_DEDUCTION[input.filingStatus]);
  const brackets = input.filingStatus === "married" ? data.bracketsMarried : data.bracketsSingle;
  return bracketRows(taxable, brackets).total;
}

export function calculateIncomeTax(input: IncomeTaxInputs): IncomeTaxResult {
  const resolvedYear: SupportedYear = input.year ?? (2026 as SupportedYear);
  const gross = clamp(safeNum(input.annualIncome), 0, 100_000_000);
  const isUK = input.country === "UK";
  const currency: "USD" | "GBP" = isUK ? "GBP" : "USD";

  let allowance: number;
  let taxableIncome: number;
  let rows: BandRow[];
  let federalTax: number;
  let marginal: number;
  let taxYear: string;

  if (isUK) {
    const data = getUKTaxData(resolvedYear);
    taxYear = data.taxYear;
    allowance = data.personalAllowance;
    if (gross > data.paTaperStart) allowance = Math.max(0, allowance - (gross - data.paTaperStart) / 2);
    taxableIncome = Math.max(0, gross - allowance);
    const res = ukBracketRows(taxableIncome, data.taxBands);
    rows = res.rows;
    federalTax = res.total;
    marginal = res.marginal;
  } else {
    const data = getUSTaxData(resolvedYear);
    taxYear = data.taxYear;
    allowance = STANDARD_DEDUCTION[input.filingStatus];
    taxableIncome = Math.max(0, gross - allowance);
    const brackets = input.filingStatus === "married" ? data.bracketsMarried : data.bracketsSingle;
    const res = bracketRows(taxableIncome, brackets);
    rows = res.rows;
    federalTax = res.total;
    marginal = res.marginal;
  }

  const stateRate = isUK ? 0 : clamp(safeNum(input.stateRatePct), 0, 20) / 100;
  const stateTax = gross * stateRate;
  const totalIncomeTax = federalTax + stateTax;
  const afterTaxIncome = Math.max(0, gross - totalIncomeTax);
  const effectiveTaxRate = gross > 0 ? totalIncomeTax / gross : 0;
  const afterTaxPct = gross > 0 ? (afterTaxIncome / gross) * 100 : 0;

  const brackets: IncomeTaxBracketRow[] = rows.map((r) => ({
    ratePct: r.ratePct,
    lower: r.lower,
    upper: r.upper,
    taxedAmount: r.taxedAmount,
    tax: r.tax,
  }));

  const breakdown = rows.map((r, i) => ({
    label: `${r.ratePct}% band`,
    amount: r.tax,
    colorClass: BRACKET_FILLS[Math.min(i, BRACKET_FILLS.length - 1)],
  }));
  if (!isUK && stateTax > 0) {
    breakdown.push({ label: "State income tax", amount: round2(stateTax), colorClass: "bg-rose-400" });
  }

  // Income tax across a band of incomes centered on the user's.
  const base = gross > 0 ? gross : 80_000;
  const multipliers = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const incomeImpact = Array.from(new Set(multipliers.map((m) => Math.round((base * m) / 1000) * 1000))).map(
    (income) => {
      const fed = federalTaxFor(income, input, resolvedYear);
      const tt = fed + income * stateRate;
      return { income, incomeTax: round2(tt), effectiveRate: income > 0 ? round2((tt / income) * 100) : 0 };
    },
  );

  return {
    country: input.country,
    currency,
    taxYear,
    grossIncome: round2(gross),
    allowance: round2(allowance),
    taxableIncome: round2(taxableIncome),
    federalTax: round2(federalTax),
    stateTax: round2(stateTax),
    totalIncomeTax: round2(totalIncomeTax),
    afterTaxIncome: round2(afterTaxIncome),
    effectiveTaxRate: round2(effectiveTaxRate * 1000) / 1000,
    marginalRate: marginal,
    afterTaxPct: round2(afterTaxPct),
    brackets,
    breakdown,
    incomeImpact,
  };
}
