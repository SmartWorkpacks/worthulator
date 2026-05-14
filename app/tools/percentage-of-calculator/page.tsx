import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Percentage Calculator 2026 – What is X% of Y?",
  description:
    "Instantly calculate any percentage: X% of a number, the remainder after a percentage is removed, and the total after adding a percentage. Free, instant, no login.",
  keywords: ["percentage calculator", "what is x percent of y", "percent of a number", "calculate percentage", "percent calculator"],
  alternates: { canonical: "https://worthulator.com/tools/percentage-of-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do you calculate X% of a number?",
    a: "Multiply the number by the percentage and divide by 100. For example, 20% of 500 = 500 × 20 / 100 = 100. Or just move the decimal: 20% = 0.20, so 500 × 0.20 = 100. The calculator does this instantly as you adjust the sliders.",
  },
  {
    q: "What is 15% of 200?",
    a: "15% of 200 = 200 × 0.15 = 30. After subtracting 15%: 200 − 30 = 170 (e.g. a discounted price). After adding 15%: 200 + 30 = 230 (e.g. a price with tax or tip added).",
  },
  {
    q: "How is this different from a percentage increase calculator?",
    a: "This calculator answers 'what is X% of Y' and shows you the result, remainder (Y minus X%), and total (Y plus X%). A percentage increase calculator answers 'by what percentage did a number change from A to B.' Both are common use cases — the tools are complementary.",
  },
  {
    q: "When would I use 'value minus percentage'?",
    a: "Use the remainder (value − X%) for discounts, markdowns, and sale prices. If a $250 jacket is 30% off, the sale price is 250 − 75 = $175. The 'remainder' output shows this directly.",
  },
  {
    q: "When would I use 'value plus percentage'?",
    a: "Use the 'value + percentage' output for calculating totals with tax, tip, or markup. If a restaurant bill is $80 and you're adding a 20% tip, the total is 80 + 16 = $96. The added-value output handles this in one step.",
  },
];

const STATS = [
  { stat: "÷ 100",   color: "text-emerald-600", accent: "bg-emerald-500", label: "The core operation: multiply by the percentage, then divide by 100 — or multiply by the decimal equivalent" },
  { stat: "3 results",color: "text-blue-600",    accent: "bg-blue-500",    label: "X% of Y, the value minus X%, and the value plus X% — three common real-world calculations at once" },
  { stat: "Instant",  color: "text-amber-600",   accent: "bg-amber-500",   label: "Recalculates as you move the sliders — no button to press, no equals to hit" },
];

const CONTENT_CARDS = [
  {
    icon: "🏷️",
    title: "Sale price in one step",
    body: "Set the percentage to the discount (e.g. 25%) and the value to the original price. The 'remainder' output is your sale price — no mental arithmetic needed. Works for any discount: 10% off, 30% off, 50% off.",
  },
  {
    icon: "🧾",
    title: "Price with tax or tip",
    body: "Set the percentage to your tax rate or tip (e.g. 20%) and the value to the bill amount. The 'value + percentage' output is your total including the addition. Handy for restaurant bills, invoice taxes, and contractor markups.",
  },
  {
    icon: "📊",
    title: "Quick commission and markup",
    body: "Sales reps, freelancers, and retailers all work with percentages constantly — commission on a deal, markup on a cost price, agency fee on a media buy. This calculator handles any of those in under five seconds.",
  },
];

const RELATED_CALCS = [
  {
    title: "Percentage Increase Calculator",
    description: "Calculate the percentage change between two numbers.",
    href: "/tools/percentage-increase-calculator",
    icon: "📈",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Tip Calculator",
    description: "Split a bill and calculate the right tip amount.",
    href: "/tools/tip-calculator",
    icon: "🧾",
    accent: "bg-amber-500/10",
  },
  {
    title: "Grocery Unit Price Calculator",
    description: "Find the best-value size or brand by price per ounce.",
    href: "/tools/grocery-unit-price",
    icon: "🛒",
    accent: "bg-blue-500/10",
  },
  {
    title: "Discount Calculator",
    description: "Calculate final price after any discount or markup.",
    href: "/tools/discount-calculator",
    icon: "🏷️",
    accent: "bg-violet-500/10",
  },
];

export default function PercentageOfCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Percentage Calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description: "Calculate X% of any number, the remainder after removing a percentage, and the total after adding a percentage.",
      url: "https://worthulator.com/tools/percentage-of-calculator",
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
        eyebrowIcon="🧮"
        eyebrowText="Math · Everyday Calculations"
        title="Percentage Calculator"
        description="Instantly calculate X% of any number — plus the discounted value and the total with percentage added. Three results, zero effort."
        chips={["X% of Y", "Value minus percentage", "Value plus percentage"]}
      >
        <CalculatorEngineLoader slug="percentage-of-calculator" />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Whether it&apos;s a discount, a tip, or a tax — <span class="font-semibold text-gray-900">percentage math is the same three operations every time.</span> Adjust the sliders and all three appear instantly.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Three percentage calculations you use every day"
        subtitle="Discounts, tips, tax — all the same math, shown all at once."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Percentage Calculator Works"
        formula={`Result     = (Percentage / 100) × Value
Remainder  = Value − Result      (value after subtracting X%)
Added Total = Value + Result      (value after adding X%)

Example: 20% of $500
  Result      = (20 / 100) × 500 = $100
  Remainder   = $500 − $100 = $400   ← sale price after 20% off
  Added Total = $500 + $100 = $600   ← price with 20% added`}
        steps={[
          { label: "Set the percentage", description: "Drag the slider or use the quick-pick buttons — 5%, 10%, 15%, 20%, 25%, 50% are one tap." },
          { label: "Set the value", description: "The base number you want to take a percentage of. Could be a price, a salary, a budget, or any quantity." },
          { label: "Read all three outputs", description: "X% of the value · the value minus X% · the value plus X% — all update instantly." },
        ]}
        paragraphs={[
          "Percentage calculations underlie almost every financial decision: discounts, tax rates, tips, interest rates, markups, commission. This calculator surfaces the three most useful outputs from a single percentage — so you can see the discount, the sale price, and the marked-up price in one view.",
          "Use it for restaurant tips, VAT or sales tax, sale-price calculations, contractor markup checks, commission estimates, or any time someone quotes you a percentage and you want to know what the actual number is.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for fast everyday maths."
        items={RELATED_CALCS}
      />
    </main>
  );
}
