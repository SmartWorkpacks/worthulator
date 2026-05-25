# WVE PLATFORM RULES
## Non-Negotiable Engineering Laws
### Version 2.0 | Phase 14 | May 2026

> These rules are not suggestions. They are platform law.
> Violating any rule constitutes an architecture breach.

---

## ENTITY RULES

**RULE E-1**
NEVER create a WVE result page for an entity that is not in the entity registry.
Every URL must have a corresponding `RegistryEntity` in `lib/value-engine/entityRegistry/`.

**RULE E-2**
NEVER hardcode entity names, prices, or metadata directly in component files.
Always resolve from `registry.get(entityId)` or the benchmark profile.

**RULE E-3**
NEVER add an entity to the registry without a complete `BenchmarkProfile`.
`lowUSD`, `midUSD` (derived), `highUSD`, `confidenceLevel`, `benchmarkSource`, and `lastUpdated` are all required.

**RULE E-4**
NEVER skip the `seo` and `monetization` profile blocks on a registry entry.
Incomplete entries are blocked from indexing by the quality gate — but they should not be committed incomplete.

---

## QUALITY GATE RULES

**RULE Q-1**
NEVER bypass the quality gate for any entity going to production.
`generateStaticParams` MUST use `getRouteEligibleEntities()` from `lib/value-engine/seo/gates.ts`.

**RULE Q-2**
NEVER set `robots.index = true` manually on a WVE result page.
Index eligibility is exclusively determined by `evaluateGate(entityId).indexEligible`.

**RULE Q-3**
NEVER add an entity to the sitemap by manually inserting a URL.
Sitemap entries are generated exclusively from `getSitemapEntities()`.

**RULE Q-4**
NEVER set `minQualityGate` below 40 on any entity.
Entities below 40 are in `blocked` tier and must not reach production.

---

## SSR RULES

**RULE S-1**
NEVER access `window`, `document`, `localStorage`, or `sessionStorage` at module scope.
All browser API access must be inside `useEffect`, event handlers, or behind `typeof window !== 'undefined'`.

**RULE S-2**
NEVER add `"use client"` to files inside `lib/value-engine/`.
Library modules are shared between server and client — they must be SSR-safe.

**RULE S-3**
NEVER import recharts, browser animation libraries, or any browser-only package at the top level of a server component.
Use `dynamic(() => import(...), { ssr: false })` for all browser-only components.

**RULE S-4**
NEVER use `useEffect` or `useState` in server components.
The `ResultClient.tsx` boundary is the designated client entry point on result pages.

---

## ARCHITECTURE ISOLATION RULES

**RULE A-1**
NEVER import from `recon/` in the parent app.
NEVER import from the parent app in `recon/`.
This boundary is permanent and absolute.

**RULE A-2**
NEVER import WVE subsystems into legacy calculator files (`app/tools/`, `components/calculators/`, `lib/calculators/`).
NEVER import legacy calculator systems into WVE files.
The two architectures are permanently isolated.

**RULE A-3**
NEVER import from `components/` inside `lib/value-engine/`.
Data flows one way: `lib/` → `components/`.

**RULE A-4**
NEVER create shared mutable state between WVE subsystems.
Registry, quality, graph, monetization, analytics, memory, search, and AI context are stateless utilities.

---

## ROUTE RULES

**RULE R-1**
NEVER create unbounded dynamic routes for WVE entities.
Every entity route must be backed by a registry entry with `routeEligible: true`.

**RULE R-2**
NEVER remove `generateStaticParams` from the WVE result page.
Pre-building registered entities is required for SEO and performance.

**RULE R-3**
NEVER create WVE pages outside the `/value-engine/` route namespace.

---

## AI RULES

**RULE AI-1**
NEVER let AI generate a price estimate directly.
All estimates must originate from `BenchmarkProfile` data in the entity registry.

**RULE AI-2**
NEVER call an AI API from a WVE subsystem library (`lib/value-engine/`).
AI API calls belong in API routes only (`app/api/ve/`).

**RULE AI-3**
NEVER surface AI-generated content on an indexed WVE page without a deterministic benchmark backing it.

**RULE AI-4**
ALWAYS use `buildAIContext()` before constructing any AI prompt for a WVE entity.
Never manually assemble entity context for AI — use the prepared payload.

**RULE AI-5**
NEVER escalate to AI without an escalation score ≥ 7.0.
Below this threshold, the deterministic estimate is sufficient.

---

## SEO RULES

**RULE SEO-1**
NEVER publish a WVE entity page without all 5 SEO components:
`EntityIntro`, `EstimateExplanation`, `RegionalContext`, `RelatedEstimates`, `FAQBlock`.

**RULE SEO-2**
NEVER generate low-quality entity pages to inflate page count.
One high-quality entity page is worth more than ten thin pages.

**RULE SEO-3**
NEVER manually override `robots.noindex` to force-index a low-quality entity.

**RULE SEO-4**
NEVER remove data freshness decay from the quality scorer.
Stale data must auto-degrade — this is a platform safety mechanism.

**RULE SEO-5**
ALWAYS populate `seo.relatedKeywords` with at minimum 3 entries per entity.
This is required for SEO completeness scoring.

---

## MONETIZATION RULES

**RULE M-1**
NEVER hardcode monetization CTAs in result page components.
All monetization actions come from `computeMonetization(ctx).actions`.

**RULE M-2**
NEVER show a financing CTA for entities with `financingPropensity < 4`.

**RULE M-3**
NEVER show a lead form for entities with `leadSuitability < 5`.

**RULE M-4**
NEVER modify `EscalationScorer` weights without a documented architectural decision.

---

## ENTITY CLASS RULES (Phase 14)

**RULE EC-1**
NEVER leave `entityClass` unresolved for an entity that appears in an AI context payload.
If the registry entity does not declare `entityClass`, the `VERTICAL_TO_CLASS` fallback in `builder.ts` must resolve it. Unclassified entities produce generic AI responses.

**RULE EC-2**
NEVER assign `entityClass` based on the page vertical alone when a more precise class exists.
A Rolex is `investments`, not `products`, even though it lives in the luxury vertical.
A home purchase is `life-events`, not `services`, even if it involves service spending.

**RULE EC-3**
NEVER mix economic models across entity class assignments.
`investments` entities use `future-value` or `resale-value`. `services` use `project-economics`.
Cross-model assignments confuse AI reasoning and distort monetization prioritization.

**RULE EC-4**
ALWAYS set `lifecycleType` consistently with `economicModel`.
`project-economics` → `project-based`. `appreciation` → `perpetual-holding` or `lifecycle-asset`.
Inconsistent lifecycle assignments produce incorrect timeline framing.

---

## REGIONAL INTELLIGENCE RULES (Phase 14)

**RULE REG-1**
NEVER access regional data without going through `lib/value-engine/regional/`.
Do NOT manually hardcode regional multipliers in entity files, components, or API routes.

**RULE REG-2**
NEVER return `undefined` from `getRegionalProfile()`.
The `nationwide` profile is the permanent fallback. Any unknown `regionId` MUST resolve to nationwide.

**RULE REG-3**
NEVER apply `applyRegionalModifier()` to benchmark data in the registry.
Registry benchmarks are national figures. Regional adjustment is a runtime operation, never baked into stored data.

**RULE REG-4**
NEVER show regional trust signals for entity classes where regional variance is low.
`investments` entities (e.g., Rolex) are not subject to labor tier signals — their value is market-driven, not regional.
Use `getRegionalTrustSignals(regionId, entityClass)` — it filters by class automatically.

**RULE REG-5**
NEVER add a new regional profile without all 11 fields of `RegionalEconomicProfile`.
Partial profiles break the type constraint and produce incorrect multiplier behavior.

---

## ANALYTICS RULES

**RULE AN-1**
NEVER fire analytics events that are not defined in `lib/value-engine/analytics/types.ts`.
Adding new events requires extending the `WVEEvent` union type first.

**RULE AN-2**
NEVER call `emit()` at module level — only inside event handlers or `useEffect`.

**RULE AN-3**
NEVER push directly to `window.dataLayer` from component code.
Always use `emit()` from the analytics layer.

---

## MEMORY RULES

**RULE ME-1**
NEVER read localStorage or sessionStorage outside of `lib/value-engine/memory/storage.ts`.
All memory operations go through the memory module's public API.

**RULE ME-2**
NEVER store sensitive user data in the WVE memory layer.
Only entity IDs, names, types, verticals, and estimate amounts are permitted.
