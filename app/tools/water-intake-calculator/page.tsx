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
  title: "Water Intake Calculator 2026 – How Much Water Should You Drink?",
  description:
    "Calculate your ideal daily water intake based on your body weight and exercise level. Instantly see your target in oz, glasses, and liters.",
  keywords: ["water intake calculator", "how much water should I drink", "daily water intake", "hydration calculator", "water per day calculator"],
  alternates: { canonical: "https://worthulator.com/tools/water-intake-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much water should I drink per day?",
    a: "A common guideline is 0.5 oz per pound of body weight. For a 160 lb person, that's 80 oz (about 10 glasses or 2.4 liters). Adjust upward for exercise, hot climates, illness, and pregnancy.",
  },
  {
    q: "Does the '8 glasses of water a day' rule hold up?",
    a: "Eight 8-oz glasses (64 oz total) is a helpful baseline but it's not individually calibrated. Body weight, activity level, climate, and diet all affect hydration needs. 8×8 is a floor, not a target for everyone.",
  },
  {
    q: "How much extra water do I need when exercising?",
    a: "A common recommendation is 12 oz of additional water per 30 minutes of exercise. This calculator adds that on top of your baseline. For high-intensity workouts or hot environments, you may need 16–20 oz per 30 minutes.",
  },
  {
    q: "Does coffee count toward daily water intake?",
    a: "Moderate coffee consumption (3–4 cups) does count toward hydration — the diuretic effect is mild and doesn't cancel the water content. However, alcohol is dehydrating and does not count toward your intake. Sports drinks count but add unnecessary sugar for most people.",
  },
  {
    q: "What are signs of dehydration?",
    a: "Mild dehydration: dark urine, thirst, dry mouth, mild headache. Moderate: dizziness, reduced urine, fatigue. Severe: confusion, rapid heartbeat, no urination. Urine color is the easiest daily check — pale yellow is ideal, darker means drink more.",
  },
];

const STATS = [
  { stat: "0.5oz",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Water per pound of body weight — the standard baseline daily intake guideline" },
  { stat: "60–70%", color: "text-blue-600",    accent: "bg-blue-500",    label: "Of the human body is water — proper hydration affects nearly every system" },
  { stat: "12oz",   color: "text-amber-600",   accent: "bg-amber-500",   label: "Additional water recommended per 30 minutes of exercise" },
];

const CONTENT_CARDS = [
  {
    icon: "🧠",
    title: "Dehydration affects your brain first",
    body: "Studies show that just 1–2% dehydration impairs mood, concentration, and working memory. Most people reach this level before they feel thirsty — by the time you're thirsty, you're already mildly dehydrated. Consistent intake beats reactive drinking.",
  },
  {
    icon: "⚖️",
    title: "Hydration and weight management",
    body: "Drinking water before meals reduces caloric intake on average. Thirst is also often mistaken for hunger — a glass of water first can prevent unnecessary snacking. Many people on fat-loss diets improve results significantly just by improving hydration.",
  },
  {
    icon: "🌡️",
    title: "When your intake needs to go up",
    body: "Hot climates, fever, vomiting, diarrhea, high-altitude environments, and pregnancy all significantly increase water needs. During illness or intense summer heat, add 16–32 oz above your baseline to compensate for increased fluid loss.",
  },
];

const RELATED_CALCS = [
  { title: "Calorie Deficit Calculator",   description: "Calculate a daily calorie deficit for weight loss.",   href: "/tools/calorie-deficit-calculator",   icon: "🥗", accent: "bg-emerald-500/10" },
  { title: "Quit Smoking Calculator",      description: "See the money and health benefits of quitting.",        href: "/tools/quit-smoking-calculator",      icon: "🚭", accent: "bg-blue-500/10" },
  { title: "BMI Calculator",               description: "Calculate your Body Mass Index.",                       href: "/tools/bmi-calculator",               icon: "📊", accent: "bg-amber-500/10" },
  { title: "Emergency Fund Calculator",    description: "Calculate your ideal emergency fund target.",           href: "/tools/emergency-fund-calculator",    icon: "🛡️", accent: "bg-purple-500/10" },
];

export default function WaterIntakeCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Water Intake Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description: "Calculate your ideal daily water intake based on body weight and exercise level.",
      url: "https://worthulator.com/tools/water-intake-calculator",
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
        eyebrowIcon="💧"
        eyebrowText="Health · Fitness"
        title="Water Intake Calculator"
        description="Find your ideal daily water intake based on your body weight and exercise level — see your target in oz, glasses, and liters."
        chips={["Daily oz target", "Number of glasses", "Exercise adjustment"]}
      >
        <CalculatorEngineLoader slug="water-intake" />
      </SimpleCalculatorHero>
      <InsightStrip text='You&apos;re likely mildly dehydrated right now — <span class="font-semibold text-gray-900">thirst kicks in only after dehydration has already begun to impair performance.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Why hydration matters more than you think" subtitle="Water is involved in nearly every function in your body." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Water Intake Calculator Works"
        formula={`Base Intake (oz)    = Body Weight (lbs) × 0.5
Exercise Add-on    = (Exercise Minutes ÷ 30) × 12 oz
Total Daily (oz)   = Base + Exercise Add-on
Glasses (8 oz each) = Total ÷ 8
Liters             = Total × 0.0296`}
        steps={[
          { label: "Enter your body weight", description: "In pounds. The 0.5 oz/lb formula is the standard adult guideline." },
          { label: "Enter exercise minutes", description: "Daily average exercise time. 0 minutes means baseline intake only." },
          { label: "Read your targets", description: "Total daily oz, number of 8-oz glasses, and liters — all three for convenience." },
        ]}
        paragraphs={[
          "This formula uses the widely-cited 0.5 oz per pound of body weight rule, plus 12 oz per 30 minutes of exercise as recommended by the American Council on Exercise.",
          "This calculator is a general guideline for healthy adults. Consult a healthcare provider for personalized recommendations, especially if you have kidney disease, heart conditions, or are pregnant.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for health and wellness goals." items={RELATED_CALCS} />
    </main>
  );
}
