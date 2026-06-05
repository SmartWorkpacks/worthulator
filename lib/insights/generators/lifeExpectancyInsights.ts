import type { Insight } from "../types";

interface LifeExpectancyInputs {
  age:      number;
  smoker:   number;
  exercise: number;
  bmi:      number;
}

interface LifeExpectancyOutputs {
  lifeExpectancy?:           number;
  yearsRemaining?:           number;
  weeksRemaining?:           number;
  improvementPotential?:     number;
  daysRemaining?:            number;
  productiveYearsRemaining?: number;
}

// US life expectancy: 76.1 years (CDC 2022).
// Smoking reduces life expectancy by ~10 years (CDC).
// Physical inactivity costs 4–6 life-years (WHO; Lancet 2012).
// Obesity (BMI >30) associated with 4–8 year reduction (NEJM 2010).

export function lifeExpectancyInsights(
  inputs: LifeExpectancyInputs,
  outputs: LifeExpectancyOutputs,
): Insight[] {
  const results: Insight[] = [];

  const age       = Number(inputs.age);
  const smoker    = Number(inputs.smoker);
  const exercise  = Number(inputs.exercise);
  const bmi       = Number(inputs.bmi);
  const lifeExp   = outputs.lifeExpectancy           ?? 78;
  const yearsLeft = outputs.yearsRemaining           ?? 0;
  const weeks     = outputs.weeksRemaining           ?? 0;
  const improve   = outputs.improvementPotential     ?? 0;
  const days      = outputs.daysRemaining            ?? 0;
  const prodYears = outputs.productiveYearsRemaining ?? 0;

  // 1. Core expectancy — always shown
  results.push({
    id:       "lifeexp.core",
    severity: "neutral",
    category: "projection",
    title:    `Estimated life expectancy: ${lifeExp} — ${yearsLeft} years (${weeks.toLocaleString()} weeks) remaining`,
    body:     `The US average life expectancy is 76.1 years (CDC 2022). Your estimate of ${lifeExp} reflects modifiable lifestyle inputs. ${days.toLocaleString()} days remain in this projection — a figure that changes with every lifestyle adjustment.`,
    metric:   { label: "Years remaining", value: `${yearsLeft}yr` },
    visualization: {
      type:           "benchmark-bar",
      userValue:      lifeExp,
      userLabel:      "Your estimate",
      benchmarkValue: 76.1,
      benchmarkLabel: "US average (CDC 2022)",
      format:         "number",
    },
  });

  // 2. Smoking — single largest modifiable factor
  if (smoker === 1) {
    results.push({
      id:       "lifeexp.smoking",
      severity: "warning",
      category: "warning",
      title:    `Smoking reduces life expectancy by approximately 10 years — that is ${10 * 52} fewer weeks`,
      body:     `The CDC estimates smoking reduces US life expectancy by roughly 10 years on average. Quitting at ${age} still recovers a significant portion: research shows life expectancy gain from quitting at age 35 is 6–8 years; at age 55, it remains 4–5 years (NEJM 2013).`,
      metric:   { label: "Years lost to smoking", value: "~10yr" },
    });
  }

  // 3. Exercise
  if (exercise === 0) {
    results.push({
      id:       "lifeexp.no-exercise",
      severity: "warning",
      category: "warning",
      title:    `No exercise — physical inactivity is linked to 4–6 fewer life-years`,
      body:     `A 2012 Lancet study of 670,000 adults found physical inactivity reduces life expectancy by 4–6 years. Meeting WHO guidelines (150 minutes of moderate activity per week) begins showing measurable life-expectancy benefit within 1–2 years of consistent exercise.`,
      metric:   { label: "Years at risk", value: "4–6yr" },
    });
  } else if (exercise >= 3) {
    results.push({
      id:       "lifeexp.high-exercise",
      severity: "positive",
      category: "comparison",
      title:    `${exercise >= 3 ? "5+" : exercise}+ exercise sessions/week — linked to 6+ additional life-years`,
      body:     `High-frequency exercisers in multiple large cohort studies (Harvard Alumni Health Study; Copenhagen City Heart Study) consistently outlive sedentary peers by 5–10 years. Regular vigorous activity is the single most studied longevity intervention.`,
      metric:   { label: "Exercise benefit", value: "+6yr estimated" },
    });
  }

  // 4. BMI impact
  if (bmi > 30) {
    results.push({
      id:       "lifeexp.bmi-risk",
      severity: "neutral",
      category: "warning",
      title:    `BMI above 30 — associated with 4–8 fewer life-years (NEJM 2010)`,
      body:     `A 2010 New England Journal of Medicine analysis of 1.46 million adults found obesity (BMI >30) reduces life expectancy by 4–8 years depending on severity. Even a 5–10% reduction in body weight significantly improves the markers associated with this risk.`,
      metric:   { label: "BMI", value: `${bmi}` },
    });
  }

  // 5. Improvement potential
  if (improve > 0) {
    results.push({
      id:       "lifeexp.improvement",
      severity: "positive",
      category: "projection",
      title:    `Lifestyle optimisation could add up to ${improve} years to this projection`,
      body:     `The active risk factors in your profile account for up to ${improve} years below your optimised potential. No single change closes the full gap — the evidence consistently shows that stacking improvements across sleep, exercise, weight, and smoking produces compounding longevity benefits.`,
      metric:   { label: "Potential years gained", value: `+${improve}yr` },
    });
  }

  // 6. Productive years or post-65
  if (prodYears > 0) {
    results.push({
      id:       "lifeexp.productive-years",
      severity: "positive",
      category: "projection",
      title:    `${prodYears} estimated working years ahead — ${prodYears * 52} weeks`,
      body:     `${prodYears} years to the traditional retirement age of 65 is ${prodYears * 52} weeks. That is enough to start and complete multiple multi-year projects, change careers, or build something from scratch that compounds for decades beyond.`,
      metric:   { label: "Working years ahead", value: `${prodYears}yr` },
    });
  } else if (age >= 65) {
    results.push({
      id:       "lifeexp.post-65",
      severity: "positive",
      category: "comparison",
      title:    `${yearsLeft} years remaining past traditional retirement age`,
      body:     `At ${age}, the traditional retirement marker has passed. ${yearsLeft} years is ${yearsLeft * 52} weeks — a substantial span entirely available for self-directed activity, creative work, or deepening relationships.`,
      metric:   { label: "Post-65 years", value: `${yearsLeft}yr` },
    });
  }

  return results;
}
