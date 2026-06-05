import type { Insight } from "../index";
import { formatCurrency } from "../benchmarks";

interface SelfEmployedTaxInputs {
  grossIncome:      number;
  businessExpenses: number;
  federalRate:      number;
}

interface SelfEmployedTaxOutputs {
  annualTaxEstimate?: number;
  quarterlyPayment?:  number;
  monthlyReserve?:    number;
  effectiveTaxRate?:  number;
  netAfterTax?:       number;
  netMonthly?:        number;
  seTaxAmount?:       number;
}

export function selfEmployedTaxInsights(
  inputs: SelfEmployedTaxInputs,
  outputs: SelfEmployedTaxOutputs
): Insight[] {
  const results: Insight[] = [];

  const gross     = Number(inputs.grossIncome);
  const expenses  = Number(inputs.businessExpenses);
  const rate      = Number(inputs.federalRate);
  const annual    = outputs.annualTaxEstimate ?? 0;
  const quarterly = outputs.quarterlyPayment  ?? 0;
  const monthly   = outputs.monthlyReserve    ?? 0;
  const effective = outputs.effectiveTaxRate  ?? 0;
  const netYear   = outputs.netAfterTax       ?? 0;
  const netMo     = outputs.netMonthly        ?? 0;
  const seTax     = outputs.seTaxAmount       ?? 0;

  if (gross <= 0) return results;

  // 1. Core tax burden — always shown
  results.push({
    id:       "set.core-burden",
    severity: "neutral",
    category: "hidden-cost",
    title:    `${effective.toFixed(1)}% effective tax rate — ${formatCurrency(annual)}/year on ${formatCurrency(gross)} gross`,
    body:     `That is ${formatCurrency(quarterly)}/quarter or ${formatCurrency(monthly)}/month to set aside. Self-employed filers must make estimated quarterly payments on April 15, June 16, September 15, and January 15. Missing payments triggers an IRS underpayment penalty (currently ~8% annualized).`,
    metric:   { label: "Annual tax estimate", value: formatCurrency(annual) },
    visualization: {
      type:   "delta-card",
      before: { label: "Gross income",   value: formatCurrency(gross) },
      after:  { label: "Net after tax",  value: formatCurrency(netYear) },
      delta:  { label: "Tax owed",       value: formatCurrency(annual), positive: false },
    },
  });

  // 2. SE tax is the hidden shock
  const seTaxPct = gross > 0 ? Math.round(seTax / gross * 1000) / 10 : 0;
  if (seTax > 2000) {
    results.push({
      id:       "set.se-tax-shock",
      severity: "warning",
      category: "hidden-cost",
      title:    `${formatCurrency(seTax)} of your bill is the self-employment tax — ${seTaxPct.toFixed(1)}% of gross`,
      body:     `W-2 employees pay 7.65% for Social Security and Medicare — their employer pays the matching 7.65%. As self-employed, you pay both halves: 15.3% on net earnings up to the wage base ($168,600 in 2024). This is the hidden cost of 1099 work that catches first-year freelancers off-guard.`,
      metric:   { label: "SE tax portion", value: formatCurrency(seTax) },
    });
  }

  // 3. Real take-home
  if (netMo > 0) {
    results.push({
      id:       "set.take-home",
      severity: "neutral",
      category: "comparison",
      title:    `True take-home: ${formatCurrency(netMo)}/month (${formatCurrency(netYear)}/year)`,
      body:     `${formatCurrency(netYear)}/year is your actual income — not the headline gross. When comparing to a W-2 salary offer, the equivalent W-2 salary would need to be approximately ${formatCurrency(Math.round(netYear / 0.72))} at a 28% tax rate to produce the same take-home.`,
      metric:   { label: "Monthly net", value: formatCurrency(netMo) },
    });
  }

  // 4. Expense deduction leverage
  if (expenses > 0) {
    const taxSavedOnExpenses = Math.round(expenses * (rate + 15.3) / 100);
    results.push({
      id:       "set.expense-deduction",
      severity: "positive",
      category: "savings",
      title:    `${formatCurrency(expenses)} in business expenses saves ~${formatCurrency(taxSavedOnExpenses)} in taxes`,
      body:     `Business deductions reduce both income tax and the self-employment tax base. Home office (exclusive-use area), software, equipment, professional development, health insurance premiums, and retirement contributions all qualify. Every legitimate expense is effectively subsidized at your marginal rate.`,
      metric:   { label: "Tax saved on expenses", value: formatCurrency(taxSavedOnExpenses) },
    });
  }

  // 5. Quarterly deadlines
  if (quarterly > 500) {
    results.push({
      id:       "set.quarterly-deadlines",
      severity: "neutral",
      category: "hidden-cost",
      title:    `${formatCurrency(quarterly)} due quarterly — automate now`,
      body:     `Set up automatic transfers of ${formatCurrency(monthly)}/month into a dedicated tax savings account (high-yield if possible). The IRS safe harbor rule lets you avoid penalties by paying either 100% of last year's tax or 90% of this year's — whichever is smaller.`,
      metric:   { label: "Quarterly payment", value: formatCurrency(quarterly) },
    });
  }

  // 6. High earner: SEP-IRA leverage
  if (gross >= 80_000) {
    const sepContrib = Math.round(Math.min((gross - expenses) * 0.25, 69000));
    const taxSaved   = Math.round(sepContrib * (rate + 15.3) / 100);
    results.push({
      id:       "set.sep-ira-opportunity",
      severity: "positive",
      category: "investment",
      title:    `SEP-IRA: contribute up to ${formatCurrency(sepContrib)} and save ~${formatCurrency(taxSaved)} in taxes`,
      body:     `Self-employed individuals can contribute up to 25% of net self-employment earnings (max $69,000 in 2024) into a SEP-IRA. Contributions reduce taxable income dollar-for-dollar and compound tax-deferred. A Solo 401(k) offers similar limits with more flexibility for high earners.`,
      metric:   { label: "Max SEP-IRA contribution", value: formatCurrency(sepContrib) },
    });
  }

  return results;
}
