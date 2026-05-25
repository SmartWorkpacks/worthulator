# WVE SYSTEM BIBLE
## Worthulator Value Engine — Canonical Architecture Reference
### Version 2.0 | Phase 14 | May 2026

> This document is the authoritative source of truth for all WVE development.
> Future AI sessions MUST read this before writing any WVE-related code.

---

## SECTION A — PLATFORM DEFINITION

### What WVE Is

The Worthulator Value Engine (WVE) is a **Contextual Economic Intelligence Platform** that delivers structured, data-backed economic interpretation across eight entity classes, four verticals, and 12+ regional profiles.

WVE answers the economic question behind a user's intent:
- *"What will this cost me?"* — service-estimate → `project-economics` model
- *"What is this worth?"* — market-value → `resale-value` model
- *"How has this appreciated?"* — appreciation → `appreciation` model

It is an **operating system for economic intelligence** — a layered platform of interconnected subsystems that handle entity classification, quality validation, SEO generation, monetization logic, regional adjustment, user memory, and AI preparation.

**WVE is NOT a cost estimator. It is an economic interpretation engine.** The distinction matters: a cost estimator applies a formula. An economic interpretation engine classifies the entity type, applies the correct economic model, accounts for regional variance, and produces contextually grounded intelligence.

### What WVE Is NOT

- NOT a calculator directory
- NOT a quote request form
- NOT an AI chatbot that generates made-up estimates
- NOT a CMS where anyone can publish pages
- NOT a thin affiliate site
- NOT a wrapper around a third-party API
- NOT coupled to the existing Worthulator calculator infrastructure

### Core Philosophy

**Deterministic first. Intelligent second. Monetized third.**

Every estimate is grounded in benchmarked data before any intelligence layer is applied. The quality system prevents low-confidence data from reaching users. The monetization layer operates contextually — never interruptively.

### Economic Estimation Engine Concept

An economic estimation engine differs from a simple calculator in that it:

1. **Classifies intent** — routes raw user input to the correct estimation type
2. **Applies entity context** — uses a structured entity registry, not raw formula inputs
3. **Anchors to benchmarks** — references real-world cost/value data with confidence scoring
4. **Generates semantic output** — produces structured content about *why* an estimate is what it is
5. **Monetizes contextually** — matches commercial actions to the entity's commercial profile
6. **Remembers and learns** — memory layer tracks behavior for escalation scoring

### Calculators vs WVE

| Dimension | Legacy Calculators | WVE |
|---|---|---|
| Input model | Form fields | Intent routing + entity classification |
| Data source | Static formulas | Benchmarked entity profiles |
| Output | A number | Structured estimate with context, confidence, and semantics |
| SEO | Thin pages | Quality-gated entity pages with depth |
| Monetization | None / generic | Entity-specific, scored, contextual |
| Memory | None | Session + localStorage history |
| AI readiness | None | Pre-packaged context payloads |
| Coupling | Monolithic | Isolated subsystems |

---

## SECTION A2 — ECONOMIC ENTITY CLASS SYSTEM (Phase 14)

### The 8 Entity Classes

WVE classifies every entity into one of 8 Economic Entity Classes. The class determines which economic model applies, how the AI frames responses, and how monetization actions are selected.

| Class | Description | Examples | Primary Economic Model |
|---|---|---|---|
| `services` | Work performed — labor + materials | Roof replacement, kitchen remodel, solar install | `project-economics` |
| `products` | Physical goods with resale markets | iPhone 16 Pro, PlayStation 5, Air Jordan 1 | `resale-value` or `depreciation` |
| `assets` | Value-bearing holdings (real estate, land) | Home equity, investment property | `appreciation` |
| `utilities` | Recurring cost burdens | Electricity, internet, insurance | `recurring-burden` |
| `ownership-economics` | Total lifecycle cost including depreciation | Car ownership, equipment lifecycle | `ownership-burden` |
| `investments` | Collectible or speculative holdings | Rolex Submariner, luxury handbags, fine art | `future-value` |
| `life-events` | Phased multi-expense milestones | Wedding, home purchase, college | `timeline-economics` |
| `business-economics` | Operational cost structures | Commercial renovation, fleet maintenance | `operational-economics` |

### The 9 Economic Models

Each entity class maps to a primary economic model. The model determines prompt framing in the AI layer and the reasoning structure for estimate explanation.

| Model | Class Affinity | AI Framing Focus |
|---|---|---|
| `project-economics` | services | Scope, labor, materials, timing risk |
| `depreciation` | products | Value curves, condition, optimal sell window |
| `appreciation` | assets, investments | Market forces, holding period, return outlook |
| `resale-value` | products, investments | Secondary market prices, platform comparison |
| `recurring-burden` | utilities | Monthly/annual cost, inflation impact, savings |
| `ownership-burden` | ownership-economics | Total lifecycle cost: purchase + maintain + depreciate |
| `future-value` | investments | Volatility, risk scenarios, holding period |
| `timeline-economics` | life-events | Phased spend, planning sequence, budget |
| `operational-economics` | business-economics | Per-unit cost, scale, efficiency |

### The 6 Lifecycle Types

| Type | Description |
|---|---|
| `one-time-purchase` | Single acquisition event |
| `recurring-cost` | Repeating obligation (monthly/annual) |
| `project-based` | Defined scope with start/end |
| `lifecycle-asset` | Long-lived asset with depreciation arc |
| `milestone-event` | Life stage event with phased spend |
| `perpetual-holding` | Indefinite ownership (investment, real estate) |

### Entity Class Assignment

- **Preferred:** Set `entityClass`, `economicModel`, `lifecycleType` explicitly in the registry entity definition
- **Fallback:** `VERTICAL_TO_CLASS` map in `intentRouter.ts` and `builder.ts` maps vertical → class
- **Rule:** Never leave entity class unresolved — the fallback always yields a class

---

## SECTION A3 — REGIONAL INTELLIGENCE DOCTRINE (Phase 14)

### Why Regional Intelligence Is a First-Class Layer

Economic estimates are not geography-neutral. A roof replacement in California costs 60% more than the national average due to labor tier, regulation intensity, and insurance pressure. A Rolex has the same secondary market value everywhere, but financing propensity (and therefore lead value) is 60% higher in Texas than the national baseline.

WVE's regional intelligence layer resolves these differences at the data level, not the presentation level.

### The 12 Regional Profiles

`lib/value-engine/regional/regionalProfiles.ts` — `REGIONAL_PROFILES`

| Region | Labor Tier | Monetization Multiplier | Notable Signals |
|---|---|---|---|
| `nationwide` | average | 1.0 | Baseline |
| `CA` | premium | 1.6 | High insurance (9/10), disaster risk, high regulation |
| `TX` | above-average | 1.5 | Strong financing propensity, growth market |
| `FL` | above-average | 1.55 | Max insurance pressure (10/10), hurricane zone |
| `NY` | premium | 1.55 | Max regulation, high labor |
| `AZ` | above-average | 1.45 | Desert heat load, fast growth market |
| `GA` | average | 1.35 | Value-tier labor, active market |
| `SC` | below-average | 1.25 | Cost-efficient labor, coastal hurricane risk |
| `IL` | above-average | 1.40 | High property tax pressure |
| `CO` | above-average | 1.45 | Mountain climate variance |
| `WA` | premium | 1.50 | Tech-wealth concentration, seismic risk |
| `UK` | average | 1.1 | VAT-inclusive estimates, Euro-parity adjusted |

### Regional Profile Fields

Each `RegionalEconomicProfile` has 11 fields (all on `lib/value-engine/types.ts`):
`regionId`, `label`, `laborTier` (budget/below-average/average/above-average/premium), `materialVolatility` (1–10), `financingPressure` (1–10), `inflationPressure` (1–10), `disasterExposure` (none/low/moderate/high), `regulationIntensity` (low/moderate/high/extreme), `insurancePressure` (1–10), `monetizationMultiplier` (0.8–1.8), `regionalConfidence` (0.0–1.0)

### Regional API (`lib/value-engine/regional/`)

- `getRegionalProfile(regionId)` — returns profile or `nationwide` fallback
- `getMonetizationMultiplier(regionId)` — quick multiplier for monetization engine
- `applyRegionalModifier(low, mid, high, regionId)` — adjusts estimate range by labor tier
- `getRegionalTrustSignals(regionId, entityClass?)` — contextual trust signals for UI
- `getRegionalMonetizationSignal(regionId, baseLead, baseAffiliate, financingPropensity)` — enriched monetization
- `resolveRegionalContext(params)` — full context resolver returning `ResolvedRegionalContext`

### Regional Intelligence Rules

1. **All lib/value-engine code is SSR-safe.** No `window`, `localStorage`, `document` at module level.
2. **`nationwide` is always the fallback.** Never return undefined for a regional profile.
3. **Regional multiplier applies to monetization, not benchmark.** Benchmarks are national; multiplier adjusts lead/affiliate priority.
4. **Trust signals are entity-class-aware.** A `services` entity in FL gets an insurance risk signal. An `investments` entity gets no disaster signal.
5. **Regional profiles are additive.** Adding a new region never breaks existing profiles.

---

### Subsystem Map

```
WVE Platform
├── entityRegistry          — canonical entity data store (entity class, economic model, lifecycle)
├── intentRouter            — maps search input to estimation intent + economic interpretation
├── estimationRuntime       — formula/benchmark resolution
├── qualityGating           — computed quality scores, route/index eligibility
├── entityGraph             — semantic relationships (cross-class topology, Phase 14)
├── escalationScoring       — engagement signals → monetization pressure
├── monetizationEngine      — contextual action generation (class-aware, Phase 14)
├── regionalIntelligence    — 12-region economic profiles, modifiers, trust signals (Phase 14)
├── memoryLayer             — localStorage/sessionStorage estimate history
├── analyticsLayer          — typed event emission (GTM + DOM bus)
├── searchIntelligence      — fuzzy + expansion + registry fallback
├── aiContextLayer          — AI payload assembly (economic class + regional, Phase 14)
└── seoLayer                — quality-gated route/sitemap generation
```

### Entity Registry (`lib/value-engine/entityRegistry/`)

The registry is the **single source of truth** for all platform entities. No entity may appear on a WVE result page unless it is registered.

**Key exports:** `EntityRegistry` class, `registry` singleton, all entity types.

**Entity shape:** `id`, `canonicalName`, `aliases`, `vertical`, `category`, `estimationType`, `serviceType?`, `entityClass?`, `economicModel?`, `lifecycleType?`, `volatilityProfile?`, `benchmark` (low/mid/high USD, confidence, source, date), `regional`, `monetization`, `seo`, `quality`

**Registry methods:** `register`, `get`, `has`, `all`, `query`, `search`, `forSitemap`, `highCommercialValue`, `buildHref`

**Entry files:** `entries/homeServices.ts`, `entries/electronics.ts`, `entries/luxury.ts`, `entries/sneakers.ts`

**Current count:** 25 entities across 4 verticals.

### Estimation Runtime

- **Type:** `EstimationType` — `"service-estimate"` | `"market-value"` | `"appreciation"`
- **Vertical:** `VerticalSlug` — `"home-services"` | `"electronics"` | `"luxury"` | `"sneakers"`
- Service estimates use formula engines (regional modifiers, material costs)
- Market-value estimates use benchmark midpoints ± confidence range
- The recon server (`RECON_API`) provides live formula computation; registry provides static fallback

### SEO Layer (`lib/value-engine/seo/`, `components/value-engine/seo/`)

- `gates.ts` — `getRouteEligibleEntities()`, `getIndexEligibleEntities()`, `getSitemapEntities()`, `evaluateGate()`, `toSitemapEntry()`
- Components: `EntityIntro`, `EstimateExplanation`, `RegionalContext`, `RelatedEstimates`, `FAQBlock`
- All SEO components are server-rendered; no browser API calls at module level
- `RelatedEstimates` uses entity graph + registry fallback for automatic card population
- Sitemap inclusion requires `indexEligible = true` (quality-gated)

### Entity Graph (`lib/value-engine/entityGraph.ts`)

- 29 manual relationship entries with `strength` values (0–1)
- `VERTICAL_FALLBACK` provides cross-vertical defaults
- `getRelatedEntities(serviceType, vertical, limit)` — graph-first, vertical fallback
- `getRegistryRelated(excludeId, vertical, limit)` — dynamic registry fallback
- `RelatedEntity`: `label`, `href`, `strength`, `entityId?`

### Escalation Scoring (`lib/value-engine/escalationScorer.ts`)

Computes a 0–10 escalation score from:
- `estimateAmount` (28%) — FINANCING_THRESHOLD = $5,000
- `engagementTime` (18%)
- `estimationType` (24%)
- `repeatVisit` (14%)
- `estimateComplexity` (9%)
- `monetizationScore` (overrides flat baseline when provided by monetization engine)

### Monetization Intelligence (`lib/value-engine/monetization/`)

`computeMonetization(ctx)`:
- Registry-first entity lookup for monetization profile
- Type-baseline fallback if entity not registered
- Engagement amplifier: `0.8 + (engagementScore/10) × 0.4`
- Financing gate: propensity ≥ 6 OR amount ≥ $8K OR explicit flag
- LTV: `averageOrderValue × (leadSuitability/10) × conversionRate`
- Output: `MonetizationAssessment` with sorted `actions[]`

**Action types:** `lead_form`, `affiliate_links`, `financing_cta`, `comparison_tool`, `advisory`

### Trust Layer

The trust layer is the combination of:
- `QualityAssessment` — computed score, tier, eligibility flags
- `BenchmarkProfile.confidenceLevel` — `"high"` | `"moderate"` | `"preliminary"`
- `BenchmarkProfile.benchmarkSource` — cited data origin
- `BenchmarkProfile.lastUpdated` — YYYY-MM freshness anchor
- `robots.index` driven by `indexEligible` — not manually set

No entity reaches a user without passing the quality gate. No page is indexed without meeting the indexEligible threshold.

### AI Preparation Layer (`lib/value-engine/aiContext/`)

`buildAIContext(params)` assembles `AIContextPayload` (schema v2.0):
- Entity identity, estimate range, computed quality, monetization summary, up to 4 related entities (graph + cross-class), user context
- **Phase 14 additions:** `entityClass`, `economicModel`, `lifecycleType`, `volatility?`, `regionalEconomics?` (resolved from `getRegionalProfile`)
- `formatSystemPrompt(payload, config)` — 3 tones: informative / sales / advisory; class-specific reasoning instructions injected via `CLASS_FRAME` and `MODEL_INSTRUCTION` lookup tables
- `formatUserMessage(payload, userQuery?)` — model-aware default question when no user query provided
- `toJSONContext(payload, config)` — token-budget-aware serialization; compact form preserves `entityClass` + `economicModel`

**Rule:** This layer prepares context for AI. It does NOT call AI APIs.

### Quality Gating (`lib/value-engine/quality/`)

`computeQuality(entity)` scores 5 weighted dimensions:
- Estimate confidence (30%)
- Benchmark confidence (25%)
- Data freshness (20%, decays over 36 months from reference date)
- SEO completeness (15%)
- Profile completeness (10%)

**Tiers:** premium ≥85, standard ≥65, draft ≥40, blocked <40

**Route eligibility:** static flag + score ≥ `minQualityGate`
**Index eligibility:** routeEligible + tier is premium or standard

### Memory Layer (`lib/value-engine/memory/`)

- `saveEstimate`, `loadHistory`, `loadHistoryByVertical`, `isRepeatVisit`, `clearHistory`
- localStorage for persistent history (cap 20 records)
- sessionStorage for repeat-visit detection within session
- Hook: `useEstimateMemory({ autoRecord?, filterVertical? })`
- Feeds `isRepeat` and `viewCount` into escalation scoring

### Analytics Layer (`lib/value-engine/analytics/`)

9 typed events: `estimate_searched`, `estimate_selected`, `estimate_viewed`, `estimate_engagement`, `related_clicked`, `lead_form_started`, `lead_form_submitted`, `comparison_viewed`, `affiliate_clicked`

`emit(event)` → `window.dataLayer` (GTM) + `CustomEvent("wve:event")` + `console.debug` dev

Hook: `useAnalytics()` → `{ track }`

### Search Intelligence (`lib/value-engine/search/`)

3-round smart search:
1. Registry exact/prefix/contains search
2. Query expansion (50+ abbreviation mappings)
3. Character-level fuzzy (Levenshtein) fallback

`/api/ve/search/route.ts` falls back to registry when recon is offline.

---

## SECTION C — NON-NEGOTIABLE RULES

See `WVE_RULES.md` for the full enforcement list.

Core constraints:
1. **Entity registry is mandatory.** No entity may appear without a registry entry.
2. **Quality gates are mandatory.** No entity may be indexed without passing `indexEligible`.
3. **SSR-first.** All route files, SEO components, and lib modules are server-safe.
4. **Subsystem isolation is mandatory.** No subsystem imports from an unrelated subsystem's internals.
5. **No coupling to legacy calculators.** WVE and `app/tools/` are independent systems.
6. **`recon/` is isolated.** `recon/` must never import from the parent app.
7. **AI never replaces deterministic estimation.** AI only interprets or enhances benchmark output.
8. **No uncontrolled dynamic routes.** Every entity URL must have a registry entry.
9. **No browser APIs at module level.** All client-only code must be behind `typeof window !== 'undefined'` or inside `useEffect`.

---

## SECTION D — PLATFORM PHILOSOPHY

### WVE is an Economic Estimation Operating System

It is not a search engine, not a chatbot, not a price comparison site, and not a lead generation form. It is an operating system that:

1. **Classifies economic intent** — understands what a user is trying to price/value
2. **Resolves to a structured estimate** — deterministic, benchmarked, confidence-scored
3. **Generates semantic content** — why this estimate, regional context, related alternatives
4. **Monetizes contextually** — match commercial actions to the economic profile of the entity
5. **Builds platform memory** — learn from user behavior to escalate appropriately
6. **Scales with quality discipline** — never trade page count for page quality

### The Estimation Hierarchy

```
User Intent
    ↓
Intent Router (classify)
    ↓
Entity Registry (validate)
    ↓
Quality Gate (assess)
    ↓
Estimation Runtime (compute)
    ↓
SEO Layer (render)
    ↓
Monetization Layer (contextualise)
    ↓
Analytics Layer (record)
    ↓
Memory Layer (persist)
    ↓
AI Layer (optionally enhance)
```

Every layer respects the one above it. AI is at the bottom — it only enhances, never overrides.

---

## SECTION E — SEO DOCTRINE

### Principle: Crawl Quality Over Page Count

WVE generates entity pages only for entities that pass the quality gate. A page that cannot be confidently estimated should not exist. Google-indexed pages must:

- Have a `QualityAssessment.tier` of `premium` or `standard`
- Have `benchmarkSource` citing a real data origin
- Have `lastUpdated` within the data freshness window
- Have `seo.primaryKeyword` and at minimum 2 `seo.relatedKeywords`
- Have `RelatedEstimates` populated (entity graph or registry fallback)

### Auto-Degradation

When benchmark data ages beyond 36 months:
- Data freshness dimension drops toward 0
- Overall quality score falls
- If it drops below `standard` tier → `indexEligible = false` → page receives `robots: noindex`
- If it drops below `minQualityGate` → `routeEligible = false` → page removed from `generateStaticParams`

This is automatic. No manual intervention required.

### Semantic Depth Requirements

Every indexed WVE entity page must contain:
- `EntityIntro` — identity, type, and benchmark range with confidence framing
- `EstimateExplanation` — what drives the estimate
- `RegionalContext` — geographic cost variance
- `RelatedEstimates` — 3+ related entity cards
- `FAQBlock` — structured FAQ for rich snippets

### Sitemap Discipline

- Only `indexEligible` entities enter the sitemap
- Priority from `seo.priority`: high=0.9, medium=0.8, low=0.7
- `changeFrequency`: high-priority entities = weekly, others = monthly
- `lastModified`: derived from `benchmark.lastUpdated`

---

## SECTION F — AI DOCTRINE

### Rule: Deterministic Engine Always Runs First

AI is never the primary estimator. The sequence is always:
1. Registry lookup → entity exists?
2. Quality gate → confidence acceptable?
3. Benchmark range → deterministic estimate
4. AI (optional) → interpret, contextualise, explain

### AI Is Only Permitted To

- Interpret an existing deterministic estimate
- Generate contextual advice around a known benchmark
- Answer follow-up questions about a validated entity
- Explain trade-offs between related entities

### AI Is Never Permitted To

- Generate a price estimate from scratch (hallucination risk)
- Create entity pages without registry entries
- Override quality gate decisions
- Be the sole source of information on an indexed page

### AI Escalation Thresholds

AI enhancement is only surfaced when escalation score ≥ 7.0. Below this threshold, the standard deterministic output is sufficient.

### AI Context Packaging

All AI calls must use `buildAIContext()` from `lib/value-engine/aiContext/builder.ts`. The payload includes:
- Validated entity data (from registry)
- Computed quality score (not assumptions)
- Benchmark range with confidence label
- Related entities for comparison context
- User context for personalisation

`formatSystemPrompt(payload, config)` generates the system turn. `formatUserMessage(payload, query)` generates the user turn.

---

## SECTION G — MONETIZATION DOCTRINE

### Principle: Contextual, Not Interruptive

Monetization actions are served based on the economic profile of the entity, not based on generic site-wide rules. A $200 sneaker and a $18,000 kitchen remodel require entirely different monetization strategies.

### Action Priority Order

1. `lead_form` — highest value for high-spend service entities
2. `financing_cta` — triggered by financing propensity ≥ 6 OR estimate ≥ $8K
3. `affiliate_links` — for market-value entities (electronics, luxury, sneakers)
4. `comparison_tool` — for entities with strong graph relationships
5. `advisory` — low-spend or low-confidence entities

### Progressive Disclosure

Monetization escalates with engagement. Low engagement → advisory tone. High engagement → lead form or financing CTA. Repeat visit → escalation multiplier applied.

### Lead Scoring

Lead suitability (0–10) from entity monetization profile × engagement amplifier × conversion rate = estimated LTV per lead. Only entities with `leadSuitability ≥ 6` get primary lead CTA placement.

### Financing Propensity

Financing CTA is shown when:
- `entity.monetization.financingPropensity ≥ 6`, OR
- `estimateAmount ≥ $8,000`, OR
- `ctx.financingDetected === true`

---

## SECTION H — PERFORMANCE DOCTRINE

### SSR Safety (Mandatory)

All files in `lib/value-engine/` and `app/value-engine/` that are imported at the module level must be SSR-safe:
- No `window`, `document`, `localStorage`, `sessionStorage` at module level
- All browser API access behind `typeof window !== 'undefined'`
- All React hooks in `"use client"` files only
- `recharts` and other browser-only packages loaded via `dynamic(() => import(...), { ssr: false })`

### Hydration Protection

- `useEstimateMemory` loads localStorage in `useEffect` — never during SSR
- `useAnalytics` emits via `emit()` which SSR-guards internally
- `UniversalSearch` hydrates recent searches and estimates in `useEffect`

### Lazy-Loading Discipline

- Heavy chart components use `dynamic()` with `ssr: false`
- SEO text components are server components — no `"use client"` unless necessary
- `ResultClient.tsx` is the boundary between server and client on result pages

### Subsystem Isolation

- `lib/value-engine/` subsystems do not import from `components/`
- `components/value-engine/` may import from `lib/value-engine/` but not vice versa
- `recon/` is fully isolated — no imports from app scope
- Analytics, memory, and search are stateless utility modules — no shared mutable state

### Route Safety

- All dynamic routes (`/value-engine/result/[intent]`) have `generateStaticParams` pre-building registered entities
- Unknown intents that pass through (not pre-built) still render via SSR with searchParams fallback
- No unbounded dynamic route generation
