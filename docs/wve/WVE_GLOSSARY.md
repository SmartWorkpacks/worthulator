# WVE GLOSSARY
## Worthulator Value Engine — Platform Terminology
### Version 2.0 | Phase 14 | May 2026

> Standardized language for all WVE architecture discussions, prompts, and documentation.
> Use these exact terms in all future development prompts.

---

## Core Concepts

**Entity**
A structured, registry-validated subject that WVE can estimate. An entity has a canonical name, a unique ID, a vertical, and a full benchmark profile. Examples: `central-ac`, `rolex-submariner-date`, `jordan-1-retro-high-chicago`. No entity may appear on a WVE page unless it is registered.

**Entity Registry**
The singleton data store (`lib/value-engine/entityRegistry/`) that holds all platform entities. All entity lookups, route generation, sitemap inclusion, and monetization decisions flow through the registry.

**Registry Entry**
A single `RegistryEntity` object in the entity registry. Must include: id, canonicalName, aliases, vertical, category, estimationType, benchmark, regional, monetization, seo, and quality profiles.

**Canonical Name**
The official, display-ready name of an entity as stored in the registry. Used in UI, SEO titles, and AI prompts. Example: `"iPhone 16 Pro"`, `"Asphalt Shingle Roof Replacement"`.

**Entity ID**
The URL-safe kebab-case slug uniquely identifying an entity in the registry and in the URL path. Example: `iphone-16-pro`, `asphalt-shingle-roof`, `rolex-gmt-master-ii`.

**Vertical**
One of four top-level entity classifications: `home-services`, `electronics`, `luxury`, `sneakers`. Drives routing, styling (color), and monetization defaults.

---

## Estimation

**Estimation Type**
The category of economic question WVE answers for an entity:
- `service-estimate` — "what will this service cost me?"
- `market-value` — "what is this item worth right now?"
- `appreciation` — "how has this asset's value changed over time?"

**Benchmark Profile**
The structured cost/value data attached to each entity: `lowUSD`, `midUSD` (derived), `highUSD`, `confidenceLevel`, `benchmarkSource`, `lastUpdated` (YYYY-MM). This is the deterministic foundation of every estimate.

**Benchmark Range**
The low–high USD spread for an entity. Example: `$7,000–$14,500`. The mid-point is the primary displayed estimate.

**Confidence Level**
One of three assessments of how reliable the benchmark data is:
- `"high"` — sourced from large national datasets, recently updated
- `"moderate"` — regional sample data or slightly dated
- `"preliminary"` — limited data, higher uncertainty

**Regional Modifier**
A multiplier applied to baseline benchmark values to account for geographic cost differences. Example: a $10,000 national baseline becomes $12,400 in the Northeast after regional adjustment.

**Recon Server**
The live formula computation API (`RECON_API`, default `http://127.0.0.1:4000`). Proxied through `/api/ve/estimate/route.ts` and `/api/ve/search/route.ts`. WVE operates without it via registry fallback — recon enhances, but is not required.

**Registry Fallback**
When the recon server is offline or returns 0 results, the system falls back to registry-based search (`smartSearch`) and static benchmark data. Ensures WVE is always functional.

---

## Quality System

**Quality Score**
A computed 0–100 numeric score representing the reliability and completeness of an entity's data. Computed by `computeQuality(entity)` across 5 weighted dimensions. Never stored statically — always computed fresh.

**Quality Tier**
The categorical classification derived from quality score:
- `premium` — score ≥ 85
- `standard` — score ≥ 65
- `draft` — score ≥ 40
- `blocked` — score < 40 (must not reach production)

**Quality Gate**
The system that prevents low-quality entities from being routed, indexed, or included in the sitemap. Implemented in `lib/value-engine/seo/gates.ts`. All three entry points (generateStaticParams, robots.index, sitemap) use the quality gate.

**Route Eligibility**
Whether an entity's result page should be pre-built at build time. Requires: `entity.quality.routeEligible === true` AND `computedScore >= entity.seo.minQualityGate`.

**Index Eligibility**
Whether an entity's result page should receive `robots.index = true` and appear in the sitemap. Stricter than route eligibility — additionally requires quality tier to be `premium` or `standard`.

**Min Quality Gate**
A per-entity threshold (`seo.minQualityGate`) that the computed quality score must meet for route eligibility. Prevents entities with low-quality data from being pre-built even if manually flagged as eligible.

**Data Freshness**
One of the five quality dimensions. Measures how current the benchmark data is relative to a 2026-05 reference date. Decays linearly over 36 months — data older than 3 years scores 0 on this dimension.

**Auto-Degradation**
The automatic process by which entities with stale or incomplete data lose route/index eligibility without manual intervention. When freshness decays or data quality drops, scores fall, tiers drop, and eligibility is automatically revoked.

---

## Monetization

**Monetization Profile**
The commercial data attached to each entity: `leadSuitability` (0–10), `affiliateSuitability` (0–10), `financingPropensity` (0–10), `averageOrderValue` (USD), `commercialWeight` (high/medium/low).

**Monetization Score**
A 0–10 aggregate score representing the commercial value of showing a specific user a specific entity at a specific engagement level. Calculated by `computeMonetization()`.

**Commercial Weight**
A categorical label (`"high"`, `"medium"`, `"low"`) for the overall commercial importance of an entity. High commercial weight entities receive elevated visual treatment in RelatedEstimates cards.

**Lead Suitability**
0–10 score representing how appropriate a lead generation form is for this entity. Entities with lead suitability ≥ 6 are eligible for primary lead CTA placement.

**Financing Propensity**
0–10 score representing the likelihood a user would benefit from financing options. Financing CTA is shown when propensity ≥ 6 OR estimate amount ≥ $8,000.

**Affiliate Suitability**
0–10 score representing fit for affiliate link placement. High for electronics, luxury goods, and sneakers — lower for service estimates.

**Estimated LTV**
Estimated lifetime value per lead: `averageOrderValue × (leadSuitability/10) × conversionRate`. Used for monetization action prioritization.

**Monetization Action**
A specific commercial CTA generated by `computeMonetization()`. Types: `lead_form`, `affiliate_links`, `financing_cta`, `comparison_tool`, `advisory`. Sorted by priority in the output.

---

## Escalation

**Escalation Score**
A 0–10 computed score indicating how strongly the system should escalate commercial actions to the user. Inputs: estimate amount (28%), engagement time (18%), estimation type (24%), repeat visit (14%), complexity (9%), monetization override (optional). Scores ≥ 7.0 unlock AI enhancement and aggressive monetization.

**Escalation Context**
The input object to `computeEscalationScore()`: `estimateAmount`, `engagementTime`, `estimationType`, `repeatVisit?`, `estimateComplexity?`, `financingLikelihood?`, `monetizationScore?`.

**Financing Threshold**
The USD value above which an estimate is automatically considered financing-relevant: `$5,000`.

**Repeat Visit**
A boolean signal indicating the user has viewed this entity in a previous session. Detected via `isRepeatVisit(entityId)` using sessionStorage. Adds a positive multiplier to escalation score.

---

## Entity Graph

**Entity Graph**
The semantic relationship map between WVE entities. Stored in `lib/value-engine/entityGraph.ts`. Defines which entities are related, with what strength, and why.

**Relationship Strength**
A 0–1 float representing the semantic closeness between two entities in the graph. Higher strength = displayed first in RelatedEstimates. Example: solar panels + heat pump = 0.94 (both high-cost home efficiency).

**Semantic Graph**
The full network of entity relationships across the WVE platform — including both manual entries and registry-derived dynamic relationships.

**Vertical Fallback**
Default related entities for each vertical, used when a specific entity has no manual graph entry. Ensures RelatedEstimates cards are always populated.

**Registry-Driven Relationships**
Dynamic relationships generated by `getRegistryRelated()` — uses the registry to find entities in the same vertical sorted by commercial weight and AOV. The automatic fallback for new entities.

---

## Search

**Smart Search**
WVE's 3-round intelligent search strategy: (1) registry exact/prefix/contains match, (2) query expansion variants, (3) Levenshtein fuzzy character-level matching. Implemented in `lib/value-engine/search/index.ts`.

**Query Expansion**
The process of mapping user abbreviations and synonyms to canonical search terms. Example: `"ac"` → `["central ac", "air conditioner", "central air"]`. 50+ mappings in `queryExpander.ts`.

**Fuzzy Score**
A 0–100 similarity score between a query and a target string, based on Levenshtein edit distance. Fuzzy matches are capped at ~75 to rank below exact and prefix matches.

---

## Memory

**Estimate Record**
A persisted record of a viewed entity: id, entityName, type, vertical, estimateAmount, region, href, viewCount, estimatedAt. Stored in localStorage.

**Memory Session**
The current browser session's view tracking stored in sessionStorage. Used for repeat-visit detection within a single session (as distinct from cross-session history).

**View Count**
The total number of times a user has viewed a specific entity across all sessions. Incremented each time `saveEstimate()` is called. Feeds into escalation scoring.

---

## Analytics

**WVE Event**
One of 9 typed analytics events emitted by the platform: `estimate_searched`, `estimate_selected`, `estimate_viewed`, `estimate_engagement`, `related_clicked`, `lead_form_started`, `lead_form_submitted`, `comparison_viewed`, `affiliate_clicked`.

**Session ID**
A `crypto.randomUUID()` generated identifier stored in sessionStorage for cross-page event attribution within a session.

**GTM dataLayer**
Google Tag Manager's global event queue. WVE pushes events as `{ event: "wve_[name]", wve: payload }`.

**DOM Event Bus**
The `CustomEvent("wve:event")` channel dispatched on `window` for internal subscribers. Allows decoupled components to react to WVE events without prop drilling.

---

## AI Layer

**AI Context Payload**
The structured data object assembled by `buildAIContext()` for AI API calls (schema v2.0). Contains: entity identity, economic class, economic model, lifecycle type, benchmark range, volatility profile, regional economics, quality assessment, monetization summary, related entities, user context.

**System Prompt**
The LLM system-turn string generated by `formatSystemPrompt(payload, config)`. Establishes WVE as an economic interpretation assistant and injects entity-specific context, economic class framing (`CLASS_FRAME`), model-specific reasoning instructions (`MODEL_INSTRUCTION`), benchmark data, regional signals, and tone instructions.

**Class Frame**
The entity-class-specific reasoning context injected into every AI system prompt. Example: a `services` entity prompt says "This is a SERVICE entity. The estimate represents a project cost (labor + materials)." — ensuring the LLM frames responses as project economics, not asset valuation.

**Model Instruction**
The economic-model-specific focus instruction in the AI prompt. Example: `project-economics` → "Frame your response around project scope, labor, materials, and timing." Ensures AI reasoning is aligned to the correct economic lens.

**AI Escalation Threshold**
The escalation score (≥ 7.0) required before AI enhancement is surfaced to the user. Below this threshold, the deterministic estimate is presented without AI augmentation.

**Token Budget**
The maximum context size passed to an AI API. `toJSONContext(payload, { maxContextTokens })` auto-compacts the payload when it would exceed the budget. Compact form preserves `entityClass` and `economicModel` as priority fields.

**Schema Version**
The `schemaVersion` field in `AIContextPayload`. Current: `"2.0"` (Phase 14). Version `"1.0"` is deprecated — it lacked economic class, regional economics, and lifecycle fields.

---

## Economic Intelligence (Phase 14)

**Contextual Economic Intelligence Platform**
What WVE is. Not a cost estimator. Not a calculator directory. A platform that classifies entities by their economic nature, applies the correct economic model, accounts for regional variance, and produces contextually grounded intelligence — powered by deterministic benchmark data.

**Economic Entity Class**
One of 8 classifications that determines how WVE interprets and reasons about an entity:
`services`, `products`, `assets`, `utilities`, `ownership-economics`, `investments`, `life-events`, `business-economics`.

**Economic Model**
One of 9 lenses through which an entity's economics are interpreted:
`project-economics`, `depreciation`, `appreciation`, `resale-value`, `recurring-burden`, `ownership-burden`, `future-value`, `timeline-economics`, `operational-economics`.

**Lifecycle Type**
How an entity moves through time economically. One of 6 types:
`one-time-purchase`, `recurring-cost`, `project-based`, `lifecycle-asset`, `milestone-event`, `perpetual-holding`.

**Volatility Profile**
A structured descriptor of how predictable an entity's estimate is. Fields: `regionalVariance` (1–10), `temporalVariance` (1–10), `marketSensitivity` (1–10), `volatilityLabel` (stable/moderate/volatile/highly-volatile).

**Economic Interpretation**
The combination of `entityClass` + `economicModel` + `lifecycleType` that defines how WVE frames, explains, and monetizes a specific entity. Resolved by `resolveEconomicInterpretation()` in `intentRouter.ts`.

**Cross-Class Topology**
Semantic relationships between entities of different economic classes. Example: a roof replacement (`services`) links to home value increase (`assets`) with `investment-adjacency` relationship type. Managed in `CROSS_CLASS_GRAPH` in `entityGraph.ts`.

**Investment Adjacency**
A cross-class relationship type where a service or product entity meaningfully affects an asset's value. Example: kitchen remodel → home value appreciation.

**Operational Adjacency**
A cross-class relationship type where a services entity affects a utilities burden. Example: solar panel installation → electricity cost reduction.

**Lifecycle Adjacency**
A cross-class relationship type where two products share a depreciation or resale lifecycle. Example: iPhone 16 Pro → iPhone 15 depreciation curve comparison.

---

## Regional Intelligence (Phase 14)

**Regional Economic Profile**
A structured 11-field descriptor of a specific geographic market's economic conditions. Used to adjust monetization signals, generate trust context, and inform AI prompt regional sections.

**Labor Tier**
A categorical rating of labor costs in a region: `budget`, `below-average`, `average`, `above-average`, `premium`. Drives `applyRegionalModifier()` multipliers (0.8× for budget → 1.3× for premium).

**Monetization Multiplier**
A regional float (0.8–1.8) that scales lead and affiliate priority for a given region. High-cost markets (CA=1.6, FL=1.55, NY=1.55) produce more valuable leads than baseline markets.

**Regional Trust Signal**
A contextual message surfaced in the UI to explain why estimates vary in a specific region. Generated by `getRegionalTrustSignals(regionId, entityClass)`. Class-filtered — investment entities do not receive labor-tier signals.

**Financing Pressure**
A 1–10 regional score representing how commonly financing is used in that market. High financing pressure amplifies the monetization multiplier for financing CTA actions.

**Disaster Exposure**
A categorical rating of natural disaster risk in a region (`none`, `low`, `moderate`, `high`). High disaster exposure surfaces an insurance pressure trust signal for `services` and `assets` entities.

**Regulation Intensity**
A categorical rating of construction/service regulatory burden (`low`, `moderate`, `high`, `extreme`). High regulation increases effective project cost in a region.

**Insurance Pressure**
A 1–10 regional score representing how elevated insurance costs are in that market. Drives the `insurance_cta` monetization action for relevant entities.

**Regional Confidence**
A 0.0–1.0 float representing how reliable the regional profile data is. Profiles with confidence < 0.85 display a reduced-confidence trust signal.

**Nationwide Baseline**
The `nationwide` regional profile — the permanent fallback when no specific region is known. All regional multipliers are calibrated relative to this baseline (multiplier = 1.0).

---

## SEO

**Route Namespace**
The `/value-engine/` URL prefix that contains all WVE pages. All WVE entity result pages are at `/value-engine/result/[intent]`.

**SEO Priority**
A three-level classification (`"high"`, `"medium"`, `"low"`) that determines sitemap priority (0.9/0.8/0.7) and change frequency (weekly/monthly).

**Search Volume Tier**
The organic search demand classification for an entity's primary keyword: `"high"`, `"medium"`, `"low"`. Contributes to the SEO completeness quality dimension.

**Sitemap Inclusion**
The `seo.includeInSitemap` flag combined with `indexEligible = true` determines whether an entity URL appears in `app/sitemap.ts`. Both conditions must be true.

**Thin Page**
A result page lacking sufficient semantic depth — missing SEO components, related entities, or backed by low-confidence data. WVE's quality gate prevents thin pages from being indexed.

**SSR Content**
Server-rendered HTML content present in the initial page load. Required for all WVE SEO components — they must not depend on client-side JavaScript to produce their output.
