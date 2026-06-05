import type { Metadata } from "next";
import TipCalcWithInsights from "@/components/worthcore/TipCalcWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Tip Calculator 2026 – Split the Bill & See Annual Tip Spend",
  description:
    "Calculate the exact tip per person, get a cash-friendly round-up, and see how much you spend on tips per year — all in one tool.",
  keywords: ["tip calculator", "bill splitter", "how much to tip", "tip per person", "restaurant bill split", "annual tipping cost"],
  alternates: { canonical: "https://worthulator.com/tools/tip-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much should you tip at a restaurant in 2026?",
    a: "In the US, 20% is the standard for sit-down restaurants with good service. 15% is the floor for acceptable service, 25%+ for exceptional. Counter service and fast casual typically warrants 10–15%. On a $60 bill, 20% = $12 total tip or $6/person split two ways.",
  },
  {
    q: "How do you calculate a tip quickly in your head?",
    a: "For 20%, move the decimal one place left (that's 10%), then double it. On a $60 bill: 10% = $6, doubled = $12. For 15%, take 10% and add half — $6 + $3 = $9. Or just use this calculator.",
  },
  {
    q: "Why does this calculator ask how often I eat out?",
    a: "Because tipping adds up fast. At $60 bills with a 20% tip, dining out 8 times a month means $1,152/year in tips alone — $96/month. Most people have no idea how much they spend on gratuity annually until they see the number.",
  },
  {
    q: "What is the cash-friendly round-up?",
    a: "It rounds each person's total up to the nearest $5 — so instead of handing over $36.49, you pay $40. It makes splitting easier when paying cash. The calculator shows you exactly how much extra the round-up costs per person.",
  },
  {
    q: "Should you tip on the pre-tax or post-tax amount?",
    a: "Tipping on the pre-tax amount is technically correct, but most people tip on the total. The difference is small — on a $60 bill with 8% tax, it's about $1 either way. This calculator uses the bill amount you enter.",
  },
  {
    q: "When should you tip more than 20%?",
    a: "Tip above 20% for exceptional service, on very small bills (a $5 coffee still warrants $1–2), when your group caused extra work, or during holidays as a thank-you to regular service workers.",
  },
];

const STATS = [
  { stat: "20%",       color: "text-emerald-600", accent: "bg-emerald-500", label: "The standard US tip for good sit-down service — $12 on a $60 bill" },
  { stat: "$1,152/yr", color: "text-blue-600",    accent: "bg-blue-500",    label: "Annual tip spend dining out 8×/month at $60 average with a 20% tip" },
  { stat: "$36",       color: "text-amber-600",   accent: "bg-amber-500",   label: "Each person's total on a $60 bill with 20% tip, split 2 ways" },
];

const CONTENT_CARDS = [
  {
    icon: "🍽️",
    title: "US tipping is effectively mandatory",
    body: "Servers typically earn a tipped minimum wage well below the standard minimum ($2.13/hr federally) and depend on tips for the majority of their income. The 20% baseline reflects this reality — it's not a bonus, it's the system.",
  },
  {
    icon: "💵",
    title: "Cash tips go further",
    body: "Cash tips go directly to your server without processing fees. Card tips get processed through the POS system, and some restaurants deduct the credit card processing fee (2–3%) from the server's tip. If you want the full amount to reach them, cash is the cleaner option.",
  },
  {
    icon: "👥",
    title: "Watch for auto-gratuity",
    body: "Many restaurants automatically add 18–20% gratuity for groups of 6 or more. Always check the bill before adding an additional tip — you may end up tipping twice. The auto-grat is noted on the menu or printed on the bill itself.",
  },
];

const RELATED_CALCS = [
  { title: "Grocery Unit Price Calculator",  description: "Find the best deal by price per unit.",               href: "/tools/grocery-unit-price",      icon: "🛒", accent: "bg-emerald-500/10" },
  { title: "Road Trip Cost Calculator",      description: "Estimate fuel cost and split across passengers.",     href: "/tools/road-trip-cost",          icon: "🚗", accent: "bg-blue-500/10" },
  { title: "Latte Factor Calculator",        description: "See what daily habits cost you over time.",           href: "/tools/latte-factor",            icon: "☕", accent: "bg-amber-500/10" },
  { title: "Discount Calculator",            description: "See exactly how much you save on a sale.",            href: "/tools/discount-calculator",     icon: "🏷️", accent: "bg-violet-500/10" },
];

export default function TipCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Tip Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the exact tip per person, round up for cash, and see your annual tipping spend.",
      url: "https://worthulator.com/tools/tip-calculator",
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
        eyebrowIcon="🍽️"
        eyebrowText="Everyday · Quick Math"
        title="Tip Calculator"
        description="Enter the bill, choose your tip %, set how many people are splitting, and how often you dine out — get the per-person split, a cash-friendly round-up, and your annual tipping spend."
        chips={["Per-person split", "Cash-friendly round-up", "Annual tip spend"]}
      >
        <TipCalcWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text='At 20% on $60 bills, dining out 8 times a month costs <span class="font-semibold text-gray-900">$1,152/year in tips alone</span> — and most people have no idea.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Everything you need to know about tipping"
        subtitle="The unwritten rules — simplified and quantified."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Tip Calculator Works"
        formula={`Tip Amount        = Bill × Tip% ÷ 100
Total Bill        = Bill + Tip Amount
Total / Person    = Total Bill ÷ People
Cash Round-Up     = ⌈Total/Person ÷ 5⌉ × 5
Annual Tip Spend  = Tip Amount × Frequency × 12

Example: $60 bill, 20% tip, 2 people, 8×/month
  Tip       = $60 × 0.20 = $12.00
  Total     = $72.00 → $36.00/person
  Round-up  = $40/person (nearest $5)
  Annual    = $12 × 8 × 12 = $1,152/yr in tips`}
        steps={[
          { label: "Enter your bill amount",     description: "The total on your bill before tip. Use the slider or quick-pick presets for common amounts." },
          { label: "Choose your tip percentage",  description: "Quick presets: 10%, 15%, 18%, 20%, 25% — or dial any number with the slider." },
          { label: "Set the number of people",    description: "How many people are splitting the bill evenly." },
          { label: "Set dining frequency",        description: "How many times per month you eat out. Default 8 = about twice a week." },
          { label: "Read the full picture",       description: "Per-person tip, per-person total, cash-friendly round-up, and your annual tip spend at this pace." },
        ]}
        paragraphs={[
          "Most tip calculators stop at the per-person split. This one adds two things that matter: a cash-friendly round-up (to the nearest $5 so you don't fumble with coins) and an annual tipping projection based on how often you actually dine out.",
          "The annual figure is often surprising. Even moderate dining-out habits — 8 times a month at $60 — generate over $1,100/year in gratuity alone. That's real money, and seeing it helps you make conscious choices about where and how often you eat out.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for everyday money math."
        items={RELATED_CALCS}
      />
    </main>
  );
}
