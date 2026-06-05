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
  title: "Flooring Cost Calculator 2026 – Materials & Labor Estimate",
  description:
    "Estimate the full installed cost of new flooring. Enter room size, material price per square foot, and a labor rate to get material, labor, and total project cost with a waste allowance.",
  keywords: ["flooring cost calculator", "floor installation cost calculator", "how much does flooring cost", "hardwood flooring cost calculator", "laminate flooring cost calculator", "lvp cost per square foot"],
  alternates: { canonical: "https://worthulator.com/tools/flooring-cost-calculator" },
};

const FAQS = [
  {
    q: "How much does flooring cost per square foot?",
    a: "Material costs vary widely by type: laminate ($1–5/sq ft), vinyl/LVP ($2–7/sq ft), engineered hardwood ($4–12/sq ft), solid hardwood ($5–15/sq ft), ceramic tile ($1–20/sq ft depending on grade), porcelain tile ($3–35/sq ft), carpet ($2–8/sq ft for materials). This calculator prices material and labor independently, so you set each rate yourself instead of relying on a fixed multiplier. Total installed cost for mid-range flooring of $5–15/sq ft all-in is common.",
  },
  {
    q: "What is included in flooring installation labor costs?",
    a: "Labor covers: removal of existing flooring (if applicable), subfloor prep and leveling, underlayment installation, flooring installation, transitions and trim, and cleanup. The labor rate is affected by flooring type (hardwood costs more to install than laminate), subfloor condition (leveling and repairs add cost), layout complexity (diagonal or herringbone patterns require more time), and regional labor market rates. Enter the labor price per square foot your contractor quoted — or set it to 0 for a DIY estimate.",
  },
  {
    q: "Should I include a waste factor in my flooring estimate?",
    a: "Yes — this calculator has a waste allowance slider that adds to the material quantity (labor is charged on the actual installed area). Use 10% for standard straight-lay installations, 15–20% for diagonal layouts, and 20–25% for herringbone, which generates the most off-cuts. Waste covers cutting, spoilage, and keeping a few spare planks for future repairs.",
  },
  {
    q: "What flooring type is best value for money?",
    a: "Luxury vinyl plank (LVP) has become the most popular choice for value: durable, 100% waterproof, DIY-friendly installation, realistic wood/stone visuals, and $3–8/sq ft installed. It's displaced laminate in most applications. Engineered hardwood offers genuine wood aesthetics for $8–15/sq ft installed. Solid hardwood is the premium option ($12–25/sq ft installed) with the ability to sand and refinish multiple times.",
  },
  {
    q: "Can I install flooring myself to save money?",
    a: "Laminate and LVP click-lock systems are very DIY-friendly — no glue, no nails, floating installation. A handy homeowner can install 50–100 sq ft per day with basic tools (pull bar, tapping block, saw, spacers). Saving labour on a 200 sq ft room at $3/sq ft = $600 saved. Tile installation is harder — requires cutting tools, precise levelling, adhesive work, and grouting. Hardwood flooring is complex and best left to professionals.",
  },
];

const STATS = [
  { stat: "$3–8", color: "text-emerald-600", accent: "bg-emerald-500", label: "per sq ft installed is the sweet spot for luxury vinyl plank — the best value flooring" },
  { stat: "$2–6", color: "text-blue-600", accent: "bg-blue-500", label: "per sq ft is a typical installation labor rate — set yours separately from materials" },
  { stat: "+10%", color: "text-amber-600", accent: "bg-amber-500", label: "waste allowance recommended on materials — more for diagonal and herringbone layouts" },
];

const CONTENT_CARDS = [
  {
    icon: "🏠",
    title: "LVP has changed flooring economics",
    body: "Luxury vinyl plank (LVP) is now the dominant flooring choice for kitchens, bathrooms, and open-plan living areas. It's 100% waterproof (unlike laminate, which swells), extremely durable (15–25 year warranties from leading brands), click-lock DIY-friendly, and realistically mimics hardwood or stone at a fraction of the cost. If you're replacing flooring throughout a home, LVP offers the best combination of value, durability, and ease of installation.",
  },
  {
    icon: "📊",
    title: "Where flooring costs escalate",
    body: "The biggest cost surprises come from: subfloor remediation (fixing squeaks, levelling, moisture barriers can add $1–3/sq ft), removing existing flooring ($1–2/sq ft for glue-down hardwood or tile), stair nosing and transitions ($20–80 per opening), and waste for complex patterns. Get a detailed quote that specifies what's included — 'supply and install' can mean very different things between contractors.",
  },
  {
    icon: "⏰",
    title: "Sequence your renovation correctly",
    body: "Flooring should be installed after painting but before baseboards and trim (or at minimum, new trim installed after flooring). Install flooring before kitchen cabinets go in if possible — it simplifies cuts and ensures the floor runs under appliances. Acclimate wood flooring (including engineered) in the room for 48–72 hours before installation to reduce post-install expansion and contraction.",
  },
];

const RELATED_CALCS = [
  { title: "Tile Calculator", description: "How many tiles for your floor or walls.", href: "/tools/tile-calculator", icon: "🏠", accent: "bg-emerald-500/10" },
  { title: "Paint Coverage Calculator", description: "How much paint for walls and ceilings.", href: "/tools/paint-coverage-calculator", icon: "🎨", accent: "bg-blue-500/10" },
  { title: "Solar ROI Calculator", description: "Return on home improvement investments.", href: "/tools/solar-roi", icon: "☀️", accent: "bg-amber-500/10" },
  { title: "House Affordability Calculator", description: "How much home can you afford?", href: "/tools/house-affordability-calculator", icon: "🏡", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Flooring Cost Calculator",
      url: "https://worthulator.com/tools/flooring-cost-calculator",
      applicationCategory: "UtilityApplication",
      description: "Calculate the total cost of flooring including materials and labour for any room size.",
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

export default function FlooringCostCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🏠"
        eyebrowText="Flooring Cost Calculator"
        title="How Much Will Your New Floor Cost?"
        description="Enter room dimensions and material cost per square foot to get a full estimate including materials, labour, and total project cost."
        chips={["Material cost shown", "Labour included", "Total project cost"]}
      >
        <EngineWithInsights slug="flooring-cost-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Price material and labor <span class='font-semibold text-gray-900'>separately</span> — a fixed 'labor = X% of materials' rule hides huge swings between LVP and hardwood. Budget for the full installed price." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Planning your flooring project" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Flooring Cost Calculator Works"
        formula={`Area = Room Length × Room Width
Material Cost = Area × (1 + Waste %) × Material $/ft²
Labor Cost = Area × Labor $/ft²
Total Cost = Material Cost + Labor Cost`}
        paragraphs={[
          "Enter room length and width in feet, the material price per square foot for your chosen flooring, and the labor price per square foot. Material cost includes your waste allowance (extra material for cuts and breakage); labor is charged on the actual installed area.",
          "Pricing material and labor independently is more honest than a one-size-fits-all multiplier — laminate installs cheaply while hardwood labor is far higher. Set labor to 0 for a DIY (materials-only) estimate, and remember that subfloor prep, removal of old flooring, transitions, and trim are not included here.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
