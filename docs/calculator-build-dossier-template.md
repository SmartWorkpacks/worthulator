# Calculator Build Dossier — `<calculator-slug>`

> The single source of truth for building one calculator to the flagship bar.
> Fill this out BEFORE writing code. The bar is set by two exemplars:
> meal-prep (data + logic + flow + quiet realism) and future-value (UI).
> Every section below maps to a concrete file in the pipeline.

---

## 1. Identity & intent
- **Slug:** `<calculator-slug>`
- **Label:** `<Display Name>`
- **Category:** construction | finance | work | health | legal | other
- **Audience / search intent:** who lands here and what they want to know in one sentence.
- **The "wow" fact:** the single true number this calculator reveals that makes someone go "huh, I didn't realise that." State it plainly — no hooks.
- **Delivery model:** single-flow (this pipeline) — confirm it is NOT multistep/heavy-data (those go to the complex track).

## 2. Fields (inputs)
List every field. Include ONLY fields that add real accuracy or insight — but do not omit any that do.

| name | label | type (slider/select/dropdown/multiselect/number) | unit | min | max | step | default | quickPicks | source of realism |
|---|---|---|---|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... | ... | ... | ... | (e.g. live dataset default, state-calibrated) |

- **Dynamic bounds (`maxFn`):** any field whose min/max depends on another field. State the formula (e.g. `extraMeals.max = 21 - meals`).
- **Live-data defaults:** which field defaults come from a dataset (so the calculator opens with real, current numbers).

## 3. Outputs
| key | label | format | highlight (primary?) | sublabel |
|---|---|---|---|---|
| ... | ... | currency/decimal/percent/integer | ... | ... |

## 4. Formulas & logic (with sources)
For each output, the exact formula and the authoritative source for any constant/assumption.
- `output = ...` — source: `<org, year, series/url>`
- Document units and conversions explicitly.

## 5. Constraints & invariants (the "quiet realism")
The interdependencies that make this best-in-class. Each becomes a unit test.
- Conserved totals: `<e.g. cooked + outsourced === 21>`
- Dynamic caps: `<e.g. extraMeals ≤ 21 - meals>`
- Blended/derived values: `<e.g. takeout cost = mean of selected styles>`
- Guard rails: behaviour on zero/negative/NaN inputs (return zeros, never NaN/Infinity).

## 6. Datasets (live vs static)
| field needed | dataset file | live? | source (Apify/FRED/Yahoo/BLS/survey) | cadence | fallback |
|---|---|---|---|---|---|
| ... | `lib/datasets/...` | yes/no | ... | daily/weekly/monthly/quarterly | static default |

- New dataset work required? Link the acquisition/refresh registry entries
  ([acquisitionRegistry.ts](../lib/datasets/acquisitionRegistry.ts), [refreshRegistry.ts](../lib/datasets/refreshRegistry.ts)) and flip `planned -> active` when wired.

## 7. Insights
Insight generator rules (id, severity, category, the plain fact each states). Format already established in `lib/insights/generators/`.
- `<slug>.<rule>` — severity, category — one-line description of the fact.

## 8. Visuals
Which `InsightVisual` primitive each insight uses (benchmark-bar / delta-card / projection-line / donut) and whether it surfaces live-data vintage/provenance.

## 9. Build checklist (Definition of Done)
- [ ] Custom fields + flow in `calculatorConfigs.ts` (with `maxFn`/derived where needed)
- [ ] Pure calc module in `calculations/<domain>/<name>.ts`
- [ ] Unit tests covering known values + every invariant in section 5 — `npm test` green
- [ ] Dataset(s) wired with safe fallbacks; registries updated; Apify/FRED refresh run if live
- [ ] Custom insight generator in `lib/insights/generators/`
- [ ] Visuals assigned and live-data aware
- [ ] `npx tsc --noEmit` clean
- [ ] Manual QA: open the calculator, sanity-check numbers vs an authoritative external source
