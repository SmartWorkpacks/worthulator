import { describe, it, expect } from "vitest";
import { calculatePomodoro, PomodoroInputs } from "./pomodoro";

const base: PomodoroInputs = {
  hoursAvailable: 6,
  sessionMinutes: 25,
  breakMinutes: 5,
  daysPerWeek: 5,
};

describe("core session math", () => {
  const r = calculatePomodoro(base);

  it("fits sessions accounting for between-session breaks", () => {
    // 360 min: (360 + 5) / 30 = 12.16 → 12 sessions
    expect(r.sessions).toBe(12);
  });

  it("deepWorkHours = sessions × sessionMinutes ÷ 60", () => {
    expect(r.deepWorkHours).toBe(5); // 12 × 25 / 60
  });

  it("break total = (sessions − 1) × breakMinutes", () => {
    expect(r.breakMinutes).toBe(11 * 5);
  });

  it("long breaks = one per 4 sessions", () => {
    expect(r.longBreaks).toBe(3);
  });
});

describe("session length effects", () => {
  it("longer sessions ⇒ fewer sessions", () => {
    const short = calculatePomodoro({ ...base, sessionMinutes: 25 });
    const long  = calculatePomodoro({ ...base, sessionMinutes: 90 });
    expect(long.sessions).toBeLessThan(short.sessions);
  });

  it("90-min sessions with 20-min breaks in 6h", () => {
    // 360 min: (360 + 20) / 110 = 3.45 → 3 sessions, 4.5 deep hours
    const r = calculatePomodoro({ hoursAvailable: 6, sessionMinutes: 90, breakMinutes: 20, daysPerWeek: 5 });
    expect(r.sessions).toBe(3);
    expect(r.deepWorkHours).toBe(4.5);
  });
});

describe("weekly totals", () => {
  it("weeklySessions = sessions × daysPerWeek", () => {
    const r = calculatePomodoro(base);
    expect(r.weeklySessions).toBe(12 * 5);
  });

  it("weeklyDeepHours = deepWorkHours × daysPerWeek", () => {
    const r = calculatePomodoro(base);
    expect(r.weeklyDeepHours).toBe(5 * 5);
  });
});

describe("focus density", () => {
  it("is between 0 and 100", () => {
    const r = calculatePomodoro(base);
    expect(r.focusDensity).toBeGreaterThan(0);
    expect(r.focusDensity).toBeLessThanOrEqual(100);
  });

  it("zero break ⇒ higher density than with breaks", () => {
    const withBreak = calculatePomodoro({ ...base, breakMinutes: 10 });
    const noBreak   = calculatePomodoro({ ...base, breakMinutes: 0 });
    expect(noBreak.focusDensity).toBeGreaterThan(withBreak.focusDensity);
  });
});

describe("edge cases", () => {
  it("clamps daysPerWeek to 7", () => {
    const r = calculatePomodoro({ ...base, daysPerWeek: 99 });
    expect(r.weeklySessions).toBe(r.sessions * 7);
  });

  it("zero hours → zero sessions", () => {
    const r = calculatePomodoro({ ...base, hoursAvailable: 0 });
    expect(r.sessions).toBe(0);
    expect(r.deepWorkHours).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculatePomodoro({ hoursAvailable: 0, sessionMinutes: 0, breakMinutes: 0, daysPerWeek: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
