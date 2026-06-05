/**
 * ─── Age Engine ───────────────────────────────────────────────────────────────
 *
 * Pure calendar math for the Age Calculator. No React, no Date.now(), fully
 * deterministic: both dates arrive as ISO "YYYY-MM-DD" strings and all
 * arithmetic is anchored at **noon UTC** so DST and timezones can never skew a
 * day count.
 *
 * Sourced constants (per the flagship standard, every constant is documented):
 *
 * - `US_LIFE_EXPECTANCY_YEARS` = 79.0 — US life expectancy at birth, total
 *   population, 2024 data. Source: CDC/NCHS Data Brief No. 548, "Mortality in
 *   the United States, 2024" (https://www.cdc.gov/nchs/products/databriefs/db548.htm).
 *   Used ONLY for the "share of a typical lifespan" context figure, which the
 *   UI frames as a population average — not a prediction.
 * - `DAYS_PER_YEAR` = 365.2425 — mean Gregorian calendar year (97 leap years
 *   per 400). Used to convert day counts to decimal years.
 * - Billion-second age ≈ 31.69 yrs is derived: 1e9 ÷ (365.2425 × 86,400).
 *
 * Conventions (documented + tested, and mirrored in page copy):
 * - Calendar age uses the standard civil borrow algorithm (borrow days from
 *   the month *before* the as-of date, then borrow 12 months).
 * - Feb 29 birthdays are celebrated **Feb 28** in common years. The calendar
 *   diff itself stays pure, so on Feb 28 of a common year a leap-day person is
 *   "24y 11m 30d — turning 25 today": both facts are true simultaneously.
 * - Day counts are date-resolution (birth *time* is ignored): hours/minutes/
 *   seconds are exact multiples of whole days lived.
 */

export const US_LIFE_EXPECTANCY_YEARS = 79.0;
export const DAYS_PER_YEAR = 365.2425;
export const MS_PER_DAY = 86_400_000;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;

export interface AgeInputs {
  /** Date of birth, ISO "YYYY-MM-DD". */
  birthDateISO: string;
  /** The date to measure age on (usually today), ISO "YYYY-MM-DD". */
  asOfDateISO: string;
}

export interface BirthdayProjection {
  /** The age being turned on this birthday. */
  turning: number;
  dateISO: string;
  /** Human label, e.g. "June 15, 2027". */
  label: string;
  weekday: string;
  daysFromNow: number;
  /** Total days lived on that birthday (daysLived + daysFromNow). */
  totalDaysLived: number;
}

export interface AgeResult {
  /** False when a date is malformed/impossible or birth is after as-of. */
  valid: boolean;
  /* Calendar age */
  years: number;
  months: number;
  days: number;
  /* Totals (date resolution — see header) */
  totalMonths: number;
  weeksLived: number;
  weekRemainderDays: number;
  daysLived: number;
  hoursLived: number;
  minutesLived: number;
  secondsLived: number;
  ageDecimalYears: number;
  /* Birth facts */
  dayOfWeekBorn: string;
  birthDateLabel: string;
  /* Next birthday */
  nextBirthday: {
    dateISO: string;
    label: string;
    weekday: string;
    daysUntil: number;
    turning: number;
    isToday: boolean;
  };
  /* Milestones */
  nextThousandDayMilestone: { days: number; dateISO: string; label: string; daysUntil: number };
  billionSeconds: { crossed: boolean; dateISO: string; label: string; ageAtCrossYears: number };
  /** Decimal-age share of US life expectancy at birth (can exceed 100). */
  lifespanSharePct: number;
  /* Next 10 birthdays (chart + weekday table) */
  birthdays: BirthdayProjection[];
}

/* ── date helpers ────────────────────────────────────────────────────────── */

function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function daysInMonth(y: number, m: number): number {
  return [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

interface YMD { y: number; m: number; d: number }

function parseISO(s: string): YMD | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec((s ?? "").trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (y < 1 || m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) return null;
  return { y, m, d };
}

/** Timestamp at noon UTC — immune to DST/timezone day-boundary issues. */
function utcNoon(date: YMD): number {
  return Date.UTC(date.y, date.m - 1, date.d, 12, 0, 0);
}

function fromTimestamp(ts: number): YMD {
  const dt = new Date(ts);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

function toISO(date: YMD): string {
  const mm = String(date.m).padStart(2, "0");
  const dd = String(date.d).padStart(2, "0");
  return `${date.y}-${mm}-${dd}`;
}

function toLabel(date: YMD): string {
  return `${MONTHS[date.m - 1]} ${date.d}, ${date.y}`;
}

function weekdayOf(date: YMD): string {
  return WEEKDAYS[new Date(utcNoon(date)).getUTCDay()];
}

/** Birthday in year `y` — Feb 29 births celebrate Feb 28 in common years. */
function birthdayInYear(birth: YMD, y: number): YMD {
  if (birth.m === 2 && birth.d === 29 && !isLeapYear(y)) return { y, m: 2, d: 28 };
  return { y, m: birth.m, d: birth.d };
}

/* ── zero result (guard path) ────────────────────────────────────────────── */

const ZERO_RESULT: AgeResult = {
  valid: false,
  years: 0, months: 0, days: 0,
  totalMonths: 0, weeksLived: 0, weekRemainderDays: 0,
  daysLived: 0, hoursLived: 0, minutesLived: 0, secondsLived: 0,
  ageDecimalYears: 0,
  dayOfWeekBorn: "", birthDateLabel: "",
  nextBirthday: { dateISO: "", label: "", weekday: "", daysUntil: 0, turning: 0, isToday: false },
  nextThousandDayMilestone: { days: 0, dateISO: "", label: "", daysUntil: 0 },
  billionSeconds: { crossed: false, dateISO: "", label: "", ageAtCrossYears: 0 },
  lifespanSharePct: 0,
  birthdays: [],
};

/* ── engine ──────────────────────────────────────────────────────────────── */

export function calculateAge(inputs: AgeInputs): AgeResult {
  const birth = parseISO(inputs.birthDateISO);
  const asOf = parseISO(inputs.asOfDateISO);
  if (!birth || !asOf) return ZERO_RESULT;

  const birthTs = utcNoon(birth);
  const asOfTs = utcNoon(asOf);
  if (birthTs > asOfTs) return ZERO_RESULT;

  /* Calendar age — standard civil borrow algorithm. */
  let years = asOf.y - birth.y;
  let months = asOf.m - birth.m;
  let days = asOf.d - birth.d;
  if (days < 0) {
    months -= 1;
    const prevMonth = asOf.m === 1 ? 12 : asOf.m - 1;
    const prevMonthYear = asOf.m === 1 ? asOf.y - 1 : asOf.y;
    days += daysInMonth(prevMonthYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  /* Totals — noon-UTC anchoring makes this an exact integer. */
  const daysLived = Math.round((asOfTs - birthTs) / MS_PER_DAY);
  const weeksLived = Math.floor(daysLived / 7);
  const weekRemainderDays = daysLived % 7;
  const hoursLived = daysLived * 24;
  const minutesLived = hoursLived * 60;
  const secondsLived = minutesLived * 60;
  const ageDecimalYears = daysLived / DAYS_PER_YEAR;

  /* Next birthday — first occurrence of birth month+day on/after asOf. */
  let nb: YMD = birthdayInYear(birth, asOf.y);
  if (utcNoon(nb) < asOfTs) nb = birthdayInYear(birth, asOf.y + 1);
  const nbTs = utcNoon(nb);
  const daysUntilBirthday = Math.round((nbTs - asOfTs) / MS_PER_DAY);
  const turning = nb.y - birth.y;
  const nextBirthday = {
    dateISO: toISO(nb),
    label: toLabel(nb),
    weekday: weekdayOf(nb),
    daysUntil: daysUntilBirthday,
    turning,
    isToday: daysUntilBirthday === 0,
  };

  /* Next 1,000-day milestone. */
  const nextThousand = (Math.floor(daysLived / 1000) + 1) * 1000;
  const milestoneDate = fromTimestamp(birthTs + nextThousand * MS_PER_DAY);
  const nextThousandDayMilestone = {
    days: nextThousand,
    dateISO: toISO(milestoneDate),
    label: toLabel(milestoneDate),
    daysUntil: nextThousand - daysLived,
  };

  /* 1 billion seconds = birth + 1e9 s. Age at crossing is the same for
     everyone: 1e9 ÷ (365.2425 × 86,400) ≈ 31.69 years (derived, not sourced). */
  const billionTs = birthTs + 1_000_000_000 * 1000;
  const billionDate = fromTimestamp(billionTs);
  const billionSeconds = {
    crossed: secondsLived >= 1_000_000_000,
    dateISO: toISO(billionDate),
    label: toLabel(billionDate),
    ageAtCrossYears: Math.round((1_000_000_000 / (DAYS_PER_YEAR * 86_400)) * 10) / 10,
  };

  /* Share of a typical US lifespan (population average — not a prediction). */
  const lifespanSharePct = Math.round((ageDecimalYears / US_LIFE_EXPECTANCY_YEARS) * 1000) / 10;

  /* Next 10 birthdays, starting at the next one (today's, if it is today). */
  const birthdays: BirthdayProjection[] = [];
  for (let i = 0; i < 10; i++) {
    const t = turning + i;
    const date = birthdayInYear(birth, birth.y + t);
    const dFromNow = Math.round((utcNoon(date) - asOfTs) / MS_PER_DAY);
    birthdays.push({
      turning: t,
      dateISO: toISO(date),
      label: toLabel(date),
      weekday: weekdayOf(date),
      daysFromNow: dFromNow,
      totalDaysLived: daysLived + dFromNow,
    });
  }

  return {
    valid: true,
    years, months, days,
    totalMonths: years * 12 + months,
    weeksLived, weekRemainderDays,
    daysLived, hoursLived, minutesLived, secondsLived,
    ageDecimalYears,
    dayOfWeekBorn: weekdayOf(birth),
    birthDateLabel: toLabel(birth),
    nextBirthday,
    nextThousandDayMilestone,
    billionSeconds,
    lifespanSharePct,
    birthdays,
  };
}
