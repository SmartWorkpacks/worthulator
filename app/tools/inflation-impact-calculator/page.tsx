import type { Metadata } from "next";
import InflationImpactWithInsights from "@/components/worthcore/InflationImpactWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateInflationImpact } from "@/calculations/finance/inflationImpact";
import { getCpiInflationYoY, fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

/* ── Step 5c: derive every CPI-dependent number from the live FRED rate ───── */
const CPI = getCpiInflationYoY();
const AS_OF = fredBenchmarks.currentPeriodLabel;
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
const EX = calculateInflationImpact(
  { amount: 10000, rate: CPI, years: 20 },
  { currentCpiRate: CPI },
);
const HALVE = EX.yearsToHalve;

export const metadata: Metadata = {
  title: "Inflation Impact Calculator 2026 – Live CPI Purchasing Power",
  description: "See how inflation erodes your money's buying power — defaulting to the live FRED CPI rate. Shows future purchasing power, the amount you'd need to keep pace, and how fast your cash halves.",
  keywords: ["inflation calculator", "purchasing power calculator", "inflation impact calculator", "what is my money worth", "CPI calculator", "inflation over time"],
  alternates: { canonical: "https://worthulator.com/tools/inflation-impact-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  { q: "What inflation rate does this calculator use?", a: `It defaults to the live US CPI rate from the St. Louis Fed (FRED) — currently ${CPI}% year-over-year (${AS_OF}), refreshed automatically. For context, the 20-year pre-2020 average was ~2.2%, post-pandemic inflation peaked at 9.1% in 2022, and ~3.3% is a reasonable long-run planning assumption.` },
  { q: "What does 'amount needed to keep pace' mean?", a: `It's the mirror of buying power. At ${CPI}% inflation, $10,000 today only buys ${usd0(EX.futureValue)} worth of goods in 20 years — but flipping it around, you'd need ${usd0(EX.requiredFuture)} in 20 years to buy what $10,000 buys today. That second number is the income or nest-egg target inflation quietly raises on you.` },
  { q: "How fast does inflation halve my money?", a: `At a steady ${CPI}%, purchasing power halves in about ${HALVE} years (exactly ln(2) ÷ ln(1 + ${CPI}%)). The Rule of 72 gives a quick mental estimate: 72 ÷ ${CPI} ≈ ${Math.round(72 / CPI)} years. At 7% it's about 10 years; at 9.1% (the 2022 peak) under 8 years.` },
  { q: "How does inflation affect savings accounts?", a: `If your savings earn 1% and inflation is ${CPI}%, your real return is ${(1 - CPI).toFixed(1)}%. The balance rises in dollars but buys less each year. Only returns above the inflation rate grow real wealth — which is why the calculator flags the break-even return you need.` },
  { q: "What is the 'real' rate of return?", a: `Real return = nominal return − inflation rate. If your investment returns 8% and inflation is ${CPI}%, your real return is ${(8 - CPI).toFixed(1)}%. This is the number that actually matters for long-term planning.` },
  { q: "What assets protect against inflation?", a: "Historically equities, real estate, TIPS (Treasury Inflation-Protected Securities), commodities, and I Bonds have tended to at least keep pace with inflation. Cash and fixed-rate bonds are the most vulnerable to erosion." },
];

const STATS = [
  { stat: `${CPI}%`,    color: "text-amber-600",   accent: "bg-amber-500",   label: `Live US CPI inflation, year-over-year (FRED, ${AS_OF}) — the calculator's default rate` },
  { stat: usd0(EX.requiredFuture), color: "text-rose-600",    accent: "bg-rose-500",    label: `What you'd need in 20 years to match $10,000 today at ${CPI}% inflation` },
  { stat: `~${Math.round(HALVE)} yr`,  color: "text-emerald-600", accent: "bg-emerald-500", label: `How long until your cash loses half its buying power at ${CPI}% inflation` },
];

const CONTENT_CARDS = [
  { icon: "👁️", title: "The invisible tax", body: "Inflation doesn't announce itself — it slowly erodes the value of cash held in low-yield accounts. A $50,000 emergency fund earning 0.5% loses real purchasing power every year at 3%+ inflation." },
  { icon: "📅", title: "Inflation and long-term planning", body: "Retirement calculators that don't account for inflation dramatically understate the savings required. A $3,000/month budget today will need $5,400+/month in 20 years at just 3% inflation." },
  { icon: "🔢", title: "The Rule of 72", body: `Divide 72 by the inflation rate to estimate how many years it takes to halve purchasing power. At the current ${CPI}%: about ${Math.round(72 / CPI)} years. At 7%: roughly 10 years. At 9.1% (the 2022 peak): under 8 years. The calculator shows the exact figure using logarithms.` },
];

const RELATED_CALCS = [
  { icon: "📈", accent: "bg-emerald-500/10", title: "Compound Interest",         description: "Beat inflation with compound growth.",             href: "/tools/compound-interest-calculator" },
  { icon: "🎯", accent: "bg-blue-500/10",    title: "Savings Goal Calculator",   description: "How long to reach your target in real terms.",    href: "/tools/savings-goal-calculator" },
  { icon: "🔥", accent: "bg-orange-500/10",  title: "FIRE Calculator",           description: "Inflation-adjusted financial independence math.",  href: "/tools/fire-calculator" },
  { icon: "📊", accent: "bg-purple-500/10",  title: "Net Worth Calculator",      description: "Track the real, inflation-adjusted picture.",      href: "/tools/net-worth-calculator" },
];

export default function InflationImpactCalculator() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Inflation Impact Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "See how inflation erodes purchasing power using the live FRED CPI rate, including the amount needed later to keep pace and how fast money halves.",
      url: "https://worthulator.com/tools/inflation-impact-calculator",
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
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <SimpleCalculatorHero
        eyebrowIcon="📉"
        eyebrowText="Inflation · Live CPI"
        title="Inflation Impact Calculator"
        description="See what your money will really be worth after inflation — starting from the live FRED CPI rate. Get your future buying power, the amount you'd need to keep pace, and how fast your cash halves."
        chips={["Live FRED CPI default", "Amount needed to keep pace", "Years to halve your money"]}
      >
        <InflationImpactWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text={`At the current ${CPI}% CPI, $10,000 today buys just ${usd0(EX.futureValue)} in 20 years — and you'd need ${usd0(EX.requiredFuture)} to keep pace. Inflation is the tax nobody talks about.`} />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What inflation is doing to your money right now" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="The purchasing power formula"
        formula={`Future Buying Power = Amount ÷ (1 + r)^Years
Amount Needed Later = Amount × (1 + r)^Years     (the mirror — keep pace)
Real Value Loss (%) = (1 − 1 ÷ (1 + r)^n) × 100
Years to Halve      = ln(2) ÷ ln(1 + r)
Break-even Return   = r   (just to stand still)

Worked example — $10,000 at the live ${CPI}% CPI over 20 years:
Buying power = ${usd0(EX.futureValue)} · Lost = ${usd0(EX.loss)} (${EX.lossPercent}%)
Needed to keep pace = ${usd0(EX.requiredFuture)} · Halves in ~${Math.round(HALVE)} years`}
        paragraphs={[
          `Future buying power = today's amount ÷ (1 + inflation rate)ⁿ. With $10,000 today and inflation at the current ${CPI}% CPI, in 20 years that $10,000 only buys about ${usd0(EX.futureValue)} worth of goods — a ${EX.lossPercent}% loss in real value. Flip the formula and you get the mirror: you'd need ${usd0(EX.requiredFuture)} in 20 years to buy what $10,000 buys now.`,
          "To maintain purchasing power, your money must grow faster than inflation. Any savings vehicle returning less than the inflation rate is losing real value every year — even if the nominal balance rises. The calculator defaults to the live FRED CPI rate so your starting point reflects today's economy.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
