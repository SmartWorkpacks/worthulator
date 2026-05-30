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
  title: "Alcohol Cost Calculator 2026 – See What Drinking Really Costs",
  description:
    "Calculate your annual alcohol spend and what it would grow to if invested instead. A clear-eyed look at the real cost of drinking.",
  keywords: ["alcohol cost calculator", "how much do I spend on alcohol", "drinking cost calculator", "alcohol money saved"],
  alternates: { canonical: "https://worthulator.com/tools/alcohol-cost-calculator" },
};

const FAQS = [
  {
    q: "How much does the average person spend on alcohol per year?",
    a: "The average American spends around $500–$600 per year on alcohol according to the Bureau of Labor Statistics, but frequent drinkers or those who regularly drink at bars and restaurants can easily spend $3,000–$10,000+ annually.",
  },
  {
    q: "How is the 'invested value' calculated?",
    a: "The calculator assumes you invest your annual alcohol spend at the start of each year with a 7% annual return over 10 years, using the future value of an annuity formula. It represents the opportunity cost of the money spent on alcohol.",
  },
  {
    q: "Should I include home drinking and bar drinking?",
    a: "Yes — blend both. If you buy a case of beer at home for $30 and spend $60 at a bar in a given week, your weekly average is $90 for however many drinks that covers. The average cost per drink is the blended figure.",
  },
  {
    q: "Is this tool trying to make me quit drinking?",
    a: "Not at all. It is simply a financial awareness tool. You may decide the enjoyment is worth every penny — that is a completely valid choice. The goal is to make the cost visible so it is a conscious decision rather than an unexamined habit.",
  },
  {
    q: "What else can I use this for?",
    a: "The same framework applies to any regular spending habit — cigarettes, vaping, takeout coffee, gambling, or any recurring purchase you want to quantify over time.",
  },
];

const STATS = [
  { stat: "$1,200", color: "text-emerald-600", accent: "bg-emerald-500", label: "average annual alcohol spend for a moderate social drinker" },
  { stat: "$17K+", color: "text-amber-600", accent: "bg-amber-500", label: "what $1,200/year invested at 7% grows to in 10 years" },
  { stat: "2 drinks", color: "text-blue-600", accent: "bg-blue-500", label: "the recommended low-risk weekly limit per many health guidelines" },
];

const CONTENT_CARDS = [
  {
    icon: "🍺",
    title: "The true annual cost",
    body: "A couple of pints three nights a week at $8 each adds up to $2,496 per year — not including rounds, tips, or nights out. Most people significantly underestimate their annual spend until they run the numbers.",
  },
  {
    icon: "📈",
    title: "The opportunity cost",
    body: "Money spent on alcohol is money that cannot compound. At 7% annual return, $2,500/year invested grows to over $35,000 in 10 years. Over 30 years, the same habit costs over $236,000 in foregone wealth.",
  },
  {
    icon: "💡",
    title: "Small reductions have big impact",
    body: "You do not have to quit entirely to see a difference. Cutting two drinks per week saves roughly $800/year at $8 per drink. That alone, invested over 20 years, adds over $40,000 to your net worth.",
  },
];

const RELATED_CALCS = [
  { title: "Quit Smoking Calculator", description: "See the financial cost of smoking over time.", href: "/tools/quit-smoking-calculator", icon: "🚭", accent: "bg-red-500/10" },
  { title: "Vaping Cost Calculator", description: "Find out what vaping really costs per year.", href: "/tools/vaping-cost-calculator", icon: "💨", accent: "bg-slate-500/10" },
  { title: "Latte Factor Calculator", description: "The cost of small daily habits over time.", href: "/tools/latte-factor", icon: "☕", accent: "bg-amber-500/10" },
  { title: "Compound Interest Calculator", description: "See what any saving grows to over time.", href: "/tools/compound-interest-calculator", icon: "📊", accent: "bg-emerald-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Alcohol Cost Calculator",
      url: "https://worthulator.com/tools/alcohol-cost-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate the annual and 10-year cost of drinking, and what it would be worth if invested instead.",
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

export default function AlcoholCostCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🍺"
        eyebrowText="Alcohol Cost"
        title="What Does Drinking Really Cost You?"
        description="Enter your weekly drinks and average cost per drink to see your annual spend, 10-year total, and what that money would be worth invested instead."
        chips={["Annual spend", "10-year total", "Investment opportunity cost"]}
      >
        <CalculatorEngineLoader slug="alcohol-cost-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="The true cost of drinking is what you spend, plus what you never invest." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The real cost of drinking" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Alcohol Cost Calculator Works"
        paragraphs={[
          "Enter how many drinks you have per week and your average cost per drink (blending home and out-of-home costs). The calculator multiplies weekly spend by 52 to give your annual total and by 10 for a decade view.",
          "The invested value uses the future value of an annuity formula at 7% annual return — showing what your annual alcohol budget would grow to if invested in a broad market index fund over 10 years.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
