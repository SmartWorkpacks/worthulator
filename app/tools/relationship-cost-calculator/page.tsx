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
  title: "Relationship Cost Calculator 2026 – What Has Love Cost You?",
  description: "Being in love isn't cheap. A transparent look at what your partner (and your dating life) actually costs.",
  keywords: ["relationship cost calculator", "how much does dating cost", "cost of a relationship", "dating expenses calculator", "relationship money calculator"],
  alternates: { canonical: "https://worthulator.com/tools/relationship-cost-calculator" },
};

const FAQS = [
  { q: "How much does a typical relationship cost per year?", a: "Surveys suggest couples spend $8,000–$12,000 per year on date nights, gifts, holidays, and shared expenses. Long-term partners often spend more as lifestyle expectations align upward." },
  { q: "Who typically pays more in a relationship?", a: "Traditionally, men spent more on early dating. Today it varies widely — about 50% of couples split evenly, 30% have one partner pay more, and 20% use hybrid approaches." },
  { q: "How much does an average date cost?", a: "A dinner date at a mid-range restaurant averages $60–$90 for two. Add a movie and it's $100–$120. Special occasion dates (concerts, events) can run $200–$400." },
  { q: "Is talking about money in a relationship a red flag?", a: "The opposite. Financial misalignment is a leading cause of relationship breakdown. Couples who openly discuss money have stronger relationships and better outcomes, according to multiple studies." },
  { q: "Should I factor in shared savings?", a: "This calculator focuses on the expenditure side. The wealth-building side of a committed relationship (shared mortgage, combined investing, economies of scale) often far outweighs the costs over time." },
];

const STATS = [
  { stat: "$10K",  color: "text-rose-600",    accent: "bg-rose-500",    label: "typical annual spend between committed couples" },
  { stat: "$17K",  color: "text-amber-600",   accent: "bg-amber-500",   label: "average American wedding cost" },
  { stat: "38%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "of couples say finances are a top relationship stressor" },
];

const CONTENT_CARDS = [
  { icon: "❤️", title: "It's an investment, not a cost", body: "Relationship spend creates real value: experiences, companionship, emotional wellbeing, and potentially a lifelong partner. The point isn't to minimise spend — it's to go in with open eyes." },
  { icon: "💳", title: "Where couples overspend", body: "Lifestyle inflation is the biggest culprit. Once you've established a $200 date night baseline, scaling back feels like a slight. Setting explicit expectations early prevents a lot of financial drift." },
  { icon: "💔", title: "The cost of a breakup", body: "Beyond the emotional toll, breakups involve splitting assets, potential relocation, furniture replacement, and legal costs for longer relationships. Relationship investment is a risk with real financial dimensions." },
];

const RELATED_CALCS = [
  { icon: "📊", accent: "bg-blue-500/10",    title: "Budget Calculator",          description: "Build a budget that includes your relationship.",  href: "/tools/budget-calculator" },
  { icon: "☕", accent: "bg-amber-500/10",   title: "Latte Factor Calculator",    description: "Small recurring expenses add up fast.",            href: "/tools/latte-factor-calculator" },
  { icon: "💸", accent: "bg-rose-500/10",    title: "Missed Investment Cost",     description: "What could that money have grown to?",             href: "/tools/missed-investment-calculator" },
  { icon: "💭", accent: "bg-purple-500/10",  title: "Dream Salary Calculator",    description: "What salary supports the life you both want?",    href: "/tools/dream-salary-calculator" },
];

export default function RelationshipCostCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="💑"
        eyebrowText="Relationship Cost"
        title="Relationship Cost Calculator"
        description="Enter your dating and relationship expenses — dates, gifts, travel — to see the total financial investment of your relationship over time."
        chips={["Total relationship cost", "Annual investment", "Monthly average"]}
      >
        <CalculatorEngineLoader slug="relationship-cost-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="The average committed couple spends $8,000–$12,000 per year together. Over 5 years, that's $40,000–$60,000 in shared experiences." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The financial side of love" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the relationship cost is calculated"
        paragraphs={[
          "Annual cost = (dates per month × avg cost × 12) + annual gifts + annual travel. Total = annual cost × years. Monthly average = annual ÷ 12.",
          "This calculation is for the variable and discretionary costs of the relationship — not shared fixed expenses like rent or utilities, which would be covered in a household budget calculator.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
