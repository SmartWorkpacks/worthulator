# WVE ARCHITECTURE MAP
## Worthulator Value Engine — System Overview
### Version 2.0 | Phase 14 | May 2026

---

## 1. FOLDER STRUCTURE

```
Worthulator-main/
├── app/
│   ├── value-engine/                   ← WVE route namespace
│   │   ├── page.tsx                    ← Landing page (search entry)
│   │   └── result/
│   │       └── [intent]/
│   │           ├── page.tsx            ← Entity result page (SSR)
│   │           └── ResultClient.tsx    ← Client hydration boundary
│   └── api/
│       └── ve/
│           ├── search/route.ts         ← Search API (recon + registry fallback)
│           └── estimate/route.ts       ← Estimation API (recon proxy)
│
├── components/
│   └── value-engine/
│       ├── UniversalSearch.tsx         ← Search UI (client)
│       ├── seo/
│       │   ├── EntityIntro.tsx         ← Entity identity block (server)
│       │   ├── EstimateExplanation.tsx ← What drives the estimate (server)
│       │   ├── RegionalContext.tsx     ← Geographic variance (server)
│       │   ├── RelatedEstimates.tsx    ← Related entity cards (server)
│       │   └── FAQBlock.tsx            ← FAQ for rich snippets (server)
│       └── [other UI components]
│
├── lib/
│   └── value-engine/
│       ├── types.ts                    ← Shared types (EstimationType, VerticalSlug, EconomicEntityClass, etc.)
│       ├── intentRouter.ts             ← Maps entity to intent route + economic interpretation (Phase 14)
│       ├── escalationScorer.ts         ← Engagement → escalation score
│       ├── entityGraph.ts              ← Semantic relationships (cross-class topology, Phase 14)
│       │
│       ├── entityRegistry/             ← SUBSYSTEM: Entity data store
│       │   ├── types.ts                ← RegistryEntity (+ entityClass?, economicModel?, lifecycleType?, Phase 14)
│       │   ├── registry.ts             ← EntityRegistry class
│       │   ├── index.ts                ← Singleton + bootstrap
│       │   └── entries/
│       │       ├── homeServices.ts     ← 10 home-service entities
│       │       ├── electronics.ts      ← 5 electronics entities
│       │       ├── luxury.ts           ← 5 luxury watch entities
│       │       └── sneakers.ts         ← 5 sneaker entities
│       │
│       ├── regional/                   ← SUBSYSTEM: Regional intelligence (Phase 14)
│       │   ├── profileTypes.ts         ← RegionalTrustSignal, RegionalMonetizationSignal, ResolvedRegionalContext
│       │   ├── regionalProfiles.ts     ← REGIONAL_PROFILES (12 profiles: nationwide, CA, TX, FL, NY, AZ, GA, SC, IL, CO, WA, UK)
│       │   ├── regionalEconomics.ts    ← Pure SSR-safe functions: getRegionalProfile, applyRegionalModifier, resolveRegionalContext, etc.
│       │   └── index.ts                ← Barrel export
│       │
│       ├── quality/                    ← SUBSYSTEM: Quality scoring
│       │   ├── types.ts                ← QualityAssessment, QualityTier, etc.
│       │   ├── scorer.ts               ← computeQuality(), generateQualityReport()
│       │   └── index.ts
│       │
│       ├── monetization/               ← SUBSYSTEM: Monetization intelligence (Phase 14: class-aware actions)
│       │   ├── types.ts                ← MonetizationAssessment (+entityClass?, +regionalNote?), MonetizationAction (4 new types)
│       │   ├── engine.ts               ← computeMonetization() (+ classActions(), regional multiplier)
│       │   └── index.ts
│       │
│       ├── memory/                     ← SUBSYSTEM: Estimation memory
│       │   ├── types.ts                ← EstimateRecord, MemoryStore
│       │   ├── storage.ts              ← SSR-safe localStorage/sessionStorage ops
│       │   └── index.ts
│       │
│       ├── analytics/                  ← SUBSYSTEM: Event analytics
│       │   ├── types.ts                ← WVEEvent union type (9 events)
│       │   ├── emitter.ts              ← emit(), onEvent()
│       │   └── index.ts
│       │
│       ├── search/                     ← SUBSYSTEM: Search intelligence
│       │   ├── fuzzy.ts                ← levenshtein(), fuzzyScore()
│       │   ├── queryExpander.ts        ← expandQuery() (50+ synonym mappings)
│       │   └── index.ts                ← smartSearch()
│       │
│       ├── aiContext/                  ← SUBSYSTEM: AI preparation (Phase 14: schema v2.0)
│       │   ├── types.ts                ← AIContextPayload v2.0 (+ entityClass, economicModel, lifecycleType, regionalEconomics)
│       │   ├── builder.ts              ← buildAIContext() (+ cross-class related, regional economics population)
│       │   ├── promptFormatter.ts      ← formatSystemPrompt() (CLASS_FRAME + MODEL_INSTRUCTION), formatUserMessage(), toJSONContext()
│       │   └── index.ts
│       │
│       └── seo/                        ← SUBSYSTEM: SEO quality gates
│           └── gates.ts                ← getRouteEligibleEntities(), getSitemapEntities(), etc.
│
├── hooks/
│   └── value-engine/
│       ├── useEstimateMemory.ts        ← Estimation history hook
│       └── useAnalytics.ts             ← track() hook
│
└── docs/
    └── wve/                            ← THIS DOCUMENTATION
```

---

## 2. ROUTING MAP

```
/value-engine                           ← Landing: UniversalSearch
/value-engine/result/[intent]           ← Entity result page

[intent] = registry entity id
  Examples:
    /value-engine/result/central-ac
    /value-engine/result/rolex-submariner-date
    /value-engine/result/iphone-16-pro
    /value-engine/result/jordan-1-retro-high-chicago

URL also accepts searchParams for live navigation:
  ?type=service-estimate
  ?name=Central+Air+Conditioning
  ?vertical=home-services
  ?serviceType=central-ac
  ?region=TX
```

---

## 3. ENTITY FLOW

```
User types query in UniversalSearch
    │
    ▼
/api/ve/search?q=...
    │
    ├─→ Recon API (if online): live entity search
    │       │
    │       └─→ 0 results? → smartSearch() [registry fallback]
    │
    └─→ Recon offline? → smartSearch() [registry fallback]
            │
            ├─ Round 1: registry.search(originalQuery)
            ├─ Round 2: expanded variants via expandQuery()
            └─ Round 3: Levenshtein fuzzy across all entities
    │
    ▼
User selects result → track(estimate_selected)
    │
    ▼
router.push(intent.href)
    │
    ▼
/value-engine/result/[intent]
    │
    ├─→ generateMetadata: registry.get(intent) → keywords, description, robots.index
    │
    ▼
ResultPage (server)
    │
    ├─ entity = registry.get(intent)          ← entity identity
    ├─ type, vertical, category from registry  ← or searchParams fallback
    │
    ├─→ EntityIntro           (server component)
    ├─→ ResultClient          (client boundary)
    ├─→ EstimateExplanation   (server)
    ├─→ RegionalContext       (server)
    ├─→ RelatedEstimates      (server, auto-populated from entity graph)
    └─→ FAQBlock              (server)
```

---

## 4. QUALITY GATE FLOW

```
Entity added to registry
    │
    ▼
computeQuality(entity)
    │
    ├─ estimateConfidence   (30%) ← entity.quality.estimateConfidence
    ├─ benchmarkConfidence  (25%) ← entity.benchmark.confidenceLevel
    ├─ dataFreshness        (20%) ← age from 2026-05 reference, 36-month decay
    ├─ seoCompleteness      (15%) ← keywords, sitemap, searchVolumeTier
    └─ profileCompleteness  (10%) ← range validity, aliases, monetization
    │
    ▼
score (0–100) → tier
    │
    ├─ ≥85 → premium
    ├─ ≥65 → standard
    ├─ ≥40 → draft
    └─ <40 → blocked
    │
    ▼
routeEligible = staticFlag && score >= minQualityGate
    │
    ▼
indexEligible = routeEligible && (tier === "premium" || tier === "standard")
    │
    ├─→ generateStaticParams: getRouteEligibleEntities() → pre-built routes
    ├─→ robots.index: evaluateGate(intent).indexEligible
    └─→ sitemap: getSitemapEntities() → only indexEligible entities
```

---

## 5. MONETIZATION FLOW

```
User arrives on result page
    │
    ▼
ResultClient mounts
    │
    ▼
EscalationContext assembled:
    ├─ estimateAmount      (from estimate runtime)
    ├─ engagementTime      (from scroll/interaction tracking)
    ├─ estimationType      (from registry/searchParams)
    ├─ repeatVisit         (from isRepeatVisit() — sessionStorage)
    └─ estimateComplexity  (from entity serviceType)
    │
    ▼
computeEscalationScore(ctx) → 0–10
    │
    ▼
MonetizationContext assembled:
    ├─ estimateAmount
    ├─ estimationType
    ├─ engagementScore (from escalation score)
    └─ entityId (from registry)
    │
    ▼
computeMonetization(ctx)
    │
    ├─ Registry lookup: entity.monetization profile
    ├─ Engagement amplifier applied
    ├─ Financing gate evaluated
    └─ actions[] sorted by priority
    │
    ▼
Render monetization components:
    ├─ score ≥ 7 + leadSuitability ≥ 6  → LeadForm
    ├─ financingGate                     → FinancingCTA
    ├─ affiliateSuitability ≥ 6          → AffiliateLinks
    └─ default                           → Advisory
```

---

## 6. AI PREPARATION FLOW

```
AI feature triggered (escalation ≥ 7.0)
    │
    ▼
buildAIContext({
    entityId,
    estimateAmount,
    region,
    isRepeatVisit,
    viewCount,
    sessionEstimateCount
})
    │
    ├─ registry.get(entityId)           ← entity data
    ├─ computeQuality(entity)           ← quality assessment
    ├─ getRelatedEntities(...)          ← top 3 related
    └─ params                           ← user context
    │
    ▼
AIContextPayload assembled
    │
    ├─→ formatSystemPrompt(payload, { tone })  → system prompt string
    ├─→ formatUserMessage(payload, userQuery)  → user turn string
    └─→ toJSONContext(payload)                 → API body JSON
    │
    ▼
POST /api/ve/[ai-route]    ← AI API call happens ONLY in API route
    │
    ▼
AI response → rendered as enhancement to deterministic estimate
```

---

## 7. SEO GENERATION FLOW

```
app/sitemap.ts
    │
    ▼
getSitemapEntities()
    │
    ├─ registry.all()
    ├─ computeQuality(entity) for each
    ├─ filter: indexEligible && seo.includeInSitemap
    └─ sort: seo.priority descending
    │
    ▼
toSitemapEntry(entity, BASE_URL)
    ├─ url: /value-engine/result/${entity.id}
    ├─ lastModified: from benchmark.lastUpdated
    ├─ changeFrequency: high→weekly, others→monthly
    └─ priority: high→0.9, medium→0.8, low→0.7
    │
    ▼
MetadataRoute.Sitemap entries merged into sitemap
```

---

## 8. SUBSYSTEM DEPENDENCY MAP

```
entityRegistry    ← no internal WVE deps (root subsystem)
    ↑
quality           ← imports entityRegistry
    ↑
monetization      ← imports entityRegistry
    ↑
escalationScorer  ← no subsystem deps (pure math)
    ↑
entityGraph       ← imports entityRegistry
    ↑
memory            ← no subsystem deps (SSR-safe storage)
    ↑
analytics         ← no subsystem deps (event types + emit)
    ↑
search            ← imports entityRegistry
    ↑
aiContext         ← imports entityRegistry, quality, entityGraph
    ↑
seo/gates         ← imports entityRegistry, quality
    ↑
components/       ← imports all of the above as needed
    ↑
app/result/page   ← imports registry + gates + components
```

Rules:
- Lower items MAY NOT import from higher items
- `entityRegistry` has no internal WVE dependencies — it is the root
- `components/` and `app/` are the only layers that may import broadly
