import type { Metadata } from "next";
import EngineWithInsights from "@/components/worthcore/EngineWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Tile Calculator 2026 – How Many Tiles Do I Need? Count, Area & Cost",
  description:
    "Calculate how many tiles you need for any room. Enter room size in feet and pick your tile size to get the tile count with a waste allowance — plus optional material cost.",
  keywords: ["tile calculator", "how many tiles do I need", "tile quantity calculator", "floor tile calculator", "tile cost calculator"],
  alternates: { canonical: "https://worthulator.com/tools/tile-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How many tiles do I need for my room?",
    a: "Tiles = ⌈(Room Area ÷ Tile Area) × (1 + Waste%)⌉. The waste factor covers cuts, breakage, and pattern-matching. Example: a 12 ft × 10 ft room (120 ft²) with 12×12 in tiles (1 ft² each) at 10% waste = 120 ÷ 1 × 1.10 = 132 tiles. Always round up to the nearest whole tile, and buy by the box so you can match dye lots.",
  },
  {
    q: "Why do I need extra tiles beyond the bare area?",
    a: "A 10% waste allowance covers edge and corner cuts (every perimeter tile is cut), breakage during cutting and setting, pattern-matching waste on diagonal or offset layouts, and a few spares for future repairs — critical because dye lots vary between batches. For herringbone, chevron, or diagonal layouts, bump waste to 15%.",
  },
  {
    q: "How do I measure my room for tiling?",
    a: "Rectangular rooms: length × width. L-shaped rooms: split into rectangles and add the areas. Walls: height × width of each section minus door and window openings. Always measure the actual tiled surface, not the room footprint, and double-check before ordering.",
  },
  {
    q: "What tile sizes are most common?",
    a: "Common US floor sizes: 12×12 in, 18×18 in, 24×24 in, and 12×24 in. Plank tiles like 6×24 in mimic wood; 3×6 in subway is the classic wall tile. Large-format tiles (18 in+) look contemporary with fewer grout lines but need a very flat substrate; smaller tiles are more forgiving of imperfections.",
  },
  {
    q: "How much does tiling cost including labor?",
    a: "Tile material alone typically runs $1–8/ft² depending on quality. Labor adds roughly $4–14/ft² for a skilled tiler in the US (varies by region and complexity). Installed totals of $7–20/ft² are common. Complex patterns, mosaics, and wet areas command higher rates — get three quotes from local tilers with references.",
  },
];

const STATS = [
  { stat: "+10%",    color: "text-emerald-600", accent: "bg-emerald-500", label: "default waste allowance — covers cuts, breakage, and repair spares" },
  { stat: "12 in",   color: "text-blue-600",    accent: "bg-blue-500",    label: "square tiles remain the most popular size for US floors" },
  { stat: "3 quotes", color: "text-amber-600",  accent: "bg-amber-500",   label: "recommended from local tilers — labor rates vary widely" },
];

const CONTENT_CARDS = [
  {
    icon: "📐",
    title: "Measure twice, order once",
    body: "The most common tiling mistake is ordering too few — a problem when you have to re-order from a different dye lot. Round up to the nearest full box and keep the waste-margin tiles as spares. Most retailers accept unopened boxes back, so over-ordering is low-risk versus running short.",
  },
  {
    icon: "🏠",
    title: "Plan the layout before you start",
    body: "Do a dry run: lay tiles without adhesive to check the pattern and that cuts at opposite walls are symmetrical. Starting from the center of the room and working outward gives the most balanced result. Starting from a wall — rarely perfectly square — creates uneven cuts on the far side.",
  },
  {
    icon: "🔨",
    title: "Substrate prep is everything",
    body: "Even great tiles can't fix a poor floor. The substrate must be sound, flat to within about 1/8 in over 6 ft, and free from flex (timber floors often need extra boarding). Proper prep is what separates a job that lasts 20 years from one that lifts within two.",
  },
];

const RELATED_CALCS = [
  { title: "Flooring Cost Calculator", description: "Total cost of flooring materials and labor.", href: "/tools/flooring-cost-calculator", icon: "🪵", accent: "bg-emerald-500/10" },
  { title: "Paint Coverage Calculator", description: "How much paint for your walls and ceilings.", href: "/tools/paint-coverage-calculator", icon: "🎨", accent: "bg-blue-500/10" },
  { title: "Concrete Calculator", description: "Volume of concrete for slabs and footings.", href: "/construction-calculators/concrete-calculator", icon: "🏗️", accent: "bg-amber-500/10" },
  { title: "Gravel Calculator", description: "Tons of gravel for any area.", href: "/tools/gravel-calculator", icon: "⛏️", accent: "bg-purple-500/10" },
];

export default function TileCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Tile Calculator",
      url: "https://worthulator.com/tools/tile-calculator",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      description: "Calculate how many tiles you need for any room with a waste allowance and optional material cost.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="🧱"
        eyebrowText="Home · Tiling"
        title="Tile Calculator"
        description="Enter your room size in feet and pick your tile size to instantly get the area, the number of tiles to order with a waste allowance, and optional material cost."
        chips={["Tiles to order", "Waste included", "Material cost"]}
      >
        <EngineWithInsights slug="tile-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Always add <span class='font-semibold text-gray-900'>~10% for waste</span> — cuts, breakage, and future repairs. This calculator includes it automatically." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Tiling tips to get it right first time" subtitle="Order, plan, and prep like a pro." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Tile Calculator Works"
        formula={`Room Area    = Length × Width   (ft²)
Tiles Needed = ⌈(Room Area ÷ Tile Area) × (1 + Waste% ÷ 100)⌉
Tile Cost    = Tiles Needed × Price per Tile`}
        steps={[
          { label: "Enter room length and width", description: "In feet — the actual tiled surface, not the room footprint." },
          { label: "Pick your tile size", description: "Standard US sizes from 3×6 in subway up to 24×24 in." },
          { label: "Set the waste allowance", description: "10% for straight-lay; 15% for diagonal or herringbone." },
          { label: "Add a price per tile", description: "Optional — leave at 0 to skip material cost." },
        ]}
        paragraphs={[
          "The calculator divides your room area by the area of a single tile to get the base count, multiplies by the waste factor for cuts and breakage, then rounds up to the nearest whole tile.",
          "Buy by the box rather than by the tile so your dye lots match, round up to full boxes, and keep the waste-margin tiles as a repair stash — a tile bought next year rarely matches today's batch.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More home-improvement tools." items={RELATED_CALCS} />
    </main>
  );
}
