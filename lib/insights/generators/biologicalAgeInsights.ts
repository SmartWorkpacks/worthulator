import type { Insight } from "../types";

interface BioAgeInputs {
  age:      number;
  sleep:    number;
  exercise: number;
  bmi:      number;
  smoker:   number;
}

interface BioAgeOutputs {
  biologicalAge?:        number;
  riskScore?:            number;
  ageDelta?:             number;
  riskFactorCount?:      number;
  improvementPotential?: number;
}

// Research sources used for risk factor penalties:
// Sleep <6hrs → +5yr (Walker, Why We Sleep 2017; multiple meta-analyses)
// Smoking → +8yr (CDC; Tobacco Control meta-analysis 2018)
// Exercise <2x/week → +4yr (NEJM 2020 Copenhagen City Heart Study)
// BMI >30 → +6yr (Lancet 2016 BMI and mortality analysis)

export function biologicalAgeInsights(
  inputs: BioAgeInputs,
  outputs: BioAgeOutputs,
): Insight[] {
  const results: Insight[] = [];

  const age     = Number(inputs.age);
  const sleep   = Number(inputs.sleep);
  const exercise = Number(inputs.exercise);
  const bmi     = Number(inputs.bmi);
  const smoker  = Number(inputs.smoker);
  const bioAge  = outputs.biologicalAge        ?? age;
  const delta   = outputs.ageDelta             ?? 0;
  const factors = outputs.riskFactorCount      ?? 0;
  const improve = outputs.improvementPotential ?? 0;

  // 1. Core biological vs chronological age
  if (delta <= 0) {
    results.push({
      id:       "bioage.on-track",
      severity: "positive",
      category: "comparison",
      title:    `Biological age aligns with chronological age of ${age}`,
      body:     `No significant lifestyle risk factors are accelerating your biological ageing. Sustained sleep of 7–9 hours, regular exercise, a healthy BMI, and not smoking are the four factors most strongly correlated with a biological age matching or below chronological age.`,
      metric:   { label: "Biological age", value: `${bioAge}` },
    });
  } else {
    results.push({
      id:       "bioage.older-than-actual",
      severity: "warning",
      category: "comparison",
      title:    `Estimated biological age: ${bioAge} — ${delta} years above your chronological age of ${age}`,
      body:     `Biological age is influenced by modifiable lifestyle factors. Research from multiple meta-analyses shows these factors account for 25–40% of the difference between people who age slowly versus quickly. Each factor you address directly reduces the gap.`,
      metric:   { label: "Age gap", value: `+${delta}yr` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      bioAge,
        userLabel:      "Your biological age",
        benchmarkValue: age,
        benchmarkLabel: "Chronological age",
        format:         "number",
      },
    });
  }

  // 2. Sleep
  if (sleep < 6) {
    results.push({
      id:       "bioage.sleep-deficit",
      severity: "warning",
      category: "warning",
      title:    `${sleep}h sleep/night — below 6 hours adds approximately 5 years to biological age`,
      body:     `Research by Matthew Walker (Why We Sleep, 2017) and multiple subsequent meta-analyses link chronic sleep under 6 hours to accelerated cellular ageing, elevated cortisol, and increased all-cause mortality risk. The CDC recommends 7–9 hours for adults.`,
      metric:   { label: "Sleep deficit", value: `${(7 - sleep).toFixed(1)}hr below optimal` },
    });
  } else if (sleep >= 7 && sleep <= 9) {
    results.push({
      id:       "bioage.sleep-good",
      severity: "positive",
      category: "comparison",
      title:    `${sleep}h sleep/night — in the CDC-recommended 7–9h range`,
      body:     `Adequate sleep is the most cost-effective biological age intervention. It reduces systemic inflammation, regulates cortisol, and maintains telomere length — all directly linked to slower cellular ageing.`,
      metric:   { label: "Sleep quality", value: "Optimal" },
    });
  }

  // 3. Smoking
  if (smoker === 1) {
    results.push({
      id:       "bioage.smoking",
      severity: "warning",
      category: "warning",
      title:    `Smoking adds approximately 8 years to biological age`,
      body:     `The CDC and a 2018 Tobacco Control meta-analysis estimate smoking accelerates biological ageing by approximately 8 years on average. Biological age begins recovering within 12 months of quitting. After 10–15 years smoke-free, most of this factor is reversed.`,
      metric:   { label: "Ageing penalty", value: "+8yr (modifiable)" },
    });
  }

  // 4. Exercise
  if (exercise < 2) {
    results.push({
      id:       "bioage.low-exercise",
      severity: "warning",
      category: "warning",
      title:    `${exercise} exercise day${exercise !== 1 ? "s" : ""}/week — fewer than 2 adds approximately 4 years`,
      body:     `The 2020 Copenhagen City Heart Study (NEJM) found that people exercising fewer than twice a week had biological age markers approximately 4 years older than those meeting WHO guidelines of 150 minutes of moderate activity weekly. Three sessions of 30 minutes each meets the threshold.`,
      metric:   { label: "Exercise penalty", value: "+4yr (modifiable)" },
    });
  } else if (exercise >= 5) {
    results.push({
      id:       "bioage.high-exercise",
      severity: "positive",
      category: "comparison",
      title:    `${exercise} exercise days/week — above WHO guidelines`,
      body:     `The World Health Organization recommends 150–300 minutes of moderate activity per week. At ${exercise} days, you are consistently above that threshold. High-frequency exercisers show measurably longer telomeres — a direct marker of slower cellular ageing.`,
      metric:   { label: "Exercise frequency", value: `${exercise}×/week` },
    });
  }

  // 5. BMI
  if (bmi > 30) {
    results.push({
      id:       "bioage.bmi-risk",
      severity: "warning",
      category: "warning",
      title:    `BMI of ${bmi} — above 30 adds approximately 6 years to biological age`,
      body:     `A 2016 Lancet analysis of 3.9 million adults linked BMI above 30 to accelerated biological ageing equivalent to approximately 6 years. A 5–10% reduction in body weight — with no other changes — significantly improves insulin sensitivity, blood pressure, and inflammatory markers.`,
      metric:   { label: "BMI", value: `${bmi}` },
    });
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    results.push({
      id:       "bioage.bmi-healthy",
      severity: "positive",
      category: "comparison",
      title:    `BMI of ${bmi} — in the healthy 18.5–24.9 range`,
      body:     `A healthy BMI is one of the five most consistently significant predictors of longevity across population studies. No ageing penalty applies from this factor.`,
      metric:   { label: "BMI status", value: "Healthy" },
    });
  }

  // 6. Improvement potential
  if (improve >= 5) {
    results.push({
      id:       "bioage.improvement-potential",
      severity: "positive",
      category: "projection",
      title:    `Addressing ${factors} risk factor${factors !== 1 ? "s" : ""} could recover up to ${improve} years of biological age`,
      body:     `Biological ageing is partially reversible through lifestyle change. The ${factors} active risk factor${factors !== 1 ? "s" : ""} identified here collectively account for up to ${improve} years above your chronological age. Most research shows measurable improvement within 3–12 months of consistent change.`,
      metric:   { label: "Recoverable years", value: `${improve}yr` },
    });
  }

  return results;
}
