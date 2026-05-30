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
  title: "Quit Smoking Calculator 2026 – Money Saved Since You Quit",
  description:
    "See how much money you've saved since quitting smoking. Enter your packs per day, cost per pack, and days since quitting for an instant tally.",
  keywords: ["quit smoking calculator", "money saved not smoking calculator", "cigarette cost calculator", "how much have I saved quitting smoking", "smoking savings calculator"],
  alternates: { canonical: "https://worthulator.com/tools/quit-smoking-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much money do you save by quitting smoking?",
    a: "At 1 pack/day and $10/pack, quitting saves $3,650/year. After 10 years, that's $36,500 — not counting investment growth. In a high-cost state like New York ($14/pack), one-pack-a-day smokers save over $5,000/year.",
  },
  {
    q: "How many cigarettes do you avoid by quitting?",
    a: "A standard pack has 20 cigarettes. At 1 pack/day, you avoid 20 cigarettes per day, 7,300 per year, 73,000 in a decade. Each cigarette takes an estimated 11 minutes off your life — so that's 800+ hours of life regained per year.",
  },
  {
    q: "What is the 'days of life regained' calculation?",
    a: "Research suggests each cigarette shortens life by about 11 minutes. This calculator multiplies cigarettes avoided by 11 minutes and converts to days. It's an estimate based on population averages, not a personal health guarantee.",
  },
  {
    q: "When do cravings stop after quitting?",
    a: "Most acute cravings peak in the first 72 hours and diminish significantly by 2–4 weeks. Nicotine is physically cleared from your system within 3–4 days. Psychological habit triggers can persist for months, but each craving episode typically passes in 3–5 minutes.",
  },
  {
    q: "How long does it take for health to improve after quitting?",
    a: "20 minutes: blood pressure normalizes. 24 hours: carbon monoxide clears from blood. 2 weeks: circulation and lung function improve. 1 year: heart disease risk is halved. 10 years: lung cancer risk drops to roughly half that of a current smoker. The benefits start immediately.",
  },
];

const STATS = [
  { stat: "$3,650", color: "text-emerald-600", accent: "bg-emerald-500", label: "Saved per year by quitting — at 1 pack/day and $10/pack" },
  { stat: "11min",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Estimated life lost per cigarette — the basis for the 'days regained' calculation" },
  { stat: "24hr",   color: "text-amber-600",   accent: "bg-amber-500",   label: "After quitting, carbon monoxide clears your blood and oxygen levels normalize" },
];

const CONTENT_CARDS = [
  {
    icon: "💰",
    title: "Invest the savings and watch it grow",
    body: "If you invest the $3,650/year you save by quitting into an index fund averaging 7% returns, after 20 years you'd have over $157,000. The savings compound as aggressively as the habit cost.",
  },
  {
    icon: "🏥",
    title: "The healthcare cost savings",
    body: "Smokers pay 15–30% higher health insurance premiums and face significantly higher lifetime healthcare costs. Quitting reduces your risk of 12+ types of cancer, heart disease, stroke, and COPD — illnesses that cost hundreds of thousands to treat.",
  },
  {
    icon: "🎯",
    title: "The 5% per quit attempt rule",
    body: "Each quit attempt gives a 5–7% success rate without support, and up to 35% with medication and counseling. Most successful quitters tried 8–14 times first. Every attempt is progress, not failure — the data shows persistence pays off.",
  },
];

const RELATED_CALCS = [
  { title: "Water Intake Calculator",      description: "Calculate your ideal daily water intake.",             href: "/tools/water-intake-calculator",     icon: "💧", accent: "bg-emerald-500/10" },
  { title: "Calorie Deficit Calculator",   description: "Calculate a daily calorie deficit for weight loss.",   href: "/tools/calorie-deficit-calculator",   icon: "🥗", accent: "bg-blue-500/10" },
  { title: "Savings Calculator",           description: "See how your savings grow over time.",                  href: "/tools/savings-calculator",          icon: "🏦", accent: "bg-amber-500/10" },
  { title: "Emergency Fund Calculator",    description: "Calculate your ideal emergency fund target.",           href: "/tools/emergency-fund-calculator",    icon: "🛡️", accent: "bg-purple-500/10" },
];

export default function QuitSmokingCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Quit Smoking Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description: "Calculate money saved, cigarettes avoided, and life regained since quitting smoking.",
      url: "https://worthulator.com/tools/quit-smoking-calculator",
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
        eyebrowIcon="🚭"
        eyebrowText="Lifestyle · Habits"
        title="Quit Smoking Calculator"
        description="See exactly how much money you've saved, how many cigarettes you've avoided, and how many days of life you've regained since quitting."
        chips={["Money saved", "Cigarettes avoided", "Life regained"]}
      >
        <CalculatorEngineLoader slug="quit-smoking" />
      </SimpleCalculatorHero>
      <InsightStrip text='Quitting 1 pack/day for a decade saves over <span class="font-semibold text-gray-900">$36,000 — invested at 7%, that grows to $57,000+.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The real numbers behind quitting" subtitle="Money saved, health gained, life reclaimed." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Quit Smoking Calculator Works"
        formula={`Money Saved          = Packs/Day × Pack Cost × Days Since Quit
Cigarettes Avoided   = Packs/Day × 20 × Days Since Quit
Life Regained (days) = (Cigarettes Avoided × 11 min) ÷ 1,440`}
        steps={[
          { label: "Enter packs per day smoked", description: "Use your average before quitting — 0.5 (10 cigs/day) to 3 packs." },
          { label: "Enter pack cost", description: "The price you paid per pack, including tax. Prices range from $6–14 across US states." },
          { label: "Enter days since quitting", description: "Day 1 to day 3,650 (10 years). Every day counts." },
          { label: "Read your totals", description: "Money saved, cigarettes avoided, and estimated days of life regained." },
        ]}
        paragraphs={[
          "The 11-minutes-per-cigarette figure comes from a 2000 study published in the British Medical Journal by Doll et al., based on 50 years of data. It's a population average — individual results vary.",
          "This calculator is for motivation only — it shows the financial and rough health impact but is not medical advice. For personalized quit support, contact your doctor or call 1-800-QUIT-NOW.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for health and lifestyle goals." items={RELATED_CALCS} />
    </main>
  );
}
