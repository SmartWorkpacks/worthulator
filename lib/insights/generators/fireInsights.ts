import type { Insight } from "../types";
import { futureValueAnnuity } from "../projections";
import { formatCurrency } from "../benchmarks";

interface FireInputs {
  monthlyExpenses: number;
  currentSavings:  number;
  monthlySavings:  number;
  annualReturn:    number;
}

interface FireOutputs {
  fireNumber?:         number;
  yearsToFire?:        number;
  savingsRate?:        number;
  percentFunded?:      number;
  passiveIncomeNow?:   number;
  yearsFasterWith500?: number;
}

// The 4% rule: William Bengen (1994) — a 4% annual withdrawal from a diversified
// portfolio historically survives 30+ years. FIRE number = 25× annual expenses.
// Trinity Study (1998) confirmed: 30-year horizon, 95% success rate at 4% withdrawal.

export function fireInsights(
  inputs: FireInputs,
  outputs: FireOutputs,
): Insight[] {
  const results: Insight[] = [];

  const monthly   = Number(inputs.monthlyExpenses);
  const savings   = Number(inputs.currentSavings);
  const contrib   = Number(inputs.monthlySavings);
  const rate      = Number(inputs.annualReturn);
  const fireNum   = outputs.fireNumber         ?? Math.round(monthly * 12 * 25);
  const years     = outputs.yearsToFire        ?? 0;
  const progress  = outputs.percentFunded      ?? (fireNum > 0 ? Math.min(100, (savings / fireNum) * 100) : 0);
  const passive   = outputs.passiveIncomeNow   ?? Math.round(savings * 0.04 / 12);
  const faster500 = outputs.yearsFasterWith500 ?? 0;
  const srFromOutputs = outputs.savingsRate;
  const srComputed    = (contrib + monthly) > 0 ? Math.round((contrib / (contrib + monthly)) * 1000) / 10 : 0;
  const savingsRatePct = srFromOutputs ?? srComputed;
  const annualReturn   = Math.round(savings * rate / 100);

  // 1. Already at FIRE
  if (progress >= 100) {
    results.push({
      id:       "fire.already-there",
      severity: "positive",
      category: "savings",
      title:    `FIRE number reached — ${formatCurrency(savings)} covers your target`,
      body:     `Your ${formatCurrency(savings)} portfolio has passed your FIRE number of ${formatCurrency(fireNum)}. At the 4% withdrawal rule (Bengen 1994 / Trinity Study 1998), this supports ${formatCurrency(Math.round(savings * 0.04 / 12))}/month in passive income — indefinitely, based on 30+ years of historical success. You could stop contributing today.`,
      metric:   { label: "Monthly passive income", value: `${formatCurrency(Math.round(savings * 0.04 / 12))}/mo` },
    });
    return results;
  }

  // 2. Progress fact — always shown
  results.push({
    id:       "fire.progress",
    severity: progress >= 75 ? "positive" : progress >= 50 ? "neutral" : "neutral",
    category: "projection",
    title:    `${progress.toFixed(1)}% funded — ${formatCurrency(savings)} of a ${formatCurrency(fireNum)} target`,
    body:     `Your FIRE number is 25× your annual expenses: ${formatCurrency(monthly)}/month × 12 × 25 = ${formatCurrency(fireNum)}. You have ${formatCurrency(savings)} invested — ${progress.toFixed(1)}% of the target. At ${formatCurrency(contrib)}/month invested at ${rate}% return, the projected timeline is ${years > 0 ? `${years} years` : "not yet calculable with current inputs"}.`,
    metric:   { label: "Current progress", value: `${progress.toFixed(1)}%` },
    visualization: {
      type:           "benchmark-bar",
      userValue:      savings,
      userLabel:      "Current savings",
      benchmarkValue: fireNum,
      benchmarkLabel: `FIRE number (${formatCurrency(fireNum)})`,
      format:         "currency",
    },
  });

  // 3. Passive income already generating
  if (passive > 0) {
    results.push({
      id:       "fire.passive-income-now",
      severity: "positive",
      category: "savings",
      title:    `${formatCurrency(savings)} already generates ${formatCurrency(passive)}/month at the 4% rule`,
      body:     `Even before reaching FIRE, your current portfolio generates ${formatCurrency(passive)}/month in passive income at a 4% annual withdrawal rate — that is ${formatCurrency(passive * 12)}/year. The annual investment return on your current balance is approximately ${formatCurrency(annualReturn)}/year, which accumulates as growth without any additional contributions.`,
      metric:   { label: "Passive income now", value: `${formatCurrency(passive)}/mo` },
    });
  }

  // 4. $500/month accelerator — with delta-card visualization
  if (faster500 >= 1) {
    const acceleratedYears = Math.round((years - faster500) * 10) / 10;
    results.push({
      id:       "fire.accelerator-500",
      severity: "positive",
      category: "opportunity-cost",
      title:    `${formatCurrency(500)}/month extra cuts ${faster500} year${faster500 === 1 ? "" : "s"} off the timeline`,
      body:     `Adding ${formatCurrency(500)}/month moves your FIRE date from year ${years} to year ${acceleratedYears} — a ${faster500}-year acceleration. At ${rate}% return, the extra ${formatCurrency(500)}/month over those remaining years isn't just linear: each dollar compounds for the full remaining period, so the time saved grows disproportionately with the timeline.`,
      metric:   { label: "Years saved with +$500/mo", value: `${faster500}yr` },
      visualization: {
        type:   "delta-card",
        before: { label: "Current timeline", value: `${years} yrs` },
        after:  { label: "With +$500/mo",    value: `${acceleratedYears} yrs` },
        delta:  { label: "Time saved",        value: `-${faster500} yr`, positive: true },
      },
    });
  }

  // 5. Savings rate — benchmarked against FIRE movement targets
  if (savingsRatePct >= 30 || contrib > 0) {
    const rateColor = savingsRatePct >= 50 ? "positive" : savingsRatePct >= 33 ? "neutral" : "neutral";
    const benchmark = savingsRatePct >= 50
      ? "above the 50% FIRE target — historically ~17 years to FIRE"
      : savingsRatePct >= 33
        ? "approaching the 50% FIRE target"
        : "well below the 50% FIRE target";
    results.push({
      id:       "fire.high-savings-rate",
      severity: rateColor,
      category: "comparison",
      title:    `${savingsRatePct.toFixed(1)}% savings rate — ${benchmark}`,
      body:     `Your savings rate (investments ÷ total cash flow) is ${savingsRatePct.toFixed(1)}%. The FIRE movement's key insight: at 50%, you reach financial independence in ~17 years regardless of income level; at 75%, roughly 7 years. Savings rate determines the timeline more than return rate because it simultaneously reduces the FIRE target and increases the speed of accumulation.`,
      metric:   { label: "Savings rate", value: `${savingsRatePct.toFixed(1)}%` },
    });
  }

  // 6. Long timeline — projection-line showing portfolio growth curve
  if (years >= 20) {
    const r = rate;
    const pv = savings;
    const annualContrib = contrib * 12;
    // Build points every 5 years from 0 to target
    const maxYr = Math.min(Math.ceil(years), 50);
    const step  = maxYr <= 25 ? 5 : 10;
    const points = [];
    for (let yr = 0; yr <= maxYr; yr += step) {
      const growth = yr > 0 ? pv * Math.pow(1 + r / 100, yr) : pv;
      const accumulated = yr > 0 ? futureValueAnnuity(annualContrib, yr, r) : 0;
      points.push({ label: `Yr ${yr}`, value: Math.round(growth + accumulated) });
    }
    // Always include the final target year if it's not already there
    if (points[points.length - 1]?.label !== `Yr ${maxYr}`) {
      const growth = pv * Math.pow(1 + r / 100, maxYr);
      const accumulated = futureValueAnnuity(annualContrib, maxYr, r);
      points.push({ label: `Yr ${maxYr}`, value: Math.round(growth + accumulated) });
    }

    const extraContrib100 = Math.round(futureValueAnnuity(100 * 12, Math.round(years), r));
    results.push({
      id:       "fire.long-timeline",
      severity: "neutral",
      category: "projection",
      title:    `${years} years at current pace — your portfolio growth curve`,
      body:     `With ${years} years of compounding ahead, an extra ${formatCurrency(100)}/month started today would grow to approximately ${formatCurrency(extraContrib100)} by the target date (at ${rate}%/yr). The same ${formatCurrency(100)}/month started 10 years from now produces far less — compounding rewards contributions made early, not late.`,
      metric:   { label: "Years to FIRE", value: `${years}yr` },
      visualization: {
        type:    "projection-line",
        points,
        format:  "currency",
        yLabel:  "Portfolio value",
        color:   "#10b981",
      },
    });
  }

  return results;
}
