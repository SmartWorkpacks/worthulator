import type { Metadata } from "next";
import { MealPrepWithInsights } from "@/components/worthcore/MealPrepWithInsights";
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
  title: "Cooking at Home Savings Calculator 2026 – How Much Do You Actually Save?",
  description:
    "Find out exactly how much you save cooking at home versus delivery, takeout, or restaurant meals. Uses real regional food costs for all 50 states.",
  keywords: ["cooking at home savings calculator", "meal prep savings calculator", "cook at home vs eating out calculator", "how much do you save cooking at home", "cost per home cooked meal"],
  alternates: { canonical: "https://worthulator.com/tools/meal-prep-calculator" },
};

const FAQS = [
  {
    q: "How much can you really save cooking at home?",
    a: "It depends on what you're replacing. Fast food runs about $13 a meal nationally. An inexpensive sit-down restaurant is closer to $23. Delivery averages $31 once the platform fee, service charge, and tip are added. A home-cooked meal using national grocery benchmarks comes out to around $5.93. Cook 10 meals a week instead of ordering takeout and you're saving roughly $5,000 a year. Replace delivery specifically and that figure climbs past $13,000.",
  },
  {
    q: "What is a realistic cost per meal when cooking at home?",
    a: "National grocery benchmarks put a home-cooked meal at about $5.93. The USDA thrifty food plan — the budget-conscious baseline — puts a single adult at $320 a month, which works out to roughly $5.33 per meal across 60 meals. Build your meals around eggs, dried lentils, frozen chicken thighs, or canned fish and you can get below $4 without sacrificing much on the plate. Higher-protein or more complex recipes naturally run $6–$8, but most batch-cooked meals land comfortably between $4 and $6.",
  },
  {
    q: "Does meal prepping save time as well as money?",
    a: "Yes — batch cooking 2–3 hours on a Sunday typically saves 30–45 minutes per day during the week because you eliminate daily cooking decisions, grocery runs, and takeout wait times. The time saving is harder to quantify but is a significant benefit for busy households.",
  },
  {
    q: "How many meals per week should I meal prep?",
    a: "Most people start with 5–7 meals (lunches for the work week) and progress to 10–14 meals as they get comfortable with batch cooking. Prepping all three meals daily (21/week) is ambitious but achievable with good systems. Start small to build the habit before scaling up.",
  },
  {
    q: "What food costs should I include in my weekly grocery total?",
    a: "Include all ingredients used in your prepped meals: protein, grains, vegetables, oils, sauces, and spices. Do not include non-meal items like household staples, snacks, or drinks in the total — this calculator is designed to show the cost of your prepped meals specifically.",
  },
];

const STATS = [
  { stat: "$5.93",  color: "text-emerald-600", accent: "bg-emerald-500", label: "national cost per home-cooked meal based on current grocery benchmarks" },
  { stat: "$31",    color: "text-amber-600",   accent: "bg-amber-500",   label: "average delivery app order once platform fees and tip are included" },
  { stat: "$5,000", color: "text-blue-600",    accent: "bg-blue-500",    label: "typical annual savings cooking 10 meals a week instead of ordering takeout" },
];

const CONTENT_CARDS = [
  {
    icon: "🚚",
    title: "Delivery doesn't just cost more — it costs a lot more",
    body: "Once platform fees, service charges, and tip are rolled in, the average delivery order runs $31. That's more than five times the cost of the same meal cooked at home. Most people already know delivery is expensive — they just don't confront how expensive until the annual number is sitting in front of them.",
  },
  {
    icon: "📅",
    title: "The savings stack quietly, then all at once",
    body: "Ten home-cooked meals a week versus ordering takeout adds up to around $5,000 a year at national prices. Swap delivery for those same meals and you're past $13,000. Neither number requires a dramatic life change — just the same meals you'd eat anyway, made one step earlier in the day.",
  },
  {
    icon: "🛒",
    title: "Your actual cost per meal will surprise you",
    body: "At national grocery benchmarks, a home-cooked meal works out to just under $6. Build around cheaper staples — eggs, dried lentils, frozen veg, chicken thighs — and you can comfortably get below $4. The USDA thrifty food plan puts a budget-conscious single adult at $320 a month all-in, which works out to about $5.33 per meal across 60 meals.",
  },
];

const RELATED_CALCS = [
  { title: "Latte Factor Calculator",      description: "See the cost of daily small purchases.",            href: "/tools/latte-factor",                icon: "☕", accent: "bg-amber-500/10"   },
  { title: "Grocery Unit Price",           description: "Find the cheapest option at the supermarket.",     href: "/tools/grocery-unit-price",          icon: "🛒", accent: "bg-emerald-500/10" },
  { title: "Calorie Deficit Calculator",   description: "Pair smart eating with calorie tracking.",         href: "/tools/calorie-deficit-calculator",  icon: "🥦", accent: "bg-blue-500/10"    },
  { title: "Savings Goal Calculator",      description: "Put your meal prep savings to work.",              href: "/tools/savings-goal-calculator",     icon: "🎯", accent: "bg-pink-500/10"    },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Cooking at Home Savings Calculator",
      url: "https://worthulator.com/tools/meal-prep-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate your cost per home-cooked meal, weekly savings, and annual savings versus delivery, takeout, or restaurant meals — calibrated to your state.",
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

export default function MealPrepCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🍳"
        eyebrowText="Food · Savings"
        title="How Much Do You Save Cooking at Home?"
        description="Pick your state, describe your eating habits, and set how many meals you plan to cook each week. We pull real regional food-cost data to show your cost per home meal, weekly savings, and what it adds up to by year's end."
        chips={["Cost per meal", "Weekly savings", "Annual savings"]}
      >
        <MealPrepWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text="Fast food costs $13 a meal. Delivery averages $31 with fees and tip. Cook the same meal at home for under $6 — and the gap becomes one of the easiest wins in personal finance." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Why cooking at home is one of the most reliable savings habits" cards={CONTENT_CARDS} />
      <InsightTable slug="meal-prep-calculator" />
      <SEOTextBlock
        title="How the Cooking at Home Savings Calculator Works"
        formula={`Dining Baseline    = State-adjusted cost for your selected eating style(s)\nCost per Home Meal = State grocery benchmark ÷ 60 meals / month\nSaving per Meal    = Dining Baseline − Cost per Home Meal\nWeekly Savings     = Saving per Meal × Meals Cooked per Week\nAnnual Savings     = Weekly Savings × 52`}
        paragraphs={[
          "Select your state and one or more dining habits — delivery, restaurant, fast food, or a mix. Each state has its own food-cost index derived from BLS Regional Price Parities and Numbeo city data, so your dining baseline and home-meal cost both reflect what food actually costs where you live. Nationally, delivery averages $31 a meal, inexpensive restaurants run $22.66, and fast food sits at $13.",
          "Set how many meals you plan to cook each week. Every home-cooked meal replaces an outsourced one and saves you the gap between the two costs. At national averages, that gap is around $9.60 versus takeout, $16.70 versus a sit-down restaurant, and $25 versus delivery. Annual savings is simply that weekly total multiplied by 52.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
