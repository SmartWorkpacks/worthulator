import type { Insight } from "../index";
import { formatCurrency } from "../benchmarks";

interface SideHustleInputs {
  hoursPerWeek: number;
  rate:         number;
  expensePct:   number;
  taxRate:      number;
}

interface SideHustleOutputs {
  netMonthly?:      number;
  yearlyNet?:       number;
  hourlyEffective?: number;
  monthlyRevenue?:  number;
  annualTaxPaid?:   number;
  fiveYearNet?:     number;
}

export function sideHustleInsights(
  inputs: SideHustleInputs,
  outputs: SideHustleOutputs
): Insight[] {
  const results: Insight[] = [];

  const hours      = Number(inputs.hoursPerWeek);
  const rate       = Number(inputs.rate);
  const expPct     = Number(inputs.expensePct);
  const taxPct     = Number(inputs.taxRate);
  const netMonthly = outputs.netMonthly       ?? 0;
  const yearlyNet  = outputs.yearlyNet        ?? 0;
  const effective  = outputs.hourlyEffective  ?? 0;
  const taxPaid    = outputs.annualTaxPaid    ?? 0;
  const fiveYear   = outputs.fiveYearNet      ?? 0;
  const overhead   = expPct + taxPct;

  if (rate <= 0) return results;

  // 1. True hourly rate — always shown
  const reductionPct = Math.round((1 - effective / rate) * 100);
  results.push({
    id:       "hustle.true-rate",
    severity: reductionPct > 40 ? "warning" : "neutral",
    category: "hidden-cost",
    title:    `$${rate}/hr becomes ${formatCurrency(effective)}/hr after ${expPct}% expenses + ${taxPct}% tax`,
    body:     `${overhead}% of your gross revenue disappears before you see it — ${expPct}% in expenses and ${taxPct}% to self-employment tax (which includes the 15.3% SE tax W-2 workers split with their employer). Every $10 rate increase adds ${formatCurrency(Math.round(10 * (1 - overhead / 100)))} to your actual take-home per hour.`,
    metric:   { label: "Effective hourly", value: formatCurrency(effective) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      effective,
      userLabel:      "Your effective rate",
      benchmarkValue: rate,
      benchmarkLabel: "Advertised rate",
      format:         "currency",
    },
  });

  // 2. Monthly income milestone
  if (netMonthly >= 2000) {
    results.push({
      id:       "hustle.income-milestone",
      severity: "positive",
      category: "investment",
      title:    `${formatCurrency(netMonthly)}/month net — equivalent to a $${Math.round(yearlyNet / 2080)}/hr full-time salary`,
      body:     `At ${formatCurrency(yearlyNet)}/year after expenses and tax, this side hustle is a serious income stream. If invested at 7%, ${formatCurrency(netMonthly)}/month grows to ${formatCurrency(Math.round(netMonthly * 12 * ((Math.pow(1.07, 5) - 1) / 0.07)))}.`,
      metric:   { label: "Annual net", value: formatCurrency(yearlyNet) },
    });
  } else if (netMonthly >= 500) {
    results.push({
      id:       "hustle.income-milestone",
      severity: "positive",
      category: "savings",
      title:    `${formatCurrency(netMonthly)}/month net — enough to max a Roth IRA in under a year`,
      body:     `The 2024 Roth IRA contribution limit is $7,000. At ${formatCurrency(netMonthly)}/month, this side hustle funds it in ${Math.ceil(7000 / netMonthly)} months. ${formatCurrency(yearlyNet)}/year is real money that compounds.`,
      metric:   { label: "Annual net", value: formatCurrency(yearlyNet) },
    });
  }

  // 3. Tax reality check
  if (taxPaid > 2000) {
    results.push({
      id:       "hustle.tax-burden",
      severity: "warning",
      category: "hidden-cost",
      title:    `${formatCurrency(taxPaid)}/year in taxes — set aside ${formatCurrency(Math.round(taxPaid / 12))}/month now`,
      body:     `Self-employment income carries a 15.3% SE tax (Social Security + Medicare) on top of income tax. Nothing is withheld automatically. Missing quarterly IRS payments triggers an underpayment penalty currently around 8% annualized.`,
      metric:   { label: "Quarterly estimate", value: formatCurrency(Math.round(taxPaid / 4)) },
    });
  }

  // 4. Rate increase leverage
  const rateBoost10 = Math.round(hours * 10 * 4.33 * (1 - expPct / 100) * (1 - taxPct / 100));
  if (rateBoost10 > 0) {
    results.push({
      id:       "hustle.rate-leverage",
      severity: "positive",
      category: "opportunity-cost",
      title:    `A $10/hr rate increase adds ${formatCurrency(rateBoost10)}/year net — no extra hours`,
      body:     `Rate increases are the highest-leverage action in any service business. Same work, more money. A single well-timed rate negotiation typically produces more income than months of extra hours.`,
      metric:   { label: "Gain per $10/hr rate bump", value: formatCurrency(rateBoost10) },
    });
  }

  // 5. Five-year framing
  if (fiveYear > 20_000) {
    results.push({
      id:       "hustle.five-year-framing",
      severity: "positive",
      category: "projection",
      title:    `${formatCurrency(fiveYear)} over 5 years at current rate — before any growth`,
      body:     `This assumes no rate increases or additional clients. A 10% rate increase each year turns ${formatCurrency(fiveYear)} into ${formatCurrency(Math.round(fiveYear * 1.1 * 1.21 * 1.331 / 3))} in the back half alone. The trajectory matters as much as the number.`,
      metric:   { label: "5-year net projection", value: formatCurrency(fiveYear) },
    });
  }

  // 6. Hours burnout risk
  if (hours > 20) {
    results.push({
      id:       "hustle.hours-warning",
      severity: "warning",
      category: "time-loss",
      title:    `${hours}hrs/week side hustle = ${hours * 52} hours/year on top of your primary job`,
      body:     `That is ${Math.round(hours * 52 / 40)} extra full-time work weeks per year. Research from Stanford shows productivity per hour drops sharply above 50 total hours/week. Charging more and working fewer hours often produces the same income with significantly less burnout risk.`,
      metric:   { label: "Annual side hustle hours", value: `${hours * 52}hrs` },
    });
  }

  return results;
}
