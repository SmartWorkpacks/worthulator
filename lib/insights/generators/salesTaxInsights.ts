// ─── Sales Tax Insight Generator ─────────────────────────────────────────────
//
// Produces live WorthCore insights for the sales-tax calculator.
// Called on every slider change via LiveInsightBlock → GENERATOR_REGISTRY.
//
// Rules:
//   salestax.annual-burden        — always — frames annual tax cost
//   salestax.above-national       — rate > 7.12% → warning
//   salestax.below-national       — rate < 7.12% and > 0 → positive
//   salestax.no-tax               — rate === 0 → positive
//   salestax.high-annual-burden   — annualTaxBurden > 700 → warning
//   salestax.large-purchase       — price > 1000 → neutral
//   salestax.investment-framing   — annualTaxBurden > 300 → opportunity framing
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight } from "@/lib/insights/types";
import { futureValueAnnuity } from "@/lib/insights/projections";

export interface SalesTaxInputs {
  price:        number; // single purchase price ($)
  taxRate:      number; // effective rate (%)
  monthlySpend: number; // monthly taxable spend ($)
}

export interface SalesTaxOutputs {
  totalPrice:       number;
  taxAmount:        number;
  monthlyTaxBurden: number;
  annualTaxBurden:  number;
}

const NATIONAL_AVG = 7.12; // Tax Foundation 2026

export function generateSalesTaxInsights(
  inputs:  SalesTaxInputs,
  outputs: SalesTaxOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { price, taxRate, monthlySpend } = inputs;
  const { taxAmount, monthlyTaxBurden, annualTaxBurden } = outputs;

  const annualRounded   = Math.round(annualTaxBurden);
  const monthlyRounded  = Math.round(monthlyTaxBurden);

  // ── 1. Annual burden framing (always shown) ───────────────────────────────
  if (monthlySpend > 0 && annualRounded > 0) {
    insights.push({
      id:       "salestax.annual-burden",
      type:     "neutral",
      title:    `You pay ~$${annualRounded.toLocaleString()} in sales tax per year`,
      body:     `At ${taxRate}% on $${monthlySpend.toLocaleString()}/month of taxable purchases, that's $${monthlyRounded.toLocaleString()} every month — $${annualRounded.toLocaleString()} a year quietly leaving your wallet at checkout.`,
      priority: 100,
    });
  }

  // ── 2. Above national average ─────────────────────────────────────────────
  if (taxRate > NATIONAL_AVG) {
    const diff = (taxRate - NATIONAL_AVG).toFixed(2);
    insights.push({
      id:       "salestax.above-national",
      type:     "warning",
      title:    `Your rate is ${diff}% above the US average`,
      body:     `The national average combined sales tax is ${NATIONAL_AVG}%. Your ${taxRate}% rate adds an extra $${((taxRate - NATIONAL_AVG) / 100 * (monthlySpend * 12)).toFixed(0)} per year compared to an average-rate state.`,
      priority: 90,
    });
  }

  // ── 3. Below national average ─────────────────────────────────────────────
  if (taxRate > 0 && taxRate < NATIONAL_AVG) {
    const saving = Math.round((NATIONAL_AVG - taxRate) / 100 * (monthlySpend * 12));
    insights.push({
      id:       "salestax.below-national",
      type:     "positive",
      title:    `Your rate is below the US average — you save ~$${saving.toLocaleString()}/yr`,
      body:     `At ${taxRate}%, you pay less than the ${NATIONAL_AVG}% national average. Compared to a typical higher-tax state, that's roughly $${saving.toLocaleString()} a year staying in your pocket.`,
      priority: 90,
    });
  }

  // ── 4. No sales tax ───────────────────────────────────────────────────────
  if (taxRate === 0) {
    const saving = Math.round(NATIONAL_AVG / 100 * (monthlySpend * 12));
    insights.push({
      id:       "salestax.no-tax",
      type:     "positive",
      title:    `No sales tax — you save ~$${saving.toLocaleString()}/yr vs the US average`,
      body:     `You're in a no-sales-tax state. Against the ${NATIONAL_AVG}% national average, that's roughly $${saving.toLocaleString()} a year in savings — just from where you shop.`,
      priority: 95,
    });
  }

  // ── 5. High annual burden warning ─────────────────────────────────────────
  if (annualRounded > 700 && monthlySpend > 0) {
    const tenYear = Math.round(futureValueAnnuity(annualTaxBurden / 12, 7, 10));
    insights.push({
      id:       "salestax.high-annual-burden",
      type:     "warning",
      title:    `$${annualRounded.toLocaleString()}/yr in sales tax is significant`,
      body:     `If that money were invested instead — $${monthlyRounded.toLocaleString()}/month at 7% — it would grow to roughly $${tenYear.toLocaleString()} over 10 years.`,
      priority: 80,
    });
  }

  // ── 6. Large purchase notice ──────────────────────────────────────────────
  if (price >= 1000) {
    insights.push({
      id:       "salestax.large-purchase",
      type:     "neutral",
      title:    `On a $${price.toLocaleString()} purchase, tax alone is $${Math.round(taxAmount).toLocaleString()}`,
      body:     `For big-ticket items — electronics, appliances, furniture — state sales tax matters. A 1-point rate difference on a $${price.toLocaleString()} purchase saves $${(price * 0.01).toFixed(0)}.`,
      priority: 70,
    });
  }

  // ── 7. Investment opportunity framing ─────────────────────────────────────
  if (annualRounded >= 300 && annualRounded <= 700 && monthlySpend > 0) {
    const tenYear = Math.round(futureValueAnnuity(annualTaxBurden / 12, 7, 10));
    insights.push({
      id:       "salestax.investment-framing",
      type:     "neutral",
      title:    `$${annualRounded.toLocaleString()}/yr invested would be $${tenYear.toLocaleString()} in 10 years`,
      body:     `You're paying $${annualRounded.toLocaleString()} a year in sales tax. Redirected into a simple index fund at 7%, that grows to $${tenYear.toLocaleString()} over a decade — just one way to frame it.`,
      priority: 60,
    });
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
