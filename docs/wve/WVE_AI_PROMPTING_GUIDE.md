# WVE AI PROMPTING GUIDE
## How to Work Inside the Worthulator Value Engine Safely
### Version 2.0 | Phase 14 | May 2026

> This guide is for AI coding assistants working on WVE features.
> Read this before writing any WVE code. It will prevent architecture drift.

---

## MANDATORY FIRST STEP

**Before writing any WVE code, read:**
1. `docs/wve/WVE_SYSTEM_BIBLE.md` — platform definition, architecture, doctrine
2. `docs/wve/WVE_RULES.md` — non-negotiable engineering laws
3. `docs/wve/WVE_ARCHITECTURE_MAP.md` — system structure and data flows

**All future WVE prompts should begin with:**
> "Follow WVE documentation and architectural doctrine exactly."

---

## ORIENTATION CHECKLIST

Before writing any code, confirm:

- [ ] Is the entity in the registry? (`lib/value-engine/entityRegistry/entries/`)
- [ ] Does the file I'm creating belong in `lib/value-engine/`, `components/value-engine/`, `app/value-engine/`, `hooks/value-engine/`, or `app/api/ve/`?
- [ ] Will this file be imported server-side? → Ensure no browser APIs at module level
- [ ] Does this touch the quality gate? → Must use `gates.ts`, never bypass it
- [ ] Does this generate a new route? → Must have a registry entry
- [ ] Does this add monetization logic? → Must go through `computeMonetization()`
- [ ] Does this add an analytics event? → Must extend `WVEEvent` union type first
- [ ] Does this call an AI API? → Must use `buildAIContext()` first, must be in an API route
- [ ] Does this touch regional data? → Must use `lib/value-engine/regional/` functions, never hardcode multipliers
- [ ] Does this add a new entity? → Does it have an `entityClass`, `economicModel`, and `lifecycleType` assigned?
- [ ] Does this import from `recon/`? → STOP. This is never permitted.
- [ ] Does this import WVE into legacy calculator files? → STOP. This is never permitted.

---

## PHASE 14 — CONTEXTUAL ECONOMIC INTELLIGENCE

### WVE is NOT an estimator

WVE is a **Contextual Economic Intelligence Platform**. This distinction changes how you write prompts and code:

| Old thinking (WRONG) | New thinking (RIGHT) |
|---|---|
| "Add a cost calculator" | "Register the entity with the correct economic model" |
| "Show the estimate" | "Frame the estimate through the entity's economic lens" |
| "Apply regional prices" | "Resolve regional intelligence from `getRegionalProfile()`" |
| "Format AI prompt" | "Inject `entityClass` + `economicModel` into system prompt" |
| "Add related items" | "Resolve cross-class relationships from `getCrossClassRelated()`" |

### Entity Class Assignment — Always Required

When adding or modifying an entity, you MUST assign the economic class:

```ts
// In a registry entry:
{
  entityClass: "services",           // REQUIRED for Phase 14
  economicModel: "project-economics", // REQUIRED for Phase 14
  lifecycleType: "project-based",    // REQUIRED for Phase 14
  volatilityProfile: {               // Optional but recommended
    regionalVariance: 7,
    temporalVariance: 4,
    marketSensitivity: 3,
    volatilityLabel: "moderate",
  },
}
```

**Class → Model quick reference:**
- `services` → `project-economics`
- `products` → `resale-value` or `depreciation`
- `assets` → `appreciation`
- `utilities` → `recurring-burden`
- `ownership-economics` → `ownership-burden`
- `investments` → `future-value` or `resale-value`
- `life-events` → `timeline-economics`
- `business-economics` → `operational-economics`

### Regional Intelligence — Safe Patterns

```ts
// ✅ CORRECT — use the regional API
import { getRegionalProfile, applyRegionalModifier, getRegionalTrustSignals } from "@/lib/value-engine/regional";

const profile = getRegionalProfile("CA");           // never undefined
const [low, mid, high] = applyRegionalModifier(7000, 10500, 14500, "CA");
const signals = getRegionalTrustSignals("FL", "services");

// ❌ WRONG — hardcoded regional multipliers
const caMultiplier = 1.6;  // NEVER do this
const adjustedCost = baseCost * caMultiplier;       // NEVER do this
```

### AI Context — Phase 14 Usage

```ts
// ✅ CORRECT — Phase 14 buildAIContext populates entity class + regional automatically
import { buildAIContext } from "@/lib/value-engine/aiContext";

const ctx = buildAIContext({
  entityId: "asphalt-shingle-roof",
  estimateAmount: 12000,
  region: "FL",  // triggers regional economics population
});

// ctx.entityClass    → "services"
// ctx.economicModel  → "project-economics"
// ctx.regionalEconomics → { label: "Florida", insurancePressure: 10, ... }

// formatSystemPrompt now automatically injects CLASS_FRAME + MODEL_INSTRUCTION
const systemPrompt = formatSystemPrompt(ctx, { tone: "advisory" });
```

---

## HOW TO ADD A NEW ENTITY

### Step 1 — Add to registry entries
Choose the appropriate entry file in `lib/value-engine/entityRegistry/entries/`:
- `homeServices.ts` — HVAC, roofing, solar, kitchen, insulation, etc.
- `electronics.ts` — phones, laptops, tablets, consoles
- `luxury.ts` — watches, bags, jewelry
- `sneakers.ts` — limited releases, classic silhouettes
- Create a new file for a new category

### Step 2 — Provide complete RegistryEntity
Every field is required. Do not omit:
```ts
{
  id: "kebab-case-unique-id",
  canonicalName: "Display Ready Name",
  aliases: ["common name", "abbreviation", "alternate spelling"],
  vertical: "home-services" | "electronics" | "luxury" | "sneakers",
  category: "category-string",
  subcategory: "optional",
  estimationType: "service-estimate" | "market-value" | "appreciation",
  serviceType: "optional, for service-estimate entities",
  benchmark: {
    lowUSD: 0,
    highUSD: 0,
    confidenceLevel: "high" | "moderate" | "preliminary",
    benchmarkSource: "Cited data source",
    lastUpdated: "YYYY-MM",
  },
  regional: { nationwide: true },
  monetization: {
    leadSuitability: 0,      // 0-10
    affiliateSuitability: 0, // 0-10
    financingPropensity: 0,  // 0-10
    averageOrderValue: 0,    // USD
    commercialWeight: "high" | "medium" | "low",
  },
  seo: {
    priority: "high" | "medium" | "low",
    searchVolumeTier: "high" | "medium" | "low",
    primaryKeyword: "primary target keyword",
    relatedKeywords: ["kw1", "kw2", "kw3"],
    includeInSitemap: true,
    minQualityGate: 60,      // minimum computed score for route eligibility
  },
  quality: {
    dataQuality: "verified" | "estimated",
    estimateConfidence: 85,  // 0-100
    projectionReliability: "high" | "medium" | "low",
    routeEligible: true,
  },
}
```

### Step 3 — Add to entity graph (optional but recommended)
In `lib/value-engine/entityGraph.ts`, add entries to `SERVICE_GRAPH` or `VERTICAL_FALLBACK`:
```ts
"your-entity-id": [
  { label: "Related Entity Name", href: "/value-engine/result/related-id?...", strength: 0.80, entityId: "related-id" },
]
```

### Step 4 — Add query expansion terms (optional)
In `lib/value-engine/search/queryExpander.ts`, add common abbreviations:
```ts
"short form": ["canonical search term", "alternate term"],
```

### Step 5 — Verify quality gate
The entity will auto-qualify if the data is complete and fresh. Check with:
```ts
import { computeQuality } from "@/lib/value-engine/quality/scorer";
import { registry } from "@/lib/value-engine/entityRegistry";
const entity = registry.get("your-entity-id");
const quality = computeQuality(entity!);
console.log(quality.score, quality.tier, quality.routeEligible, quality.indexEligible);
```

---

## HOW TO ADD A NEW WVE PAGE/FEATURE

### Adding a new SEO component
1. Create in `components/value-engine/seo/`
2. Must be a **server component** — no `"use client"` unless the component contains interactivity
3. Import from `lib/value-engine/` only — never from `components/` internals
4. Accept entity/benchmark props — never fetch data from inside the component

### Adding a new client-side hook
1. Create in `hooks/value-engine/`
2. Add `"use client"` directive at top
3. Wrap all localStorage/sessionStorage access in `typeof window !== 'undefined'` or `useEffect`
4. Do not import from `recon/` or legacy calculator files

### Adding a new analytics event
1. Add the typed interface to `lib/value-engine/analytics/types.ts`
2. Add it to the `WVEEvent` union
3. Use `track({ name: "your_event", ...fields })` from `useAnalytics()`
4. Never push to `window.dataLayer` directly from component code

### Adding a new API route
1. Create in `app/api/ve/`
2. Must be SSR-safe — Next.js route handlers run on the server
3. If calling AI: `buildAIContext()` first, then `formatSystemPrompt()`, then API call
4. Recon proxy pattern: try recon → catch → registry fallback

---

## SAFE PATTERNS

### Reading an entity
```ts
import { registry } from "@/lib/value-engine/entityRegistry";
const entity = registry.get(entityId);
if (!entity) return null; // always handle missing entity
```

### Running quality gate
```ts
import { evaluateGate } from "@/lib/value-engine/seo/gates";
const gate = evaluateGate(entityId);
const shouldIndex = gate?.indexEligible ?? false;
```

### Computing monetization
```ts
import { computeMonetization } from "@/lib/value-engine/monetization";
const assessment = computeMonetization({
  estimateAmount,
  estimationType,
  engagementScore,
  entityId,
  financingDetected: false,
});
// Use assessment.actions to render CTAs
```

### Tracking an event
```ts
const { track } = useAnalytics();
track({
  name: "estimate_viewed",
  entityId: entity.id,
  entityName: entity.canonicalName,
  estimationType: entity.estimationType,
  vertical: entity.vertical,
  estimateAmount: 8500,
  isRepeatVisit: false,
});
```

### Building AI context
```ts
import { buildAIContext, formatSystemPrompt } from "@/lib/value-engine/aiContext";
const ctx = buildAIContext({ entityId, estimateAmount, region });
if (!ctx) return; // entity not found
const systemPrompt = formatSystemPrompt(ctx, { tone: "advisory" });
// Pass systemPrompt + formatUserMessage(ctx) to AI API route
```

### Recording an estimate view
```ts
const { isRepeat, viewCount } = useEstimateMemory({
  autoRecord: {
    id: entity.id,
    entityName: entity.canonicalName,
    type: entity.estimationType,
    vertical: entity.vertical,
    estimateAmount,
    href: `/value-engine/result/${entity.id}`,
  },
});
// isRepeat and viewCount feed into escalation context
```

---

## DANGEROUS PATTERNS — NEVER DO THESE

### ❌ Bypassing the registry
```ts
// WRONG — hardcoded entity data
const entity = { name: "Central AC", lowPrice: 5000, highPrice: 12000 };
```

### ❌ Manual robots.index
```ts
// WRONG — hardcoded index decision
robots: { index: true, follow: true }
```

### ❌ Hardcoded sitemap entries
```ts
// WRONG — manually adding a WVE URL to sitemap
{ url: "https://worthulator.com/value-engine/result/central-ac" }
```

### ❌ Browser API at module level
```ts
// WRONG — window access at module scope
const history = JSON.parse(localStorage.getItem("wve_history") ?? "[]");
```

### ❌ Importing recon from app
```ts
// WRONG — absolute violation
import { something } from "@/recon/src/entities";
```

### ❌ AI as primary estimator
```ts
// WRONG — AI generating a price estimate
const price = await openai.chat.completions.create({
  messages: [{ role: "user", content: "What does a new roof cost?" }]
});
```

### ❌ New WVE entity without registry entry
```ts
// WRONG — dynamic page without a registry entity
export async function generateStaticParams() {
  return [{ intent: "some-new-thing" }]; // not in registry
}
```

---

## EXAMPLE PROMPTS FOR FUTURE DEVELOPMENT

### Adding a new entity
```
Follow WVE documentation and architectural doctrine exactly.

Add a new entity "Samsung Galaxy S25 Ultra" to the WVE entity registry.
- Vertical: electronics
- Estimation type: market-value
- Benchmark: $900–$1,400 (high confidence, sourced from Samsung retail/resale data, updated 2026-04)
- Monetization: affiliate-primary, lead suitability 4, affiliate suitability 9
- Add to query expander: "samsung", "s25", "galaxy s25"
- Add to entity graph: related to iphone-16-pro (strength 0.75), macbook-pro-14 (strength 0.40)
- Verify quality gate passes before committing
```

### Adding a new AI feature
```
Follow WVE documentation and architectural doctrine exactly.

Create the AI insight panel for the WVE result page.
Requirements:
- Only shown when escalation score ≥ 7.0
- Uses buildAIContext() + formatSystemPrompt() from lib/value-engine/aiContext/
- API call happens ONLY in app/api/ve/ai/route.ts
- Component: components/value-engine/AIInsightPanel.tsx ("use client")
- Uses useAnalytics() to fire "estimate_engagement" when panel opens
- Streams response if possible
- Does NOT modify or replace the deterministic benchmark estimate
- Is SSR-safe (placeholder state renders server-side)
```

### Adding a new vertical
```
Follow WVE documentation and architectural doctrine exactly.

Add a new "vehicles" vertical to WVE.
Requirements:
- New VerticalSlug: "vehicles"
- New entry file: lib/value-engine/entityRegistry/entries/vehicles.ts
- Estimation type: market-value (resale) or appreciation (depreciation curve)
- Start with 5 entities: [list entities with full benchmark profiles]
- Update VERTICAL_META in intentRouter.ts with emoji + label + color
- Update VERTICAL_FALLBACK in entityGraph.ts
- Add vehicle-specific query expansions
- All quality profiles must pass indexEligible before committing
```

### Fixing a quality gate issue
```
Follow WVE documentation and architectural doctrine exactly.

Entity "attic-insulation" is failing the quality gate (score < 65, tier: draft).
Investigate which quality dimensions are failing using computeQuality().
Fix the registry entry to improve the failing dimensions.
Do NOT lower the minQualityGate value to work around the issue.
Verify the entity reaches standard or premium tier before pushing.
```

---

## ARCHITECTURE DRIFT PREVENTION

WVE architecture drift occurs when:
1. New features are built without reading the architecture docs
2. Quality gates are bypassed to "ship faster"
3. AI generates entities or pages without registry validation
4. New subsystems are built that duplicate existing ones
5. SSR rules are broken to add a quick feature
6. Legacy calculator patterns are applied to WVE code

### Defense: Before every WVE task, ask:

1. **Does an existing subsystem already do this?** Check architecture map before building.
2. **Would this create a dependency loop?** Check subsystem dependency map.
3. **Will this break on the server?** All lib modules must be SSR-safe.
4. **Is there a registry entity backing this?** No entity = no page.
5. **Will this pass the quality gate?** If not, fix the data, not the gate.
6. **Is this AI replacing deterministic estimation?** Never permitted.

When in doubt: read `WVE_SYSTEM_BIBLE.md` first.
