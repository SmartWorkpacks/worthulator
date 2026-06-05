import type { Metadata } from "next";
import CalorieCalculatorLoader from "./CalorieCalculatorLoader";
import { calculateCalories } from "@/lib/calculators/calorieEngine";
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
  title: "Calorie Calculator 2026 - Daily Calories for Weight Loss, Maintenance, or Gain",
  description:
    "Calculate daily calorie targets using Mifflin-St Jeor BMR plus activity multipliers. Get maintenance calories, deficit or surplus targets, and macro guidance in seconds.",
  keywords: [
    "calorie calculator",
    "daily calorie needs",
    "maintenance calories",
    "tdee calorie calculator",
    "weight loss calorie calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/calorie-calculator" },
  robots: { index: true, follow: true },
};

const EXAMPLE = {
  age: 30,
  sex: "male" as const,
  heightIn: 70,
  weightLbs: 180,
  activityMultiplier: 1.55,
  goal: "lose" as const,
  pace: "moderate" as const,
};

const EX = calculateCalories(EXAMPLE);
const EX_MAINTAIN = calculateCalories({ ...EXAMPLE, goal: "maintain", pace: "moderate" });
const EX_GAIN = calculateCalories({ ...EXAMPLE, goal: "gain", pace: "moderate" });

const FAQS = [
  {
    q: "How does this calorie calculator estimate maintenance calories?",
    a: `It uses the Mifflin-St Jeor equation for BMR, then multiplies by your activity factor (1.2 to 1.9). For the worked example profile (${EXAMPLE.age} years, ${EXAMPLE.heightIn} in, ${EXAMPLE.weightLbs} lb, ${EXAMPLE.activityMultiplier.toFixed(2)} activity), maintenance is ${EX_MAINTAIN.targetCalories.toLocaleString()} kcal/day.`,
  },
  {
    q: "How many calories should I eat to lose weight?",
    a: `A common starting range is a 10-25% deficit from maintenance. In this calculator, moderate fat loss uses 20%. For the worked example, that is ${EX.targetCalories.toLocaleString()} kcal/day (${Math.abs(EX.dailyDeltaCalories).toLocaleString()} kcal/day below maintenance), projecting about ${Math.abs(EX.weeklyWeightChangeLbs)} lb/week by the 3,500 kcal per pound planning rule.`,
  },
  {
    q: "What is the difference between BMR and TDEE?",
    a: `BMR is resting energy burn (${EX.bmr.toLocaleString()} kcal/day in the worked example). TDEE includes activity and is your maintenance total (${EX_MAINTAIN.tdee.toLocaleString()} kcal/day in the same example).`,
  },
  {
    q: "How are macro targets set in this calculator?",
    a: `Protein is tied to body weight and goal, fat is set as a calorie share floor, and carbs fill the remaining calories. In the worked example deficit target (${EX.targetCalories.toLocaleString()} kcal/day), macros are ${EX.proteinGrams}g protein, ${EX.carbsGrams}g carbs, and ${EX.fatGrams}g fat.`,
  },
  {
    q: "How many calories above maintenance for muscle gain?",
    a: `This calculator uses an 8-15% surplus range. In the worked example with moderate gain pace, target calories are ${EX_GAIN.targetCalories.toLocaleString()} kcal/day, or +${EX_GAIN.dailyDeltaCalories.toLocaleString()} kcal/day above maintenance.`,
  },
];

const STATS = [
  {
    stat: "3,500 kcal",
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "Energy-equivalent planning rule for ~1 lb of body mass change",
  },
  {
    stat: "1.2-1.9x",
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "Standard activity multiplier range used to map BMR to TDEE",
  },
  {
    stat: "10-25%",
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Deficit range used here for gentle to aggressive fat-loss pacing",
  },
];

const CONTENT_CARDS = [
  {
    icon: "🔥",
    title: "Maintenance calories are your control number",
    body: "Most nutrition plans fail because people start with a random calorie target. Maintenance (TDEE) is your anchor. Deficit and surplus plans should be offsets from that number, not guesses.",
  },
  {
    icon: "⚖️",
    title: "Pace matters more than perfection",
    body: "A plan you can run for months beats an aggressive target you quit in two weeks. Use gentle or moderate pacing first, then adjust from real weekly trend data.",
  },
  {
    icon: "🥩",
    title: "Macro split protects the quality of weight change",
    body: "Calories drive direction, but macro balance influences body composition. Prioritizing protein and minimum fat intake helps preserve lean mass while calories move up or down.",
  },
];

const RELATED_CALCS = [
  {
    title: "TDEE Calculator",
    description: "Estimate maintenance calories from BMR and activity.",
    href: "/tools/tdee-calculator",
    icon: "📈",
    accent: "bg-blue-500/10",
  },
  {
    title: "Calorie Deficit Calculator",
    description: "Set a fat-loss calorie target from your weekly goal.",
    href: "/tools/calorie-deficit-calculator",
    icon: "📉",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Macro Calculator",
    description: "Convert calorie targets into protein, carbs, and fat.",
    href: "/tools/macro-calculator",
    icon: "🥗",
    accent: "bg-amber-500/10",
  },
  {
    title: "Steps to Calories Calculator",
    description: "Estimate calorie burn from daily step count.",
    href: "/tools/steps-to-calories-calculator",
    icon: "🚶",
    accent: "bg-violet-500/10",
  },
];

export default function CalorieCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Calorie Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description:
        "Calculate daily calories for fat loss, maintenance, or muscle gain using Mifflin-St Jeor BMR and activity multipliers.",
      url: "https://worthulator.com/tools/calorie-calculator",
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
        eyebrowText="Nutrition · Energy Balance"
        title="Calorie Calculator"
        description="Estimate your daily calories for fat loss, maintenance, or gain using body metrics, activity, and goal pace in one model."
        chips={["BMR + TDEE model", "Deficit/surplus pacing", "Macro calorie split"]}
      >
        <CalorieCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`For the sample profile (${EXAMPLE.age}y, ${EXAMPLE.weightLbs} lb, ${EXAMPLE.heightIn} in), maintenance is <span class="font-semibold text-gray-900">${EX_MAINTAIN.targetCalories.toLocaleString()} kcal/day</span>; moderate fat loss starts near ${EX.targetCalories.toLocaleString()} kcal/day.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="How to use calorie targets without guesswork"
        subtitle="A calorie number only works when it is tied to maintenance and realistic pacing."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Calorie Calculator Works"
        formula={`kg = lbs × 0.45359237
cm = in × 2.54

BMR (male) = 10 × kg + 6.25 × cm − 5 × age + 5
BMR (female) = 10 × kg + 6.25 × cm − 5 × age − 161
TDEE = BMR × activity multiplier

Goal adjustment:
Lose = TDEE × (1 − deficit %)
Maintain = TDEE
Gain = TDEE × (1 + surplus %)

Daily delta = target calories − TDEE
Weekly change (lb) = (daily delta × 7) ÷ 3,500

Macro targets:
Protein grams = bodyweight(lb) × goal protein factor
Fat calories = target calories × goal fat share
Carb calories = target calories − protein calories − fat calories`}
        steps={[
          { label: "Enter age, sex, height, and weight", description: "These inputs determine your resting energy estimate (BMR)." },
          { label: "Set activity multiplier", description: "Your BMR is scaled by activity to produce maintenance calories (TDEE)." },
          { label: "Choose goal and pace", description: "The model applies a deficit, no change, or surplus to produce the target calorie intake." },
          { label: "Review weekly trend estimate", description: "Daily calorie delta is converted to a weekly planning estimate using 3,500 kcal/lb." },
          { label: "Use macro split", description: "Protein and fat anchors are set first; carbs fill remaining calories." },
        ]}
        paragraphs={[
          "This calculator is a planning model, not a diagnosis tool. Real-world energy expenditure can vary by sleep, stress, movement patterns, and training quality.",
          "Use the result as a starting point, then adjust from your 2-4 week trend in body weight and performance instead of reacting to day-to-day scale noise.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Pair this with adjacent tools to tighten your nutrition plan."
        items={RELATED_CALCS}
      />
    </main>
  );
}
