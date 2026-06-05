# Worthulator Calculator Rollout — Build Playbook (Handoff)

> Read this fully before building any calculator. It encodes the standard,
> the architecture, the exact recipe, and the hard-won gotchas. Follow it and
> quality/structure stay consistent across all 100+ calculators.

---

## 0. Prime directive (the "why")

These calculators are **lead-gen flagships**. The wow factor comes from
**human realism, trust, and intelligence — never gimmicks.**

- **No cheesy hooks, no filler one-liners.** Let *facts* create the wow.
- Every calculator must be **genuinely the best version of itself on the web**:
  custom fields, custom logic, real datasets, real content.
- "Simple and very clever" is great. "Basic" is not. If a field adds real
  value, it must be there. If it adds noise, leave it out.
- **Logic must be correct and tested.** Pin it with unit tests.
- Prefer **live data** (state-level, current) over generic averages — that
  state-level realism is exactly what makes `meal-prep` feel alive.

### The core principle: clever under the surface, simple on top

> **Every calculator — already built and not-yet-built — must be the smartest
> AND the simplest to use.** These are not in tension. The intelligence lives in
> the engine room; the cockpit stays effortless.

- **Smart under the surface:** live data, real formulas, sensible defaults,
  inflation/real-value adjustments, edge-case handling, honest provenance. Do
  the hard, accurate thing in the calc module and generator.
- **Simple on the surface:** a user should get a great answer with zero reading
  and zero configuration. Defaults must be excellent out of the box.
- **Sensible defaults beat required inputs.** Pre-fill with the best live/typical
  value so the calculator is instantly useful before the user touches anything.
- **Overrides are optional and self-evident — never advertised.** Users already
  expect to enter their own numbers (e.g. their real hourly rate). Provide the
  override field with a one-line hint and move on. **Do NOT** add FAQs, hero
  chips, SEO steps, or paragraphs explaining "you can use your own value" — that
  is clutter for something users assume. Let the field speak for itself.
- **Don't over-explain in copy.** If the UI makes it obvious, the docs/FAQ
  shouldn't repeat it. Reserve copy for genuinely useful methodology and facts.
- **Hide complexity, never accuracy.** Simplify the *interface*, never dumb down
  the *math*. The override caption must stay honest (e.g. drop the live "BLS"
  stamp when the number is user-entered).

### Live data flows to EVERY surface — not just the calculator

> **When a dataset refreshes (weekly via Apify/FRED), the *entire page* must move
> with it — insights, FAQ worked examples, stat chips, SEO paragraphs, the
> InsightStrip, and the JSON-LD — not only the calculator widget.**

- **Derive copy from data; never hardcode a live number as a string.** Any number
  on the page that comes from a dataset (a state gas price, the national median
  wage, a $/year example computed from those) must be **computed at render time**
  from the same getter + calc module the calculator uses — then interpolated into
  the copy. Hardcoding `"$11,555/year"` in an FAQ guarantees it goes stale the
  next refresh and ships a wrong number to Google via `FAQPage` JSON-LD.
- **Compute the worked example once, reference it everywhere.** Pick the page's
  default inputs, run the real calc with live data at the top of the page module,
  and feed that single result into FAQ/STATS/SEO/InsightStrip. One source of
  truth → everything stays internally consistent and auto-refreshes together.
- **Stamp the vintage dynamically too.** Use the dataset's `currentPeriodLabel`
  for "as of …" text so the freshness label updates with the data.
- **Static = the narrative, not the numbers.** Prose, framing, and methodology
  stay fixed; the figures inside them are dynamic. If a *claim* (not just a
  number) could break on refresh (e.g. "more than a decade of …"), make the
  threshold dynamic too or phrase it so it stays true.

### Scope: single-flow only
Build **single-flow** calculators here: one input set → instant result + insights.
These can be clever and sophisticated. **Do NOT** attempt the complex,
multistep / heavy-data calculators in this pipeline (e.g. **rent-vs-buy**,
**personal-injury**) — those are handled separately.

---

## 1. Flagship references (copy these, don't reinvent)

| Reference | What to copy from it |
|---|---|
| `meal-prep-calculator` | Data quality, logic depth, conserved-total invariants, regional realism |
| `ev-vs-gas` | State dropdown → **live** prices, blended-rate "clever realism", full visual insight set with live captions |
| `appliance-energy-cost` | Most recent, cleanest end-to-end example of the live-data archetype |

When in doubt, open `ev-vs-gas` or `appliance-energy-cost` and mirror their
structure exactly.

---

## 2. Architecture map (where everything lives)

**Engine (the shared template — do not fork):**
- `components/calculator-engine/CalculatorEngine.tsx` — renders the 2-col grid.
  Inputs column is already `lg:sticky lg:top-20 lg:self-start` (app-like pin).
- `components/calculator-engine/CalculatorEngineLoader.tsx` — client loader;
  exposes the `afterResults={(outputs, values) => ...}` render-prop hook.
- `components/calculator-engine/calculatorConfigs.ts` — **the big one**
  (~2,000+ lines). One config object per slug. Edit your slug's block only.
- `components/calculator-engine/types.ts` — `CalculatorValues = Record<string, number|string>`,
  `CalculatorOutputs = Record<string, number>`, input/output/config types.

**Page shell (every simple calculator uses these):**
- `src/templates/take-home-pay/SimpleCalculatorHero.tsx` — hero + bg.
  ⚠️ Uses `overflow-clip` (NOT `overflow-hidden`) so sticky works. Don't change.
- `src/templates/take-home-pay/StandardSEOSection.tsx` — `StatChipsRow`,
  `ContentCardGrid`, `SEOTextBlock`, `InsightStrip`, `RelatedCalcCards`.
- `src/templates/take-home-pay/StandardFAQSection.tsx`.

**Pure calculation logic (testable, no React):**
- `calculations/<domain>/<name>.ts` + `calculations/<domain>/<name>.test.ts`.
  Domains seen: `finance/`, `lifestyle/`, `energy/`. Add new domains as needed.

**Insights (WorthCore):**
- `lib/insights/types.ts` — `Insight`, `InsightVisualization`, `VisualCaption`.
- `lib/insights/benchmarks.ts` — `formatCurrency`, `formatCurrencyPrecise`.
- `lib/insights/generators/<name>Insights.ts` — your typed generator.
- `lib/insights/index.ts` — barrel; re-export your generator here.
- `components/worthcore/visuals/InsightVisual.tsx` — the 4 visual primitives.
- `components/worthcore/InsightCard.tsx` — renders one insight.
- `components/worthcore/LiveInsightBlock.tsx` — `GENERATOR_REGISTRY` maps slug →
  generator with a typed adapter. **Add your slug here.**
- `components/worthcore/<Name>WithInsights.tsx` — thin wrapper that wires the
  loader's `afterResults` to `<LiveInsightBlock>`. **Create one per calculator.**

**Datasets + live data:**
- `lib/datasets/regional/usStateElectricityPrices.ts` — live all-in $/kWh by state.
- `lib/datasets/usStateFuelPrices.ts` — live $/gal by state (AAA).
- `lib/datasets/regional/usStateCigarettePrices.ts` — live $/pack by state (CDC/Tax Foundation).
- `lib/datasets/regional/usStateNaturalGasPrices.ts` — live $/therm by state (EIA).
- `lib/datasets/regional/usStateWaterRates.ts` — live combined water + sewer $/1,000 gal by state.
- `lib/datasets/regional/usRegionalBenchmarks.ts` — cost-of-living benchmarks.
- `lib/datasets/refreshRegistry.ts` — registry of refreshable data sources.
- `scripts/updateEnergyPrices.ts` — Apify scraper (gas + electricity + cigarettes). All-in
  EIA electricity source (NOT energy-only). Accepts `APIFY_TOKEN` or `APIFY_API_TOKEN`.
- `scripts/updateCostBenchmarks.ts` — Apify scraper (cost benchmarks).
- Run live refresh: `npm run energy:refresh`.
- **Automated** weekly + manual via `.github/workflows/refresh-live-data.yml`
  (needs repo secret `APIFY_API_TOKEN`).

> **Live-data status & roadmap → `docs/LIVE-DATA-MOAT-STATUS.md`** is the single
> source of truth for which calculators use live data and what's planned.

**Docs:**
- `docs/calculator-build-dossier-template.md` — the dossier template.
- `docs/dossiers/<slug>.md` — one filled dossier per calculator.

---

## 3. The build recipe (do these in order, every time)

> ⚠️ **AGENTS.md rule:** this is Next.js 16 with breaking changes. Before writing
> any Next-specific code, read the relevant guide in `node_modules/next/dist/docs/`.

### Step 1 — Dossier first (think before coding)
Create `docs/dossiers/<slug>.md` from the template. Decide: identity/promise,
fields (and *why each matters*), outputs, exact formulas, documented constants
(with sources), invariants to test, datasets, the insight set + which visual
each uses. **Design the calculator to be the best one out there before touching code.**

### Step 2 — Pure calc module + tests
- `calculations/<domain>/<slug>.ts`: export documented constants, typed
  `Inputs`/`Data`/`Result` interfaces, and a pure `calculate<Name>(inputs, data)`.
- **Inject live data** (rates/prices) via the `data` arg — never read datasets
  inside the calc module (keeps it pure and testable).
- The `Result` interface must be assignable to `CalculatorOutputs`
  (`Record<string, number>`): add `[key: string]: number;` to it (all fields numeric).
- Write `<slug>.test.ts` (Vitest): pin known values + invariants (conservation,
  linear scaling, monotonicity, edge/zero/clamp, no-NaN). Aim ≥ 6 tests.

### Step 3 — Config block
In `calculatorConfigs.ts`, import your calc fn at the top and rewrite the slug's
config: `inputs` (slider/dropdown/select/multiselect), `outputs`
(one `highlight: true`, rate-aware `sublabel`), `calculate` (read live data via
the dataset getter + call your module), and a factual `insight` one-liner.
- For live state data, reuse `US_ENERGY_STATE_OPTIONS` + the dataset getter
  (e.g. `getUSStateElectricityPrice(state)` / `getUSStateFuelPrice(state)`).

### Step 4 — Insight generator (with visuals + live captions)
`lib/insights/generators/<name>Insights.ts`:
- Export typed `Inputs`/`Outputs` interfaces and `generate<Name>Insights`.
- 4–6 insights. Use the visual primitives where they add clarity:
  - **benchmark-bar** — your value vs a benchmark (two bars).
  - **delta-card** — before → after + delta (e.g. efficient alternative).
  - **projection-line** — cumulative over years (inflation-adjusted).
  - **donut** — share of a whole (e.g. share of a home bill).
- Any value driven by live data gets a `caption: { text, asOf, live: true }`
  using the dataset's `currentPeriodLabel` for vintage.
- Pure, deterministic, synchronous. No React, no fetch. Guard against empty
  outputs (`if (outputs.X <= 0) return [];`).
- Re-export from `lib/insights/index.ts`.

### Step 5 — Wire it
- Add the slug to `GENERATOR_REGISTRY` in `LiveInsightBlock.tsx` with a typed
  adapter (use the `n(values.x, default)` coercion helper; pass outputs with `?? 0`).
- Create `components/worthcore/<Name>WithInsights.tsx` (copy `ApplianceEnergyWithInsights.tsx`).
- In the page (`app/tools/<slug>/page.tsx`), import the `<Name>WithInsights`
  wrapper and use it as the hero child instead of the bare `CalculatorEngineLoader`.
- Remove any legacy insight components (`InsightsSection`, `InsightTable`) — the
  live `<Name>WithInsights` block replaces them. Don't leave both.

### Step 5b — Sync ALL static page content to the new logic (MANDATORY)
> ⚠️ **The #1 way these pages go stale.** When you change fields, formulas,
> constants, or data sources, the **static** copy lower down the page is now
> *wrong* until you update it. A page that says "$3.50/gallon, 250 work days"
> under a calculator that uses live state gas + office-days×weeks is a trust
> killer. Treat this step as non-optional. Walk the **entire** page top-to-bottom:
>
> - **`metadata.title` / `metadata.description`** — reflect the real inputs
>   (e.g. "state's live gas price", not "enter gas price").
> - **Hero `description` + `chips`** — match the actual fields/outputs.
> - **`SEOTextBlock` `formula`** — must be the *exact* formula the calc module
>   uses (same variables, same constants, same order).
> - **`SEOTextBlock` `steps`** — one per real input, in input order.
> - **`SEOTextBlock` `paragraphs`** — describe the real methodology (live data,
>   wear/inflation assumptions, etc.).
> - **`STATS` (stat chips)** — every number must be defensible and consistent
>   with the calculator's constants/data.
> - **`CONTENT_CARDS`** — re-theme around what the calculator now actually does;
>   delete cards about removed features.
> - **`FAQS`** — rewrite every worked example so the arithmetic matches the new
>   formula/constants/defaults. **Recompute the numbers** — don't eyeball them.
>   (FAQs also feed the `FAQPage` JSON-LD, so stale numbers ship to Google.)
> - **`InsightStrip`** — ensure the claim still holds.
>
> Rule of thumb: pick the calculator's **default inputs**, compute the result by
> hand, and make sure every example number on the page agrees with it.

### Step 5c — Make live numbers in copy AUTO-REFRESH (don't hardcode)
> ⚠️ Step 5b stops the page being wrong *today*. Step 5c stops it going wrong on
> the **next data refresh**. Any figure sourced from a dataset must be derived at
> render time, not typed as a literal — so the weekly Apify/FRED refresh updates
> the prose, FAQ, chips, JSON-LD, and insights all at once.

Pages are **server components** — dataset getters and calc modules run at render.
Compute the example once at the top of `app/tools/<slug>/page.tsx`, then
interpolate it into every copy block:

```ts
import { calculateApplianceCost } from "@/calculations/energy/applianceCost";
import {
  getUSStateElectricityPrice,
  usStateElectricityPriceDataset,
} from "@/lib/datasets/regional/usStateElectricityPrices";

// Single source of truth for every "example" number on the page.
const DEFAULTS = { watts: 100, hoursPerDay: 5, state: "National" };
const LIVE_RATE = getUSStateElectricityPrice(DEFAULTS.state);          // $/kWh, live
const EXAMPLE = calculateApplianceCost(DEFAULTS, { pricePerKwh: LIVE_RATE });
const AS_OF = usStateElectricityPriceDataset.currentPeriodLabel;        // vintage stamp

const FAQS = [
  {
    q: "How much does a 100W device cost to run 5 hours a day?",
    // ✅ derived — refreshes with the dataset
    a: `At the US average of $${LIVE_RATE.toFixed(3)}/kWh (${AS_OF}), a 100W device run 5 h/day costs about $${EXAMPLE.annualCost.toLocaleString()}/year.`,
  },
];
```

Then `STATS`, `SEOTextBlock` paragraphs, the `InsightStrip` text, and the
`FAQPage` JSON-LD all read from `LIVE_RATE` / `EXAMPLE` / `AS_OF`. **Never** write
the same number as a literal in two places. (The insight generator already does
this — it's handed live outputs + a `caption` with `currentPeriodLabel`; mirror
that discipline in the page copy.)

Anti-patterns to delete on sight: `"$3.50/gallon"`, `"$11,555/year"`, `"as of
May 2024"` typed directly into copy when a getter/dataset can supply them.

### Step 6 — Verify
- `npx tsc --noEmit` (clean).
- `npm test` (all green).
- Optional live check: see §6.

---

## 4. Conventions & quality bar

- Copy is **factual and specific** — numbers, sources, no hype.
- Constants are **documented with a source** in the calc module.
- One `highlight` output; `sublabel`s surface the live rate/state.
- Insights have stable ids `"<slug>.<rule>"`, a `severity`, a `category`,
  a `title`, a `body` (1–3 sentences with real numbers), and a `metric` or
  `visualization` where it helps.
- Reuse live datasets wherever a price/rate is involved — that's the moat.
- **Allow user overrides where a live/default value is something the user might
  know exactly** (their real wage, their actual rate/price). Implement it as an
  optional field that defaults to the smart live value (a `0` sentinel that means
  "use the live default" is fine). When the user overrides, the insight/caption
  must stop claiming live provenance (flip `live: false`, relabel "your rate").
  Keep it silent in copy — see §0's principle. No FAQ/chip/step advertising it.

---

## 5. Gotchas (learned the hard way)

1. **Sticky needs `overflow-clip`, never `overflow-hidden`.** An ancestor with
   `overflow-hidden` silently kills `position: sticky`. The hero is already fixed.
2. **JSX comment placement:** a `{/* */}` comment cannot be a sibling *before*
   the single root element inside `return ( ... )`. Put comments above `return`
   or inside the root element.
3. **`CalculatorOutputs` assignability:** calc `Result` interfaces need
   `[key: string]: number;` or tsc errors ("index signature missing").
4. **Hydration warning is tooling-only.** The dev overlay's "attributes didn't
   match" comes from the Cursor inspector injecting `data-cursor-ref="..."`
   attributes server-side. Real users never see it. Don't "fix" app code for it.
5. **Apify token:** scripts accept `APIFY_TOKEN` *or* `APIFY_API_TOKEN`.
6. **Electricity data must be ALL-IN** (EIA-based, includes delivery), not
   energy-only supply rates — otherwise deregulated states (TX, OH) understate.
7. **Engine has no cross-field reactions.** A dropdown can't auto-set another
   field's default (only dynamic `maxFn` exists). Design fields independently.

---

## 6. Running / verifying the dev server (token-efficient)

- The shared dev server can get **wedged after many hours**. If HTTP/browser
  hangs, kill stale `node`/`next` processes and start a fresh `npm run dev`.
- **Prefer cheap verification:** `npx tsc --noEmit` + `npm test` prove correctness.
- For a live look, navigate the browser **once** and use a single screenshot or a
  targeted CDP `Runtime.evaluate` DOM read. **Avoid repeated full-page
  `browser_snapshot` calls** — they are huge and burn tokens fast.
- Don't re-read `calculatorConfigs.ts` / `LiveInsightBlock.tsx` in full
  repeatedly — grep for your slug and read a window.

---

## 7. Backlog (group by archetype to reuse data + patterns)

**Archetype A — live energy (reuse `usStateFuelPrices` / `usStateElectricityPrices`):**
- ✅ `ev-vs-gas`, ✅ `appliance-energy-cost`, ✅ `commute-cost` — done to flagship.
- road-trip cost ← **recommended next** (reuses live gas + commute patterns),
  then EV-charging-cost, heating-cost.

**Archetype B — live cost-of-living (reuse `usRegionalBenchmarks`):**
- grocery/unit-price, gym/membership value, daycare cost, etc.

**Archetype C — finance single-flow (compounding/amortization patterns exist):**
- many already built (loan, drip, savings-goal, future-value…); audit which
  still need the flagship insight upgrade + page wiring.

**Archetype D — time/lifestyle (quiet-realism framing):**
- latte-factor, subscription-auditor, screen-time… (several exist; upgrade insights/visuals).

> For each: check if a page/config/generator already exists (many do, but with
> the bare loader and no `afterResults`). The common gap is **wiring insights +
> upgrading logic/fields to flagship** — exactly what was just done for
> `appliance-energy-cost`.

---

## 8. Definition of done (per calculator)

- [ ] Dossier in `docs/dossiers/<slug>.md`
- [ ] Pure calc module + ≥6 passing unit tests
- [ ] Config rewritten (live data where relevant, clever fields, factual insight)
- [ ] Generator with 4–6 insights incl. ≥1 live-captioned visual
- [ ] Registry entry + `WithInsights` wrapper + page wired (insights render);
      legacy `InsightsSection`/`InsightTable` removed
- [ ] **All static page content synced (Step 5b):** metadata, hero copy, SEO
      formula + steps + paragraphs, stat chips, content cards, and **FAQ worked
      examples all recomputed** to match the new formula/constants/defaults
- [ ] **Clever-but-simple check (§0):** excellent defaults (useful before any
      input), optional overrides where the user might know the real value, and
      **no copy advertising those overrides** (no FAQ/chip/step bloat)
- [ ] **Live copy auto-refreshes (Step 5c):** every dataset-sourced number in
      FAQ/STATS/SEO/InsightStrip/JSON-LD is **derived at render** from the getter +
      calc module (computed once, referenced everywhere) — zero hardcoded live
      figures or "as of" labels
- [ ] `npx tsc --noEmit` clean, `npm test` green
- [ ] (Optional) one live screenshot confirming results + insights + sticky
