export interface RmdInputs {
  accountBalance: number; // prior year-end (Dec 31) balance
  age: number; // age the account holder reaches this year
  expectedReturnPct: number; // assumed annual growth for the projection
}

export interface RmdProjectionPoint {
  age: number;
  factor: number;
  rmd: number;
  startBalance: number;
}

export interface RmdResult {
  age: number;
  distributionPeriod: number; // IRS Uniform Lifetime factor
  rmdAmount: number; // balance ÷ factor
  rmdPct: number; // 1 ÷ factor, as a percentage
  monthlyEquivalent: number;
  remainingBalance: number; // balance − rmd
  isRequiredAge: boolean; // RMDs begin at age 73 under current law
  breakdown: { label: string; amount: number; colorClass: string }[];
  projection: RmdProjectionPoint[];
}

// IRS Uniform Lifetime Table, effective 2022 (used for the year you turn 72+).
// Source: IRS Pub. 590-B, Appendix B, Table III (Uniform Lifetime).
const UNIFORM_LIFETIME_TABLE: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1,
  80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4,
  88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9,
  96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2,
  104: 4.9, 105: 4.6, 106: 4.3, 107: 4.1, 108: 3.9, 109: 3.7, 110: 3.5, 111: 3.4,
  112: 3.3, 113: 3.1, 114: 3.0, 115: 2.9, 116: 2.8, 117: 2.7, 118: 2.5, 119: 2.3,
  120: 2.0,
};

const MIN_TABLE_AGE = 72;
const MAX_TABLE_AGE = 120;
const RMD_BEGIN_AGE = 73; // SECURE 2.0: required beginning age is 73 (2023–2032).
const PROJECTION_YEARS = 10;

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function distributionPeriodForAge(age: number): number {
  const a = clamp(Math.floor(age), MIN_TABLE_AGE, MAX_TABLE_AGE);
  return UNIFORM_LIFETIME_TABLE[a];
}

export function calculateRmd(input: RmdInputs): RmdResult {
  const accountBalance = Math.max(0, safeNum(input.accountBalance));
  const age = clamp(Math.floor(safeNum(input.age, MIN_TABLE_AGE)), MIN_TABLE_AGE, MAX_TABLE_AGE);
  const growth = clamp(safeNum(input.expectedReturnPct), -50, 50) / 100;

  const distributionPeriod = distributionPeriodForAge(age);
  const rmdAmount = distributionPeriod > 0 ? accountBalance / distributionPeriod : 0;
  const rmdPct = distributionPeriod > 0 ? (1 / distributionPeriod) * 100 : 0;
  const monthlyEquivalent = rmdAmount / 12;
  const remainingBalance = Math.max(0, accountBalance - rmdAmount);

  // Project RMDs forward: withdraw, then grow the remainder.
  const projection: RmdProjectionPoint[] = [];
  let balance = accountBalance;
  for (let i = 0; i < PROJECTION_YEARS; i++) {
    const projAge = Math.min(MAX_TABLE_AGE, age + i);
    const factor = distributionPeriodForAge(projAge);
    const rmd = factor > 0 ? balance / factor : 0;
    projection.push({
      age: projAge,
      factor,
      rmd: round2(rmd),
      startBalance: round2(balance),
    });
    balance = Math.max(0, balance - rmd) * (1 + growth);
  }

  return {
    age,
    distributionPeriod,
    rmdAmount: round2(rmdAmount),
    rmdPct: round2(rmdPct),
    monthlyEquivalent: round2(monthlyEquivalent),
    remainingBalance: round2(remainingBalance),
    isRequiredAge: age >= RMD_BEGIN_AGE,
    breakdown: [
      { label: "RMD this year", amount: round2(rmdAmount), colorClass: "bg-rose-400" },
      { label: "Stays invested", amount: round2(remainingBalance), colorClass: "bg-emerald-400" },
    ],
    projection,
  };
}
