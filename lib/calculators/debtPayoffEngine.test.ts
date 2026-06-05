import { describe, it, expect } from "vitest";
import { calculateDebtPayoff, type DebtEntry } from "./debtPayoffEngine";

const cc = (over: Partial<DebtEntry> = {}): DebtEntry => ({
  id: "cc", name: "Credit card", balance: 5000, interestRate: 21.5, minimumPayment: 100, ...over,
});
const car = (over: Partial<DebtEntry> = {}): DebtEntry => ({
  id: "car", name: "Car loan", balance: 12000, interestRate: 6.5, minimumPayment: 220, ...over,
});

describe("calculateDebtPayoff", () => {
  // ── Known values ────────────────────────────────────────────────────────

  it("single $10k @ 21.5% at fixed $200/mo clears in ~128 months", () => {
    const r = calculateDebtPayoff({
      debts: [cc({ balance: 10000, minimumPayment: 200 })],
      strategy: "minimum",
    });
    expect(r.debtFreeMonths).toBe(128);
    expect(r.totalInterestPaid).toBeGreaterThan(15000);
    expect(r.totalInterestPaid).toBeLessThan(16000);
  });

  it("raising the fixed payment cuts months and interest sharply", () => {
    const at200 = calculateDebtPayoff({ debts: [cc({ balance: 10000, minimumPayment: 200 })], strategy: "minimum" });
    const at400 = calculateDebtPayoff({ debts: [cc({ balance: 10000, minimumPayment: 400 })], strategy: "minimum" });
    expect(at400.debtFreeMonths).toBeLessThan(at200.debtFreeMonths);
    expect(at400.totalInterestPaid).toBeLessThan(at200.totalInterestPaid);
    expect(at400.debtFreeMonths).toBe(34);
  });

  it("default two-debt avalanche +$200 is debt-free in 43 months", () => {
    const r = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 200, strategy: "avalanche" });
    expect(r.debtFreeMonths).toBe(43);
    expect(r.totalDebt).toBe(17000);
    expect(r.minimumOnlyMonths).toBe(128);
  });

  // ── totals ──────────────────────────────────────────────────────────────

  it("totalPaid = totalDebt + totalInterestPaid (within rounding)", () => {
    const r = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 200, strategy: "avalanche" });
    expect(r.totalPaid).toBeCloseTo(r.totalDebt + r.totalInterestPaid, -1);
  });

  it("totalDebt is the sum of balances", () => {
    const r = calculateDebtPayoff({ debts: [cc({ balance: 4000 }), car({ balance: 8000 })], strategy: "avalanche" });
    expect(r.totalDebt).toBe(12000);
  });

  it("monthlyInterestBurn = sum of balance × APR/12", () => {
    const r = calculateDebtPayoff({ debts: [cc(), car()], strategy: "minimum" });
    const expected = Math.round((5000 * 21.5) / 100 / 12 + (12000 * 6.5) / 100 / 12);
    expect(r.monthlyInterestBurn).toBe(expected);
  });

  // ── Monotonicity ──────────────────────────────────────────────────────────

  it("higher APR → more total interest", () => {
    const low = calculateDebtPayoff({ debts: [cc({ interestRate: 10 })], extraMonthlyPayment: 50, strategy: "avalanche" });
    const high = calculateDebtPayoff({ debts: [cc({ interestRate: 25 })], extraMonthlyPayment: 50, strategy: "avalanche" });
    expect(high.totalInterestPaid).toBeGreaterThan(low.totalInterestPaid);
  });

  it("more extra payment → fewer months and less interest", () => {
    const base = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 0, strategy: "avalanche" });
    const more = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 400, strategy: "avalanche" });
    expect(more.debtFreeMonths).toBeLessThan(base.debtFreeMonths);
    expect(more.totalInterestPaid).toBeLessThan(base.totalInterestPaid);
  });

  it("a lump sum reduces months and interest", () => {
    const base = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 100, strategy: "avalanche" });
    const lump = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 100, lumpSumPayment: 5000, strategy: "avalanche" });
    expect(lump.debtFreeMonths).toBeLessThanOrEqual(base.debtFreeMonths);
    expect(lump.totalInterestPaid).toBeLessThan(base.totalInterestPaid);
  });

  // ── Strategy semantics ────────────────────────────────────────────────────

  it("avalanche total interest ≤ snowball total interest", () => {
    const debts = [
      cc({ id: "a", name: "Small high-rate", balance: 2000, interestRate: 24, minimumPayment: 50 }),
      cc({ id: "b", name: "Big low-rate", balance: 15000, interestRate: 8, minimumPayment: 200 }),
    ];
    const av = calculateDebtPayoff({ debts, extraMonthlyPayment: 300, strategy: "avalanche" });
    const sb = calculateDebtPayoff({ debts, extraMonthlyPayment: 300, strategy: "snowball" });
    expect(av.totalInterestPaid).toBeLessThanOrEqual(sb.totalInterestPaid);
  });

  it("avalanche pays the highest-rate debt first", () => {
    const debts = [
      cc({ id: "a", name: "Low rate big", balance: 10000, interestRate: 6, minimumPayment: 150 }),
      cc({ id: "b", name: "High rate small", balance: 3000, interestRate: 25, minimumPayment: 60 }),
    ];
    const av = calculateDebtPayoff({ debts, extraMonthlyPayment: 300, strategy: "avalanche" });
    expect(av.payoffOrder[0]).toBe("High rate small");
  });

  it("snowball pays the smallest balance first", () => {
    const debts = [
      cc({ id: "a", name: "Big balance", balance: 12000, interestRate: 20, minimumPayment: 200 }),
      cc({ id: "b", name: "Tiny balance", balance: 800, interestRate: 9, minimumPayment: 30 }),
    ];
    const sb = calculateDebtPayoff({ debts, extraMonthlyPayment: 300, strategy: "snowball" });
    expect(sb.payoffOrder[0]).toBe("Tiny balance");
  });

  // ── Savings vs minimum ──────────────────────────────────────────────────

  it("strategy with extra payment saves interest and months vs minimum", () => {
    const r = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 200, strategy: "avalanche" });
    expect(r.interestSaved).toBeGreaterThan(0);
    expect(r.monthsSaved).toBeGreaterThan(0);
    expect(r.totalInterestPaid).toBeLessThan(r.minimumOnlyInterest);
  });

  it("minimum strategy has zero interest/months saved vs itself", () => {
    const r = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 0, strategy: "minimum" });
    expect(r.interestSaved).toBe(0);
    expect(r.monthsSaved).toBe(0);
  });

  it("interestSaved and monthsSaved are never negative", () => {
    const r = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 200, strategy: "snowball" });
    expect(r.interestSaved).toBeGreaterThanOrEqual(0);
    expect(r.monthsSaved).toBeGreaterThanOrEqual(0);
  });

  // ── Structure / guards ────────────────────────────────────────────────────

  it("produces a monthly snapshot per month with declining balance", () => {
    const r = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 200, strategy: "avalanche" });
    expect(r.monthlySnapshots.length).toBe(r.debtFreeMonths);
    expect(r.monthlySnapshots[0].totalBalance).toBeGreaterThan(
      r.monthlySnapshots[r.monthlySnapshots.length - 1].totalBalance,
    );
  });

  it("payoffOrder lists every debt exactly once", () => {
    const r = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 200, strategy: "avalanche" });
    expect(r.payoffOrder).toHaveLength(2);
    expect(new Set(r.payoffOrder).size).toBe(2);
  });

  it("debtFreeDate is a human-readable month + year", () => {
    const r = calculateDebtPayoff({ debts: [cc()], extraMonthlyPayment: 100, strategy: "avalanche" });
    expect(r.debtFreeDate).toMatch(/^[A-Z][a-z]+ \d{4}$/);
  });

  it("terminates at the 600-month cap for an unpayable debt", () => {
    // Minimum below monthly interest → balance never falls; must hit the cap.
    const r = calculateDebtPayoff({
      debts: [cc({ balance: 20000, interestRate: 25, minimumPayment: 50 })],
      strategy: "minimum",
    });
    expect(r.debtFreeMonths).toBeLessThanOrEqual(600);
  });

  it("all top-level numeric outputs are finite", () => {
    const r = calculateDebtPayoff({ debts: [cc(), car()], extraMonthlyPayment: 200, lumpSumPayment: 1000, strategy: "avalanche" });
    for (const k of ["debtFreeMonths", "totalInterestPaid", "totalPaid", "totalDebt", "monthlyInterestBurn", "minimumOnlyMonths", "minimumOnlyInterest", "interestSaved", "monthsSaved"] as const) {
      expect(Number.isFinite(r[k]), `${k} finite`).toBe(true);
    }
  });
});
