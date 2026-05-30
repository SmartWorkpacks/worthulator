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
  title: "Millionaire Calculator 2026 – Years to $1,000,000",
  description:
    "See exactly how many years until your investments reach $1,000,000. Enter your current savings, monthly investment, and expected return rate.",
  keywords: ["millionaire calculator", "how long to become a millionaire", "when will I be a millionaire", "1 million dollars calculator", "investment growth calculator"],
  alternates: { canonical: "https://worthulator.com/tools/millionaire-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How long does it take to become a millionaire?",
    a: "It depends entirely on your monthly savings and return rate. At $500/month and 7% annual return, it takes about 37 years. At $1,500/month, about 25 years. At $3,000/month, about 18 years. Starting earlier is the single biggest factor.",
  },
  {
    q: "What return rate should I use?",
    a: "7% is a conservative, inflation-adjusted estimate for a diversified S&P 500 index fund over the long term. For nominal (pre-inflation) returns, 9–10% is historically accurate. For bonds or mixed portfolios, 4–6% is more realistic.",
  },
  {
    q: "Is $1 million enough to retire?",
    a: "Using the 4% rule, $1M supports $40,000/year in withdrawals. Whether that's enough depends on your lifestyle and location. In a low-cost area, yes. In a high-cost city, it may not be. Use the FIRE Calculator to find your specific number.",
  },
  {
    q: "Does starting early really make that big a difference?",
    a: "Yes — dramatically. $300/month invested from age 25 at 7% grows to $1M by age 62. Starting at 35 requires $650/month to hit the same target by the same age. A 10-year head start nearly halves the required monthly contribution.",
  },
  {
    q: "What happens after I hit $1 million?",
    a: "Compounding accelerates. The second million typically arrives faster than the first because your base is larger. $1M at 7% grows by $70,000/year just in returns — even without additional contributions. The math gets increasingly in your favour.",
  },
];

const STATS = [
  { stat: "37yr",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Years to $1M at $500/mo and 7% return — starting from zero" },
  { stat: "2×",    color: "text-blue-600",    accent: "bg-blue-500",    label: "Starting at 25 vs 35 can halve the monthly contribution needed to hit $1M" },
  { stat: "$70k",  color: "text-amber-600",   accent: "bg-amber-500",   label: "Annual compound growth on $1M at 7% — even without adding another dollar" },
];

const CONTENT_CARDS = [
  {
    icon: "⏰",
    title: "Time is the real variable",
    body: "At 7% annual return, money doubles every ~10 years. $50k today is $100k in 10 years, $200k in 20, $400k in 30 — without adding a single dollar. The combination of regular contributions and compounding time is how most millionaires are made.",
  },
  {
    icon: "📊",
    title: "The second million comes faster",
    body: "The first million is the hardest. Once you have $1M growing at 7%, you're earning $70,000/year in returns alone. At $2M, that's $140,000/year. The trajectory steepens dramatically once compounding has a large base to work with.",
  },
  {
    icon: "💡",
    title: "Contribution consistency beats market timing",
    body: "Investing $500/month every month — through crashes and rallies — consistently outperforms trying to time the market. Dollar-cost averaging reduces the impact of volatility and removes emotion from the equation.",
  },
];

const RELATED_CALCS = [
  { title: "FIRE Calculator",         description: "Calculate your financial independence number.",          href: "/tools/fire-calculator",            icon: "🔥", accent: "bg-emerald-500/10" },
  { title: "Future Value Calculator", description: "See what any investment grows to over time.",            href: "/tools/future-value-calculator",    icon: "📈", accent: "bg-blue-500/10" },
  { title: "Savings Calculator",      description: "Project savings with compound interest.",                href: "/tools/savings-calculator",         icon: "🏦", accent: "bg-amber-500/10" },
  { title: "Retirement Calculator",   description: "Full retirement projection with income.",                href: "/tools/retirement-calculator",      icon: "🏡", accent: "bg-purple-500/10" },
];

export default function MillionaireCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Millionaire Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate how many years until your investments reach $1,000,000.",
      url: "https://worthulator.com/tools/millionaire-calculator",
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
        eyebrowIcon="💰"
        eyebrowText="Investing · Wealth Building"
        title="Millionaire Calculator"
        description="See exactly how many years until your investments reach $1,000,000 — enter your savings, monthly investment, and expected return."
        chips={["Years to $1M", "Total contributed vs interest", "Return rate impact"]}
      >
        <CalculatorEngineLoader slug="millionaire-calculator" afterResults={<InsightsSection slug="millionaire-calculator" />} />
      </SimpleCalculatorHero>
      <InsightStrip text='The first million is the hardest — after that, compounding accelerates and <span class="font-semibold text-gray-900">the second million arrives far faster.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The path to your first million" subtitle="How compounding and consistency build wealth." cards={CONTENT_CARDS} />
      <InsightTable slug="millionaire-calculator" />
      <SEOTextBlock
        title="How the Millionaire Calculator Works"
        formula={`Compounds monthly until Balance ≥ $1,000,000:

Balance(m+1) = Balance(m) × (1 + r/12) + Monthly Investment

Where r = Annual Return ÷ 100`}
        steps={[
          { label: "Enter current savings", description: "Total invested assets today. Use $0 if starting fresh." },
          { label: "Set monthly investment", description: "How much you'll add each month. Consistency is more important than the amount." },
          { label: "Choose return rate", description: "7% is conservative and inflation-adjusted. Use 9–10% for nominal returns." },
          { label: "Read the result", description: "Years to $1M, total you contributed, and how much comes from investment returns." },
        ]}
        paragraphs={[
          "The calculator simulates monthly portfolio growth by applying a monthly compounding rate and adding your monthly contribution. It runs until the balance hits $1,000,000.",
          "Total contributed is what you personally invested. Interest earned is what the market added. On a 30+ year journey, the market typically contributes more than you do.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="Tools to grow and track your wealth." items={RELATED_CALCS} />
    </main>
  );
}
