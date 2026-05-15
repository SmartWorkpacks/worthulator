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
  title: "401k Calculator 2026 – Project Your Retirement Balance",
  description: "Will you actually be able to stop working? See what your current lifestyle looks like in retirement money.",
  keywords: ["401k calculator", "401k retirement calculator", "how much will my 401k be worth", "401k balance calculator", "employer match calculator"],
  alternates: { canonical: "https://worthulator.com/tools/401k-calculator" },
};

const FAQS = [
  { q: "How much should I contribute to my 401k?", a: "At minimum, contribute enough to capture your full employer match — that's a 50–100% instant return. The general rule of thumb is 15% of gross income including any match." },
  { q: "What is the 2025 401k contribution limit?", a: "The IRS limit for 2025 is $23,500 for employee contributions ($31,000 if you're 50+). Total contributions including employer match can't exceed $70,000." },
  { q: "What return should I assume?", a: "A 7% annual return is commonly used — it reflects the S&P 500's historical average after adjusting for inflation. More aggressive portfolios may average 8–10%; conservative ones 4–5%." },
  { q: "What happens if I withdraw early?", a: "Early withdrawals before age 59½ incur a 10% penalty plus ordinary income taxes. A $50,000 withdrawal could cost you $20,000+ in taxes and penalties depending on your bracket." },
  { q: "Should I choose traditional or Roth 401k?", a: "Traditional reduces taxable income now; you pay taxes on withdrawals. Roth uses after-tax dollars; withdrawals in retirement are tax-free. If you expect to be in a higher bracket later, Roth usually wins." },
];

const STATS = [
  { stat: "$87K",  color: "text-amber-600",   accent: "bg-amber-500",   label: "average 401k balance across all US workers" },
  { stat: "50%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "typical employer match rate on your contributions" },
  { stat: "$1M+",  color: "text-rose-600",    accent: "bg-rose-500",    label: "where $500/mo grows over 30 years at 7%" },
];

const CONTENT_CARDS = [
  { icon: "🎁", title: "The power of employer match", body: "A 50% match on 6% of salary is a 3% pay raise — completely free. Leaving this on the table is the single biggest retirement planning mistake most people make." },
  { icon: "📈", title: "Compound growth over time", body: "The difference between starting at 25 vs 35 is enormous. A $300/month contributor starting at 25 ends up with roughly double the balance of someone who starts at 35, at the same rate." },
  { icon: "📊", title: "The 4% rule", body: "At retirement, many planners use the 4% rule: you can withdraw 4% of your portfolio annually with a high probability of not running out of money over 30 years." },
];

const RELATED_CALCS = [
  { icon: "🔥", accent: "bg-orange-500/10",  title: "FIRE Calculator",          description: "Find your 'enough' number and retirement date.",  href: "/tools/fire-calculator" },
  { icon: "📈", accent: "bg-emerald-500/10", title: "Compound Interest",        description: "See the math of growing slowly but surely.",       href: "/tools/compound-interest-calculator" },
  { icon: "🏄", accent: "bg-blue-500/10",    title: "Coast FIRE Calculator",    description: "When can you stop contributing and coast?",        href: "/tools/coast-fire-calculator" },
  { icon: "📊", accent: "bg-purple-500/10",  title: "Net Worth Calculator",     description: "Your full financial scorecard.",                   href: "/tools/net-worth-calculator" },
];

export default function FourOhOneKCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="📈"
        eyebrowText="401k"
        title="401k Calculator"
        description="Project your 401k balance at retirement. Adjust your monthly contribution, employer match, expected return, and years to see what compound growth actually looks like."
        chips={["Employer match included", "Compound growth", "Projected balance"]}
      >
        <CalculatorEngineLoader slug="401k-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Never leave an employer match on the table — it's a 50–100% instant return on your contribution, guaranteed." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="How to maximise your 401k" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the 401k projection works"
        paragraphs={[
          "Each month: new balance = old balance × (1 + monthly rate) + your contribution + employer match. This compounds continuously, which is why starting early has such a dramatic effect.",
          "The calculator uses your inputs to simulate month-by-month growth over your chosen time horizon. Real balances will vary based on fund performance, fees, and contribution changes.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
