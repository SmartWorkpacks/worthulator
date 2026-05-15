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
  title: "Expense Split Calculator 2026 – Split Bills, Tips & Group Costs Fairly",
  description:
    "Split any shared expense equally between a group. Add a tip percentage to get the per-person amount including tip. Perfect for restaurants, travel, rent, and shared costs.",
  keywords: ["expense split calculator", "bill split calculator", "split costs calculator", "how to split expenses", "group expense calculator"],
  alternates: { canonical: "https://worthulator.com/tools/expense-split-calculator" },
};

const FAQS = [
  {
    q: "How do you split expenses equally in a group?",
    a: "Equal splitting is simple: total bill ÷ number of people = each person's share. For a $200 dinner between 5 people, each person pays $40. If a tip is included, calculate the tipped total first: $200 × 1.20 (20% tip) = $240 ÷ 5 = $48 each. This calculator handles both steps automatically.",
  },
  {
    q: "Should the tip be calculated before or after splitting?",
    a: "The standard approach is to calculate the tip on the pre-tip total, then split the tipped amount equally. This calculator adds the tip to the total first and then divides by people, which is the most common and fairest approach when everyone ordered similarly. If people ordered very differently, itemised splitting (splitting each person's order individually) is fairer.",
  },
  {
    q: "What's the fairest way to split shared expenses when people earn different amounts?",
    a: "Options for unequal splitting: proportional to income (each person pays an equal percentage of their income), by usage (whoever used something more pays more), flat equal split (simplest, most commonly used), or itemised (each person pays only what they personally ordered or used). Most friend groups default to equal splitting for simplicity unless there's a significant income disparity.",
  },
  {
    q: "What are good apps for tracking shared expenses?",
    a: "Splitwise is the most popular app for tracking ongoing shared expenses in groups — it supports complex scenarios like some people paying some bills and reconciles everything to minimal payment transfers. Tricount is a free alternative. For one-off events, this calculator is faster than opening an app. Google Sheets shared documents work well for flatmates with monthly recurring shared costs.",
  },
  {
    q: "How do you handle it when someone can't pay their share?",
    a: "In close groups, the common approach is to cover the shortfall and let the person pay back later — track it via Splitwise or a note. For recurring flat situations, a shared house account (all flatmates pay in monthly) avoids the need for constant person-to-person tracking. For large groups or events, collecting money in advance (via payment links) before the event eliminates the awkward chasing afterwards.",
  },
];

const STATS = [
  { stat: "÷ people", color: "text-emerald-600", accent: "bg-emerald-500", label: "the fundamental split formula — total divided equally among all participants" },
  { stat: "18–20%", color: "text-blue-600", accent: "bg-blue-500", label: "typical tipping range in the US — included in the per-person calculation" },
  { stat: "1 tap", color: "text-amber-600", accent: "bg-amber-500", label: "to get the final per-person amount with tip included — no mental math required" },
];

const CONTENT_CARDS = [
  {
    icon: "🍽️",
    title: "Perfect for restaurants & dining",
    body: "The most common use case: a group dinner with a shared bill. Enter the total, add the number of diners, set the tip percentage, and get the exact amount each person owes including tip. No fumbling with mental arithmetic at the table. The calculator handles both the even split and the tipped total in one step.",
  },
  {
    icon: "✈️",
    title: "Group travel and shared costs",
    body: "Group trips generate complex shared costs: Airbnb, hired car, fuel, groceries, tours, meals. The simplest approach is one person pays each expense, tracks the total, and at the end uses this calculator to determine each person's equal share. More complex trips benefit from Splitwise's 'paid by' tracking that handles multiple payers automatically.",
  },
  {
    icon: "🏠",
    title: "Flatmates and shared living",
    body: "For recurring shared costs (broadband, council tax, shared subscriptions, household supplies), the cleanest system is a shared house account each flatmate pays into equally each month. For one-off shared purchases, this calculator quickly confirms the split amount. For fair utility splitting when usage differs, consider bill-by-usage methods rather than pure equal division.",
  },
];

const RELATED_CALCS = [
  { title: "Bill Split Calculator", description: "Split restaurant bills with itemised orders.", href: "/tools/bill-split-calculator", icon: "🧾", accent: "bg-emerald-500/10" },
  { title: "Tip Calculator", description: "Calculate exact tip amounts quickly.", href: "/tools/tip-calculator", icon: "💵", accent: "bg-blue-500/10" },
  { title: "Road Trip Cost Calculator", description: "Share fuel and travel costs fairly.", href: "/tools/road-trip-cost", icon: "🚗", accent: "bg-amber-500/10" },
  { title: "Savings Goal Calculator", description: "How long to save for a shared goal.", href: "/tools/savings-goal-calculator", icon: "🎯", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Expense Split Calculator",
      url: "https://worthulator.com/tools/expense-split-calculator",
      applicationCategory: "UtilityApplication",
      description: "Split any shared expense equally between a group, with optional tip included.",
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

export default function ExpenseSplitCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🤝"
        eyebrowText="Expense Split Calculator"
        title="Split Any Shared Expense in Seconds"
        description="Enter the total amount, number of people, and tip percentage to instantly calculate what each person owes — with and without tip included."
        chips={["Equal split calculated", "Tip included", "Per-person amount shown"]}
      >
        <CalculatorEngineLoader slug="expense-split-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="No more phone-calculator fumbling — get the <span class='font-semibold text-gray-900'>exact per-person amount with tip</span> in one step." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="When and how to split shared costs" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Expense Split Calculator Works"
        formula="Per Person = Total ÷ People\nTotal with Tip = Total × (1 + Tip% ÷ 100)\nPer Person with Tip = Total with Tip ÷ People"
        paragraphs={[
          "The base split divides the pre-tip total equally. The tipped total adds the tip percentage to the subtotal. Per person with tip divides the tipped total by the number of people.",
          "This is the standard approach for equal splitting — everyone pays the same share of the bill including service. Use the per-person figure to collect payments from each member of the group.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
