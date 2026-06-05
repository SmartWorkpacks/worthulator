import type { Insight } from "../types";
import { formatCurrency } from "../benchmarks";
import { futureValueAnnuity } from "../projections";

interface WeddingCostInputs {
  guests:       number;
  costPerGuest: number;
  venue:        number;
  photography:  number;
  misc:         number;
}

interface WeddingCostOutputs {
  total?:               number;
  allInPerGuest?:       number;
  cateringTotal?:       number;
  nonCateringTotal?:    number;
  investedAlternative?: number;
}

// The Knot 2023 Real Weddings Study: US average wedding cost $35,000.
// Breakdown: venue ~31%, catering ~29%, photography ~10%, music ~8%.
// Average US wedding guest count: 117 (The Knot 2023).

const NATIONAL_AVG = 35_000;

export function weddingCostInsights(
  inputs: WeddingCostInputs,
  outputs: WeddingCostOutputs,
): Insight[] {
  const results: Insight[] = [];

  const guests      = Number(inputs.guests);
  const venue       = Number(inputs.venue);
  const photography = Number(inputs.photography);
  const total       = outputs.total               ?? 0;
  const perGuest    = outputs.allInPerGuest       ?? 0;
  const catering    = outputs.cateringTotal       ?? 0;
  const nonCatering = outputs.nonCateringTotal    ?? 0;
  const invested    = outputs.investedAlternative ?? Math.round(futureValueAnnuity(total, 10));

  const cateringPct = total > 0 ? Math.round((catering / total) * 100) : 0;
  const venuePct    = total > 0 ? Math.round((venue / total) * 100) : 0;
  const photoPct    = total > 0 ? Math.round((photography / total) * 100) : 0;

  // 1. National average comparison — always shown
  const vsAvg = total - NATIONAL_AVG;
  results.push({
    id:       "wedding.vs-national",
    severity: total <= NATIONAL_AVG ? "positive" : "neutral",
    category: "comparison",
    title:    `${formatCurrency(total)} — ${vsAvg >= 0 ? `${formatCurrency(vsAvg)} above` : `${formatCurrency(Math.abs(vsAvg))} below`} the $35,000 US average (The Knot 2023)`,
    body:     `The Knot's 2023 Real Weddings Study reports the US average wedding cost at $35,000 across 117 guests. Your ${guests}-guest wedding at ${formatCurrency(total)} works out to ${formatCurrency(perGuest)} per person all-in.`,
    metric:   { label: "All-in cost per guest", value: formatCurrency(perGuest) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      total,
      userLabel:      "Your wedding",
      benchmarkValue: NATIONAL_AVG,
      benchmarkLabel: "US average (The Knot)",
      format:         "currency",
    },
  });

  // 2. Catering vs fixed split — leverage insight
  if (total > 0) {
    results.push({
      id:       "wedding.catering-split",
      severity: "neutral",
      category: "spending",
      title:    `Catering is ${cateringPct}% of budget — ${cateringPct > 50 ? "guest list is the #1 budget lever" : "fixed costs dominate — venue is the primary lever"}`,
      body:     `At ${cateringPct}% catering (${formatCurrency(catering)}) vs ${100 - cateringPct}% fixed costs (${formatCurrency(nonCatering)}): ${cateringPct > 50 ? `cutting 20 guests saves ${formatCurrency(Math.round(perGuest * 20))} at your current per-head cost` : `off-peak venue dates (Fridays, Sundays, Jan–March) typically reduce venue costs by 20–40%`}.`,
      metric:   { label: "Catering share", value: `${cateringPct}%` },
    });
  }

  // 3. Venue concentration
  if (venuePct > 30) {
    results.push({
      id:       "wedding.venue-heavy",
      severity: "neutral",
      category: "spending",
      title:    `Venue is ${venuePct}% of budget at ${formatCurrency(venue)} — above the typical 20–25%`,
      body:     `The Knot reports venue accounts for approximately 31% of average wedding spend. Off-peak bookings (non-Saturday, January–March, Sunday mornings) can reduce venue fees by 20–40% with no practical difference to the guest experience.`,
      metric:   { label: "Venue share", value: `${venuePct}%` },
    });
  }

  // 4. Invested alternative
  if (total > 10_000) {
    results.push({
      id:       "wedding.invested-alternative",
      severity: "neutral",
      category: "opportunity-cost",
      title:    `${formatCurrency(total)} invested at 7% becomes ${formatCurrency(invested)} in 10 years`,
      body:     `The opportunity cost of ${formatCurrency(total)} in wedding spending is ${formatCurrency(invested)} in 10 years if invested in an index fund at 7%. Over a 30-year horizon, the same amount grows to ${formatCurrency(Math.round(total * Math.pow(1.07, 30)))}.`,
      metric:   { label: "10-year invested value", value: formatCurrency(invested) },
    });
  }

  // 5. Photography check
  if (photoPct > 0 && photoPct < 8 && photography > 0) {
    results.push({
      id:       "wedding.photo-underweight",
      severity: "neutral",
      category: "spending",
      title:    `Photography is ${photoPct}% of budget — The Knot reports couples most commonly say they'd spend more on it in hindsight`,
      body:     `Venue, food, and floral arrangements are experienced once. Photography is experienced on every anniversary, in every shared album, for decades. The Knot's 2023 survey found photography among the top items couples wished they had allocated more to.`,
      metric:   { label: "Photography allocation", value: `${photoPct}%` },
    });
  }

  return results;
}
