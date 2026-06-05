import { describe, it, expect } from "vitest";
import {
  calculateEvVsGas,
  PUBLIC_DCFC_RATE,
  EV_PRICE_PREMIUM,
  GAS_INFLATION,
  type EvVsGasData,
} from "@/calculations/finance/evVsGas";

// Clean fixture so expectations are exact.
const DATA: EvVsGasData = { gasPrice: 4.0, homeElectricRate: 0.2 };
const BASE = { milesPerYear: 12000, mpg: 24, kwhPer100mi: 30, publicChargingPct: 0 };

describe("calculateEvVsGas — core economics", () => {
  it("computes annual gas/EV costs and savings from injected state prices", () => {
    const out = calculateEvVsGas(BASE, DATA);
    expect(out.annualGasCost).toBe(2000);   // (12000/24) * $4
    expect(out.annualEvCost).toBe(720);      // (12000/100) * 30 * $0.20
    expect(out.annualSavings).toBe(1280);
  });

  it("savings always equals gas cost minus EV cost", () => {
    const out = calculateEvVsGas(BASE, DATA);
    expect(out.annualSavings).toBe(out.annualGasCost - out.annualEvCost);
  });

  it("computes per-mile fuel costs", () => {
    const out = calculateEvVsGas(BASE, DATA);
    expect(out.gasCostPerMile).toBe(0.167); // 4 / 24
    expect(out.evCostPerMile).toBe(0.06);   // 0.30 * 0.20
  });

  it("recoups the EV premium at break-even = premium / annual savings", () => {
    const out = calculateEvVsGas(BASE, DATA);
    expect(out.breakEvenYears).toBeCloseTo(EV_PRICE_PREMIUM / out.annualSavings, 1);
  });
});

describe("calculateEvVsGas — blended home/public charging", () => {
  it("blends home and public DCFC rates by the charging mix", () => {
    const out = calculateEvVsGas({ ...BASE, publicChargingPct: 50 }, DATA);
    expect(out.effectiveKwhRate).toBe(
      Math.round((0.2 * 0.5 + PUBLIC_DCFC_RATE * 0.5) * 1000) / 1000,
    );
  });

  it("erodes savings as more charging happens on expensive public chargers", () => {
    const home   = calculateEvVsGas({ ...BASE, publicChargingPct: 0 }, DATA).annualSavings;
    const mixed  = calculateEvVsGas({ ...BASE, publicChargingPct: 50 }, DATA).annualSavings;
    const public_ = calculateEvVsGas({ ...BASE, publicChargingPct: 100 }, DATA).annualSavings;
    expect(home).toBeGreaterThan(mixed);
    expect(mixed).toBeGreaterThan(public_);
  });
});

describe("calculateEvVsGas — honest edge cases", () => {
  it("reports negative savings when electricity is dear and the gas car is efficient", () => {
    const out = calculateEvVsGas(
      { milesPerYear: 12000, mpg: 50, kwhPer100mi: 35, publicChargingPct: 0 },
      { gasPrice: 3.0, homeElectricRate: 0.41 },
    );
    expect(out.annualSavings).toBeLessThan(0);
    expect(out.breakEvenYears).toBe(99); // never breaks even
  });

  it("returns zeros for invalid inputs", () => {
    expect(calculateEvVsGas({ ...BASE, milesPerYear: 0 }, DATA).annualGasCost).toBe(0);
    expect(calculateEvVsGas({ ...BASE, mpg: 0 }, DATA).annualSavings).toBe(0);
  });
});

describe("calculateEvVsGas — 10-year projection", () => {
  it("matches an independent inflation-adjusted summation", () => {
    const out = calculateEvVsGas(BASE, DATA);
    let ref = 0;
    for (let i = 0; i < 10; i++) {
      ref += Math.max(0, out.annualGasCost * Math.pow(1 + GAS_INFLATION, i) - out.annualEvCost);
    }
    expect(out.fuelInflationSavings10yr).toBe(Math.round(ref));
  });

  it("total advantage adds maintenance savings on top of fuel", () => {
    const out = calculateEvVsGas(BASE, DATA);
    expect(out.totalAdvantage10yr).toBe(out.fuelInflationSavings10yr + out.maintenanceSavings10yr);
    expect(out.maintenanceSavings10yr).toBe(8000);
  });
});
