// ─── WVE Entity Graph — Phase 12 / Phase 13 / Phase 14 ────────────────────────
// Semantic relationship layer: maps service types and entities to related items.
// Phase 13: weighted strength scores, cross-vertical fallbacks, registry-driven
// dynamic relationships via getRegistryRelated().
// Phase 14: cross-class economic topology — relationships now span entity classes
// (services → utilities, products → investments, assets → services, etc.)
// Pure data — no runtime side-effects, SSR-safe.

import type { EstimationType, VerticalSlug, EconomicEntityClass, EconomicModel } from "./types";
import { registry } from "./entityRegistry";

export type RelationshipType =
  | "replaces"             // alternative that does the same job
  | "complements"          // often installed / purchased together
  | "triggers"             // doing X often surfaces need for Y
  | "correlates"           // market value moves together
  | "upgrade-path"         // natural upgrade progression
  // ── Cross-class economic topology (Phase 14) ────────────────────
  | "ownership-adjacency"  // service/product that is part of ownership burden
  | "investment-adjacency" // entity that affects investment value or return
  | "lifecycle-adjacency"  // entity encountered later in the ownership lifecycle
  | "operational-adjacency";// entity that represents ongoing operational cost

export interface RelatedEntity {
  name: string;
  serviceType: string;   // slug used as intent in URL + formula engine key
  vertical: VerticalSlug;
  type: EstimationType;
  category: string;
  relationship: RelationshipType;
  reason: string;       // shown as tooltip / description in RelatedEstimates
  href: string;         // fully formed Next.js path
  /** Semantic strength 0–1: how closely related these two entities are */
  strength: number;
  /** Optional registry entity id for registry-aware consumers */
  entityId?: string;
  /** Economic entity class of the RELATED entity (Phase 14) */
  economicClass?: EconomicEntityClass;
  /** Economic model of the RELATED entity (Phase 14) */
  economicModel?: EconomicModel;
}

// ── URL builder (mirrors intentRouter output) ──────────────────────────────
function serviceHref(serviceType: string, name: string, vertical: VerticalSlug = "home-services", category = "Home Services"): string {
  const params = new URLSearchParams({
    type: "service-estimate",
    serviceType,
    name,
    vertical,
    category,
  });
  return `/value-engine/result/${serviceType}?${params.toString()}`;
}

// ── Relationship graph by service type ────────────────────────────────────
const SERVICE_GRAPH: Record<string, RelatedEntity[]> = {

  // ── Roofing ────────────────────────────────────────────────────────────
  "asphalt-shingle-roof": [
    {
      name: "Metal Roof",
      serviceType: "metal-roof",
      vertical: "home-services",
      type: "service-estimate",
      category: "Roofing",
      relationship: "replaces",
      strength: 0.90,
      reason: "Longer-lasting alternative to asphalt shingles, 40–70 year lifespan",
      href: serviceHref("metal-roof", "Metal Roof", "home-services", "Roofing"),
      entityId: "metal-roof",
    },
    {
      name: "Solar Panel Installation (6 kW)",
      serviceType: "solar-6kw",
      vertical: "home-services",
      type: "service-estimate",
      category: "Solar",
      relationship: "complements",
      strength: 0.88,
      reason: "New roofs are the ideal time to add solar — avoids reinstalling panels later",
      href: serviceHref("solar-6kw", "Solar Panel Installation (6 kW)", "home-services", "Solar"),
      entityId: "solar-6kw",
    },
    {
      name: "Gutters & Downspouts",
      serviceType: "gutters",
      vertical: "home-services",
      type: "service-estimate",
      category: "Exterior",
      relationship: "triggers",
      strength: 0.80,
      reason: "Roof replacements commonly expose worn gutters requiring replacement",
      href: serviceHref("gutters", "Gutters & Downspouts", "home-services", "Exterior"),
    },
    {
      name: "Attic Insulation",
      serviceType: "attic-insulation",
      vertical: "home-services",
      type: "service-estimate",
      category: "Insulation",
      relationship: "complements",
      strength: 0.78,
      reason: "Improves roof performance and energy efficiency when done together",
      href: serviceHref("attic-insulation", "Attic Insulation", "home-services", "Insulation"),
      entityId: "attic-insulation",
    },
  ],

  "metal-roof": [
    {
      name: "Asphalt Shingle Roof",
      serviceType: "asphalt-shingle-roof",
      vertical: "home-services",
      type: "service-estimate",
      category: "Roofing",
      relationship: "replaces",
      strength: 0.90,
      reason: "Lower-cost alternative with 15–30 year lifespan",
      href: serviceHref("asphalt-shingle-roof", "Asphalt Shingle Roof", "home-services", "Roofing"),
      entityId: "asphalt-shingle-roof",
    },
    {
      name: "Solar Panel Installation (10 kW)",
      serviceType: "solar-10kw",
      vertical: "home-services",
      type: "service-estimate",
      category: "Solar",
      relationship: "complements",
      strength: 0.92,
      reason: "Metal roofs are the ideal mounting surface for larger solar arrays",
      href: serviceHref("solar-10kw", "Solar Panel Installation (10 kW)", "home-services", "Solar"),
      entityId: "solar-10kw",
    },
    {
      name: "Attic Insulation",
      serviceType: "attic-insulation",
      vertical: "home-services",
      type: "service-estimate",
      category: "Insulation",
      relationship: "complements",
      strength: 0.76,
      reason: "Metal roofs transfer heat — insulation upgrade maximises the investment",
      href: serviceHref("attic-insulation", "Attic Insulation", "home-services", "Insulation"),
      entityId: "attic-insulation",
    },
  ],

  // ── HVAC ───────────────────────────────────────────────────────────────
  "central-ac": [
    {
      name: "Heat Pump",
      serviceType: "heat-pump",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "replaces",
      strength: 0.92,
      reason: "Single-system alternative handling both heating and cooling",
      href: serviceHref("heat-pump", "Heat Pump", "home-services", "HVAC"),
      entityId: "heat-pump",
    },
    {
      name: "Furnace Replacement",
      serviceType: "furnace",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "complements",
      strength: 0.88,
      reason: "Paired HVAC replacement qualifies for larger rebates and uses shared ductwork",
      href: serviceHref("furnace", "Furnace Replacement", "home-services", "HVAC"),
      entityId: "furnace",
    },
    {
      name: "Solar Panel Installation (6 kW)",
      serviceType: "solar-6kw",
      vertical: "home-services",
      type: "service-estimate",
      category: "Solar",
      relationship: "correlates",
      strength: 0.82,
      reason: "High-efficiency AC + solar offsets operating cost — popular pairing",
      href: serviceHref("solar-6kw", "Solar Panel Installation (6 kW)", "home-services", "Solar"),
      entityId: "solar-6kw",
    },
    {
      name: "Attic Insulation",
      serviceType: "attic-insulation",
      vertical: "home-services",
      type: "service-estimate",
      category: "Insulation",
      relationship: "triggers",
      strength: 0.84,
      reason: "Poor insulation forces HVAC to overwork — often diagnosed during HVAC jobs",
      href: serviceHref("attic-insulation", "Attic Insulation", "home-services", "Insulation"),
      entityId: "attic-insulation",
    },
  ],

  "furnace": [
    {
      name: "Heat Pump",
      serviceType: "heat-pump",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "replaces",
      strength: 0.91,
      reason: "Modern heat pumps handle both heating and cooling — often more efficient",
      href: serviceHref("heat-pump", "Heat Pump", "home-services", "HVAC"),
      entityId: "heat-pump",
    },
    {
      name: "Central AC Replacement",
      serviceType: "central-ac",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "complements",
      strength: 0.88,
      reason: "Replacing both together saves on installation labour and maximises rebates",
      href: serviceHref("central-ac", "Central AC Replacement", "home-services", "HVAC"),
      entityId: "central-ac",
    },
    {
      name: "Attic Insulation",
      serviceType: "attic-insulation",
      vertical: "home-services",
      type: "service-estimate",
      category: "Insulation",
      relationship: "triggers",
      strength: 0.83,
      reason: "Insulation gaps dramatically reduce furnace efficiency",
      href: serviceHref("attic-insulation", "Attic Insulation", "home-services", "Insulation"),
      entityId: "attic-insulation",
    },
  ],

  "heat-pump": [
    {
      name: "Central AC Replacement",
      serviceType: "central-ac",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "replaces",
      strength: 0.92,
      reason: "Heat pump provides cooling AND heating — comparison is essential",
      href: serviceHref("central-ac", "Central AC Replacement", "home-services", "HVAC"),
      entityId: "central-ac",
    },
    {
      name: "Furnace Replacement",
      serviceType: "furnace",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "replaces",
      strength: 0.89,
      reason: "Dual-fuel heat pump + furnace is a popular cold-climate combination",
      href: serviceHref("furnace", "Furnace Replacement", "home-services", "HVAC"),
      entityId: "furnace",
    },
    {
      name: "Solar Panel Installation (6 kW)",
      serviceType: "solar-6kw",
      vertical: "home-services",
      type: "service-estimate",
      category: "Solar",
      relationship: "complements",
      strength: 0.94,
      reason: "All-electric heat pump is maximally efficient when powered by solar",
      href: serviceHref("solar-6kw", "Solar Panel Installation (6 kW)", "home-services", "Solar"),
      entityId: "solar-6kw",
    },
  ],

  // ── Solar ──────────────────────────────────────────────────────────────
  "solar-6kw": [
    {
      name: "Solar Panel Installation (10 kW)",
      serviceType: "solar-10kw",
      vertical: "home-services",
      type: "service-estimate",
      category: "Solar",
      relationship: "upgrade-path",
      strength: 0.88,
      reason: "Higher wattage system for larger homes or EV charging needs",
      href: serviceHref("solar-10kw", "Solar Panel Installation (10 kW)", "home-services", "Solar"),
      entityId: "solar-10kw",
    },
    {
      name: "Heat Pump",
      serviceType: "heat-pump",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "complements",
      strength: 0.94,
      reason: "Solar + heat pump is the most popular whole-home energy efficiency package",
      href: serviceHref("heat-pump", "Heat Pump", "home-services", "HVAC"),
      entityId: "heat-pump",
    },
    {
      name: "Asphalt Shingle Roof",
      serviceType: "asphalt-shingle-roof",
      vertical: "home-services",
      type: "service-estimate",
      category: "Roofing",
      relationship: "triggers",
      strength: 0.80,
      reason: "Installers typically inspect the roof — aging shingles should be replaced first",
      href: serviceHref("asphalt-shingle-roof", "Asphalt Shingle Roof", "home-services", "Roofing"),
      entityId: "asphalt-shingle-roof",
    },
  ],

  "solar-10kw": [
    {
      name: "Solar Panel Installation (6 kW)",
      serviceType: "solar-6kw",
      vertical: "home-services",
      type: "service-estimate",
      category: "Solar",
      relationship: "replaces",
      strength: 0.88,
      reason: "Lower-cost entry point for average homes or renters with partial coverage",
      href: serviceHref("solar-6kw", "Solar Panel Installation (6 kW)", "home-services", "Solar"),
      entityId: "solar-6kw",
    },
    {
      name: "Heat Pump",
      serviceType: "heat-pump",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "complements",
      strength: 0.93,
      reason: "10 kW arrays are commonly sized to offset heat pump electrical consumption",
      href: serviceHref("heat-pump", "Heat Pump", "home-services", "HVAC"),
      entityId: "heat-pump",
    },
    {
      name: "Metal Roof",
      serviceType: "metal-roof",
      vertical: "home-services",
      type: "service-estimate",
      category: "Roofing",
      relationship: "complements",
      strength: 0.85,
      reason: "Metal roofs last 50+ years — ideal base for a long-lived solar investment",
      href: serviceHref("metal-roof", "Metal Roof", "home-services", "Roofing"),
      entityId: "metal-roof",
    },
  ],

  // ── Kitchen ────────────────────────────────────────────────────────────
  "kitchen-remodel-minor": [
    {
      name: "Full Kitchen Remodel",
      serviceType: "kitchen-remodel",
      vertical: "home-services",
      type: "service-estimate",
      category: "Kitchen",
      relationship: "upgrade-path",
      strength: 0.91,
      reason: "Full remodel includes layout changes, new plumbing, and structural work",
      href: serviceHref("kitchen-remodel", "Full Kitchen Remodel", "home-services", "Kitchen"),
      entityId: "kitchen-remodel",
    },
    {
      name: "Bathroom Remodel",
      serviceType: "bathroom-remodel",
      vertical: "home-services",
      type: "service-estimate",
      category: "Bathroom",
      relationship: "correlates",
      strength: 0.76,
      reason: "Kitchen and bathroom remodels are typically the highest-ROI home improvements",
      href: serviceHref("bathroom-remodel", "Bathroom Remodel", "home-services", "Bathroom"),
    },
    {
      name: "Central AC Replacement",
      serviceType: "central-ac",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "correlates",
      strength: 0.68,
      reason: "Major renovations are a common time to upgrade aging home systems",
      href: serviceHref("central-ac", "Central AC Replacement", "home-services", "HVAC"),
      entityId: "central-ac",
    },
  ],

  "kitchen-remodel": [
    {
      name: "Minor Kitchen Remodel",
      serviceType: "kitchen-remodel-minor",
      vertical: "home-services",
      type: "service-estimate",
      category: "Kitchen",
      relationship: "replaces",
      strength: 0.91,
      reason: "Budget-conscious option: new faces, hardware, and appliances without moving walls",
      href: serviceHref("kitchen-remodel-minor", "Minor Kitchen Remodel", "home-services", "Kitchen"),
      entityId: "kitchen-remodel-minor",
    },
    {
      name: "Bathroom Remodel",
      serviceType: "bathroom-remodel",
      vertical: "home-services",
      type: "service-estimate",
      category: "Bathroom",
      relationship: "correlates",
      strength: 0.79,
      reason: "Highest-ROI home improvements often bundled during major renovations",
      href: serviceHref("bathroom-remodel", "Bathroom Remodel", "home-services", "Bathroom"),
    },
    {
      name: "Asphalt Shingle Roof",
      serviceType: "asphalt-shingle-roof",
      vertical: "home-services",
      type: "service-estimate",
      category: "Roofing",
      relationship: "correlates",
      strength: 0.65,
      reason: "Whole-home renovation budgets typically address exterior and interior together",
      href: serviceHref("asphalt-shingle-roof", "Asphalt Shingle Roof", "home-services", "Roofing"),
      entityId: "asphalt-shingle-roof",
    },
  ],

  // ── Insulation ─────────────────────────────────────────────────────────
  "attic-insulation": [
    {
      name: "Central AC Replacement",
      serviceType: "central-ac",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "complements",
      strength: 0.86,
      reason: "Improved insulation directly reduces HVAC size requirements and operating cost",
      href: serviceHref("central-ac", "Central AC Replacement", "home-services", "HVAC"),
      entityId: "central-ac",
    },
    {
      name: "Furnace Replacement",
      serviceType: "furnace",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "complements",
      strength: 0.84,
      reason: "Insulation and furnace efficiency are tightly coupled — upgrading both maximises savings",
      href: serviceHref("furnace", "Furnace Replacement", "home-services", "HVAC"),
      entityId: "furnace",
    },
    {
      name: "Asphalt Shingle Roof",
      serviceType: "asphalt-shingle-roof",
      vertical: "home-services",
      type: "service-estimate",
      category: "Roofing",
      relationship: "triggers",
      strength: 0.78,
      reason: "Roof replacements commonly expose inadequate attic ventilation and insulation",
      href: serviceHref("asphalt-shingle-roof", "Asphalt Shingle Roof", "home-services", "Roofing"),
      entityId: "asphalt-shingle-roof",
    },
  ],
};

// ── Fallback related by vertical (when no specific graph entry exists) ─────
const VERTICAL_FALLBACK: Record<VerticalSlug, RelatedEntity[]> = {
  "home-services": [
    {
      name: "Central AC Replacement",
      serviceType: "central-ac",
      vertical: "home-services",
      type: "service-estimate",
      category: "HVAC",
      relationship: "correlates",
      strength: 0.60,
      reason: "Popular home service estimate",
      href: serviceHref("central-ac", "Central AC Replacement", "home-services", "HVAC"),
      entityId: "central-ac",
    },
    {
      name: "Asphalt Shingle Roof",
      serviceType: "asphalt-shingle-roof",
      vertical: "home-services",
      type: "service-estimate",
      category: "Roofing",
      relationship: "correlates",
      strength: 0.60,
      reason: "Popular home service estimate",
      href: serviceHref("asphalt-shingle-roof", "Asphalt Shingle Roof", "home-services", "Roofing"),
      entityId: "asphalt-shingle-roof",
    },
    {
      name: "Kitchen Remodel (Minor)",
      serviceType: "kitchen-remodel-minor",
      vertical: "home-services",
      type: "service-estimate",
      category: "Kitchen",
      relationship: "correlates",
      strength: 0.58,
      reason: "Popular home service estimate",
      href: serviceHref("kitchen-remodel-minor", "Kitchen Remodel (Minor)", "home-services", "Kitchen"),
      entityId: "kitchen-remodel-minor",
    },
  ],
  "electronics": [
    {
      name: "Apple iPhone 16 Pro",
      serviceType: "iphone-16-pro",
      vertical: "electronics",
      type: "market-value",
      category: "Smartphones",
      relationship: "correlates",
      strength: 0.72,
      reason: "High-demand resale item — compare value across iPhone generations",
      href: `/value-engine/result/iphone-16-pro?type=market-value&name=Apple+iPhone+16+Pro&vertical=electronics&category=Smartphones`,
      entityId: "iphone-16-pro",
    },
    {
      name: "Apple iPhone 15",
      serviceType: "iphone-15",
      vertical: "electronics",
      type: "market-value",
      category: "Smartphones",
      relationship: "replaces",
      strength: 0.82,
      reason: "Previous generation — useful for trade-in value comparison",
      href: `/value-engine/result/iphone-15?type=market-value&name=Apple+iPhone+15&vertical=electronics&category=Smartphones`,
      entityId: "iphone-15",
    },
    {
      name: "Sony PlayStation 5",
      serviceType: "ps5-disc",
      vertical: "electronics",
      type: "market-value",
      category: "Gaming Consoles",
      relationship: "correlates",
      strength: 0.58,
      reason: "Popular consumer electronics resale comparison",
      href: `/value-engine/result/ps5-disc?type=market-value&name=Sony+PlayStation+5&vertical=electronics&category=Gaming+Consoles`,
      entityId: "ps5-disc",
    },
  ],
  "luxury": [
    {
      name: "Rolex Submariner Date",
      serviceType: "rolex-submariner-date",
      vertical: "luxury",
      type: "market-value",
      category: "Watches",
      relationship: "correlates",
      strength: 0.75,
      reason: "Benchmark luxury watch — most searched Rolex reference",
      href: `/value-engine/result/rolex-submariner-date?type=market-value&name=Rolex+Submariner+Date&vertical=luxury&category=Watches`,
      entityId: "rolex-submariner-date",
    },
    {
      name: "Rolex GMT-Master II",
      serviceType: "rolex-gmt-master-ii",
      vertical: "luxury",
      type: "market-value",
      category: "Watches",
      relationship: "correlates",
      strength: 0.78,
      reason: "Popular Rolex sport model — often compared to Submariner",
      href: `/value-engine/result/rolex-gmt-master-ii?type=market-value&name=Rolex+GMT-Master+II&vertical=luxury&category=Watches`,
      entityId: "rolex-gmt-master-ii",
    },
    {
      name: "Rolex Datejust 41",
      serviceType: "rolex-datejust-41",
      vertical: "luxury",
      type: "market-value",
      category: "Watches",
      relationship: "correlates",
      strength: 0.70,
      reason: "Entry-point Rolex — useful resale value comparison",
      href: `/value-engine/result/rolex-datejust-41?type=market-value&name=Rolex+Datejust+41&vertical=luxury&category=Watches`,
      entityId: "rolex-datejust-41",
    },
  ],
  "sneakers": [
    {
      name: "Air Jordan 1 Retro High OG Chicago",
      serviceType: "jordan-1-retro-high-chicago",
      vertical: "sneakers",
      type: "market-value",
      category: "Air Jordan",
      relationship: "correlates",
      strength: 0.80,
      reason: "OG colourway benchmark — most referenced Jordan 1 resale",
      href: `/value-engine/result/jordan-1-retro-high-chicago?type=market-value&name=Air+Jordan+1+Chicago&vertical=sneakers&category=Air+Jordan`,
      entityId: "jordan-1-retro-high-chicago",
    },
    {
      name: "Air Jordan 1 Retro High OG Bred",
      serviceType: "jordan-1-retro-high-bred",
      vertical: "sneakers",
      type: "market-value",
      category: "Air Jordan",
      relationship: "correlates",
      strength: 0.76,
      reason: "Classic black/red colourway — frequently compared to Chicago",
      href: `/value-engine/result/jordan-1-retro-high-bred?type=market-value&name=Air+Jordan+1+Bred&vertical=sneakers&category=Air+Jordan`,
      entityId: "jordan-1-retro-high-bred",
    },
    {
      name: "New Balance 550 White Green",
      serviceType: "new-balance-550-white-green",
      vertical: "sneakers",
      type: "market-value",
      category: "New Balance",
      relationship: "correlates",
      strength: 0.62,
      reason: "Popular lifestyle resale sneaker — good value comparison benchmark",
      href: `/value-engine/result/new-balance-550-white-green?type=market-value&name=New+Balance+550&vertical=sneakers&category=New+Balance`,
      entityId: "new-balance-550-white-green",
    },
  ],
};

// ── Cross-class economic topology (Phase 14) ─────────────────────────────
// Maps entity ids to related entities ACROSS economic classes.
// These chains represent real economic adjacency:
//   services → utilities (solar reduces electricity cost)
//   services → assets    (roof/kitchen remodel increases home value)
//   products → ownership (iPhone has ongoing carrier/repair costs)
//   luxury   → investments (Rolex tracks gold/luxury market indices)
//
// Use getCrossClassRelated() to access these chains in UI and AI context.

const CROSS_CLASS_GRAPH: Record<string, RelatedEntity[]> = {

  // Roof replacement → home value (services → assets)
  "asphalt-shingle-roof": [
    {
      name: "Home Value Impact",
      serviceType: "home-value",
      vertical: "home-services",
      type: "appreciation",
      category: "Real Estate",
      relationship: "investment-adjacency",
      strength: 0.78,
      reason: "A new roof increases home resale value and prevents structural depreciation",
      href: "/value-engine/result/asphalt-shingle-roof?type=service-estimate&name=Asphalt+Shingle+Roof&vertical=home-services&category=Roofing",
      economicClass: "assets",
      economicModel: "appreciation",
    },
  ],

  // Solar → ongoing electricity savings (services → utilities)
  "solar-6kw": [
    {
      name: "Monthly Electricity Cost",
      serviceType: "electricity-monthly",
      vertical: "home-services",
      type: "service-estimate",
      category: "Utilities",
      relationship: "operational-adjacency",
      strength: 0.92,
      reason: "Solar directly offsets monthly electricity costs — the primary financial return driver",
      href: "/value-engine/result/solar-6kw?type=service-estimate&name=Solar+6kW&vertical=home-services&category=Solar",
      economicClass: "utilities",
      economicModel: "recurring-burden",
    },
  ],

  "solar-10kw": [
    {
      name: "Monthly Electricity Cost",
      serviceType: "electricity-monthly",
      vertical: "home-services",
      type: "service-estimate",
      category: "Utilities",
      relationship: "operational-adjacency",
      strength: 0.94,
      reason: "10 kW solar fully offsets typical household electricity consumption",
      href: "/value-engine/result/solar-10kw?type=service-estimate&name=Solar+10kW&vertical=home-services&category=Solar",
      economicClass: "utilities",
      economicModel: "recurring-burden",
    },
  ],

  // Kitchen remodel → home value (services → assets)
  "kitchen-remodel": [
    {
      name: "Home Value Impact",
      serviceType: "home-value",
      vertical: "home-services",
      type: "appreciation",
      category: "Real Estate",
      relationship: "investment-adjacency",
      strength: 0.82,
      reason: "Major kitchen remodels return 60–80% of cost in home resale value",
      href: "/value-engine/result/kitchen-remodel?type=service-estimate&name=Kitchen+Remodel&vertical=home-services&category=Kitchen",
      economicClass: "assets",
      economicModel: "appreciation",
    },
  ],

  // Rolex → gold market (luxury/investments → investments)
  "rolex-submariner-date": [
    {
      name: "Rolex GMT-Master II",
      serviceType: "rolex-gmt-master-ii",
      vertical: "luxury",
      type: "market-value",
      category: "Watches",
      relationship: "investment-adjacency",
      strength: 0.80,
      reason: "GMT-Master II tracks the same luxury steel market — values move together",
      href: `/value-engine/result/rolex-gmt-master-ii?type=market-value&name=Rolex+GMT-Master+II&vertical=luxury&category=Watches`,
      entityId: "rolex-gmt-master-ii",
      economicClass: "investments",
      economicModel: "appreciation",
    },
  ],

  // iPhone → ownership burden (products → ownership-economics)
  "iphone-16-pro": [
    {
      name: "Apple iPhone 15",
      serviceType: "iphone-15",
      vertical: "electronics",
      type: "market-value",
      category: "Smartphones",
      relationship: "lifecycle-adjacency",
      strength: 0.82,
      reason: "Previous generation — trade-in value comparison is the primary ownership decision point",
      href: `/value-engine/result/iphone-15?type=market-value&name=Apple+iPhone+15&vertical=electronics&category=Smartphones`,
      entityId: "iphone-15",
      economicClass: "products",
      economicModel: "depreciation",
    },
  ],
};

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Returns related entities sorted by strength (descending).
 * Specific graph entries are used first; falls back to vertical defaults.
 */
export function getRelatedEntities(
  serviceType: string,
  vertical: VerticalSlug,
  limit = 3,
): RelatedEntity[] {
  const specific = SERVICE_GRAPH[serviceType];
  const pool = (specific && specific.length > 0)
    ? specific
    : (VERTICAL_FALLBACK[vertical] ?? []);
  return [...pool].sort((a, b) => b.strength - a.strength).slice(0, limit);
}

/** Returns true if there are related entities for a given serviceType */
export function hasRelatedEntities(serviceType: string, vertical: VerticalSlug): boolean {
  const specific = SERVICE_GRAPH[serviceType];
  return (specific?.length ?? 0) > 0 || (VERTICAL_FALLBACK[vertical]?.length ?? 0) > 0;
}

/**
 * Returns cross-class economic adjacency relationships for an entity.
 * These span entity classes (services → utilities, luxury → investments, etc.)
 * and represent the broader economic topology around an entity.
 * Used in AI context building and advanced SEO internal linking.
 */
export function getCrossClassRelated(
  entityId: string,
  limit = 3,
): RelatedEntity[] {
  const entries = CROSS_CLASS_GRAPH[entityId] ?? [];
  return [...entries].sort((a, b) => b.strength - a.strength).slice(0, limit);
}

/**
 * Registry-driven dynamic relationships.
 * Returns other registry entities in the same vertical, excluding the source,
 * sorted by commercial weight then monetization averageOrderValue.
 * Used when a new entity is added to the registry without a manual graph entry.
 */
export function getRegistryRelated(
  excludeId: string,
  vertical: VerticalSlug,
  limit = 3,
): RelatedEntity[] {
  const WEIGHT_RANK: Record<string, number> = { high: 3, medium: 2, low: 1 };

  return registry
    .byVertical(vertical)
    .filter((e) => e.id !== excludeId && e.quality.routeEligible)
    .sort((a, b) => {
      const wDiff = WEIGHT_RANK[b.monetization.commercialWeight] - WEIGHT_RANK[a.monetization.commercialWeight];
      return wDiff !== 0 ? wDiff : b.monetization.averageOrderValue - a.monetization.averageOrderValue;
    })
    .slice(0, limit)
    .map((e) => ({
      name:         e.canonicalName,
      serviceType:  e.serviceType ?? e.id,
      vertical:     e.vertical,
      type:         e.estimationType,
      category:     e.category,
      relationship: "correlates" as RelationshipType,
      strength:     0.60,
      reason:       `Related ${e.category.toLowerCase()} estimate`,
      href:         registry.buildHref(e),
      entityId:     e.id,
    }));
}
