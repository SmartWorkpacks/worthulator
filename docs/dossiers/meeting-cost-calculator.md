# Dossier — Meeting Cost Calculator

> **Slug:** `meeting-cost` (page `meeting-cost-calculator`) · **Domain:** work
> **Calc core:** `calculations/work/meetingCost.ts` (+ test, 23 tests)
> **Insights:** `lib/insights/generators/meetingCostInsights.ts`
> **Status:** Flagship · live state-wage layer + loaded-cost model + context-switch tax

---

## 1. Identity

Computes the true **employer cost** of a meeting — not just attendees × salary,
but a fully-loaded rate (benefits/overhead) scaled by seniority, valued at the
**state median wage**, and annualised by meeting frequency. Uniquely also surfaces
the **context-switch (refocus) tax** that other calculators ignore, the true cost
including it, and the team **workdays** consumed per year. Plus savings from
trimming time, going async, or dropping an attendee.

## 2. Live data layer

| Layer | Source | Getter | Use |
|---|---|---|---|
| Median hourly wage | BLS OEWS May 2024 via Apify (`usStateMedianWages.ts`) | `getUSStateMedianWage()` | Base hourly rate before loading/seniority |

## 3. Fields (clever interconnection)

| Field | Type | Default | Notes |
|---|---|---|---|
| state | dropdown | National | Base median wage |
| attendees | slider 2–50 | 8 | |
| durationMinutes | slider 15–240 | 60 | |
| seniority | select | mixed | junior 1.1 / mixed 1.5 / senior 2.2 / leadership 3.5 |
| frequency | select | weekly | one-off/monthly/bi-weekly/weekly/**daily (260)** → per-year |

## 4. Formulas / constants

```
LOADED_COST_MULTIPLIER     = 1.4   # benefits + payroll taxes + overhead (BLS ECEC)
SENIORITY_MULTIPLIERS      = {junior:1.1, mixed:1.5, senior:2.2, leadership:3.5}
FREQUENCY_PER_YEAR         = {one-off:1, monthly:12, biweekly:26, weekly:52, daily:260}
REFOCUS_MINUTES_PER_ATTENDEE = 23  # UC Irvine, "The Cost of Interrupted Work" (2008)
HOURS_PER_WORKDAY          = 8

loadedHourlyRate    = wage × seniorityMult × 1.4
attendeeHours       = attendees × duration/60
totalCost           = attendees × loadedHourlyRate × duration/60
costPerMinute       = totalCost / duration
costPerAttendee     = totalCost / attendees
annualizedCost      = totalCost × meetingsPerYear
refocusCostPerMtg   = attendees × (23/60) × loadedHourlyRate
trueCostPerMeeting  = totalCost + refocusCostPerMtg
trueAnnualizedCost  = trueCostPerMeeting × meetingsPerYear
annualWorkdays      = (attendeeHours × meetingsPerYear) / 8
trim15Saving        = attendees × loadedHourlyRate × 0.25 × meetingsPerYear
asyncSaving         = annualizedCost × 0.90
dropOneAttendeeSaving = loadedHourlyRate × duration/60 × meetingsPerYear
```

## 5. Worked example (defaults: National $23.11/hr, 8 ppl, 60 min, mixed, weekly)

| Output | Value |
|---|---|
| Loaded hourly rate | $48.53 |
| **Total per meeting** | **$388** |
| Refocus tax / meeting | $149 |
| **True cost / meeting** | **$537** |
| Annualised (×52) | $20,176 |
| True annualised (×52) | $27,924 |
| Workdays of team time/yr | 52 |
| Trim 15 min/wk saving | $5,047/yr |
| Async instead saving | $18,158/yr |

## 6. Invariants (tested, 23)

- loadedHourlyRate = wage × seniorityMult × 1.4.
- totalCost = attendees × loadedRate × hours; per-minute/per-attendee consistent.
- one-off → annualized = total; daily → 260×; weekly = 2× bi-weekly.
- Monotonic: ↑attendees/↑duration/↑seniority/↑wage → ↑cost.
- refocusCost = attendees × 23/60 × loadedRate; trueCost = total + refocus > total.
- trueAnnualized = trueCost × meetingsPerYear; annualWorkdays = annual attendee-hrs ÷ 8.
- savings levers > 0 for recurring meetings; all outputs finite.

## 7. Insights (7, live-captioned "BLS OEWS")

headline cost · **refocus-tax delta-card** · annualised recurring projection-line (with workdays) ·
async-alternative benchmark-bar · trim-15 delta-card · drop-an-attendee metric · state-wage context.
