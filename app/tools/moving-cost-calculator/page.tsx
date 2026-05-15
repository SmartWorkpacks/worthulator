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
  title: "Moving Cost Calculator 2026 – Total Relocation Budget",
  description: "Is a U-Haul worth the back pain? Compare the DIY price against the pros before you pack a single box.",
  keywords: ["moving cost calculator", "relocation cost estimator", "how much does moving cost", "moving budget calculator"],
  alternates: { canonical: "https://worthulator.com/tools/moving-cost-calculator" },
};

const FAQS = [
  { q: "How much does a local move cost?", a: "Local moves (under 100 miles) typically cost $800–$2,500 for professional movers, or $200–$600 for a DIY truck rental. Cost varies by volume, access, and floor." },
  { q: "How much does a long-distance move cost?", a: "Interstate moves average $2,500–$5,000 for a 2-bedroom home. Cross-country moves can run $4,000–$10,000+. Weight and distance are the two main pricing factors." },
  { q: "When is the cheapest time to move?", a: "Weekdays in the middle of the month from October to April. Avoiding summer (peak season), weekends, and the start/end of months can save 20–30%." },
  { q: "What do movers typically not cover?", a: "Most movers exclude plants, food, hazardous materials, high-value jewelry, and pets. Fragile items should be noted in advance and some require additional insurance." },
  { q: "Should I tip movers?", a: "Tipping is not required but is customary — typically $20–$50 per mover for a local move, more for a long-distance or especially difficult job. Cash is preferred." },
];

const STATS = [
  { stat: "$1,200", color: "text-amber-600",   accent: "bg-amber-500",   label: "average local move cost with professional movers" },
  { stat: "$4,890", color: "text-rose-600",    accent: "bg-rose-500",    label: "average interstate move cost" },
  { stat: "15%",    color: "text-emerald-600", accent: "bg-emerald-500", label: "typical overrun — always budget a buffer" },
];

const CONTENT_CARDS = [
  { icon: "🔍", title: "The hidden costs everyone forgets", body: "Moving company tip, extra boxes mid-pack, parking permits for trucks, reconnection fees, cleaning supplies for both homes, and the first grocery run at the new place. These add up fast." },
  { icon: "🚛", title: "DIY vs professional movers", body: "DIY can save $1,000–$3,000 on labour but costs you time, physical effort, and the risk of damage. For moves over 2 bedrooms, professional movers often work out more cost-effectively than you'd expect." },
  { icon: "📅", title: "Overlap your leases", body: "Having even 2 weeks of lease overlap lets you move at a relaxed pace and clean the old place properly. The cost is usually worth avoiding the chaos of a same-day move-out/move-in." },
];

const RELATED_CALCS = [
  { icon: "🏠", accent: "bg-emerald-500/10", title: "House Affordability",       description: "Can you afford the place you're moving to?",    href: "/tools/house-affordability-calculator" },
  { icon: "⚖️", accent: "bg-blue-500/10",    title: "Rent vs Buy Calculator",    description: "Is it time to stop renting?",                   href: "/tools/rent-vs-buy-calculator" },
  { icon: "📊", accent: "bg-amber-500/10",   title: "Budget Calculator",         description: "Build your post-move monthly budget.",           href: "/tools/budget-calculator" },
  { icon: "🧾", accent: "bg-purple-500/10",  title: "Closing Cost Calculator",   description: "If you're buying: all the fees at signing.",    href: "/tools/closing-cost-calculator" },
];

export default function MovingCostCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="📦"
        eyebrowText="Moving"
        title="Moving Cost Calculator"
        description="Enter your moving expenses to see a total budget — truck, fuel, packing, storage, and the bits everyone forgets. Add a 15% buffer and move without surprises."
        chips={["Total move cost", "Per-room estimate", "Surprise buffer"]}
      >
        <CalculatorEngineLoader slug="moving-cost-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Most people budget for the truck and forget everything else. The real cost of moving is usually 30–50% higher than the initial quote." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What to include in your moving budget" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How to budget your move accurately"
        paragraphs={[
          "Total = truck/movers + fuel + packing supplies + storage + tips/food/misc. Add 15% to the total for unexpected expenses — parking permits, broken items, extra boxes, takeout during the chaos.",
          "Get 3 quotes from movers. The cheapest quote is often not the final invoice. Ask about stair fees, long-carry charges, and whether the quote is binding or non-binding.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
