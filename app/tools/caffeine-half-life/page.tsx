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
  title: "Caffeine Half-Life Calculator 2026 – How Much Caffeine Is in Your System at Bedtime?",
  description:
    "See exactly how much caffeine is still active at your bedtime. Enter your cups consumed, last cup time, and bedtime to find your ideal caffeine cutoff.",
  keywords: ["caffeine half life calculator", "caffeine bedtime calculator", "how long does caffeine last", "caffeine sleep calculator"],
  alternates: { canonical: "https://worthulator.com/tools/caffeine-half-life" },
};

const FAQS = [
  {
    q: "What is the half-life of caffeine?",
    a:
      "Caffeine's half-life in healthy adults is approximately 5–6 hours. This means that 5 hours after drinking coffee, about half the caffeine remains active. After 10 hours, about 25% remains. Individual metabolism, pregnancy, medications, and liver function can shift this significantly.",
  },
  {
    q: "How much caffeine is in a cup of coffee?",
    a:
      "A standard 8oz brewed coffee contains approximately 80–100mg of caffeine, with 95mg as the widely cited average. Espresso shots contain ~63mg. Energy drinks range from 80–300mg. This calculator uses 95mg per standard cup.",
  },
  {
    q: "How much caffeine is OK to have at bedtime?",
    a:
      "Research suggests that having more than 50mg of caffeine within 6 hours of bedtime can significantly disrupt sleep quality and reduce total sleep time. Below 10–15mg is generally considered functionally cleared. Even if you fall asleep, caffeine can suppress deep (slow-wave) sleep.",
  },
  {
    q: "What is the best time to stop drinking coffee?",
    a:
      "For most people with an 11pm bedtime, the ideal cutoff is around 1–2pm. For earlier bedtimes (10pm), stop by noon. The exact time depends on how many cups you drink and your personal caffeine metabolism speed.",
  },
  {
    q: "Does caffeine affect sleep even if I fall asleep fine?",
    a:
      "Yes — caffeine can reduce slow-wave (deep) sleep even when you don't notice it. This leads to feeling less rested despite sleeping 7–8 hours. Many chronic coffee drinkers don't realise their afternoon coffees are affecting sleep quality.",
  },
];

const STATS = [
  { stat: "5–6 hrs", color: "text-amber-600", accent: "bg-amber-500", label: "caffeine half-life in healthy adults on average" },
  { stat: "~95mg", color: "text-blue-600", accent: "bg-blue-500", label: "caffeine in a standard 8oz brewed coffee" },
  { stat: "8–10 hrs", color: "text-emerald-600", accent: "bg-emerald-500", label: "time to functionally clear 2 cups of coffee below 10mg" },
];

const CONTENT_CARDS = [
  {
    icon: "⏰",
    title: "The 6-hour rule",
    body: "A commonly cited guideline: avoid caffeine within 6 hours of bedtime. Research by Dr. Christopher Drake found that caffeine consumed 6 hours before bed still reduced total sleep time by about 1 hour, even in people who felt they fell asleep without issue.",
  },
  {
    icon: "😴",
    title: "Why afternoon coffee hurts your sleep",
    body: "With a 5-hour half-life, a 3pm coffee still has 50% of its caffeine active at 8pm, and 25% active at 1am. If you drink multiple cups throughout the day, the caffeine levels compound and stay elevated well into the night.",
  },
  {
    icon: "🧬",
    title: "Caffeine sensitivity varies widely",
    body: "Some people metabolise caffeine quickly (fast metabolisers — CYP1A2 gene variant) and can drink coffee late with little effect. Slow metabolisers may feel stimulated 8–10 hours later. Hormonal contraceptives, certain antibiotics, and liver conditions also slow caffeine clearance.",
  },
];

const RELATED_CALCS = [
  { title: "TDEE & Calorie Calculator", description: "Find your daily calorie maintenance target.", href: "/tools/tdee-calculator", icon: "🔥", accent: "bg-emerald-500/10" },
  { title: "Body Fat Calculator", description: "Estimate body fat % from measurements.", href: "/tools/body-fat-calculator", icon: "📏", accent: "bg-blue-500/10" },
  { title: "Latte Factor Calculator", description: "See how coffee habits cost you long-term.", href: "/tools/latte-factor", icon: "☕", accent: "bg-amber-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Caffeine Half-Life Calculator",
      url: "https://worthulator.com/tools/caffeine-half-life",
      applicationCategory: "HealthApplication",
      description: "See how much caffeine is active at bedtime and find your ideal cutoff time.",
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

export default function CaffeineHalfLife() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="☕"
        eyebrowText="Caffeine Half-Life"
        title="Is Your Afternoon Coffee Wrecking Your Sleep?"
        description="See exactly how much caffeine is still active at your bedtime. Uses the 5-hour half-life formula to track caffeine clearance through your day."
        chips={["5-hour half-life formula", "mg at bedtime shown", "Ideal cutoff time"]}
      >
        <CalculatorEngineLoader slug="caffeine-half-life" />
      </SimpleCalculatorHero>
      <InsightStrip text="A 3pm coffee still has ~50% of its caffeine active at 8pm. More than most people realise." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Caffeine and sleep: the science"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Caffeine Half-Life Calculator Works"
        paragraphs={[
          "Total caffeine = cups × 95mg. Remaining at bedtime = total × 0.5^((bedtime − last cup) / 5). The clearance time is calculated as: last cup hour + 5 × log(total / 10) / log(2), which gives the time when caffeine drops below 10mg.",
          "This uses an average 5-hour half-life. Individual metabolism varies — some people clear caffeine in 3 hours, others take 9. If you find you're very caffeine-sensitive, try using 7–8 hours as your effective personal half-life.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
