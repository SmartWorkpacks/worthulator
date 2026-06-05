# Flagship Calculator Standard — Custom-Loader + Shared Insight Kit

> **This is the canonical standard for all Worthulator calculators.**
> Every calculator should match the **Freelance Rate Calculator** archetype:
> a bespoke client component driven by a pure engine, rendered through the
> **staged-reveal loader** with a **dark hero result**, **smart insight cards**,
> and **Recharts visuals** — all sourced from the shared *Insight Kit* so each
> calculator stays thin.
>
> Gold reference (copy this):
> - `app/tools/freelance-rate-calculator/page.tsx`
> - `app/tools/freelance-rate-calculator/FreelanceRateCalculator.tsx`
> - `app/tools/freelance-rate-calculator/FreelanceRateCalculatorLoader.tsx`
> - `lib/calculators/freelanceRateEngine.ts` (+ `.test.ts`)

---

## 0. Where this sits vs. the old playbook

`docs/CALCULATOR-ROLLOUT-PLAYBOOK.md` describes the **config-engine** flow
(`calculatorConfigs.ts` + `lib/insights/generators/` + `LiveInsightBlock`). That
remains valid for simple, data-driven tools, **but the flagship bar is now the
custom-loader archetype documented here.** When upgrading a calculator "to
standard", you are moving it to this pattern. Keep the playbook's universal
rules: factual copy, sourced constants, excellent defaults, Step 5b page-copy
sync, and live-data auto-refresh (Step 5c) where a dataset is involved.

---

## 1. The Insight Kit (shared — do not re-implement)

Import from `@/src/templates/insights`:

| Export | What it does |
|---|---|
| `useStagedReveal(steps)` | Orchestrates `idle → analyzing → revealed`, drives the progress loader, auto-runs once on mount, then live-updates. Returns `{ revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp }`. |
| `ResultHeroCard` | Dark headline card: one big count-up number + accent glow + optional status note + up to 4 count-up sub-stats. |
| `InsightList` / `InsightCard` (`type Insight`) | Colour-coded `positive`/`warning`/`neutral` insight cards; leading figure auto-extracted. |
| `ImpactLineChart` | "How X changes as Y moves" line chart with optional reference line. |
| `BreakdownBarChart` (`type BreakdownDatum`) | Horizontal "what each unit covers" breakdown bars + legend. |
| `NumInput`, `SectionLabel` | Shared inputs (pair with `RangeSliderCard`). |

Pair with the existing shells:
- `WorthulatorProgressLoader`, `WorthulatorResultReveal` (`@/src/templates/shared/…`)
- `RangeSliderCard`, `CalcDisclaimer` (`@/src/templates/take-home-pay`)
- `useCountUp` (`@/src/templates/shared/useCountUp`) — already used internally by `ResultHeroCard`; use directly if you need a custom count-up.

> **Rule:** never re-define a count-up hook, insight card, chart, hero card, or
> staged-reveal loop inside a calculator. If the kit can't express something,
> extend the kit (and this doc), don't fork.

---

## 2. Per-calculator file structure

```
lib/calculators/<name>Engine.ts            # pure engine (no React, deterministic)
lib/calculators/<name>Engine.test.ts       # Vitest: ≥6 tests, known values + invariants
app/tools/<slug>/<Name>Calculator.tsx      # "use client" — thin shell using the Insight Kit
app/tools/<slug>/<Name>CalculatorLoader.tsx# dynamic() ssr:false loader
app/tools/<slug>/page.tsx                  # server component: metadata, hero, SEO, FAQ, JSON-LD
docs/dossiers/<slug>.md                     # design dossier (fill BEFORE coding)
```

**Engine rules:** export typed `Inputs`/`Result`; pure & synchronous; guard
zero/negative/NaN (return zeros, never NaN/Infinity); document every constant
with a source. Inject live data via an argument — never read datasets inside
the engine.

**Component rules:** local `useState` per input → call the engine synchronously
each render (results update live) → render through `useStagedReveal`. Keep the
left input column `lg:sticky lg:top-6`. Calculator-specific widgets (e.g. an
interactive scenario table) stay local; everything generic comes from the kit.

---

## 3. Definition of Done (per calculator)

- [ ] Dossier in `docs/dossiers/<slug>.md`
- [ ] Pure engine in `lib/calculators/<name>Engine.ts` with **≥6 tests** (known
      values + invariants: monotonicity, conservation, zero/NaN guards) — `npm test` green
- [ ] Client component uses the **Insight Kit**: `useStagedReveal` + loaders,
      `ResultHeroCard`, `InsightList`, and ≥1 chart (`ImpactLineChart` /
      `BreakdownBarChart`) where it adds genuine insight
- [ ] No bespoke re-implementations of kit components; no leftover legacy
      `InsightTable`/`InsightsSection`
- [ ] **Step 5b — page copy synced:** metadata, hero copy/chips, `SEOTextBlock`
      formula (must match the engine **exactly**, incl. every gross-up/multiplier),
      steps (one per real input), stat chips, content cards, and **FAQ worked
      examples recomputed**. Feeds `FAQPage` JSON-LD.
- [ ] **No invented stats.** Every figure in copy is defensible/sourced or
      reframed as a clearly-typical range. No fake precise percentages.
- [ ] **No misleading "Live" badge** unless the calculator genuinely uses a live
      dataset (Step 5c auto-refresh then applies).
- [ ] Clever-but-simple: excellent defaults (useful before any input), optional
      overrides with one-line hints, no copy advertising the overrides
- [ ] `npx tsc --noEmit` clean, `npm run lint` clean, page renders `200`

---

## 4. Live data & auto-updating copy (CRITICAL for live-data calculators)

Worthulator's moat is **state-accurate, weekly-refreshed real-world data** injected
into calculators. The pipeline (see `docs/LIVE-DATA-MOAT-STATUS.md` +
`lib/datasets/refreshRegistry.ts`):

```
source (Apify/FRED) → refresh script → lib/datasets/*.ts (committed)
  → GitHub Action rewrites + pushes weekly → Vercel rebuild → pages re-render
```

**Hard rules:**

1. **Calculators NEVER fetch at runtime.** Import the local dataset file only
   (e.g. `getUSStateFuelPrice`, `fredBenchmarks`). No `fetch`, no API routes from
   a calculator. The refresh scripts + Action are the only writers.
2. **Existing datasets** (consume these — do not duplicate): fuel, electricity,
   natural gas, water, cigarettes, sales tax, median wages, net-worth percentiles,
   and FRED macro rates (`lib/datasets/finance/fredBenchmarks.ts`: CPI/inflation,
   auto-loan APR, credit-card APR, HYSA/CD APY, …).
3. **Need a series that doesn't exist** (e.g. live mortgage rate)? **Do NOT add a
   runtime fetch.** Flag Owner A to add it to `refreshRegistry.ts` + a refresh
   script. Until then, use a clearly-sourced static default.
4. **Auto-updating copy — derive, never hardcode.** Any figure in page copy that
   comes from a dataset (stat chips, FAQ answers, content cards, InsightStrip,
   JSON-LD) **must be computed at render from the imported dataset**, and stamped
   with an "as of" label from the dataset's `currentPeriodLabel`/`lastUpdated`.
   Hardcoding a live number (e.g. `"$3.85/gal"`) makes it go stale weekly and
   breaks the moat.

**Gold pattern** — `app/tools/ev-vs-gas/page.tsx` computes a live worked example at
module scope and interpolates it everywhere:

```ts
const LIVE_GAS = getUSStateFuelPrice("National");
const EX = calculateEvVsGas(EX_INPUTS, { gasPrice: LIVE_GAS, /* … */ });
const AS_OF = usStateFuelDataset.currentPeriodLabel;
// …then: stat={usd(EX.annualSavings)} … `…$${LIVE_GAS.toFixed(2)}/gal (${AS_OF})`
```

When the Action refreshes the dataset and pushes, the rebuild re-renders this page
and **every number + the structured data updates automatically**.

> DoD addition for live-data calculators: at least one dataset consumed; the
> default state/national value loads from it; and **all data-derived copy is
> interpolated + "as of"-stamped**, verified to change when the dataset changes.

---

## 5. Quick start (copy the reference)

1. Copy the four freelance files; rename `Freelance*`/`freelance*` → your calc.
2. Rewrite the engine (`Inputs`/`Result` + pure math + sourced constants); write tests.
3. In the component, map engine outputs to `ResultHeroCard` sub-stats, build the
   `Insight[]` array, and feed `ImpactLineChart`/`BreakdownBarChart` from engine arrays.
4. Rewrite `page.tsx` copy to match the engine (Step 5b) — recompute FAQ numbers.
   If live data applies, follow §4: derive + stamp, never hardcode.
5. Verify: `npm test`, `npx tsc --noEmit`, `npm run lint`, load the page.
