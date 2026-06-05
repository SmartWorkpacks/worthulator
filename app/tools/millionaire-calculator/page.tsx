import type { Metadata } from "next";
import MillionaireWithInsights from "@/components/worthcore/MillionaireWithInsights";
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
  title: "Millionaire Calculator 2026 – Years to $1M (and What It's Worth)",
  description:
    "See how many years until your investments reach $1,000,000 — and what that million will actually be worth after inflation. Uses live CPI data to show the real, today's-dollars value and the extra years for a true million.",
  keywords: ["millionaire calculator", "how long to become a millionaire", "when will I be a millionaire", "is 1 million enough", "1 million dollars inflation", "real value of a million dollars"],
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
    q: "Will $1 million actually be worth $1 million when I get there?",
    a: "No — and this is the part most calculators ignore. Inflation erodes buying power every year. Using the live CPI rate (~3.2%), reaching $1M in about 35 years (the default scenario) leaves you with the buying power of roughly $334,000 in today's money. To bank a million in real, present-day spending power you'd need closer to 62 years at the same contribution — about 27 years longer.",
  },
  {
    q: "Is $1 million enough to retire?",
    a: "Using the 4% rule, $1M supports $40,000/year in withdrawals. But remember that a future million buys less than today's — so the real income is lower in tomorrow's prices. Whether it's enough depends on your lifestyle, location, and timeline. Use the FIRE Calculator to find your specific number.",
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
  { stat: "34.8yr", color: "text-emerald-600", accent: "bg-emerald-500", label: "Years to $1M with the default $10k start, $500/mo and 7% return" },
  { stat: "$334k",  color: "text-rose-600",    accent: "bg-rose-500",    label: "What that future million actually buys in today's money at live CPI inflation" },
  { stat: "78%",    color: "text-amber-600",   accent: "bg-amber-500",   label: "Share of the million built by compound growth, not your own contributions" },
];

const CONTENT_CARDS = [
  {
    icon: "🛡️",
    title: "A future million isn't today's million",
    body: "This is the trap behind every '$1M goal'. At ~3.2% inflation, the million you reach in ~35 years buys what about $334,000 buys now. Banking a million in real, present-day spending power takes closer to 62 years at the same contribution — the goalpost moves while you run.",
  },
  {
    icon: "📊",
    title: "The market does most of the work",
    body: "In the default scenario you contribute about $219,000 of the million — the other ~$781,000 (78%) comes from compound growth. The longer your runway, the larger that share grows, which is why time in the market beats timing the market.",
  },
  {
    icon: "💡",
    title: "Consistency beats market timing",
    body: "Investing $500/month every month — through crashes and rallies — reliably outperforms trying to time the market. And adding just $200/month more reaches the million about 4 years sooner, because the extra contributions compound the whole way.",
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
        description="See how many years until your investments reach $1,000,000 — and what that million will actually be worth after inflation, using live CPI data."
        chips={["Years to $1M", "Real value in today's $", "Years to a real million"]}
      >
        <MillionaireWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text='Hitting $1M is only half the story — <span class="font-semibold text-gray-900">inflation quietly moves the finish line while you run toward it.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The path to your first million" subtitle="How compounding and consistency build wealth." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Millionaire Calculator Works"
        formula={`Compounds monthly until Balance ≥ $1,000,000:
Balance(m+1) = Balance(m) × (1 + r/12) + Monthly Investment

Real value of the million when reached:
Today's $ = $1,000,000 ÷ (1 + inflation)^years

Real million target grows with inflation:
Target(t) = $1,000,000 × (1 + inflation)^t

Where r = Annual Return ÷ 100, inflation = live FRED CPI`}
        steps={[
          { label: "Enter current savings", description: "Total invested assets today. Use $0 if starting fresh." },
          { label: "Set monthly investment", description: "How much you'll add each month. Consistency matters more than the amount — +$200/mo reaches the goal ~4 years sooner." },
          { label: "Choose return rate", description: "7% is a conservative, after-inflation S&P 500 estimate. Use 9–10% for nominal returns." },
          { label: "Read both numbers", description: "Years to a nominal $1M, what it's worth in today's dollars, and how many more years a real million takes." },
        ]}
        paragraphs={[
          "The calculator simulates monthly portfolio growth until the balance hits $1,000,000. With the default $10,000 start, $500/month and 7% return, that takes about 34.8 years — and roughly $781,000 of the million (78%) comes from compound growth, not your own $219,000 of contributions.",
          "Then it does what most calculators won't: it deflates that million by the live FRED CPI rate to show its real buying power. A million 35 years out is worth about $334,000 in today's money. Accumulating a true, present-day million takes closer to 62 years at the same contribution — so the headline number and the real goal can be decades apart.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="Tools to grow and track your wealth." items={RELATED_CALCS} />
    </main>
  );
}
