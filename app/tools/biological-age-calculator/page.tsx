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
  title: "Biological Age Calculator 2026 – Find Your Real Age",
  description:
    "Estimate your biological age based on sleep, exercise, BMI, and smoking. See how your lifestyle compares to your chronological age.",
  keywords: ["biological age calculator", "real age calculator", "how old am I biologically", "lifestyle age test"],
  alternates: { canonical: "https://worthulator.com/tools/biological-age-calculator" },
};

const FAQS = [
  {
    q: "What is biological age?",
    a: "Biological age is an estimate of how old your body appears to function compared to your chronological age. Two people who are 40 years old can have very different biological ages based on their lifestyle choices, genetics, and health habits.",
  },
  {
    q: "How is biological age calculated here?",
    a: "This calculator uses a simplified lifestyle-adjustment model. It adds years to your chronological age based on poor sleep (under 6 hours adds 5 years), insufficient exercise (under 2 days/week adds 4 years), smoking (adds 8 years), and high BMI (over 30 adds 6 years). Each factor is evidence-based.",
  },
  {
    q: "Can I reverse a high biological age?",
    a: "Yes. Biological ageing is largely modifiable. Quitting smoking, improving sleep consistency, exercising regularly, and maintaining a healthy weight can measurably reduce biological age markers within 6–12 months.",
  },
  {
    q: "How accurate is this calculator?",
    a: "This is a simplified screening tool, not a medical test. True biological age tests (like telomere length testing or epigenetic clocks) require laboratory analysis. This calculator gives a useful directional estimate for lifestyle awareness.",
  },
  {
    q: "What BMI should I aim for?",
    a: "A BMI between 18.5 and 24.9 is considered healthy for most adults. BMI above 30 is classified as obese and is associated with accelerated ageing, cardiovascular disease, and metabolic disorders. Use our BMI calculator to find yours.",
  },
];

const STATS = [
  { stat: "8 yrs", color: "text-red-600", accent: "bg-red-500", label: "average increase in biological age from smoking compared to non-smokers" },
  { stat: "6 yrs", color: "text-amber-600", accent: "bg-amber-500", label: "average biological age penalty associated with a BMI over 30" },
  { stat: "150 min", color: "text-emerald-600", accent: "bg-emerald-500", label: "of moderate exercise per week recommended to reduce ageing markers" },
];

const CONTENT_CARDS = [
  {
    icon: "🧬",
    title: "Sleep is the most powerful lever",
    body: "Consistently sleeping fewer than 6 hours per night accelerates cellular ageing, impairs immune function, and raises the risk of every major chronic disease. Protecting your sleep is one of the highest-ROI health investments.",
  },
  {
    icon: "🏃",
    title: "Exercise rewires your biology",
    body: "Regular physical activity reduces inflammation, improves insulin sensitivity, and preserves telomere length — a key marker of biological age. Just 150 minutes of moderate exercise per week can add years to your healthspan.",
  },
  {
    icon: "⚖️",
    title: "Weight and BMI matter",
    body: "A BMI over 30 is associated with chronic low-grade inflammation that accelerates biological ageing. Even modest reductions in body weight — 5–10% — produce measurable improvements in metabolic and cardiovascular markers.",
  },
];

const RELATED_CALCS = [
  { title: "TDEE Calculator", description: "Find your total daily energy expenditure.", href: "/tools/tdee-calculator", icon: "🔥", accent: "bg-red-500/10" },
  { title: "Body Fat Calculator", description: "Estimate your body fat percentage.", href: "/tools/body-fat-calculator", icon: "📏", accent: "bg-blue-500/10" },
  { title: "Water Intake Calculator", description: "Find your optimal daily hydration.", href: "/tools/water-intake-calculator", icon: "💧", accent: "bg-cyan-500/10" },
  { title: "Sleep Cycle Optimizer", description: "Find the best times to wake up rested.", href: "/tools/sleep-cycle-optimizer", icon: "😴", accent: "bg-indigo-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Biological Age Calculator",
      url: "https://worthulator.com/tools/biological-age-calculator",
      applicationCategory: "HealthApplication",
      description: "Estimate your biological age based on sleep, exercise, BMI, and smoking habits.",
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

export default function BiologicalAgeCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🧬"
        eyebrowText="Biological Age"
        title="How Old Is Your Body Really?"
        description="Answer a few lifestyle questions about sleep, exercise, BMI, and smoking to get an estimate of your biological age — and an ageing risk score you can actually improve."
        chips={["Lifestyle-based", "Biological age estimate", "Risk score"]}
      >
        <CalculatorEngineLoader slug="biological-age-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Your biological age is not fixed — lifestyle changes can measurably reverse it." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What drives biological ageing" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Biological Age Calculator Works"
        paragraphs={[
          "This calculator uses an evidence-based lifestyle adjustment model. Starting from your chronological age, it adds years for known risk factors: sleeping under 6 hours per night, exercising fewer than 2 days per week, smoking, and having a BMI above 30. Each factor is supported by peer-reviewed longevity research.",
          "The ageing risk score (0–100) reflects the total lifestyle burden. A score of zero means all factors are in the optimal range. Improving any single factor — particularly sleep and smoking — produces the largest reductions.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
