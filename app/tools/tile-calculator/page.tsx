import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
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
  title: "Tile Calculator 2026 – How Many Tiles Do I Need? Area & Tile Count",
  description:
    "Calculate how many tiles you need for any room or surface. Enter room dimensions and tile size to get the total area and tile count with a 10% waste allowance.",
  keywords: ["tile calculator", "how many tiles do I need", "tile quantity calculator", "floor tile calculator", "wall tile calculator"],
  alternates: { canonical: "https://worthulator.com/tools/tile-calculator" },
};

const FAQS = [
  {
    q: "How many tiles do I need for my room?",
    a: "Formula: (Room Length × Room Width) ÷ (Tile Length × Tile Width) × 1.10. The 1.10 factor adds a 10% waste allowance for cuts, breakages, and pattern matching. Example: a 4m × 5m room (20m²) with 600×600mm tiles (0.36m² each): 20 ÷ 0.36 × 1.10 = 61 tiles. Always round up to the nearest whole tile and consider buying a few extra boxes for future repairs.",
  },
  {
    q: "Why do I need extra tiles beyond the calculated amount?",
    a: "A 10% waste allowance accounts for: cuts at room edges and corners (every edge tile needs cutting), tile breakage during cutting and installation, pattern-matching waste for diagonal or offset layouts (which require more cutting), and future repairs (having spare tiles from the same batch ensures colour and texture matching). For complex patterns like herringbone or diagonal, increase to 15%. For simple straight-lay large-format tiles, 10% is usually sufficient.",
  },
  {
    q: "How do I measure my room for tiling?",
    a: "For rectangular rooms: length × width = area. For L-shaped rooms, divide into rectangles and add the areas. For walls: measure the height × width of each section, subtract door and window openings. For bathrooms with a bath: subtract the bath alcove area. Always measure the actual tiled area, not the room footprint — and double-check measurements before ordering tiles.",
  },
  {
    q: "What tile sizes are most common?",
    a: "Common floor tile sizes: 600×600mm, 800×800mm, 600×1200mm (large format planks), 300×300mm (small format). Common wall tile sizes: 300×600mm (metro/subway style), 200×400mm, 75×300mm (classic metro). Large format tiles (600mm+) look more contemporary and have fewer grout lines but require a very flat, well-prepared substrate. Smaller tiles are more forgiving of substrate imperfections.",
  },
  {
    q: "How much does tiling cost including labour?",
    a: "Materials alone (tiles + adhesive + grout + spacers) typically run £20–80/m² depending on tile quality. Labour adds another £30–60/m² for a skilled tiler in the UK (varies by region and complexity). Total installed cost: £50–140/m² is typical. Complex patterns (herringbone, chevron), small mosaic tiles, or difficult areas (wet room, shower tray) command higher rates. Get 3 quotes from local tilers with references.",
  },
];

const STATS = [
  { stat: "+10%", color: "text-emerald-600", accent: "bg-emerald-500", label: "waste allowance automatically included — covers cuts, breakages, and future repairs" },
  { stat: "600mm", color: "text-blue-600", accent: "bg-blue-500", label: "square tiles are the most popular size for contemporary floors and large format walls" },
  { stat: "3 quotes", color: "text-amber-600", accent: "bg-amber-500", label: "recommended from local tilers before committing — labour rates vary significantly" },
];

const CONTENT_CARDS = [
  {
    icon: "📐",
    title: "Measure twice, order once",
    body: "The most common tiling mistake is ordering too few tiles — especially problematic if you need to re-order from the same batch (dye lots vary between batches). Always round up to the nearest full box and add one extra box beyond the calculated 10% waste. Most tile retailers accept returns of unopened boxes, so the risk of over-ordering is low compared to the risk of running short.",
  },
  {
    icon: "🏠",
    title: "Tile layout planning before you start",
    body: "Before laying a single tile, do a dry run: lay tiles without adhesive across the room to check the pattern, ensure cuts at opposite walls are symmetrical, and confirm the layout is visually balanced. Starting from the centre of the room and working outward produces the most symmetrical result. Avoid starting from a wall — walls are rarely perfectly square, and it creates uneven cuts on the opposite side.",
  },
  {
    icon: "🔨",
    title: "Substrate preparation is everything",
    body: "The best tiles can't compensate for a poorly prepared floor. The substrate must be structurally sound, flat to within 3mm over 2 metres, and free from flex (timber floors need additional boarding). Use flexible tile adhesive in wet areas and ensure a consistent bed thickness. Adequate substrate prep is what separates a tiling job that lasts 20 years from one that lifts within 2.",
  },
];

const RELATED_CALCS = [
  { title: "Flooring Cost Calculator", description: "Total cost of flooring materials and labour.", href: "/tools/flooring-cost-calculator", icon: "🏠", accent: "bg-emerald-500/10" },
  { title: "Paint Coverage Calculator", description: "How much paint for your walls and ceilings.", href: "/tools/paint-coverage-calculator", icon: "🎨", accent: "bg-blue-500/10" },
  { title: "Concrete Calculator", description: "Volume of concrete for slabs and footings.", href: "/construction-calculators/concrete-calculator", icon: "🏗️", accent: "bg-amber-500/10" },
  { title: "Gravel Calculator", description: "Tonnes of gravel for any area.", href: "/tools/gravel-calculator", icon: "⛏️", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Tile Calculator",
      url: "https://worthulator.com/tools/tile-calculator",
      applicationCategory: "UtilityApplication",
      description: "Calculate how many tiles you need for any room with a 10% waste allowance for cuts and breakages.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function TileCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🏠"
        eyebrowText="Tile Calculator"
        title="How Many Tiles Do You Need?"
        description="Enter your room dimensions and tile size in metres to instantly calculate the total area and number of tiles required — with a 10% waste allowance already included."
        chips={["Area calculated", "Tile count with waste", "Instant results"]}
      >
        <CalculatorEngineLoader slug="tile-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Always add <span class='font-semibold text-gray-900'>10% for waste</span> — cuts, breakages, and future repairs. This calculator includes it automatically." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Tiling tips to get it right first time" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Tile Calculator Works"
        formula="Room Area = Room Length × Room Width\nTile Area = Tile Length × Tile Width\nTiles Needed = ⌈(Room Area ÷ Tile Area) × 1.10⌉"
        paragraphs={[
          "Enter room dimensions and tile dimensions in metres. The calculator divides total room area by single tile area to get the base count, multiplies by 1.10 to add the 10% waste allowance, then rounds up to the nearest whole tile.",
          "Always buy by the box rather than individual tiles — this ensures you have consistent dye lot matching. Round up to the nearest full box and consider keeping any spares for future repairs.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
