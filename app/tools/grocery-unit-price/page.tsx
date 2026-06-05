import type { Metadata } from "next";
import GroceryUnitPriceWithInsights from "@/components/worthcore/GroceryUnitPriceWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Grocery Unit Price Calculator 2026 – Find the Best Deal",
  description:
    "Compare the price per ounce of two grocery items to find the better value — and see how much choosing it consistently saves you per year.",
  keywords: ["unit price calculator", "price per ounce calculator", "grocery unit price", "best value grocery calculator", "price per unit grocery"],
  alternates: { canonical: "https://worthulator.com/tools/grocery-unit-price" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do I calculate price per ounce?",
    a: "Price ÷ Size = price per unit. A 16 oz jar at $3.50 = $3.50 ÷ 16 = $0.219/oz. A 48 oz jar at $8.00 = $8.00 ÷ 48 = $0.167/oz. Item B is 23.8% cheaper per ounce. This calculator does both at once and shows the annual impact.",
  },
  {
    q: "Is the bigger size always cheaper per unit?",
    a: "Usually, but not always. Retailers occasionally price smaller sizes more competitively — especially during sales, clearance, or when overstocked on bulk sizes. The calculator flags this 'bulk trap' when it detects the smaller item winning.",
  },
  {
    q: "Why does the calculator ask how often I buy this product?",
    a: "Because that's what turns a per-ounce difference into real money. A $0.052/oz saving on an item you buy 24 times a year (every other week) saves ~$60/year on that single product. Apply that discipline to 10 staples and it's $600/year.",
  },
  {
    q: "What units should I use if my product is in grams or ml?",
    a: "Use the same unit for both items and the comparison works. If Item A is 400g and Item B is 800g, enter sizes in grams. The calculator compares price-per-unit — as long as both use the same unit, the result is accurate.",
  },
  {
    q: "When is the cheaper per-unit option NOT the right choice?",
    a: "When you won't use it before it expires. A 64 oz jar at $0.12/oz is only a deal if you consume all 64 oz. For perishables, the effective cost includes waste — the smaller option can be the smarter buy even at a higher unit price.",
  },
];

const STATS = [
  { stat: "23.8%",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Unit price difference between a 16 oz ($3.50) and 48 oz ($8.00) jar — the bulk option wins" },
  { stat: "$60/yr", color: "text-blue-600",    accent: "bg-blue-500",    label: "Annual saving from choosing the cheaper unit-price option 24 times/year on one product" },
  { stat: "$600",   color: "text-amber-600",   accent: "bg-amber-500",   label: "Apply unit-price discipline across 10 grocery staples and the annual saving compounds" },
];

const CONTENT_CARDS = [
  {
    icon: "🏷️",
    title: "Shelf labels are inconsistent",
    body: "Store shelf tags sometimes show price per ounce, sometimes per 100g, sometimes per count. They're not always comparable. This calculator normalises both items to the same unit so the comparison is fair every time.",
  },
  {
    icon: "📦",
    title: "Bulk isn't always better",
    body: "Retailers know most shoppers assume bigger = cheaper. But sales, store-brand promotions, and seasonal pricing can flip the equation. The calculator flags when the smaller item is the better deal — a more common result than you'd expect.",
  },
  {
    icon: "🔄",
    title: "Frequency is the hidden multiplier",
    body: "A $0.05/oz saving sounds tiny. But on a 48 oz product you buy every other week, that's $60/year on a single item. Across 10 staples you buy regularly, systematic unit-price comparison saves $400–$600/year — serious grocery budget money.",
  },
];

const RELATED_CALCS = [
  { title: "Subscription Auditor",      description: "Audit your monthly subscriptions and find hidden costs.", href: "/tools/subscription-auditor",        icon: "💸", accent: "bg-blue-500/10" },
  { title: "Laundry Cost Calculator",   description: "See the true cost per laundry load.",                    href: "/tools/laundry-cost-calculator",      icon: "🧺", accent: "bg-emerald-500/10" },
  { title: "Latte Factor Calculator",   description: "See what daily habits cost you over time.",              href: "/tools/latte-factor",                 icon: "☕", accent: "bg-amber-500/10" },
  { title: "Tip Calculator",            description: "Calculate the right tip and split any bill.",            href: "/tools/tip-calculator",               icon: "🧾", accent: "bg-violet-500/10" },
];

export default function GroceryUnitPricePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Grocery Unit Price Calculator",
      applicationCategory: "ShoppingApplication",
      operatingSystem: "Web",
      description: "Compare two grocery items by price per unit and see annual savings from choosing the better deal.",
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
        description="Enter the price and size of two items, plus how often you buy them, to see which is the better deal per unit — and how much choosing it consistently saves you per year."
        chips={["Price per unit comparison", "Annual savings", "Bulk trap detector"]}
      >
        <GroceryUnitPriceWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text='A $0.05/oz saving sounds tiny — but on a product you buy 24 times a year, <span class="font-semibold text-gray-900">that&apos;s $60/year on a single item.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Stop guessing at the grocery store"
        subtitle="Unit price + purchase frequency = real annual savings."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Grocery Unit Price Calculator Works"
        formula={`Unit Price A = Item A Price ÷ Item A Size
Unit Price B = Item B Price ÷ Item B Size

Savings %    = (Dearer − Cheaper) ÷ Dearer × 100
Savings/Unit = Dearer − Cheaper

Annual Savings = Savings/Unit × Winner Size × Purchases/Year

Example: $3.50 / 16 oz vs $8.00 / 48 oz, bought 24×/yr
  A = $0.219/oz, B = $0.167/oz → B is 23.8% cheaper
  Saving: $0.052/oz × 48 oz × 24 = $60/year`}
        steps={[
          { label: "Enter Item A price and size", description: "The standard or smaller option. Price in dollars, size in ounces (or grams — just be consistent)." },
          { label: "Enter Item B price and size", description: "The bulk or alternative option. Same unit as Item A." },
          { label: "Set purchases per year", description: "How often you buy this product. 24 is about every other week — adjust for your actual shopping frequency." },
          { label: "See per-unit price + annual savings", description: "Both unit prices side by side, the percentage gap, and the dollar amount you save annually by always choosing the winner." },
        ]}
        paragraphs={[
          "The math is simple — price divided by size — but the value is in seeing both items side by side with the percentage gap and especially the annual impact. Most unit-price calculators stop at the per-ounce comparison. This one multiplies through your purchase frequency to show you the real-world dollar figure.",
          "The calculator also flags the 'bulk trap' — when the smaller item is actually cheaper per unit. This happens more often than most shoppers expect, especially during sales and with store-brand pricing. Across 10 staples you buy regularly, systematic unit-price comparison saves $400–$600/year for an average household.",
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
