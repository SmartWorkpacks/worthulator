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
import InsightsSection from "@/components/insights/InsightsSection";
import InsightTable from "@/components/insights/InsightTable";

export const metadata: Metadata = {
  title: "Inflation Impact Calculator 2026 – Purchasing Power Calculator",
  description: "Why $100 feels like $50 lately. See how much of your paycheck has evaporated since last year.",
  keywords: ["inflation calculator", "purchasing power calculator", "inflation impact calculator", "what is my money worth", "inflation over time"],
  alternates: { canonical: "https://worthulator.com/tools/inflation-impact-calculator" },
};

const FAQS = [
  { q: "What has average US inflation been historically?", a: "The US Federal Reserve targets 2% annually. The 20-year average before 2020 was ~2.2%. Post-pandemic inflation peaked at 9.1% in 2022 and has since moderated. Over very long periods, 3–3.5% is a reasonable planning assumption." },
  { q: "How does inflation affect savings accounts?", a: "If your savings earn 1% interest and inflation is 3%, your real return is -2%. Your balance goes up in dollars but buys less each year. Only returns that exceed the inflation rate grow real wealth." },
  { q: "What is the 'real' rate of return?", a: "Real return = nominal return − inflation rate. If your investment returns 8% and inflation is 3%, your real return is 5%. This is the return that actually matters for long-term planning." },
  { q: "What assets protect against inflation?", a: "Historically: equities, real estate, TIPS (Treasury Inflation-Protected Securities), commodities, and I Bonds have tended to at least keep pace with inflation. Cash and fixed-rate bonds are most vulnerable." },
  { q: "How does the Federal Reserve control inflation?", a: "Primarily through interest rates. Raising rates makes borrowing more expensive, slows spending, and cools inflation. Lowering rates stimulates growth but can increase inflation risk." },
];

const STATS = [
  { stat: "3.4%",  color: "text-amber-600",   accent: "bg-amber-500",   label: "US 20-year average annual inflation rate" },
  { stat: "34%",   color: "text-rose-600",    accent: "bg-rose-500",    label: "of value lost at 3.5% inflation over 10 years" },
  { stat: "$0.42", color: "text-emerald-600", accent: "bg-emerald-500", label: "what $1 from 1985 buys today, inflation-adjusted" },
];

const CONTENT_CARDS = [
  { icon: "👁️", title: "The invisible tax", body: "Inflation doesn't announce itself — it slowly erodes the value of cash held in low-yield accounts. A $50,000 emergency fund earning 0.5% loses real purchasing power every year at 3%+ inflation." },
  { icon: "📅", title: "Inflation and long-term planning", body: "Retirement calculators that don't account for inflation dramatically understate the savings required. A $3,000/month budget today will need $5,400+/month in 20 years at just 3% inflation." },
  { icon: "🔢", title: "The 72 rule", body: "Divide 72 by the inflation rate to find how many years it takes to cut purchasing power in half. At 3%: 24 years. At 7%: about 10 years. At 9.1% (2022 peak): less than 8 years." },
];

const RELATED_CALCS = [
  { icon: "📈", accent: "bg-emerald-500/10", title: "Compound Interest",         description: "Beat inflation with compound growth.",             href: "/tools/compound-interest-calculator" },
  { icon: "🎯", accent: "bg-blue-500/10",    title: "Savings Goal Calculator",   description: "How long to reach your target in real terms.",    href: "/tools/savings-goal-calculator" },
  { icon: "🔥", accent: "bg-orange-500/10",  title: "FIRE Calculator",           description: "Inflation-adjusted financial independence math.",  href: "/tools/fire-calculator" },
  { icon: "📊", accent: "bg-purple-500/10",  title: "Net Worth Calculator",      description: "Track the real, inflation-adjusted picture.",      href: "/tools/net-worth-calculator" },
];

export default function InflationImpactCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="📉"
        eyebrowText="Inflation"
        title="Inflation Impact Calculator"
        description="See how much your money is really worth in the future after inflation. Enter any amount, choose an inflation rate, and see your future purchasing power — and what you've silently lost."
        chips={["Future buying power", "Purchasing power lost", "Value erosion %"]}
      >
        <CalculatorEngineLoader slug="inflation-impact-calculator" afterResults={<InsightsSection slug="inflation-impact-calculator" />} />
      </SimpleCalculatorHero>
      <InsightStrip text="At 3.5% inflation, $100,000 today will only buy $50,000 worth of goods in 20 years. Inflation is the tax nobody talks about." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What inflation is doing to your money right now" cards={CONTENT_CARDS} />
      <InsightTable slug="inflation-impact-calculator" />
      <SEOTextBlock
        title="The purchasing power formula"
        formula={`Future Buying Power = Amount ÷ (1 + Inflation Rate)^Years
Real Value Loss (%) = (1 − 1 ÷ (1 + r)^n) × 100
Required Return     = Inflation Rate   (just to break even)`}
        paragraphs={[
          "Future buying power = today's amount ÷ (1 + inflation rate)ⁿ. If you have $10,000 today and inflation averages 3.5% per year, in 20 years that $10,000 only buys $4,975 worth of goods.",
          "To maintain purchasing power, your money must grow faster than inflation. Any savings vehicle returning less than the inflation rate is losing real value every year — even if the nominal balance rises.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
