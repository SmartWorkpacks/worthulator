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
  title: "Global Wealth Percentile Calculator 2026 – Where Do You Rank?",
  description: "You feel broke, but you're probably the 1%. See where you actually land on the world leaderboard.",
  keywords: ["global wealth percentile", "am I rich", "global income percentile", "world wealth calculator", "where do I rank globally"],
  alternates: { canonical: "https://worthulator.com/tools/global-wealth-percentile" },
};

const FAQS = [
  { q: "What counts as 'wealthy' globally?", a: "According to Credit Suisse, the top 1% globally requires a net worth of ~$1 million USD. The top 10% threshold is approximately $100,000 USD. Over half the world's adults have net worth under $10,000." },
  { q: "How is global wealth distributed?", a: "The richest 1% own about 46% of global wealth. The bottom 50% own just 1.2%. The distribution is far more unequal globally than within any single developed country." },
  { q: "How does income compare to wealth?", a: "Income and wealth are related but different. High earners who spend everything have low net worth. People with old money may have high wealth but modest income. Both percentiles matter in different contexts." },
  { q: "Does cost of living affect the ranking?", a: "This calculator uses nominal USD comparisons. Purchasing Power Parity (PPP) adjustments would change the rankings — $50,000 goes much further in India than the US. Nominal rankings reflect global market power." },
  { q: "Why might this be motivating?", a: "Most people in developed countries rank in the global top 10–20% without realising it. Understanding your relative position globally can shift perspective on gratitude, giving, and financial goals." },
];

const STATS = [
  { stat: "Top 10%",  color: "text-emerald-600", accent: "bg-emerald-500", label: "threshold: ~$100K net worth globally" },
  { stat: "$10K",     color: "text-amber-600",   accent: "bg-amber-500",   label: "median adult net worth worldwide" },
  { stat: "46%",      color: "text-rose-600",    accent: "bg-rose-500",    label: "of global wealth owned by the top 1%" },
];

const CONTENT_CARDS = [
  { icon: "🌍", title: "The global 1%", body: "To be in the global top 1% requires a net worth of roughly $1 million. In the US alone, there are over 22 million millionaires — about 6.7% of the US population, and all of them are in the global top 1%." },
  { icon: "🤝", title: "What this means for giving", body: "If you're in the global top 10–20%, you have significantly more capacity to donate and invest than you might feel. Even small amounts by US standards can have enormous impact globally." },
  { icon: "📊", title: "Relative vs absolute poverty", body: "The World Bank defines extreme poverty as under $2.15/day. About 700 million people live below this line. Understanding global wealth distribution helps contextualise debates about inequality." },
];

const RELATED_CALCS = [
  { icon: "📊", accent: "bg-blue-500/10",    title: "Net Worth Calculator",       description: "Calculate your exact net worth figure.",           href: "/tools/net-worth-calculator" },
  { icon: "🔥", accent: "bg-orange-500/10",  title: "FIRE Calculator",            description: "Find your financial independence number.",          href: "/tools/fire-calculator" },
  { icon: "💎", accent: "bg-amber-500/10",   title: "Millionaire Calculator",     description: "When will you hit your first million?",            href: "/tools/millionaire-calculator" },
  { icon: "📈", accent: "bg-emerald-500/10", title: "Compound Interest",          description: "See how wealth compounds over decades.",            href: "/tools/compound-interest-calculator" },
];

export default function GlobalWealthPercentile() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="🌍"
        eyebrowText="Wealth Rank"
        title="Global Wealth Percentile Calculator"
        description="Enter your net worth and annual income to see where you rank among all 8 billion people on Earth. Most people in developed countries are surprised by how high they rank globally."
        chips={["Wealth percentile", "Income percentile", "Daily income equivalent"]}
      >
        <CalculatorEngineLoader slug="global-wealth-percentile" />
      </SimpleCalculatorHero>
      <InsightStrip text="Over half the world's adults have a net worth under $10,000. Your position may be more global-top-tier than you realise." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The global wealth picture" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the global percentile is estimated"
        paragraphs={[
          "Estimates are based on Credit Suisse Global Wealth Report and World Bank income distribution data. The calculation uses a logarithmic approximation of the global wealth distribution curve.",
          "Results are estimates — precise global data on individual wealth is not available. The calculator gives a reasonable indication based on publicly available distributional data.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
