import type { Metadata } from "next";
import VapingCostWithInsights from "@/components/worthcore/VapingCostWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Vaping Cost Calculator 2026 – What Does Vaping Really Cost?",
  description:
    "Calculate your annual vaping cost, see the investment opportunity cost, find savings from cutting daily spend, and compare to smoking.",
  keywords: ["vaping cost calculator", "how much does vaping cost", "vaping money calculator", "e-cigarette cost calculator", "vaping vs smoking cost"],
  alternates: { canonical: "https://worthulator.com/tools/vaping-cost-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does vaping cost per year?",
    a: "At $6/day (a common pod-system spend), vaping costs $2,190/year. Disposable users at $8–12/day spend $2,920–$4,380/year. Refillable mod users at $2–3/day can keep it under $1,100/year.",
  },
  {
    q: "Is vaping cheaper than smoking?",
    a: "Usually. At $6/day, vaping costs $2,190/year vs $3,650/year for a 1 pack/day cigarette habit at $10/pack — saving $1,460/year. But heavy disposable users ($10+/day) can approach or exceed cigarette costs.",
  },
  {
    q: "What does the 'what if you cut' slider do?",
    a: "It shows how much you'd save by reducing your daily vaping spend. Cutting $2/day — e.g. switching from disposables to a refillable pod — saves $730/year. Invested at 7%, that's $10,086 over 10 years.",
  },
  {
    q: "What should I include in the daily cost?",
    a: "Everything: pods, e-liquid, coils, disposable devices, and a prorated share of device purchases. If you buy a new device every 6 months for $40, that adds ~$0.22/day to your cost.",
  },
  {
    q: "How is the invested value calculated?",
    a: "The calculator uses the future value of an annuity at 7% annual return — the historical long-term average of the US stock market. It shows what your annual vaping spend would grow to if invested over 10 years.",
  },
  {
    q: "What's the cheapest way to vape?",
    a: "Refillable pod systems or mod/tank setups with DIY e-liquid cost $2–3/day ($730–$1,095/yr). Disposables are the most expensive at $8–15/day. Switching device type is the single biggest cost lever for vapers.",
  },
];

const STATS = [
  { stat: "$2,190/yr", color: "text-emerald-600", accent: "bg-emerald-500", label: "Annual vaping cost at $6/day — $183/month on pods, liquids, and devices" },
  { stat: "$1,460",    color: "text-blue-600",    accent: "bg-blue-500",    label: "Annual saving vs a 1 pack/day cigarette habit at $10/pack" },
  { stat: "$10,086",   color: "text-amber-600",   accent: "bg-amber-500",   label: "What $730/year (cut $2/day) grows to in 10 years invested at 7%" },
];

const CONTENT_CARDS = [
  {
    icon: "💨",
    title: "Disposables are the most expensive option",
    body: "Single-use disposable vapes cost $10–$20 each and last 1–3 days. Users going through 3–4 per week spend $1,500–$3,000/year. Switching to a refillable pod system cuts costs by 60–70% while delivering the same nicotine.",
  },
  {
    icon: "🔄",
    title: "Vaping vs smoking: cheaper but not free",
    body: "At $6/day, vaping saves $1,460/year compared to smoking. But $2,190/year is still real money. Invested at 7%, that's $30,258 in 10 years. Knowing the number helps you decide whether the cost is worth it.",
  },
  {
    icon: "✂️",
    title: "Small daily cuts compound fast",
    body: "Cutting $2/day from your vaping spend — one fewer pod, switching to a cheaper liquid brand — saves $730/year. Over 10 years invested at 7%, that's over $10,000. You don't have to quit to benefit financially.",
  },
];

const RELATED_CALCS = [
  { title: "Quit Smoking Calculator",      description: "See the financial impact of quitting cigarettes.",      href: "/tools/quit-smoking-calculator",     icon: "🚭", accent: "bg-red-500/10" },
  { title: "Alcohol Cost Calculator",      description: "What your drinking habit really costs per year.",       href: "/tools/alcohol-cost-calculator",     icon: "🍺", accent: "bg-amber-500/10" },
  { title: "Latte Factor Calculator",      description: "The cost of any small daily habit over 30 years.",      href: "/tools/latte-factor",               icon: "☕", accent: "bg-yellow-500/10" },
  { title: "Savings Calculator",           description: "See what saved money grows to over time.",               href: "/tools/savings-calculator",          icon: "🏦", accent: "bg-emerald-500/10" },
];

export default function VapingCostCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Vaping Cost Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate annual vaping cost, investment opportunity cost, cut-saving projections, and comparison to smoking.",
      url: "https://worthulator.com/tools/vaping-cost-calculator",
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
        eyebrowIcon="💨"
        eyebrowText="Lifestyle · Spending"
        title="Vaping Cost Calculator"
        description="Enter your daily vaping spend and see the annual cost, investment opportunity cost, savings from cutting back, and how it compares to smoking."
        chips={["Annual cost", "vs Smoking comparison", "Cut-and-save projection"]}
      >
        <VapingCostWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text='$6/day vaping costs <span class="font-semibold text-gray-900">$2,190/year</span> — cheaper than smoking ($3,650) but still $30,258 over 10 years if invested.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="The real cost of vaping — quantified"
        subtitle="Cheaper than cigarettes, but far from free."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Vaping Cost Calculator Works"
        formula={`Annual Cost        = Daily Cost × 365
Invested (10yr)    = FV of annuity at 7%

Cut Saving / Year  = Cut Amount × 365
Cut Invested (10yr)= FV of annuity(Cut Saving, 10, 7%)

vs Smoking         = ($10/pack × 365) − Annual Vaping Cost

Example: $6/day vaping, cut $2/day
  Annual     = $6 × 365 = $2,190
  Invested   = $30,258 in 10 years at 7%
  Cut saves  = $2 × 365 = $730/yr → $10,086 invested
  vs smoking = $3,650 − $2,190 = $1,460 saved`}
        steps={[
          { label: "Enter daily vaping cost",   description: "Include pods, e-liquid, disposables, and prorated device costs. $6/day is typical for a pod system user." },
          { label: "Set how much to cut",        description: "Slide to see savings from reducing daily spend — e.g. switching device types or buying in bulk." },
          { label: "See the full picture",        description: "Annual cost, 10-year investment value, savings from cutting, and the comparison to a 1 pack/day cigarette habit." },
        ]}
        paragraphs={[
          "Most vaping cost calculators show annual spend and stop there. This one adds three things: the investment opportunity cost at 7%, a cut-saving projection for reducing daily spend, and a direct comparison to the cost of smoking at $10/pack per day.",
          "The vaping vs smoking comparison uses the US national average cigarette price ($10/pack). At $6/day, vaping saves $1,460/year compared to smoking — but both are significant recurring costs that compound over time.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for understanding the cost of habits."
        items={RELATED_CALCS}
      />
    </main>
  );
}
