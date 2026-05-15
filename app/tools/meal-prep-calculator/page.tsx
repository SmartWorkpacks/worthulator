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
  title: "Meal Prep Calculator 2026 – How Much Do You Save Meal Prepping?",
  description:
    "Calculate your cost per home-cooked meal, weekly savings, and annual savings compared to eating out or ordering takeout. See the real value of meal prepping.",
  keywords: ["meal prep calculator", "meal prep savings calculator", "cost per meal calculator", "cooking vs takeout calculator", "how much do you save meal prepping"],
  alternates: { canonical: "https://worthulator.com/tools/meal-prep-calculator" },
};

const FAQS = [
  {
    q: "How much can you really save by meal prepping?",
    a: "The average American spends $13–$15 per meal when eating out or ordering takeout. A home-cooked meal typically costs $3–$5 in ingredients. For someone eating 10 meals per week from home instead of restaurants, that's a saving of $80–$120 per week — $4,000–$6,000 per year.",
  },
  {
    q: "What is a realistic cost per meal when prepping at home?",
    a: "A realistic grocery budget for 10 meals per week runs $50–$80, giving a cost per meal of $5–$8. Budget shoppers sticking to staples (rice, beans, eggs, seasonal vegetables, chicken thighs) can get below $3/meal. Organic, specialty, or high-protein meals typically run $7–$12/meal.",
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
  { stat: "$3,500", color: "text-emerald-600", accent: "bg-emerald-500", label: "average annual savings switching from daily takeout to home-cooked meals" },
  { stat: "$14",    color: "text-amber-600",   accent: "bg-amber-500",   label: "average cost of a restaurant meal in the US vs $4–$6 home-cooked" },
  { stat: "72%",    color: "text-blue-600",    accent: "bg-blue-500",    label: "of Americans who meal prep report it significantly reduces food spending" },
];

const CONTENT_CARDS = [
  {
    icon: "🥗",
    title: "Your cost per meal reveals the real picture",
    body: "Most people underestimate how cheap home cooking is per serving. A $60 weekly grocery shop producing 10 meals is $6/meal — less than half the cost of a fast-food combo. Once you know your real cost per meal, comparing it to takeout makes the savings impossible to ignore.",
  },
  {
    icon: "📅",
    title: "Consistency turns small savings into big ones",
    body: "Saving $10 per meal sounds modest, but 10 meals per week is $100 saved weekly — $5,200 per year. Over five years that is $26,000, invested at a modest 7% return. Meal prepping is one of the highest-ROI habits you can build precisely because it compounds over time.",
  },
  {
    icon: "🏪",
    title: "Grocery strategy amplifies the savings",
    body: "Shopping with a list based on your meal plan, buying in bulk for staples (rice, oats, lentils, canned goods), choosing frozen vegetables over fresh, and using cheaper protein sources (eggs, tinned fish, chicken thighs) can reduce your weekly grocery spend by 20–35% with minimal quality compromise.",
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
      name: "Meal Prep Calculator",
      url: "https://worthulator.com/tools/meal-prep-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate weekly and annual savings from meal prepping compared to eating out or ordering takeout.",
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
        eyebrowIcon="🥗"
        eyebrowText="Food · Savings"
        title="How Much Do You Save Meal Prepping?"
        description="Enter your weekly grocery spend, number of meals prepped, and the cost of takeout alternatives to see your cost per home meal, weekly savings, and yearly total."
        chips={["Cost per meal", "Weekly savings", "Annual savings"]}
      >
        <CalculatorEngineLoader slug="meal-prep-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="The average American spends $14 per restaurant meal — home-cooked meals average $4–$6. That gap adds up to thousands per year." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Why meal prepping is one of the best financial habits" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Meal Prep Calculator Works"
        paragraphs={[
          "Enter your total weekly grocery spend for meal prepping, the number of meals that spend produces, and the average cost of the takeout or restaurant meal you would otherwise have. The calculator divides your grocery total by meals to find your cost per home meal, then multiplies the saving per meal by weekly and annual frequency.",
          "The weekly and annual savings figures assume you would replace every prepped meal with a takeout equivalent. Adjust the takeout cost down if you typically eat at fast food rather than sit-down restaurants, or up if you tend to order from delivery apps (which add fees and tips on top of menu prices).",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
