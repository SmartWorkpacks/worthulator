// ─── WorthCore Insight Engine — Car Loan Generator ───────────────────────────
//
// PURPOSE:
//   Deterministic insights for the "car-loan-calculator" engine. Built on TWO
//   live data layers:
//     1. FRED 48-mo new-car APR  → rate benchmark
//     2. State combined sales tax → financed-tax differentiator
//   Surfaces the financed sales tax other calculators ignore, rate benchmarking,
//   term-length risk, interest burden, down-payment adequacy, and opportunity cost.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Market benchmarks read from data layer at module level only
//   ✅ Stable, unique insight IDs: "carloan.<rule-name>"
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency }     from "@/lib/insights/benchmarks";
import { futureValueAnnuity } from "@/lib/insights/projections";
import { getAutoLoanNewAPR, fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

// ─── Module-level live defaults ──────────────────────────────────────────────
const MARKET_AUTO_LOAN_RATE = getAutoLoanNewAPR(); // FRED 48-mo new-car average
const RATE_PERIOD = fredBenchmarks.currentPeriodLabel;

// ─── Rule thresholds (documented) ────────────────────────────────────────────
const RATE_ABOVE_MARKET_TRIGGER = 1.5;
const RATE_BELOW_MARKET_THRESHOLD = 1.5;
const LONG_TERM_MONTHS = 72;
const INTEREST_HEAVY_THRESHOLD = 15;
const LOW_DOWN_PAYMENT_THRESHOLD = 10;
const STRONG_DOWN_PAYMENT_THRESHOLD = 20;

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface CarLoanInputs {
  vehiclePrice:  number;
  downPayment:   number;
  tradeIn:       number;
  interestRate:  number;
  termMonths:    number;
  state:         string;
  /** Optional user-entered combined sales tax rate; when > 0 it overrides the state rate. */
  salesTaxOverride?: number;
}

export interface CarLoanOutputs {
  monthlyPayment:       number;
  totalInterest:        number;
  totalCost:            number;
  interestPct:          number;
  loanAmount:           number;
  salesTax:             number;
  outTheDoorPrice:      number;
  downPaymentRatio:     number;
  annualPaymentBurden:  number;
  taxFinancedInterest:  number;
  /** Resolved combined sales tax rate for the selected state. */
  resolvedRate?:        number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateCarLoanInsights(
  inputs: CarLoanInputs,
  outputs: CarLoanOutputs,
): Insight[] {
  if (outputs.monthlyPayment <= 0 || outputs.loanAmount <= 0) return [];

  const insights: Insight[] = [];
  const stateLabel = inputs.state && inputs.state !== "US Average" ? inputs.state : "the US";
  const rate = outputs.resolvedRate ?? 0;
  const downPaymentRatio = outputs.downPaymentRatio
    ?? (inputs.vehiclePrice > 0 ? (inputs.downPayment / inputs.vehiclePrice) * 100 : 0);

  // ── Rule 1: Financed sales tax — the differentiator ────────────────────────
  if (outputs.salesTax > 0) {
    const isCustomTax = (inputs.salesTaxOverride ?? 0) > 0;
    const taxLiveCaption = isCustomTax
      ? {
          text: `Your entered rate ${rate.toFixed(2)}%`,
          asOf: "2026",
          live: false,
        }
      : {
          text: `${stateLabel} combined rate ${rate.toFixed(2)}% (Tax Foundation 2026)`,
          asOf: "2026",
          live: true,
        };
    const taxWhere = isCustomTax ? "at your rate" : `in ${stateLabel}`;
    insights.push({
      id:       "carloan.financed-tax",
      category: "hidden-cost",
      severity: "warning",
      title:    `You're financing ${formatCurrency(Math.round(outputs.salesTax))} of sales tax`,
      body:     `At ${rate.toFixed(2)}% ${taxWhere}, sales tax adds ${formatCurrency(Math.round(outputs.salesTax))} to your ${formatCurrency(inputs.vehiclePrice)} vehicle — pushing the out-the-door price to ${formatCurrency(Math.round(outputs.outTheDoorPrice))}. Because it's rolled into the loan, that tax itself accrues roughly ${formatCurrency(Math.round(outputs.taxFinancedInterest))} of interest over ${Math.round(inputs.termMonths / 12)} years. Paying tax in cash up front avoids financing it.`,
      metric:   { label: "Sales tax financed", value: formatCurrency(Math.round(outputs.salesTax)) },
      visualization: {
        type:   "delta-card",
        before: { label: "Vehicle price",  value: formatCurrency(inputs.vehiclePrice) },
        after:  { label: "Out-the-door",   value: formatCurrency(Math.round(outputs.outTheDoorPrice)) },
        delta:  { label: "Sales tax",      value: formatCurrency(Math.round(outputs.salesTax)), positive: false },
        caption: taxLiveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── Rule 2: Interest rate vs live FRED market ──────────────────────────────
  const rateDiff = inputs.interestRate - MARKET_AUTO_LOAN_RATE;
  const rateLiveCaption = {
    text: `FRED 48-mo new-car avg ${MARKET_AUTO_LOAN_RATE}% (${RATE_PERIOD})`,
    asOf: RATE_PERIOD,
    live: true,
  };

  if (rateDiff >= RATE_ABOVE_MARKET_TRIGGER) {
    insights.push({
      id:       "carloan.rate-above-market",
      category: "spending",
      severity: "warning",
      title:    `Your ${inputs.interestRate.toFixed(1)}% APR is above the ${MARKET_AUTO_LOAN_RATE}% market average`,
      body:     `Your rate is ${rateDiff.toFixed(1)} points above the current FRED 48-month new-car average of ${MARKET_AUTO_LOAN_RATE}%. On a ${formatCurrency(outputs.loanAmount)} loan, that gap costs roughly ${formatCurrency(Math.round((rateDiff / 100 / 12) * outputs.loanAmount * Number(inputs.termMonths) * 0.6))} extra in interest. If your credit has improved, refinancing could close the gap.`,
      metric:   { label: "Above market rate", value: `+${rateDiff.toFixed(1)}%` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      Math.round(inputs.interestRate * 10) / 10,
        userLabel:      "Your APR",
        benchmarkValue: MARKET_AUTO_LOAN_RATE,
        benchmarkLabel: "FRED new-car avg",
        format:         "number",
        caption:        rateLiveCaption,
      } satisfies InsightVisualization,
    });
  } else if (rateDiff <= -RATE_BELOW_MARKET_THRESHOLD) {
    insights.push({
      id:       "carloan.rate-below-market",
      category: "savings",
      severity: "positive",
      title:    `Below-market rate — ${Math.abs(rateDiff).toFixed(1)} points under the ${MARKET_AUTO_LOAN_RATE}% average`,
      body:     `At ${inputs.interestRate.toFixed(1)}%, your rate is ${Math.abs(rateDiff).toFixed(1)} points below the current FRED new-car average of ${MARKET_AUTO_LOAN_RATE}%. You're minimizing the cost of financing — a strong position, often from a credit union or manufacturer promo rate.`,
      metric:   { label: "Below market", value: `-${Math.abs(rateDiff).toFixed(1)}%` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      Math.round(inputs.interestRate * 10) / 10,
        userLabel:      "Your APR",
        benchmarkValue: MARKET_AUTO_LOAN_RATE,
        benchmarkLabel: "FRED new-car avg",
        format:         "number",
        caption:        rateLiveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── Rule 3: Long loan term warning ────────────────────────────────────────
  if (inputs.termMonths >= LONG_TERM_MONTHS) {
    const termYears = Math.round(inputs.termMonths / 12);
    insights.push({
      id:       "carloan.long-term",
      category: "warning",
      severity: "warning",
      title:    `${termYears}-year loan — depreciation risk`,
      body:     `Loans of 72 months or longer keep you paying interest long after the car has lost most of its value. Most vehicles drop 40–60% in their first 5 years, so a ${termYears}-year loan can leave you underwater — owing more than the car is worth — making it hard to sell or trade.`,
      metric:   { label: "Loan term", value: `${termYears} years` },
    });
  }

  // ── Rule 4: Interest burden ────────────────────────────────────────────────
  if (outputs.interestPct >= INTEREST_HEAVY_THRESHOLD) {
    insights.push({
      id:       "carloan.interest-heavy",
      category: "spending",
      severity: "neutral",
      title:    `${formatCurrency(outputs.totalInterest)} paid in interest on top of the car`,
      body:     `${outputs.interestPct.toFixed(1)}% of every dollar you pay goes to interest — ${formatCurrency(outputs.totalInterest)} total. A larger down payment or a shorter term cuts this fast: knocking a year off the term typically saves hundreds.`,
      metric:   { label: "Total interest cost", value: formatCurrency(outputs.totalInterest) },
      visualization: {
        type:   "delta-card",
        before: { label: "Out-the-door price", value: formatCurrency(Math.round(outputs.outTheDoorPrice)) },
        after:  { label: "Total cash paid",    value: formatCurrency(outputs.totalCost) },
        delta:  { label: "Interest added",      value: formatCurrency(outputs.totalInterest), positive: false },
      } satisfies InsightVisualization,
    });
  }

  // ── Rule 5: Down payment adequacy ─────────────────────────────────────────
  if (downPaymentRatio < LOW_DOWN_PAYMENT_THRESHOLD) {
    insights.push({
      id:       "carloan.low-down-payment",
      category: "warning",
      severity: "neutral",
      title:    `${downPaymentRatio.toFixed(1)}% down — below the recommended 10–20%`,
      body:     `Starting with minimal equity means you're immediately underwater once the car depreciates off the lot. Advisors typically recommend 20% down to avoid this and reduce both your payment and total interest.`,
      metric:   { label: "Down payment", value: `${downPaymentRatio.toFixed(1)}%` },
    });
  } else if (downPaymentRatio >= STRONG_DOWN_PAYMENT_THRESHOLD) {
    insights.push({
      id:       "carloan.strong-down-payment",
      category: "savings",
      severity: "positive",
      title:    `Strong ${downPaymentRatio.toFixed(1)}% down payment`,
      body:     `Putting ${downPaymentRatio.toFixed(1)}% down on a ${formatCurrency(inputs.vehiclePrice)} vehicle gives you immediate equity, a lower payment, and protection against going underwater as the car depreciates.`,
      metric:   { label: "Down payment", value: `${downPaymentRatio.toFixed(1)}%` },
    });
  }

  // ── Rule 6: Investment opportunity cost ───────────────────────────────────
  const annualContrib   = outputs.annualPaymentBurden ?? Math.round(outputs.monthlyPayment * 12);
  const termYears       = inputs.termMonths / 12;
  const opportunityFV   = Math.round(futureValueAnnuity(annualContrib, termYears));
  const opportunityGain = opportunityFV - annualContrib * termYears;

  if (opportunityGain > 2_000) {
    insights.push({
      id:       "carloan.opportunity-cost",
      category: "opportunity-cost",
      severity: "neutral",
      title:    `${formatCurrency(outputs.monthlyPayment)}/month invested for ${Math.round(termYears)} years = ${formatCurrency(opportunityFV)}`,
      body:     `${formatCurrency(outputs.monthlyPayment)}/month invested in an index fund at 7% for ${Math.round(termYears)} years would grow to ${formatCurrency(opportunityFV)}. This is the full financial weight of the commitment — context, not an argument against buying.`,
      metric:   { label: `${Math.round(termYears)}-yr investment value`, value: formatCurrency(opportunityFV) },
      visualization: {
        type:   "projection-line",
        points: Array.from({ length: Math.min(Math.ceil(termYears), 10) }, (_, i) => i + 1).map((yr) => ({
          label: `Yr ${yr}`,
          value: Math.round(futureValueAnnuity(annualContrib, yr)),
        })),
        format: "currency",
        yLabel: "Invested value",
        color:  "#10b981",
      } satisfies InsightVisualization,
    });
  }

  return insights;
}
