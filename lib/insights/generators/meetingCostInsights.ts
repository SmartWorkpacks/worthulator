// ─── WorthCore Insight Engine — Meeting Cost Generator ───────────────────────
//
// PURPOSE:
//   State-aware visual insights for the meeting-cost calculator. Uses the loaded
//   employer cost (state median wage × seniority × benefits/overhead), surfaces
//   the annualized recurring cost, async alternative, trim-time and
//   drop-attendee savings.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live median wage carries provenance caption
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { formatCurrency } from "@/lib/insights/benchmarks";
import { usStateMedianWageDataset } from "@/lib/datasets/regional/usStateMedianWages";

export interface MeetingCostInputs {
  attendees: number;
  durationMinutes: number;
  seniority: string;
  frequency: string;
  state: string;
  /** Optional user-entered base hourly wage; when > 0 it overrides the state median. */
  wageOverride?: number;
}

export interface MeetingCostOutputs {
  totalCost: number;
  costPerMinute: number;
  costPerAttendee: number;
  annualizedCost: number;
  loadedHourlyRate: number;
  attendeeHours: number;
  trim15Saving: number;
  dropOneAttendeeSaving: number;
  asyncSaving: number;
  meetingsPerYear: number;
  refocusCostPerMeeting?: number;
  trueCostPerMeeting?: number;
  trueAnnualizedCost?: number;
  annualWorkdays?: number;
}

const FREQUENCY_LABEL: Record<string, string> = {
  "one-off": "one-off",
  monthly: "monthly",
  biweekly: "bi-weekly",
  weekly: "weekly",
};

export function meetingCostInsights(
  inputs: MeetingCostInputs,
  outputs: MeetingCostOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { attendees, durationMinutes, frequency, state } = inputs;
  const {
    totalCost,
    annualizedCost,
    loadedHourlyRate,
    costPerAttendee,
    trim15Saving,
    dropOneAttendeeSaving,
    asyncSaving,
    meetingsPerYear,
    attendeeHours,
    refocusCostPerMeeting = 0,
    trueCostPerMeeting = 0,
    trueAnnualizedCost = 0,
    annualWorkdays = 0,
  } = outputs;

  if (totalCost <= 0) return insights;

  const isCustomWage = (inputs.wageOverride ?? 0) > 0;
  const stateLabel =
    state && state !== "National" ? state : "the US average";
  const isSpecificState = state && state !== "National";
  const freqLabel = FREQUENCY_LABEL[frequency] ?? "recurring";
  const isRecurring = meetingsPerYear > 1;

  const liveCaption = isCustomWage
    ? {
        text: `Your entered base wage $${(inputs.wageOverride ?? 0).toFixed(2)}/hr`,
        asOf: usStateMedianWageDataset.currentPeriodLabel,
        live: false,
      }
    : {
        text: `${stateLabel} median wage $${usStateMedianWageDataset.states[state]?.toFixed(2) ?? usStateMedianWageDataset.national.toFixed(2)}/hr (BLS OEWS)`,
        asOf: usStateMedianWageDataset.currentPeriodLabel,
        live: true,
      };

  // ── 1. The headline cost — what this meeting really costs ───────────────
  insights.push({
    id: "meeting.total-cost",
    severity: totalCost > 1000 ? "warning" : "neutral",
    category: "spending",
    title: `This meeting costs ${formatCurrency(totalCost)} — ${formatCurrency(costPerAttendee)} per person`,
    body: `${attendees} people × ${durationMinutes} minutes at a fully-loaded rate of ${formatCurrency(loadedHourlyRate)}/hr (state median wage + benefits + overhead) = ${formatCurrency(totalCost)} of company money. That's ${attendeeHours} attendee-hours — real salaried time that can't be spent on other work.`,
    metric: { label: "Cost per meeting", value: formatCurrency(totalCost) },
  });

  // ── 1b. The hidden refocus tax — what calculators miss ──────────────────
  if (refocusCostPerMeeting > 0 && trueCostPerMeeting > totalCost) {
    insights.push({
      id: "meeting.refocus-tax",
      severity: "warning",
      category: "hidden-cost",
      title: `The real cost is closer to ${formatCurrency(trueCostPerMeeting)} once you count refocus time`,
      body: `A meeting is a scheduled interruption. Research from UC Irvine found it takes about 23 minutes to fully resume focused work after one. Across ${attendees} attendees that adds roughly ${formatCurrency(refocusCostPerMeeting)} of lost-focus time per meeting${isRecurring ? ` — about ${formatCurrency(trueAnnualizedCost)}/year` : ""}. It's the cost almost every meeting calculator ignores.`,
      metric: { label: "Refocus tax / meeting", value: formatCurrency(refocusCostPerMeeting) },
      visualization: {
        type: "delta-card",
        before: { label: "In-meeting cost", value: formatCurrency(totalCost) },
        after: { label: "+ refocus tax", value: formatCurrency(trueCostPerMeeting) },
        delta: { label: "Hidden cost", value: formatCurrency(refocusCostPerMeeting), positive: false },
      } satisfies InsightVisualization,
    });
  }

  // ── 2. Annualized recurring cost — the wow number ───────────────────────
  if (isRecurring) {
    insights.push({
      id: "meeting.annualized",
      severity: annualizedCost > 20000 ? "warning" : "neutral",
      category: "projection",
      title: `${formatCurrency(annualizedCost)}/year as a ${freqLabel} meeting`,
      body: `A single meeting feels cheap; the recurring commitment doesn't. At ${meetingsPerYear}× per year, this ${freqLabel} meeting costs ${formatCurrency(annualizedCost)} annually${annualWorkdays > 0 ? ` and consumes about ${annualWorkdays} full 8-hour workdays of your team's time` : ""} — the salary cost most teams never put on a budget line. Worth asking: does it justify ${formatCurrency(annualizedCost)} of payroll?`,
      metric: {
        label: "Annual cost",
        value: formatCurrency(annualizedCost),
      },
      visualization: {
        type: "projection-line",
        points: (frequency === "weekly"
          ? [4, 13, 26, 39, 52]
          : frequency === "biweekly"
            ? [2, 7, 13, 20, 26]
            : [1, 3, 6, 9, 12]
        ).map((m) => ({
          label:
            frequency === "monthly" ? `Mo ${m}` : `Wk ${m}`,
          value: Math.round(totalCost * m),
        })),
        format: "currency",
        yLabel: "Cumulative cost",
        color: "#f59e0b",
        caption: liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Async alternative — benchmark-bar ────────────────────────────────
  if (isRecurring && asyncSaving > 1000) {
    insights.push({
      id: "meeting.async-alternative",
      severity: "positive",
      category: "investment-opportunity",
      title: `Replacing it with a written update could save ${formatCurrency(asyncSaving)}/year`,
      body: `Status and information-sharing meetings rarely need everyone live. A written update costs roughly the read time — about 10% of a live meeting. If this is a status sync, going async would reclaim ${formatCurrency(asyncSaving)}/year while letting people read on their own schedule.`,
      visualization: {
        type: "benchmark-bar",
        userValue: annualizedCost,
        userLabel: "Live meeting/yr",
        benchmarkValue: Math.round(annualizedCost * 0.1),
        benchmarkLabel: "Async update/yr",
        format: "currency",
        caption: liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 4. Trim 15 minutes — delta-card ─────────────────────────────────────
  if (trim15Saving > 0 && durationMinutes > 15) {
    const newDuration = durationMinutes - 15;
    insights.push({
      id: "meeting.trim-time",
      severity: "positive",
      category: "habit",
      title: `Cut it to ${newDuration} min → ${formatCurrency(trim15Saving)}/year saved`,
      body: `Parkinson's Law: work expands to fill the time available. Defaulting to ${durationMinutes} minutes invites filler. Booking ${newDuration} minutes instead${isRecurring ? `, across ${meetingsPerYear} meetings a year,` : ""} saves ${formatCurrency(trim15Saving)}${isRecurring ? "/year" : ""} — and usually loses nothing of substance.`,
      visualization: {
        type: "delta-card",
        before: {
          label: `${durationMinutes} min${isRecurring ? "/yr" : ""}`,
          value: formatCurrency(isRecurring ? annualizedCost : totalCost),
        },
        after: {
          label: `${newDuration} min${isRecurring ? "/yr" : ""}`,
          value: formatCurrency(
            (isRecurring ? annualizedCost : totalCost) - trim15Saving,
          ),
        },
        delta: {
          label: "Saved",
          value: formatCurrency(trim15Saving),
          positive: true,
        },
      } satisfies InsightVisualization,
    });
  }

  // ── 5. Drop one attendee ────────────────────────────────────────────────
  if (attendees > 4 && dropOneAttendeeSaving > 0) {
    insights.push({
      id: "meeting.attendee-discipline",
      severity: "neutral",
      category: "comparison",
      title: `Each non-essential attendee costs ${formatCurrency(dropOneAttendeeSaving)}${isRecurring ? "/year" : ""}`,
      body: `Amazon's "two-pizza rule" exists for a reason: every added attendee multiplies cost and coordination overhead. With ${attendees} people, removing one who doesn't need to be there saves ${formatCurrency(dropOneAttendeeSaving)}${isRecurring ? "/year" : ""}. Inviting people "just to keep them in the loop" is what a shared doc is for.`,
      metric: {
        label: "Per attendee" + (isRecurring ? "/yr" : ""),
        value: formatCurrency(dropOneAttendeeSaving),
      },
    });
  }

  // ── 6. State wage context ──────────────────────────────────────────────
  // Skip when a custom base wage overrides the state median — comparison is moot.
  if (isSpecificState && !isCustomWage) {
    const stateWage = usStateMedianWageDataset.states[state];
    if (stateWage) {
      const pct = Math.round(
        (stateWage / usStateMedianWageDataset.national - 1) * 100,
      );
      if (Math.abs(pct) >= 10) {
        insights.push({
          id: "meeting.state-context",
          severity: "neutral",
          category: "comparison",
          title: `${state}'s wages are ${Math.abs(pct)}% ${pct > 0 ? "above" : "below"} the national median`,
          body: `${state}'s median wage of $${stateWage.toFixed(2)}/hr is ${Math.abs(pct)}% ${pct > 0 ? "higher" : "lower"} than the national $${usStateMedianWageDataset.national.toFixed(2)}/hr. ${pct > 0 ? "Meetings here cost proportionally more, so meeting discipline pays back faster." : "Meeting costs run lower here, though the time discipline principles still apply."}`,
          metric: {
            label: `${state} median`,
            value: `$${stateWage.toFixed(2)}/hr`,
          },
        });
      }
    }
  }

  return insights;
}
