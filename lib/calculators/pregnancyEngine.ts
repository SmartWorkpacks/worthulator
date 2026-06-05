// ─── Pregnancy Calculator Engine ─────────────────────────────────────────────
//
// Pure, synchronous due-date and gestational-age math. No live data, no fetch,
// no React. Every gestational age is measured from the LMP (last menstrual
// period) per standard obstetric convention.
//
// CONSTANTS & SOURCES:
//   PREGNANCY_DAYS   = 280  → Naegele's rule: due date = LMP + 280 days (40 wks).
//                            ACOG, "Methods for Estimating the Due Date"
//                            (Committee Opinion 700).
//   GESTATION_FROM_CONCEPTION = 266 → fertilization-to-birth interval (40w − 2w).
//   DEFAULT_OVULATION_OFFSET  = 14  → ovulation ~14 days before next period;
//                            conception ≈ LMP + (cycleLength − 14).
//   Trimester day boundaries (ACOG common convention):
//     1st  days   0–97   (0w0d – 13w6d)
//     2nd  days  98–195  (14w0d – 27w6d)
//     3rd  days 196+     (28w0d onward)
//   Milestone weeks: 14 (end T1), 24 (commonly cited viability), 28 (T3 begins),
//                    37 (full term begins), 40 (estimated due date).
// ─────────────────────────────────────────────────────────────────────────────

export type PregnancyMethod = "lmp" | "conception" | "dueDate" | "ultrasound";

export interface PregnancyInputs {
  method: PregnancyMethod;
  /** ISO yyyy-mm-dd — meaning depends on method (LMP / conception / due date / scan date). */
  referenceDate: string;
  /** Average menstrual cycle length in days (lmp method only). */
  cycleLength: number;
  /** Gestational age measured at the dating scan — weeks part (ultrasound method only). */
  ultrasoundWeeks: number;
  /** Gestational age measured at the dating scan — days part (ultrasound method only). */
  ultrasoundDays: number;
  /** ISO yyyy-mm-dd — "today"; passed explicitly so results are deterministic. */
  asOfDate: string;
}

export interface PregnancyMilestone {
  key: string;
  label: string;
  iso: string;
  dateLabel: string;
  gestationalWeeks: number;
  passed: boolean;
}

export interface PregnancyResult {
  valid: boolean;
  method: PregnancyMethod;

  // ── anchor dates ──
  lmpISO: string;
  lmpLabel: string;
  conceptionISO: string;
  conceptionLabel: string;
  dueDateISO: string;
  dueDateLabel: string;
  dueDateWeekday: string;

  // ── current progress (as of asOfDate) ──
  gestationalDays: number; // whole days since LMP, ≥ 0
  gestationalWeeks: number; // floor(days/7)
  gestationalDayRemainder: number; // days % 7
  gestationalDecimalWeeks: number; // days/7, 1dp
  daysRemaining: number; // due − asOf (negative ⇒ overdue)
  weeksRemaining: number; // whole weeks part of |daysRemaining|
  daysRemainderToGo: number; // days part of |daysRemaining|
  progressPct: number; // 0–100, 1dp
  conceived: boolean; // asOf >= conception
  overdue: boolean;
  daysOverdue: number;

  trimester: 1 | 2 | 3;
  trimesterLabel: string;

  milestones: PregnancyMilestone[];

  /** Weeks-per-trimester breakdown for the chart (14 / 14 / 12 = 40). */
  breakdown: { label: string; amount: number; current: boolean; colorHex: string }[];
}

export const PREGNANCY_DAYS = 280;
export const GESTATION_FROM_CONCEPTION = 266;
const DEFAULT_OVULATION_OFFSET = 14;
const MS_PER_DAY = 86_400_000;

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function safeNum(n: number, fallback: number): number {
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

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

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toISO(p: YMD): string {
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

function weekdayOf(p: YMD): string {
  return WEEKDAY_NAMES[new Date(toMs(p)).getUTCDay()];
}

function humanLabel(p: YMD): string {
  return `${weekdayOf(p)}, ${p.d} ${MONTH_NAMES[p.m - 1]} ${p.y}`;
}

function addDays(p: YMD, days: number): YMD {
  return fromMs(toMs(p) + Math.round(days) * MS_PER_DAY);
}

function diffDays(a: YMD, b: YMD): number {
  return Math.round((toMs(b) - toMs(a)) / MS_PER_DAY);
}

function trimesterForDays(gaDays: number): 1 | 2 | 3 {
  if (gaDays < 98) return 1;
  if (gaDays < 196) return 2;
  return 3;
}

const TRIMESTER_LABELS: Record<1 | 2 | 3, string> = {
  1: "First trimester",
  2: "Second trimester",
  3: "Third trimester",
};

const TRIMESTER_COLORS = ["#f9a8d4", "#c084fc", "#818cf8"];

function emptyResult(method: PregnancyMethod): PregnancyResult {
  return {
    valid: false,
    method,
    lmpISO: "",
    lmpLabel: "",
    conceptionISO: "",
    conceptionLabel: "",
    dueDateISO: "",
    dueDateLabel: "",
    dueDateWeekday: "",
    gestationalDays: 0,
    gestationalWeeks: 0,
    gestationalDayRemainder: 0,
    gestationalDecimalWeeks: 0,
    daysRemaining: 0,
    weeksRemaining: 0,
    daysRemainderToGo: 0,
    progressPct: 0,
    conceived: false,
    overdue: false,
    daysOverdue: 0,
    trimester: 1,
    trimesterLabel: TRIMESTER_LABELS[1],
    milestones: [],
    breakdown: [],
  };
}

/** Derive the LMP (the common anchor) from whichever reference the user supplied. */
function deriveLmp(input: PregnancyInputs, ref: YMD): YMD | null {
  switch (input.method) {
    case "lmp": {
      // LMP given directly. Cycle only shifts conception/due date, not the LMP anchor.
      return ref;
    }
    case "conception": {
      // conception = LMP + 14 ⇒ LMP = conception − 14
      return addDays(ref, -DEFAULT_OVULATION_OFFSET);
    }
    case "dueDate": {
      // LMP = dueDate − 280
      return addDays(ref, -PREGNANCY_DAYS);
    }
    case "ultrasound": {
      const w = clamp(Math.round(safeNum(input.ultrasoundWeeks, 0)), 0, 45);
      const d = clamp(Math.round(safeNum(input.ultrasoundDays, 0)), 0, 6);
      const gaDays = w * 7 + d;
      // LMP = scanDate − gestational age at scan
      return addDays(ref, -gaDays);
    }
    default:
      return null;
  }
}

export function calculatePregnancy(input: PregnancyInputs): PregnancyResult {
  const ref = parseISO(input.referenceDate);
  const asOf = parseISO(input.asOfDate);
  if (!ref || !asOf) return emptyResult(input.method);

  const lmp = deriveLmp(input, ref);
  if (!lmp) return emptyResult(input.method);

  // Due date: cycle length only adjusts the LMP method (ovulation timing).
  // Every method keeps the invariant conception = dueDate − 266.
  let dueDate: YMD;
  if (input.method === "lmp") {
    const cycle = clamp(Math.round(safeNum(input.cycleLength, 28)), 20, 45);
    // dueDate = LMP + (cycle − 14) + 266 = LMP + 252 + cycle  (= LMP + 280 when cycle = 28)
    dueDate = addDays(lmp, 252 + cycle);
  } else if (input.method === "dueDate") {
    dueDate = ref;
  } else {
    dueDate = addDays(lmp, PREGNANCY_DAYS);
  }

  const conception = addDays(dueDate, -GESTATION_FROM_CONCEPTION);

  // Gestational age now, measured from LMP, clamped at 0 (future LMP ⇒ not yet pregnant).
  const rawGaDays = diffDays(lmp, asOf);
  const gestationalDays = Math.max(0, rawGaDays);
  const gestationalWeeks = Math.floor(gestationalDays / 7);
  const gestationalDayRemainder = gestationalDays - gestationalWeeks * 7;
  const gestationalDecimalWeeks = round1(gestationalDays / 7);

  const daysRemaining = diffDays(asOf, dueDate);
  const absRemaining = Math.abs(daysRemaining);
  const weeksRemaining = Math.floor(absRemaining / 7);
  const daysRemainderToGo = absRemaining - weeksRemaining * 7;

  const progressPct = round1(clamp((gestationalDays / PREGNANCY_DAYS) * 100, 0, 100));
  const conceived = diffDays(conception, asOf) >= 0;
  const overdue = daysRemaining < 0;
  const daysOverdue = overdue ? absRemaining : 0;

  const trimester = trimesterForDays(gestationalDays);

  const milestoneSpecs: { key: string; label: string; gaWeeks: number; days: number }[] = [
    { key: "conception", label: "Estimated conception", gaWeeks: 2, days: diffDays(lmp, conception) },
    { key: "t1end", label: "End of first trimester", gaWeeks: 14, days: 98 },
    { key: "viability", label: "Commonly cited viability (~24 weeks)", gaWeeks: 24, days: 168 },
    { key: "t3start", label: "Third trimester begins", gaWeeks: 28, days: 196 },
    { key: "fullterm", label: "Full term begins (37 weeks)", gaWeeks: 37, days: 259 },
    { key: "duedate", label: "Estimated due date", gaWeeks: 40, days: PREGNANCY_DAYS },
  ];

  const milestones: PregnancyMilestone[] = milestoneSpecs.map((spec) => {
    const date = addDays(lmp, spec.days);
    return {
      key: spec.key,
      label: spec.label,
      iso: toISO(date),
      dateLabel: humanLabel(date),
      gestationalWeeks: spec.gaWeeks,
      passed: diffDays(date, asOf) >= 0,
    };
  });

  const breakdown = [
    { label: "1st trimester", amount: 14, current: trimester === 1, colorHex: TRIMESTER_COLORS[0] },
    { label: "2nd trimester", amount: 14, current: trimester === 2, colorHex: TRIMESTER_COLORS[1] },
    { label: "3rd trimester", amount: 12, current: trimester === 3, colorHex: TRIMESTER_COLORS[2] },
  ];

  return {
    valid: true,
    method: input.method,
    lmpISO: toISO(lmp),
    lmpLabel: humanLabel(lmp),
    conceptionISO: toISO(conception),
    conceptionLabel: humanLabel(conception),
    dueDateISO: toISO(dueDate),
    dueDateLabel: humanLabel(dueDate),
    dueDateWeekday: weekdayOf(dueDate),
    gestationalDays,
    gestationalWeeks,
    gestationalDayRemainder,
    gestationalDecimalWeeks,
    daysRemaining,
    weeksRemaining,
    daysRemainderToGo,
    progressPct,
    conceived,
    overdue,
    daysOverdue,
    trimester,
    trimesterLabel: TRIMESTER_LABELS[trimester],
    milestones,
    breakdown,
  };
}
