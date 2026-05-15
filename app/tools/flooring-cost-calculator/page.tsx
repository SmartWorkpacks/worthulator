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
  title: "Flooring Cost Calculator 2026 – Materials & Labour Estimate",
  description:
    "Calculate the total cost of new flooring including materials and installation labour. Enter room dimensions and material cost per square foot to get your full estimate.",
  keywords: ["flooring cost calculator", "floor installation cost calculator", "how much does flooring cost", "hardwood flooring cost calculator", "laminate flooring cost calculator"],
  alternates: { canonical: "https://worthulator.com/tools/flooring-cost-calculator" },
};

const FAQS = [
  {
    q: "How much does flooring cost per square foot?",
    a: "Material costs vary widely by type: laminate ($1–5/sq ft), vinyl/LVP ($2–7/sq ft), engineered hardwood ($4–12/sq ft), solid hardwood ($5–15/sq ft), ceramic tile ($1–20/sq ft depending on grade), porcelain tile ($3–35/sq ft), carpet ($2–8/sq ft for materials). Labour typically adds 50–100% of material cost for installation (40% used in this calculator as a baseline). Total installed cost for mid-range flooring: $5–15/sq ft all-in is common.",
  },
  {
    q: "What is included in flooring installation labour costs?",
    a: "Labour covers: removal of existing flooring (if applicable), subfloor prep and levelling, underlayment installation, flooring installation, transitions and trim, and cleanup. Labour rate is affected by flooring type (hardwood costs more to install than laminate), subfloor condition (levelling and repairs add cost), layout complexity (diagonal or herringbone patterns require more time), and regional labour market rates.",
  },
  {
    q: "Should I include a waste factor in my flooring estimate?",
    a: "Yes — always add 10% for waste to your measured area before calculating cost. This calculator uses your room dimensions directly; to be safe, increase your length or width by 5–10% to account for waste in cutting, spoilage, and off-cuts. Diagonal installations require a 15–20% waste factor. Herringbone requires 20–25%.",
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
  { stat: "40%", color: "text-emerald-600", accent: "bg-emerald-500", label: "of material cost is the baseline labour estimate used in this calculator" },
  { stat: "$3–8", color: "text-blue-600", accent: "bg-blue-500", label: "per sq ft installed is the sweet spot for luxury vinyl plank — the best value flooring" },
  { stat: "+10%", color: "text-amber-600", accent: "bg-amber-500", label: "waste factor recommended — add to your measured area before ordering materials" },
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
        <CalculatorEngineLoader slug="flooring-cost-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Labour typically adds <span class='font-semibold text-gray-900'>40–100% on top of material cost</span> — budget for the full installed price, not just the material price per square foot." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Planning your flooring project" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Flooring Cost Calculator Works"
        formula="Area = Room Length × Room Width\nMaterial Cost = Area × Cost Per Sq Ft\nLabour Cost = Material Cost × 40%\nTotal Cost = Material Cost + Labour Cost"
        paragraphs={[
          "Enter room length and width in feet and the material cost per square foot for your chosen flooring. The calculator multiplies area by unit cost for material total, then adds 40% for labour as a baseline estimate.",
          "Labour at 40% of materials is a conservative starting estimate. Actual labour varies by flooring type, subfloor condition, and regional rates — get contractor quotes for a more accurate figure. Always add a 10% waste allowance to your measured area before ordering materials.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
