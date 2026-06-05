import type { Metadata } from "next";
import DownPaymentWithInsights from "@/components/worthcore/DownPaymentWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateDownPayment } from "@/calculations/finance/downPayment";
import { HYSA_APY } from "@/lib/calculators/emergencyFundEngine";
import { getCpiInflationYoY } from "@/lib/datasets/finance/fredBenchmarks";

/* ── Step 5c: derive the default-scenario numbers from the live HYSA APY + CPI
   so FAQ / stat chips / SEO auto-refresh when those values change. ─────────── */
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
const EX = calculateDownPayment(
  { homePrice: 400000, downPct: 20, currentSaved: 5000, months: 36, appreciationPct: 4 },
  { hysaApyPct: HYSA_APY, annualInflationPct: getCpiInflationYoY() },
);

export const metadata: Metadata = {
  title: "Down Payment Calculator 2026 – Monthly Savings, Done Right",
  description:
    "The only down payment calculator that accounts for HYSA interest, the moving target of home-price appreciation, and closing costs. Get your real monthly savings number, powered by live CPI data.",
  keywords: ["down payment calculator", "home down payment savings", "how much to save for house", "down payment with appreciation", "cash to close calculator", "house deposit calculator"],
  alternates: { canonical: "https://worthulator.com/tools/down-payment-countdown" },
};

const FAQS = [
  {
    q: "How much down payment do I need to buy a house?",
    a:
      "It depends on the loan type. Conventional loans typically require 5–20% down. Putting 20% down avoids Private Mortgage Insurance (PMI), which adds ~0.5–1.5%/year to your mortgage. FHA loans allow as little as 3.5% down with a credit score of 580+.",
  },
  {
    q: "Is a 20% down payment always best?",
    a:
      "Not necessarily. A 20% down payment eliminates PMI and gives you a lower monthly payment, but tying up a large sum in a house means you're not investing it elsewhere. With today's high home prices, many buyers opt for 5–10% down and accept PMI.",
  },
  {
    q: "Why is my target higher than the home price × down payment %?",
    a:
      `Because the home keeps appreciating while you save. On a $400,000 home at 20% down, today's figure is $80,000 — but at 4% annual appreciation the home is projected to cost about ${usd0(EX.futureHomePrice)} in 3 years, so 20% down becomes roughly ${usd0(EX.targetDown)}. Saving toward the static $80,000 leaves you about ${usd0(EX.appreciationGap)} short. The calculator targets the price at purchase, not today's price.`,
  },
  {
    q: "How does the HYSA interest change my monthly savings?",
    a:
      `A High-Yield Savings Account at ~${HYSA_APY}% APY does part of the saving for you. On the default scenario it earns about ${usd0(EX.interestEarned)} over 3 years, dropping your required monthly contribution from roughly ${usd0(EX.monthlyNoInterest)} (a 0% account) to about ${usd0(EX.monthlySavings)} — around ${usd0(EX.monthlyInterestSavings)}/month less. Keep down-payment money liquid and FDIC-insured; avoid stocks for cash you'll need in under 5 years.`,
  },
  {
    q: "What other costs should I budget for beyond the down payment?",
    a:
      `Closing costs are the big one — typically 2–5% of the purchase price. On the appreciated ${usd0(EX.futureHomePrice)} home that's roughly ${usd0(EX.closingCosts)}, pushing total cash to close to about ${usd0(EX.cashToClose)} on top of inspection ($300–$500), appraisal ($400–$600), and moving costs. The calculator shows your full cash-to-close so you're not blindsided at the table.`,
  },
];

const STATS = [
  { stat: "20%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "Down payment that avoids PMI — saving $50–$200/month on your mortgage" },
  { stat: `~${usd0(EX.appreciationGap)}`, color: "text-rose-600",    accent: "bg-rose-500",    label: "Extra down payment the default scenario needs because the home appreciates while you save" },
  { stat: "~3%",   color: "text-amber-600",   accent: "bg-amber-500",   label: "Closing costs on the purchase price — the cash most buyers forget to budget for" },
];

const CONTENT_CARDS = [
  {
    icon: "🏠",
    title: "Understanding PMI",
    body: "Private Mortgage Insurance is required on most conventional loans with less than 20% down. It typically costs 0.5–1.5% of the loan per year — about $100–$300/month on a $300K loan. Once you hit 20% equity, you can request PMI removal.",
  },
  {
    icon: "💰",
    title: "The right savings vehicle",
    body: "For a down payment 2–5+ years away, a High-Yield Savings Account earning 4–5% APY is usually the right choice. For 5+ years out, some buyers use conservative bond funds. Never put short-term down payment savings in stocks.",
  },
  {
    icon: "🎯",
    title: "Chasing a moving target",
    body: "Home prices rarely stand still. If they appreciate 4%/year while you save, the down payment you need grows too — so this calculator sizes your goal off the projected price at purchase, not today's. That's why your monthly number is higher (and more honest) than a simple price × percentage.",
  },
];

const RELATED_CALCS = [
  { title: "Mortgage Calculator", description: "See your monthly payment and total interest.", href: "/tools/mortgage-calculator", icon: "🏦", accent: "bg-emerald-500/10" },
  { title: "Compound Interest Calculator", description: "Grow your down payment savings faster.", href: "/tools/compound-interest-calculator", icon: "📈", accent: "bg-blue-500/10" },
  { title: "Emergency Fund Calculator", description: "Build your financial safety net first.", href: "/tools/emergency-fund-calculator", icon: "🛡️", accent: "bg-amber-500/10" },
  { title: "Net Worth Calculator", description: "Track your full financial picture.", href: "/tools/net-worth-calculator", icon: "📊", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Down Payment Countdown Calculator",
      url: "https://worthulator.com/tools/down-payment-countdown",
      applicationCategory: "FinanceApplication",
      description: "Calculate monthly savings needed to hit your home down payment goal.",
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

export default function DownPaymentCountdown() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🏠"
        eyebrowText="Down Payment Countdown"
        title="How Much Do You Need to Save Each Month for Your Home?"
        description="The honest monthly number — accounting for HYSA interest, the moving target of home-price appreciation, and the closing costs most calculators ignore. Powered by live CPI data."
        chips={["HYSA interest", "Appreciation-adjusted", "Full cash to close"]}
      >
        <DownPaymentWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text="Most down payment calculators target today's price and ignore interest. This one targets the price at purchase and lets your HYSA do part of the work." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="How to save a down payment faster"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Down Payment Calculator Works"
        formula="Target = (price × (1 + appreciation)^years) × down% ;  Monthly = (Target − savings·(1+r)^n) ÷ (((1+r)^n − 1) ÷ r),  r = HYSA APY ÷ 12"
        steps={[
          { label: "Project the price", description: "Grow today's home price by your expected appreciation rate over the months until you buy." },
          { label: "Size the down payment", description: "Apply your down payment % to the projected purchase price — the real, moving target." },
          { label: "Credit your interest", description: "Grow current savings and each monthly deposit at the HYSA APY, then solve for the monthly amount that reaches the target." },
          { label: "Add cash to close", description: "Layer on ~3% closing costs so you see the full cash needed at the table, not just the down payment." },
        ]}
        paragraphs={[
          "A naive down payment calculator multiplies today's price by your down payment percentage, subtracts what you've saved, and divides by months. That misses three things that materially change the answer: your savings earn interest, the home keeps appreciating, and closing costs are real cash you need on top of the down payment.",
          `Using the defaults — a $400,000 home, 20% down, $5,000 saved, 36 months, and 4% appreciation — the home is projected to reach about ${usd0(EX.futureHomePrice)}, making the down payment ${usd0(EX.targetDown)} rather than $80,000. A ${HYSA_APY}% HYSA earns roughly ${usd0(EX.interestEarned)} along the way, so you need about ${usd0(EX.monthlySavings)}/month instead of ${usd0(EX.monthlyNoInterest)} in a 0% account. Add ~${usd0(EX.closingCosts)} in closing costs and your true cash to close is about ${usd0(EX.cashToClose)} — the number that actually matters when you make your offer.`,
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
