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
  title: "Body Fat Calculator 2026 – Estimate Body Fat % Using the Navy Method",
  description:
    "Calculate your body fat percentage using the US Navy method. Enter your weight, height, waist, and neck measurements to estimate body fat %, fat mass, and lean mass.",
  keywords: ["body fat calculator", "body fat percentage calculator", "navy method body fat", "how to calculate body fat", "body fat estimator"],
  alternates: { canonical: "https://worthulator.com/tools/body-fat-calculator" },
};

const FAQS = [
  {
    q: "How accurate is the Navy body fat method?",
    a:
      "The US Navy circumference method has a margin of error of approximately ±3–4% compared to DEXA scan (considered the gold standard). It's less accurate than hydrostatic weighing or DEXA but significantly better than BMI and far more accessible — no equipment required beyond a tape measure.",
  },
  {
    q: "What is a healthy body fat percentage?",
    a:
      "For men: Essential fat = 2–5%, Athletic = 6–13%, Fit = 14–17%, Average = 18–24%, Obese = 25%+. For women: Essential = 10–13%, Athletic = 14–20%, Fit = 21–24%, Average = 25–31%, Obese = 32%+. These are general guidelines — athletic performance and health outcomes vary by individual.",
  },
  {
    q: "How do I measure waist and neck for this calculator?",
    a:
      "Waist: Measure at the narrowest point (typically just above the navel for men, or at the smallest circumference for women). Keep the tape parallel to the floor and measure at the end of a normal exhale. Neck: Measure just below the larynx (Adam's apple), tape perpendicular to the spine.",
  },
  {
    q: "What is the difference between fat mass and lean mass?",
    a:
      "Fat mass = total body weight × body fat %. Lean mass = everything else — muscle, bone, organs, connective tissue, water. Lean mass is often used as a proxy for muscle mass, though they're not identical. Tracking lean mass over time shows whether you're gaining muscle or losing it.",
  },
  {
    q: "Is BMI a better measure than body fat percentage?",
    a:
      "No — BMI (Body Mass Index) only accounts for height and weight, not body composition. A muscular athlete and an obese person can have the same BMI. Body fat percentage is a far more meaningful health metric. BMI is a population-level screening tool, not an individual diagnostic.",
  },
];

const STATS = [
  { stat: "±3–4%", color: "text-emerald-600", accent: "bg-emerald-500", label: "Navy method accuracy vs DEXA scan (the gold standard)" },
  { stat: "28%", color: "text-blue-600", accent: "bg-blue-500", label: "average body fat percentage for adult American males" },
  { stat: "40%", color: "text-amber-600", accent: "bg-amber-500", label: "average body fat percentage for adult American females" },
];

const CONTENT_CARDS = [
  {
    icon: "📐",
    title: "Measure consistently for tracking",
    body: "Body fat measurements vary based on time of day, hydration, and measurement technique. For consistent tracking, always measure at the same time of day (morning, after using the toilet), with the same tape measure, relaxed posture, and using the same measurement landmarks. Changes over weeks matter — daily variation is noise.",
  },
  {
    icon: "💪",
    title: "Lean mass is more important than body fat",
    body: "Two people can have the same body fat percentage but very different health and performance profiles if their lean mass differs. Focus on building and preserving lean mass (through resistance training and adequate protein) rather than obsessing over fat percentage alone.",
  },
  {
    icon: "🔬",
    title: "More accurate methods exist",
    body: "For the most accurate body fat measurement: DEXA scan ($50–$150) gives a full body composition breakdown including bone density. Hydrostatic weighing is also highly accurate. InBody or bioelectrical impedance scales are convenient but can be off by 5%+ depending on hydration levels.",
  },
];

const RELATED_CALCS = [
  { title: "TDEE Calculator", description: "Find your daily calorie maintenance target.", href: "/tools/tdee-calculator", icon: "🔥", accent: "bg-emerald-500/10" },
  { title: "Macro Calculator", description: "Get your daily macro targets.", href: "/tools/macro-calculator", icon: "💪", accent: "bg-blue-500/10" },
  { title: "Caffeine Half-Life Calculator", description: "Optimise your sleep and recovery.", href: "/tools/caffeine-half-life", icon: "☕", accent: "bg-amber-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Body Fat Calculator",
      url: "https://worthulator.com/tools/body-fat-calculator",
      applicationCategory: "HealthApplication",
      description: "Estimate body fat percentage using the US Navy circumference method.",
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

export default function BodyFatCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="📏"
        eyebrowText="Body Fat Calculator"
        title="What Is Your Body Fat Percentage?"
        description="Estimate body fat % using the US Navy circumference method. Enter your weight, height, waist, and neck measurements — no gym equipment needed."
        chips={["Navy formula", "Fat mass + lean mass", "No equipment needed"]}
      >
        <CalculatorEngineLoader slug="body-fat-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="The US Navy method gives body fat estimates within ±3–4% of DEXA scan accuracy — from just a tape measure." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Body fat: what the numbers mean"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Body Fat Calculator Works"
        paragraphs={[
          "US Navy formula (male): body fat % = 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76. All measurements in inches. Fat mass = weight × (body fat % ÷ 100). Lean mass = weight − fat mass.",
          "This calculator uses the male Navy formula. For women, the formula also includes hip measurement: % = 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387. Take all measurements in a relaxed state, tape parallel to the floor, at the end of a normal exhale.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
