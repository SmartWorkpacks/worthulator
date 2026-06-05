import type { Metadata } from "next";
import EngineWithInsights from "@/components/worthcore/EngineWithInsights";
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
    "Calculate your daily protein target in grams from body weight (lb or kg) and activity level. See calories from protein, a per-meal split, and the muscle-building range.",
  keywords: ["protein intake calculator", "how much protein per day", "daily protein calculator", "protein needs by weight", "protein calculator for muscle gain"],
  alternates: { canonical: "https://worthulator.com/tools/protein-intake-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much protein do I need per day?",
    a: "It depends on body weight and activity. General guidelines per kilogram: sedentary adults ~0.8 g/kg (the WHO minimum); recreationally active 1.2–1.6 g/kg; building muscle with resistance training 1.6–2.0 g/kg; elite athletes or those in a deficit 2.0–2.4 g/kg. Pick your activity level and the calculator multiplies it by your weight to get a gram target.",
  },
  {
    q: "Should I base protein on body weight or lean mass?",
    a: "Lean body mass (weight minus fat) is most accurate, especially at higher body-fat levels. But total body weight is a perfectly acceptable and common starting point. If your body fat is above ~30%, consider using your goal weight as the basis instead so you don't overshoot.",
  },
  {
    q: "How much protein can my body use per meal?",
    a: "Research suggests muscle protein synthesis is maximised at roughly 20–40 g of protein per meal. Eating 100 g in one sitting doesn't produce 2.5× the benefit — it's better spread across 3–5 meals. This calculator divides your daily target by your meals per day and flags when a serving exceeds the ~40 g ceiling.",
  },
  {
    q: "Can you eat too much protein?",
    a: "For healthy adults with normal kidney function, intakes up to ~3 g/kg appear safe in research. Kidney concerns mainly apply to people with pre-existing kidney disease. Practically, going above ~2.4 g/kg adds no further muscle-building benefit for most people and can crowd out other nutrients.",
  },
  {
    q: "What are good sources of protein?",
    a: "Per 100 g: chicken breast ~31 g, canned tuna ~25 g, eggs ~13 g (≈6.3 g each), Greek yoghurt ~10 g, cottage cheese ~11 g, lentils ~9 g. Whey powder adds ~25 g per scoop for convenience. Aim to get most of your target from whole foods and treat powder as a top-up.",
  },
];

const STATS = [
  { stat: "1.6 g/kg", color: "text-emerald-600", accent: "bg-emerald-500", label: "per kg of body weight — optimal protein for recreational gym-goers" },
  { stat: "40 g",     color: "text-blue-600",    accent: "bg-blue-500",    label: "approximate protein your body uses best per meal for muscle synthesis" },
  { stat: "0.8 g/kg", color: "text-amber-600",   accent: "bg-amber-500",   label: "per kg — the WHO daily minimum for sedentary adults" },
];

const CONTENT_CARDS = [
  {
    icon: "🍗",
    title: "Distribute protein across the day",
    body: "Muscle protein synthesis is maximised when protein is spread across 3–5 meals of 20–40 g rather than one large serving. The calculator shows your per-meal split so you can see whether your meal count keeps each serving in that effective range.",
  },
  {
    icon: "⏰",
    title: "Total daily protein beats timing",
    body: "The 'anabolic window' is real but wide — 20–40 g of quality protein within a couple of hours either side of training supports synthesis. But the single biggest factor is hitting your daily target consistently; timing is a fine-tune, not the foundation.",
  },
  {
    icon: "🌱",
    title: "Plant-based needs more planning",
    body: "Plant proteins are often less bioavailable and incomplete, so plant-based eaters should aim for the higher end of the range (1.8–2.2 g/kg) and combine sources. Soy, quinoa, and hemp are complete; rice + beans or peanut butter + whole grain cover all essential amino acids together.",
  },
];

const RELATED_CALCS = [
  { title: "BMR Calculator", description: "Calculate your basal metabolic rate.", href: "/tools/bmr-calculator", icon: "🔥", accent: "bg-emerald-500/10" },
  { title: "TDEE Calculator", description: "Total daily calorie needs by activity level.", href: "/tools/tdee-calculator", icon: "🏃", accent: "bg-blue-500/10" },
  { title: "Macro Calculator", description: "Daily protein, carb, and fat targets.", href: "/tools/macro-calculator", icon: "🥗", accent: "bg-amber-500/10" },
  { title: "Calorie Deficit Calculator", description: "Create a deficit for your weight-loss goal.", href: "/tools/calorie-deficit-calculator", icon: "📉", accent: "bg-purple-500/10" },
];

export default function ProteinIntakeCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Protein Intake Calculator",
      url: "https://worthulator.com/tools/protein-intake-calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description: "Calculate your daily protein target in grams from body weight and activity level.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="💪"
        eyebrowText="Health · Nutrition"
        title="Protein Intake Calculator"
        description="Enter your body weight (lb or kg) and activity level to get your daily protein target in grams, the calories it provides, and a per-meal split — from the RDA minimum to elite levels."
        chips={["Grams per day", "Per-meal split", "Muscle-building range"]}
      >
        <EngineWithInsights slug="protein-intake-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="For muscle building, aim for <span class='font-semibold text-gray-900'>1.6–2.0 g of protein per kg</span> of body weight per day — spread across 3–5 meals." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Getting protein right for your goals" subtitle="Targets, timing, and distribution." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Protein Intake Calculator Works"
        formula={`Weight (kg)          = Weight (lb) ÷ 2.205   (if entered in lb)
Daily Protein (g)    = Weight (kg) × Multiplier (g/kg)
Calories from Protein = Daily Protein (g) × 4
Per Meal (g)         = Daily Protein ÷ Meals per Day`}
        steps={[
          { label: "Enter your body weight", description: "In pounds or kilograms — toggle the unit to match." },
          { label: "Pick your activity level", description: "From sedentary (0.8 g/kg) up to elite athlete (2.4 g/kg)." },
          { label: "Set meals per day", description: "Used to split your target into per-meal servings." },
        ]}
        paragraphs={[
          "Your activity level sets the protein multiplier (0.8–2.4 g per kg of body weight). The calculator converts your weight to kilograms if needed, multiplies by the multiplier for a daily gram target, and shows the calories that protein provides at 4 kcal per gram.",
          "It also splits the target across your meals and surfaces the evidence-based muscle-building range (1.6–2.2 g/kg) so you can see where your number sits. These are general population targets — individual needs vary with training type, age, and recovery status.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More health and nutrition tools." items={RELATED_CALCS} />
    </main>
  );
}
