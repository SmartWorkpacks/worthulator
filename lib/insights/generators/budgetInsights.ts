import type { Insight, InsightVisualization } from "../types";
import { futureValueAnnuity } from "../projections";
import { formatCurrency } from "../benchmarks";

interface BudgetInputs {
  income:    number;
  housing:   number;
  food:      number;
  transport: number;
  debt:      number;
  other:     number;
  state?:    string;
  /** Optional user-entered combined rate; when > 0 it overrides the state rate. */
  rateOverride?: number;
}

interface BudgetOutputs {
  leftover?:          number;
  savingsRate?:       number;
  expenseRatio?:      number;
  annualLeftover?:    number;
  housingRatio?:      number;
  debtRatio?:         number;
  tenYearIfInvested?: number;
  needsRatio?:        number;
  wantsRatio?:        number;
  salesTaxAnnual?:    number;
  salesTaxMonthly?:   number;
  resolvedRate?:      number;
}

// 50/30/20 rule (Elizabeth Warren, All Your Worth 2005).
// Housing: 28–30% of gross income (HUD standard).
// Debt-to-income: <15% consumer debt, <43% total (CFPB mortgage standard).
// Savings: US personal savings rate 2024: 4.6% (BEA).

export function budgetInsights(
  inputs: BudgetInputs,
  outputs: BudgetOutputs,
): Insight[] {
  const results: Insight[] = [];

  const income      = Number(inputs.income);
  const housing     = Number(inputs.housing);
  const debt        = Number(inputs.debt);
  const leftover    = outputs.leftover          ?? 0;
  const savingsRate = outputs.savingsRate       ?? 0;
  const annualLeft  = outputs.annualLeftover    ?? (leftover * 12);
  const housingPct  = outputs.housingRatio      ?? 0;
  const debtPct     = outputs.debtRatio         ?? 0;
  const tenYear     = outputs.tenYearIfInvested ?? (annualLeft > 0 ? Math.round(futureValueAnnuity(annualLeft, 10)) : 0);
  const needsPct    = outputs.needsRatio        ?? 0;
  const wantsPct    = outputs.wantsRatio        ?? 0;
  const salesTaxYr  = outputs.salesTaxAnnual    ?? 0;
  const rate        = outputs.resolvedRate      ?? 0;
  const isCustomRate = (inputs.rateOverride ?? 0) > 0;
  const stateLabel  = inputs.state && inputs.state !== "US Average" ? inputs.state : "the US";
  const rateWhere   = isCustomRate ? "your" : `${stateLabel}'s`;

  // 1. Core: overspending or surplus
  if (leftover < 0) {
    results.push({
      id:       "budget.overspending",
      severity: "warning",
      category: "warning",
      title:    `Spending ${formatCurrency(Math.abs(leftover))}/month more than income`,
      body:     `A ${formatCurrency(Math.abs(leftover))}/month deficit means money is either being borrowed or drawn from savings every month. The Bureau of Economic Analysis reports the US personal savings rate is 4.6% — a deficit means you are moving in the opposite direction. The largest single category is usually the most actionable lever.`,
      metric:   { label: "Monthly deficit", value: formatCurrency(Math.abs(leftover)) },
    });
  } else {
    results.push({
      id:       "budget.savings-rate",
      severity: savingsRate >= 20 ? "positive" : savingsRate >= 10 ? "neutral" : "neutral",
      category: "comparison",
      title:    `${savingsRate}% savings rate — US average is 4.6%`,
      body:     `Your ${savingsRate}% savings rate compares to the US personal savings rate of 4.6% (Bureau of Economic Analysis, 2024). The 50/30/20 rule targets 20% for savings and debt repayment. ${savingsRate >= 20 ? `At ${savingsRate}%, you are above that benchmark.` : `At ${savingsRate}%, there is room between your current rate and the 20% target.`}`,
      metric:   { label: "Your savings rate", value: `${savingsRate}%` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      savingsRate,
        userLabel:      "Your savings rate",
        benchmarkValue: 20,
        benchmarkLabel: "50/30/20 target",
        format:         "number",
      },
    });
  }

  // 2. Housing ratio
  if (housingPct > 30) {
    results.push({
      id:       "budget.housing-heavy",
      severity: "neutral",
      category: "spending",
      title:    `Housing is ${housingPct}% of income — above the 30% guideline`,
      body:     `HUD and most financial planners use 28–30% of gross income as the housing affordability threshold. At ${housingPct}%, your ${formatCurrency(housing)}/month in housing costs is crowding out savings and discretionary spending. Every percentage point above 30% is ${formatCurrency(Math.round(income * 0.01))}/month less available for other goals.`,
      metric:   { label: "Housing ratio", value: `${housingPct}%` },
    });
  } else if (housingPct <= 25 && housingPct > 0) {
    results.push({
      id:       "budget.housing-lean",
      severity: "positive",
      category: "savings",
      title:    `Housing at ${housingPct}% of income — well within the 30% guideline`,
      body:     `At ${housingPct}%, your ${formatCurrency(housing)}/month housing cost leaves room in the budget. Keeping housing lean is one of the highest-leverage financial decisions because the saving recurs every month for the life of the lease or mortgage.`,
      metric:   { label: "Housing ratio", value: `${housingPct}%` },
    });
  }

  // 3. Debt burden
  if (debtPct > 15) {
    results.push({
      id:       "budget.debt-heavy",
      severity: "neutral",
      category: "debt-burden",
      title:    `Debt payments are ${debtPct}% of income — ${formatCurrency(debt)}/month`,
      body:     `The CFPB recommends keeping consumer debt payments below 15% of income (excluding mortgage). At ${debtPct}%, ${formatCurrency(debt)}/month is going to debt servicing. The avalanche method — paying off the highest-interest debt first — minimises the total interest paid.`,
      metric:   { label: "Debt-to-income", value: `${debtPct}%` },
    });
  }

  // 4. Annual surplus and investment value
  if (annualLeft > 0 && leftover > 0) {
    results.push({
      id:       "budget.compound-value",
      severity: "positive",
      category: "opportunity-cost",
      title:    `${formatCurrency(leftover)}/month surplus — ${formatCurrency(tenYear)} invested over 10 years`,
      body:     `${formatCurrency(leftover)}/month is ${formatCurrency(annualLeft)}/year in annual surplus. Invested at 7%, that grows to ${formatCurrency(tenYear)} over 10 years. The gap between spending everything and investing the surplus is ${formatCurrency(tenYear - annualLeft * 10)} in compound growth.`,
      metric:   { label: "10-year invested value", value: formatCurrency(tenYear) },
      visualization: {
        type:   "projection-line",
        points: [1, 3, 5, 10, 15, 20].map((yr) => ({
          label: `Yr ${yr}`,
          value: Math.round(futureValueAnnuity(annualLeft, yr)),
        })),
        format: "currency",
        yLabel: "Invested surplus",
        color:  "#10b981",
      },
    });
  }

  // 5. Gap to 20% savings rate
  if (savingsRate >= 0 && savingsRate < 20 && leftover >= 0) {
    const gapToTwenty = Math.round(income * 0.2 - leftover);
    if (gapToTwenty > 0) {
      results.push({
        id:       "budget.savings-gap",
        severity: "neutral",
        category: "opportunity-cost",
        title:    `${formatCurrency(gapToTwenty)}/month separates you from a 20% savings rate`,
        body:     `Reaching a 20% savings rate from ${savingsRate}% requires finding ${formatCurrency(gapToTwenty)}/month — ${formatCurrency(Math.round(gapToTwenty / 30))}/day in expense reductions. A single category reduction (subscriptions, dining, transport) often contains this amount.`,
        metric:   { label: "Gap to 20% rate", value: formatCurrency(gapToTwenty) },
      });
    }
  }

  // 6. 50/30/20 needs allocation — benchmark-bar against the 50% target
  if (income > 0 && needsPct > 0) {
    const overNeeds = needsPct > 50;
    results.push({
      id:       "budget.needs-allocation",
      severity: overNeeds ? "neutral" : "positive",
      category: "comparison",
      title:    `Essentials are ${needsPct.toFixed(0)}% of income — 50/30/20 targets 50%`,
      body:     `The 50/30/20 rule (Elizabeth Warren) splits take-home into 50% needs, 30% wants, 20% savings. Your essentials — housing, food, transport, and debt — run ${needsPct.toFixed(0)}%, with wants at ${wantsPct.toFixed(0)}%. ${overNeeds ? `Above 50% means the squeeze is structural; the biggest essential (usually housing at ${housingPct.toFixed(0)}%) is the highest-leverage place to act.` : `Keeping needs at or below 50% is what leaves room for a healthy savings rate.`}`,
      metric:   { label: "Needs ratio", value: `${needsPct.toFixed(0)}%` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      Math.round(needsPct),
        userLabel:      "Your needs",
        benchmarkValue: 50,
        benchmarkLabel: "50/30/20 target",
        format:         "number",
      } satisfies InsightVisualization,
    });
  }

  // 7. Live sales tax hidden in spending
  if (salesTaxYr > 0 && rate > 0) {
    results.push({
      id:       "budget.sales-tax",
      severity: "neutral",
      category: "hidden-cost",
      title:    `~${formatCurrency(salesTaxYr)}/year of your spending is sales tax`,
      body:     `At ${rateWhere} ${rate.toFixed(2)}% combined rate, the taxable slice of your budget (discretionary goods${(outputs.salesTaxMonthly ?? 0) > 0 ? "" : ""} plus groceries where they're taxed) carries about ${formatCurrency(salesTaxYr)}/year in sales tax — roughly ${formatCurrency(Math.round(salesTaxYr / 12))}/month you never see itemised. It's a real, recurring line most budgets ignore.`,
      metric:   { label: "Annual sales tax", value: formatCurrency(salesTaxYr) },
      visualization: {
        type:    "delta-card",
        before:  { label: "Annual surplus", value: formatCurrency(Math.max(0, annualLeft)) },
        after:   { label: "Sales tax paid", value: formatCurrency(salesTaxYr) },
        delta:   { label: "Tax vs surplus", value: `${annualLeft > 0 ? Math.round((salesTaxYr / annualLeft) * 100) : 0}%`, positive: false },
        caption: isCustomRate
          ? {
              text: `Your entered rate ${rate.toFixed(2)}%`,
              asOf: "2026",
              live: false,
            }
          : {
              text: `${stateLabel} combined rate ${rate.toFixed(2)}% (Tax Foundation 2026)`,
              asOf: "2026",
              live: true,
            },
      } satisfies InsightVisualization,
    });
  }

  return results;
}
