import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Sleep Cycle Optimizer 2026 – Find the Perfect Bedtime",
  description:
    "Calculate the ideal bedtime based on your wake-up time and natural 90-minute sleep cycles. Wake up refreshed — not mid-cycle.",
  keywords: ["sleep cycle calculator", "best bedtime calculator", "90 minute sleep cycle", "when should I go to sleep", "sleep cycle optimizer"],
  alternates: { canonical: "https://worthulator.com/tools/sleep-cycle-optimizer" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is a sleep cycle?",
    a: "A sleep cycle lasts roughly 90 minutes and includes four stages: light sleep (N1, N2), deep slow-wave sleep (N3), and REM sleep. Your brain completes 4–6 cycles per night, with deep sleep dominating early cycles and REM sleep dominating later ones.",
  },
  {
    q: "Why do I feel groggy even after 8 hours?",
    a: "Grogginess — officially called sleep inertia — happens when your alarm wakes you mid-cycle, usually during deep sleep (N3). Waking at the end of a full cycle, even with slightly fewer total hours, is almost always more refreshing than waking mid-cycle after more time asleep.",
  },
  {
    q: "Why does this calculator add sleep onset time?",
    a: "Most people take 5–20 minutes to fall asleep after lying down. If you calculate bedtime as 'wake-up minus 7.5 hours' and get into bed at that time, you're actually shortchanging yourself by your onset time. The calculator adds it so the bedtime shown is when you should get into bed.",
  },
  {
    q: "Is 7.5 hours (5 cycles) better than 9 hours (6 cycles)?",
    a: "For most healthy adults, 5–6 complete cycles (7.5–9 hours) is optimal. The right number depends on your age, activity level, and how rested you feel. If you consistently feel unrefreshed after 5 cycles, try 6. If 5 leaves you feeling great, you probably don't need 6.",
  },
  {
    q: "What if I can't fall asleep at the calculated bedtime?",
    a: "Use the 4-cycle bedtime (6 hours) as your fall-back — it's still a complete number of cycles. Avoid screens 30–60 minutes before bed, keep your room cool (65–68°F is optimal), and try to maintain a consistent wake time even on weekends, which anchors your circadian rhythm.",
  },
];

const STATS = [
  { stat: "90 min",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Duration of one complete sleep cycle, cycling through all five stages of sleep" },
  { stat: "5–6",     color: "text-blue-600",    accent: "bg-blue-500",    label: "Complete cycles per night for most healthy adults — 7.5 to 9 hours total" },
  { stat: "5–20 min",color: "text-amber-600",   accent: "bg-amber-500",   label: "Average sleep onset time — factored into your bedtime so the math is accurate" },
];

const CONTENT_CARDS = [
  {
    icon: "🔄",
    title: "Cycles matter more than total hours",
    body: "Eight hours sounds like a round, satisfying number — but if your alarm fires mid-cycle, you'll feel terrible. The goal is to complete whole cycles, not hit an arbitrary hour count. This is why some people feel great on 7.5 hours but awful on 8.",
  },
  {
    icon: "⏰",
    title: "Waking mid-cycle causes sleep inertia",
    body: "Sleep inertia — the heavy, confused grogginess after waking — is caused by interrupting deep sleep (N3). It can last 30–60 minutes and impairs reaction time, memory, and mood. Waking at the natural end of a cycle eliminates most of it.",
  },
  {
    icon: "🌙",
    title: "Consistent timing beats perfect timing",
    body: "The single most effective sleep intervention is a fixed wake time — even on weekends. A consistent wake time anchors your circadian rhythm, gradually shifting your natural sleep onset earlier. Within a few weeks, falling asleep at your calculated bedtime becomes natural.",
  },
];

const RELATED_CALCS = [
  {
    title: "BMI Calculator",
    description: "Check your body mass index and healthy weight range.",
    href: "/tools/bmi-calculator",
    icon: "⚖️",
    accent: "bg-blue-500/10",
  },
  {
    title: "Running Pace Calculator",
    description: "Calculate your pace per mile and projected race finish times.",
    href: "/tools/running-pace-calculator",
    icon: "🏃",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Emergency Fund Calculator",
    description: "Calculate how much you need in an emergency fund.",
    href: "/tools/emergency-fund-calculator",
    icon: "🛡️",
    accent: "bg-amber-500/10",
  },
  {
    title: "Commute Time Value Calculator",
    description: "See what your daily commute is really costing you in time and money.",
    href: "/tools/commute-time-value",
    icon: "🚗",
    accent: "bg-violet-500/10",
  },
];

export default function SleepCycleOptimizerPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Sleep Cycle Optimizer",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description: "Calculate the ideal bedtime based on your wake-up time and 90-minute sleep cycles.",
      url: "https://worthulator.com/tools/sleep-cycle-optimizer",
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
        eyebrowIcon="😴"
        eyebrowText="Health · Sleep Optimization"
        title="Sleep Cycle Optimizer"
        description="Find the perfect bedtime to wake up refreshed — calculated around your natural 90-minute sleep cycles and personal sleep onset time."
        chips={["4, 5 or 6 full cycles", "Accounts for sleep onset", "Beat morning grogginess"]}
      >
        <CalculatorEngineLoader slug="sleep-cycle-optimizer" />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Waking mid-cycle causes sleep inertia — grogginess that lasts 30–60 minutes. <span class="font-semibold text-gray-900">The fix isn&apos;t more sleep, it&apos;s better-timed sleep.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why sleep cycle timing changes everything"
        subtitle="It's not about 8 hours. It's about waking at the right moment in your cycle."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Sleep Cycle Optimizer Works"
        formula={`Sleep Duration = Cycles × 90 minutes + Sleep Onset Time

Bedtime = Wake Time − Sleep Duration

Example (6 cycles, 15 min onset, 7:00am wake):
  Duration = 6 × 90 + 15 = 555 minutes = 9h 15min
  Bedtime  = 7:00am − 9h 15min = 9:45 pm`}
        steps={[
          { label: "Set your wake-up time", description: "The time your alarm rings — not the time you'd like to wake up." },
          { label: "Enter your sleep onset time", description: "How long it typically takes you to fall asleep after lying down. 15 minutes is a common average." },
          { label: "Choose your target cycles", description: "6 cycles (9 hours) is optimal · 5 cycles (7.5 hours) is the standard recommendation · 4 cycles is a minimum." },
          { label: "Get your bedtime", description: "The calculator shows when you should get into bed for each option — not when sleep starts." },
        ]}
        paragraphs={[
          "The 90-minute sleep cycle model is well established in sleep research. Each cycle takes the brain through light sleep, deep slow-wave sleep, and REM — all of which serve different restorative functions. Disrupting any stage, especially deep sleep, impairs memory consolidation, immune function, and next-day cognitive performance.",
          "Unlike generic 'sleep calculators' that use fixed 90-minute intervals, this tool adds your personal sleep onset time. If you fall asleep in 5 minutes versus 25 minutes, your ideal bedtime shifts accordingly — giving you a more accurate target.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for your health and daily wellbeing."
        items={RELATED_CALCS}
      />
    </main>
  );
}
