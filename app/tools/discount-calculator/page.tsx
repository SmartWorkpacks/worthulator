import type { Metadata } from "next";
import DiscountCalculatorLoader from "./DiscountCalculatorLoader";
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
  title: "Discount Calculator 2026 – Find Your Final Price Instantly",
  description:
    "Calculate your final price after any discount — percentage off, fixed amount, or buy-X-get-Y. Add sales tax for a fully accurate checkout total.",
  keywords: ["discount calculator", "percentage off calculator", "sale price calculator", "how much will I save", "shopping discount calculator"],
  alternates: { canonical: "https://worthulator.com/tools/discount-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do I calculate a percentage discount?",
    a: "Multiply the original price by the discount percentage (as a decimal). For example, 20% off $80 = 80 × 0.20 = $16 saved. Your final price is $80 − $16 = $64. This calculator does it instantly.",
  },
  {
    q: "Does tax apply before or after a discount?",
    a: "In most US states and retail scenarios, sales tax is applied to the discounted price, not the original price. So a $100 item at 20% off becomes $80, and then tax (e.g. 8%) is applied to $80 — not $100.",
  },
  {
    q: "How do stacked discounts work?",
    a: "Stacked discounts apply sequentially — not combined. A 20% off sale followed by a 10% coupon means you pay 80% of the original, then 90% of that. That's 72% of the original price — not 70%.",
  },
  {
    q: "What is a Buy X Get Y discount?",
    a: "Buy 3 get 1 free means you get 4 items for the price of 3 — a 25% effective discount per item. The savings depend on how many items are free relative to how many you buy.",
  },
  {
    q: "How do retailers use percentage discounts to anchor perception?",
    a: "A '50% off' label signals a deal regardless of whether the original price was inflated. Studies show consumers often overestimate savings on high-percentage discounts. Always check the final price — not just the percentage.",
  },
];

const STATS = [
  { stat: "20%",    color: "text-emerald-600", accent: "bg-emerald-500", label: "The most common retail discount threshold — psychologically significant for buyers" },
  { stat: "7–10%",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Average US sales tax rate — often forgotten when calculating what you'll actually pay" },
  { stat: "$1,500", color: "text-amber-600",   accent: "bg-amber-500",   label: "Estimated annual savings for shoppers who consistently compare discounted prices" },
];

const CONTENT_CARDS = [
  {
    icon: "🏷️",
    title: "Percentage vs fixed discounts",
    body: "A 20% discount saves more on a $500 item than on a $50 item. A fixed $30 off is better when the percentage would be less. This calculator handles both — use whichever matches your deal.",
  },
  {
    icon: "🧾",
    title: "Tax after discount — not before",
    body: "In most retail scenarios, sales tax is applied to your discounted price. On a $200 item at 25% off, you pay tax on $150 — not $200. That's an extra saving most shoppers miss when calculating the total.",
  },
  {
    icon: "📦",
    title: "Buy X get Y — what's the real saving?",
    body: "Buy 2 get 1 free is a 33.3% effective discount. Buy 3 get 1 free is 25% off. The more free items, the better — but the base price per item matters. This calculator shows the true effective saving percentage.",
  },
];

const RELATED_CALCS = [
  {
    title: "Percentage Increase Calculator",
    description: "Calculate % change, increase, or decrease between any two values.",
    href: "/tools/percentage-increase-calculator",
    icon: "📊",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Margin Calculator",
    description: "Work out profit margin, markup, and selling price.",
    href: "/tools/margin-calculator",
    icon: "💹",
    accent: "bg-blue-500/10",
  },
  {
    title: "Loan Calculator",
    description: "Calculate monthly payments and total interest for any loan.",
    href: "/tools/loan-calculator",
    icon: "🏦",
    accent: "bg-amber-500/10",
  },
  {
    title: "Savings Calculator",
    description: "Project how your savings grow over time.",
    href: "/tools/savings-calculator",
    icon: "💰",
    accent: "bg-purple-500/10",
  },
];

export default function DiscountCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Discount Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate final price after discount with optional sales tax. Supports percentage off, fixed amount, and buy-X-get-Y deals.",
      url: "https://worthulator.com/tools/discount-calculator",
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

      <SimpleCalculatorHero
        eyebrowIcon="%"
        eyebrowText="Shopping · Retail Pricing"
        title="Discount Calculator"
        description="Find your final price after any discount — percentage off, fixed amount, or buy-X-get-Y. Add tax for the exact checkout total."
        chips={["Percentage & fixed discounts", "Buy X get Y", "Sales tax included"]}
      >
        <DiscountCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text='A discount label is only useful if you know <span class="font-semibold text-gray-900">what you actually pay at checkout</span> — after tax.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What this means for your wallet"
        subtitle="Understanding how discounts really work helps you spend smarter."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Discount Calculator Works"
        formula={`Percentage off:
  Final price = Original price × (1 − discount% / 100)

Fixed amount off:
  Final price = Original price − discount amount

Buy X get Y free (per-item effective price):
  Effective price = Original price × (paid items / total items)

With sales tax:
  Total = Final price × (1 + tax% / 100)`}
        steps={[
          { label: "Enter the original price", description: "The listed retail price before any discount is applied." },
          { label: "Choose your discount type", description: "Percentage off (20% sale), fixed amount ($30 coupon), or buy-X-get-Y deals." },
          { label: "Enter the discount value", description: "The percentage, fixed amount, or deal structure depending on your mode." },
          { label: "Add sales tax (optional)", description: "Enter your local tax rate for a fully accurate checkout total. Tax applies to the discounted price." },
          { label: "Read your results", description: "See your final price, how much you save, and the true effective discount percentage." },
        ]}
        paragraphs={[
          "This calculator handles the three most common discount formats used in retail and ecommerce. Sales tax, where entered, is applied to the post-discount price — which is the standard practice in most US states.",
          "For stacked discounts (e.g. a coupon on top of a sale), calculate the first discount, then use the discounted price as the 'original price' in a second calculation.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Tools that complement discount and price calculations."
        items={RELATED_CALCS}
      />
    </main>
  );
}
