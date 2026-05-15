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
  title: "Wedding Cost Calculator 2026 – Estimate Your Total Wedding Budget",
  description:
    "Estimate the total cost of your wedding by entering guest count, catering, venue, photography, and extras. See your all-in cost per guest instantly.",
  keywords: ["wedding cost calculator", "how much does a wedding cost", "wedding budget calculator", "wedding cost estimator", "average wedding cost"],
  alternates: { canonical: "https://worthulator.com/tools/wedding-cost-calculator" },
};

const FAQS = [
  {
    q: "How much does the average wedding cost in the US?",
    a: "The average US wedding costs between $29,000 and $35,000 according to The Knot's annual survey. However, costs vary enormously — a small 30-person wedding can come in under $10,000, while a large celebration of 200+ guests in a major city can exceed $80,000.",
  },
  {
    q: "What is the biggest cost at most weddings?",
    a: "Catering is typically the largest line item, often accounting for 30–40% of the total budget. Venue hire is the second biggest cost. Together these two items can easily represent 50–60% of a wedding budget, which is why guest count has such a large impact on total spend.",
  },
  {
    q: "How much should I budget per guest?",
    a: "A common benchmark is $150–$250 per guest all-in (catering, venue share, favours). Budget weddings can come in at $75–$100/guest with careful planning, while luxury events often exceed $400/guest. Use the calculator to see how your specific choices affect the per-head cost.",
  },
  {
    q: "How can I reduce wedding costs without cutting corners?",
    a: "The highest-impact savings come from reducing guest count (fewer guests = lower catering and venue costs), choosing an off-peak date (Friday evenings or January–March offer venue discounts), limiting the open bar to a reception period only, and sourcing a newer photographer building their portfolio.",
  },
  {
    q: "Should I include the honeymoon in my wedding budget?",
    a: "Typically no — the honeymoon is budgeted separately. This calculator covers the ceremony and reception costs only. The average US honeymoon costs $4,500–$7,000 and should be planned as a separate financial goal.",
  },
];

const STATS = [
  { stat: "$33K",  color: "text-pink-600",    accent: "bg-pink-500",    label: "average cost of a US wedding in 2025 according to The Knot" },
  { stat: "40%",   color: "text-amber-600",   accent: "bg-amber-500",   label: "of total wedding spend typically goes to catering alone" },
  { stat: "$210",  color: "text-emerald-600", accent: "bg-emerald-500", label: "average all-in cost per wedding guest across the US" },
];

const CONTENT_CARDS = [
  {
    icon: "💍",
    title: "Guest count drives everything",
    body: "More than any other factor, the number of guests determines your total spend. Each additional guest adds catering, seating, favours, and venue capacity costs. Cutting your list from 120 to 80 can save $8,000–$15,000 without touching any other budget line.",
  },
  {
    icon: "📸",
    title: "Photography is a one-time investment",
    body: "Unlike catering or florals, wedding photos last a lifetime. Many couples who cut photography costs regret it later. If you need to save money, reducing the videographer (keeping the photographer) is often the better trade-off.",
  },
  {
    icon: "📅",
    title: "Off-peak dates can halve venue costs",
    body: "Saturday summer weddings command a premium. The same venue on a Friday in November or January can cost 30–50% less. Some venues also offer weekday packages that dramatically reduce hire fees — worth asking before booking.",
  },
];

const RELATED_CALCS = [
  { title: "Savings Goal Calculator",     description: "Save up for your wedding fund.",                 href: "/tools/savings-goal-calculator",     icon: "🎯", accent: "bg-emerald-500/10" },
  { title: "Down Payment Calculator",     description: "Save for your first home after the wedding.",    href: "/tools/down-payment-countdown",      icon: "🏠", accent: "bg-blue-500/10"    },
  { title: "Emergency Fund Calculator",   description: "Build a financial buffer for life events.",      href: "/tools/emergency-fund-calculator",   icon: "🛡️", accent: "bg-amber-500/10"   },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Wedding Cost Calculator",
      url: "https://worthulator.com/tools/wedding-cost-calculator",
      applicationCategory: "FinanceApplication",
      description: "Estimate the total cost of your wedding including catering, venue, photography, and extras.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function WeddingCostCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="💍"
        eyebrowText="Wedding · Budget"
        title="How Much Will Your Wedding Cost?"
        description="Enter your guest count, catering, venue, photography, and extras to see your total wedding cost and all-in price per guest."
        chips={["Total wedding cost", "Cost per guest", "Full budget breakdown"]}
      >
        <CalculatorEngineLoader slug="wedding-cost-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="The average US wedding costs $33,000 — guest count is the single biggest lever on your budget." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Plan your wedding budget wisely" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Wedding Cost Calculator Works"
        paragraphs={[
          "Enter the number of guests, your per-person catering cost, venue hire fee, photography budget, and any other costs (florals, cake, stationery, hair and makeup). The calculator totals all categories and divides by your guest count to show the all-in cost per head.",
          "Use this as a planning tool — adjust the sliders to see how reducing guest numbers or venue spend changes your total. The per-guest figure is particularly useful when comparing venue packages that include catering versus those that don't.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
