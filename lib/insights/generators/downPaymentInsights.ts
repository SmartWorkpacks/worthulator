import type { Insight } from "../types";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";
import { HYSA_APY } from "@/lib/calculators/emergencyFundEngine";

export interface DownPaymentInputs {
  homePrice: number;
  downPct: number;
  currentSaved: number;
  months: number;
  appreciationPct?: number;
  /** Optional user-entered HYSA APY (%); when > 0 it overrides the live average. */
  hysaApyOverride?: number;
  /** Optional user-entered closing-cost rate (%); when > 0 it overrides the ~3% estimate. */
  closingCostPct?: number;
}

export interface DownPaymentOutputs {
  monthlySavings: number;
  targetDown: number;
  remaining: number;
  progressPercent?: number;
  fasterMonthsWith200?: number;
  opportunityCostOfWaiting?: number;
  // Flagship module outputs
  monthlyNoInterest?: number;
  monthlyInterestSavings?: number;
  targetDownToday?: number;
  appreciationGap?: number;
  futureHomePrice?: number;
  interestEarned?: number;
  closingCosts?: number;
  cashToClose?: number;
  avoidsPMI?: number;
  pmiShortfall?: number;
  realTargetDown?: number;
}

const CPI_CAPTION = {
  text: `Inflation-adjusted with ${fredBenchmarks.cpiInflationYoY}% CPI (FRED ${fredBenchmarks.currentPeriodLabel})`,
  asOf: fredBenchmarks.currentPeriodLabel,
  live: true,
};

export function generateDownPaymentInsights(
  inputs: DownPaymentInputs,
  outputs: DownPaymentOutputs,
): Insight[] {
  const insights: Insight[] = [];
  const { homePrice, downPct, months } = inputs;
  const {
    monthlySavings,
    targetDown,
    remaining,
    progressPercent = inputs.currentSaved > 0 ? (inputs.currentSaved / targetDown) * 100 : 0,
    monthlyNoInterest,
    monthlyInterestSavings = 0,
    targetDownToday,
    appreciationGap = 0,
    futureHomePrice,
    interestEarned = 0,
    closingCosts,
    cashToClose,
    avoidsPMI,
    pmiShortfall = 0,
    realTargetDown,
  } = outputs;

  const yearsToGoal = Math.round((months / 12) * 10) / 10;
  const effApy = (inputs.hysaApyOverride ?? 0) > 0 ? (inputs.hysaApyOverride as number) : HYSA_APY;
  const effClosingPct = (inputs.closingCostPct ?? 0) > 0 ? (inputs.closingCostPct as number) : 3;

  // ── 1. The moving target — appreciation (delta-card) ──────────────────────
  if (targetDownToday !== undefined && appreciationGap > 0 && futureHomePrice !== undefined) {
    insights.push({
      id: "down-payment.moving-target",
      title: `Your target is a moving target — $${targetDown.toLocaleString()} at purchase, not $${targetDownToday.toLocaleString()}`,
      body: `At ${inputs.appreciationPct ?? 4}% annual appreciation, your $${homePrice.toLocaleString()} home is projected to cost about $${futureHomePrice.toLocaleString()} in ${yearsToGoal} year${yearsToGoal !== 1 ? "s" : ""}. A ${downPct}% down payment on that higher price is $${targetDown.toLocaleString()} — $${appreciationGap.toLocaleString()} more than today's figure. Saving toward the static number leaves you short.`,
      severity: "warning",
      category: "hidden-cost",
      metric: { label: "Appreciation gap", value: `$${appreciationGap.toLocaleString()}` },
      visualization: {
        type: "delta-card",
        before: { label: "Down payment today", value: `$${targetDownToday.toLocaleString()}` },
        after: { label: "At purchase", value: `$${targetDown.toLocaleString()}` },
        delta: { label: "Extra from appreciation", value: `$${appreciationGap.toLocaleString()}`, positive: false },
      },
    });
  }

  // ── 2. HYSA interest does part of the saving (benchmark-bar) ──────────────
  if (monthlyNoInterest !== undefined && monthlyInterestSavings > 0) {
    insights.push({
      id: "down-payment.hysa-interest",
      title: `A ${effApy}% HYSA cuts your monthly target to $${monthlySavings.toLocaleString()}`,
      body: `Parking your savings in a high-yield account at ${effApy}% APY earns about $${interestEarned.toLocaleString()} over ${months} months — so you only need $${monthlySavings.toLocaleString()}/month instead of $${monthlyNoInterest.toLocaleString()} in a 0% account. That's $${monthlyInterestSavings.toLocaleString()}/month the bank contributes for you.`,
      severity: "positive",
      category: "investment-opportunity",
      metric: { label: "Interest earned", value: `$${interestEarned.toLocaleString()}` },
      visualization: {
        type: "benchmark-bar",
        userValue: monthlySavings,
        userLabel: `HYSA at ${effApy}%`,
        benchmarkValue: monthlyNoInterest,
        benchmarkLabel: "0% account",
        format: "currency",
      },
    });
  }

  // ── 3. Cash to close — closing costs (donut) ──────────────────────────────
  if (closingCosts !== undefined && cashToClose !== undefined) {
    insights.push({
      id: "down-payment.cash-to-close",
      title: `Budget $${cashToClose.toLocaleString()} cash to close — not just the down payment`,
      body: `Beyond the $${targetDown.toLocaleString()} down payment, expect roughly $${closingCosts.toLocaleString()} in closing costs (~${effClosingPct}% of the price) — lender fees, title, escrow, and prepaids. Many buyers forget this and come up short at the table.`,
      severity: "neutral",
      category: "hidden-cost",
      metric: { label: "Closing costs", value: `$${closingCosts.toLocaleString()}` },
      visualization: {
        type: "donut",
        segments: [
          { label: "Down payment", value: targetDown, color: "#10b981" },
          { label: "Closing costs", value: closingCosts, color: "#f59e0b" },
        ],
        centerLabel: `$${cashToClose.toLocaleString()}`,
        format: "currency",
      },
    });
  }

  // ── 4. Timeline framing — always fires ────────────────────────────────────
  insights.push({
    id: "down-payment.timeline-framing",
    title: `${yearsToGoal} year${yearsToGoal !== 1 ? "s" : ""} until you can make your offer`,
    body: `At $${monthlySavings.toLocaleString()}/month, you'll hit your $${targetDown.toLocaleString()} down payment target in ${months} months — buying a $${homePrice.toLocaleString()} home with ${downPct}% down in ${yearsToGoal} year${yearsToGoal !== 1 ? "s" : ""}.`,
    severity: months <= 24 ? "positive" : "neutral",
    category: "affordability-pressure",
  });

  // ── 5. Today's-dollars value of the target (delta-card, live CPI) ─────────
  if (realTargetDown !== undefined && realTargetDown < targetDown) {
    insights.push({
      id: "down-payment.real-value",
      title: `That $${targetDown.toLocaleString()} target is about $${realTargetDown.toLocaleString()} in today's money`,
      body: `Inflation cuts both ways: the $${targetDown.toLocaleString()} you'll need at purchase is worth roughly $${realTargetDown.toLocaleString()} in today's dollars at ${fredBenchmarks.cpiInflationYoY}% CPI. The nominal number looks bigger, but a chunk of the increase is just the dollar losing value.`,
      severity: "neutral",
      category: "benchmark-comparison",
      metric: { label: "In today's dollars", value: `$${realTargetDown.toLocaleString()}` },
      visualization: {
        type: "delta-card",
        before: { label: "Nominal target", value: `$${targetDown.toLocaleString()}` },
        after: { label: "Today's dollars", value: `$${realTargetDown.toLocaleString()}` },
        delta: { label: "Inflation erosion", value: `$${(targetDown - realTargetDown).toLocaleString()}`, positive: true },
        caption: CPI_CAPTION,
      },
    });
  }

  // ── 6. Progress milestone ─────────────────────────────────────────────────
  if (progressPercent > 0 && progressPercent < 100) {
    insights.push({
      id: "down-payment.progress-milestone",
      title: `You're ${progressPercent.toFixed(1)}% of the way there`,
      body: `You've saved $${inputs.currentSaved.toLocaleString()} of your $${targetDown.toLocaleString()} goal — ${progressPercent.toFixed(1)}% complete, $${remaining.toLocaleString()} to go.`,
      severity: progressPercent >= 50 ? "positive" : "neutral",
      category: "benchmark-comparison",
    });
  }

  // ── 7. PMI framing ────────────────────────────────────────────────────────
  if (avoidsPMI === 0 || downPct < 20) {
    insights.push({
      id: "down-payment.pmi-warning",
      title: `PMI required — ${downPct}% is below the 20% threshold`,
      body: `With ${downPct}% down, you'll likely pay PMI — typically $50–$200/month until you reach 20% equity. Saving $${pmiShortfall.toLocaleString()} more to hit 20% down eliminates this ongoing cost permanently.`,
      severity: "warning",
      category: "hidden-cost",
    });
  } else {
    insights.push({
      id: "down-payment.no-pmi",
      title: "20%+ down — no PMI required",
      body: `Putting ${downPct}% down keeps you above the 20% threshold, eliminating PMI entirely and saving you $50–$200/month from day one of ownership.`,
      severity: "positive",
      category: "opportunity-cost",
    });
  }

  return insights;
}
