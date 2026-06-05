import type { Metadata } from "next";
import { calculateMissedInvestment } from "@/calculations/finance/missedInvestment";
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
  title: "Missed Investment Calculator 2026 – What Could That Purchase Be Worth?",
  description:
    "See what any past purchase would be worth today if you had invested it instead. Enter the amount, years ago, and expected annual return for an instant result.",
  keywords: [
    "missed investment calculator",
    "opportunity cost calculator",
    "what if I invested instead",
    "cost of not investing",
    "investment opportunity cost",
  ],
  alternates: { canonical: "https://worthulator.com/tools/missed-investment" },
  robots: { index: true, follow: true },
};

// ── Step 5c: worked examples derived from the live calculation module ────────
const usd = (n: number) => "$" + Math.round(n).toLocaleString();
const EX_10Y = calculateMissedInvestment({ amount: 1000, yearsAgo: 10, annualReturn: 10 });
const EX_25Y = calculateMissedInvestment({ amount: 1000, yearsAgo: 25, annualReturn: 10 });
const EX_30Y = calculateMissedInvestment({ amount: 1000, yearsAgo: 30, annualReturn: 10 });
const EX_29Y = calculateMissedInvestment({ amount: 1000, yearsAgo: 29, annualReturn: 10 });
const EX_5K40 = calculateMissedInvestment({ amount: 5000, yearsAgo: 40, annualReturn: 7 });
const EX_10K35 = calculateMissedInvestment({ amount: 10000, yearsAgo: 35, annualReturn: 7 });
const YEAR30_GROWTH = EX_30Y.currentValue - EX_29Y.currentValue;

const FAQS = [
  {
    q: "How does the missed investment calculator work?",
    a: `It applies compound interest to any amount over a number of years. The formula is: Future Value = Amount × (1 + rate)^years. A $1,000 purchase 10 years ago at 10% annual return would be ${usd(EX_10Y.currentValue)} today. The difference (${usd(EX_10Y.totalGain)}) is the missed gain.`,
  },
  {
    q: "What annual return should I use?",
    a: "The S&P 500 has averaged ~10% annually over 30+ years (before inflation). Use 7% for a more conservative real-return estimate (adjusted for inflation). Use 12% for aggressive growth assumptions. The calculator defaults to 10% — the most commonly cited benchmark.",
  },
  {
    q: "Does this mean I should never spend money?",
    a: "No — the calculator is a perspective tool, not a guilt machine. Some spending creates real value (education, health, experiences). The goal is to make the opportunity cost visible for discretionary purchases so you can make conscious trade-offs instead of automatic ones.",
  },
  {
    q: "What is opportunity cost in investing?",
    a: `Opportunity cost is the value of the best alternative you didn't choose. Every dollar spent on a depreciating purchase is a dollar not compounding in the market. Over decades, this difference becomes dramatic — a $5,000 purchase at 25 is worth roughly ${usd(EX_5K40.currentValue)} at 65 (at 7% real return).`,
  },
  {
    q: "How do I use this to make better financial decisions?",
    a: "Before any significant discretionary purchase, run it through this calculator with your current age and expected retirement age as the years. The result is the 'true cost' of the purchase in retirement wealth. Many people find this reframes their relationship with impulse spending immediately.",
  },
];

const STATS = [
  { stat: `${Math.floor(EX_25Y.multiplier)}×`, color: "text-emerald-600", accent: "bg-emerald-500", label: `$1,000 invested 25 years ago at 10% annual return is worth ${usd(EX_25Y.currentValue)} today` },
  { stat: "7%",    color: "text-blue-600",    accent: "bg-blue-500",    label: "Inflation-adjusted average real return of the S&P 500 — the conservative benchmark" },
  { stat: `$${Math.round(EX_5K40.currentValue / 1000)}k`, color: "text-amber-600", accent: "bg-amber-500", label: "What a $5,000 impulse purchase at age 25 grows to in retirement wealth by age 65 (7%)" },
];

const CONTENT_CARDS = [
  {
    icon: "⏳",
    title: "Compound interest is ruthlessly asymmetric",
    body: `The first few years of compounding look modest. The last few years are explosive. A $1,000 investment at 10% grows by $100 in year 1, but by ${usd(YEAR30_GROWTH)} in year 30 alone. This is why time in the market matters far more than timing the market — and why early spending is so much more expensive than it looks.`,
  },
  {
    icon: "🎯",
    title: "The latte factor is real — but it's not lattes",
    body: "David Bach's 'latte factor' has been mocked, but the math is right for larger purchases. The $5 coffee matters little. The $1,200 holiday upgrade, the $3,000 car option, the $500/month subscriptions — these are where the real opportunity cost lives. This calculator makes those numbers concrete.",
  },
  {
    icon: "💡",
    title: "Use it forwards, not just backwards",
    body: `Don't just calculate what past purchases cost you — use it before future ones. Enter the purchase amount and your years until retirement. That's the true price tag. A $10,000 car upgrade at age 30 grows to ${usd(EX_10K35.currentValue)} in retirement wealth at a 7% real return over 35 years.`,
  },
];

const RELATED_CALCS = [
  { title: "FIRE Calculator",           description: "Calculate your Financial Independence number.",          href: "/tools/fire-calculator",             icon: "🔥", accent: "bg-emerald-500/10" },
  { title: "Compound Interest Calculator", description: "See how any investment grows over time.",            href: "/tools/compound-interest-calculator", icon: "📈", accent: "bg-blue-500/10" },
  { title: "Future Value Calculator",   description: "Project the future value of any investment.",           href: "/tools/future-value-calculator",      icon: "💰", accent: "bg-amber-500/10" },
  { title: "Savings Calculator",        description: "See how regular savings compound over time.",           href: "/tools/savings-calculator",           icon: "🏦", accent: "bg-purple-500/10" },
];

export default function MissedInvestmentCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Missed Investment Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "See what any past purchase would be worth today if invested in the market instead.",
      url: "https://worthulator.com/tools/missed-investment",
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
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="💸"
        eyebrowText="Decisions · Opportunity Cost"
        title="Missed Investment Calculator"
        description="Enter any past purchase and see what it would be worth today if you had invested it instead — powered by real compound interest math."
        chips={["Worth today", "Total gain missed", "Multiplier on original amount"]}
      >
        <EngineWithInsights slug="missed-investment" />
      </SimpleCalculatorHero>
      <InsightStrip text={`Every dollar spent is a dollar not compounding — <span class="font-semibold text-gray-900">at 10% annual return, $1,000 spent today grows to ${usd(EX_30Y.currentValue)} over 30 years.</span>`} />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid
        title="The real price of every purchase"
        subtitle="What compound interest means for your spending decisions."
        cards={CONTENT_CARDS}
      />
      <SEOTextBlock
        title="How the Missed Investment Calculator Works"
        formula={`Future Value = Amount × (1 + Annual Return)^Years

Total Gain   = Future Value − Original Amount
Multiplier   = Future Value ÷ Original Amount
Monthly Cost = Total Gain ÷ (Years × 12)`}
        steps={[
          { label: "Enter the amount spent", description: "Any past or future purchase — holiday, gadget, subscription, upgrade." },
          { label: "Enter years ago (or years ahead)", description: "How many years since the purchase, or until retirement for forward planning." },
          { label: "Set annual return", description: "10% for S&P 500 historical average. 7% for inflation-adjusted real return. 12% for aggressive assumptions." },
          { label: "Read the result", description: "Current value, total gain missed, multiplier on original amount, and the monthly opportunity cost spread over the period." },
        ]}
        paragraphs={[
          "This calculator uses basic compound interest (no dividends reinvestment or tax adjustments). For a more complete picture of real investment returns, use the Compound Interest Calculator which supports regular contributions.",
          "Past returns don't guarantee future performance. The 10% S&P 500 average is a widely-used benchmark, not a promise. Use 5–7% for more conservative planning.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for investment and compound growth."
        items={RELATED_CALCS}
      />
    </main>
  );
}
