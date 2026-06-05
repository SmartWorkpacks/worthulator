// ─── Budget — Pure Calculation Module ────────────────────────────────────────
//
// Take-home budget broken down against the 50/30/20 rule (needs/wants/savings),
// with a live sales-tax layer: estimates the sales tax embedded in the user's
// taxable spending using their state's combined rate and grocery-exemption rule.
//
// Live data injected via `data` (never read datasets inside the module):
//   - salesTaxRate   : state combined rate (%)
//   - groceryExempt  : whether the state exempts groceries (food then untaxed)
//
// Result assignable to CalculatorOutputs (index signature present).
//
// ─────────────────────────────────────────────────────────────────────────────

export interface BudgetInputs {
  income: number;
  housing: number;
  food: number;
  transport: number;
  debt: number;
  other: number;
}

export interface BudgetData {
  salesTaxRate: number;
  groceryExempt: boolean;
}

export interface BudgetResult {
  totalExpenses: number;
  leftover: number;
  savingsRate: number;
  expenseRatio: number;
  annualLeftover: number;
  housingRatio: number;
  debtRatio: number;
  needs: number;
  wants: number;
  needsRatio: number;
  wantsRatio: number;
  needsTarget: number;
  wantsTarget: number;
  savingsTarget: number;
  gapTo20: number;
  taxableMonthly: number;
  salesTaxMonthly: number;
  salesTaxAnnual: number;
  tenYearIfInvested: number;
  [key: string]: number;
}

const MARKET_RETURN = 0.07;

/** Ordinary annuity future value (annual contributions, annual compounding). */
function fvAnnuity(annual: number, years: number, rate = MARKET_RETURN): number {
  if (annual <= 0 || years <= 0) return 0;
  return annual * ((Math.pow(1 + rate, years) - 1) / rate);
}

const pct = (part: number, whole: number) =>
  whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0;

export function calculateBudget(inputs: BudgetInputs, data: BudgetData): BudgetResult {
  const income = Math.max(0, inputs.income);
  const housing = Math.max(0, inputs.housing);
  const food = Math.max(0, inputs.food);
  const transport = Math.max(0, inputs.transport);
  const debt = Math.max(0, inputs.debt);
  const other = Math.max(0, inputs.other);

  const totalExpenses = housing + food + transport + debt + other;
  const leftover = Math.round(income - totalExpenses);
  const annualLeftover = leftover * 12;

  // 50/30/20: needs = essentials (housing/food/transport/debt), wants = other,
  // savings = whatever is left over.
  const needs = housing + food + transport + debt;
  const wants = other;

  const taxableMonthly = (data.groceryExempt ? 0 : food) + other;
  const salesTaxMonthly = Math.round(taxableMonthly * (data.salesTaxRate / 100) * 100) / 100;
  const salesTaxAnnual = Math.round(salesTaxMonthly * 12);

  const savingsTarget = Math.round(income * 0.2);
  const gapTo20 = Math.max(0, savingsTarget - Math.max(0, leftover));

  return {
    totalExpenses: Math.round(totalExpenses),
    leftover,
    savingsRate: pct(leftover, income),
    expenseRatio: pct(totalExpenses, income),
    annualLeftover,
    housingRatio: pct(housing, income),
    debtRatio: pct(debt, income),
    needs: Math.round(needs),
    wants: Math.round(wants),
    needsRatio: pct(needs, income),
    wantsRatio: pct(wants, income),
    needsTarget: Math.round(income * 0.5),
    wantsTarget: Math.round(income * 0.3),
    savingsTarget,
    gapTo20,
    taxableMonthly: Math.round(taxableMonthly),
    salesTaxMonthly,
    salesTaxAnnual,
    tenYearIfInvested: Math.round(fvAnnuity(Math.max(0, annualLeftover), 10)),
  };
}
