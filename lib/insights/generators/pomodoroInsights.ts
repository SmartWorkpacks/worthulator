// ─── WorthCore Insight Engine — Pomodoro Calculator Generator ─────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "pomodoro-calculator". Frames daily
//   sessions and deep-work hours against the ~4-hour deep-work ceiling, surfaces
//   focus density, projects weekly output, and nudges session length.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { DEEP_WORK_CEILING_HOURS } from "@/calculations/work/pomodoro";

export interface PomodoroInsightInputs {
  hoursAvailable: number;
  sessionMinutes: number;
  breakMinutes:   number;
  daysPerWeek:    number;
}

export interface PomodoroInsightOutputs {
  sessions:        number;
  deepWorkHours:   number;
  deepWorkMinutes: number;
  breakMinutes:    number;
  focusDensity:    number;
  weeklySessions:  number;
  weeklyDeepHours: number;
  longBreaks:      number;
}

export function generatePomodoroInsights(
  inputs: PomodoroInsightInputs,
  outputs: PomodoroInsightOutputs,
): Insight[] {
  const { sessionMinutes, daysPerWeek } = inputs;
  const { sessions, deepWorkHours, focusDensity, weeklySessions, weeklyDeepHours, longBreaks } = outputs;

  if (sessions <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — deep-work hours vs the 4-hour ceiling (benchmark-bar) ───
  insights.push({
    id:       "pomodoro.headline",
    severity: deepWorkHours > DEEP_WORK_CEILING_HOURS ? "warning" : "positive",
    category: "comparison",
    title:    `${sessions} sessions = ${deepWorkHours.toFixed(1)}h of deep work`,
    body:     deepWorkHours > DEEP_WORK_CEILING_HOURS
      ? `${sessions} × ${sessionMinutes}-minute sessions packs ${deepWorkHours.toFixed(1)} hours of focus into your day — past the ~4-hour ceiling most knowledge workers can sustain. Quality usually drops beyond that; consider fewer, sharper sessions.`
      : `${sessions} × ${sessionMinutes}-minute sessions gives ${deepWorkHours.toFixed(1)} hours of focused work — right around the ~4-hour deep-work ceiling research suggests is realistic. That's strong, sustainable output.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      deepWorkHours,
      userLabel:      "Your deep work",
      benchmarkValue: DEEP_WORK_CEILING_HOURS,
      benchmarkLabel: "Sustainable ceiling (~4h)",
      format:         "number",
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 2. Focus density ──────────────────────────────────────────────────────
  insights.push({
    id:       "pomodoro.density",
    severity: "neutral",
    category: "comparison",
    title:    `${Math.round(focusDensity)}% of your available time is focused work`,
    body:     `After breaks, ${Math.round(focusDensity)}% of your block is spent actually working — the rest is recovery. Breaks aren't lost time: the 23-minute average refocus cost after an interruption is exactly what scheduled breaks prevent.`,
    metric:   { label: "Focus density", value: `${Math.round(focusDensity)}%` },
    priority: 70,
  });

  // ── 3. Weekly output (projection-line over the work week) ─────────────────
  if (daysPerWeek >= 2) {
    const points = Array.from({ length: Math.min(daysPerWeek, 7) }, (_, i) => ({
      label: `Day ${i + 1}`,
      value: Math.round(deepWorkHours * (i + 1) * 10) / 10,
    }));
    insights.push({
      id:       "pomodoro.weekly",
      severity: "neutral",
      category: "projection",
      title:    `${weeklyDeepHours.toFixed(1)} deep-work hours per week`,
      body:     `At ${sessions} sessions a day across ${daysPerWeek} days, you bank ${weeklySessions} sessions and ${weeklyDeepHours.toFixed(1)} focused hours a week. Tracking completed sessions — not hours at the desk — is what compounds into finished projects.`,
      visualization: {
        type:   "projection-line",
        points,
        format: "number",
        yLabel: "Cumulative deep-work hrs",
        color:  "#ef4444",
      } satisfies InsightVisualization,
      priority: 50,
    });
  }

  // ── 4. Session-length nudge ───────────────────────────────────────────────
  if (sessionMinutes <= 25) {
    insights.push({
      id:       "pomodoro.session-length",
      severity: "neutral",
      category: "comparison",
      title:    `Short ${sessionMinutes}-minute sessions suit interrupt-heavy work`,
      body:     `Classic 25-minute Pomodoros are great when distractions are frequent. For complex or creative work, longer 52- or 90-minute blocks (aligned with ultradian rhythms) often produce higher-quality output — experiment to find your rhythm.`,
      metric:   { label: "Long breaks earned", value: `${longBreaks}` },
      priority: 30,
    });
  } else if (sessionMinutes >= 90) {
    insights.push({
      id:       "pomodoro.deep-blocks",
      severity: "neutral",
      category: "comparison",
      title:    `${sessionMinutes}-minute blocks match ultradian rhythm cycles`,
      body:     `Sessions around 90 minutes align with the brain's natural ultradian cycles and suit deep creative or analytical work. Just protect them ruthlessly — a single interruption costs an average of 23 minutes to fully recover from.`,
      metric:   { label: "Sessions/day", value: `${sessions}` },
      priority: 30,
    });
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
