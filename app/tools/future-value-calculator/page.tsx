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
  title: "Future Value Calculator 2026 – See What Your Money Grows To",
  description:
    "See exactly what your investment is worth in 10, 20, or 30 years. Enter your initial deposit, monthly contributions, and expected return rate for an instant compound interest projection.",
  keywords: ["future value calculator", "compound interest calculator", "investment growth calculator"],
  alternates: { canonical: "https://worthulator.com/tools/future-value-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is future value?",
    a: "Future value is what a sum of money today will be worth at a specific point in the future, assuming it grows at a given rate. It accounts for both your initial deposit and any regular contributions.",
  },
  {
    q: "How does compound interest work?",
    a: "Compound interest means you earn interest on your interest. Each month, your balance grows — and the next month's interest is calculated on that larger balance. Over decades, this creates exponential growth.",
  },
  {
    q: "What return rate should I use?",
    a: "The US stock market (S&P 500) has returned roughly 7–10% per year on average historically (7% inflation-adjusted). Use a lower rate for bonds or savings accounts, higher for more aggressive assumptions.",
  },
  {
    q: "Does this include inflation?",
    a: "No — this calculator shows nominal future value. To get real (inflation-adjusted) future value, subtract roughly 2–3% from your expected return rate before calculating.",
  },
  {
    q: "Why does monthly contribution matter so much?",
    a: "Even a small regular contribution compounds dramatically over time. $200/mo at 7% for 30 years grows to over $240,000 — compared to $0 with no contributions on the same initial deposit.",
  },
];

const STATS = [
  { stat: "10×",     color: "text-emerald-600", accent: "bg-emerald-500", label: "$10k at 7% for 30 years grows to over $100,000 — purely from compounding" },
  { stat: "50%+",    color: "text-blue-600",    accent: "bg-blue-500",    label: "of your final balance typically comes from compound interest, not contributions" },
  { stat: "Month 1", color: "text-amber-600",   accent: "bg-amber-500",   label: "is the best time to start — every month of delay costs you exponential growth" },
];

const CONTENT_CARDS = [
  {
    icon: "📈",
    title: "The power of compounding",
    body: "Compound interest grows exponentially — not linearly. In the first years you barely notice. By year 20–30, your interest is earning more than your contributions. Time in the market is everything.",
  },
  {
    icon: "📅",
    title: "Starting early vs starting late",
    body: "Someone who invests $200/mo from age 25 to 65 ends up with roughly twice as much as someone who starts at 35, even though they invested for 10 fewer years. The difference is compounding time.",
  },
  {
    icon: "⚖️",
    title: "Return rate vs contribution rate",
    body: "Increasing your monthly contribution by $100 often has more impact than chasing an extra 1% return. Both matter — but contributions are within your control in a way that market returns are not.",
  },
];

const RELATED_CALCS = [
  {
    title: "Compound Interest Calculator",
    description: "See how interest compounds on a lump sum over time.",
    href: "/tools/compound-interest-calculator",
    icon: "📊",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Investment Calculator",
    description: "Model portfolio growth with regular contributions.",
    href: "/tools/investment-calculator",
    icon: "💼",
    accent: "bg-blue-500/10",
  },
  {
    title: "Inflation Calculator",
    description: "Understand what your money will really be worth.",
    href: "/tools/inflation-calculator",
    icon: "📉",
    accent: "bg-amber-500/10",
  },
  {
    title: "Retirement Calculator",
    description: "Project savings, income, and retirement readiness.",
    href: "/tools/retirement-calculator",
    icon: "🏡",
    accent: "bg-purple-500/10",
  },
];

export default function FutureValuePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Future Value Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the future value of an investment with compound interest and regular contributions.",
      url: "https://worthulator.com/tools/future-value-calculator",
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

      {/* HERO + CALCULATOR */}
      <SimpleCalculatorHero
        eyebrowIcon="$"
        eyebrowText="Investing · Compound Growth"
        title="Future Value Calculator"
        description="See exactly what your money grows to — enter your deposit, monthly contributions, and expected return rate."
        chips={["Monthly compounding", "Interest vs contributions split", "What-if scenarios"]}
      >
        <CalculatorEngineLoader slug="future-value" />
      </SimpleCalculatorHero>

      {/* INSIGHT STRIP */}
      <InsightStrip
        text='Money invested today is worth more than the same money invested tomorrow — because it has more time to <span class="font-semibold text-gray-900">compound and grow</span>.'
      />

      {/* STAT CHIPS */}
      <StatChipsRow stats={STATS} />

      {/* CONTENT CARDS */}
      <ContentCardGrid
        title="What this means for your money"
        subtitle="Compound interest rewards patience above almost everything else."
        cards={CONTENT_CARDS}
      />

      {/* HOW IT WORKS + FORMULA */}
      <SEOTextBlock
        title="How the Future Value Calculator Works"
        formula={`FV = PV × (1 + r)ⁿ + PMT × (((1 + r)ⁿ − 1) / r)

Where:
  PV  = Initial deposit (present value)
  PMT = Monthly contribution
  r   = Monthly interest rate (annual rate ÷ 12)
  n   = Total months (years × 12)`}
        steps={[
          { label: "Enter your initial deposit", description: "The lump sum you're starting with — can be $0 if you're starting fresh." },
          { label: "Set monthly contributions", description: "How much you plan to add each month. Even $50/mo compounds significantly." },
          { label: "Choose your return rate", description: "The expected annual return. Use 7% for a conservative inflation-adjusted estimate." },
          { label: "Pick your time horizon", description: "How many years you'll let the money grow. Longer = exponentially more." },
          { label: "Read the result", description: "Your final balance, total interest earned, and contributions vs. growth split." },
        ]}
        paragraphs={[
          "This calculator uses the standard compound interest formula with monthly compounding. The return rate you enter is applied as an annual rate, divided by 12 for monthly calculations.",
          "Historical averages for diversified equity portfolios range from 7–10% annually. Use 7% for a conservative inflation-adjusted estimate (real return), or 9–10% for nominal (pre-inflation) projections.",
        ]}
      />

      {/* FAQ */}
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      {/* RELATED CALCULATORS */}
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Explore tools that work well alongside future value planning."
        items={RELATED_CALCS}
      />
    </main>
  );
}
