import type { Insight } from "../index";
import { formatCurrency } from "../benchmarks";
import { futureValueAnnuity } from "../projections";

interface WfhInputs {
  dailyCommuteCost: number;
  officeDays:       number;
  dailyFood:        number;
  commuteMinutes:   number;
}

interface WfhOutputs {
  yearlySavings?:        number;
  monthlySavings?:       number;
  timeSavedHours?:       number;
  tenYearSavings?:       number;
  investedSavings10yr?:  number;
  hourlyValueRecovered?: number;
}

export function wfhSavingsInsights(
  inputs: WfhInputs,
  outputs: WfhOutputs
): Insight[] {
  const results: Insight[] = [];

  const commuteCost = Number(inputs.dailyCommuteCost);
  const officeDays  = Number(inputs.officeDays);
  const foodCost    = Number(inputs.dailyFood);
  const commuteMin  = Number(inputs.commuteMinutes);
  const yearly      = outputs.yearlySavings        ?? 0;
  const monthly     = outputs.monthlySavings       ?? 0;
  const timeHours   = outputs.timeSavedHours       ?? 0;
  const tenYear     = outputs.tenYearSavings       ?? 0;
  const invested10  = outputs.investedSavings10yr  ?? 0;
  const hrValue     = outputs.hourlyValueRecovered ?? 0;

  if (yearly <= 0) return results;

  // 1. Annual savings — always shown
  const grossEquivalent = Math.round(yearly / 0.72);
  results.push({
    id:       "wfh.annual-savings",
    severity: "positive",
    category: "savings",
    title:    `WFH ${officeDays} day${officeDays > 1 ? "s" : ""}/week saves ${formatCurrency(yearly)}/year — ${formatCurrency(monthly)}/month after-tax`,
    body:     `After-tax savings are more valuable than equivalent salary because they require no gross-up. ${formatCurrency(yearly)}/year in WFH savings is worth ${formatCurrency(grossEquivalent)} in pre-tax salary at a 28% marginal rate. That never shows up in an offer letter — but it should.`,
    metric:   { label: "Annual WFH savings", value: formatCurrency(yearly) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      yearly,
      userLabel:      "Annual WFH savings",
      benchmarkValue: grossEquivalent,
      benchmarkLabel: "Equivalent gross salary raise",
      format:         "currency",
    },
  });

  // 2. Time recovered
  if (timeHours > 100) {
    results.push({
      id:       "wfh.time-recovered",
      severity: "positive",
      category: "time-loss",
      title:    `${timeHours.toLocaleString()} hours/year recovered — ${Math.round(timeHours / 40)} full working weeks`,
      body:     `The average US commute is 27 minutes each way. At ${commuteMin} minutes round-trip ${officeDays} day${officeDays > 1 ? "s" : ""}/week, you recover ${timeHours.toLocaleString()} hours annually. That time has economic value — at $${hrValue}/hr in direct savings alone, before counting what it is actually worth to you.`,
      metric:   { label: "Time recovered", value: `${timeHours}hrs/yr` },
    });
  }

  // 3. 10-year investment value
  if (invested10 > tenYear && monthly > 0) {
    const projected = Math.round(futureValueAnnuity(monthly * 12, 10, 7));
    results.push({
      id:       "wfh.invested-savings",
      severity: "positive",
      category: "investment",
      title:    `${formatCurrency(monthly)}/month invested at 7% becomes ${formatCurrency(projected)} in 10 years`,
      body:     `If WFH savings are redirected to investment rather than absorbed by lifestyle inflation, the 10-year compound value is ${formatCurrency(projected)} — far more than the ${formatCurrency(tenYear)} in direct savings alone. Most people adjust their spending to match their income; the ones who don't build wealth instead.`,
      metric:   { label: "10-year invested value", value: formatCurrency(projected) },
      visualization: {
        type:   "delta-card",
        before: { label: "10-year direct savings",   value: formatCurrency(tenYear) },
        after:  { label: "10-year invested at 7%",   value: formatCurrency(projected) },
        delta:  { label: "Compound growth",           value: formatCurrency(projected - tenYear), positive: true },
      },
    });
  }

  // 4. Food cost breakdown
  const annualFood = Math.round(foodCost * officeDays * 52);
  if (annualFood > 2_000) {
    results.push({
      id:       "wfh.food-cost",
      severity: "neutral",
      category: "hidden-cost",
      title:    `${formatCurrency(foodCost)}/day in office food = ${formatCurrency(annualFood)}/year at ${officeDays} day${officeDays > 1 ? "s" : ""}/week`,
      body:     `Bought lunches and coffee are among the most visible household discretionary expenses — and among the easiest to eliminate with WFH. At ${formatCurrency(foodCost)}/day, food alone accounts for ${formatCurrency(annualFood)}/year in the office cost stack.`,
      metric:   { label: "Annual food cost (office)", value: formatCurrency(annualFood) },
    });
  }

  return results;
}
