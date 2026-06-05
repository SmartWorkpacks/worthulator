import type { Metadata } from "next";
import CoastFireWithInsights from "@/components/worthcore/CoastFireWithInsights";
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
  title: "Coast FIRE Calculator 2026 – Inflation-Adjusted Coast Number",
  description:
    "Find your Coast FIRE number done right — using the real (inflation-adjusted) return, not the nominal rate most calculators use. See how much more you actually need today, powered by live CPI data.",
  keywords: ["coast fire calculator", "coast fire number", "inflation adjusted coast fire", "real return coast fire", "how much do I need to coast fire", "coast fi calculator"],
  alternates: { canonical: "https://worthulator.com/tools/coast-fire-calculator" },
};

const FAQS = [
  {
    q: "What is Coast FIRE?",
    a: "Coast FIRE is the point where you have saved enough money that, even if you stop contributing today, your portfolio will grow on its own to fund a full retirement at your target date. You still work — but only to cover current living expenses, not to save for retirement.",
  },
  {
    q: "How is the Coast FIRE number calculated — and why is yours higher than other calculators?",
    a: "Your target (e.g. $1.5M) is in today's dollars, so your savings must grow at the REAL return — your nominal return minus inflation — to preserve buying power. Most calculators skip this: they grow at the full 7% nominal and report $1.5M ÷ (1.07)^25 ≈ $277,000. Using the real return (~3.7% after live ~3.2% CPI) the honest figure is about $607,000. We show both so you can see the ~$331,000 the naive method ignores.",
  },
  {
    q: "What is a good FIRE target number?",
    a: "A common rule is 25× your annual expenses (the 4% rule). If you spend $60,000/year in retirement, your target is $1.5M. Adjust for expected Social Security income, pension, or part-time work to reduce this figure.",
  },
  {
    q: "What return rate should I enter?",
    a: "Enter your expected NOMINAL return — the headline figure, ~7–10% for a diversified stock portfolio. The calculator subtracts the live CPI inflation rate to get the real return it uses for the coast number, because your target is stated in today's money. Lowering the rate adds an extra safety margin.",
  },
  {
    q: "What if my current savings are above the Coast FIRE number?",
    a: "Congratulations — you have already hit Coast FIRE. You can technically stop all retirement contributions and let your money grow. Many people continue contributing anyway to reach full FIRE sooner, or to build buffer against market downturns.",
  },
];

const STATS = [
  { stat: "25×",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Annual expenses = the standard FIRE target (the 4% safe-withdrawal rule)" },
  { stat: "$331k",color: "text-rose-600",    accent: "bg-rose-500",    label: "How much the naive nominal method under-states the default coast number by ignoring inflation" },
  { stat: "~3.7%",color: "text-amber-600",   accent: "bg-amber-500",   label: "Real return on a 7% nominal portfolio after live ~3.2% CPI — the rate that actually matters" },
];

const CONTENT_CARDS = [
  {
    icon: "⛵",
    title: "What 'coasting' means",
    body: "Once you hit Coast FIRE, you no longer need to direct every spare dollar into retirement savings. You can take a lower-paying job you love, reduce hours, or simply stop the monthly investing grind — your future is already funded.",
  },
  {
    icon: "📈",
    title: "Real growth does the heavy lifting",
    body: "Because your target is in today's dollars, what matters is the real (after-inflation) return. At a 7% nominal rate and ~3.2% inflation, $100,000 grows to about $247,000 of real buying power over 25 years — coasting works, but the inflation-honest math is what keeps the plan trustworthy.",
  },
  {
    icon: "🎯",
    title: "Compare to your current savings",
    body: "Use this calculator alongside your current portfolio value to see how close you are. If you have $80K saved and your Coast FIRE number is $120K, you might be just 2–3 years of focused saving away from financial breathing room.",
  },
];

const RELATED_CALCS = [
  { title: "FIRE Calculator", description: "Find your full FIRE number and timeline.", href: "/tools/fire-calculator", icon: "🔥", accent: "bg-red-500/10" },
  { title: "Compound Interest Calculator", description: "See how any investment grows over time.", href: "/tools/compound-interest-calculator", icon: "📈", accent: "bg-emerald-500/10" },
  { title: "Retirement Calculator", description: "Plan your full retirement savings strategy.", href: "/tools/retirement-calculator", icon: "🏖️", accent: "bg-amber-500/10" },
  { title: "Investment Calculator", description: "Model different investment scenarios.", href: "/tools/investment-calculator", icon: "💹", accent: "bg-blue-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Coast FIRE Calculator",
      url: "https://worthulator.com/tools/coast-fire-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate the amount you need saved today to retire without making another investment contribution.",
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

export default function CoastFireCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="⛵"
        eyebrowText="Coast FIRE"
        title="How Much Do You Need to Stop Saving for Retirement?"
        description="Find your Coast FIRE number the honest way — grown at the real, inflation-adjusted return so a target in today's dollars stays in today's dollars. Powered by live CPI data."
        chips={["Inflation-adjusted", "Real vs naive figure", "Live CPI data"]}
      >
        <CoastFireWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text="Most coast calculators ignore inflation and under-state your number. This one doesn't — it grows your savings at the real return." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Understanding Coast FIRE" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Coast FIRE Calculator Works"
        formula="Coast number = Target ÷ (1 + real return)^years,  where real return = (1 + nominal) ÷ (1 + inflation) − 1"
        steps={[
          { label: "Enter your inputs", description: "Current savings, FIRE target (typically 25× annual expenses), expected nominal return, and years until retirement." },
          { label: "Convert to a real return", description: "We remove the live CPI inflation rate from your nominal return using the Fisher equation." },
          { label: "Discount the target", description: "We discount your today's-dollars target back at the real return to find the lump sum you need invested now — your Coast FIRE number." },
          { label: "Project your savings", description: "We grow your current savings forward at the same real rate to show the gap or surplus versus the number." },
        ]}
        paragraphs={[
          "Coast FIRE is the moment your invested savings are large enough that, with no further contributions, compound growth alone carries you to a full retirement. The catch most calculators miss: your target is in today's dollars, so the growth that counts is the real (after-inflation) return — not the headline nominal rate.",
          "Using the defaults — $100,000 saved, a $1.5M target, a 7% nominal return and 25 years — the naive nominal method reports a coast number of about $277,000. But after removing live ~3.2% CPI inflation, the real return is ~3.7% and the honest coast number is about $607,000. That $331,000 gap is exactly what under-states so many coast plans, and it's why your current $100,000 (which grows to ~$247,000 of real buying power) still leaves a shortfall to close.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
