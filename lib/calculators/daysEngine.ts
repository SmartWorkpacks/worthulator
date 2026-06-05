// ─── Days Calculator Engine ──────────────────────────────────────────────────
//
// Focused day-counting math: days until a future date, days since a past date,
// or days between two dates — with an optional business-days-only mode. Pure,
// synchronous, UTC-based; no live data, no React, no fetch.
//
// Public holidays vary by country and are intentionally NOT subtracted from the
// business-day count (stated in the UI). Calendar arithmetic only.
// ─────────────────────────────────────────────────────────────────────────────

export type DaysMode = "until" | "since" | "between";

export interface DaysInputs {
  mode: DaysMode;
  /** ISO yyyy-mm-dd — "today"; passed explicitly so results are deterministic. */
  asOfDate: string;
  /** Future date (until mode). */
  targetDate: string;
  /** Past date (since mode). */
  pastDate: string;
  /** Two dates (between mode). */
  startDate: string;
  endDate: string;
  /** Count only weekdays (Mon–Fri). */
  businessOnly: boolean;
  /** Count the final day itself (inclusive span). */
  includeEndDay: boolean;
}

export interface DaysResult {
  valid: boolean;
  mode: DaysMode;
  reversed: boolean; // endpoints were out of expected order

  totalDays: number; // headline: business or calendar depending on businessOnly
  calendarDays: number; // raw span days regardless of businessOnly
  businessDays: number;
  weekendDays: number;
  countedLabel: string; // "business days" | "days"

  totalWeeks: number; // spanDays / 7, 1dp
  wholeWeeks: number;
  remainderDays: number;

  years: number;
  months: number;
  days: number;

  fromISO: string;
  fromLabel: string;
  toISO: string;
  toLabel: string;
  toWeekday: string;

  breakdown: { label: string; amount: number; colorHex: string }[];
}

const MS_PER_DAY = 86_400_000;
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface YMD {
  y: number;
  m: number; // 1–12
  d: number;
}

function parseISO(s: string): YMD | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof s === "string" ? s.trim() : "");
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (!Number.isFinite(y) || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return { y, m, d };
}

function toMs(p: YMD): number {
  return Date.UTC(p.y, p.m - 1, p.d);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toISO(p: YMD): string {
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

function weekdayName(p: YMD): string {
  return WEEKDAY_NAMES[new Date(toMs(p)).getUTCDay()];
}

function humanLabel(p: YMD): string {
  return `${weekdayName(p)}, ${p.d} ${MONTH_NAMES[p.m - 1]} ${p.y}`;
}

function daysInMonth(year: number, month1to12: number): number {
  return new Date(Date.UTC(year, month1to12, 0)).getUTCDate();
}

/** Calendar Y/M/D difference between ordered dates a ≤ b. */
function calendarDiff(a: YMD, b: YMD): { years: number; months: number; days: number } {
  let years = b.y - a.y;
  let months = b.m - a.m;
  let days = b.d - a.d;
  if (days < 0) {
    months -= 1;
    const prevMonth = b.m - 1 < 1 ? 12 : b.m - 1;
    const prevYear = b.m - 1 < 1 ? b.y - 1 : b.y;
    days += daysInMonth(prevYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

const BUSINESS_HEX = "#60a5fa";
const WEEKEND_HEX = "#fbbf24";

function emptyResult(mode: DaysMode): DaysResult {
  return {
    valid: false,
    mode,
    reversed: false,
    totalDays: 0,
    calendarDays: 0,
    businessDays: 0,
    weekendDays: 0,
    countedLabel: "days",
    totalWeeks: 0,
    wholeWeeks: 0,
    remainderDays: 0,
    years: 0,
    months: 0,
    days: 0,
    fromISO: "",
    fromLabel: "",
    toISO: "",
    toLabel: "",
    toWeekday: "",
    breakdown: [],
  };
}

/** Resolve the two raw endpoints (pre-ordering) for the chosen mode. */
function endpointsFor(input: DaysInputs): { from: YMD | null; to: YMD | null } {
  const asOf = parseISO(input.asOfDate);
  if (input.mode === "until") {
    return { from: asOf, to: parseISO(input.targetDate) };
  }
  if (input.mode === "since") {
    return { from: parseISO(input.pastDate), to: asOf };
  }
  return { from: parseISO(input.startDate), to: parseISO(input.endDate) };
}

export function calculateDays(input: DaysInputs): DaysResult {
  const { from, to } = endpointsFor(input);
  if (!from || !to) return emptyResult(input.mode);

  const reversed = toMs(from) > toMs(to);
  const a = reversed ? to : from;
  const b = reversed ? from : to;

  const baseDays = Math.round((toMs(b) - toMs(a)) / MS_PER_DAY);
  const spanDays = baseDays + (input.includeEndDay ? 1 : 0);

  // Count business vs weekend across the span (capped for safety).
  const spanCount = Math.min(Math.max(0, spanDays), 200_000);
  let businessDays = 0;
  let weekendDays = 0;
  for (let i = 0; i < spanCount; i++) {
    const dow = new Date(toMs(a) + i * MS_PER_DAY).getUTCDay();
    if (dow === 0 || dow === 6) weekendDays++;
    else businessDays++;
  }

  const calendarDays = spanDays;
  const totalDays = input.businessOnly ? businessDays : calendarDays;
  const countedLabel = input.businessOnly ? "business days" : "days";

  const totalWeeks = Math.round((spanDays / 7) * 10) / 10;
  const wholeWeeks = Math.floor(spanDays / 7);
  const remainderDays = spanDays - wholeWeeks * 7;

  const { years, months, days } = calendarDiff(a, b);

  return {
    valid: true,
    mode: input.mode,
    reversed,
    totalDays,
    calendarDays,
    businessDays,
    weekendDays,
    countedLabel,
    totalWeeks,
    wholeWeeks,
    remainderDays,
    years,
    months,
    days,
    fromISO: toISO(from),
    fromLabel: humanLabel(from),
    toISO: toISO(to),
    toLabel: humanLabel(to),
    toWeekday: weekdayName(to),
    breakdown: [
      { label: "Business days", amount: businessDays, colorHex: BUSINESS_HEX },
      { label: "Weekend days", amount: weekendDays, colorHex: WEEKEND_HEX },
    ],
  };
}
