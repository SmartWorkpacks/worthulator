# Calculator Build Dossier — `quit-smoking`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `quit-smoking` (page at `/tools/quit-smoking-calculator`)
- **Label:** Quit Smoking Calculator
- **Category:** health / lifestyle
- **Audience / search intent:** People who have quit smoking (or are considering
  it) who want to see the financial and health impact in hard numbers.
- **The "wow" fact:** 1 pack/day at $10/pack for 1 year = $3,650 saved. Invested
  at 7%, that's **$53,000+ in 10 years** and **$157,000+ in 20 years**. The
  money saved is life-changing — but only if you see the number.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| state | Your state | dropdown | — | — | — | — | National | (US_ENERGY_STATE_OPTIONS) |
| packsPerDay | Packs per day | slider | pks | 0.5 | 3 | 0.5 | 1 | 0.5, 1, 1.5, 2, 3 |
| packCost | Cost per pack | slider | $ | 5 | 20 | 0.50 | 10 | 6, 8, 10, 12, 15 |
| daysSinceQuit | Days since you quit | slider | — | 1 | 3650 | 1 | 365 | 30, 90, 180, 365, 730 |

### Key design choices
- **`state` dropdown (LIVE DATA, added 2026-05-31):** loads the state's live
  average cigarette pack price from `usStateCigarettePrices.ts` and benchmarks
  the user's own pack cost against it. This is the moat — state pack prices range
  from ~$6 (Missouri) to ~$12 (New York) due to excise taxes. We keep `packCost`
  as a user input (people know their own brand/price) and use the state average
  only for the comparison, which is the most honest, valuable integration.
- The rest of the upgrade extracts pure logic, adds the invested value as a
  visible output, and wires visual insights.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| moneySaved | Money saved | currency | ✅ | `Over {days} smoke-free days` |
| cigarettesAvoided | Cigarettes avoided | integer | — | `At {packs} packs/day` |
| daysOfLifeRegained | Life regained | decimal (1) | — | `~11 min per cigarette` |
| annualSaving | Annual saving | currency | — | `Your habit was costing this per year` |
| investedValue10yr | If invested (10 yr) | currency | — | `At 7% annual return` |

---

## 4. Formulas & logic

```
moneySaved          = packsPerDay × packCost × daysSinceQuit
cigarettesAvoided   = packsPerDay × 20 × daysSinceQuit
daysOfLifeRegained  = (cigarettesAvoided × 11) / 60 / 24
annualSaving        = packsPerDay × packCost × 365
investedValue10yr   = FV of annuity(annualSaving, 10 years, 7%)
```

---

## 5. Constraints & invariants

- `moneySaved ≥ 0`
- `cigarettesAvoided` is always a whole number
- `daysOfLifeRegained ≥ 0`
- `investedValue10yr > annualSaving × 10` (compound growth)
- No NaN/Infinity

---

## 6. Datasets

- **`lib/datasets/regional/usStateCigarettePrices.ts`** (LIVE) — state-level
  average pack price ($), refreshed via the Apify pipeline
  (`scripts/updateEnergyPrices.ts` → `npm run energy:refresh`, scheduled weekly
  by `.github/workflows/refresh-live-data.yml`). Getter:
  `getUSStateCigarettePrice(state)`. Provenance surfaced via insight
  `liveCaption.asOf`.

The calc accepts an optional 2nd arg `{ stateAvgPackPrice }` and returns
`stateAvgPackPrice` + `vsStateAvgPct` for the benchmark.

---

## 7. Insights (existing, upgrade with visuals)

| id | severity | category | visual upgrade |
|---|---|---|---|
| `smoking.annual-spend` | neutral/warning | spending | benchmark-bar (your cost vs national avg) |
| `smoking.investment-projection` | positive | investment | projection-line |
| `smoking.vs-state-pack-price` / `.above-state-pack-price` | neutral/warning | comparison | **benchmark-bar — your pack cost vs LIVE state avg (liveCaption)** |
| `smoking.milestone-*` | positive | savings | delta-card (money saved vs what you'd have spent) |

---

## 8. Build checklist

- [x] Pure calc module + unit tests (20 tests inc. state benchmark)
- [x] Config rewritten to use pure module + state dropdown
- [x] Insight generator upgraded with visuals + LIVE state benchmark
- [x] WithInsights wrapper + registry + page
- [x] All static page content synced (Step 5b)
- [x] `npx tsc --noEmit` clean, `npm test` green (165 tests)
- [x] Live cigarette dataset + Apify refresh source wired
