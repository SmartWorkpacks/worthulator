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
  title: "DRIP Calculator 2026 – Dividend Reinvestment Growth Calculator",
  description:
    "Model the compounding power of dividend reinvestment. See how reinvesting dividends plus regular contributions grows your portfolio over time.",
  keywords: ["DRIP calculator", "dividend reinvestment calculator", "dividend compounding", "passive income investment"],
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
  { stat: "$200+", color: "text-emerald-600", accent: "bg-emerald-500", label: "average monthly forgotten subscriptions the typical US household pays" },
  { stat: "10–15×", color: "text-blue-600", accent: "bg-blue-500", label: "long-term investment multiplier on monthly savings at 7% over 30 years" },
  { stat: "60%", color: "text-amber-600", accent: "bg-amber-500", label: "of people underestimate their monthly subscription spend by this margin" },
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
        chips={["Dividend yield + price growth", "Monthly contributions", "25-year projection"]}
      >
        <CalculatorEngineLoader slug="drip-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Reinvested dividends account for nearly half of the stock market's total historical return." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The power of stopping the drip"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the DRIP Calculator Works"
        paragraphs={[
          "The calculator combines dividend yield and price growth into a total annual return rate. It then calculates the future value of both your lump-sum initial investment and monthly contributions compounded at that rate.",
          "Formula: FV = initial × (1 + monthlyRate)^months + monthlyContrib × ((1 + monthlyRate)^months − 1) / monthlyRate. The total gain is the final value minus all contributions made.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
