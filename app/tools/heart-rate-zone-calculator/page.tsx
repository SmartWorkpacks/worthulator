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
  title: "Heart Rate Zone Calculator 2026 – Max HR, Fat Burn & Cardio Zones",
  description:
    "Calculate your maximum heart rate and target heart rate zones for fat burning, cardio training, and peak performance. Based on the 220 minus age formula.",
  keywords: ["heart rate zone calculator", "target heart rate calculator", "max heart rate calculator", "fat burn zone calculator", "cardio heart rate zones"],
  alternates: { canonical: "https://worthulator.com/tools/heart-rate-zone-calculator" },
};

const FAQS = [
  {
    q: "How do you calculate maximum heart rate?",
    a: "The most widely used formula is 220 − age. For a 35-year-old, max HR = 185 bpm. This is an estimate — individual max HR can vary by ±10–15 bpm from this formula. More accurate formulas include the Tanaka formula (208 − 0.7 × age), which is considered more accurate for older adults and athletes. The only way to measure true max HR is a maximal exercise test.",
  },
  {
    q: "What is the fat burn heart rate zone?",
    a: "The fat burn zone is typically 60–70% of maximum heart rate. In this range, your body uses a higher proportion of fat as fuel compared to carbohydrates. However, 'higher fat percentage' doesn't mean more total fat burned — higher intensity zones burn more total calories, including more total fat in absolute terms. The fat burn zone is best for long, sustained low-impact cardio sessions.",
  },
  {
    q: "What is the cardio training zone?",
    a: "The cardio zone is 70–85% of max HR. This is where cardiovascular improvements are most efficiently made — increased stroke volume, improved VO2 max, and better aerobic endurance. Most steady-state cardio (running, cycling, rowing) should target this zone. This is also where calorie burn per minute is significantly higher than the fat burn zone.",
  },
  {
    q: "What is the peak heart rate zone used for?",
    a: "The peak zone (85–100% of max HR) is used for high-intensity interval training (HIIT), sprint intervals, and VO2 max efforts. Training in this zone improves anaerobic capacity, lactate threshold, and maximal oxygen uptake. Spending extended time here is unsustainable — HIIT typically involves 20–60 second bursts followed by recovery periods. Limit peak zone work to 2–3 sessions/week.",
  },
  {
    q: "How do I measure my heart rate during exercise?",
    a: "Options include: chest strap monitors (most accurate, e.g. Polar H10), wrist-based optical HR sensors (in most smartwatches — convenient but less accurate during high-intensity exercise), fingertip pulse oximeters (for resting HR), and manual pulse counting (count beats for 15 seconds and multiply by 4). For training in specific zones, a chest strap with real-time HR is the most reliable tool.",
  },
];

const STATS = [
  { stat: "220−age", color: "text-emerald-600", accent: "bg-emerald-500", label: "standard max heart rate formula — the foundation of all HR zone calculations" },
  { stat: "60–85%", color: "text-blue-600", accent: "bg-blue-500", label: "of max HR is the effective training range for fat burn and cardio zones" },
  { stat: "±12 bpm", color: "text-amber-600", accent: "bg-amber-500", label: "typical individual variation from the 220−age formula estimate" },
];

const CONTENT_CARDS = [
  {
    icon: "❤️",
    title: "Zone 2 training is underrated",
    body: "Zone 2 (roughly fat burn zone, 60–70% max HR) is the foundation of endurance and metabolic health. Consistent Zone 2 training improves mitochondrial density, fat oxidation, and aerobic base — the improvements that high-intensity work builds on top of. Elite endurance athletes spend 80% of their training in Zone 2. Most recreational athletes spend far too little time here.",
  },
  {
    icon: "⚡",
    title: "HIIT vs steady-state cardio",
    body: "HIIT (alternating peak zone and recovery) produces similar cardiovascular improvements to steady-state cardio in far less time — a key advantage for people with limited schedules. However, HIIT is higher stress on the body and requires more recovery. The best approach is to combine: 2–3 Zone 2 sessions per week for base fitness, 1–2 HIIT sessions for intensity, and structured rest days.",
  },
  {
    icon: "🎯",
    title: "Adjust zones for real fitness level",
    body: "The 220−age formula is a population average. Fit individuals typically have lower resting HR and may be able to sustain higher percentages of max HR for longer. Track how you actually feel at each percentage and adjust zones based on perceived exertion (RPE scale 1–10) in addition to the calculated numbers. Zones should match both your heart rate and your breathing rate.",
  },
];

const RELATED_CALCS = [
  { title: "BMR Calculator", description: "Calories burned at rest using Mifflin-St Jeor.", href: "/tools/bmr-calculator", icon: "🔥", accent: "bg-emerald-500/10" },
  { title: "TDEE Calculator", description: "Total daily calorie needs including activity.", href: "/tools/tdee-calculator", icon: "🏃", accent: "bg-blue-500/10" },
  { title: "Steps to Calories Calculator", description: "Convert step count to calories burned.", href: "/tools/steps-to-calories-calculator", icon: "👟", accent: "bg-amber-500/10" },
  { title: "Running Pace Calculator", description: "Calculate pace, distance, and finish time.", href: "/tools/running-pace-calculator", icon: "🏃", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Heart Rate Zone Calculator",
      url: "https://worthulator.com/tools/heart-rate-zone-calculator",
      applicationCategory: "HealthApplication",
      description: "Calculate your maximum heart rate and target heart rate zones for fat burn, cardio, and peak training.",
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

export default function HeartRateZoneCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="❤️"
        eyebrowText="Heart Rate Zone Calculator"
        title="What Are Your Target Heart Rate Zones?"
        description="Enter your age to instantly calculate your maximum heart rate and precise bpm ranges for fat burn, cardio, and peak training zones."
        chips={["Max HR calculated", "Fat burn zone", "Cardio & peak zones"]}
      >
        <CalculatorEngineLoader slug="heart-rate-zone-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Train in the right zone — <span class='font-semibold text-gray-900'>Zone 2 (60–70% max HR)</span> builds the aerobic base that all other training depends on." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Training smarter with heart rate zones" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Heart Rate Zone Calculator Works"
        formula="Max HR = 220 − Age\nFat Burn Zone = Max HR × 60% to 70%\nCardio Zone = Max HR × 70% to 85%\nPeak Zone = Max HR × 85%+"
        paragraphs={[
          "This calculator uses the widely accepted 220 minus age formula to estimate maximum heart rate. Individual variation can be ±10–15 bpm from this estimate.",
          "Training zones are defined as percentages of max HR. Fat burn (60–70%) prioritises aerobic fat oxidation. Cardio (70–85%) maximises cardiovascular adaptation. Peak (85%+) is reserved for high-intensity intervals and sprint efforts.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
