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
  title: "Tax Bracket Calculator 2026 – Effective vs Marginal Rate",
  description: "The raise isn't a trap. See exactly what the government takes from that next dollar so you can move up in peace.",
  keywords: ["tax bracket calculator", "effective tax rate calculator", "marginal vs effective tax rate", "federal tax calculator", "income tax bracket 2025"],
  alternates: { canonical: "https://worthulator.com/tools/tax-bracket-calculator" },
};

const FAQS = [
  { q: "What's the difference between marginal and effective tax rate?", a: "Your marginal rate is the rate on your last dollar earned — the 'bracket' you're in. Your effective rate is your total tax ÷ total income. Most people pay far less than their marginal rate." },
  { q: "What are the 2025 federal tax brackets?", a: "Single filers: 10% up to $11,925; 12% up to $48,475; 22% up to $103,350; 24% up to $197,300; 32% up to $250,525; 35% up to $626,350; 37% above that." },
  { q: "Does being in a higher bracket mean I pay more on ALL income?", a: "No. This is one of the most common tax myths. The US uses a progressive system — only the income above each threshold gets taxed at the higher rate. Moving brackets doesn't cost you money." },
  { q: "What is the standard deduction?", a: "For 2025: $15,000 for single filers, $30,000 for married filing jointly. This comes off your income before brackets are applied, lowering your taxable income." },
  { q: "Should I do a W-4 adjustment?", a: "If you consistently owe a large amount or get a very large refund, you may be under- or over-withholding. A large refund means you gave the government an interest-free loan all year." },
];

const STATS = [
  { stat: "22%",   color: "text-amber-600",   accent: "bg-amber-500",   label: "most common marginal bracket for middle earners" },
  { stat: "13.3%", color: "text-emerald-600", accent: "bg-emerald-500", label: "average US effective federal tax rate" },
  { stat: "7.65%", color: "text-rose-600",    accent: "bg-rose-500",    label: "FICA rate on top of income tax (Social Security + Medicare)" },
];

const CONTENT_CARDS = [
  { icon: "📊", title: "Progressive taxation explained", body: "You pay 10% on the first ~$11,900, then 12% on the next slice, then 22% and so on. Only the income above each threshold hits the next rate. No one actually pays 22% on everything." },
  { icon: "💡", title: "How to lower your effective rate", body: "Maximising pre-tax contributions (401k, HSA, FSA, traditional IRA) reduces your taxable income directly — every dollar contributed at 22% saves you 22 cents in tax." },
  { icon: "📈", title: "Capital gains are different", body: "Long-term capital gains (assets held 1+ year) are taxed at 0%, 15%, or 20% — separate from your ordinary income bracket. This is why investing can be more tax-efficient than earning wages." },
];

const RELATED_CALCS = [
  { icon: "💵", accent: "bg-emerald-500/10", title: "Take-Home Pay Calculator",   description: "See exactly what lands in your account.",        href: "/tools/take-home-pay-calculator" },
  { icon: "🧾", accent: "bg-blue-500/10",    title: "Pay Stub Calculator",        description: "Decode every line of your paycheck.",             href: "/tools/pay-stub-calculator" },
  { icon: "💼", accent: "bg-amber-500/10",   title: "Self-Employed Tax",          description: "SE tax, quarterly estimates, deductions.",        href: "/tools/self-employed-tax-calculator" },
  { icon: "💭", accent: "bg-purple-500/10",  title: "Dream Salary Calculator",    description: "Work backwards from the life you want.",          href: "/tools/dream-salary-calculator" },
];

export default function TaxBracketCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="📊"
        eyebrowText="Tax Brackets"
        title="Tax Bracket Calculator"
        description="Enter your income and total taxes paid to see your effective rate vs your marginal bracket. Understand the difference and stop over-estimating what you owe."
        chips={["Effective tax rate", "Marginal bracket", "Side-by-side comparison"]}
      >
        <CalculatorEngineLoader slug="tax-bracket-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Most people overestimate their tax rate. Your effective rate is almost always several points below your marginal bracket." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Tax rates most people misunderstand" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="Marginal vs effective rate formula"
        paragraphs={[
          "Effective rate (%) = (total taxes ÷ gross income) × 100. This is your true tax burden — the number that actually matters for budgeting.",
          "Marginal rate = the rate that applies to your highest dollar of income. It only applies to income above the bracket threshold, not your entire income.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
