import { getUSTaxData, getUKTaxData, type SupportedYear, type USTaxBracket } from "@/data/tax";
import { stateTaxRates, type StateCode } from "@/src/lib/stateTax";

export type PaycheckCountry = "US" | "UK";
export type FilingStatus = "single" | "married";
export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly" | "annual";

export interface PaycheckInputs {
  country: PaycheckCountry;
  grossAnnual: number; // salary before any deductions
  payFrequency: PayFrequency;
  filingStatus: FilingStatus; // US only — selects federal brackets + standard deduction
  stateCode: StateCode; // US only — applies top marginal state income tax rate
  retirementPct: number; // % of gross to pre-tax retirement (401k/pension)
  year?: SupportedYear; // tax year (defaults to CURRENT_YEAR)
}

export interface PaycheckDeduction {
  label: string;
  annual: number;
  perPaycheck: number;
  pct: number; // share of gross (0–100)
  colorClass: string;
}

export interface PaycheckResult {
  country: PaycheckCountry;
  currency: "USD" | "GBP";
  taxYear: string;
  payPeriods: number;
  grossAnnual: number;
  grossPerPaycheck: number;
  retirementContribution: number; // annual
  taxableIncome: number; // income subject to income tax
  federalIncomeTax: number; // annual (UK: income tax)
  socialSecurity: number; // US FICA Social Security (UK: 0)
  medicare: number; // US Medicare incl. additional 0.9% (UK: 0)
  nationalInsurance: number; // UK NI (US: 0)
  stateTax: number; // US state income tax (UK: 0)
  totalTax: number; // all taxes, excludes retirement
  totalDeductions: number; // taxes + retirement
  netAnnual: number;
  netPerPaycheck: number;
  takeHomePct: number; // net as % of gross
  effectiveTaxRate: number; // totalTax / gross (0–1)
  marginalRate: number; // marginal income-tax band rate (0–1)
  deductions: PaycheckDeduction[]; // chart-ready: take-home + each tax + retirement
  incomeImpact: { grossAnnual: number; netPerPaycheck: number; takeHomePct: number }[];
}

// ── Static reference constants ────────────────────────────────────────────────
// Pay periods per year by frequency.
const PAY_PERIODS: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  annual: 1,
};

// US federal standard deductions — IRS (lib/dataStore.ts TAX_DEFAULTS, 2026).
const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 14_600,
  married: 29_200,
};

// 401(k) employee elective deferral limit — IRS (lib/dataStore.ts TAX_DEFAULTS).
const K401_LIMIT = 23_500;

// Additional Medicare tax (ACA): 0.9% on wages above threshold — IRS.
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200_000,
  married: 250_000,
};

// UK pension annual allowance — HMRC.
const UK_PENSION_ANNUAL_ALLOWANCE = 60_000;

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
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

interface CoreOutput {
  retirementContribution: number;
  taxableIncome: number;
  federalIncomeTax: number;
  socialSecurity: number;
  medicare: number;
  nationalInsurance: number;
  stateTax: number;
  totalTax: number;
  netAnnual: number;
  marginalRate: number;
}

function computeUS(gross: number, input: PaycheckInputs, year: SupportedYear): CoreOutput {
  const data = getUSTaxData(year);
  const retirementPct = clamp(safeNum(input.retirementPct), 0, 100);
  const retirementContribution = clamp(gross * (retirementPct / 100), 0, K401_LIMIT);
  const standardDeduction = STANDARD_DEDUCTION[input.filingStatus];

  const taxableIncome = Math.max(0, gross - retirementContribution - standardDeduction);
  const brackets = input.filingStatus === "married" ? data.bracketsMarried : data.bracketsSingle;
  const { tax: federalIncomeTax, marginal: marginalRate } = progressiveTax(taxableIncome, brackets);

  // FICA is assessed on gross — pre-tax 401(k) dollars are NOT exempt.
  const socialSecurity = Math.min(gross, data.ssWageBase) * data.ssRate;
  const addlThreshold = ADDITIONAL_MEDICARE_THRESHOLD[input.filingStatus];
  const medicare = gross * data.medicareRate + Math.max(0, gross - addlThreshold) * ADDITIONAL_MEDICARE_RATE;

  // State tax: top marginal rate applied flat to income after pre-tax retirement (estimate).
  const stateRate = (stateTaxRates[input.stateCode] ?? 0) / 100;
  const stateTax = Math.max(0, gross - retirementContribution) * stateRate;

  const totalTax = federalIncomeTax + socialSecurity + medicare + stateTax;
  const netAnnual = Math.max(0, gross - retirementContribution - totalTax);

  return {
    retirementContribution,
    taxableIncome,
    federalIncomeTax,
    socialSecurity,
    medicare,
    nationalInsurance: 0,
    stateTax,
    totalTax,
    netAnnual,
    marginalRate,
  };
}

function computeUK(gross: number, input: PaycheckInputs, year: SupportedYear): CoreOutput {
  const data = getUKTaxData(year);
  const retirementPct = clamp(safeNum(input.retirementPct), 0, 100);
  const pension = clamp(gross * (retirementPct / 100), 0, UK_PENSION_ANNUAL_ALLOWANCE);
  const incomeForTax = Math.max(0, gross - pension);

  // Personal allowance taper: £1 lost per £2 of income over the taper start.
  let personalAllowance = data.personalAllowance;
  if (incomeForTax > data.paTaperStart) {
    personalAllowance = Math.max(0, personalAllowance - (incomeForTax - data.paTaperStart) / 2);
  }
  const taxableIncome = Math.max(0, incomeForTax - personalAllowance);

  let incomeTax = 0;
  let marginalRate = 0;
  for (const band of data.taxBands) {
    if (taxableIncome <= band.from) continue;
    const slice = Math.min(taxableIncome, band.to) - band.from;
    incomeTax += slice * band.rate;
    marginalRate = band.rate;
  }

  // Employee National Insurance on gross earnings.
  let nationalInsurance = 0;
  if (gross > data.niPrimary) {
    nationalInsurance += (Math.min(gross, data.niUpper) - data.niPrimary) * data.niMainRate;
  }
  if (gross > data.niUpper) {
    nationalInsurance += (gross - data.niUpper) * data.niUpperRate;
  }

  const totalTax = incomeTax + nationalInsurance;
  const netAnnual = Math.max(0, gross - pension - totalTax);

  return {
    retirementContribution: pension,
    taxableIncome,
    federalIncomeTax: incomeTax,
    socialSecurity: 0,
    medicare: 0,
    nationalInsurance,
    stateTax: 0,
    totalTax,
    netAnnual,
    marginalRate,
  };
}

export function calculatePaycheck(input: PaycheckInputs): PaycheckResult {
  const year = input.year ?? undefined;
  const resolvedYear: SupportedYear = year ?? (2026 as SupportedYear);
  const gross = clamp(safeNum(input.grossAnnual), 0, 100_000_000);
  const payPeriods = PAY_PERIODS[input.payFrequency] ?? 26;
  const isUK = input.country === "UK";
  const currency: "USD" | "GBP" = isUK ? "GBP" : "USD";
  const taxYear = (isUK ? getUKTaxData(resolvedYear) : getUSTaxData(resolvedYear)).taxYear;

  const core = isUK ? computeUK(gross, input, resolvedYear) : computeUS(gross, input, resolvedYear);

  const netPerPaycheck = core.netAnnual / payPeriods;
  const grossPerPaycheck = gross / payPeriods;
  const takeHomePct = gross > 0 ? (core.netAnnual / gross) * 100 : 0;
  const effectiveTaxRate = gross > 0 ? core.totalTax / gross : 0;

  const toPct = (annual: number) => (gross > 0 ? (annual / gross) * 100 : 0);
  const toPer = (annual: number) => annual / payPeriods;

  const rawDeductions: PaycheckDeduction[] = isUK
    ? [
        { label: "Take-home", annual: core.netAnnual, colorClass: "bg-emerald-400" },
        { label: "Income tax", annual: core.federalIncomeTax, colorClass: "bg-red-400" },
        { label: "National Insurance", annual: core.nationalInsurance, colorClass: "bg-blue-400" },
        { label: "Pension", annual: core.retirementContribution, colorClass: "bg-violet-400" },
      ].map((d) => ({ ...d, perPaycheck: toPer(d.annual), pct: toPct(d.annual) }))
    : [
        { label: "Take-home", annual: core.netAnnual, colorClass: "bg-emerald-400" },
        { label: "Federal tax", annual: core.federalIncomeTax, colorClass: "bg-red-400" },
        { label: "Social Security", annual: core.socialSecurity, colorClass: "bg-blue-400" },
        { label: "Medicare", annual: core.medicare, colorClass: "bg-amber-400" },
        { label: "State tax", annual: core.stateTax, colorClass: "bg-orange-400" },
        { label: "401(k)", annual: core.retirementContribution, colorClass: "bg-violet-400" },
      ].map((d) => ({ ...d, perPaycheck: toPer(d.annual), pct: toPct(d.annual) }));

  const deductions = rawDeductions.filter((d) => d.annual > 0);

  // Net-pay-vs-salary curve: 0.5x to 1.5x of current gross, recomputed each point.
  const impactBase = gross > 0 ? gross : 60_000;
  const incomeImpact = [0.5, 0.7, 0.85, 1, 1.15, 1.3, 1.5].map((mult) => {
    const g = Math.round((impactBase * mult) / 1000) * 1000;
    const c = isUK ? computeUK(g, input, resolvedYear) : computeUS(g, input, resolvedYear);
    return {
      grossAnnual: g,
      netPerPaycheck: Math.round(c.netAnnual / payPeriods),
      takeHomePct: g > 0 ? Math.round((c.netAnnual / g) * 1000) / 10 : 0,
    };
  });

  return {
    country: input.country,
    currency,
    taxYear,
    payPeriods,
    grossAnnual: Math.round(gross),
    grossPerPaycheck: Math.round(grossPerPaycheck),
    retirementContribution: Math.round(core.retirementContribution),
    taxableIncome: Math.round(core.taxableIncome),
    federalIncomeTax: Math.round(core.federalIncomeTax),
    socialSecurity: Math.round(core.socialSecurity),
    medicare: Math.round(core.medicare),
    nationalInsurance: Math.round(core.nationalInsurance),
    stateTax: Math.round(core.stateTax),
    totalTax: Math.round(core.totalTax),
    totalDeductions: Math.round(core.totalTax + core.retirementContribution),
    netAnnual: Math.round(core.netAnnual),
    netPerPaycheck: Math.round(netPerPaycheck),
    takeHomePct: Math.round(takeHomePct * 10) / 10,
    effectiveTaxRate: Math.round(effectiveTaxRate * 1000) / 1000,
    marginalRate: core.marginalRate,
    deductions,
    incomeImpact,
  };
}
