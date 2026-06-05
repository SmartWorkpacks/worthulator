import type { Metadata } from "next";
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
import InsightTable from "@/components/insights/InsightTable";

export const metadata: Metadata = {
  title: "Markup Calculator 2026 – Selling Price from Cost & Markup %",
  description:
    "Calculate your selling price, profit, and gross margin from cost and markup percentage. Instant results for any product or service.",
  keywords: ["markup calculator", "selling price calculator", "cost plus markup", "markup to margin", "pricing calculator"],
  alternates: { canonical: "https://worthulator.com/tools/markup-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is markup?",
    a: "Markup is the percentage you add to your cost price to determine your selling price. A 50% markup on a $100 item means you add $50, selling it for $150. It's calculated as (profit ÷ cost) × 100.",
  },
  {
    q: "What is the difference between markup and margin?",
    a: "Markup is profit as a percentage of cost. Margin is profit as a percentage of selling price. A 50% markup = 33.3% margin. A 100% markup = 50% margin. They describe the same profit — just from different perspectives.",
  },
  {
    q: "What is a standard markup percentage?",
    a: "It varies by industry. Retail clothing: 100–300%. Grocery: 15–25%. Restaurants: 200–400% on food. Software: 80–90%+ gross margin. Electronics: 10–30%. There's no universal 'right' markup — it depends on your market and costs.",
  },
  {
    q: "How do I convert markup to margin?",
    a: "Margin = Markup ÷ (1 + Markup). So a 50% markup = 50 ÷ 150 = 33.3% margin. A 100% markup = 100 ÷ 200 = 50% margin. This calculator shows both so you never have to convert manually.",
  },
  {
    q: "Should I use markup or margin to price my products?",
    a: "Either works, but margin is generally preferred in finance and accounting because it shows profitability relative to revenue. Markup is useful for quickly setting prices from cost. Know both and use whichever your industry favours.",
  },
];

const STATS = [
  { stat: "50%",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Common retail markup — but it only produces a 33% gross margin, not 50%" },
  { stat: "100%", color: "text-blue-600",    accent: "bg-blue-500",    label: "Keystone markup used in many retail sectors — doubles the cost price" },
  { stat: "33%",  color: "text-amber-600",   accent: "bg-amber-500",   label: "What a 50% markup actually produces as a profit margin" },
];

const CONTENT_CARDS = [
  {
    icon: "📦",
    title: "The keystone markup rule",
    body: "Many retailers use a 'keystone' markup of 100% — doubling the wholesale cost to get the retail price. This produces a 50% gross margin and has been a retail rule of thumb for decades, though competitive pricing pressure often forces lower markups.",
  },
  {
    icon: "🧮",
    title: "Why the math trips people up",
    body: "A common mistake: setting a 30% markup thinking you have a 30% margin. You don't — you have a 23% margin. Always calculate both and know which one your pricing model targets. Use this calculator to check before setting prices.",
  },
  {
    icon: "📈",
    title: "Margins compound through the supply chain",
    body: "Every step in a supply chain takes a markup. A product that costs $10 to make may be marked up 100% to $20 by the manufacturer, then 50% to $30 by the distributor, then 100% to $60 at retail. Understanding each margin helps you negotiate.",
  },
];

const RELATED_CALCS = [
  { title: "Profit Margin Calculator",   description: "Calculate margin and profit from revenue and cost.",   href: "/tools/profit-margin-calculator",   icon: "📊", accent: "bg-emerald-500/10" },
  { title: "Discount Calculator",        description: "See final price after any discount or sale.",           href: "/tools/discount-calculator",        icon: "🏷️", accent: "bg-blue-500/10" },
  { title: "Sales Tax Calculator",       description: "Add sales tax to any purchase price.",                  href: "/tools/sales-tax-calculator",       icon: "🧾", accent: "bg-amber-500/10" },
  { title: "ROI Calculator",             description: "Calculate return on investment for any project.",       href: "/tools/roi-calculator",             icon: "📈", accent: "bg-purple-500/10" },
];

export default function MarkupCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Markup Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate selling price, profit, and gross margin from cost and markup percentage.",
      url: "https://worthulator.com/tools/markup-calculator",
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
        eyebrowIcon="📦"
        eyebrowText="Business · Pricing"
        title="Markup Calculator"
        description="Enter your cost price and markup percentage to instantly get the selling price, profit, and gross margin."
        chips={["Selling price", "Profit per unit", "Gross margin %"]}
      >
        <EngineWithInsights slug="markup-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text='A 50% markup is NOT a 50% margin — <span class="font-semibold text-gray-900">knowing the difference could be the most valuable thing you learn about pricing today.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Markup, margin, and pricing strategy" subtitle="The numbers behind every price tag." cards={CONTENT_CARDS}
      />

      <InsightTable slug="markup-calculator" />
      <SEOTextBlock
        title="How the Markup Calculator Works"
        formula={`Selling Price  = Cost × (1 + Markup% ÷ 100)
Profit         = Selling Price − Cost
Gross Margin % = (Profit ÷ Selling Price) × 100`}
        steps={[
          { label: "Enter your cost price", description: "What you pay to produce, buy, or deliver the item." },
          { label: "Set your markup percentage", description: "Use a preset or slide to any value. Retail typically uses 50–100%." },
          { label: "Read the results", description: "Selling price, profit per unit, and the resulting gross margin percentage." },
        ]}
        paragraphs={[
          "Markup is applied to cost to determine selling price. It's the most common way to set prices from a cost-based perspective.",
          "Note that this produces a lower margin percentage than the markup percentage. To achieve a target margin, use the Profit Margin Calculator in reverse — or simply run scenarios here until the margin % hits your target.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More pricing and business tools." items={RELATED_CALCS} />
    </main>
  );
}
