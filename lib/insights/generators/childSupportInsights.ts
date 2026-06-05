import type { Insight } from "../types";
import { formatCurrency } from "../benchmarks";

export interface ChildSupportInsightInputs {
  payerIncome:    number;
  receiverIncome: number;
  children:       number;
  custodySplit:   number;
}

export interface ChildSupportInsightOutputs {
  support?:       number;
  annualSupport?: number;
}

// Approximate US median monthly child-support order.
const MEDIAN_MONTHLY_ORDER = 500;
// Income-share guideline percentages by number of children (simplified).
const SHARE_PCTS: Record<number, number> = { 1: 0.17, 2: 0.25, 3: 0.29, 4: 0.31, 5: 0.34, 6: 0.36 };

export function childSupportInsights(
  inputs:  ChildSupportInsightInputs,
  outputs: ChildSupportInsightOutputs,
): Insight[] {
  const payerIncome    = Number(inputs.payerIncome);
  const receiverIncome = Number(inputs.receiverIncome);
  const children       = Number(inputs.children);
  const custodySplit   = Number(inputs.custodySplit);
  const support        = outputs.support       ?? 0;
  const annual         = outputs.annualSupport ?? support * 12;

  const combined  = payerIncome + receiverIncome;
  const pct       = SHARE_PCTS[Math.min(Math.max(children, 1), 6)] ?? 0.36;
  const payerShare = combined > 0 ? payerIncome / combined : 0;
  const payerObligation = combined * pct * payerShare;
  const incomeSharePct  = payerIncome > 0 ? (support / payerIncome) * 100 : 0;

  const results: Insight[] = [];

  // 1. Headline — monthly and annual estimate
  results.push({
    id:       "child-support.headline",
    severity: "neutral",
    category: "comparison",
    title:    `Estimated support is ${formatCurrency(support)}/month (${formatCurrency(annual)}/year)`,
    body:     `Using the income-shares model, combined income of ${formatCurrency(combined)} produces a baseline obligation, split so the payer covers their ${(payerShare * 100).toFixed(0)}% income share, then adjusted for ${custodySplit}% custody time.`,
    metric:   { label: "Monthly support", value: formatCurrency(support) },
    priority: 100,
    visualization: {
      type:   "delta-card",
      before: { label: "Payer income", value: formatCurrency(payerIncome) },
      after:  { label: "Support", value: formatCurrency(support) },
      delta:  { label: "Share of income", value: `${incomeSharePct.toFixed(0)}%`, positive: false },
    },
  });

  // 2. Share of payer income — affordability pressure
  if (incomeSharePct > 0) {
    const heavy = incomeSharePct >= 25;
    results.push({
      id:       "child-support.income-share",
      severity: heavy ? "warning" : "neutral",
      category: "affordability-pressure",
      title:    `Support is ${incomeSharePct.toFixed(0)}% of the payer's monthly income`,
      body:     heavy
        ? `At ${incomeSharePct.toFixed(0)}% of monthly income, this is a significant fixed obligation. Build the rest of your budget around it first — courts expect support to be paid before discretionary spending.`
        : `At ${incomeSharePct.toFixed(0)}% of monthly income, the obligation is within a manageable range, but it is a fixed, non-negotiable expense that should sit at the top of your budget.`,
      metric:   { label: "% of income", value: `${incomeSharePct.toFixed(0)}%` },
      priority: 80,
    });
  }

  // 3. Custody leverage — each 10% of time shifts the number
  if (payerObligation > 0) {
    const perTenPct = payerObligation * 0.10;
    results.push({
      id:       "child-support.custody-leverage",
      severity: "neutral",
      category: "impact",
      title:    `Every 10% more custody time lowers support by about ${formatCurrency(perTenPct)}/month`,
      body:     `Physical custody is the biggest lever here. Moving from ${custodySplit}% toward a 50/50 split reduces the payer's obligation roughly ${formatCurrency(perTenPct)} for each additional 10% of parenting time — one reason custody and support are negotiated together.`,
      metric:   { label: "Per 10% custody", value: formatCurrency(perTenPct) },
      priority: 60,
    });
  }

  // 4. Benchmark vs the national median order
  results.push({
    id:       "child-support.benchmark",
    severity: "neutral",
    category: "benchmark-comparison",
    title:    support >= MEDIAN_MONTHLY_ORDER
      ? `This is above the ~${formatCurrency(MEDIAN_MONTHLY_ORDER)} US median monthly order`
      : `This is below the ~${formatCurrency(MEDIAN_MONTHLY_ORDER)} US median monthly order`,
    body:     `The median child-support order in the US is around ${formatCurrency(MEDIAN_MONTHLY_ORDER)}/month, but actual amounts swing widely with state formula, income type, healthcare, and childcare costs.`,
    metric:   { label: "vs median", value: formatCurrency(support - MEDIAN_MONTHLY_ORDER) },
    priority: 40,
    visualization: {
      type:           "benchmark-bar",
      userValue:      support,
      userLabel:      "Your estimate",
      benchmarkValue: MEDIAN_MONTHLY_ORDER,
      benchmarkLabel: "US median",
      format:         "currency",
    },
  });

  // 5. Multi-year cumulative total
  if (annual > 0) {
    results.push({
      id:       "child-support.cumulative",
      severity: "neutral",
      category: "projection",
      title:    `${formatCurrency(annual * 5)} over 5 years, ${formatCurrency(annual * 10)} over 10`,
      body:     `At ${formatCurrency(support)}/month the obligation compounds to ${formatCurrency(annual * 5)} in five years and ${formatCurrency(annual * 10)} in ten — a long-horizon commitment worth planning around, not just budgeting month to month.`,
      metric:   { label: "10-year total", value: formatCurrency(annual * 10) },
      priority: 30,
      visualization: {
        type:    "projection-line",
        format:  "currency",
        yLabel:  "Cumulative support",
        points:  [
          { label: "1yr", value: annual },
          { label: "3yr", value: annual * 3 },
          { label: "5yr", value: annual * 5 },
          { label: "10yr", value: annual * 10 },
        ],
        caption: { text: "Cumulative obligation at the current monthly estimate" },
      },
    });
  }

  // 6. Estimate-only reminder
  results.push({
    id:       "child-support.disclaimer",
    severity: "warning",
    category: "warning",
    title:    `Treat this as a ballpark, not a court order`,
    body:     `This estimate uses a simplified income-shares formula. It ignores state-specific tables, tax treatment, healthcare and childcare add-ons, and existing orders — all of which courts weigh. Use it to set expectations, then confirm with your state guidelines or a family-law attorney.`,
    priority: 10,
  });

  return results.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
