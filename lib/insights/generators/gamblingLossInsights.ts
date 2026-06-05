import type { Insight } from "../types";
import { futureValueAnnuity } from "../projections";
import { formatCurrency } from "../benchmarks";

interface GamblingInputs {
  weeklySpend: number;
  years:       number;
}

interface GamblingOutputs {
  totalLoss?:            number;
  investedValue?:        number;
  opportunityCost?:      number;
  weeklyInMonthlyTerms?: number;
  dailyCost?:            number;
  returnMultiple?:       number;
}

// House edge data by game type — standard industry figures
// Slots: 5–15% edge (avg 8%). Roulette: 5.26% (American). Blackjack: 0.5–2% (varies by play).
// Sports betting: 4–5% vig. Lottery: ~47% edge.
const SLOT_HOUSE_EDGE      = 0.08;
const SPORTS_HOUSE_EDGE    = 0.045;
const LOTTERY_HOUSE_EDGE   = 0.47;

export function gamblingLossInsights(
  inputs: GamblingInputs,
  outputs: GamblingOutputs,
): Insight[] {
  const results: Insight[] = [];

  const weekly   = Number(inputs.weeklySpend);
  const years    = Number(inputs.years);
  const total    = outputs.totalLoss    ?? Math.round(weekly * 52 * years);
  const invested = outputs.investedValue ?? Math.round(futureValueAnnuity(weekly * 52, years));
  const daily    = outputs.dailyCost    ?? Math.round(weekly / 7 * 100) / 100;

  if (weekly <= 0) return results;

  const annual            = Math.round(weekly * 52);
  const expectedSlotLoss  = Math.round(annual * SLOT_HOUSE_EDGE);
  const expectedSportLoss = Math.round(annual * SPORTS_HOUSE_EDGE);
  const invested10yr      = Math.round(futureValueAnnuity(annual, 10));
  const investGain        = invested - total;

  // 1. The math of the house edge — the central fact
  results.push({
    id:       "gambling.house-edge",
    severity: "neutral",
    category: "hidden-cost",
    title:    `The house edge is built into every session`,
    body:     `Slot machines return 88–95 cents per dollar wagered on average — a 5–12% house edge by design. Sports betting platforms take a 4–5% margin on every bet. At ${formatCurrency(weekly)}/week, the expected long-run extraction is ${formatCurrency(expectedSportLoss)}–${formatCurrency(expectedSlotLoss)} per year, regardless of short-term wins or losses.`,
    metric:   { label: "Expected annual extraction", value: `${formatCurrency(expectedSportLoss)}–${formatCurrency(expectedSlotLoss)}` },
    visualization: {
      type:           "benchmark-bar",
      userValue:      annual,
      userLabel:      "You wager/year",
      benchmarkValue: annual - expectedSlotLoss,
      benchmarkLabel: "Expected return",
      format:         "currency",
    },
  });

  // 2. Total over time vs invested alternative
  if (total > 0) {
    results.push({
      id:       "gambling.total-vs-invested",
      severity: "neutral",
      category: "opportunity-cost",
      title:    `${formatCurrency(total)} spent over ${years} years`,
      body:     `${formatCurrency(weekly)}/week for ${years} years is ${formatCurrency(total)} in total wagers. The same amount invested in an index fund at 7% would be ${formatCurrency(invested)} — a difference of ${formatCurrency(investGain)}.`,
      metric:   { label: `${years}-year invested value`, value: formatCurrency(invested) },
      visualization: {
        type:   "delta-card",
        before: { label: "Total wagered",           value: formatCurrency(total) },
        after:  { label: "Invested instead",         value: formatCurrency(invested) },
        delta:  { label: "Difference",               value: formatCurrency(investGain), positive: true },
      },
    });
  }

  // 3. Daily framing
  if (daily > 0) {
    results.push({
      id:       "gambling.daily",
      severity: "neutral",
      category: "spending",
      title:    `${formatCurrency(daily)}/day, every day`,
      body:     `${formatCurrency(weekly)}/week averages to ${formatCurrency(daily)} a day across all 365 days of the year — including days without a single wager. Over 10 years: ${formatCurrency(invested10yr)} invested at 7%.`,
      metric:   { label: "Daily cost (annual avg)", value: formatCurrency(daily) },
    });
  }

  // 4. Escalation risk at higher spend
  if (weekly >= 100) {
    results.push({
      id:       "gambling.escalation",
      severity: "warning",
      category: "warning",
      title:    `Problem gambling affects around 1–3% of adults`,
      body:     `At ${formatCurrency(weekly)}/week, gambling is a significant financial commitment. Problem gambling is characterised by increasing spend over time, chasing losses, and difficulty reducing frequency. The National Problem Gambling Helpline is 1-800-522-4700.`,
      metric:   { label: "Annual spend", value: formatCurrency(annual) },
    });
  }

  return results;
}
