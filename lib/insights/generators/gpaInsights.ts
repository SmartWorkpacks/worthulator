// ─── WorthCore Insight Engine — GPA Calculator Generator ──────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "gpa-calculator". Surfaces the
//   required GPA, a feasibility verdict against the 4.0 ceiling, the realistic
//   final-GPA range, the letter grade to aim for, and a semester-by-semester
//   trajectory if the student earns straight A's.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { gpaToLetter, MAX_GPA } from "@/calculations/education/gpa";

export interface GpaInsightInputs {
  currentGpa:       number;
  creditsDone:      number;
  remainingCredits: number;
  targetGpa:        number;
}

export interface GpaInsightOutputs {
  requiredGpa:       number;
  maxAchievableGpa:  number;
  minPossibleGpa:    number;
  totalCredits:      number;
  neededQualityPoints: number;
  gpaGap:            number;
  feasible:          number;
  alreadyLocked:     number;
}

const PER_SEMESTER_CREDITS = 15;

export function generateGpaInsights(
  inputs: GpaInsightInputs,
  outputs: GpaInsightOutputs,
): Insight[] {
  const { currentGpa, creditsDone, remainingCredits, targetGpa } = inputs;
  const { requiredGpa, maxAchievableGpa, totalCredits, feasible, alreadyLocked } = outputs;

  if (remainingCredits <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Already locked in — target is below the worst-case floor ───────────
  if (alreadyLocked === 1) {
    insights.push({
      id:       "gpa.already-locked",
      severity: "positive",
      category: "savings",
      title:    `Your ${targetGpa.toFixed(2)} target is already locked in`,
      body:     `With ${creditsDone} credits at a ${currentGpa.toFixed(2)} GPA, even a 0.0 across all ${remainingCredits} remaining credits leaves you above ${targetGpa.toFixed(2)}. Aim higher — a ${(currentGpa).toFixed(2)}+ finish is well within reach.`,
      metric:   { label: "Required GPA", value: "Any" },
      priority: 100,
    });
    return insights;
  }

  // ── 2. Headline — required GPA vs the 4.0 ceiling (benchmark-bar) ──────────
  const cappedRequired = Math.max(0, Math.min(requiredGpa, MAX_GPA));
  insights.push({
    id:       "gpa.required",
    severity: feasible === 1 ? (requiredGpa >= 3.7 ? "warning" : "neutral") : "critical",
    category: feasible === 1 ? "projection" : "warning",
    title:    feasible === 1
      ? `You need a ${requiredGpa.toFixed(2)} GPA across your last ${remainingCredits} credits`
      : `A ${targetGpa.toFixed(2)} GPA is not reachable with ${remainingCredits} credits left`,
    body:     feasible === 1
      ? `To move from a ${currentGpa.toFixed(2)} to a ${targetGpa.toFixed(2)} cumulative GPA, you must average ${requiredGpa.toFixed(2)} (about a ${gpaToLetter(requiredGpa)}) over your remaining ${remainingCredits} credits. That's ${outputs.neededQualityPoints.toLocaleString()} more quality points.`
      : `Even straight A's (4.0) across all ${remainingCredits} remaining credits only lifts you to a ${maxAchievableGpa.toFixed(2)} cumulative GPA — short of your ${targetGpa.toFixed(2)} target. You'd need more remaining credits or a lower target.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      cappedRequired,
      userLabel:      "GPA you need",
      benchmarkValue: MAX_GPA,
      benchmarkLabel: "Maximum (4.0)",
      format:         "number",
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 3. The realistic range — best vs worst final GPA (delta-card) ─────────
  insights.push({
    id:       "gpa.range",
    severity: "neutral",
    category: "comparison",
    title:    `Your final GPA will land between ${outputs.minPossibleGpa.toFixed(2)} and ${maxAchievableGpa.toFixed(2)}`,
    body:     `With ${creditsDone} of ${totalCredits} credits already banked, your remaining ${remainingCredits} credits can only move the needle so far. Straight A's caps you at ${maxAchievableGpa.toFixed(2)}; a total collapse floors you at ${outputs.minPossibleGpa.toFixed(2)}.`,
    visualization: {
      type:   "delta-card",
      before: { label: "All-F floor",  value: outputs.minPossibleGpa.toFixed(2) },
      after:  { label: "All-A ceiling", value: maxAchievableGpa.toFixed(2) },
      delta:  { label: "Your target",   value: targetGpa.toFixed(2), positive: feasible === 1 },
    } satisfies InsightVisualization,
    priority: 70,
  });

  // ── 4. Law of large numbers — how much one strong semester moves you ──────
  if (creditsDone >= 30) {
    const oneSem = Math.min(PER_SEMESTER_CREDITS, remainingCredits);
    const afterOneSem = (currentGpa * creditsDone + MAX_GPA * oneSem) / (creditsDone + oneSem);
    const move = afterOneSem - currentGpa;
    insights.push({
      id:       "gpa.inertia",
      severity: "neutral",
      category: "projection",
      title:    `One perfect semester moves you just +${move.toFixed(2)} GPA`,
      body:     `You already have ${creditsDone} credits, so each new grade is diluted. A flawless ${oneSem}-credit semester at 4.0 lifts a ${currentGpa.toFixed(2)} only to ${afterOneSem.toFixed(2)}. GPA momentum is real — the earlier you push, the more each grade counts.`,
      metric:   { label: "Lift per 4.0 semester", value: `+${move.toFixed(2)}` },
      priority: 50,
    });
  }

  // ── 5. Trajectory if you earn the required GPA each semester ──────────────
  if (feasible === 1 && remainingCredits >= PER_SEMESTER_CREDITS) {
    const points: Array<{ label: string; value: number }> = [];
    let earnedCredits = 0;
    let sem = 0;
    while (earnedCredits < remainingCredits) {
      const chunk = Math.min(PER_SEMESTER_CREDITS, remainingCredits - earnedCredits);
      earnedCredits += chunk;
      sem += 1;
      const cumulative =
        (currentGpa * creditsDone + requiredGpa * earnedCredits) / (creditsDone + earnedCredits);
      points.push({ label: `Sem ${sem}`, value: Math.round(cumulative * 100) / 100 });
    }
    if (points.length >= 2) {
      insights.push({
        id:       "gpa.trajectory",
        severity: "neutral",
        category: "projection",
        title:    `Hitting ${requiredGpa.toFixed(2)} each term gets you to ${targetGpa.toFixed(2)}`,
        body:     `If you average a ${requiredGpa.toFixed(2)} every ${PER_SEMESTER_CREDITS}-credit semester, your cumulative GPA climbs steadily to your ${targetGpa.toFixed(2)} target by graduation.`,
        visualization: {
          type:   "projection-line",
          points,
          format: "number",
          yLabel: "Cumulative GPA",
          color:  "#6366f1",
        } satisfies InsightVisualization,
        priority: 40,
      });
    }
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
