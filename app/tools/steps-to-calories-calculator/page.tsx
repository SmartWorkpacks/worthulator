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
  title: "Steps to Calories Calculator 2026 – How Many Calories Do You Burn Walking?",
  description:
    "Convert your daily step count into calories burned and weekly weight-loss potential. Find out what 8,000, 10,000, or 15,000 steps per day really does.",
  keywords: ["steps to calories calculator", "how many calories burned walking", "steps calories converter", "10000 steps calories"],
  alternates: { canonical: "https://worthulator.com/tools/steps-to-calories-calculator" },
};

const FAQS = [
  {
    q: "How many calories does 10,000 steps burn?",
    a: "10,000 steps burns approximately 400 calories for the average adult, using the widely accepted estimate of 0.04 calories per step. This varies by body weight, walking speed, and terrain — heavier individuals and faster walkers burn more.",
  },
  {
    q: "How many steps are needed to lose 1 pound?",
    a: "It takes approximately 87,500 steps to burn 3,500 calories — the energy equivalent of 1 pound of fat. At 10,000 steps/day, that takes roughly 9 days of walking, assuming no changes to diet.",
  },
  {
    q: "Is 0.04 calories per step accurate for everyone?",
    a: "It is a good average estimate. Research from the American Council on Exercise suggests 0.03–0.05 calories per step depending on body weight. A 200lb person burns closer to 0.05 cal/step, while a 130lb person burns around 0.03.",
  },
  {
    q: "Does walking count as exercise for weight loss?",
    a: "Yes. Walking is one of the most sustainable forms of physical activity for weight management. Combined with a modest calorie reduction, consistent daily walking of 8,000–12,000 steps has been shown to produce meaningful weight loss over 12–24 weeks.",
  },
  {
    q: "What is a good step count goal per day?",
    a: "Research suggests 7,000–10,000 steps per day is associated with significant reductions in all-cause mortality. While 10,000 is a popular benchmark, even increasing from 4,000 to 7,000 steps produces measurable health benefits.",
  },
];

const STATS = [
  { stat: "400 cal", color: "text-emerald-600", accent: "bg-emerald-500", label: "approximate calories burned at 10,000 steps per day" },
  { stat: "1 lb", color: "text-amber-600", accent: "bg-amber-500", label: "of fat equals 3,500 calories — about 87,500 steps at average pace" },
  { stat: "7,000", color: "text-blue-600", accent: "bg-blue-500", label: "steps per day is linked to a 50–70% reduction in mortality risk in studies" },
];

const CONTENT_CARDS = [
  {
    icon: "👟",
    title: "Walking is underrated",
    body: "Walking does not feel like exercise, which makes it one of the most sustainable habits for long-term health. Unlike gym workouts, it requires no equipment, no schedule, and no recovery time.",
  },
  {
    icon: "📉",
    title: "Steps and weight loss",
    body: "Walking alone rarely produces dramatic weight loss, but it creates a consistent calorie deficit that compounds over time. Combine it with a moderate dietary adjustment and results accelerate significantly.",
  },
  {
    icon: "⌚",
    title: "How to hit your target",
    body: "Park further away, take the stairs, walk during calls, and use a lunch break walk. Most people can add 3,000–5,000 steps per day without any dedicated workout time — just deliberate habit changes.",
  },
];

const RELATED_CALCS = [
  { title: "TDEE Calculator", description: "Find your total daily calorie needs.", href: "/tools/tdee-calculator", icon: "🔥", accent: "bg-red-500/10" },
  { title: "Calorie Deficit Calculator", description: "Set a calorie deficit for your weight goal.", href: "/tools/calorie-deficit-calculator", icon: "📊", accent: "bg-emerald-500/10" },
  { title: "Macro Calculator", description: "Calculate your ideal protein, carbs, and fat.", href: "/tools/macro-calculator", icon: "🥗", accent: "bg-amber-500/10" },
  { title: "Biological Age Calculator", description: "See how exercise affects your biological age.", href: "/tools/biological-age-calculator", icon: "🧬", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Steps to Calories Calculator",
      url: "https://worthulator.com/tools/steps-to-calories-calculator",
      applicationCategory: "HealthApplication",
      description: "Convert your daily step count into calories burned and weekly weight-loss potential.",
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

export default function StepsToCaloriesCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="👟"
        eyebrowText="Steps to Calories"
        title="How Many Calories Do Your Daily Steps Burn?"
        description="Enter your daily step count to see calories burned, weekly totals, and your weight-loss potential from walking alone."
        chips={["Calories burned", "Weekly total", "Weight loss estimate"]}
      >
        <CalculatorEngineLoader slug="steps-to-calories-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="10,000 steps/day burns ~400 calories — enough to lose 1 lb every 9 days." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Make every step count" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Steps to Calories Calculator Works"
        paragraphs={[
          "The calculator multiplies your daily steps by 0.04 — a widely accepted estimate of calories burned per step for an average adult. Weekly calories are the daily figure multiplied by 7.",
          "Weight-loss potential is calculated by dividing weekly calorie burn by 3,500 — the number of calories equivalent to one pound of body fat. This figure assumes no change in diet or other activity.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
