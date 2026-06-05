import type { Metadata } from "next";
import MaintenanceCalorieCalculatorLoader from "./MaintenanceCalorieCalculatorLoader";
import { calculateMaintenanceCalories } from "@/lib/calculators/maintenanceCalorieEngine";
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
  title: "Maintenance Calorie Calculator - Calories to Maintain Weight",
  description:
    "Find your maintenance calories — the daily intake that keeps your weight steady. Uses the Mifflin-St Jeor equation with your activity level, plus BMR, a balanced macro split, and cut and bulk targets.",
  keywords: [
    "maintenance calorie calculator",
    "maintenance calories",
    "tdee calculator",
    "calories to maintain weight",
    "how many calories to maintain weight",
  ],
  alternates: { canonical: "https://worthulator.com/tools/maintenance-calorie-calculator" },
  robots: { index: true, follow: true },
};

// Deterministic worked examples computed at build from the engine.
const EX = calculateMaintenanceCalories({ age: 30, sex: "male", heightIn: 70, weightLbs: 175, activityMultiplier: 1.55 });
const SEDENTARY = calculateMaintenanceCalories({ age: 30, sex: "male", heightIn: 70, weightLbs: 175, activityMultiplier: 1.2 });
const ACTIVE = calculateMaintenanceCalories({ age: 30, sex: "male", heightIn: 70, weightLbs: 175, activityMultiplier: 1.725 });

const kcal = (n: number) => `${Math.round(n).toLocaleString()} kcal`;

const FAQS = [
  {
    q: "What are maintenance calories?",
    a: `Maintenance calories are the amount you can eat each day to keep your weight stable — your total daily energy expenditure (TDEE). For a 30-year-old, 5'10", 175 lb man training a few days a week, that's about ${kcal(EX.maintenanceCalories)}.`,
  },
  {
    q: "How are maintenance calories calculated?",
    a: `We estimate your resting burn (BMR) with the Mifflin-St Jeor equation — ${kcal(EX.bmr)} in the example — then multiply by an activity factor from 1.2 (sedentary) to 1.9 (extra active). BMR × activity = your maintenance calories.`,
  },
  {
    q: "How much does activity change my maintenance calories?",
    a: `A lot. With the same body, sedentary maintenance is about ${kcal(SEDENTARY.maintenanceCalories)}, while training 6–7 days a week pushes it to roughly ${kcal(ACTIVE.maintenanceCalories)} — a difference of about ${kcal(ACTIVE.maintenanceCalories - SEDENTARY.maintenanceCalories)} a day.`,
  },
  {
    q: "How do I lose or gain weight from maintenance?",
    a: `Eat below maintenance to lose and above to gain. A 500 kcal/day deficit (about ${kcal(EX.mildCutCalories)} here) targets roughly 1 lb of fat loss per week; a gentle 300 kcal surplus (${kcal(EX.leanBulkCalories)}) supports a lean gain.`,
  },
  {
    q: "Is this the same as a TDEE calculator?",
    a: `Yes — maintenance calories and TDEE are the same number. This tool focuses on that single figure and shows how it shifts with activity, plus a balanced macro split, so you have a clear baseline to build a cut or bulk around.`,
  },
];

const STATS = [
  {
    stat: kcal(EX.maintenanceCalories),
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "Maintenance calories — 30 yr, 5'10\", 175 lb, moderately active",
  },
  {
    stat: kcal(EX.bmr),
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "Resting burn (BMR) before activity",
  },
  {
    stat: kcal(EX.mildCutCalories),
    color: "text-rose-600",
    accent: "bg-rose-500",
    label: "Cut target for ~1 lb/week of fat loss",
  },
];

const CONTENT_CARDS = [
  {
    icon: "⚖️",
    title: "Your weight-stable baseline",
    body: "Maintenance calories are the anchor for any nutrition plan. Eat at maintenance to hold steady, then adjust up or down deliberately when you want to change your weight.",
  },
  {
    icon: "🏃",
    title: "Activity is the biggest lever",
    body: "Your resting burn barely moves day to day, but how much you move can swing maintenance by hundreds of calories. The activity chart shows exactly how much.",
  },
  {
    icon: "🍗",
    title: "Macros, not just calories",
    body: "We split your maintenance calories into a balanced protein, carb, and fat target so you can hit your number with a setup that supports training and recovery.",
  },
];

const RELATED_CALCS = [
  {
    title: "Calorie Calculator",
    description: "Full lose, maintain, or gain targets with pace.",
    href: "/tools/calorie-calculator",
    icon: "🔥",
    accent: "bg-rose-500/10",
  },
  {
    title: "TDEE Calculator",
    description: "Your total daily energy expenditure.",
    href: "/tools/tdee-calculator",
    icon: "📊",
    accent: "bg-blue-500/10",
  },
  {
    title: "BMR Calculator",
    description: "Resting calories before any activity.",
    href: "/tools/bmr-calculator",
    icon: "😴",
    accent: "bg-violet-500/10",
  },
  {
    title: "Macro Calculator",
    description: "Split your calories into protein, carbs, fat.",
    href: "/tools/macro-calculator",
    icon: "🥗",
    accent: "bg-emerald-500/10",
  },
];

export default function MaintenanceCalorieCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Maintenance Calorie Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description:
        "Calculate your maintenance calories (TDEE) using the Mifflin-St Jeor equation and your activity level, with BMR, macro split, and cut and bulk targets.",
      url: "https://worthulator.com/tools/maintenance-calorie-calculator",
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
        eyebrowIcon="⚖️"
        eyebrowText="Health · Nutrition"
        title="Maintenance Calorie Calculator"
        description="Find the daily calories that keep your weight steady. Enter your stats and activity level for your maintenance number (TDEE), your resting burn, a balanced macro split, and ready-made cut and bulk targets."
        chips={["Mifflin-St Jeor", "Maintenance + macros", "Cut & bulk targets"]}
      >
        <MaintenanceCalorieCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A moderately active 175 lb adult maintains weight around <span class="font-semibold text-gray-900">${kcal(EX.maintenanceCalories)}</span> a day — about ${kcal(EX.bmr)} at rest, lifted by movement. Drop to ${kcal(EX.mildCutCalories)} to lose ~1 lb a week.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Maintenance calories, made practical"
        subtitle="One baseline number, where it comes from, and how to use it."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Maintenance Calorie Calculator Works"
        formula={`BMR (Mifflin-St Jeor):
    men:   10·kg + 6.25·cm − 5·age + 5
    women: 10·kg + 6.25·cm − 5·age − 161
maintenance = BMR × activity factor
    1.2 sedentary · 1.375 light · 1.55 moderate
    1.725 very active · 1.9 extra active
cut  = maintenance − 500   (≈ 1 lb/week)
bulk = maintenance + 300`}
        steps={[
          { label: "Enter your profile", description: "Sex, age, height, and weight set your BMR." },
          { label: "Pick your activity level", description: "From sedentary to extra active — the biggest lever." },
          { label: "Read your maintenance", description: "BMR × activity is the daily intake that holds your weight." },
          { label: "Check your macros", description: "A balanced protein, carb, and fat split for that number." },
          { label: "Choose a direction", description: "Use the cut or bulk target to lose or gain on purpose." },
        ]}
        paragraphs={[
          `Maintenance calories — also called TDEE — are an estimate, not a fixed law. Real intake needs vary with body composition, genetics, NEAT (everyday fidgeting and movement), and how accurately you log food. Treat your maintenance number as a starting point: eat at it for two to three weeks, track your weight trend, and nudge up or down by 100–200 calories if the scale isn't doing what you want.`,
          `This calculator is for general fitness planning and isn't medical or dietary advice. If you're pregnant, managing a health condition, or planning a large or rapid weight change, check with a doctor or registered dietitian before making big adjustments.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Go deeper on energy, macros, and your full calorie plan."
        items={RELATED_CALCS}
      />
    </main>
  );
}
