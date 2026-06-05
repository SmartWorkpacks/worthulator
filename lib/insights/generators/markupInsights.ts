import type { Insight } from "../types";
import { formatCurrency, formatCurrencyPrecise } from "../benchmarks";

export interface MarkupInsightInputs {
  costPrice:     number;
  markupPercent: number;
}

export interface MarkupInsightOutputs {
  sellingPrice?:  number;
  profitAmount?:  number;
  marginPercent?: number;
}

// Classic retail "keystone" markup — doubling the cost price.
const KEYSTONE_MARKUP_PCT = 100;
// Illustrative monthly unit volume used for the annualised-profit insight.
const EXAMPLE_UNITS_PER_MONTH = 100;

export function markupInsights(
  inputs:  MarkupInsightInputs,
  outputs: MarkupInsightOutputs,
): Insight[] {
  const cost    = Number(inputs.costPrice);
  const markup  = Number(inputs.markupPercent);
  const selling = outputs.sellingPrice  ?? cost * (1 + markup / 100);
  const profit  = outputs.profitAmount  ?? selling - cost;
  const margin  = outputs.marginPercent ?? (selling > 0 ? (profit / selling) * 100 : 0);

  const results: Insight[] = [];

  // 1. Headline — selling price and per-unit profit
  results.push({
    id:       "markup.headline",
    severity: "positive",
    category: "comparison",
    title:    `A ${markup.toFixed(0)}% markup sets the price at ${formatCurrencyPrecise(selling)}`,
    body:     `Marking up a ${formatCurrencyPrecise(cost)} item by ${markup.toFixed(0)}% gives a ${formatCurrencyPrecise(selling)} selling price and ${formatCurrencyPrecise(profit)} of profit per unit — a ${margin.toFixed(1)}% gross margin.`,
    metric:   { label: "Profit per unit", value: formatCurrencyPrecise(profit) },
    priority: 100,
    visualization: {
      type:   "delta-card",
      before: { label: "Cost price", value: formatCurrencyPrecise(cost) },
      after:  { label: "Selling price", value: formatCurrencyPrecise(selling) },
      delta:  { label: "Profit / unit", value: formatCurrencyPrecise(profit), positive: profit >= 0 },
    },
  });

  // 2. Markup vs margin — they are not the same number
  results.push({
    id:       "markup.vs-margin",
    severity: "neutral",
    category: "comparison",
    title:    `That ${markup.toFixed(0)}% markup is only a ${margin.toFixed(1)}% margin`,
    body:     `Markup is profit as a share of cost; margin is profit as a share of the selling price. A ${markup.toFixed(0)}% markup always works out to a lower margin (${margin.toFixed(1)}%). Setting a markup while thinking in margin terms quietly leaves money on the table.`,
    metric:   { label: "Markup vs margin", value: `${markup.toFixed(0)}% / ${margin.toFixed(0)}%` },
    priority: 80,
    visualization: {
      type:           "benchmark-bar",
      userValue:      markup,
      userLabel:      "Markup",
      benchmarkValue: margin,
      benchmarkLabel: "Margin",
      format:         "percent",
      caption:        { text: "Markup is always the larger number" },
    },
  });

  // 3. Keystone comparison — where this markup sits vs the retail standard
  if (markup < KEYSTONE_MARKUP_PCT) {
    const keystonePrice = cost * 2;
    results.push({
      id:       "markup.keystone",
      severity: "neutral",
      category: "benchmark-comparison",
      title:    `Keystone pricing would set this at ${formatCurrencyPrecise(keystonePrice)}`,
      body:     `Many retailers use a 100% "keystone" markup — doubling the cost — which yields a 50% margin. Your ${markup.toFixed(0)}% markup prices ${formatCurrencyPrecise(keystonePrice - selling)} below keystone, trading margin for competitiveness.`,
      metric:   { label: "vs keystone price", value: formatCurrencyPrecise(keystonePrice - selling) },
      priority: 50,
      visualization: {
        type:           "benchmark-bar",
        userValue:      selling,
        userLabel:      "Your price",
        benchmarkValue: keystonePrice,
        benchmarkLabel: "Keystone (2×)",
        format:         "currency",
      },
    });
  }

  // 4. Annualised profit at an illustrative volume
  if (profit > 0) {
    const annualProfit = profit * EXAMPLE_UNITS_PER_MONTH * 12;
    results.push({
      id:       "markup.volume",
      severity: "positive",
      category: "projection",
      title:    `At ${EXAMPLE_UNITS_PER_MONTH} units a month that is ${formatCurrency(annualProfit)} a year`,
      body:     `Each unit carries ${formatCurrencyPrecise(profit)} of profit. Selling ${EXAMPLE_UNITS_PER_MONTH} per month compounds to ${formatCurrency(annualProfit)} of gross profit annually — which is why even small per-unit markup changes move the bottom line at scale.`,
      metric:   { label: "Annual gross profit", value: formatCurrency(annualProfit) },
      priority: 40,
    });
  }

  // 5. Thin-markup warning
  if (markup > 0 && markup < 15) {
    results.push({
      id:       "markup.thin",
      severity: "warning",
      category: "warning",
      title:    `A ${markup.toFixed(0)}% markup leaves little room for error`,
      body:     `At this markup a single returned item, discount, or shipping surprise can wipe out the profit on several sales. Thin markups only work at high volume with tight cost control — make sure the numbers hold once all overhead is counted.`,
      metric:   { label: "Margin", value: `${margin.toFixed(1)}%` },
      priority: 60,
    });
  }

  return results.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
