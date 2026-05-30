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
  title: "FIRE Calculator 2026 – Your Number & Years to Financial Independence",
  description:
    "Calculate your FIRE number using the 4% rule and see how many years until you reach financial independence. Enter your expenses, savings, and return rate.",
  keywords: ["FIRE calculator", "financial independence calculator", "FIRE number calculator", "retire early calculator", "4% rule calculator", "how much do I need to retire"],
  alternates: { canonical: "https://worthulator.com/tools/fire-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is the FIRE number?",
    a: "Your FIRE number is the amount of invested assets needed to retire and live off investment returns indefinitely. It's calculated as your annual expenses × 25, based on the 4% safe withdrawal rate.",
  },
  {
    q: "What is the 4% rule?",
    a: "The 4% rule (from the Trinity Study) states that you can withdraw 4% of your portfolio per year in retirement and your money will last 30+ years with a high probability. So $1M supports $40,000/year in spending.",
  },
  {
    q: "What is FIRE?",
    a: "FIRE stands for Financial Independence, Retire Early. It's a movement of people who aggressively save and invest to achieve financial independence — the point where work becomes optional — typically decades before traditional retirement age.",
  },
  {
    q: "Is the 4% rule still valid in 2026?",
    a: "It's debated. Some researchers suggest 3–3.5% is safer given current valuations and longer retirement horizons. Others argue 4% remains valid. Using 3.5% (28× expenses) gives a more conservative FIRE number if you're planning a 40+ year retirement.",
  },
  {
    q: "What is the difference between FIRE and Coast FIRE?",
    a: "Full FIRE means your portfolio is large enough to withdraw from now. Coast FIRE means you've invested enough that you can stop contributing and let compound growth carry you to your FIRE number by a target retirement date — without adding another dollar.",
  },
  {
    q: "How do I reach FIRE faster?",
    a: "Savings rate is the #1 driver — far more than investment returns. Someone saving 50% of income reaches FIRE in ~17 years regardless of salary. The math is simple: the more you save, the less you need to live on, which also lowers your FIRE number.",
  },
];

const STATS = [
  { stat: "25×",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Your FIRE number — 25 times your annual expenses, based on the 4% rule" },
  { stat: "50%",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Savings rate that gets you to FIRE in roughly 17 years, regardless of income" },
  { stat: "17yr", color: "text-amber-600",   accent: "bg-amber-500",   label: "Years to FIRE at a 50% savings rate — down from 40+ years at a 10% rate" },
];

const CONTENT_CARDS = [
  {
    icon: "🔥",
    title: "Savings rate beats income",
    body: "A high earner saving 5% and a modest earner saving 50% will reach FIRE at roughly the same time — because the FIRE number scales with spending. Cutting expenses is the fastest accelerator, both by reducing the target and increasing the savings rate.",
  },
  {
    icon: "📈",
    title: "The 4% rule explained",
    body: "Based on historical data, a 4% annual withdrawal from a diversified portfolio has succeeded 95%+ of the time over 30-year periods. Multiply your annual expenses by 25 and you have the portfolio size needed to sustain them indefinitely.",
  },
  {
    icon: "🎯",
    title: "Lean FIRE vs Fat FIRE",
    body: "Lean FIRE means retiring on minimal expenses ($25–40k/year). Fat FIRE means retiring with a lifestyle no different from high-earning years ($80–150k+). Your target is personal — this calculator works for any spending level.",
  },
];

const RELATED_CALCS = [
  { title: "Millionaire Calculator",   description: "See how long until your savings hit $1,000,000.",        href: "/tools/millionaire-calculator",      icon: "💰", accent: "bg-emerald-500/10" },
  { title: "Savings Calculator",       description: "Project your savings growth over any time horizon.",      href: "/tools/savings-calculator",          icon: "🏦", accent: "bg-blue-500/10" },
  { title: "Future Value Calculator",  description: "See what any investment grows to over time.",             href: "/tools/future-value-calculator",     icon: "📈", accent: "bg-amber-500/10" },
  { title: "Retirement Calculator",    description: "Full retirement projection with income and withdrawals.", href: "/tools/retirement-calculator",       icon: "🏡", accent: "bg-purple-500/10" },
];

export default function FireCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "FIRE Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your FIRE number and years to financial independence using the 4% rule.",
      url: "https://worthulator.com/tools/fire-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="🔥"
        eyebrowText="Investing · Financial Independence"
        title="FIRE Calculator"
        description="Calculate your FIRE number and see how many years until work becomes optional — enter your expenses, savings, and monthly investment."
        chips={["4% rule FIRE number", "Years to independence", "Savings rate impact"]}
      >
        <CalculatorEngineLoader slug="fire-calculator" afterResults={<InsightsSection slug="fire-calculator" />} />
      </SimpleCalculatorHero>
      <InsightStrip text='Your savings rate matters more than your salary — <span class="font-semibold text-gray-900">saving 50% of income reaches FIRE in ~17 years at any income level.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The math behind financial independence" subtitle="Why FIRE is a savings rate game, not an income game." cards={CONTENT_CARDS} />
      <InsightTable slug="fire-calculator" />
      <SEOTextBlock
        title="How the FIRE Calculator Works"
        formula={`FIRE Number   = Monthly Expenses × 12 × 25
               (4% rule: withdraw 4%/year indefinitely)

Years to FIRE = compound monthly until balance ≥ FIRE Number
Balance(m+1)  = Balance(m) × (1 + r/12) + Monthly Savings`}
        steps={[
          { label: "Enter your monthly expenses", description: "Your current total monthly spending — this determines your FIRE number." },
          { label: "Enter current savings", description: "Total invested assets today (not home equity or cash)." },
          { label: "Set monthly investment", description: "How much you add to investments each month." },
          { label: "Choose expected return", description: "7% is a conservative inflation-adjusted S&P 500 estimate." },
          { label: "Read your FIRE number and timeline", description: "Your target portfolio size and years until you hit it." },
        ]}
        paragraphs={[
          "The FIRE number is 25× annual expenses — the portfolio size at which a 4% withdrawal covers your costs indefinitely based on historical market data.",
          "Years to FIRE is calculated by simulating monthly portfolio growth (contributions + compounding) until the balance reaches your FIRE number.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="Tools for your path to financial independence." items={RELATED_CALCS} />
    </main>
  );
}
