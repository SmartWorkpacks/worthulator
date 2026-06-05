import type { Metadata } from "next";
import DripWithInsights from "@/components/worthcore/DripWithInsights";
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
  title: "DRIP Calculator 2026 – Dividend Reinvestment vs Cash",
  description:
    "Model dividend reinvestment growth and see exactly how much more you keep by reinvesting vs taking dividends as cash. Includes final-year dividend income and the value in today's dollars using live CPI.",
  keywords: ["DRIP calculator", "dividend reinvestment calculator", "dividend reinvestment vs cash", "dividend compounding", "dividend snowball calculator", "passive income investment"],
  alternates: { canonical: "https://worthulator.com/tools/drip-calculator" },
};

const FAQS = [
  {
    q: "What is DRIP investing?",
    a:
      "DRIP stands for Dividend Reinvestment Plan. Instead of receiving dividends as cash, you automatically use them to buy more shares. This creates a compounding effect where each new share generates its own future dividends.",
  },
  {
    q: "What dividend yield should I use?",
    a:
      "The S&P 500 currently yields ~1.3–1.5%. Individual dividend stocks typically yield 2–5%, while high-yield dividend ETFs (like SCHD or VYM) yield 3–4%. REITs can yield 4–8%. Use the actual yield of the investment you're modeling.",
  },
  {
    q: "What's the difference between dividend yield and price growth?",
    a:
      "Dividend yield is the annual cash payment as a percentage of share price. Price growth is the appreciation in the share price itself. Total return combines both. This calculator lets you set each independently for accuracy.",
  },
  {
    q: "Is dividend investing better than growth investing?",
    a:
      "Not necessarily — total return matters most. A dividend stock returning 3% yield + 5% price growth equals 8% total return, roughly matching a growth stock at 8% appreciation with no dividend. The advantage of dividends is the reliable income stream.",
  },
  {
    q: "How often are dividends paid?",
    a:
      "Most US stocks pay dividends quarterly. Some pay monthly (many REITs and bond funds). A few pay annually. For compounding purposes, more frequent payments accelerate growth slightly — this calculator assumes annual compounding for simplicity.",
  },
];

const STATS = [
  { stat: "$43,269", color: "text-emerald-600", accent: "bg-emerald-500", label: "Extra you keep by reinvesting vs taking dividends as cash — default $10k + $200/mo, 4% yield, 20 yrs" },
  { stat: "~40%",    color: "text-blue-600",    accent: "bg-blue-500",    label: "Share of the S&P 500's long-run total return that has come from reinvested dividends" },
  { stat: "3.3×",    color: "text-amber-600",   accent: "bg-amber-500",   label: "Return multiple in the default scenario — $58k invested grows to ~$194k with DRIP" },
];

const CONTENT_CARDS = [
  {
    icon: "💧",
    title: "Why reinvesting dividends matters",
    body: "Studies show that reinvested dividends account for 40–50% of the S&P 500's total long-run return. Over a 30-year period, an investor who reinvests dividends ends up with roughly twice the portfolio value of one who takes dividends as cash.",
  },
  {
    icon: "📉",
    title: "The best stocks for DRIP investing",
    body: "Dividend Aristocrats (companies that have raised dividends for 25+ consecutive years) are popular DRIP choices: Johnson & Johnson, Coca-Cola, Procter & Gamble. ETFs like SCHD automate diversified dividend reinvestment.",
  },
  {
    icon: "📈",
    title: "Tax considerations",
    body: "Reinvested dividends are still taxable in the year received, even if you don't take the cash. In a tax-advantaged account like a Roth IRA or 401(k), DRIP investing is especially powerful because growth is tax-free.",
  },
];

const RELATED_CALCS = [
  { title: "Latte Factor Calculator", description: "See how daily habits cost you over time.", href: "/tools/latte-factor", icon: "☕", accent: "bg-emerald-500/10" },
  { title: "Compound Interest Calculator", description: "Model investment growth over any time frame.", href: "/tools/compound-interest-calculator", icon: "📊", accent: "bg-blue-500/10" },
  { title: "Emergency Fund Calculator", description: "Find out how much buffer you need.", href: "/tools/emergency-fund-calculator", icon: "🛡️", accent: "bg-amber-500/10" },
  { title: "Passive Income Calculator", description: "Plan for financial independence.", href: "/tools/passive-income-calculator", icon: "💰", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "DRIP Calculator",
      url: "https://worthulator.com/tools/drip-calculator",
      applicationCategory: "FinanceApplication",
      description: "Model dividend reinvestment portfolio growth over time.",
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

export default function DripCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="📈"
        eyebrowText="DRIP Calculator"
        title="How Much Will Your Dividend Portfolio Grow?"
        description="Model the compounding power of reinvesting dividends alongside regular contributions. Set your yield, price growth, and time horizon."
        chips={["Reinvest vs cash comparison", "Dividend snowball", "Value in today's dollars"]}
      >
        <DripWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text='Reinvested dividends account for nearly half of the stock market&apos;s long-run total return — <span class="font-semibold text-gray-900">the snowball is the strategy.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Why reinvesting beats taking the cash" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the DRIP Calculator Works"
        formula={`Each month (dividends reinvested):
  dividend = value × (yield / 12)
  value    = value × (1 + priceGrowth/12) + dividend + contribution

DRIP advantage = reinvested value − value if dividends taken as cash
Today's $      = value ÷ (1 + inflation)^years   (live FRED CPI)`}
        steps={[
          { label: "Set your starting investment", description: "The lump sum already in dividend-paying stocks or ETFs." },
          { label: "Add a monthly contribution", description: "Optional regular buying on top — it compounds alongside the dividends." },
          { label: "Enter yield and price growth separately", description: "Dividend yield drives the reinvestment snowball; price growth appreciates your shares." },
          { label: "Choose your horizon", description: "DRIP rewards time — the snowball accelerates in the later years." },
          { label: "Compare reinvest vs cash", description: "See the dollars you'd forfeit by spending dividends, plus the value in today's money." },
        ]}
        paragraphs={[
          "Rather than lumping dividends and price growth into one rate, this calculator simulates them separately month by month. Dividends are computed on your current balance and reinvested to buy more shares — which then pay their own dividends. With the default inputs ($10,000 + $200/month, 4% yield, 5% price growth, 20 years) the portfolio reaches about $194,000, of which roughly $60,000 is reinvested dividends.",
          "The defining DRIP number is the comparison: reinvesting finishes at ~$194,000, while taking those same dividends as uninvested cash would leave about $150,000 — a ~$43,000 advantage purely from reinvestment. The calculator also deflates the result by the live FRED CPI rate, so a $194,000 portfolio in 20 years is shown as roughly $103,000 in today's buying power.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
