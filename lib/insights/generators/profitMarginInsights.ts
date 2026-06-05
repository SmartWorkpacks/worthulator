import type { Insight } from "../types";
import { formatCurrency } from "../benchmarks";

export interface ProfitMarginInsightInputs {
  revenue: number;
  cost:    number;
}

export interface ProfitMarginInsightOutputs {
  grossProfit?:   number;
  marginPercent?: number;
  markupPercent?: number;
}

// Healthy gross-margin reference for a product-based business.
const HEALTHY_MARGIN_PCT = 30;

export function profitMarginInsights(
  inputs:  ProfitMarginInsightInputs,
  outputs: ProfitMarginInsightOutputs,
): Insight[] {
  const revenue = Number(inputs.revenue);
  const cost    = Number(inputs.cost);
  const profit  = outputs.grossProfit   ?? revenue - cost;
  const margin  = outputs.marginPercent ?? (revenue > 0 ? (profit / revenue) * 100 : 0);
  const markup  = outputs.markupPercent ?? (cost    > 0 ? (profit / cost)    * 100 : 0);

  const results: Insight[] = [];

  // 1. Headline — gross profit and margin, severity scaled to margin health
  const headlineSeverity = profit < 0 ? "critical" : margin < 10 ? "warning" : "positive";
  results.push({
    id:       "profit-margin.headline",
    severity: headlineSeverity,
    category: "comparison",
    title:    `${formatCurrency(profit)} gross profit — a ${margin.toFixed(1)}% margin`,
    body:     `On ${formatCurrency(revenue)} of revenue with ${formatCurrency(cost)} in cost, you keep ${formatCurrency(profit)} as gross profit. That is ${margin.toFixed(1)} cents of profit on every dollar of sales before operating costs, taxes, and overhead.`,
    metric:   { label: "Gross margin", value: `${margin.toFixed(1)}%` },
    priority: 100,
    visualization: {
      type:   "delta-card",
      before: { label: "Revenue", value: formatCurrency(revenue) },
      after:  { label: "Cost of goods", value: formatCurrency(cost) },
      delta:  { label: "Gross profit", value: formatCurrency(profit), positive: profit >= 0 },
    },
  });

  // 2. Margin vs markup — the most common pricing confusion
  if (cost > 0 && profit > 0) {
    results.push({
      id:       "profit-margin.markup-vs-margin",
      severity: "neutral",
      category: "comparison",
      title:    `This is a ${markup.toFixed(1)}% markup but only a ${margin.toFixed(1)}% margin`,
      body:     `Markup measures profit against cost; margin measures it against revenue. They describe the same ${formatCurrency(profit)} of profit from different angles — and confusing the two is the most common pricing mistake in business. Always price against the metric your industry uses.`,
      metric:   { label: "Markup vs margin", value: `${markup.toFixed(0)}% / ${margin.toFixed(0)}%` },
      priority: 80,
      visualization: {
        type:           "benchmark-bar",
        userValue:      markup,
        userLabel:      "Markup",
        benchmarkValue: margin,
        benchmarkLabel: "Margin",
        format:         "percent",
        caption:        { text: "Same profit, two reference points" },
      },
    });
  }

  // 3. Pricing leverage — a 1% price rise is pure profit
  if (revenue > 0) {
    const onePct = revenue * 0.01;
    results.push({
      id:       "profit-margin.pricing-lever",
      severity: "positive",
      category: "opportunity-cost",
      title:    `A 1% price increase adds ${formatCurrency(onePct)} of pure profit`,
      body:     `Raising prices by just 1% lifts profit by ${formatCurrency(onePct)} with no extra cost — straight to the bottom line. Cutting costs by the same 1% only saves ${formatCurrency(cost * 0.01)}. Pricing is almost always the higher-leverage lever.`,
      metric:   { label: "Profit per +1% price", value: formatCurrency(onePct) },
      priority: 60,
    });
  }

  // 4. Benchmark against a healthy product-business margin
  results.push({
    id:       "profit-margin.benchmark",
    severity: margin >= HEALTHY_MARGIN_PCT ? "positive" : "neutral",
    category: "benchmark-comparison",
    title:    margin >= HEALTHY_MARGIN_PCT
      ? `Your ${margin.toFixed(1)}% margin clears the ${HEALTHY_MARGIN_PCT}% healthy benchmark`
      : `Your ${margin.toFixed(1)}% margin sits below the ${HEALTHY_MARGIN_PCT}% product-business benchmark`,
    body:     `A 30% gross margin is a common target for healthy product-based businesses, though benchmarks vary enormously — software runs 60–80%, grocery 5–25%, restaurants 3–9%. Compare against your specific industry, not a generic number.`,
    metric:   { label: "vs 30% target", value: `${(margin - HEALTHY_MARGIN_PCT >= 0 ? "+" : "")}${(margin - HEALTHY_MARGIN_PCT).toFixed(1)} pts` },
    priority: 40,
    visualization: {
      type:           "benchmark-bar",
      userValue:      margin,
      userLabel:      "Your margin",
      benchmarkValue: HEALTHY_MARGIN_PCT,
      benchmarkLabel: "Healthy target",
      format:         "percent",
    },
  });

  // 5. Loss warning
  if (profit < 0) {
    results.push({
      id:       "profit-margin.loss",
      severity: "critical",
      category: "warning",
      title:    `You are selling at a loss of ${formatCurrency(Math.abs(profit))}`,
      body:     `Cost exceeds revenue, so every sale loses money. Either raise prices, cut the cost of goods, or stop selling this item until the unit economics work. Volume cannot fix a negative gross margin — it only deepens the loss.`,
      metric:   { label: "Loss per sale", value: formatCurrency(Math.abs(profit)) },
      priority: 90,
    });
  }

  return results.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
