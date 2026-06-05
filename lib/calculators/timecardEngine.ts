export interface TimecardDay {
  label: string; // e.g. "Mon"
  enabled: boolean; // whether this day is worked
  startMinutes: number; // minutes from midnight (0–1439)
  endMinutes: number; // minutes from midnight (0–1439); overnight if ≤ start
  breakMinutes: number; // unpaid break, subtracted from worked time
}

export interface TimecardInputs {
  days: TimecardDay[];
  hourlyRate: number; // optional; 0 hides pay
  weeklyOvertimeThresholdHours: number; // weekly hours above which overtime applies
}

export interface TimecardDayResult {
  label: string;
  enabled: boolean;
  workedMinutes: number;
  workedHours: number;
  isOvernight: boolean;
}

export interface TimecardResult {
  days: TimecardDayResult[];
  totalWorkedMinutes: number;
  totalWorkedHours: number;
  regularHours: number;
  overtimeHours: number;
  daysWorked: number;
  averageDailyHours: number;
  hasPay: boolean;
  hourlyRate: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
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

// Worked minutes for one day, overnight-aware, net of the unpaid break.
function dayWorkedMinutes(startMinutes: number, endMinutes: number, breakMinutes: number) {
  const start = clamp(safeNum(startMinutes), 0, 1439);
  const end = clamp(safeNum(endMinutes), 0, 1439);
  const brk = Math.max(0, safeNum(breakMinutes));
  let gross = end - start;
  const isOvernight = gross <= 0;
  if (isOvernight) gross += 1440;
  const worked = Math.max(0, gross - brk);
  return { worked, isOvernight };
}

export function calculateTimecard(input: TimecardInputs): TimecardResult {
  const hourlyRate = Math.max(0, safeNum(input.hourlyRate));
  const thresholdHours = clamp(safeNum(input.weeklyOvertimeThresholdHours, 40), 0, 168);
  const inputDays = Array.isArray(input.days) ? input.days : [];

  const days: TimecardDayResult[] = inputDays.map((d) => {
    const enabled = Boolean(d.enabled);
    if (!enabled) {
      return { label: d.label, enabled: false, workedMinutes: 0, workedHours: 0, isOvernight: false };
    }
    const { worked, isOvernight } = dayWorkedMinutes(d.startMinutes, d.endMinutes, d.breakMinutes);
    return {
      label: d.label,
      enabled: true,
      workedMinutes: worked,
      workedHours: round2(worked / 60),
      isOvernight,
    };
  });

  const totalWorkedMinutes = days.reduce((acc, d) => acc + d.workedMinutes, 0);
  const totalWorkedHours = totalWorkedMinutes / 60;
  const daysWorked = days.filter((d) => d.enabled && d.workedMinutes > 0).length;
  const averageDailyHours = daysWorked > 0 ? totalWorkedHours / daysWorked : 0;

  const regularHours = Math.min(totalWorkedHours, thresholdHours);
  const overtimeHours = Math.max(0, totalWorkedHours - thresholdHours);

  const hasPay = hourlyRate > 0;
  const regularPay = hasPay ? regularHours * hourlyRate : 0;
  const overtimePay = hasPay ? overtimeHours * hourlyRate * OVERTIME_MULTIPLIER : 0;
  const totalPay = regularPay + overtimePay;

  return {
    days,
    totalWorkedMinutes,
    totalWorkedHours: round2(totalWorkedHours),
    regularHours: round2(regularHours),
    overtimeHours: round2(overtimeHours),
    daysWorked,
    averageDailyHours: round2(averageDailyHours),
    hasPay,
    hourlyRate: round2(hourlyRate),
    regularPay: round2(regularPay),
    overtimePay: round2(overtimePay),
    totalPay: round2(totalPay),
    breakdown: days
      .filter((d) => d.enabled)
      .map((d) => ({ label: d.label, amount: round2(d.workedHours), colorClass: "bg-blue-400" })),
  };
}
