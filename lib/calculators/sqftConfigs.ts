export interface SqFtConfig {
  title: string;
  metaTitle: string;
  metaDescription: string;
  introText: string;
  heroSubtitle: string;
  contentHeading: string;
  contentBody: string;
  defaultCostLow: number;
  defaultCostHigh: number;
  unitLabel: string;
  category: string;
  keywords: string[];
  relatedSlugs: string[];
  exampleArea: number;
  exampleAreaLabel: string;
  internalLinks: { label: string; href: string }[];
}

export const sqftConfigs: Record<string, SqFtConfig> = {
  "roof-cost-per-sq-ft": {
    title: "Roof Cost Per Sq Ft Calculator",
    metaTitle: "Roof Cost Per Sq Ft Calculator – Estimate Your Roofing Cost Instantly",
    metaDescription:
      "Use our free roof cost per sq ft calculator to instantly estimate your roofing project cost. Enter your roof area and get a breakdown for asphalt, metal, and tile roofs.",
    heroSubtitle:
      "Enter your roof area and see your total roofing cost instantly — asphalt, metal, or tile.",
    introText:
      "Roofing contractors quote by the square — 100 sq ft — but homeowners think in total area. Asphalt shingles, metal, and tile all have very different price points, and pitch, valleys, and removal costs all push the final bill higher. Use the calculator above for an instant baseline before talking to a contractor.",
    contentHeading: "What affects roofing cost per square foot?",
    contentBody:
      "Asphalt shingles average $4–$7 per sq ft installed and remain the most popular choice for US homeowners. Metal roofing runs $7–$14 per sq ft and lasts 40–70 years. Tile and slate cost $10–$20+ per sq ft. Steeper pitches, valleys, skylights, and chimney flashing all increase labor costs. Always add 10–15% for waste and offcuts when ordering materials. For a full installed-cost breakdown including labor, tear-off, and decking repairs, see our roof replacement cost calculator.",
    defaultCostLow: 4,
    defaultCostHigh: 10,
    unitLabel: "sq ft",
    category: "Roofing",
    keywords: [
      "roof cost per sq ft",
      "roofing cost calculator",
      "cost per square foot roof",
      "roof replacement cost per sq ft",
      "how much does roofing cost per square foot",
    ],
    relatedSlugs: ["painting-cost-per-sq-ft", "concrete-cost-per-sq-ft"],
    exampleArea: 1500,
    exampleAreaLabel: "1,500 sq ft roof",
    internalLinks: [
      { label: "Roof Replacement Cost Calculator", href: "/tools/cost-calculators/home-improvement/roof-replacement-cost" },
      { label: "Concrete Cost Per Sq Ft", href: "/cost-calculators/concrete-cost-per-sq-ft" },
      { label: "All Construction Calculators", href: "/construction-calculators" },
    ],
  },

  "painting-cost-per-sq-ft": {
    title: "Painting Cost Per Sq Ft Calculator",
    metaTitle: "Painting Cost Per Sq Ft Calculator – Estimate Paint Cost Instantly",
    metaDescription:
      "Use our free painting cost per sq ft calculator to instantly estimate interior or exterior painting costs. Enter your wall area and get a realistic cost range based on real contractor rates.",
    heroSubtitle:
      "Tell us your wall area and instantly estimate your painting cost — interior or exterior.",
    introText:
      "Interior and exterior painting are priced differently — and most online estimates won't tell you why. Interior walls average $2–$4/sq ft; exterior painting can reach $6+ depending on siding type and the prep work required. Use this calculator to get a realistic range before you call a contractor.",
    contentHeading: "What does painting cost per square foot?",
    contentBody:
      "Interior painting averages $2–$4 per sq ft for walls and ceilings. Exterior painting runs $2–$6 per sq ft depending on siding type and the prep work required. High ceilings, detailed trim, and multiple coats all increase the price. Always budget for primer and two finish coats on any quality job. New construction painting is generally cheaper per sq ft than repaints, as surfaces need less preparation. If your walls need patching or new drywall before painting, check our drywall cost per sq ft calculator for a combined estimate.",
    defaultCostLow: 2,
    defaultCostHigh: 6,
    unitLabel: "sq ft",
    category: "Painting",
    keywords: [
      "painting cost per sq ft",
      "paint cost calculator",
      "cost to paint per square foot",
      "house painting cost estimate",
      "interior painting cost per sq ft",
    ],
    relatedSlugs: ["flooring-cost-per-sq-ft", "drywall-cost-per-sq-ft"],
    exampleArea: 1200,
    exampleAreaLabel: "1,200 sq ft of paintable wall area",
    internalLinks: [
      { label: "Flooring Cost Per Sq Ft", href: "/cost-calculators/flooring-cost-per-sq-ft" },
      { label: "Drywall Cost Per Sq Ft", href: "/cost-calculators/drywall-cost-per-sq-ft" },
      { label: "Cost Calculators Hub", href: "/tools/cost-calculators" },
    ],
  },

  "flooring-cost-per-sq-ft": {
    title: "Flooring Cost Per Sq Ft Calculator",
    metaTitle: "Flooring Cost Per Sq Ft Calculator – Estimate Floor Installation Cost Instantly",
    metaDescription:
      "Use our free flooring cost per sq ft calculator to instantly estimate installation costs for hardwood, LVP, laminate, tile, and carpet. Enter your room size and see your total.",
    heroSubtitle:
      "Enter your room's square footage and instantly compare floor installation costs across material types.",
    introText:
      "LVP, hardwood, laminate, tile, carpet — they look similar in a showroom but differ by 3–5x in installed cost per sq ft. The right material for your budget depends on traffic, moisture exposure, and subfloor condition. Start here to understand what each option will realistically cost before you visit a supplier or hire a contractor.",
    contentHeading: "How much does flooring cost per square foot?",
    contentBody:
      "Vinyl plank (LVP) flooring costs $3–$8 per sq ft installed — one of the most popular choices for its durability and water resistance. Laminate flooring runs $3–$7 per sq ft. Engineered hardwood averages $6–$12 per sq ft installed. Ceramic tile installation costs $5–$10 per sq ft. Solid hardwood is the most premium option at $8–$15 per sq ft. Always order 10% extra material to account for cuts, breakage, and future repairs. If you're also tiling bathrooms or kitchen floors, use our tile installation cost per sq ft calculator alongside this one.",
    defaultCostLow: 3,
    defaultCostHigh: 12,
    unitLabel: "sq ft",
    category: "Flooring",
    keywords: [
      "flooring cost per sq ft",
      "floor installation cost calculator",
      "cost per square foot flooring",
      "hardwood flooring cost",
      "vinyl plank flooring cost per sq ft",
    ],
    relatedSlugs: ["tile-installation-cost-per-sq-ft", "carpet-installation-cost-per-sq-ft"],
    exampleArea: 800,
    exampleAreaLabel: "800 sq ft floor",
    internalLinks: [
      { label: "Carpet Installation Cost Per Sq Ft", href: "/cost-calculators/carpet-installation-cost-per-sq-ft" },
      { label: "Tile Installation Cost Per Sq Ft", href: "/cost-calculators/tile-installation-cost-per-sq-ft" },
      { label: "Concrete Slab Calculator", href: "/construction-calculators/concrete/concrete-slab-calculator" },
    ],
  },

  "concrete-cost-per-sq-ft": {
    title: "Concrete Cost Per Sq Ft Calculator",
    metaTitle: "Concrete Cost Per Sq Ft Calculator – Estimate Slab & Driveway Cost Instantly",
    metaDescription:
      "Use our free concrete cost per sq ft calculator to instantly estimate slab, driveway, and patio costs. Enter your project area and get a low-to-high installed cost estimate.",
    heroSubtitle:
      "Enter your slab area and instantly estimate concrete cost — materials, labor, and finishing included.",
    introText:
      "Most people don't realise a 6-inch concrete slab costs roughly 50% more per sq ft than a 4-inch one — same footprint, very different price. Finishing type, reinforcement, and whether you need removal of an existing slab all move the number significantly. Use this calculator to get a solid baseline before requesting quotes.",
    contentHeading: "What does concrete cost per square foot?",
    contentBody:
      "A basic concrete slab costs $4–$8 per sq ft installed for a standard 4-inch pour. Driveways at 6 inches typically run $6–$10 per sq ft. Decorative and stamped concrete adds $3–$12 per sq ft to the base price. Ready-mix delivery fees apply for smaller pours, and removal of an existing slab adds $1–$3 per sq ft. Always get at least two quotes from local contractors before committing. For volume-based estimates, our concrete slab calculator works out cubic yards and bag counts alongside the installed cost.",
    defaultCostLow: 4,
    defaultCostHigh: 10,
    unitLabel: "sq ft",
    category: "Concrete",
    keywords: [
      "concrete cost per sq ft",
      "concrete slab cost calculator",
      "cost per square foot concrete",
      "concrete driveway cost per sq ft",
      "how much does concrete cost per square foot",
    ],
    relatedSlugs: ["tile-installation-cost-per-sq-ft", "roof-cost-per-sq-ft"],
    exampleArea: 600,
    exampleAreaLabel: "600 sq ft concrete slab",
    internalLinks: [
      { label: "Concrete Slab Calculator", href: "/construction-calculators/concrete/concrete-slab-calculator" },
      { label: "Concrete Driveway Cost", href: "/construction-calculators/concrete/concrete-driveway-cost" },
      { label: "Concrete Patio Cost", href: "/construction-calculators/concrete/concrete-patio-cost" },
    ],
  },

  "tile-installation-cost-per-sq-ft": {
    title: "Tile Installation Cost Per Sq Ft Calculator",
    metaTitle: "Tile Installation Cost Per Sq Ft Calculator – Estimate Tiling Cost Instantly",
    metaDescription:
      "Use our free tile installation cost per sq ft calculator to instantly estimate tiling costs for floors, walls, and bathrooms. Get a fast estimate for ceramic, porcelain, and stone tile.",
    heroSubtitle:
      "Enter your tile area and instantly estimate installation cost for any tile type or room.",
    introText:
      "Tile quotes from contractors can vary by $5–$10 per sq ft for the same job — the difference usually comes down to substrate prep, tile format, and layout pattern. Before you request quotes, use this calculator to understand what a fair number looks like for your specific project.",
    contentHeading: "How much does tile installation cost per square foot?",
    contentBody:
      "Basic ceramic tile installation averages $5–$10 per sq ft all-in. Porcelain tile costs $7–$14 per sq ft installed. Natural stone — marble, travertine, or slate — runs $10–$25 per sq ft. Large-format tiles and decorative layouts like herringbone or diagonal patterns cost more to install due to the extra cuts required. Budget 15% extra tiles for cuts and breakage. Heated floor systems add $8–$12 per sq ft on top of the tile cost. For full-room cost planning that includes hard flooring across multiple spaces, see our flooring cost per sq ft calculator.",
    defaultCostLow: 5,
    defaultCostHigh: 14,
    unitLabel: "sq ft",
    category: "Tiling",
    keywords: [
      "tile installation cost per sq ft",
      "tiling cost calculator",
      "cost to tile per square foot",
      "floor tile installation cost",
      "porcelain tile installation cost",
    ],
    relatedSlugs: ["flooring-cost-per-sq-ft", "concrete-cost-per-sq-ft"],
    exampleArea: 400,
    exampleAreaLabel: "400 sq ft bathroom and kitchen tile",
    internalLinks: [
      { label: "Flooring Cost Per Sq Ft", href: "/cost-calculators/flooring-cost-per-sq-ft" },
      { label: "Concrete Cost Per Sq Ft", href: "/cost-calculators/concrete-cost-per-sq-ft" },
      { label: "All Cost Calculators", href: "/tools/cost-calculators" },
    ],
  },

  "drywall-cost-per-sq-ft": {
    title: "Drywall Cost Per Sq Ft Calculator",
    metaTitle: "Drywall Cost Per Sq Ft Calculator – Estimate Drywall Installation Cost Instantly",
    metaDescription:
      "Use our free drywall cost per sq ft calculator to instantly estimate hanging, taping, and finishing costs for walls and ceilings. Enter your room size and get your estimate.",
    heroSubtitle:
      "Enter your wall and ceiling area and instantly estimate the cost to hang, tape, mud, and finish.",
    introText:
      "Whether you're finishing a basement, drywalling a new addition, or repairing storm damage, the cost per sq ft depends heavily on the finish level required. A Level 3 finish (standard) costs roughly half of a Level 5 skim-coat finish. Use this calculator to get a realistic starting estimate before speaking to a drywall contractor.",
    contentHeading: "What does drywall installation cost per square foot?",
    contentBody:
      "Basic drywall installation — hang, tape, mud, and finish — costs $1.50–$3.50 per sq ft. With primer and paint included, expect $2.50–$5 per sq ft total. Ceiling drywall costs more to install than walls due to the overhead work involved. Fire-rated (Type X) and moisture-resistant (green board) panels cost slightly more per sheet. Always factor in 10% waste for standard rooms with windows and doors. After drywalling, painting is the next major cost — use our painting cost per sq ft calculator to estimate that step too.",
    defaultCostLow: 1.5,
    defaultCostHigh: 3.5,
    unitLabel: "sq ft",
    category: "Drywall",
    keywords: [
      "drywall cost per sq ft",
      "drywall installation cost calculator",
      "cost to drywall per square foot",
      "sheetrock installation cost",
      "how much does drywall cost per square foot",
    ],
    relatedSlugs: ["painting-cost-per-sq-ft", "flooring-cost-per-sq-ft"],
    exampleArea: 1000,
    exampleAreaLabel: "1,000 sq ft of walls and ceilings",
    internalLinks: [
      { label: "Painting Cost Per Sq Ft", href: "/cost-calculators/painting-cost-per-sq-ft" },
      { label: "Flooring Cost Per Sq Ft", href: "/cost-calculators/flooring-cost-per-sq-ft" },
      { label: "Roof Replacement Cost Calculator", href: "/tools/cost-calculators/home-improvement/roof-replacement-cost" },
    ],
  },

  "carpet-installation-cost-per-sq-ft": {
    title: "Carpet Installation Cost Per Sq Ft Calculator",
    metaTitle: "Carpet Installation Cost Per Sq Ft Calculator – Estimate Carpet Cost Instantly",
    metaDescription:
      "Use our free carpet installation cost per sq ft calculator to instantly estimate carpet, pad, and labor costs. Enter your room size and get an instant low-to-high cost range.",
    heroSubtitle:
      "Enter your room area and instantly see the total cost of carpet, padding, and installation.",
    introText:
      "Carpet showrooms quote an installed price — bundling carpet, pad, and labor into one figure — which makes it hard to know if you're getting a fair deal. This calculator breaks it down by square foot so you can see exactly what $3 vs $7 per sq ft gets you in quality and durability.",
    contentHeading: "How much does carpet installation cost per square foot?",
    contentBody:
      "Basic polyester or nylon carpet installation costs $2–$5 per sq ft all-in (carpet + pad + labor). Mid-range carpet runs $4–$7 per sq ft installed. Premium wool or cut-pile options can reach $8–$15 per sq ft. Removing old carpet typically adds $0.50–$1 per sq ft. Stairs are quoted separately — usually $3–$10 per step. Always measure and order 10% extra to cover cuts and doorway thresholds. Comparing carpet to hard flooring? Our flooring cost per sq ft calculator covers LVP, laminate, hardwood, and tile so you can see the full picture.",
    defaultCostLow: 2,
    defaultCostHigh: 7,
    unitLabel: "sq ft",
    category: "Flooring",
    keywords: [
      "carpet installation cost per sq ft",
      "carpet cost calculator",
      "cost to carpet per square foot",
      "how much does carpet cost installed",
      "carpet and installation cost per sq ft",
    ],
    relatedSlugs: ["flooring-cost-per-sq-ft", "tile-installation-cost-per-sq-ft"],
    exampleArea: 500,
    exampleAreaLabel: "500 sq ft bedroom and hallway carpet",
    internalLinks: [
      { label: "Flooring Cost Per Sq Ft", href: "/cost-calculators/flooring-cost-per-sq-ft" },
      { label: "Tile Installation Cost Per Sq Ft", href: "/cost-calculators/tile-installation-cost-per-sq-ft" },
      { label: "All Cost Calculators", href: "/tools/cost-calculators" },
    ],
  },
};

export const sqftSlugs = Object.keys(sqftConfigs);
