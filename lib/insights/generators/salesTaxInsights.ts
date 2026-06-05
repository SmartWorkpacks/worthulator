// ─── WorthCore Insight Engine — Sales Tax Generator ──────────────────────────
//
// PURPOSE:
//   State-aware visual insights for the sales-tax calculator. Surfaces annual
//   burden vs national average, neighbor-state comparison, grocery exemption
//   context, investment opportunity cost, and large-purchase framing.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live state rate carries provenance caption
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { formatCurrency } from "@/lib/insights/benchmarks";
import { futureValueAnnuity } from "@/lib/insights/projections";
import { NATIONAL_AVG_SALES_TAX } from "@/lib/datasets/tax/salesTaxRates";

export interface SalesTaxInputs {
  price: number;
  taxRate: number;
  monthlySpend: number;
  state: string;
  /** Optional user-entered combined rate; when > 0 it overrides the state rate. */
  rateOverride?: number;
}

export interface SalesTaxOutputs {
  totalPrice: number;
  taxAmount: number;
  monthlyTaxBurden: number;
  annualTaxBurden: number;
  resolvedRate: number;
  neighborAvgRate: number;
  vsNeighborsDelta: number;
  grocerySaving: number;
  effectiveOnGroceries: number;
  dailyTaxBurden: number;
  annualIfInvested10yr: number;
}

export function generateSalesTaxInsights(
  inputs: SalesTaxInputs,
  outputs: SalesTaxOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { taxRate, monthlySpend, state } = inputs;
  const {
    taxAmount,
    annualTaxBurden,
    monthlyTaxBurden,
    neighborAvgRate,
    vsNeighborsDelta,
    grocerySaving,
    effectiveOnGroceries,
    dailyTaxBurden,
  } = outputs;

  const isCustomRate = (inputs.rateOverride ?? 0) > 0;
  const stateLabel =
    state && state !== "US Average" ? state : "the US average";
  const isSpecificState = state && state !== "US Average" && !isCustomRate;
  const annualRounded = Math.round(annualTaxBurden);
  const monthlyRounded = Math.round(monthlyTaxBurden);

  const liveCaption = isCustomRate
    ? {
        text: `Your entered rate ${taxRate}%`,
        asOf: "2026",
        live: false,
      }
    : {
        text: `${stateLabel} combined rate ${taxRate}% (Tax Foundation 2026)`,
        asOf: "2026",
        live: true,
      };

  // ── 1. Annual burden — benchmark-bar vs national average (always shown) ──
  if (monthlySpend > 0 && annualRounded > 0) {
    const nationalAnnual = Math.round(
      monthlySpend * (NATIONAL_AVG_SALES_TAX / 100) * 12,
    );
    const aboveNational = taxRate > NATIONAL_AVG_SALES_TAX;
    insights.push({
      id: "salestax.annual-burden",
      severity: aboveNational ? "warning" : annualRounded > 0 ? "positive" : "neutral",
      category: "spending",
      title: `${formatCurrency(annualRounded)}/year in sales tax — ${formatCurrency(dailyTaxBurden)}/day`,
      body: `At ${taxRate}%, you pay ${formatCurrency(monthlyRounded)}/month in sales tax on ${formatCurrency(monthlySpend)}/month of taxable purchases. That's ${formatCurrency(annualRounded)}/year, or about ${formatCurrency(dailyTaxBurden)} every single day — a cost most people never track.`,
      metric: { label: "Annual tax burden", value: formatCurrency(annualRounded) },
      visualization: {
        type: "benchmark-bar",
        userValue: annualRounded,
        userLabel: isSpecificState ? `${state}` : "Your burden",
        benchmarkValue: nationalAnnual,
        benchmarkLabel: `US avg (${NATIONAL_AVG_SALES_TAX}%)`,
        format: "currency",
        caption: liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 2. Neighbor-state comparison — benchmark-bar ─────────────────────────
  if (
    isSpecificState &&
    neighborAvgRate > 0 &&
    Math.abs(vsNeighborsDelta) >= 0.3
  ) {
    const cheaper = vsNeighborsDelta < 0;
    const diff = Math.abs(vsNeighborsDelta).toFixed(2);
    const neighborAnnual = Math.round(
      monthlySpend * (neighborAvgRate / 100) * 12,
    );
    const annualDiff = Math.abs(annualRounded - neighborAnnual);
    insights.push({
      id: "salestax.vs-neighbors",
      severity: cheaper ? "positive" : "neutral",
      category: "comparison",
      title: cheaper
        ? `${state} is ${diff}% below neighboring states — ${formatCurrency(annualDiff)}/year less`
        : `${state} is ${diff}% above neighboring states — ${formatCurrency(annualDiff)}/year more`,
      body: cheaper
        ? `Your neighbors average ${neighborAvgRate.toFixed(2)}% combined. At ${taxRate}%, ${state} saves you ${formatCurrency(annualDiff)}/year on ${formatCurrency(monthlySpend)}/month of taxable spending. Cross-border shopping from a higher-rate state into yours is common — and rational.`
        : `Your neighbors average ${neighborAvgRate.toFixed(2)}% combined. At ${taxRate}%, ${state} costs ${formatCurrency(annualDiff)}/year more on ${formatCurrency(monthlySpend)}/month of taxable spending. For large purchases ($1,000+), buying across the state line can save real money.`,
      visualization: {
        type: "benchmark-bar",
        userValue: taxRate,
        userLabel: state,
        benchmarkValue: neighborAvgRate,
        benchmarkLabel: "Neighbor avg",
        format: "number",
        caption: liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Grocery exemption — delta-card ────────────────────────────────────
  if (isSpecificState && grocerySaving > 0) {
    insights.push({
      id: "salestax.grocery-exempt",
      severity: "positive",
      category: "savings",
      title: `Groceries are tax-exempt — saving ~${formatCurrency(grocerySaving)}/year`,
      body: `${state} exempts unprepared groceries from sales tax. On a USDA moderate-cost grocery plan (~$7,500/year), that's ${formatCurrency(grocerySaving)}/year you don't pay. States like Tennessee, Alabama, and Mississippi still tax groceries at the full rate — costing families hundreds extra.`,
      visualization: {
        type: "delta-card",
        before: {
          label: "If groceries taxed",
          value: formatCurrency(annualRounded + grocerySaving),
        },
        after: {
          label: "With exemption",
          value: formatCurrency(annualRounded),
        },
        delta: {
          label: "Grocery saving",
          value: formatCurrency(grocerySaving),
          positive: true,
        },
      } satisfies InsightVisualization,
    });
  } else if (isSpecificState && effectiveOnGroceries > 0) {
    const groceryTax = Math.round(7500 * (effectiveOnGroceries / 100));
    insights.push({
      id: "salestax.grocery-taxed",
      severity: "warning",
      category: "hidden-cost",
      title: `Groceries are taxed at ${effectiveOnGroceries}% — ~${formatCurrency(groceryTax)}/year on food`,
      body: `${state} applies the full sales tax rate to unprepared groceries. On ~$7,500/year in groceries, that's ${formatCurrency(groceryTax)} in food tax alone. ${effectiveOnGroceries >= 7 ? "That's among the highest effective grocery tax burdens in the US." : "Many states exempt groceries entirely — yours doesn't."}`,
      metric: {
        label: "Annual grocery tax",
        value: formatCurrency(groceryTax),
      },
    });
  }

  // ── 4. No-tax state — special framing ──────────────────────────────────
  if (taxRate === 0 && monthlySpend > 0) {
    const avgBurden = Math.round(
      monthlySpend * (NATIONAL_AVG_SALES_TAX / 100) * 12,
    );
    insights.push({
      id: "salestax.no-tax",
      severity: "positive",
      category: "savings",
      title: `No sales tax — ${formatCurrency(avgBurden)}/year saved vs. the national average`,
      body: `You're in one of five states with no statewide sales tax. At the national average of ${NATIONAL_AVG_SALES_TAX}%, ${formatCurrency(monthlySpend)}/month of taxable spending would cost ${formatCurrency(avgBurden)}/year elsewhere. That's real money — equivalent to ${formatCurrency(Math.round(avgBurden / 12))}/month back in your pocket.`,
      metric: {
        label: "Annual saving vs avg",
        value: formatCurrency(avgBurden),
      },
    });
  }

  // ── 5. 10-year opportunity cost — projection-line ───────────────────────
  if (annualRounded > 500 && monthlySpend > 0) {
    const tenYear = Math.round(futureValueAnnuity(annualTaxBurden, 10));
    const twentyYear = Math.round(futureValueAnnuity(annualTaxBurden, 20));
    insights.push({
      id: "salestax.opportunity-cost",
      severity: "neutral",
      category: "opportunity-cost",
      title: `${formatCurrency(annualRounded)}/year in sales tax → ${formatCurrency(tenYear)} if invested over 10 years`,
      body: `Sales tax is a fixed cost of where you live — but framing it as an investment makes the scale visible. ${formatCurrency(annualRounded)}/year at 7% compounds to ${formatCurrency(tenYear)} in 10 years and ${formatCurrency(twentyYear)} in 20. That's the invisible drag of consumption tax on wealth building.`,
      visualization: {
        type: "projection-line",
        points: [1, 3, 5, 10, 15, 20].map((yr) => ({
          label: `Yr ${yr}`,
          value: Math.round(futureValueAnnuity(annualTaxBurden, yr)),
        })),
        format: "currency",
        yLabel: "Invested value of tax paid",
        color: "#f59e0b",
        caption: { text: `${formatCurrency(annualRounded)}/yr at 7% compound return` },
      } satisfies InsightVisualization,
    });
  }

  // ── 6. Large purchase framing — concrete savings context ────────────────
  if (inputs.price >= 500) {
    const onePctSave = Math.round(inputs.price * 0.01);
    insights.push({
      id: "salestax.large-purchase",
      severity: "neutral",
      category: "hidden-cost",
      title: `${formatCurrency(Math.round(taxAmount))} tax on a ${formatCurrency(inputs.price)} purchase`,
      body: `On purchases this size, every percentage point matters — ${formatCurrency(onePctSave)} per point. ${isSpecificState && neighborAvgRate > 0 && vsNeighborsDelta > 1 ? `Buying this in a neighboring state (avg ${neighborAvgRate.toFixed(1)}%) would save ${formatCurrency(Math.round(inputs.price * (vsNeighborsDelta / 100)))}.` : "Timing large purchases during tax-free holidays (back-to-school, disaster-prep) can zero out the tax entirely in participating states."}`,
      metric: {
        label: "Tax on this purchase",
        value: formatCurrency(Math.round(taxAmount)),
      },
    });
  }

  return insights;
}
