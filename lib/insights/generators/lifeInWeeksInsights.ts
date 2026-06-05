import type { Insight } from "../types";

interface LifeInWeeksInputs {
  age:            number;
  lifeExpectancy: number;
}

interface LifeInWeeksOutputs {
  weeksRemaining?:       number;
  weeksLived?:           number;
  percentUsed?:          number;
  yearsRemaining?:       number;
  daysRemaining?:        number;
  summerWeeksRemaining?: number;
}

// US life expectancy at birth: 76.1 years (CDC 2022).
// Concept by Tim Urban, "Your Life in Weeks" (waitbutwhy.com, 2014).

export function lifeInWeeksInsights(
  inputs: LifeInWeeksInputs,
  outputs: LifeInWeeksOutputs,
): Insight[] {
  const results: Insight[] = [];

  const age       = Number(inputs.age);
  const lifeExp   = Number(inputs.lifeExpectancy);
  const remaining = outputs.weeksRemaining       ?? Math.round((lifeExp - age) * 52);
  const lived     = outputs.weeksLived           ?? Math.round(age * 52);
  const pct       = outputs.percentUsed          ?? Math.round((age / lifeExp) * 100);
  const yearsLeft = outputs.yearsRemaining       ?? Math.round(lifeExp - age);
  const daysLeft  = outputs.daysRemaining        ?? Math.round(remaining * 7);
  const summers   = outputs.summerWeeksRemaining ?? Math.round(yearsLeft * 13);

  // 1. Core scale framing — always shown
  results.push({
    id:       "weeks.core-scarcity",
    severity: "neutral",
    category: "comparison",
    title:    `${(lifeExp * 52).toLocaleString()} weeks in a ${lifeExp}-year life — ${remaining.toLocaleString()} remain`,
    body:     `At ${age}, you have used ${lived.toLocaleString()} of ${(lifeExp * 52).toLocaleString()} weeks — ${pct}% of the total. The remaining ${remaining.toLocaleString()} weeks is ${daysLeft.toLocaleString()} days. US life expectancy is 76.1 years (CDC 2022), placing a typical life at approximately 3,957 weeks.`,
    metric:   { label: "Weeks remaining", value: remaining.toLocaleString() },
    visualization: {
      type:           "benchmark-bar",
      userValue:      lived,
      userLabel:      "Weeks lived",
      benchmarkValue: lifeExp * 52,
      benchmarkLabel: `Total (${lifeExp}yr life)`,
      format:         "number",
    },
  });

  // 2. Percentage milestone
  if (pct >= 50) {
    results.push({
      id:       "weeks.past-halfway",
      severity: "neutral",
      category: "comparison",
      title:    `${pct}% through expected lifespan — ${(100 - pct)}% remaining`,
      body:     `More than half the estimated total weeks have been lived. The remaining ${100 - pct}% — ${remaining.toLocaleString()} weeks — is the time horizon for everything still on the list.`,
      metric:   { label: "Lifespan used", value: `${pct}%` },
    });
  } else {
    results.push({
      id:       "weeks.before-halfway",
      severity: "positive",
      category: "projection",
      title:    `${100 - pct}% of expected life still ahead — ${remaining.toLocaleString()} weeks`,
      body:     `At ${age}, the majority of the total week-count lies ahead. The decisions made over the next decade compound across the remaining ${yearsLeft} years.`,
      metric:   { label: "Lifespan remaining", value: `${100 - pct}%` },
    });
  }

  // 3. Summers
  if (summers > 0 && yearsLeft > 5) {
    results.push({
      id:       "weeks.summers-remaining",
      severity: "neutral",
      category: "comparison",
      title:    `${yearsLeft} years — approximately ${summers.toLocaleString()} summer weeks remaining`,
      body:     `Each year has about 13 weeks of summer (meteorological definition). ${yearsLeft} years forward from now is roughly ${summers.toLocaleString()} summer weeks. Tim Urban's "Your Life in Weeks" popularised thinking in seasonal units — it makes abstract time feel concrete.`,
      metric:   { label: "Summers remaining", value: `${yearsLeft}` },
    });
  }

  // 4. Early stage context
  if (age < 30) {
    results.push({
      id:       "weeks.early-stage",
      severity: "positive",
      category: "projection",
      title:    `At ${age}, compound habits have ${yearsLeft} years to run`,
      body:     `The earlier a habit, skill, or investment begins, the longer its compound curve. ${yearsLeft} years of consistent effort — even small daily actions — produces exponentially different outcomes than the same effort starting a decade later.`,
      metric:   { label: "Years ahead", value: `${yearsLeft}yr` },
    });
  } else if (age >= 60) {
    results.push({
      id:       "weeks.late-stage",
      severity: "positive",
      category: "comparison",
      title:    `At ${age}, ${remaining.toLocaleString()} weeks remain — Gallup research shows life satisfaction peaks in the 60s`,
      body:     `Gallup's global wellbeing data consistently shows reported life satisfaction and sense of meaning peaks for people in their 60s and 70s. ${remaining.toLocaleString()} weeks is a substantial span — enough to start, build, and complete meaningful new chapters.`,
      metric:   { label: "Weeks ahead", value: remaining.toLocaleString() },
    });
  }

  return results;
}
