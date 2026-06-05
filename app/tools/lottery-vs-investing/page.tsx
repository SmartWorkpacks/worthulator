import type { Metadata } from "next";
import LotteryVsInvestingWithInsights from "@/components/worthcore/LotteryVsInvestingWithInsights";
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
  title: "Lottery vs Investing Calculator 2026 – The Real Math",
  description: "The 'Hope Tax.' See what those weekly tickets would be worth if you'd just bought the S&P 500.",
  keywords: ["lottery vs investing calculator", "lottery opportunity cost", "what if I invested lottery money", "lottery ticket cost calculator"],
  alternates: { canonical: "https://worthulator.com/tools/lottery-vs-investing" },
};

const FAQS = [
  { q: "What are the actual odds of winning the lottery?", a: "Powerball jackpot odds: 1 in 292 million. Mega Millions: 1 in 302 million. You're more likely to be struck by lightning twice. The expected value of a $2 Powerball ticket is roughly $0.35." },
  { q: "How much do Americans spend on lottery tickets?", a: "Americans spend over $105 billion on lottery tickets per year — more than on movies, video games, and books combined. The average household spends about $1,000 per year on tickets." },
  { q: "Is the lottery a tax on people who can't do math?", a: "It's a reductive framing, but the math is brutal. State lotteries typically return only 50–60 cents per dollar wagered. In contrast, low-cost index funds average 7%+ annually over long periods." },
  { q: "What's the lump sum vs annuity trade-off?", a: "The lump sum is typically ~60% of the advertised jackpot. After federal taxes (37%) and state taxes, a $100M jackpot might net ~$29M as a lump sum — a significant reduction from the headline number." },
  { q: "Are there any arguments for playing?", a: "Entertainment value and the fantasy of 'what if.' Playing $2 occasionally for the psychological enjoyment of imagining a win isn't irrational. The problem is when it becomes a regular habit or a financial strategy." },
];

const STATS = [
  { stat: "1 in 300M", color: "text-rose-600",    accent: "bg-rose-500",    label: "odds of winning a major lottery jackpot" },
  { stat: "$105B",     color: "text-amber-600",   accent: "bg-amber-500",   label: "spent on lottery tickets by Americans annually" },
  { stat: "7× more",  color: "text-emerald-600", accent: "bg-emerald-500", label: "likely to be struck by lightning than win Powerball" },
];

const CONTENT_CARDS = [
  { icon: "🎰", title: "Expected value is always negative", body: "Lottery tickets return about 50–60 cents per dollar on average. Every dollar you spend is a negative expected value bet. Investing the same dollar in a diversified index fund has historically turned it into $7+ over 30 years." },
  { icon: "📈", title: "The compound growth alternative", body: "$20/week invested at 7% for 20 years = over $108,000. The same $20/week on lottery tickets = $20,800 spent, likely with minimal return. The gap widens every year thanks to compounding." },
  { icon: "🏛️", title: "State lotteries are designed for states", body: "Lottery revenue funds state budgets — education and infrastructure in many states. The return to players is intentionally low. You're not gambling against other players; you're donating to government with a slim chance of a refund." },
];

const RELATED_CALCS = [
  { icon: "📈", accent: "bg-emerald-500/10", title: "Compound Interest",          description: "See what regular investing actually grows to.",   href: "/tools/compound-interest-calculator" },
  { icon: "☕", accent: "bg-amber-500/10",   title: "Latte Factor Calculator",    description: "What do daily habits cost over time?",            href: "/tools/latte-factor-calculator" },
  { icon: "💸", accent: "bg-rose-500/10",    title: "Missed Investment Cost",     description: "The cost of not investing over the years.",       href: "/tools/missed-investment-calculator" },
  { icon: "👁️", accent: "bg-blue-500/10",    title: "Inflation Impact",           description: "Even savings lose value without returns.",        href: "/tools/inflation-impact-calculator" },
];

export default function LotteryVsInvesting() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="🎰"
        eyebrowText="Lottery vs Investing"
        title="Lottery vs. Investing Calculator"
        description="Enter your weekly lottery spend and see what that same money would be worth if invested instead. The math is uncomfortable — but it's worth knowing."
        chips={["If invested instead", "Total spent on tickets", "The real opportunity cost"]}
      >
        <LotteryVsInvestingWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text="$20/week on lottery tickets over 20 years costs $20,800. The same amount invested at 7% becomes over $108,000." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The math of the lucky habit" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the opportunity cost is calculated"
        formula={`Total Spent   = Weekly Spend × 52 × Years
FV Invested   = Weekly Spend × [(1 + r)^n − 1] ÷ r
r = weekly return rate,  n = total weeks
Opportunity Cost = FV Invested − Total Spent`}
        paragraphs={[
          "Invested value = weekly contribution × [(1+r)ⁿ − 1] / r, where r = weekly return rate and n = total weeks. This is standard future value of regular contributions formula.",
          "Total spent = weekly × 52 × years. The gap = invested value − spent. This gap represents the real opportunity cost of the lottery habit over your chosen time period.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
