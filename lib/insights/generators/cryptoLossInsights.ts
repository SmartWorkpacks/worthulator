import type { Insight } from "../types";
import { futureValueAnnuity } from "../projections";
import { formatCurrency } from "../benchmarks";

interface CryptoInputs {
  invested:     number;
  currentValue: number;
  yearsHeld:    number;
}

interface CryptoOutputs {
  pnl?:               number;
  pnlPercent?:        number;
  indexAlternative?:  number;
  opportunityGap?:    number;
  breakEvenMultiple?: number;
  indexGainPercent?:  number;
}

export function cryptoLossInsights(
  inputs: CryptoInputs,
  outputs: CryptoOutputs,
): Insight[] {
  const results: Insight[] = [];

  const invested      = Number(inputs.invested);
  const current       = Number(inputs.currentValue);
  const yearsHeld     = Number(inputs.yearsHeld);
  const pnl           = outputs.pnl          ?? (current - invested);
  const pnlPct        = outputs.pnlPercent   ?? (invested > 0 ? Math.round(((current - invested) / invested) * 100) : 0);
  const indexAlt      = outputs.indexAlternative;
  const oppGap        = outputs.opportunityGap;

  if (invested <= 0) return results;

  const loss          = Math.max(0, invested - current);
  const gain          = Math.max(0, current - invested);
  const isLoss        = current < invested;

  // S&P 500 historical 10.7% annualised over the last 30 years
  const sp500Value    = Math.round(invested * Math.pow(1.107, yearsHeld));
  const sp500Gap      = sp500Value - current;
  const indexAltFinal = indexAlt ?? sp500Value;

  // 1. P&L fact
  results.push({
    id:       "crypto.pnl-fact",
    severity: isLoss ? "warning" : "positive",
    category: "spending",
    title:    `${formatCurrency(Math.abs(pnl))} ${isLoss ? "loss" : "gain"} — ${Math.abs(pnlPct)}% ${isLoss ? "down" : "up"}`,
    body:     `${formatCurrency(invested)} invested over ${yearsHeld} year${yearsHeld !== 1 ? "s" : ""}, now worth ${formatCurrency(current)}. That is a ${isLoss ? `loss of ${formatCurrency(loss)}` : `gain of ${formatCurrency(gain)}`} — ${Math.abs(pnlPct)}% ${isLoss ? "below" : "above"} the entry price. Crypto assets regularly move 30–70% in weeks in either direction; volatility is the defining characteristic of the asset class.`,
    metric:   { label: isLoss ? "Total loss" : "Total gain", value: formatCurrency(Math.abs(pnl)) },
    visualization: {
      type:   "delta-card",
      before: { label: "Invested",       value: formatCurrency(invested) },
      after:  { label: "Current value",   value: formatCurrency(current) },
      delta:  { label: "P&L",             value: formatCurrency(pnl), positive: pnl >= 0 },
    },
  });

  // 2. S&P 500 comparison — standard benchmark
  results.push({
    id:       "crypto.sp500-comparison",
    severity: "neutral",
    category: "comparison",
    title:    `The S&P 500 has averaged 10.7% annually over the last 30 years`,
    body:     `${formatCurrency(invested)} in a broad S&P 500 index fund at 10.7% historical average would be ${formatCurrency(sp500Value)} after ${yearsHeld} year${yearsHeld !== 1 ? "s" : ""}. Compared to the current crypto value of ${formatCurrency(current)}, that is a difference of ${formatCurrency(Math.abs(sp500Gap))} ${sp500Gap > 0 ? "in favour of the index" : "in favour of crypto"}.`,
    metric:   { label: "S&P 500 equivalent value", value: formatCurrency(sp500Value) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      current,
      userLabel:      "Current crypto value",
      benchmarkValue: sp500Value,
      benchmarkLabel: `S&P 500 over ${yearsHeld}yr`,
      format:         "currency",
    },
  });

  // 3. Break-even math for losses
  if (isLoss && loss > 0) {
    const breakEvenMultiple = outputs.breakEvenMultiple ?? Math.round((invested / current) * 100) / 100;
    results.push({
      id:       "crypto.break-even",
      severity: "neutral",
      category: "investment",
      title:    `A ${Math.round((breakEvenMultiple - 1) * 100)}% gain is needed to break even`,
      body:     `To recover a ${Math.abs(pnlPct)}% loss, the asset must gain more than ${Math.abs(pnlPct)}% — because a 50% loss requires a 100% gain just to get back to the starting point. Your current position requires a ${Math.round((breakEvenMultiple - 1) * 100)}% gain to return to the original ${formatCurrency(invested)}.`,
      metric:   { label: "Required gain to break even", value: `${Math.round((breakEvenMultiple - 1) * 100)}%` },
    });
  }

  return results;
}
