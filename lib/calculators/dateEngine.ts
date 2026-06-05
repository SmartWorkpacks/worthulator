export type DateMode = "difference" | "add";
export type DateUnit = "days" | "weeks" | "months" | "years";
export type AddDirection = "add" | "subtract";

export interface DateInputs {
  mode: DateMode;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string; // ISO yyyy-mm-dd (difference mode)
  includeEndDay: boolean; // count the end date itself (inclusive duration)
  amount: number; // add mode — span size
  unit: DateUnit; // add mode
  direction: AddDirection; // add mode
}

export interface DateResult {
  mode: DateMode;
  valid: boolean;
  reversed: boolean; // difference mode: start was after end

  // ── difference outputs ──
  totalDays: number;
  years: number;
  months: number;
  days: number; // remainder days in the Y/M/D breakdown
  totalWeeks: number; // total days / 7, 2dp
  weeks: number; // whole weeks
  remainderDays: number; // days after whole weeks
  weekdays: number; // business days (Mon–Fri)
  weekends: number; // weekend days
  totalHours: number;
  totalMinutes: number;

  // ── add outputs ──
  resultISO: string; // yyyy-mm-dd
  resultLabel: string; // e.g. "Monday, 12 January 2026"
  resultWeekday: string; // e.g. "Monday"
  resultDayOfYear: number;
  resultWeekOfYear: number; // ISO-8601 week number
  offsetDays: number; // absolute days between start and result

  startLabel: string;
  endLabel: string;

  breakdown: { label: string; amount: number; colorClass: string }[];
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

function fromMs(ms: number): YMD {
  const dt = new Date(ms);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

function daysInMonth(year: number, month1to12: number): number {
  return new Date(Date.UTC(year, month1to12, 0)).getUTCDate();
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toISO(p: YMD): string {
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

function weekdayOf(p: YMD): number {
  return new Date(toMs(p)).getUTCDay(); // 0 = Sunday
}

function humanLabel(p: YMD): string {
  return `${WEEKDAY_NAMES[weekdayOf(p)]}, ${p.d} ${MONTH_NAMES[p.m - 1]} ${p.y}`;
}

function dayOfYear(p: YMD): number {
  const start = Date.UTC(p.y, 0, 1);
  return Math.floor((toMs(p) - start) / MS_PER_DAY) + 1;
}

/** ISO-8601 week number (weeks start Monday; week 1 contains the year's first Thursday). */
function isoWeek(p: YMD): number {
  const date = new Date(toMs(p));
  const day = (date.getUTCDay() + 6) % 7; // Monday = 0
  date.setUTCDate(date.getUTCDate() - day + 3); // shift to Thursday of this week
  const firstThursday = Date.UTC(date.getUTCFullYear(), 0, 4);
  const ft = new Date(firstThursday);
  const ftDay = (ft.getUTCDay() + 6) % 7;
  ft.setUTCDate(ft.getUTCDate() - ftDay + 3);
  return 1 + Math.round((date.getTime() - ft.getTime()) / (7 * MS_PER_DAY));
}

/** Calendar Y/M/D difference between two ordered dates (a <= b). */
function calendarDiff(a: YMD, b: YMD): { years: number; months: number; days: number } {
  let years = b.y - a.y;
  let months = b.m - a.m;
  let days = b.d - a.d;
  if (days < 0) {
    months -= 1;
    // borrow days from the month preceding b's month
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

function addSpan(start: YMD, amount: number, unit: DateUnit, direction: AddDirection): YMD {
  const sign = direction === "subtract" ? -1 : 1;
  const n = Math.round(amount) * sign;
  if (unit === "days") {
    return fromMs(toMs(start) + n * MS_PER_DAY);
  }
  if (unit === "weeks") {
    return fromMs(toMs(start) + n * 7 * MS_PER_DAY);
  }
  if (unit === "years") {
    const y = start.y + n;
    const d = Math.min(start.d, daysInMonth(y, start.m));
    return { y, m: start.m, d };
  }
  // months
  const totalMonths = (start.y * 12 + (start.m - 1)) + n;
  const y = Math.floor(totalMonths / 12);
  const m = (totalMonths % 12 + 12) % 12 + 1;
  const d = Math.min(start.d, daysInMonth(y, m));
  return { y, m, d };
}

function emptyResult(mode: DateMode): DateResult {
  return {
    mode,
    valid: false,
    reversed: false,
    totalDays: 0,
    years: 0,
    months: 0,
    days: 0,
    totalWeeks: 0,
    weeks: 0,
    remainderDays: 0,
    weekdays: 0,
    weekends: 0,
    totalHours: 0,
    totalMinutes: 0,
    resultISO: "",
    resultLabel: "",
    resultWeekday: "",
    resultDayOfYear: 0,
    resultWeekOfYear: 0,
    offsetDays: 0,
    startLabel: "",
    endLabel: "",
    breakdown: [],
  };
}

export function calculateDate(input: DateInputs): DateResult {
  if (input.mode === "add") {
    const start = parseISO(input.startDate);
    if (!start) return emptyResult("add");

    const amount = Number.isFinite(input.amount) ? input.amount : 0;
    const result = addSpan(start, amount, input.unit, input.direction);
    const offsetDays = Math.abs(Math.round((toMs(result) - toMs(start)) / MS_PER_DAY));

    return {
      ...emptyResult("add"),
      valid: true,
      resultISO: toISO(result),
      resultLabel: humanLabel(result),
      resultWeekday: WEEKDAY_NAMES[weekdayOf(result)],
      resultDayOfYear: dayOfYear(result),
      resultWeekOfYear: isoWeek(result),
      offsetDays,
      startLabel: humanLabel(start),
      endLabel: humanLabel(result),
    };
  }

  // difference mode
  const sParsed = parseISO(input.startDate);
  const eParsed = parseISO(input.endDate);
  if (!sParsed || !eParsed) return emptyResult("difference");

  const reversed = toMs(sParsed) > toMs(eParsed);
  const a = reversed ? eParsed : sParsed;
  const b = reversed ? sParsed : eParsed;

  const baseDays = Math.round((toMs(b) - toMs(a)) / MS_PER_DAY);
  const totalDays = baseDays + (input.includeEndDay ? 1 : 0);

  const { years, months, days } = calendarDiff(a, b);
  const weeks = Math.floor(totalDays / 7);
  const remainderDays = totalDays - weeks * 7;

  // Count business days across the inclusive span (capped for safety).
  const spanCount = Math.min(totalDays, 200_000);
  let weekdays = 0;
  for (let i = 0; i < spanCount; i++) {
    const dow = new Date(toMs(a) + i * MS_PER_DAY).getUTCDay();
    if (dow !== 0 && dow !== 6) weekdays += 1;
  }
  const weekends = Math.max(0, spanCount - weekdays);

  return {
    ...emptyResult("difference"),
    valid: true,
    reversed,
    totalDays,
    years,
    months,
    days,
    totalWeeks: Math.round((totalDays / 7) * 100) / 100,
    weeks,
    remainderDays,
    weekdays,
    weekends,
    totalHours: totalDays * 24,
    totalMinutes: totalDays * 1440,
    startLabel: humanLabel(a),
    endLabel: humanLabel(b),
    breakdown: [
      { label: "Weekdays", amount: weekdays, colorClass: "bg-blue-400" },
      { label: "Weekend days", amount: weekends, colorClass: "bg-amber-400" },
    ],
  };
}
