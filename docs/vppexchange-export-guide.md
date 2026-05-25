# VPPExchange Export Guide

## How to use `shared-calculator-core` in a new Next.js project

This guide covers everything needed to copy the shared calculator infrastructure
from Worthulator into a brand-new VPPExchange project.

---

## 1 — What to copy

Copy the entire `src/shared-calculator-core/` directory verbatim into your new project:

```
your-project/
  src/
    shared-calculator-core/       ← copy this whole folder
      engine/
        types.ts
        useCalculator.ts
        OutputCard.tsx
        CalculatorEngine.tsx
        CalculatorEngineLoader.tsx
      insights/
        types.ts
        projections.ts
        benchmarks.ts
        InsightCard.tsx
        LiveInsightBlock.tsx
        index.ts
      charts/
        RechartsLineChart.tsx
        RechartsBarChart.tsx
        RechartsDonutChart.tsx
        index.ts
      energy/
        types.ts
        assumptions.ts
        roiEngine.ts
        insightRules.ts
        index.ts
      data/
        defaults.ts
      utils/
        formatters.ts
      index.ts
```

> **DO NOT** copy anything from Worthulator's `app/`, `components/`, `lib/`,
> `data/`, or `calculations/` — those are Worthulator-specific.

---

## 2 — npm packages required

```bash
npm install next react react-dom
npm install recharts
npm install framer-motion
npm install tailwindcss @tailwindcss/typography postcss autoprefixer
npm install clsx tailwind-merge class-variance-authority
npm install lucide-react
npm install @radix-ui/react-slider @radix-ui/react-select @radix-ui/react-tooltip
npm install typescript @types/react @types/react-dom @types/node
```

For shadcn/ui components (optional but recommended):
```bash
npx shadcn@latest init
npx shadcn@latest add button card badge input label select slider tooltip
```

---

## 3 — tsconfig.json path alias

Add the `@/*` alias so imports work identically to Worthulator:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Usage in your calculators:
```ts
import { useCalculator } from "@/shared-calculator-core";
import { calcSolarRoi, VED } from "@/shared-calculator-core/energy";
import { formatKwh, formatYears } from "@/shared-calculator-core/utils/formatters";
```

---

## 4 — Tailwind v4 setup

`shared-calculator-core` uses Tailwind utility classes only (no custom design tokens).
Standard v4 setup works:

```css
/* app/globals.css */
@import "tailwindcss";
```

The engine components default to **blue** (`blue-*` classes, `#3b82f6`).
Override with `accentClass` prop on `InsightCard` and `OutputCard`:

```tsx
<InsightCard insight={i} accentClass="from-violet-400 to-violet-600" />
<OutputCard  output={o}  accentClass="from-violet-500 to-violet-700" />
```

---

## 5 — SSR / dynamic import requirement

All chart and engine components use `"use client"` and must be wrapped in
`dynamic(..., { ssr: false })` when used inside Next.js App Router pages.

The easiest way is to use `CalculatorEngineLoader` which handles this automatically:

```tsx
// app/tools/solar-roi/page.tsx
import CalculatorEngineLoader from "@/shared-calculator-core/engine/CalculatorEngineLoader";
import { solarRoiConfig }    from "@/lib/calculators/solarRoiConfig";

export default function SolarRoiPage() {
  return <CalculatorEngineLoader config={solarRoiConfig} />;
}
```

If you need charts on a page directly:
```tsx
import dynamic from "next/dynamic";
const RechartsLineChart = dynamic(
  () => import("@/shared-calculator-core/charts/RechartsLineChart"),
  { ssr: false }
);
```

---

## 6 — Initialising VPP Energy Defaults (VED)

Call `mergeDefaults()` once, before any calculator renders.
The best place is a root layout or a server component that renders before calculators:

```tsx
// app/layout.tsx or a dedicated "BootstrapDefaults" client component
"use client";
import { mergeDefaults } from "@/shared-calculator-core";
import { VED }           from "@/shared-calculator-core/energy";

mergeDefaults({
  utilityRatePerKwh:    VED.utilityRatePerKwh,
  electricityInflation: VED.electricityInflationRate,
  discountRate:         VED.discountRate,
});
```

After the first `getDefaults()` call, the object is frozen and further
`mergeDefaults()` calls are silently ignored (safe for SSR).

---

## 7 — Registering energy insight generators

`LiveInsightBlock` uses a global `GENERATOR_REGISTRY`.
Register your generators once in a layout or route:

```tsx
// lib/registerEnergyInsights.ts
"use client";
import { GENERATOR_REGISTRY }         from "@/shared-calculator-core/insights/LiveInsightBlock";
import { generateSolarRoiInsights }   from "@/shared-calculator-core/energy/insightRules";
import { generateBatteryRoiInsights } from "@/shared-calculator-core/energy/insightRules";
import { generateVppRoiInsights }     from "@/shared-calculator-core/energy/insightRules";

GENERATOR_REGISTRY["solar-roi"]   = generateSolarRoiInsights as any;
GENERATOR_REGISTRY["battery-roi"] = generateBatteryRoiInsights as any;
GENERATOR_REGISTRY["vpp-roi"]     = generateVppRoiInsights as any;
```

Import this file in your root layout (it registers on first client render):
```tsx
// app/layout.tsx
import "@/lib/registerEnergyInsights";
```

---

## 8 — Environment variables

The shared core has **no required env vars**.

Optional vars your host project may add:

| Variable                | Purpose                                   |
|------------------------|-------------------------------------------|
| `NEXT_PUBLIC_SITE_URL`  | Canonical URL for sitemaps / OG tags     |
| `SUPABASE_URL`          | Lead capture (if using Supabase)         |
| `SUPABASE_ANON_KEY`     | Lead capture                              |
| `RESEND_API_KEY`        | Email notifications                       |
| `NEXT_PUBLIC_GA_ID`     | Google Analytics                          |

---

## 9 — What is NOT included

These Worthulator features are **not** in `shared-calculator-core` and must be
built fresh for VPPExchange:

| Feature                     | Worthulator file(s)                    | VPPExchange equivalent                    |
|-----------------------------|----------------------------------------|-------------------------------------------|
| Meal-prep calculator        | `lib/calculators/meal-prep/`           | N/A                                       |
| US food cost benchmarks     | `lib/datasets/regional/usRegionalBenchmarks.ts` | `energy/assumptions.ts` (utility rates) |
| Expatistan/Numbeo scraper   | `scripts/updateCostBenchmarks.ts`      | `scripts/updateEnergyBenchmarks.ts` (build fresh) |
| Lead capture / Supabase     | `lib/leads.ts`, `lib/supabase/`        | Copy structure, update schema             |
| WorthCore PI system         | `components/pi/`, `lib/pi/`            | Not needed for energy calculators         |
| Region toggle (UK/US)       | `components/RegionToggle.tsx`          | Not needed unless UK energy market added  |
| IndexNow integration        | `lib/indexnow.ts`                      | Copy as-is — zero dependencies            |
| Sitemap / robots            | `app/sitemap.ts`, `app/robots.ts`      | Copy and update domain                    |

---

## 10 — Recommended folder structure for VPPExchange

```
vppexchange/
  app/
    layout.tsx
    page.tsx                     ← homepage
    tools/
      page.tsx                   ← tools directory
      solar-roi/
        page.tsx
      battery-roi/
        page.tsx
      vpp-simulator/
        page.tsx
      utility-intelligence/
        page.tsx
    api/
      leads/
        route.ts
  src/
    shared-calculator-core/      ← copied from Worthulator
    lib/
      calculators/               ← your CalculatorConfig objects
        solarRoiConfig.ts
        batteryRoiConfig.ts
        vppSimConfig.ts
      registerInsights.ts
    components/
      ui/                        ← shadcn components
      EnergyHero.tsx
      UtilityMap.tsx
  data/
    energy/
      utilityRates.ts            ← your regional data
```
