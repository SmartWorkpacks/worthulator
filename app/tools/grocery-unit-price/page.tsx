import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Grocery Unit Price Calculator 2026 – Find the Best Deal",
  description:
    "Compare the price per ounce of two grocery items to instantly find out which size or brand gives you the most value for money.",
  keywords: ["unit price calculator", "price per ounce calculator", "grocery unit price", "best value grocery calculator", "price per unit grocery"],
  alternates: { canonical: "https://worthulator.com/tools/grocery-unit-price" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is unit pricing?",
    a: "Unit pricing expresses a product's cost per standard unit (e.g. per ounce, per 100ml, per unit). It allows you to compare different sizes of the same product or similar products across brands on a level playing field. US stores are required to display unit prices in many states, but labelling can be inconsistent.",
  },
  {
    q: "Is the bigger size always cheaper per unit?",
    a: "Usually, but not always. Retailers occasionally price smaller sizes at a lower unit cost — especially when the larger size is overstocked or when they know most buyers won't check. Sales and store-brand options can also flip the equation. Always check the unit price rather than assuming bigger = better value.",
  },
  {
    q: "How do I calculate price per ounce?",
    a: "Price per ounce = Total Price / Size in Ounces. A 16 oz jar at $3.50 costs $3.50 / 16 = $0.219/oz. A 48 oz jar at $8.00 costs $8.00 / 48 = $0.167/oz. The 48 oz jar is 23.7% cheaper per ounce.",
  },
  {
    q: "What units should I use if the product is measured in grams or ml?",
    a: "Use the same unit for both items and the comparison is still valid. If Item A is 400g and Item B is 800g, enter sizes in grams rather than ounces. The calculator compares price-per-unit — as long as both items use the same unit, the result is correct.",
  },
  {
    q: "When is the cheaper per-unit option NOT the right choice?",
    a: "When you won't use it before it expires. Buying a 64 oz jar of mayonnaise at $0.12/oz is only a deal if you'll use 64 oz before it goes bad. For perishables, the effective cost includes waste. The 'cheaper' per-unit option becomes expensive if half of it ends up in the bin.",
  },
];

const STATS = [
  { stat: "÷ size",   color: "text-emerald-600", accent: "bg-emerald-500", label: "The only formula you need: Price ÷ Size = price per unit. This calculator runs it for both items at once." },
  { stat: "~23%",     color: "text-blue-600",    accent: "bg-blue-500",    label: "Typical savings when choosing the larger-format option of common grocery staples" },
  { stat: "Not always",color: "text-amber-600",  accent: "bg-amber-500",   label: "Bigger is not always cheaper per unit — retailers occasionally price smaller sizes more competitively" },
];

const CONTENT_CARDS = [
  {
    icon: "🏷️",
    title: "Shelf labels can be misleading",
    body: "Many grocery store shelf labels display unit prices, but the units aren't always consistent — one product might show price per 100g while the adjacent product shows price per oz. Always calculate from the actual price and weight printed on the package to get a true comparison.",
  },
  {
    icon: "🔄",
    title: "Store brands vs name brands",
    body: "Store-brand products are often 20–40% cheaper per unit than name-brand equivalents. For commodities like flour, rice, tinned tomatoes, and cleaning products, the quality difference is minimal. Unit pricing makes the exact saving visible — so you decide based on data rather than habit.",
  },
  {
    icon: "♻️",
    title: "Account for waste on perishables",
    body: "For fresh produce, dairy, and items with short shelf lives, factor in how much you'll actually use. A 2-litre bottle of juice at $0.04/oz is only a good deal if you'll drink all of it before it expires. For non-perishables (rice, pasta, canned goods, cleaning products), buying in bulk almost always wins.",
  },
];

const RELATED_CALCS = [
  {
    title: "Percentage Calculator",
    description: "Instantly calculate any percentage — discounts, tips, tax.",
    href: "/tools/percentage-of-calculator",
    icon: "🧮",
    accent: "bg-blue-500/10",
  },
  {
    title: "Tip Calculator",
    description: "Calculate the right tip and split a bill fairly.",
    href: "/tools/tip-calculator",
    icon: "🧾",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Laundry Cost Calculator",
    description: "Calculate the true cost per laundry load.",
    href: "/tools/laundry-cost-calculator",
    icon: "🧺",
    accent: "bg-amber-500/10",
  },
  {
    title: "Subscription Auditor",
    description: "Audit your monthly subscriptions and find hidden costs.",
    href: "/tools/subscription-auditor",
    icon: "💸",
    accent: "bg-violet-500/10",
  },
];

export default function GroceryUnitPricePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Grocery Unit Price Calculator",
      applicationCategory: "ShoppingApplication",
      operatingSystem: "Web",
      description: "Compare the price per ounce of two grocery items to find the better value instantly.",
      url: "https://worthulator.com/tools/grocery-unit-price",
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
        eyebrowIcon="🛒"
        eyebrowText="Shopping · Everyday Value"
        title="Grocery Unit Price Calculator"
        description="Enter the price and size of two items to instantly find out which one gives you more for your money — down to the penny per ounce."
        chips={["Price per ounce", "Percentage difference", "Best deal highlighted"]}
      >
        <CalculatorEngineLoader slug="grocery-unit-price" />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Bigger is usually cheaper per unit — but not always. <span class="font-semibold text-gray-900">The only way to know for sure is to calculate it.</span> This takes five seconds.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Stop guessing at the grocery store"
        subtitle="Unit price is the only metric that makes different sizes directly comparable."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Grocery Unit Price Calculator Works"
        formula={`Price per oz (Item A) = Item A Price / Item A Size (oz)
Price per oz (Item B) = Item B Price / Item B Size (oz)

Cheaper = min(Price A, Price B)
Dearer  = max(Price A, Price B)

Savings % = (Dearer − Cheaper) / Cheaper × 100

Example: $3.50 / 16 oz vs $8.00 / 48 oz
  Item A = $3.50 / 16 = $0.219/oz
  Item B = $8.00 / 48 = $0.167/oz  ← better value by 31.3%`}
        steps={[
          { label: "Enter Item A price and size", description: "The standard or smaller size. Price in dollars, size in ounces (or use grams consistently for both)." },
          { label: "Enter Item B price and size", description: "The bulk or larger size. Same unit as Item A — the comparison is unit-agnostic as long as both are the same." },
          { label: "See price per unit for both", description: "Both price-per-oz figures appear side by side. The percentage difference tells you exactly how much cheaper the better option is." },
        ]}
        paragraphs={[
          "The calculation is straightforward: price divided by size gives price per unit. The value is in doing it for both options simultaneously and seeing the percentage difference — which is often larger than expected.",
          "Unit pricing is particularly powerful for staples you buy repeatedly: cooking oil, rice, pasta, cereal, cleaning products, shampoo. Even a 15% per-unit saving on something you buy 20 times a year adds up. Over a full year of grocery shopping, systematic unit price comparison can save $300–$500 for an average household.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for everyday smart spending."
        items={RELATED_CALCS}
      />
    </main>
  );
}
