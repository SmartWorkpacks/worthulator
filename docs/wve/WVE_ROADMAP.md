# WVE ROADMAP
## Worthulator Value Engine — Phase History & Future
### Version 2.0 | Phase 14 | May 2026

---

## COMPLETED PHASES

### Phase 1 — Foundation
**Established:** Core WVE namespace, basic intent routing, initial type definitions.
- `lib/value-engine/types.ts` — `EstimationType`, `VerticalSlug`, `EntitySearchResult`, `IntentRoute`
- `lib/value-engine/intentRouter.ts` — `routeIntent()`, `VERTICAL_META`
- Route namespace `/value-engine/` established
- `app/value-engine/page.tsx` — landing page

### Phase 2 — Estimation Runtime
**Established:** Live formula computation via recon server proxy.
- `app/api/ve/estimate/route.ts` — proxies to recon API
- `app/api/ve/search/route.ts` — entity search proxy
- `app/value-engine/result/[intent]/page.tsx` — initial result page
- `app/value-engine/result/[intent]/ResultClient.tsx` — client hydration boundary
- **Breakthrough:** Server/client boundary design pattern for SSR-safe result pages

### Phase 3 — SEO Content Layer
**Established:** Structured semantic content for entity result pages.
- `components/value-engine/seo/EntityIntro.tsx`
- `components/value-engine/seo/EstimateExplanation.tsx`
- `components/value-engine/seo/RegionalContext.tsx`
- `components/value-engine/seo/RelatedEstimates.tsx` (initial)
- `components/value-engine/seo/FAQBlock.tsx`
- **Breakthrough:** All SEO components server-rendered — no client-side dependency for indexable content

### Phase 4 — Entity Graph (Initial)
**Established:** Manual semantic relationship map between home-services entities.
- `lib/value-engine/entityGraph.ts` — `SERVICE_GRAPH`, `VERTICAL_FALLBACK`, `getRelatedEntities()`
- 20+ manual relationship entries
- **Breakthrough:** Related estimates populated from a structured graph, not random suggestions

### Phase 5 — Universal Search
**Established:** Client-side search UI with recon API integration.
- `components/value-engine/UniversalSearch.tsx` — full-featured search with debounce, keyboard nav, grouped results, recent searches
- **Breakthrough:** SSR-safe recent searches (hydrated in useEffect)

### Phase 6 — Escalation Scoring
**Established:** Behavioral signal processing for monetization pressure calibration.
- `lib/value-engine/escalationScorer.ts` — `computeEscalationScore()` with 5 weighted dimensions
- `FINANCING_THRESHOLD = $5,000`
- **Breakthrough:** Monetization actions now contextually triggered, not static

### Phase 7 — Monetization Foundation
**Established:** Initial monetization architecture on result pages.
- Lead form integration
- Escalation-triggered CTA display
- **Breakthrough:** Commercial actions tied to escalation score, not page position

### Phase 8 — Regional Intelligence
**Established:** Geographic cost variance for home-services estimates.
- Regional modifier system
- `RegionalContext` component enriched with state-level data
- `data/us/` and `data/uk/` regional data structures

### Phase 9 — Trust Layer
**Established:** Benchmark source citation and confidence communication.
- Confidence badges on estimate output
- Source attribution in EntityIntro
- **Breakthrough:** Users can see WHY they should trust the estimate

### Phase 10 — UK Platform Extension
**Established:** UK regional variants for applicable home-service entities.
- `components/pi-uk/` — UK-specific estimate components
- `lib/pi-uk/` — UK formula logic
- Locale detection and `RegionToggle` component

### Phase 11 — API Architecture Hardening
**Established:** Production-grade API route design.
- All API routes SSR-safe
- Error handling standardized
- Recon offline graceful degradation (initially: empty results with offline notice)
- `app/api/ve/search/route.ts` hardened

### Phase 12 — Advanced Escalation + Entity Graph Expansion
**Established:** Enriched escalation inputs, cross-vertical graph fallbacks.
- `escalationScorer.ts`: added `repeatVisit?`, `estimateComplexity?`, `financingLikelihood?`
- `entityGraph.ts`: `VERTICAL_FALLBACK` populated for electronics/luxury/sneakers
- **Breakthrough:** Escalation now personalised (repeat visit detection)

### Phase 13 — Intelligence + Scale Infrastructure
**Established:** Full platform intelligence architecture. 25 files created/modified. 11 subsystems built.

1. **Entity Registry** — singleton class, 25 entities across 4 verticals, full benchmark/monetization/SEO/quality profiles
2. **Dynamic Route Generation** — `generateStaticParams` pre-builds all registry-eligible routes at build time
3. **Quality Scoring System** — 5-dimensional computed quality scorer, tier classification, auto-degradation
4. **Monetization Intelligence** — registry-first engine, engagement amplifier, financing gate, sorted action output
5. **Entity Graph Expansion** — `strength` values on all relationships, `getRegistryRelated()` dynamic fallback
6. **Related Estimate Automation** — dynamic graph + registry fallback, benchmark range badges, strength dots, type-adaptive heading
7. **Estimation Memory Layer** — localStorage history (cap 20), sessionStorage repeat-visit detection, `useEstimateMemory` hook
8. **Search Intelligence** — Levenshtein fuzzy, 50+ query expansions, 3-round smart search, registry API fallback (search works offline)
9. **Platform Analytics Hooks** — 9 typed events, GTM dataLayer + DOM bus + dev logging, `useAnalytics` hook
10. **AI Preparation Layer** — `buildAIContext()`, `formatSystemPrompt()`, `formatUserMessage()`, `toJSONContext()`
11. **SEO Scale Safeguards** — `gates.ts` quality-gated route/sitemap generation, sitemap now includes all 25 WVE entity URLs

**Phase 13 Breakthroughs:**
- First time WVE operates fully without recon server (registry fallback throughout)
- Quality gate is now dynamic (computed, not static flags)
- AI layer is ready — just needs API route and UI surface
- Analytics architecture in place — GTM can be connected immediately

---

### Phase 14 — Contextual Economic Intelligence ← CURRENT
**Established:** WVE doctrine evolution — from estimation platform to Contextual Economic Intelligence Platform.

1. **Type System Foundation** — `EconomicEntityClass` (8 classes), `EconomicModel` (9 models), `LifecycleType` (6 types), `VolatilityProfile`, `RegionalEconomicProfile` — all in `lib/value-engine/types.ts`
2. **Entity Registry Evolution** — registry entities now accept `entityClass?`, `economicModel?`, `lifecycleType?`, `volatilityProfile?`; query filters updated; all new fields optional (backward compatible)
3. **Regional Intelligence Layer** — `lib/value-engine/regional/` — 12 regional profiles, 6 pure SSR-safe functions, `resolveRegionalContext()`, trust signals, monetization multipliers
4. **Intent Router Evolution** — `resolveEconomicInterpretation()` derives class/model/lifecycle from entity + type; `routeIntent()` embeds interpretation in return; `ECONOMIC_MODEL_LABELS` + `ENTITY_CLASS_LABELS` for display
5. **Entity Graph Evolution** — `CROSS_CLASS_GRAPH` — 6 cross-class relationships (services→assets, services→utilities, investments→investments, products→products/depreciation); `getCrossClassRelated()` public function; `RelatedEntity` extended with `economicClass?` + `economicModel?`
6. **Monetization Intelligence Evolution** — 4 new action types (`resale_marketplace`, `savings_offer`, `broker_affiliate`, `insurance_cta`); `classActions()` entity-class strategy map; regional multiplier applied to lead/affiliate priorities
7. **AI Context Evolution** — `AIContextPayload` v2.0: adds `entityClass`, `economicModel`, `lifecycleType`, `volatility?`, `regionalEconomics?`; `formatSystemPrompt()` now class-aware with `CLASS_FRAME` + `MODEL_INSTRUCTION` tables; `formatUserMessage()` model-aware default questions; `toJSONContext()` compact form preserves economic class fields
8. **Documentation** — All 6 `docs/wve/` files updated with Contextual Economic Intelligence Doctrine

**Phase 14 Breakthroughs:**
- WVE is no longer a "cost estimator" — it is a **Contextual Economic Intelligence Platform**
- 8 entity classes enable distinct AI reasoning per entity type (investments ≠ services ≠ utilities)
- Regional intelligence is now first-class, not presentation-layer
- Cross-class entity graph unlocks topology across: service → asset, service → utility, investment → investment
- AI prompts now carry economic model lens — AI response quality fundamentally improved

---

## CURRENT PLATFORM STATE (POST-PHASE 14)

### Entity Coverage
| Vertical | Entities | Status |
|---|---|---|
| home-services | 10 | Production-ready |
| electronics | 5 | Production-ready |
| luxury | 5 | Production-ready |
| sneakers | 5 | Production-ready |
| **Total** | **25** | |

### Subsystem Status
| Subsystem | Status |
|---|---|
| Entity Registry | ✅ Complete (Phase 14: economic class fields) |
| Intent Router | ✅ Complete (Phase 14: interpretation resolver) |
| Estimation Runtime | ✅ Complete (recon + fallback) |
| Quality Gating | ✅ Complete |
| Entity Graph | ✅ Complete (Phase 14: cross-class topology) |
| Escalation Scoring | ✅ Complete |
| Monetization Engine | ✅ Complete (Phase 14: class-aware actions) |
| Regional Intelligence | ✅ Complete (Phase 14: 12 profiles) |
| Memory Layer | ✅ Complete |
| Analytics Layer | ✅ Complete |
| Search Intelligence | ✅ Complete |
| AI Preparation Layer | ✅ Complete (Phase 14: schema v2.0) |
| SEO Layer | ✅ Complete |
| UK Extension | ✅ Complete |

---

## FUTURE PHASES

### Phase 15 — AI Integration (Live)
**Target:** Wire `buildAIContext()` into actual AI API calls.
- `app/api/ve/ai/route.ts` — OpenAI/Claude API route using `buildAIContext()` + `formatSystemPrompt()`
- AI interpretation panel on result pages (escalation-gated, score ≥ 7.0)
- `useAIInsight(entityId, ctx)` hook — manages AI fetch state
- Streaming response support
- Monetized: AI insights are a premium escalation feature
- **Now possible:** Economic class-aware AI responses (Phase 14 context layer is ready)

### Phase 16 — Premium Estimation Layer
**Target:** Per-entity advanced calculation with user inputs.
- Configurable estimate inputs per entity (sq footage, brand tier, region)
- Formula builder for parameterized estimates
- Save-and-compare functionality
- Guest vs. signed-in estimate persistence

### Phase 17 — Entity Coverage Expansion
**Target:** 100+ entities across all verticals, including new entity classes.
- Home services: plumbing, electrical, windows, siding, HVAC tune-up, etc.
- Electronics: Samsung Galaxy, Surface Pro, Meta Quest, gaming laptops
- Luxury: Hermes, Cartier, additional Rolex references
- Sneakers: Travis Scott, Off-White, New Balance 990, Samba
- New class **life-events**: wedding, home purchase (`timeline-economics` model)
- New class **ownership-economics**: vehicle ownership, EV total cost
- New class **utilities**: electricity plans, internet bundles

### Phase 18 — Enterprise API Layer
**Target:** Expose WVE estimation capabilities as an authenticated API.
- `POST /api/ve/v1/estimate` — authenticated estimation endpoint
- Rate-limited API keys
- Webhook support for lead events
- Partner affiliate integration with tracked attribution
- Revenue share model for enterprise consumers

### Phase 19 — Comparison Engine
**Target:** Side-by-side entity comparison pages.
- `/value-engine/compare/[a]-vs-[b]` route
- Benchmarked comparison table (cost, confidence, regional variance)
- Entity graph-informed comparison suggestions
- Dedicated sitemap section
- Quality-gated (both entities must be indexEligible)

### Phase 19 — User Accounts + Saved Estimates
**Target:** Authenticated estimate persistence and history.
- Supabase-backed user authentication
- `estimate_records` table (userId, entityId, amount, region, timestamp)
- Saved estimate dashboard
- Compare saved estimates over time (appreciation tracking)
- Notification when benchmark data is updated for a saved entity

### Phase 20 — Predictive Intelligence
**Target:** Trend-based appreciation forecasting.
- Time-series benchmark data for tracked entities
- Appreciation curves for luxury/sneakers/electronics
- "Best time to sell/buy" signals
- Integration with external market APIs (StockX, eBay, etc.)
- Forecasting quality gate: only entities with ≥ 24 months of data qualify

---

## PENDING SYSTEMS

### Near-Term
- **AI insight panel** (Phase 14 prerequisite) — component shell exists, needs API wiring
- **`useEstimateMemory` integration** on result pages — hook exists, not yet wired to escalation context
- **`useAnalytics` on result pages** — `estimate_viewed` event not yet fired on page load
- **Monetization component rendering** — `computeMonetization()` exists, UI components need creation

### Medium-Term
- **Schema.org markup** — `Product`, `Service`, `FAQPage` structured data on result pages
- **OpenGraph images** — dynamic OG image generation per entity
- **A/B testing layer** — variant testing for escalation thresholds and monetization placements
- **Benchmark data pipeline** — automated `updateCostBenchmarks.ts` integration with WVE registry

### Long-Term
- **Vector search** — semantic similarity search beyond keyword/fuzzy matching
- **Personalisation engine** — entity recommendations based on full estimate history
- **Real-time benchmarking** — live data feeds updating registry profiles
- **Multi-region architecture** — full UK/CA/AU entity sets
