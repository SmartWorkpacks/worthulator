// ─── WorthCore Insight Engine — Protein Intake Generator ──────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "protein-intake-calculator". Sets the
//   daily target in context of the RDA and muscle-building range, splits it per
//   meal against the ~40 g synthesis ceiling, and flags whole-food equivalents.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { PER_MEAL_CEILING } from "@/calculations/health/proteinIntake";

export interface ProteinInsightInputs {
  weight:      number;
  weightIsKg:  number;
  multiplier:  number;
  mealsPerDay: number;
}

export interface ProteinInsightOutputs {
  weightKg:            number;
  proteinGrams:        number;
  caloriesFromProtein: number;
  perMealGrams:        number;
  rangeLow:            number;
  rangeHigh:           number;
  rdaMultiple:         number;
}

export function generateProteinInsights(
  inputs: ProteinInsightInputs,
  outputs: ProteinInsightOutputs,
): Insight[] {
  const { multiplier, mealsPerDay } = inputs;
  const { weightKg, proteinGrams, caloriesFromProtein, perMealGrams, rangeLow, rangeHigh, rdaMultiple } = outputs;

  if (proteinGrams <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — daily target vs the RDA floor (benchmark-bar) ───────────
  const rdaGrams = Math.round(weightKg * 0.8);
  insights.push({
    id:       "protein.headline",
    severity: "positive",
    category: "comparison",
    title:    `${proteinGrams} g of protein a day`,
    body:     `At ${multiplier.toFixed(1)} g/kg for your ${weightKg} kg body weight, your target is ${proteinGrams} g/day — ${rdaMultiple}× the ${rdaGrams} g WHO minimum. That's ${caloriesFromProtein} kcal from protein (protein is 4 kcal/g).`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      proteinGrams,
      userLabel:      "Your target",
      benchmarkValue: rdaGrams,
      benchmarkLabel: "RDA minimum (0.8 g/kg)",
      format:         "number",
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 2. Per-meal split vs the ~40g synthesis ceiling ───────────────────────
  insights.push({
    id:       "protein.per-meal",
    severity: perMealGrams > PER_MEAL_CEILING ? "warning" : "neutral",
    category: "comparison",
    title:    `≈ ${perMealGrams} g per meal across ${mealsPerDay} meals`,
    body:     perMealGrams > PER_MEAL_CEILING
      ? `Split over ${mealsPerDay} meals that's ${perMealGrams} g each — above the ~40 g your body uses most effectively per sitting for muscle synthesis. Adding a meal or a snack spreads it better than fewer, larger servings.`
      : `Spread over ${mealsPerDay} meals, that's about ${perMealGrams} g each — within the 20–40 g per-meal sweet spot for muscle protein synthesis. Even distribution beats one large serving.`,
    metric:   { label: "Per meal", value: `${perMealGrams} g` },
    priority: 70,
  });

  // ── 3. Muscle-building range context (delta-card) ─────────────────────────
  insights.push({
    id:       "protein.range",
    severity: "neutral",
    category: "comparison",
    title:    `Muscle-building band: ${rangeLow}–${rangeHigh} g/day`,
    body:     `For active people the evidence supports 1.6–2.2 g/kg — that's ${rangeLow} g to ${rangeHigh} g for you. The higher end helps preserve lean mass in a calorie deficit; going beyond ~2.4 g/kg adds no further muscle benefit for most people.`,
    visualization: {
      type:   "delta-card",
      before: { label: "Range low (1.6 g/kg)",  value: `${rangeLow} g` },
      after:  { label: "Range high (2.2 g/kg)", value: `${rangeHigh} g` },
      delta:  { label: "Your target",           value: `${proteinGrams} g`, positive: proteinGrams >= rangeLow },
    } satisfies InsightVisualization,
    priority: 50,
  });

  // ── 4. Whole-food equivalents ─────────────────────────────────────────────
  const chickenServings = proteinGrams / 31; // ~31 g per 100 g chicken breast
  const eggs = Math.round(proteinGrams / 6.3); // ~6.3 g per large egg
  insights.push({
    id:       "protein.equivalents",
    severity: "neutral",
    category: "comparison",
    title:    `That's about ${chickenServings.toFixed(1)} chicken breasts' worth`,
    body:     `${proteinGrams} g of protein is roughly ${chickenServings.toFixed(1)} × 100 g of chicken breast, or about ${eggs} large eggs. Aim to get most of it from whole foods and treat powder as a convenient top-up.`,
    metric:   { label: "≈ Large eggs", value: `${eggs}` },
    priority: 30,
  });

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
