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
  title: "Protein Intake Calculator 2026 – Daily Protein Target by Weight & Activity",
  description:
    "Calculate your daily protein intake in grams based on your body weight and activity level. From sedentary to elite athlete — get your exact protein target instantly.",
  keywords: ["protein intake calculator", "how much protein per day", "daily protein calculator", "protein needs by weight", "protein calculator for muscle gain"],
  alternates: { canonical: "https://worthulator.com/tools/protein-intake-calculator" },
};

const FAQS = [
  {
    q: "How much protein do I need per day?",
    a: "Protein needs depend on your body weight and activity level. General guidelines: sedentary adults need 0.8g/kg (minimum RDA); recreationally active people need 1.2–1.6g/kg; those building muscle with resistance training need 1.6–2.0g/kg; elite athletes and hard-trainers may benefit from 2.0–2.4g/kg. These are per kilogram of body weight.",
  },
  {
    q: "Should I calculate protein based on body weight or lean mass?",
    a: "For accuracy, base protein on lean body mass (total weight minus fat mass) rather than total weight — especially if body fat percentage is high. However, for simplicity, total body weight is an acceptable and commonly used starting point. If your body fat is above 30%, consider using your goal body weight as the basis instead.",
  },
  {
    q: "What happens if I eat too little protein?",
    a: "Protein deficiency impairs muscle repair, immune function, hormone production, and enzyme activity. In a calorie deficit, insufficient protein accelerates muscle loss (catabolism). Ensuring adequate protein while dieting is critical for preserving lean mass and maintaining metabolic rate. Most people eating whole foods meet the 0.8g/kg RDA but fall short of performance-optimised levels.",
  },
  {
    q: "Can you eat too much protein?",
    a: "For healthy adults with normal kidney function, high protein intakes (up to 3g/kg) appear safe in research. The concern about protein damaging kidneys applies primarily to people with pre-existing kidney disease. Excessive protein may displace other important macronutrients if taken to extremes. Practically, eating above 2.4g/kg adds no further muscle-building benefit for most people.",
  },
  {
    q: "What are the best sources of protein?",
    a: "Complete proteins (all essential amino acids): chicken breast (~31g/100g), Greek yoghurt (~10g/100g), eggs (~13g/100g), canned tuna (~25g/100g), cottage cheese (~11g/100g), lentils (~9g/100g, plant-based). For convenience: whey protein powder (~25g/scoop), edamame (~11g/100g). Aim to get the majority of protein from whole food sources rather than supplements.",
  },
];

const STATS = [
  { stat: "1.6 g/kg", color: "text-emerald-600", accent: "bg-emerald-500", label: "per kg of body weight — optimal protein for recreational gym-goers" },
  { stat: "4 kcal", color: "text-blue-600", accent: "bg-blue-500", label: "calories per gram of protein — the same as carbohydrates" },
  { stat: "0.8 g/kg", color: "text-amber-600", accent: "bg-amber-500", label: "per kg — the minimum daily protein recommended by WHO for sedentary adults" },
];

const CONTENT_CARDS = [
  {
    icon: "🍗",
    title: "Distribute protein throughout the day",
    body: "Research suggests muscle protein synthesis is maximised when protein is spread across 3–5 meals of 20–40g each, rather than consumed in one large serving. Your body can only effectively use approximately 40g per meal for muscle building — consuming 100g in one sitting doesn't produce 2.5× the benefit. Aim for protein at every main meal.",
  },
  {
    icon: "⏰",
    title: "Protein timing around workouts",
    body: "The 'anabolic window' is real but wider than once thought. Consuming 20–40g of high-quality protein within 2 hours post-workout supports muscle protein synthesis. Pre-workout protein (within 1–2 hours before) is equally effective. The most important factor is total daily protein — timing matters less than hitting your daily target consistently.",
  },
  {
    icon: "🌱",
    title: "Plant-based protein requires more planning",
    body: "Plant proteins are generally less bioavailable and often incomplete (missing one or more essential amino acids). To compensate, plant-based eaters should aim for the higher end of protein targets (1.8–2.2g/kg) and combine protein sources throughout the day. Soy, quinoa, and hemp are complete plant proteins. Combining rice + beans or peanut butter + whole grain covers all essential amino acids.",
  },
];

const RELATED_CALCS = [
  { title: "BMR Calculator", description: "Calculate your basal metabolic rate.", href: "/tools/bmr-calculator", icon: "🔥", accent: "bg-emerald-500/10" },
  { title: "TDEE Calculator", description: "Total daily calorie needs by activity level.", href: "/tools/tdee-calculator", icon: "🏃", accent: "bg-blue-500/10" },
  { title: "Macro Calculator", description: "Daily protein, carb, and fat targets.", href: "/tools/macro-calculator", icon: "🥗", accent: "bg-amber-500/10" },
  { title: "Calorie Deficit Calculator", description: "Create a deficit for your weight loss goal.", href: "/tools/calorie-deficit-calculator", icon: "📉", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Protein Intake Calculator",
      url: "https://worthulator.com/tools/protein-intake-calculator",
      applicationCategory: "HealthApplication",
      description: "Calculate your daily protein target in grams based on your body weight and activity or training level.",
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

export default function ProteinIntakeCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="💪"
        eyebrowText="Protein Intake Calculator"
        title="How Much Protein Do You Need Each Day?"
        description="Enter your body weight and activity level to get your daily protein target in grams and calories from protein — from the RDA minimum to elite athlete levels."
        chips={["Grams per day", "Calories from protein", "5 activity levels"]}
      >
        <CalculatorEngineLoader slug="protein-intake-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="For muscle building, aim for <span class='font-semibold text-gray-900'>1.6–2.0g of protein per kg</span> of body weight per day — spread across 3–5 meals." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Getting protein right for your goals" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Protein Intake Calculator Works"
        formula="Daily Protein (g) = Body Weight (kg) × Multiplier (g/kg)\nCalories from Protein = Protein Grams × 4"
        paragraphs={[
          "Select your activity level to set the protein multiplier (0.8–2.4g per kg of bodyweight). Multiply by your weight to get your daily gram target. Protein provides 4 kcal per gram, so the calculator also shows the calorie contribution from protein alone.",
          "These are general population-based targets. Individual needs vary based on training type, age (older adults need more), injury recovery status, and specific body composition goals.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
