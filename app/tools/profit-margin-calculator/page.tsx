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
  title: "Profit Margin Calculator 2026 – Gross Profit & Margin %",
  description:
    "Calculate gross profit, margin percentage, and markup from revenue and cost. Instant results for any business or product.",
  keywords: ["profit margin calculator", "gross profit calculator", "margin percentage calculator", "markup vs margin", "business profit calculator"],
  alternates: { canonical: "https://worthulator.com/tools/profit-margin-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is gross profit margin?",
    a: "Gross profit margin is the percentage of revenue left after subtracting the cost of goods sold (COGS). A 30% margin means you keep $0.30 of every $1 of revenue after covering direct costs.",
  },
  {
    q: "What is the difference between margin and markup?",
    a: "Margin is profit as a percentage of selling price. Markup is profit as a percentage of cost. A product that costs $70 and sells for $100 has a 30% margin but a 43% markup. They're measuring the same profit from different reference points.",
  },
  {
    q: "What is a good profit margin?",
    a: "It depends heavily on the industry. Software and SaaS: 60–80%. Retail: 20–50%. Restaurants: 3–9%. Manufacturing: 5–20%. High margins aren't always better — some industries operate profitably on thin margins with high volume.",
  },
  {
    q: "What is the difference between gross and net margin?",
    a: "Gross margin only subtracts COGS from revenue. Net margin subtracts all expenses — COGS, operating costs, taxes, and interest. This calculator computes gross margin. Net margin requires your full income statement.",
  },
  {
    q: "How do I improve my profit margin?",
    a: "Two levers: increase revenue (raise prices, sell more) or decrease costs (negotiate supplier rates, improve efficiency). Pricing is usually the faster lever — even a 1% price increase has a bigger margin impact than most cost cuts.",
  },
];

const STATS = [
  { stat: "30%",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Gross margin target for healthy product-based businesses" },
  { stat: "≠",    color: "text-blue-600",    accent: "bg-blue-500",    label: "Margin and markup are NOT the same — a 50% markup is only a 33% margin" },
  { stat: "1%",   color: "text-amber-600",   accent: "bg-amber-500",   label: "Price increase typically improves profit more than an equivalent cost cut" },
];

const CONTENT_CARDS = [
  {
    icon: "📊",
    title: "Margin vs markup confusion costs money",
    body: "Many business owners confuse margin and markup. Setting a 50% markup thinking you have a 50% margin leaves you significantly short. Always know which metric you're using when setting prices.",
  },
  {
    icon: "💸",
    title: "Pricing is your biggest lever",
    body: "A 1% price increase on $1M revenue is $10,000 in pure profit — no extra cost. A 1% cost reduction on 70% COGS only saves $7,000. Pricing has more leverage than most businesses realise.",
  },
  {
    icon: "🏭",
    title: "Industry benchmarks matter",
    body: "A 5% margin in grocery is excellent. A 5% margin in software is catastrophic. Always benchmark your margin against your specific industry, not a generic target. What's healthy varies enormously.",
  },
];

const RELATED_CALCS = [
  { title: "Markup Calculator",       description: "Calculate selling price from cost and markup %.",     href: "/tools/markup-calculator",          icon: "📦", accent: "bg-emerald-500/10" },
  { title: "ROI Calculator",          description: "Calculate return on any investment or project.",      href: "/tools/roi-calculator",             icon: "📈", accent: "bg-blue-500/10" },
  { title: "Sales Tax Calculator",    description: "Calculate tax amount and total price instantly.",     href: "/tools/sales-tax-calculator",       icon: "🧾", accent: "bg-amber-500/10" },
  { title: "Discount Calculator",     description: "Calculate final price after any discount.",           href: "/tools/discount-calculator",        icon: "🏷️", accent: "bg-purple-500/10" },
];

export default function ProfitMarginCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Profit Margin Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate gross profit, margin percentage, and markup from revenue and cost.",
      url: "https://worthulator.com/tools/profit-margin-calculator",
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
        eyebrowIcon="📊"
        eyebrowText="Business · Pricing"
        title="Profit Margin Calculator"
        description="Enter your revenue and cost to instantly see gross profit, margin percentage, and markup."
        chips={["Gross profit", "Margin %", "Markup %"]}
      >
        <CalculatorEngineLoader slug="profit-margin" />
      </SimpleCalculatorHero>
      <InsightStrip text='Margin and markup are not the same thing — <span class="font-semibold text-gray-900">confusing them is one of the most common pricing mistakes in business.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Pricing and margin — what really matters" subtitle="The numbers behind every profitable business." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Profit Margin Calculator Works"
        formula={`Gross Profit   = Revenue − Cost
Margin %       = (Gross Profit ÷ Revenue) × 100
Markup %       = (Gross Profit ÷ Cost) × 100`}
        steps={[
          { label: "Enter your revenue", description: "Total sales revenue — what customers paid." },
          { label: "Enter your cost", description: "Cost of goods sold (COGS) — direct costs to produce or deliver." },
          { label: "Read the output", description: "Gross profit in dollars, margin as % of revenue, markup as % of cost." },
        ]}
        paragraphs={[
          "This calculator computes gross margin — it only accounts for direct costs (COGS), not operating expenses, taxes, or overheads. For net margin, you'd need to subtract all business costs.",
          "Margin and markup are both based on the same gross profit figure but divide by different denominators. Margin divides by selling price; markup divides by cost. A 50% markup equals a 33.3% margin.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More business and pricing tools." items={RELATED_CALCS} />
    </main>
  );
}
