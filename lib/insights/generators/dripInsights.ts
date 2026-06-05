// ─── DRIP (Dividend Reinvestment) Insight Generator ─────────────────────────
//
// Produces live WorthCore insights for the drip-calculator.
// Called on every slider change via LiveInsightBlock → GENERATOR_REGISTRY.
//
// Rules:
//   drip.gains-exceed-deposits — totalGain > totalContributed → positive
//   drip.strong-multiplier     — returnMultiple > 3 → positive
//   drip.annual-income         — shows projected annual dividend income → neutral
//   drip.double-time           — shows years to double at current rate → neutral
//   drip.low-yield             — dividendYield < 2% → neutral (below S&P avg)
//   drip.long-horizon-reward   — years >= 25 → positive (time is the engine)
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight } from "@/lib/insights/types";
import { futureValueAnnuity } from "@/lib/insights/projections";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

export interface DripInputs {
  initial:       number;   // $
  monthlyAdd:    number;   // $/month
  dividendYield: number;   // %
  priceGrowth:   number;   // %
  years:         number;   // years
}

export interface DripOutputs {
  finalValue:       number;
  totalContributed: number;
  totalGain:        number;
  returnMultiple?:      number;
  annualDividendAtEnd?: number;
  doubleTimeYears?:     number;
  reinvestedDividends?: number;
  noReinvestValue?:     number;
  dripAdvantage?:       number;
  realValue?:           number;
}

const CPI_CAPTION = {
  text: `Deflated by US CPI ${fredBenchmarks.cpiInflationYoY}% YoY (FRED ${fredBenchmarks.currentPeriodLabel})`,
  asOf: fredBenchmarks.currentPeriodLabel,
  live: true,
};

export function generateDripInsights(
  inputs:  DripInputs,
  outputs: DripOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { initial, monthlyAdd, dividendYield, priceGrowth, years } = inputs;
  const {
    finalValue,
    totalContributed,
    totalGain,
    returnMultiple      = totalContributed > 0 ? finalValue / totalContributed : 1,
    annualDividendAtEnd = Math.round(finalValue * dividendYield / 100),
    doubleTimeYears     = (dividendYield + priceGrowth) > 0
      ? Math.round(72 / (dividendYield + priceGrowth) * 10) / 10
      : 0,
    dripAdvantage,
    noReinvestValue,
    realValue,
  } = outputs;

  // ── 0. The DRIP advantage — reinvesting vs taking cash (benchmark-bar) ─────
  if (dripAdvantage !== undefined && noReinvestValue !== undefined && dripAdvantage > 0) {
    insights.push({
      id:       "drip.advantage",
      severity: "positive",
      category: "investment",
      title:    `Reinvesting dividends adds $${dripAdvantage.toLocaleString()} over ${years} years`,
      body:     `This is the whole point of DRIP. Reinvest every dividend and you finish at $${finalValue.toLocaleString()}; take those same dividends as cash and leave them uninvested and you'd have about $${noReinvestValue.toLocaleString()}. The $${dripAdvantage.toLocaleString()} gap is dividends buying shares that then pay their own dividends — compounding on compounding.`,
      metric:   { label: "DRIP advantage", value: `$${dripAdvantage.toLocaleString()}` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      finalValue,
        userLabel:      "Reinvested (DRIP)",
        benchmarkValue: noReinvestValue,
        benchmarkLabel: "Dividends as cash",
        format:         "currency",
      },
    });
  }

  // ── 1. Gains exceed deposits ─────────────────────────────────────────────
  if (totalGain > totalContributed) {
    insights.push({
      id:       "drip.gains-exceed-deposits",
      severity: "positive",
      category: "investment",
      title:    `$${totalGain.toLocaleString()} in compound growth — more than the $${totalContributed.toLocaleString()} you invested`,
      body:     `After ${years} years, your total growth of $${totalGain.toLocaleString()} exceeds everything you put in. Reinvested dividends and price appreciation together now outweigh your own contributions. That ratio keeps improving the longer the investment runs.`,
      metric:   { label: "Growth above contributions", value: `$${totalGain.toLocaleString()}` },
      visualization: {
        type:   "delta-card",
        before: { label: "Total contributed",    value: `$${totalContributed.toLocaleString()}` },
        after:  { label: "Final portfolio value", value: `$${finalValue.toLocaleString()}` },
        delta:  { label: "Compound growth",       value: `$${totalGain.toLocaleString()}`, positive: true },
      },
    });
  }

  // ── 2. Strong return multiple ────────────────────────────────────────────
  if (returnMultiple >= 3) {
    insights.push({
      id:       "drip.strong-multiplier",
      severity: "positive",
      category: "investment",
      title:    `${returnMultiple.toFixed(1)}× return — $${totalContributed.toLocaleString()} becomes $${finalValue.toLocaleString()}`,
      body:     `Your $${totalContributed.toLocaleString()} grows to $${finalValue.toLocaleString()} — a ${returnMultiple.toFixed(1)}× multiple. DRIP investing's power comes from dividend reinvestment compounding on top of price growth every single month — each reinvested dividend buys shares that themselves pay future dividends.`,
      metric:   { label: "Return multiple", value: `${returnMultiple.toFixed(1)}×` },
    });
  } else if (returnMultiple >= 1.5) {
    insights.push({
      id:       "drip.moderate-multiplier",
      severity: "neutral",
      category: "investment",
      title:    `${returnMultiple.toFixed(1)}× your invested capital over ${years} years`,
      body:     `A ${returnMultiple.toFixed(1)}× return means your $${totalContributed.toLocaleString()} becomes $${finalValue.toLocaleString()}. Extending the horizon or increasing monthly contributions pushes this multiple significantly higher — compound returns are non-linear.`,
      metric:   { label: "Return multiple", value: `${returnMultiple.toFixed(1)}×` },
    });
  }

  // ── 3. Annual dividend income at maturity ────────────────────────────────
  if (annualDividendAtEnd > 0) {
    insights.push({
      id:       "drip.annual-income",
      severity: "neutral",
      category: "investment",
      title:    `At ${years} years, the portfolio pays $${annualDividendAtEnd.toLocaleString()}/year in dividends`,
      body:     `A ${dividendYield}% yield on a $${finalValue.toLocaleString()} portfolio generates $${annualDividendAtEnd.toLocaleString()} annually — $${Math.round(annualDividendAtEnd / 12).toLocaleString()}/month — without selling a single share. That is passive income that persists as long as the underlying companies keep paying dividends.`,
      metric:   { label: "Annual dividend income", value: `$${annualDividendAtEnd.toLocaleString()}` },
    });
  }

  // ── 4. Double time ───────────────────────────────────────────────────────
  if (doubleTimeYears > 0) {
    insights.push({
      id:       "drip.double-time",
      severity: "neutral",
      category: "projection",
      title:    `At ${dividendYield + priceGrowth}% combined return, money doubles every ~${doubleTimeYears} years`,
      body:     `The Rule of 72: divide 72 by your annual return to estimate years to double. At ${dividendYield + priceGrowth}% (${dividendYield}% yield + ${priceGrowth}% growth), the portfolio doubles roughly every ${doubleTimeYears} years — meaning it could double ${Math.floor(years / doubleTimeYears)} time${Math.floor(years / doubleTimeYears) !== 1 ? "s" : ""} over this horizon.`,
      metric:   { label: "Years to double", value: `${doubleTimeYears}yr` },
      visualization: {
        type:   "projection-line",
        points: [5, 10, 15, 20, Math.min(years, 30)].filter((y, i, a) => a.indexOf(y) === i && y <= years).sort((a, b) => a - b).map((yr) => ({
          label: `Yr ${yr}`,
          value: Math.round(initial * Math.pow(1 + (dividendYield + priceGrowth) / 100, yr) + futureValueAnnuity(monthlyAdd * 12, yr, dividendYield + priceGrowth)),
        })),
        format: "currency",
        yLabel: "Portfolio value",
        color:  "#10b981",
      },
    });
  }

  // ── 5. Low yield ─────────────────────────────────────────────────────────
  if (dividendYield < 2) {
    insights.push({
      id:       "drip.low-yield",
      severity: "neutral",
      category: "comparison",
      title:    `${dividendYield}% dividend yield — below the S&P 500 average of ~1.3–1.5%`,
      body:     `At ${dividendYield}% you are relying more on price appreciation than dividends for total return. High-dividend ETFs like SCHD or VYM typically yield 3–4% while maintaining meaningful price growth — a higher DRIP compounding rate without taking on individual stock risk.`,
      metric:   { label: "Your dividend yield", value: `${dividendYield}%` },
    });
  }

  // ── 6. Long horizon reward ───────────────────────────────────────────────
  if (years >= 25) {
    const initialCompound = Math.round(initial * Math.pow(1 + (dividendYield + priceGrowth) / 100, years));
    insights.push({
      id:       "drip.long-horizon",
      severity: "positive",
      category: "projection",
      title:    `${years} years gives compounding serious room to accelerate`,
      body:     `Your $${initial.toLocaleString()} initial investment alone compounds to $${initialCompound.toLocaleString()} over ${years} years — before counting a single monthly contribution. Time is the most powerful input in any compound growth calculation.`,
      metric:   { label: "Initial investment after compounding", value: `$${initialCompound.toLocaleString()}` },
    });
  }

  // ── 7. Real (today's-dollars) value — live CPI ───────────────────────────
  if (realValue !== undefined && realValue > 0) {
    const drag = finalValue - realValue;
    insights.push({
      id:       "drip.real-value",
      severity: "neutral",
      category: "projection",
      title:    `$${finalValue.toLocaleString()} then ≈ $${realValue.toLocaleString()} in today's money`,
      body:     `Dividends compound, but so does inflation. At the current ${fredBenchmarks.cpiInflationYoY}% CPI, your $${finalValue.toLocaleString()} portfolio in ${years} years would buy what about $${realValue.toLocaleString()} buys today — roughly $${drag.toLocaleString()} of the headline is inflation. The good news: at a ${(dividendYield + priceGrowth)}% total return you're comfortably ahead of inflation in real terms.`,
      metric:   { label: "Real value", value: `$${realValue.toLocaleString()}` },
      visualization: {
        type:   "delta-card",
        before: { label: "Portfolio value", value: `$${finalValue.toLocaleString()}` },
        after:  { label: "Today's $",        value: `$${realValue.toLocaleString()}` },
        delta:  { label: "Inflation drag",   value: `$${drag.toLocaleString()}`, positive: false },
        caption: CPI_CAPTION,
      },
    });
  }

  return insights;
}
