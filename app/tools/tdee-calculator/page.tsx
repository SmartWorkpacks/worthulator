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
  title: "TDEE Calculator 2026 – Daily Calorie Needs to Maintain, Lose, or Gain Weight",
  description:
    "Calculate your Total Daily Energy Expenditure (TDEE) and Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula. Find your maintenance calories and weekly budget.",
  keywords: ["TDEE calculator", "total daily energy expenditure", "calorie calculator", "maintenance calories", "BMR calculator"],
  alternates: { canonical: "https://worthulator.com/tools/tdee-calculator" },
};

const FAQS = [
  {
    q: "What is TDEE?",
    a:
      "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, including your basal metabolic rate (BMR) plus all physical activity. Eating at your TDEE maintains your weight. Eating below loses weight; above gains weight.",
  },
  {
    q: "What is the Mifflin-St Jeor formula?",
    a:
      "The Mifflin-St Jeor equation is currently the most accurate formula for estimating BMR for most people. For men: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5. For women: same but −161 instead of +5. TDEE = BMR × activity multiplier.",
  },
  {
    q: "What activity multiplier should I use?",
    a:
      "Sedentary (desk job, little exercise) = 1.2. Lightly active (exercise 1–3 days/week) = 1.375. Moderately active (exercise 3–5 days/week) = 1.55. Very active (hard exercise 6–7 days/week) = 1.725. Extra active (physical job + daily exercise) = 1.9. Most people overestimate their activity level.",
  },
  {
    q: "How many calories should I cut to lose weight?",
    a:
      "A deficit of 500 calories/day leads to approximately 1 lb of fat loss per week (3,500 cal = 1 lb). A 250–500 cal deficit is considered sustainable. Cutting more than 1,000 cal/day often leads to muscle loss and metabolic adaptation. Start with a 20% deficit from TDEE.",
  },
  {
    q: "Why does TDEE vary between calculators?",
    a:
      "TDEE calculators use different formulas (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle) and different activity multipliers. Mifflin-St Jeor is preferred because it was validated in a 2005 systematic review as the most accurate for the general population.",
  },
];

const STATS = [
  { stat: "~2,500", color: "text-blue-600", accent: "bg-blue-500", label: "average TDEE for adult males in kcal/day" },
  { stat: "~2,000", color: "text-emerald-600", accent: "bg-emerald-500", label: "average TDEE for adult females in kcal/day" },
  { stat: "3,500", color: "text-amber-600", accent: "bg-amber-500", label: "approximate calories in one pound of body fat" },
];

const CONTENT_CARDS = [
  {
    icon: "🍽️",
    title: "Maintenance calories are your baseline",
    body: "Your TDEE is the exact number of calories needed to maintain your current weight. This is your most important number for any diet goal. Eat 10–20% below for fat loss. Eat 5–10% above for muscle gain. Track relative to this — not some generic 2,000-calorie recommendation.",
  },
  {
    icon: "🏃",
    title: "Activity level is the biggest variable",
    body: "The activity multiplier can swing your TDEE by 500–1,000+ calories. Most people who sit at a desk all day and exercise 3× per week fall in the 1.375–1.55 range. Overestimating activity is the #1 reason calorie tracking 'doesn't work.'",
  },
  {
    icon: "🔄",
    title: "TDEE changes as you lose weight",
    body: "As you lose weight, your BMR decreases — you're burning fewer calories at rest. This is why weight loss often stalls after initial progress. Recalculate your TDEE every 4–6 weeks as your weight changes to keep your calorie targets accurate.",
  },
];

const RELATED_CALCS = [
  { title: "Macro Calculator", description: "Get your daily protein, carb, and fat targets.", href: "/tools/macro-calculator", icon: "💪", accent: "bg-emerald-500/10" },
  { title: "Body Fat Calculator", description: "Estimate your body fat percentage.", href: "/tools/body-fat-calculator", icon: "📏", accent: "bg-blue-500/10" },
  { title: "Caffeine Half-Life Calculator", description: "See how caffeine affects your sleep.", href: "/tools/caffeine-half-life", icon: "☕", accent: "bg-amber-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "TDEE Calculator",
      url: "https://worthulator.com/tools/tdee-calculator",
      applicationCategory: "HealthApplication",
      description: "Calculate your Total Daily Energy Expenditure and daily calorie maintenance needs.",
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

export default function TdeeCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🔥"
        eyebrowText="TDEE Calculator"
        title="How Many Calories Do You Need to Maintain Your Weight?"
        description="Calculate your Total Daily Energy Expenditure using the Mifflin-St Jeor formula. Get your BMR, maintenance calories, and weekly calorie budget."
        chips={["Mifflin-St Jeor formula", "BMR + activity factor", "Weekly budget"]}
      >
        <CalculatorEngineLoader slug="tdee-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Most adults overestimate their activity level by one category — which means eating 200–400 more calories than they think." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="How to use your TDEE"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the TDEE Calculator Works"
        paragraphs={[
          "BMR (Mifflin-St Jeor, male) = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5. Convert: kg = lbs ÷ 2.205, cm = inches × 2.54. TDEE = BMR × activity multiplier. Weekly calorie budget = TDEE × 7.",
          "This calculator uses the male Mifflin-St Jeor formula with a default activity multiplier of 1.55 (moderately active). For women, subtract 166 from the result. For the most accurate results, use your weight and height in metric units and be honest about your true activity level.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
