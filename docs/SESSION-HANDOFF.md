# Session Handoff — Worthulator Calculator Build

> **Read this first thing when resuming.** It tells you exactly where we left
> off, what the open questions are, and what to build next.
>
> Last updated: 2026-05-31

---

## 1. What this project is

100+ single-flow calculators that must be **the best version of each calculator
on the web** — custom fields, tested logic, live state-level data (via Apify),
and rich visual insights. The standard is set by `meal-prep-calculator` (logic
depth) and `ev-vs-gas` / `appliance-energy-cost` (live-data + insight pattern).

Full philosophy, architecture, build recipe, conventions and gotchas live in:
→ **`docs/CALCULATOR-ROLLOUT-PLAYBOOK.md`** — read this before touching any calc.

---

## 2. What is fully done (flagship standard)

All 13 calculators below have: dossier, pure calc module + unit tests, custom
config, insight generator (4–6 visual insights), wired `WithInsights` wrapper,
and fully synced static page content (Step 5b).

| # | Slug | Live data |
|---|------|-----------|
| 1 | `ev-vs-gas` | ✅ gas + electricity (state) |
| 2 | `commute-cost-calculator` | ✅ gas (state) |
| 3 | `road-trip-cost` | ✅ gas (state) |
| 4 | `laundry-cost-calculator` | ✅ electricity (state) |
| 5 | `appliance-energy-cost` | ✅ electricity (state) |
| 6 | `ev-charging-cost` | ✅ electricity (state) + TOU rate |
| 7 | `heating-cost` | ✅ nat gas + electricity (state) — **last built before this session** |
| 8 | `water-bill-calculator` | ✅ water + sewer (state) — **last built** |
| 8 | `quit-smoking-calculator` | ✅ cigarette pack price (state) |
| 9 | `latte-factor` | ➖ pure-math (no regional feed needed) |
| 10 | `grocery-unit-price` | ➖ pure-math |
| 11 | `tip-calculator` | ➖ by nature |
| 12 | `alcohol-cost-calculator` | ➖ pure-math |
| 13 | `vaping-cost-calculator` | ➖ pure-math |

**Live data coverage: 9 / 14 flagship calculators.**  
Full detail + roadmap: `docs/LIVE-DATA-MOAT-STATUS.md`

Dossiers for all 13 live in `docs/dossiers/`.

---

## 3. Open question to resolve first

**Before starting the next build, investigate this:**

The user asked *"why are steps 3 and 4 missing?"* at the end of the last
session. It was not diagnosed.

**Most likely meaning:** looking at a calculator page in the browser, the
numbered step cards in the "How it works" section (the `SEOTextBlock` `steps`
prop) are only showing 2 steps instead of 5.

**Action on resume:**
1. Ask the user which URL they were looking at.
2. If it's `heating-cost` or `ev-charging-cost`, confirm the dev server is
   running and both pages load with all 5 step cards visible.
3. If a different (older) calculator page, it may simply have only 2 steps
   written in its `steps={[...]}` array — add the missing 3 steps.

---

## 4. What to build next (prioritised backlog)

The ~128 remaining calculators broadly fall into these archetypes. Attack in
this order to reuse data patterns efficiently:

### Tier 1 — Finance / compounding (Archetype C)
Many pages already exist with a bare `CalculatorEngineLoader` but no custom
logic, live data, or insights. Upgrade the ones below first (highest traffic /
most useful):

| Priority | Slug | Notes |
|----------|------|-------|
| 1 | `water-bill-calculator` | Easy live-data candidate — state water rates vary 3×. Look for AWWA / EPA data feed |
| 2 | `subscription-auditor` | ✅ cost benchmarks | live | **last built** — category audit + opportunity cost |
| 3 | `screen-time-impact` | ➖ time→money | — | needs flagship upgrade |
| 4 | `missed-investment` | Compounding loss calculator — already exists, needs flagship insight upgrade |
| 5 | `fire-calculator` | FIRE number + years-to-FIRE — already exists, audit logic depth |
| 6 | `debt-payoff-calculator` | Snowball vs avalanche — already exists, needs correct logic + insights |

### Tier 2 — Health / lifestyle (Archetype D)
| Priority | Slug | Notes |
|----------|------|-------|
| 1 | `calorie-deficit-calculator` | Combine BMR + activity + deficit → lbs/week projection |
| 2 | `sleep-cycle-optimizer` | Sleep debt + productivity loss → dollar cost |
| 3 | `procrastination-cost` | Time × hourly rate → dollar value of procrastinated work |

### Tier 3 — Live-data candidates (future Archetype B)
| Slug | Potential live feed |
|------|-------------------|
| `grocery-unit-price` | USDA / BLS staple-food price benchmarks (heavier lift) |
| `water-bill-calculator` | AWWA residential rate survey |

---

## 5. Build recipe (quick reference)

Follow the full recipe in the playbook § 3. Summary:

```
Step 1  — Write dossier  (docs/dossiers/<slug>.md)
Step 2  — Pure calc module + ≥6 unit tests  (calculations/<domain>/<slug>.ts)
Step 3  — Config block in calculatorConfigs.ts
Step 4  — Insight generator  (lib/insights/generators/<slug>Insights.ts)
          → export from lib/insights/index.ts
Step 5  — WithInsights wrapper + LiveInsightBlock registry entry
Step 5b — Page file: ALL static content synced (metadata, hero, SEO steps,
           stat chips, cards, FAQs — every example recomputed to match new logic)
Step 6  — npx tsc --noEmit clean + npm test green
          → update LIVE-DATA-MOAT-STATUS.md + dossier checklist
```

**Always try to incorporate live data** — state-level realism is the moat.  
If a live dataset exists, use it. If it doesn't, check if Apify can source one.

---

## 6. Key files to know

| File | Purpose |
|------|---------|
| `docs/CALCULATOR-ROLLOUT-PLAYBOOK.md` | Full build standard — read before every build |
| `docs/LIVE-DATA-MOAT-STATUS.md` | Live-data coverage tracker |
| `docs/dossiers/<slug>.md` | Per-calculator spec |
| `components/calculator-engine/calculatorConfigs.ts` | All calc configs (~2,000+ lines) |
| `components/worthcore/LiveInsightBlock.tsx` | Insight generator registry |
| `lib/insights/generators/` | All insight generators |
| `calculations/` | Pure calc modules + unit tests |
| `lib/datasets/regional/` | Live datasets (gas, electricity, cigarettes, nat-gas) |
| `scripts/updateEnergyPrices.ts` | Apify scraper — add new sources here |
| `.github/workflows/refresh-live-data.yml` | Weekly auto-refresh action |

---

## 7. Live data refresh

- **Automated:** GitHub Action runs every Monday 06:00 UTC. Requires
  `APIFY_API_TOKEN` set as a repo secret.
- **Manual local run:** `npm run energy:refresh` (needs `.env.local` with token).
- **Adding a new source:** add to `SOURCES` in `scripts/updateEnergyPrices.ts`,
  write a `parseXxx` function, add the patch call in `main`, and add the file
  path to the GitHub Action commit step.
