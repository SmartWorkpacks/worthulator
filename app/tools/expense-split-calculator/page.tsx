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

export const metadata: Metadata = {
  title: "Expense Split Calculator 2026 – Split Bills, Tips & Group Costs Fairly",
  description:
    "Split any shared expense equally across a group, with optional tip and tax. Get the exact per-person amount plus a whole-dollar collection mode for easy payback.",
  keywords: ["expense split calculator", "bill split calculator", "split costs calculator", "how to split expenses", "group expense calculator"],
  alternates: { canonical: "https://worthulator.com/tools/expense-split-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do you split expenses equally in a group?",
    a: "Total ÷ number of people = each person's share. For a $200 dinner among 5 people that's $40 each. If a tip is included, add it first: $200 × 1.20 = $240 ÷ 5 = $48 each. This calculator does both steps and layers optional tax on top automatically.",
  },
  {
    q: "Should the tip be calculated before or after splitting?",
    a: "The standard, fairest approach when everyone ordered similarly is to add the tip to the pre-tip total, then split the tipped amount equally — which is exactly what this calculator does. If people ordered very differently, itemised splitting (each person pays for their own order) is fairer.",
  },
  {
    q: "What's the fairest way to split when people earn different amounts?",
    a: "Options include proportional-to-income (each pays the same share of their income), by-usage (heavier users pay more), flat equal split (simplest and most common), or itemised. Most groups default to an equal split for simplicity unless there's a large income gap.",
  },
  {
    q: "How does the whole-dollar collection mode help?",
    a: "Collecting an awkward $48.33 from everyone is annoying. The calculator rounds the per-person amount up to the next whole dollar and shows the small surplus that creates — a clean number to collect that can boost the tip or absorb the rounding. No coins, no IOUs.",
  },
  {
    q: "What's the best way to handle a large group?",
    a: "For 8+ people, the hard part is chasing money afterwards. Collect in advance: send a payment link for the per-person amount before the event. A shared house account works for recurring flatmate costs. Apps like Splitwise help track ongoing multi-payer balances.",
  },
];

const STATS = [
  { stat: "÷ people", color: "text-emerald-600", accent: "bg-emerald-500", label: "the core split — total divided equally among everyone" },
  { stat: "18–20%",   color: "text-blue-600",    accent: "bg-blue-500",    label: "typical US tipping range, added before the split" },
  { stat: "1 tap",    color: "text-amber-600",   accent: "bg-amber-500",   label: "to the final per-person amount with tip and tax included" },
];

const CONTENT_CARDS = [
  {
    icon: "🍽️",
    title: "Built for restaurants & dining",
    body: "The classic case: a shared bill at dinner. Enter the total, the number of diners, and the tip — get the exact per-person amount including tip and tax in one step. The whole-dollar mode gives a clean number to collect at the table.",
  },
  {
    icon: "✈️",
    title: "Group travel and shared costs",
    body: "Trips generate Airbnb, car, fuel, groceries, and meals. The simplest system: one person pays each expense, tracks the running total, and uses this calculator to find each person's equal share at the end. Send a payment link for the per-person figure to settle up.",
  },
  {
    icon: "🏠",
    title: "Flatmates and shared living",
    body: "For recurring costs — broadband, utilities, household supplies — a shared account everyone pays into equally is cleanest. For one-off purchases, this calculator confirms the split instantly. Where usage differs a lot, consider splitting by usage rather than pure equal division.",
  },
];

const RELATED_CALCS = [
  { title: "Tip Calculator", description: "Per-person tip, totals, and bracket comparison.", href: "/tools/tip-calculator", icon: "💵", accent: "bg-emerald-500/10" },
  { title: "Road Trip Cost Calculator", description: "Share fuel and travel costs fairly.", href: "/tools/road-trip-cost", icon: "🚗", accent: "bg-blue-500/10" },
  { title: "Grocery Unit Price Calculator", description: "Compare price per unit at the shelf.", href: "/tools/grocery-unit-price", icon: "🛒", accent: "bg-amber-500/10" },
  { title: "Savings Goal Calculator", description: "How long to save for a shared goal.", href: "/tools/savings-goal-calculator", icon: "🎯", accent: "bg-purple-500/10" },
];

export default function ExpenseSplitCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Expense Split Calculator",
      url: "https://worthulator.com/tools/expense-split-calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Split a shared expense equally across a group with optional tip and tax.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="🤝"
        eyebrowText="Money · Sharing"
        title="Expense Split Calculator"
        description="Enter the total, number of people, tip, and optional tax to instantly see what each person owes — with a whole-dollar collection mode for painless payback."
        chips={["Per-person amount", "Tip & tax included", "Round-to-collect"]}
      >
        <EngineWithInsights slug="expense-split-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="No more phone-calculator fumbling — get the <span class='font-semibold text-gray-900'>exact per-person amount with tip</span> in one step." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="When and how to split shared costs" subtitle="Dining, travel, and shared living." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Expense Split Calculator Works"
        formula={`Tip          = Amount × Tip% ÷ 100
Tax          = Amount × Tax% ÷ 100
Grand Total  = Amount + Tip + Tax
Per Person   = Grand Total ÷ People
Rounded      = ceil(Per Person)  → buffer = Rounded × People − Grand Total`}
        steps={[
          { label: "Enter the total amount", description: "The shared bill before tip (and tax, if you add it separately)." },
          { label: "Set the number of people", description: "How many ways the cost is split." },
          { label: "Add tip and optional tax", description: "Tip and tax are added to the total, then divided equally." },
        ]}
        paragraphs={[
          "The base split divides the bill equally. Tip and any tax are added to the subtotal first, then the grand total is divided by the number of people — the standard, fairest approach when everyone shared roughly equally.",
          "The whole-dollar collection mode rounds each person's share up to the next dollar and shows the small surplus it creates, giving you a clean number to collect that can top up the tip or cover the rounding.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More money and sharing tools." items={RELATED_CALCS} />
    </main>
  );
}
