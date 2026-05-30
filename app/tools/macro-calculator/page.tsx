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
  title: "Macro Calculator 2026 – Daily Protein, Carbs, and Fat Targets",
  description:
    "Calculate your optimal daily protein, carbohydrate, and fat grams based on your calories, body weight, and goal. Works for fat loss, maintenance, and muscle gain.",
  keywords: ["macro calculator", "macronutrient calculator", "protein carbs fat calculator", "iifym calculator", "daily macro targets"],
  alternates: { canonical: "https://worthulator.com/tools/macro-calculator" },
};

const FAQS = [
  {
    q: "How much protein do I need per day?",
    a:
      "For muscle gain or retention during fat loss: 0.7–1.0g of protein per pound of body weight (1.6–2.2g/kg) is well-supported by research. For maintenance or general health: 0.6–0.8g/lb is typically sufficient. Higher-protein diets also tend to increase satiety.",
  },
  {
    q: "What are macros and why do they matter?",
    a:
      "Macronutrients are protein, carbohydrates, and fat — the three categories that provide calories. Protein and carbs each provide 4 calories/gram. Fat provides 9 calories/gram. Tracking macros (IIFYM — If It Fits Your Macros) lets you eat any food while hitting your calorie and nutrient targets.",
  },
  {
    q: "How are carbs and fat calculated?",
    a:
      "After subtracting protein calories from your total (protein grams × 4), remaining calories are split between carbs and fat based on your goal. Fat loss goals shift more to protein and fat (lower carbs). Muscle gain goals keep carbs higher for energy and recovery. Maintenance splits roughly evenly.",
  },
  {
    q: "Should I track macros or just calories?",
    a:
      "Calorie tracking is foundational for weight change. Macro tracking adds precision — ensuring adequate protein preserves muscle during fat loss and supports growth during a surplus. For beginners, hitting a protein target + staying within calories is 80% of the benefit with much less complexity.",
  },
  {
    q: "What's the best macro split for fat loss?",
    a:
      "A common fat loss split is 40% protein / 30% carbs / 30% fat. High protein (40%) preserves lean mass while in a deficit. Lower carbs reduce insulin response. Adequate fat supports hormones. Exact ratios matter less than hitting your calorie target and protein minimum.",
  },
];

const STATS = [
  { stat: "4 kcal", color: "text-blue-600", accent: "bg-blue-500", label: "calories per gram of protein and carbohydrate" },
  { stat: "9 kcal", color: "text-amber-600", accent: "bg-amber-500", label: "calories per gram of dietary fat" },
  { stat: "0.8g/lb", color: "text-emerald-600", accent: "bg-emerald-500", label: "minimum protein per lb of body weight recommended for muscle gain" },
];

const CONTENT_CARDS = [
  {
    icon: "🥩",
    title: "Protein is non-negotiable",
    body: "Of the three macros, protein has the strongest evidence for body composition. It preserves muscle during fat loss, increases satiety, has a high thermic effect (~25% of calories burned in digestion), and is hardest to overconsume. Hit your protein target first — then fill in carbs and fat.",
  },
  {
    icon: "🍞",
    title: "Carbs are context-dependent",
    body: "Carbohydrates are the most flexible macro. Low-carb diets work because reducing carbs often reduces total calorie intake. High-carb diets work for athletes needing glycogen. For sedentary fat loss, lower carbs with high protein is usually most effective. For athletes, carbs fuel performance.",
  },
  {
    icon: "🥑",
    title: "Fat supports hormones and satiety",
    body: "Dietary fat is essential for hormone production (testosterone, estrogen), fat-soluble vitamins (A, D, E, K), brain health, and satiety. Dropping fat below 15–20% of calories can suppress testosterone and hormone function. Never eliminate fat to hit a calorie target.",
  },
];

const RELATED_CALCS = [
  { title: "TDEE Calculator", description: "Find your daily calorie maintenance target.", href: "/tools/tdee-calculator", icon: "🔥", accent: "bg-emerald-500/10" },
  { title: "Body Fat Calculator", description: "Track body composition over time.", href: "/tools/body-fat-calculator", icon: "📏", accent: "bg-blue-500/10" },
  { title: "Caffeine Half-Life Calculator", description: "Optimise your pre-workout caffeine timing.", href: "/tools/caffeine-half-life", icon: "☕", accent: "bg-amber-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Macro Calculator",
      url: "https://worthulator.com/tools/macro-calculator",
      applicationCategory: "HealthApplication",
      description: "Calculate daily protein, carbohydrate, and fat targets based on your calorie goal and body weight.",
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

export default function MacroCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="💪"
        eyebrowText="Macro Calculator"
        title="What Should Your Daily Protein, Carbs, and Fat Be?"
        description="Get your personalised macro targets based on your daily calories, body weight, and goal — fat loss, maintenance, or muscle gain."
        chips={["Goal-based splits", "Protein by body weight", "Carbs + fat auto-calculated"]}
      >
        <CalculatorEngineLoader slug="macro-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Hitting your protein target is the single most impactful macro habit — carbs and fat matter less than most people think." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Understanding your macros"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Macro Calculator Works"
        paragraphs={[
          "Protein = body weight (lbs) × goal multiplier (0.7g/lb fat loss, 0.6g/lb maintain, 0.8g/lb muscle gain). Protein calories = protein grams × 4. Remaining calories are split: fat loss (35% fat, 65% carbs of remainder), maintenance (40/60), muscle gain (30/70). Fat grams = fat calories ÷ 9. Carb grams = carb calories ÷ 4.",
          "These ratios are evidence-informed starting points. Individual results vary based on carbohydrate tolerance, training intensity, and personal preference. Adjust carbs and fat to taste while keeping protein constant — this is the most flexible and effective approach.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
