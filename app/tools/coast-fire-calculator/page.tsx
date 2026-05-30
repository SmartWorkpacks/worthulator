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
  title: "Coast FIRE Calculator 2026 – Find Your Coast FIRE Number",
  description:
    "Calculate your Coast FIRE number — the amount you need saved today to retire without making another contribution. Stop guessing, start coasting.",
  keywords: ["coast fire calculator", "coast fire number", "how much do I need to coast fire", "coast fi calculator"],
  alternates: { canonical: "https://worthulator.com/tools/coast-fire-calculator" },
};

const FAQS = [
  {
    q: "What is Coast FIRE?",
    a: "Coast FIRE is the point where you have saved enough money that, even if you stop contributing today, your portfolio will grow on its own to fund a full retirement at your target date. You still work — but only to cover current living expenses, not to save for retirement.",
  },
  {
    q: "How is the Coast FIRE number calculated?",
    a: "Your Coast FIRE number is your retirement target divided by the compound growth factor over your remaining working years. For example, if you need $1.5M in 25 years at 7% return, your Coast FIRE number today is $1.5M ÷ (1.07)^25 = approximately $277,000.",
  },
  {
    q: "What is a good FIRE target number?",
    a: "A common rule is 25× your annual expenses (the 4% rule). If you spend $60,000/year in retirement, your target is $1.5M. Adjust for expected Social Security income, pension, or part-time work to reduce this figure.",
  },
  {
    q: "What return rate should I use?",
    a: "Use 6–7% for a diversified stock/bond portfolio after inflation. The S&P 500 has historically returned ~10% nominal or ~7% real. Being conservative (6–7%) adds safety margin to your Coast FIRE calculation.",
  },
  {
    q: "What if my current savings are above the Coast FIRE number?",
    a: "Congratulations — you have already hit Coast FIRE. You can technically stop all retirement contributions and let your money grow. Many people continue contributing anyway to reach full FIRE sooner, or to build buffer against market downturns.",
  },
];

const STATS = [
  { stat: "25×", color: "text-emerald-600", accent: "bg-emerald-500", label: "annual expenses is the standard FIRE target — the 4% safe withdrawal rate rule" },
  { stat: "7%", color: "text-amber-600", accent: "bg-amber-500", label: "inflation-adjusted historical S&P 500 return — the standard Coast FIRE assumption" },
  { stat: "< 40", color: "text-blue-600", accent: "bg-blue-500", label: "is the average age at which people hit Coast FIRE when starting to invest in their 20s" },
];

const CONTENT_CARDS = [
  {
    icon: "⛵",
    title: "What 'coasting' means",
    body: "Once you hit Coast FIRE, you no longer need to direct every spare dollar into retirement savings. You can take a lower-paying job you love, reduce hours, or simply stop the monthly investing grind — your future is already funded.",
  },
  {
    icon: "📈",
    title: "Compound growth does the heavy lifting",
    body: "The earlier you hit Coast FIRE, the more powerful it becomes. $100,000 at age 30 at 7% return becomes over $1.4M by age 65 without adding a single dollar. Time is the multiplier that makes coasting possible.",
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
        description="Find your Coast FIRE number — the savings balance where compound growth alone will fund your retirement, with no further contributions needed."
        chips={["Coast FIRE number", "Projected portfolio", "Years to retire"]}
      >
        <CalculatorEngineLoader slug="coast-fire-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Hit your Coast FIRE number and your money does all the retirement saving for you." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Understanding Coast FIRE" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Coast FIRE Calculator Works"
        paragraphs={[
          "Enter your current savings, your FIRE target (typically 25× annual expenses), your expected annual return, and the number of years until retirement. The calculator uses the present value formula to find the lump sum needed today to compound to your target — your Coast FIRE number.",
          "It also shows what your current savings will grow to, letting you see the gap (or surplus) between where you are now and where you need to be to start coasting.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
