export interface HoursInputs {
  startMinutes: number; // minutes from midnight (0–1439)
  endMinutes: number; // minutes from midnight (0–1439); overnight if ≤ start
  breakMinutes: number; // unpaid break, subtracted from worked time
  hourlyRate: number; // optional pay rate; 0 hides pay
  overtimeThresholdHours: number; // hours/day above which overtime applies
}

export interface HoursResult {
  grossMinutes: number; // clock time start→end (overnight-aware)
  workedMinutes: number; // gross − break, floored at 0
  workedHours: number; // decimal, 2dp
  hoursPart: number; // whole hours of worked time
  minutesPart: number; // remaining minutes
  breakMinutes: number;
  breakHours: number;
  regularHours: number;
  overtimeHours: number;
  isOvernight: boolean;
  hasPay: boolean;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  clockLabel: string; // e.g. "7h 30m"
  breakdown: { label: string; amount: number; colorClass: string }[];
}

const OVERTIME_MULTIPLIER = 1.5; // time-and-a-half — common FLSA-style convention

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function calculateHours(input: HoursInputs): HoursResult {
  const startMinutes = clamp(safeNum(input.startMinutes), 0, 1439);
  const endMinutes = clamp(safeNum(input.endMinutes), 0, 1439);
  const breakMinutes = Math.max(0, safeNum(input.breakMinutes));
  const hourlyRate = Math.max(0, safeNum(input.hourlyRate));
  const overtimeThresholdHours = clamp(safeNum(input.overtimeThresholdHours, 8), 0, 24);

  // Overnight shift: end at or before start rolls into the next day.
  let grossMinutes = endMinutes - startMinutes;
  const isOvernight = grossMinutes <= 0;
  if (isOvernight) grossMinutes += 1440;

  const workedMinutes = Math.max(0, grossMinutes - breakMinutes);
  const workedHours = workedMinutes / 60;

  const hoursPart = Math.floor(workedMinutes / 60);
  const minutesPart = workedMinutes - hoursPart * 60;

  const regularHours = Math.min(workedHours, overtimeThresholdHours);
  const overtimeHours = Math.max(0, workedHours - overtimeThresholdHours);

  const hasPay = hourlyRate > 0;
  const regularPay = hasPay ? regularHours * hourlyRate : 0;
  const overtimePay = hasPay ? overtimeHours * hourlyRate * OVERTIME_MULTIPLIER : 0;
  const totalPay = regularPay + overtimePay;

  return {
    grossMinutes,
    workedMinutes,
    workedHours: round2(workedHours),
    hoursPart,
    minutesPart,
    breakMinutes,
    breakHours: round2(breakMinutes / 60),
    regularHours: round2(regularHours),
    overtimeHours: round2(overtimeHours),
    isOvernight,
    hasPay,
    regularPay: round2(regularPay),
    overtimePay: round2(overtimePay),
    totalPay: round2(totalPay),
    clockLabel: `${hoursPart}h ${minutesPart}m`,
    breakdown: [
      { label: "Worked", amount: workedMinutes, colorClass: "bg-emerald-400" },
      { label: "Break", amount: breakMinutes, colorClass: "bg-amber-400" },
    ],
  };
}
