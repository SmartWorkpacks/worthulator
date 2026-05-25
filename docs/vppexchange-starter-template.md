# VPPExchange Starter Template

## Complete working code patterns for the first four calculators

Copy these templates into your VPPExchange project.  
They are designed to slot directly into the `shared-calculator-core` infrastructure.

---

## 1 — CalculatorConfig: Solar ROI

```ts
// src/lib/calculators/solarRoiConfig.ts
import type { CalculatorConfig } from "@/shared-calculator-core/engine/types";
import { calcSolarRoi }          from "@/shared-calculator-core/energy/roiEngine";
import { VED }                   from "@/shared-calculator-core/energy/assumptions";
import { formatCurrency, formatKwh, formatYearsMonths } from "@/shared-calculator-core/utils/formatters";

export const solarRoiConfig: CalculatorConfig = {
  id:       "solar-roi",
  slug:     "solar-roi-calculator",
  title:    "Solar ROI Calculator",
  category: "energy",
  description: "Calculate payback period, 25-year net value, and CO₂ savings for any solar system.",

  inputs: [
    {
      key: "systemSizeKw", label: "System size (kW)", type: "slider",
      min: 1, max: 30, step: 0.5, defaultValue: 8,
      helpText: "Typical US home: 6–12 kW",
    },
    {
      key: "installedCost", label: "Installed cost ($)", type: "slider",
      min: 5_000, max: 80_000, step: 500, defaultValue: 24_000,
      helpText: "Before federal tax credit (30% ITC applied automatically)",
    },
    {
      key: "monthlyBill", label: "Monthly electric bill ($)", type: "slider",
      min: 50, max: 600, step: 10, defaultValue: 150,
    },
    {
      key: "utilityRate", label: "Utility rate (¢/kWh)", type: "slider",
      min: 8, max: 50, step: 0.5, defaultValue: 16.6,
      helpText: "Check your utility bill. US avg: 16.6¢",
    },
    {
      key: "peakSunHours", label: "Peak sun hours/day", type: "slider",
      min: 2.5, max: 7.5, step: 0.1, defaultValue: VED.avgPeakSunHours,
      helpText: "Southwest US: 5.5–7. Northeast: 3.5–4.5",
    },
  ],

  calculate(inputs) {
    const rate  = (inputs.utilityRate as number) / 100;
    const monthly = inputs.monthlyBill as number;
    const result = calcSolarRoi({
      system: {
        systemSizeKw:     inputs.systemSizeKw as number,
        moduleEfficiency: VED.moduleEfficiency,
        performanceRatio: VED.performanceRatio,
        installedCost:    inputs.installedCost as number,
        taxCreditRate:    VED.federalTaxCreditRate,
      },
      utilityRate:       { flatRate: rate, netMeteringRate: rate },
      peakSunHours:      inputs.peakSunHours as number,
      monthlyBaselineKwh: monthly / rate,
    });
    return {
      annualProduction:    result.annualProductionKwh,
      annualSavings:       result.annualSavings,
      payback:             result.paybackPeriodYears,
      netValue25yr:        result.twentyFiveYearNetValue,
      co2PerYear:          result.co2OffsetTonnesPerYear,
      effectiveCost:       result.effectiveCostAfterCredit,
    };
  },

  outputs: [
    { key: "annualSavings",  label: "Year 1 Savings",       format: (v) => formatCurrency(v as number), highlight: true },
    { key: "payback",        label: "Payback Period",        format: (v) => formatYearsMonths(v as number) },
    { key: "netValue25yr",   label: "25-Year Net Value",     format: (v) => formatCurrency(v as number) },
    { key: "annualProduction", label: "Annual Production",   format: (v) => formatKwh(v as number) },
    { key: "co2PerYear",     label: "CO₂ Offset / Year",    format: (v) => `${(v as number).toFixed(1)} t` },
    { key: "effectiveCost",  label: "Net Cost After ITC",    format: (v) => formatCurrency(v as number), secondary: true },
  ],
};
```

---

## 2 — CalculatorConfig: Battery ROI

```ts
// src/lib/calculators/batteryRoiConfig.ts
import type { CalculatorConfig } from "@/shared-calculator-core/engine/types";
import { calcBatteryRoi }        from "@/shared-calculator-core/energy/roiEngine";
import { VED }                   from "@/shared-calculator-core/energy/assumptions";
import { formatCurrency, formatYearsMonths, formatKwh } from "@/shared-calculator-core/utils/formatters";

export const batteryRoiConfig: CalculatorConfig = {
  id: "battery-roi", slug: "battery-storage-roi-calculator",
  title: "Battery Storage ROI Calculator", category: "energy",
  description: "Calculate payback period and 20-year net value for residential battery storage.",

  inputs: [
    {
      key: "capacityKwh", label: "Battery capacity (kWh)", type: "slider",
      min: 5, max: 40, step: 1, defaultValue: 13.5,
      helpText: "Tesla Powerwall 3: 13.5 kWh. Enphase IQ: 5 kWh",
    },
    {
      key: "installedCost", label: "Installed cost ($)", type: "slider",
      min: 5_000, max: 40_000, step: 500, defaultValue: 14_000,
    },
    {
      key: "utilityRate", label: "Utility rate (¢/kWh)", type: "slider",
      min: 8, max: 50, step: 0.5, defaultValue: 16.6,
    },
    {
      key: "hasTou", label: "Time-of-use (TOU) rates?", type: "toggle",
      defaultValue: false,
      helpText: "TOU rates typically double battery arbitrage savings",
    },
  ],

  calculate(inputs) {
    const rate       = (inputs.utilityRate as number) / 100;
    const hasTou     = inputs.hasTou as boolean;
    const capacity   = inputs.capacityKwh as number;
    const touTiers   = hasTou ? [{
      name: "On-peak", ratePerKwh: rate * VED.peakRateMultiplier,
      startHour: 16, endHour: 21,
    }] : undefined;

    const result = calcBatteryRoi({
      system: {
        capacityKwh:      capacity,
        efficiency:       VED.batteryEfficiency,
        powerKw:          VED.batteryPowerKw,
        installedCost:    inputs.installedCost as number,
      },
      utilityRate:         { flatRate: rate, touTiers },
      dailyLoadKwh:        capacity * 0.8,
      dailyDischargeHours: 4,
    });
    return {
      annualSavings:   result.annualSavingsEstimate,
      payback:         result.paybackPeriodYears,
      netValue10yr:    result.tenYearNetValue,
      netValue20yr:    result.twentyYearNetValue,
      lifetimeKwh:     result.lifetimeKwhGenerated,
      co2Offset:       result.co2OffsetTonnes,
    };
  },

  outputs: [
    { key: "annualSavings", label: "Annual Savings",        format: (v) => formatCurrency(v as number), highlight: true },
    { key: "payback",       label: "Payback Period",        format: (v) => formatYearsMonths(v as number) },
    { key: "netValue20yr",  label: "20-Year Net Value",     format: (v) => formatCurrency(v as number) },
    { key: "netValue10yr",  label: "10-Year Net Value",     format: (v) => formatCurrency(v as number), secondary: true },
    { key: "lifetimeKwh",   label: "Lifetime kWh",          format: (v) => formatKwh(v as number) },
    { key: "co2Offset",     label: "CO₂ Offset (20 yr)",   format: (v) => `${(v as number).toFixed(1)} t` },
  ],
};
```

---

## 3 — CalculatorConfig: VPP Simulator

```ts
// src/lib/calculators/vppSimConfig.ts
import type { CalculatorConfig }  from "@/shared-calculator-core/engine/types";
import { calcVppAnnualRevenue }   from "@/shared-calculator-core/energy/roiEngine";
import { VED }                    from "@/shared-calculator-core/energy/assumptions";
import { formatCurrency, formatYearsMonths } from "@/shared-calculator-core/utils/formatters";

export const vppSimConfig: CalculatorConfig = {
  id: "vpp-simulator", slug: "vpp-revenue-calculator",
  title: "VPP Revenue Calculator", category: "energy",
  description: "Estimate annual earnings from Virtual Power Plant dispatch programs.",

  inputs: [
    {
      key: "capacityKwh", label: "Battery capacity (kWh)", type: "slider",
      min: 5, max: 40, step: 1, defaultValue: 13.5,
    },
    {
      key: "dispatchRate", label: "Dispatch incentive (¢/kWh)", type: "slider",
      min: 5, max: 40, step: 1, defaultValue: 15,
      helpText: "Check your utility's VPP rate. Typical: 10–25¢",
    },
    {
      key: "eventsPerYear", label: "Dispatch events/year", type: "slider",
      min: 5, max: 60, step: 5, defaultValue: 15,
      helpText: "Most US VPP programs: 10–30 events/year",
    },
    {
      key: "utilityRate", label: "Utility rate (¢/kWh)", type: "slider",
      min: 8, max: 50, step: 0.5, defaultValue: 16.6,
    },
    {
      key: "installedCost", label: "Battery installed cost ($)", type: "slider",
      min: 5_000, max: 40_000, step: 500, defaultValue: 14_000,
    },
  ],

  calculate(inputs) {
    const rate = (inputs.utilityRate as number) / 100;
    const result = calcVppAnnualRevenue({
      battery: {
        capacityKwh:      inputs.capacityKwh as number,
        efficiency:       VED.batteryEfficiency,
        powerKw:          VED.batteryPowerKw,
        installedCost:    inputs.installedCost as number,
      },
      program: {
        name:                  "Custom VPP Program",
        dispatchRatePerKwh:    (inputs.dispatchRate as number) / 100,
        dispatchEventsPerYear: inputs.eventsPerYear as number,
        eventDurationHours:    VED.vppEventDurationHours,
        maxExportPerEventKwh:  (inputs.capacityKwh as number) * VED.batteryEfficiency,
        annualCapacityPayment: VED.vppAnnualCapacityPayment,
      },
      utilityRate: { flatRate: rate },
    });
    return {
      vppRevenue:   result.annualVppRevenue,
      arbitrage:    result.annualGridArbitrageSavings,
      total:        result.totalAnnualBenefit,
      monthly:      result.totalAnnualBenefit / 12,
      fiveYear:     result.fiveYearBenefit,
      tenYear:      result.tenYearBenefit,
      payback:      result.paybackPeriodYears,
    };
  },

  outputs: [
    { key: "total",      label: "Total Annual Benefit",   format: (v) => formatCurrency(v as number), highlight: true },
    { key: "monthly",    label: "Monthly Earnings",       format: (v) => formatCurrency(v as number) },
    { key: "payback",    label: "Payback Period",         format: (v) => formatYearsMonths(v as number) },
    { key: "tenYear",    label: "10-Year Benefit",        format: (v) => formatCurrency(v as number) },
    { key: "vppRevenue", label: "VPP Dispatch Revenue",   format: (v) => formatCurrency(v as number), secondary: true },
    { key: "arbitrage",  label: "Grid Arbitrage Savings", format: (v) => formatCurrency(v as number), secondary: true },
  ],
};
```

---

## 4 — Page: Solar ROI Calculator

```tsx
// app/tools/solar-roi/page.tsx
import type { Metadata } from "next";
import CalculatorEngineLoader from "@/shared-calculator-core/engine/CalculatorEngineLoader";
import { solarRoiConfig }    from "@/lib/calculators/solarRoiConfig";

export const metadata: Metadata = {
  title:       "Solar ROI Calculator | VPPExchange",
  description: "Calculate payback period, 25-year net value, and CO₂ savings for your solar system.",
};

export default function SolarRoiPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Solar ROI Calculator</h1>
      <p className="text-gray-500 mb-8">
        Enter your system details to see exact payback, savings, and CO₂ impact.
      </p>
      <CalculatorEngineLoader config={solarRoiConfig} />
    </main>
  );
}
```

---

## 5 — Page: Tools Directory

```tsx
// app/tools/page.tsx
import Link from "next/link";

const tools = [
  { slug: "solar-roi",               title: "Solar ROI Calculator",       desc: "Payback, 25-yr value, CO₂" },
  { slug: "battery-storage-roi",     title: "Battery Storage ROI",        desc: "TOU arbitrage, 20-yr NPV" },
  { slug: "vpp-revenue",             title: "VPP Revenue Calculator",     desc: "Annual dispatch earnings" },
  { slug: "utility-intelligence",    title: "Utility Intelligence",       desc: "Compare state electricity rates" },
];

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Energy Calculators</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {tools.map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`}
            className="block p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="font-semibold text-gray-900 mb-1">{t.title}</p>
            <p className="text-sm text-gray-400">{t.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

---

## 6 — Adding a cashflow chart to any calculator page

```tsx
"use client";
import { useState }          from "react";
import { buildCashflowTable } from "@/shared-calculator-core/energy/roiEngine";
import dynamic               from "next/dynamic";
import { formatCurrency }    from "@/shared-calculator-core/utils/formatters";

const RechartsLineChart = dynamic(
  () => import("@/shared-calculator-core/charts/RechartsLineChart"),
  { ssr: false }
);

export function SolarCashflowChart({
  installedCost,
  year1Savings,
}: { installedCost: number; year1Savings: number }) {
  const rows = buildCashflowTable(installedCost, year1Savings);

  return (
    <RechartsLineChart
      data={rows}
      xKey="year"
      lines={[
        { key: "cumulative",    name: "Cumulative Savings",   color: "#3b82f6", strokeWidth: 2 },
        { key: "npvCumulative", name: "NPV (5% discount)",    color: "#6366f1", strokeDashArray: "4 2" },
      ]}
      yFormatter={(v) => formatCurrency(v, "en-US", "USD", 0)}
      referenceLines={[{ y: 0, label: "Break-even", color: "#f43f5e" }]}
      xAxisLabel="Year"
      yAxisLabel="$ Value"
      title="25-Year Cashflow"
      height={300}
      area
    />
  );
}
```

---

## 7 — Lead capture (minimal)

```ts
// app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, calculatorId, outputs } = body;

  // Validate
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Store in Supabase (or any DB)
  // const { error } = await supabase.from("leads").insert({ email, calculatorId, outputs });

  return NextResponse.json({ success: true });
}
```

---

## 8 — Recommended routes

| Route                           | Calculator                        | Priority |
|--------------------------------|-----------------------------------|----------|
| `/tools/solar-roi-calculator`   | `solarRoiConfig`                  | P0       |
| `/tools/battery-storage-roi`    | `batteryRoiConfig`                | P0       |
| `/tools/vpp-revenue-calculator` | `vppSimConfig`                    | P0       |
| `/tools/utility-intelligence`   | Regional rate comparison (custom) | P1       |
| `/tools/ev-charging-cost`       | Custom EV config                  | P1       |
| `/tools/home-energy-audit`      | Custom audit config               | P2       |
| `/tools/carbon-footprint`       | Custom carbon config              | P2       |

---

## 9 — Architecture checklist

- [ ] `src/shared-calculator-core/` copied from Worthulator
- [ ] `tsconfig.json` has `@/*` → `./src/*` path alias
- [ ] `tailwind.config.ts` configured for `src/**` and `app/**`
- [ ] `mergeDefaults()` called in root layout before any calculator renders
- [ ] `GENERATOR_REGISTRY` populated in `lib/registerInsights.ts`, imported in layout
- [ ] All calculator pages use `CalculatorEngineLoader` (handles `ssr: false`)
- [ ] Direct chart imports use `dynamic(..., { ssr: false })`
- [ ] Supabase schema includes `leads` table with `(email, calculator_id, outputs jsonb, created_at)`
- [ ] `scripts/updateEnergyBenchmarks.ts` created to refresh `energy/assumptions.ts` annually
