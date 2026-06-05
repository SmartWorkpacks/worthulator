import type { Metadata } from "next";
import QuitSmokingWithInsights from "@/components/worthcore/QuitSmokingWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateQuitSmoking } from "@/calculations/health/quitSmoking";
import {
  getUSStateCigarettePrice,
  usStateCigaretteDataset,
} from "@/lib/datasets/regional/usStateCigarettePrices";

/* ── Step 5c: derive every worked example from the live cigarette-price dataset
   so FAQ / stat chips / SEO auto-refresh when pack prices update. ──────────── */
const NAT = getUSStateCigarettePrice("National");
const NY = getUSStateCigarettePrice("New York");
const MO = getUSStateCigarettePrice("Missouri");
const GA = getUSStateCigarettePrice("Georgia");
const AS_OF = usStateCigaretteDataset.currentPeriodLabel;
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
/* Worked example: 1 pack/day for a year at the live national average. */
const EX = calculateQuitSmoking(
  { packsPerDay: 1, packCost: NAT, daysSinceQuit: 365 },
  { stateAvgPackPrice: NAT },
);
const NY_ANNUAL = calculateQuitSmoking(
  { packsPerDay: 1, packCost: NY, daysSinceQuit: 365 },
  { stateAvgPackPrice: NY },
).annualSaving;

export const metadata: Metadata = {
  title: "Quit Smoking Calculator 2026 – Money Saved & Life Regained",
  description:
    "See how much money you've saved since quitting smoking, how many days of life you've regained, and what that money is worth if invested at 7%.",
  keywords: ["quit smoking calculator", "money saved not smoking calculator", "cigarette cost calculator", "how much have I saved quitting smoking", "smoking savings calculator"],
  alternates: { canonical: "https://worthulator.com/tools/quit-smoking-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much money do you save by quitting smoking?",
    a: `At 1 pack/day and the current US-average ${usd2(NAT)}/pack (${AS_OF}), quitting saves ${usd0(EX.annualSaving)}/year. Invested at 7%, that grows to ${usd0(EX.investedValue10yr)} in 10 years and nearly ${usd0(EX.investedValue20yr)} in 20. In a high-cost state like New York (~${usd2(NY)}/pack), one-pack-a-day smokers save about ${usd0(NY_ANNUAL)}/year. Pick your state and the calculator loads the live local pack-price average to benchmark your cost.`,
  },
  {
    q: "How many cigarettes do you avoid by quitting?",
    a: "A standard pack has 20 cigarettes. At 1 pack/day, you avoid 7,300 cigarettes per year. Each cigarette takes an estimated 11 minutes off your life — so that's 55.8 days of life regained per year.",
  },
  {
    q: "What is the 'days of life regained' calculation?",
    a: "Research (Doll et al., BMJ 2000) estimates each cigarette shortens life by about 11 minutes. The calculator multiplies cigarettes avoided by 11 minutes and converts to days. At 1 pack/day for a year: 7,300 × 11 min = 80,300 min = 55.8 days.",
  },
  {
    q: "What does 'if invested' mean?",
    a: `If you take the money you would have spent on cigarettes and invest it in a diversified index fund earning ~7% annually, the 10-year projection shows what that money grows to with compound interest. ${usd0(EX.annualSaving)}/year at 7% becomes ~${usd0(EX.investedValue10yr)} in 10 years.`,
  },
  {
    q: "When do cravings stop after quitting?",
    a: "Most acute cravings peak in the first 72 hours and diminish significantly by 2–4 weeks. Nicotine clears your system within 3–4 days. Psychological triggers can persist for months, but each craving episode typically passes in 3–5 minutes.",
  },
  {
    q: "How long does it take for health to improve after quitting?",
    a: "20 minutes: blood pressure normalizes. 24 hours: carbon monoxide clears from blood. 2 weeks: circulation and lung function improve. 1 year: heart disease risk halved. 10 years: lung cancer risk drops to roughly half that of a current smoker.",
  },
];

const STATS = [
  { stat: `${usd0(EX.annualSaving)}/yr`, color: "text-emerald-600", accent: "bg-emerald-500", label: `Saved per year by quitting 1 pack/day at the live ${usd2(NAT)}/pack US average` },
  { stat: `${EX.daysOfLifeRegained.toFixed(1)} days`, color: "text-blue-600",    accent: "bg-blue-500",    label: `Life regained per year — ${EX.cigarettesAvoided.toLocaleString()} cigarettes × 11 minutes each` },
  { stat: usd0(EX.investedValue10yr),   color: "text-amber-600",   accent: "bg-amber-500",   label: `What ${usd0(EX.annualSaving)}/year grows to in 10 years if invested at 7% return` },
];

const CONTENT_CARDS = [
  {
    icon: "💰",
    title: "Invest the savings and watch it compound",
    body: `If you invest the ${usd0(EX.annualSaving)}/year you save by quitting into an index fund averaging 7% returns, you'd have ~${usd0(EX.investedValue10yr)} in 10 years and ~${usd0(EX.investedValue20yr)} in 20. The money saved from quitting is genuinely life-changing when it compounds.`,
  },
  {
    icon: "🏥",
    title: "Healthcare costs drop significantly",
    body: "Smokers pay 15–30% higher health insurance premiums and face substantially higher lifetime healthcare costs. Quitting reduces your risk of 12+ types of cancer, heart disease, stroke, and COPD — illnesses that cost hundreds of thousands to treat.",
  },
  {
    icon: "🎯",
    title: "Persistence pays off — the data proves it",
    body: "Each quit attempt has a 5–7% success rate without support, and up to 35% with medication and counseling. Most successful quitters tried 8–14 times first. Every attempt is progress, not failure.",
  },
];

const RELATED_CALCS = [
  { title: "Latte Factor Calculator",     description: "See what any daily habit costs you over 30 years.",       href: "/tools/latte-factor",             icon: "☕", accent: "bg-emerald-500/10" },
  { title: "Savings Calculator",          description: "See how your savings grow over time with compound interest.", href: "/tools/savings-calculator",    icon: "🏦", accent: "bg-blue-500/10" },
  { title: "Calorie Deficit Calculator",  description: "Calculate a daily calorie deficit for weight loss.",       href: "/tools/calorie-deficit-calculator", icon: "🥗", accent: "bg-amber-500/10" },
  { title: "Emergency Fund Calculator",   description: "Calculate your ideal emergency fund target.",              href: "/tools/emergency-fund-calculator", icon: "🛡️", accent: "bg-violet-500/10" },
];

export default function QuitSmokingCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Quit Smoking Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description: "Calculate money saved, cigarettes avoided, life regained, and investment value since quitting smoking.",
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
        eyebrowText="Health · Lifestyle"
        title="Quit Smoking Calculator"
        description="See exactly how much money you've saved, how many cigarettes you've avoided, how many days of life you've regained — and what that money is worth if you invest it."
        chips={["Money saved", "Life regained", "Investment projection"]}
      >
        <QuitSmokingWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`Quitting 1 pack/day saves ${usd0(EX.annualSaving)}/year — invested at 7%, that's <span class="font-semibold text-gray-900">${usd0(EX.investedValue10yr)} in 10 years and ${usd0(EX.investedValue20yr)} in 20.</span>`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="The real numbers behind quitting"
        subtitle="Money saved, health gained, life reclaimed — quantified."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Quit Smoking Calculator Works"
        formula={`Money Saved         = Packs/Day × Pack Cost × Days Since Quit
Cigarettes Avoided  = Packs/Day × 20 × Days Since Quit
Life Regained       = (Cigarettes × 11 min) ÷ 1,440 min/day
Annual Saving       = Packs/Day × Pack Cost × 365
Invested (10 yr)    = FV of annuity at 7% return

Example: 1 pack/day, live ${usd2(NAT)}/pack, 365 days quit
  Money saved   = 1 × ${usd2(NAT)} × 365 = ${usd0(EX.annualSaving)}
  Cigs avoided  = 1 × 20 × 365 = ${EX.cigarettesAvoided.toLocaleString()}
  Life regained = ${EX.cigarettesAvoided.toLocaleString()} × 11 ÷ 1,440 = ${EX.daysOfLifeRegained.toFixed(1)} days
  10-yr invested = ${usd0(EX.investedValue10yr)} at 7%`}
        steps={[
          { label: "Select your state", description: "Loads your state's live average cigarette pack price so we can benchmark what you paid against the local norm." },
          { label: "Enter packs per day", description: "Your average before quitting — 0.5 (10 cigs/day) to 3 packs." },
          { label: "Enter cost per pack", description: `The price you paid per pack, including tax. US range: ~${usd2(MO)} (Missouri) to ~${usd2(NY)} (New York) depending on state excise.` },
          { label: "Enter days since quitting", description: "Day 1 to day 3,650 (10 years). Every day you're smoke-free counts." },
          { label: "See the full picture", description: "Money saved, cigarettes avoided, days of life regained, your pack cost vs your state average, and what the money grows to if invested at 7% annually." },
        ]}
        paragraphs={[
          `Pack prices vary enormously by state — from around ${usd2(GA)}–${usd2(MO)} in low-excise states like Georgia and Missouri to roughly ${usd2(NY)} in New York and Illinois. We pull state-level average pack prices from a live dataset (refreshed via our pricing pipeline) so the 'vs your state average' benchmark reflects current local prices, not a stale national guess.`,
          "The 11-minutes-per-cigarette figure comes from a landmark 2000 study published in the British Medical Journal by Doll et al., based on 50 years of observational data on British doctors. It's a population-level average — individual outcomes vary.",
          "The investment projection assumes you take the annual savings and invest in a diversified portfolio earning 7% annual returns (the long-term historical average of the US stock market after inflation). This is for motivation — it shows the true opportunity cost of the habit over time.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for health, habits, and financial goals."
        items={RELATED_CALCS}
      />
    </main>
  );
}
