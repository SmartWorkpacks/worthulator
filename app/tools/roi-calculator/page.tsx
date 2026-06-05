import type { Metadata } from "next";
import ROICalculatorLoader from "./ROICalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "ROI Calculator 2026 – Calculate Real Returns After Fees & Inflation",
  description:
    "Calculate gross ROI, real returns after inflation, fee drag impact, and how your investment compares to the benchmark. Investor-grade analysis in seconds.",
  keywords: ["ROI calculator", "return on investment calculator", "inflation adjusted ROI", "investment return calculator", "CAGR calculator"],
  alternates: { canonical: "https://worthulator.com/tools/roi-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is the difference between ROI and CAGR?",
    a: "ROI is the total percentage gain over the whole holding period. CAGR (Compound Annual Growth Rate) is the annualised version — how much it grew per year, on average. CAGR is more useful for comparing investments held over different time periods.",
  },
  {
    q: "How does inflation affect ROI?",
    a: "Inflation reduces the purchasing power of your gains. A 50% nominal ROI with 3% annual inflation over 10 years translates to a much lower real return — roughly 21% less purchasing power. This calculator shows both so you can see the true impact.",
  },
  {
    q: "What is fee drag and why does it matter so much?",
    a: "Fee drag is the compounded cost of annual fees. A 1% annual fee doesn't just cost you 1% — it costs you the compounded growth that money would have generated. Over 30 years, a 1% fee can reduce your portfolio by 20–25% compared to a 0% fee index fund.",
  },
  {
    q: "What is a nominal vs real return?",
    a: "Nominal return is your raw percentage gain. Real return is adjusted for inflation — it shows how much more you can actually buy. Real return = (1 + nominal rate) / (1 + inflation rate) − 1.",
  },
  {
    q: "Should I compare my returns to a benchmark?",
    a: "Yes. If your investment returns 8% annually but the S&P 500 returned 10%, you underperformed while taking on potentially more risk. Benchmark comparison is how professionals evaluate whether active decisions added value.",
  },
];

const STATS = [
  { stat: "1%",    color: "text-red-600",     accent: "bg-red-500",     label: "Annual fee on a $100k portfolio costs ~$28k over 20 years in lost compound growth" },
  { stat: "2.5%",  color: "text-amber-600",   accent: "bg-amber-500",   label: "Annual inflation quietly erodes purchasing power — a 10% ROI may only be 7.5% real" },
  { stat: "7–10%", color: "text-emerald-600", accent: "bg-emerald-500", label: "Historical S&P 500 annual return — the benchmark most active investors fail to beat" },
];

const CONTENT_CARDS = [
  {
    icon: "🏦",
    title: "The fee drag most investors ignore",
    body: "A 1% annual management fee sounds trivial. Over 20 years on a $100,000 investment at 8% growth, it costs you over $46,000 in lost compound growth. Low-cost index funds exist precisely because this math is brutal over long periods.",
  },
  {
    icon: "📉",
    title: "Inflation: the invisible tax on returns",
    body: "If inflation runs at 3% and your investment returns 6%, your real return is roughly 3% — not 6%. Over a decade, this difference compounds significantly. Any serious ROI analysis must account for inflation.",
  },
  {
    icon: "📊",
    title: "Why most active managers underperform",
    body: "Over 15-year periods, more than 90% of actively managed US large-cap funds underperform their index benchmark net of fees. Benchmark comparison in this calculator shows exactly how much you need to outperform just to justify fees.",
  },
];

const RELATED_CALCS = [
  {
    title: "Future Value Calculator",
    description: "Project what a lump sum or investment grows to over time.",
    href: "/tools/future-value-calculator",
    icon: "📈",
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
    description: "See how inflation erodes purchasing power over time.",
    href: "/tools/inflation-calculator",
    icon: "📉",
    accent: "bg-amber-500/10",
  },
  {
    title: "Compound Interest Calculator",
    description: "See how interest compounds on a lump sum over time.",
    href: "/tools/compound-interest-calculator",
    icon: "📊",
    accent: "bg-purple-500/10",
  },
];

export default function ROICalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "ROI Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate gross ROI, real returns after inflation, fee drag, and benchmark comparison for any investment.",
      url: "https://worthulator.com/tools/roi-calculator",
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
        eyebrowIcon="📈"
        eyebrowText="Investing · Returns Analysis"
        title="ROI Calculator"
        description="Calculate your real return on any investment — after fees, tax, and inflation. See how you compare to the benchmark."
        chips={["Fee drag visualisation", "Inflation-adjusted real ROI", "Benchmark comparison"]}
      >
        <ROICalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Fees and inflation are silent destroyers of wealth. <span class="font-semibold text-gray-900">Your nominal return is almost never your real return.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What smart investors actually measure"
        subtitle="Gross ROI is just the starting point. Real returns tell the full story."
        cards={CONTENT_CARDS}
      />


      <SEOTextBlock
        title="How the ROI Calculator Works"
        formula={`Gross ROI = (Final Value − Total Invested) / Total Invested × 100

CAGR = (Final Value / Total Invested)^(1/years) − 1

Net ROI = After annual fees compounded over holding period, minus tax on gains

Real ROI = Net ROI adjusted for inflation:
  Real Rate = (1 + Net Rate) / (1 + Inflation Rate) − 1`}
        steps={[
          { label: "Enter your initial investment", description: "The capital you put in at the start." },
          { label: "Enter the final value", description: "What the investment is worth now, or what you expect at exit." },
          { label: "Set the holding period", description: "How many years you held or plan to hold the investment." },
          { label: "Add fees and tax", description: "Annual management fee, expense ratio, and estimated capital gains tax rate." },
          { label: "Compare to benchmark", description: "Default is 7% (S&P 500 inflation-adjusted avg). See if your investment beat the index." },
        ]}
        paragraphs={[
          "This calculator models the compound erosion of fees and inflation on your returns — something most ROI tools ignore completely. The line chart shows all four curves simultaneously: gross, net, real, and benchmark. The inflation field defaults to the current US CPI rate from live Federal Reserve (FRED) data, so your real return starts from a current number rather than a stale assumption.",
          "CAGR (Compound Annual Growth Rate) is the most useful single number for comparing investments. A 100% ROI over 10 years is a 7.2% CAGR — very different from a 100% ROI over 2 years (41.4% CAGR). And unlike many calculators, this one shows a genuine negative ROI when your final value is below what you put in — losses aren't quietly rounded up to zero.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Tools that work well alongside ROI analysis."
        items={RELATED_CALCS}
      />
    </main>
  );
}
