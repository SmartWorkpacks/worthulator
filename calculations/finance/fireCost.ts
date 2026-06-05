/**
 * FIRE Calculator — pure logic module
 *
 * Formula:
 *   FIRE Number   = Monthly Expenses × 12 × 25   (4% safe-withdrawal rule — Trinity Study)
 *   Years to FIRE = monthly simulation: balance = balance × (1 + r/12) + contribution
 *                   until balance ≥ FIRE Number (capped at 100 years)
 *
 * Sources:
 *   - 4% rule: Bengen (1994), Trinity Study (1998)
 *   - S&P 500 inflation-adjusted avg: ~7% (Vanguard / Morningstar long-run estimates)
 */

export interface FireInputs {
  monthlyExpenses: number; // $ / month
  currentSavings:  number; // $ already invested
  monthlySavings:  number; // $ contributed each month
  annualReturn:    number; // % e.g. 7
}

export interface FireResult {
  fireNumber:         number; // 25 × annual expenses (4% rule)
  yearsToFire:        number; // 0.1-year precision; 100 = effectively never
  savingsRate:        number; // monthlySavings / (monthlySavings + monthlyExpenses) × 100
  percentFunded:      number; // currentSavings / fireNumber × 100 (capped at 100)
  yearsFasterWith500: number; // how many years saved by adding $500/mo more
  passiveIncomeNow:   number; // currentSavings × 0.04 / 12 — monthly at the 4% rule
  [key: string]: number;
}

function simulate(startBalance: number, monthly: number, rate: number, target: number): number {
  let balance = startBalance;
  let months  = 0;
  while (balance < target && months < 1200) {
    balance = balance * (1 + rate) + monthly;
    months++;
  }
  return months;
}

/** Simulate month-by-month until balance reaches target, capped at 1200 months (100 yr). */
export function calculateFire(inputs: FireInputs): FireResult {
  const { monthlyExpenses, currentSavings, monthlySavings, annualReturn } = inputs;

  const monthlyRate   = Math.max(0, annualReturn) / 100 / 12;
  const fireNumber    = Math.max(0, monthlyExpenses) * 12 * 25;
  const startBalance  = Math.max(0, currentSavings);
  const monthlyContrib = Math.max(0, monthlySavings);

  const months       = fireNumber > 0 ? simulate(startBalance, monthlyContrib, monthlyRate, fireNumber) : 0;
  const monthsWith500 = fireNumber > 0 ? simulate(startBalance, monthlyContrib + 500, monthlyRate, fireNumber) : 0;

  const totalMonthlyFlow = monthlyContrib + Math.max(0, monthlyExpenses);
  const savingsRate = totalMonthlyFlow > 0
    ? Math.round((monthlyContrib / totalMonthlyFlow) * 1000) / 10
    : 0;

  const percentFunded = fireNumber > 0
    ? Math.min(100, Math.round((startBalance / fireNumber) * 1000) / 10)
    : 100;

  const yearsDiff = months - monthsWith500;
  const yearsFasterWith500 = months >= 1200 ? 0 : Math.max(0, Math.round((yearsDiff / 12) * 10) / 10);

  return {
    fireNumber:         Math.round(fireNumber),
    yearsToFire:        months >= 1200 ? 100 : Math.round((months / 12) * 10) / 10,
    savingsRate,
    percentFunded,
    yearsFasterWith500,
    passiveIncomeNow:   Math.round(startBalance * 0.04 / 12),
  };
}
