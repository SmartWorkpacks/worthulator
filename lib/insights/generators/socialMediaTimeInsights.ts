import type { Insight } from "../types";
import { futureValueAnnuity } from "../projections";
import { formatCurrency } from "../benchmarks";

interface SocialMediaInputs {
  dailyHours: number;
  years:      number;
}

interface SocialMediaOutputs {
  yearlyHours?:      number;
  lifetimeHours?:    number;
  yearsLost?:        number;
  daysLost?:         number;
  workingYearsLost?: number;
  yearsLostDecimal?: number;
}

// US Bureau of Labor Statistics (2024): avg American spends 2.1 hrs/day on social media
const US_AVG_SOCIAL_HRS = 2.1;

// Pew Research (2024): 46% of heavy social media users (4+hrs/day) report it makes
// them feel worse about their own lives versus 10% of light users.

export function socialMediaTimeInsights(
  inputs: SocialMediaInputs,
  outputs: SocialMediaOutputs,
): Insight[] {
  const results: Insight[] = [];

  const hours  = Number(inputs.dailyHours);
  const years  = Number(inputs.years);
  const yearlyHours  = outputs.yearlyHours  ?? Math.round(hours * 365);
  const daysPerYear  = Math.round(yearlyHours / 24 * 10) / 10;
  const lifetimeDays = Math.round((hours * 365 * years) / 24 * 10) / 10;
  const excessHrs    = Math.max(0, hours - US_AVG_SOCIAL_HRS);
  const weeksYear    = Math.round(yearlyHours / 40);

  if (hours <= 0) return results;

  // 1. Time in human terms
  results.push({
    id:       "social.time-fact",
    severity: hours >= 4 ? "warning" : "neutral",
    category: "time-loss",
    title:    `${yearlyHours} hours a year — ${daysPerYear} full days`,
    body:     `${hours} hours a day on social media is ${yearlyHours} hours a year. That is ${daysPerYear} calendar days, or ${weeksYear} standard 40-hour work weeks. Over ${years} years at this rate: ${lifetimeDays} days. The average American spends ${US_AVG_SOCIAL_HRS} hours a day on social media, according to the Bureau of Labor Statistics.`,
    metric:   { label: "Annual hours", value: `${yearlyHours}h` },
    visualization: {
      type:           "benchmark-bar",
      userValue:      hours,
      userLabel:      "Your social media hrs/day",
      benchmarkValue: US_AVG_SOCIAL_HRS,
      benchmarkLabel: "US average (BLS)",
      format:         "number",
    },
  });

  // 2. Above-average specific analysis
  if (excessHrs >= 0.5) {
    const excessDaysPerYear = Math.round(excessHrs * 365 / 24 * 10) / 10;
    const excessLifetimeDays = Math.round(excessHrs * 365 * years / 24 * 10) / 10;
    results.push({
      id:       "social.excess",
      severity: "neutral",
      category: "comparison",
      title:    `${excessHrs.toFixed(1)} hours a day above the US average`,
      body:     `${excessHrs.toFixed(1)} hours above the ${US_AVG_SOCIAL_HRS}-hour US average is ${excessDaysPerYear} extra days per year. Over ${years} years, those excess hours add up to ${excessLifetimeDays} additional days spent on social media beyond the already-above-zero baseline.`,
      metric:   { label: "Excess vs US avg/day", value: `+${excessHrs.toFixed(1)}h` },
    });
  }

  // 3. Lifetime projection
  if (years > 1) {
    results.push({
      id:       "social.lifetime",
      severity: "neutral",
      category: "time-loss",
      title:    `${lifetimeDays} days over ${years} years`,
      body:     `At ${hours} hours a day for ${years} years, the cumulative total is ${lifetimeDays} days. That is ${Math.round(lifetimeDays / 365 * 10) / 10} years of 24-hour days spent on social media platforms.`,
      metric:   { label: `${years}-year total`, value: `${lifetimeDays} days` },
      visualization: {
        type:   "projection-line",
        points: Array.from({ length: Math.min(years, 10) }, (_, i) => i + 1).map((yr) => ({
          label: `Yr ${yr}`,
          value: Math.round((hours * 365 * yr) / 24 * 10) / 10,
        })),
        format: "number",
        yLabel: "Days spent",
        color:  "#ec4899",
      },
    });
  }

  // 4. Pew Research context for heavy users
  if (hours >= 4) {
    results.push({
      id:       "social.pew-research",
      severity: "neutral",
      category: "comparison",
      title:    `46% of adults who use social media 4+ hours a day say it makes them feel worse about their lives`,
      body:     `Pew Research found that 46% of adults spending 4 or more hours daily on social media report that it negatively affects how they feel about their own lives — compared to 10% of light users. That is nearly a 5x difference in reported negative impact.`,
      metric:   { label: "Heavy users reporting negative impact", value: "46%" },
    });
  }

  return results;
}
