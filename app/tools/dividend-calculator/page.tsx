import type { Metadata } from "next";
import DividendCalculatorLoader from "./DividendCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateDividend } from "@/lib/calculators/dividendEngine";

// ─── Worked example (single source of truth — illustrative assumptions) ───────
// $100k at a 3.5% yield, 6% dividend growth, 4% price growth, 20 yrs, reinvested.
const EX = calculateDividend({
  investmentAmount: 100_000,
  dividendYieldPct: 3.5,
  dividendGrowthPct: 6,
  priceGrowthPct: 4,
  years: 20,
  reinvest: true,
});
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "Dividend Calculator – Project Dividend Income & Yield on Cost",
  description:
    "Estimate your dividend income, yield on cost, and total return. See how rising dividends and reinvestment grow your passive income year by year.",
  keywords: ["dividend calculator", "dividend income calculator", "dividend yield calculator", "yield on cost calculator", "dividend growth calculator", "passive income calculator"],
  alternates: { canonical: "https://worthulator.com/tools/dividend-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How is dividend income calculated?",
    a: `Annual dividend income = investment amount × dividend yield. A ${usd(100_000)} position at a 3.5% yield pays about ${usd(3_500)} in the first year. As the company raises its dividend, that payment grows — in our 20-year example it reaches ${usd(EX.finalAnnualIncome)}/yr.`,
  },
  {
    q: "What is yield on cost?",
    a: `Yield on cost is your current annual dividend divided by what you originally paid. It rises over time as dividends grow, even though the stated yield on today's price stays similar. In the example, 20 years of 6% dividend growth lifts the yield on cost to about ${EX.yieldOnCostPct}%.`,
  },
  {
    q: "What dividend yield and growth rate should I use?",
    a: "Use the actual figures for your holding. The S&P 500 yields ~1.3–1.5%; dividend ETFs like SCHD or VYM yield ~3–4%; REITs often yield 4–8%. Dividend growth varies — quality 'dividend growers' raise payouts ~6–10% a year, but there's no guarantee.",
  },
  {
    q: "Should I reinvest dividends or take the cash?",
    a: "Reinvesting (a DRIP) compounds your share count so each new share pays its own dividends — powerful during the accumulation phase. Taking cash makes sense once you need the income to live on. This calculator lets you toggle between the two.",
  },
  {
    q: "How is this different from the DRIP calculator?",
    a: "This calculator focuses on the income stream — your annual/monthly dividends and yield on cost over time. The DRIP calculator focuses on reinvestment versus cash and the final portfolio value. Use whichever matches the question you're asking.",
  },
];

const STATS = [
  { stat: usd(EX.annualIncomeYear1), color: "text-violet-600", accent: "bg-violet-500", label: `year-1 income on a ${usd(100_000)} position at a 3.5% yield` },
  { stat: usd(EX.finalAnnualIncome), color: "text-blue-600", accent: "bg-blue-500", label: `annual income after 20 years of 6% dividend growth, reinvested` },
  { stat: `${EX.yieldOnCostPct}%`, color: "text-amber-600", accent: "bg-amber-500", label: `yield on cost after 20 years — vs the 3.5% you started with` },
];

const CONTENT_CARDS = [
  {
    icon: "💵",
    title: "Income today, growing tomorrow",
    body: `Your yield sets the starting income — ${usd(EX.annualIncomeYear1)}/yr in the example. But the real story is growth: as the company hikes its dividend each year, the same shares pay more, with no extra investment from you.`,
  },
  {
    icon: "📈",
    title: "Yield on cost climbs",
    body: `Buy at a 3.5% yield and hold through 6% annual raises, and after 20 years you're effectively earning a ${EX.yieldOnCostPct}% yield on what you paid. Long-term dividend-growth investors prize this rising yield on cost.`,
  },
  {
    icon: "❄️",
    title: "Reinvesting builds a snowball",
    body: `With reinvestment on, dividends buy more shares that pay their own dividends. Over the period you collect ${usd(EX.totalDividends)} in dividends — all compounding back into the position.`,
  },
];

const RELATED_CALCS = [
  { title: "DRIP Calculator", description: "Reinvestment vs cash, side by side.", href: "/tools/drip-calculator", icon: "🔄", accent: "bg-emerald-500/10" },
  { title: "Compound Interest Calculator", description: "Growth with regular contributions.", href: "/tools/compound-interest-calculator", icon: "📈", accent: "bg-blue-500/10" },
  { title: "ROI Calculator", description: "Total return on any investment.", href: "/tools/roi-calculator", icon: "🎯", accent: "bg-violet-500/10" },
  { title: "FIRE Calculator", description: "Could dividends fund early retirement?", href: "/tools/fire-calculator", icon: "🔥", accent: "bg-amber-500/10" },
];

export default function DividendCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Dividend Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Project dividend income, yield on cost, and total return from a dividend-paying investment, with optional reinvestment.",
      url: "https://worthulator.com/tools/dividend-calculator",
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
        eyebrowIcon="💰"
        eyebrowText="Investing · Dividend Income · Yield on Cost"
        title="Dividend Calculator"
        description="Project your dividend income, see your yield on cost climb as payouts grow, and watch reinvestment compound your passive income year by year."
        chips={["Annual & monthly income", "Yield on cost", "Income growth chart"]}
      >
        <DividendCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`Dividends <span class="font-semibold text-gray-900">grow</span>: a 3.5% starting yield with 6% annual raises becomes a ${EX.yieldOnCostPct}% yield on cost after 20 years — ${usd(EX.finalAnnualIncome)}/yr from a ${usd(100_000)} start.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="The power of growing dividends"
        subtitle="A dividend stock isn't just a yield today — it's a rising income stream."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Dividend Calculator Works"
        formula={`Year-1 income = Investment × Dividend yield
Incomeₜ = shares × dps₀ × (1 + dividend growth)^(t−1)
Yield on cost = Final annual income ÷ Original investment

If reinvesting: each year's dividends buy more shares
at that year's price, raising future income.`}
        steps={[
          { label: "Enter your investment", description: "The amount you're putting in (or already hold)." },
          { label: "Enter the dividend yield", description: "The current annual payout as a % of price." },
          { label: "Set growth assumptions", description: "How fast the dividend and share price rise." },
          { label: "Choose a horizon and DRIP", description: "Years held, and whether to reinvest dividends." },
          { label: "See your income", description: "Annual/monthly income, yield on cost, and the growth curve." },
        ]}
        paragraphs={[
          `Dividend investing is about a growing stream of cash, not just a one-time yield. A ${usd(100_000)} position at a 3.5% yield starts at ${usd(EX.annualIncomeYear1)}/yr — but with 6% annual dividend increases and reinvestment, the income compounds to ${usd(EX.finalAnnualIncome)}/yr over 20 years, a ${EX.yieldOnCostPct}% yield on your original cost.`,
          "The two big levers are dividend growth (companies raising their payouts) and reinvestment (using dividends to buy more shares). Together they create the 'dividend snowball' that long-term income investors rely on. Remember these are projections: real yields and growth vary, dividends can be cut, and taxes apply — this is an educational tool, not investment advice.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for income and investing."
        items={RELATED_CALCS}
      />
    </main>
  );
}
