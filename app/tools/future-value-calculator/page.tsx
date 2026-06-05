import type { Metadata } from "next";
import FutureValueWithInsights from "@/components/worthcore/FutureValueWithInsights";
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
  title: "Future Value Calculator 2026 – Nominal + Inflation-Adjusted Growth",
  description:
    "See what your investment grows to with compound interest and monthly contributions — plus what it actually buys in today's dollars, deflated by the live FRED CPI inflation rate.",
  keywords: [
    "future value calculator",
    "compound interest calculator",
    "investment growth calculator",
    "inflation adjusted future value",
    "real return calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/future-value-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is future value?",
    a: "Future value is what a sum of money today will be worth at a specific point in the future, assuming it grows at a given rate. This calculator accounts for both your initial deposit and your regular monthly contributions, compounded monthly.",
  },
  {
    q: "How does compound interest work?",
    a: "Compound interest means you earn returns on your returns. Each month your balance grows, and the next month's growth is calculated on that larger balance. Over decades this becomes exponential — with $10,000 plus $500/month at 7% for 20 years, about 57% of the final $300,851 balance is growth you never deposited.",
  },
  {
    q: "What return rate should I use?",
    a: "The S&P 500 has returned roughly 10% per year nominally over the long run (about 7% after inflation). Use ~7% for a conservative real-terms estimate, 9–10% for nominal projections, or a lower rate (2–5%) for bonds and savings accounts.",
  },
  {
    q: "Does this include inflation?",
    a: "Yes. Alongside the nominal future value, the calculator shows the result in today's dollars — it deflates the nominal balance by the live FRED CPI inflation rate over your horizon. At 3.2% inflation, a nominal $300,851 in 20 years buys what about $160,235 buys today.",
  },
  {
    q: "Why does the monthly contribution matter so much?",
    a: "Regular contributions compound alongside your lump sum. $200/month at 7% for 30 years grows to roughly $244,000 from just $72,000 contributed — more than 70% of the final balance is compound growth. Consistency over a long horizon beats a large one-time deposit.",
  },
];

const STATS = [
  { stat: "2.3×",  color: "text-emerald-600", accent: "bg-emerald-500", label: "$130k invested ($10k + $500/mo) grows to $300,851 at 7% over 20 years" },
  { stat: "57%",   color: "text-blue-600",    accent: "bg-blue-500",    label: "of that final balance is pure compound growth — money you never deposited" },
  { stat: "$160k", color: "text-amber-600",   accent: "bg-amber-500",   label: "what that $300,851 actually buys in today's dollars after live CPI inflation" },
];

const CONTENT_CARDS = [
  {
    icon: "📈",
    title: "The power of compounding",
    body: "Compound growth is exponential, not linear. Early years barely move the needle; by year 20–30 the growth dwarfs your contributions. In the default scenario the final year alone adds about $20,000 of growth — more than three years of deposits.",
  },
  {
    icon: "🪙",
    title: "Nominal vs. today's dollars",
    body: "A big future number is misleading if you ignore inflation. We deflate the nominal balance by the live FRED CPI rate so you see real buying power — at 3.2% inflation, $300,851 in 20 years is worth about $160,235 in today's money.",
  },
  {
    icon: "📅",
    title: "Starting early vs starting late",
    body: "Time matters more than amount. At 7%, money doubles roughly every 10 years — so one extra year on the front end is worth far more than a bigger deposit. Delaying the start costs you the most valuable, fully-compounded years.",
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
    title: "Inflation Impact Calculator",
    description: "See how rising prices erode purchasing power over time.",
    href: "/tools/inflation-impact-calculator",
    icon: "📉",
    accent: "bg-amber-500/10",
  },
  {
    title: "Savings Goal Calculator",
    description: "Work out the monthly deposit to hit a target by a date.",
    href: "/tools/savings-goal-calculator",
    icon: "🎯",
    accent: "bg-blue-500/10",
  },
  {
    title: "FIRE Calculator",
    description: "Project your financial-independence number and timeline.",
    href: "/tools/fire-calculator",
    icon: "🔥",
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
      description:
        "Calculate the future value of an investment with compound interest and monthly contributions, plus the inflation-adjusted value in today's dollars using the live FRED CPI rate.",
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
        description="See what your money grows to with compound interest and monthly contributions — then what it actually buys in today's dollars, adjusted for live inflation."
        chips={["Monthly compounding", "Inflation-adjusted real value", "Contributions vs growth split"]}
      >
        <FutureValueWithInsights />
      </SimpleCalculatorHero>

      {/* INSIGHT STRIP */}
      <InsightStrip
        text='A big future balance only matters in <span class="font-semibold text-gray-900">today&apos;s dollars</span> — so we show both the nominal total and its real buying power after live inflation.'
      />

      {/* STAT CHIPS */}
      <StatChipsRow stats={STATS} />

      {/* CONTENT CARDS */}
      <ContentCardGrid
        title="What this means for your money"
        subtitle="Compound interest rewards patience — and inflation quietly taxes the headline number."
        cards={CONTENT_CARDS}
      />

      {/* HOW IT WORKS + FORMULA */}
      <SEOTextBlock
        title="How the Future Value Calculator Works"
        formula={`FV = PV × (1 + r)ⁿ + PMT × (((1 + r)ⁿ − 1) / r)

Real FV = FV ÷ (1 + i)^years

Where:
  PV  = Initial deposit (present value)
  PMT = Monthly contribution
  r   = Monthly return rate (annual rate ÷ 12)
  n   = Total months (years × 12)
  i   = Annual inflation (live FRED CPI)`}
        steps={[
          { label: "Enter your initial deposit", description: "The lump sum you're starting with — can be $0 if you're starting fresh." },
          { label: "Set monthly contributions", description: "How much you add each month. Even $50/mo compounds significantly over decades." },
          { label: "Choose your return rate", description: "Expected annual return. ~7% is a conservative real estimate; ~10% is the S&P long-run nominal average." },
          { label: "Pick your time horizon", description: "How many years the money grows. Longer horizons multiply the result exponentially." },
          { label: "Read both numbers", description: "Your nominal future value and its value in today's dollars, deflated by the live CPI inflation rate." },
        ]}
        paragraphs={[
          "This calculator uses the standard future-value formula with monthly compounding: contributions are added at the end of each month and the whole balance grows at your annual rate divided by 12.",
          "Crucially, it doesn't stop at the nominal number. It deflates the result by the live FRED Consumer Price Index inflation rate over your horizon, so you see what the balance is actually worth in today's purchasing power — the figure that determines what your money can buy.",
          "Historical context: the S&P 500 has averaged roughly 10% nominal (about 7% after inflation) over the long run, and US prices have risen ~3.3% per year on average since 1914. We pull the current CPI live so the inflation adjustment reflects today's economy, not a stale assumption.",
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
