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
  title: "Burnout Risk Calculator 2026 – Are You Heading for Burnout?",
  description:
    "Assess your workplace burnout risk based on hours worked, stress level, and sleep quality. Get a score and actionable insights before it is too late.",
  keywords: ["burnout calculator", "burnout risk calculator", "am I burning out", "workplace burnout test", "stress and burnout calculator"],
  alternates: { canonical: "https://worthulator.com/tools/burnout-calculator" },
};

const FAQS = [
  {
    q: "What is workplace burnout?",
    a: "Burnout is a state of chronic stress that leads to physical and emotional exhaustion, cynicism and detachment, and feelings of ineffectiveness. The World Health Organization classifies it as an occupational phenomenon. It is not the same as stress — it is stress that has been ignored for too long.",
  },
  {
    q: "What factors does this calculator measure?",
    a: "This calculator uses three primary burnout indicators: weekly work hours (volume of load), self-rated stress level (perceived pressure), and nightly sleep hours (recovery quality). These three inputs cover the core dimensions of the Maslach Burnout Inventory framework.",
  },
  {
    q: "What does a high burnout risk score mean?",
    a: "A score above 70 indicates high burnout risk and suggests urgent intervention — reducing hours, speaking to a manager, taking leave, or seeking professional support. A score of 40–70 suggests moderate risk and warrants active monitoring and lifestyle adjustments.",
  },
  {
    q: "Can burnout be reversed?",
    a: "Yes, but recovery takes time — typically weeks to months depending on severity. Rest, boundary-setting, reduced workload, and sometimes professional therapy are the most effective interventions. Trying to 'push through' burnout typically makes it significantly worse.",
  },
  {
    q: "Is this a medical assessment?",
    a: "No. This is a general awareness tool, not a clinical diagnosis. If you are experiencing persistent exhaustion, emotional numbness, or physical symptoms, please consult a healthcare professional or occupational health specialist.",
  },
];

const STATS = [
  { stat: "77%", color: "text-red-600", accent: "bg-red-500", label: "of workers report experiencing burnout at their current job — Gallup 2024" },
  { stat: "50+", color: "text-amber-600", accent: "bg-amber-500", label: "hours per week is where burnout risk escalates sharply across research studies" },
  { stat: "6 hrs", color: "text-blue-600", accent: "bg-blue-500", label: "of sleep per night dramatically increases burnout risk regardless of work hours" },
];

const CONTENT_CARDS = [
  {
    icon: "🔥",
    title: "Burnout is not weakness",
    body: "Burnout happens to high performers, not just people who struggle. It is the result of sustained output without adequate recovery. Recognising the signs early is the strongest thing you can do — not a sign of failure.",
  },
  {
    icon: "😴",
    title: "Sleep is your burnout shield",
    body: "Chronic sleep deprivation accelerates every burnout marker. Less than 6 hours per night reduces emotional regulation, increases cortisol, and makes stress feel unbearable. Protecting your sleep is the single most effective burnout prevention tool available.",
  },
  {
    icon: "🛑",
    title: "High scores demand action",
    body: "If your score is above 70, do not wait until you crash. Have an honest conversation with your manager, take a genuine break, and reassess your workload. Burnout that leads to a breakdown typically costs 3–6 months of recovery time.",
  },
];

const RELATED_CALCS = [
  { title: "WFH Savings Calculator", description: "See the financial value of reclaiming commute time.", href: "/tools/wfh-savings-calculator", icon: "🏠", accent: "bg-blue-500/10" },
  { title: "Sleep Cycle Optimizer", description: "Find the best wake-up times based on sleep cycles.", href: "/tools/sleep-cycle-optimizer", icon: "😴", accent: "bg-indigo-500/10" },
  { title: "True Hourly Wage Calculator", description: "Is the extra work really worth it financially?", href: "/tools/true-hourly-wage", icon: "⏱️", accent: "bg-amber-500/10" },
  { title: "Side Hustle Calculator", description: "Build income from something you enjoy.", href: "/tools/side-hustle-calculator", icon: "💼", accent: "bg-emerald-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Burnout Risk Calculator",
      url: "https://worthulator.com/tools/burnout-calculator",
      applicationCategory: "HealthApplication",
      description: "Assess your workplace burnout risk score based on hours worked, stress level, and sleep quality.",
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

export default function BurnoutCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🔥"
        eyebrowText="Burnout Risk"
        title="Are You on the Road to Burnout?"
        description="Enter your weekly work hours, stress level, and nightly sleep to get a burnout risk score out of 100 — and know whether to act now or monitor."
        chips={["Risk score /100", "Low / Moderate / High", "Evidence-based"]}
      >
        <CalculatorEngineLoader slug="burnout-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="77% of workers experience burnout — catching it early makes recovery far easier." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Understanding your burnout risk" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Burnout Risk Calculator Works"
        paragraphs={[
          "The calculator weights three inputs: hours worked (40% of the score, scaled to a 60-hour maximum), stress level out of 10 (30% of the score), and a 20-point penalty for sleeping under 6 hours per night. The total is capped at 100.",
          "A score above 70 is high risk, 40–70 is moderate, and below 40 is low. These thresholds are informed by the Maslach Burnout Inventory — the most widely used clinical burnout assessment framework.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
