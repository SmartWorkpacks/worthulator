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
  title: "BMR Calculator 2026 – Basal Metabolic Rate & Daily Calorie Needs",
  description:
    "Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula and see your daily calorie needs for sedentary, moderate, and active lifestyles.",
  keywords: ["BMR calculator", "basal metabolic rate calculator", "calorie calculator", "TDEE calculator", "how many calories should I eat"],
  alternates: { canonical: "https://worthulator.com/tools/bmr-calculator" },
};

const FAQS = [
  {
    q: "What is BMR and why does it matter?",
    a: "Basal Metabolic Rate (BMR) is the number of calories your body burns at complete rest to maintain basic functions — breathing, circulation, cell production, and temperature regulation. It accounts for 60–75% of total daily calorie expenditure. Knowing your BMR is the starting point for setting accurate calorie targets for weight loss, maintenance, or muscle gain.",
  },
  {
    q: "What is the Mifflin-St Jeor formula?",
    a: "The Mifflin-St Jeor formula (published 1990) is considered the most accurate BMR formula for most adults: Male BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5. Female BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161. It is more accurate than the older Harris-Benedict formula, particularly for overweight individuals.",
  },
  {
    q: "What is the difference between BMR and TDEE?",
    a: "BMR is calories burned at rest. TDEE (Total Daily Energy Expenditure) is calories burned including all daily activity. TDEE = BMR × Activity Multiplier. Sedentary (desk job, no exercise): ×1.2. Lightly active (light exercise 1–3 days): ×1.375. Moderately active (exercise 3–5 days): ×1.55. Very active (hard exercise 6–7 days): ×1.725. Extra active (physical job + training): ×1.9.",
  },
  {
    q: "How accurate are online BMR calculators?",
    a: "Formula-based BMR calculators are estimates — they can be 10–15% off from your actual metabolic rate. Individual factors like lean muscle mass, hormones, gut microbiome, and genetics affect metabolism beyond what any formula captures. Direct measurement (indirect calorimetry in a clinical setting) is the gold standard. For practical purposes, use the formula result as a baseline and adjust based on real-world weight changes.",
  },
  {
    q: "How do I use my BMR to lose weight?",
    a: "Multiply your BMR by your activity multiplier to get TDEE (your maintenance calories). To lose weight at approximately 1 lb/week, create a deficit of 500 calories/day from TDEE (1 lb of fat ≈ 3,500 kcal). Never eat below BMR for extended periods — this triggers metabolic adaptation, muscle loss, and hormonal disruption. A minimum of BMR calories is essential for organ function.",
  },
];

const STATS = [
  { stat: "60–75%", color: "text-emerald-600", accent: "bg-emerald-500", label: "of total daily calorie burn comes from BMR — even at rest" },
  { stat: "×1.55", color: "text-blue-600", accent: "bg-blue-500", label: "activity multiplier for someone exercising 3–5 days per week (moderate)" },
  { stat: "500 kcal", color: "text-amber-600", accent: "bg-amber-500", label: "daily deficit needed to lose approximately 1 lb per week" },
];

const CONTENT_CARDS = [
  {
    icon: "🔢",
    title: "BMR vs TDEE: which number to use",
    body: "BMR is the absolute minimum calories to survive. TDEE is what you actually need day-to-day. For weight management, use TDEE as your baseline: eat below it to lose weight, above it to gain. Never sustain a calorie intake below BMR — it risks muscle catabolism and metabolic slowdown over time.",
  },
  {
    icon: "💪",
    title: "Muscle raises your BMR",
    body: "Muscle tissue is metabolically expensive — it burns roughly 6–10 kcal per pound per day at rest, compared to fat tissue at 2–3 kcal. Adding 5 lbs of lean muscle raises BMR by 30–50 kcal/day — not dramatic, but meaningful over years. Resistance training raises BMR both directly (muscle mass) and indirectly (post-exercise calorie burn lasting 24–72 hours).",
  },
  {
    icon: "🎯",
    title: "Adjust every 5–10 lbs",
    body: "As your weight changes, your BMR changes too. Recalculate every time you gain or lose 5–10 lbs to keep your calorie target accurate. Failing to update leads to a stall — your deficit shrinks as you get lighter, and without recalculation you unknowingly return to maintenance calories without realising it.",
  },
];

const RELATED_CALCS = [
  { title: "TDEE Calculator", description: "Full daily calorie needs including activity.", href: "/tools/tdee-calculator", icon: "🏃", accent: "bg-emerald-500/10" },
  { title: "Calorie Deficit Calculator", description: "Find your deficit for your weight loss goal.", href: "/tools/calorie-deficit-calculator", icon: "📉", accent: "bg-blue-500/10" },
  { title: "Macro Calculator", description: "Calculate daily protein, carbs, and fat targets.", href: "/tools/macro-calculator", icon: "🥗", accent: "bg-amber-500/10" },
  { title: "Protein Intake Calculator", description: "Daily protein target by weight and activity.", href: "/tools/protein-intake-calculator", icon: "💪", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "BMR Calculator",
      url: "https://worthulator.com/tools/bmr-calculator",
      applicationCategory: "HealthApplication",
      description: "Calculate your Basal Metabolic Rate using the Mifflin-St Jeor formula and see calorie needs by activity level.",
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

export default function BmrCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🔥"
        eyebrowText="BMR Calculator"
        title="How Many Calories Does Your Body Burn at Rest?"
        description="Enter your sex, weight, height, and age to calculate your Basal Metabolic Rate using the Mifflin-St Jeor formula — and see your calorie needs at every activity level."
        chips={["Mifflin-St Jeor formula", "4 activity levels", "TDEE estimates shown"]}
      >
        <CalculatorEngineLoader slug="bmr-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Your BMR accounts for <span class='font-semibold text-gray-900'>60–75%</span> of all calories you burn daily — even on a rest day." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Understanding your metabolism" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the BMR Calculator Works"
        formula="Male BMR = (10 × kg) + (6.25 × cm) − (5 × age) + 5\nFemale BMR = (10 × kg) + (6.25 × cm) − (5 × age) − 161"
        paragraphs={[
          "This calculator uses the Mifflin-St Jeor equation (1990), the most widely validated BMR formula for adults. Enter weight in kilograms, height in centimetres, and age in years.",
          "The BMR result is then multiplied by standard activity factors: ×1.2 (sedentary), ×1.55 (moderately active), and ×1.725 (very active) to estimate Total Daily Energy Expenditure at each level.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
