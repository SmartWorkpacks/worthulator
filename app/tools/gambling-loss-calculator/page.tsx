import type { Metadata } from "next";
import GamblingLossWithInsights from "@/components/worthcore/GamblingLossWithInsights";
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
  title: "Gambling Loss Calculator 2026 – True Cost & Opportunity Cost of Gambling",
  description:
    "See the true long-term cost of gambling habits and what that money would be worth if invested instead. Calculate total losses and opportunity cost over any time period.",
  keywords: ["gambling loss calculator", "cost of gambling calculator", "gambling opportunity cost", "how much does gambling cost", "gambling vs investing"],
  alternates: { canonical: "https://worthulator.com/tools/gambling-loss-calculator" },
};

const FAQS = [
  {
    q: "How much does gambling really cost long-term?",
    a: "The house always wins in the long run. Most casino games have a house edge of 1–15%: slots (2–15%), roulette (2.7–5.3%), blackjack (0.5–2%), sports betting (5–10% vig). Over time, every dollar bet returns less than a dollar on average. $50/week at a 5% effective loss rate = $130 annually in pure losses — plus the opportunity cost of not investing that money.",
  },
  {
    q: "What is the opportunity cost of gambling?",
    a: "Opportunity cost is what your gambling money would be worth if invested instead. $50/week invested at 7% annually for 10 years grows to approximately $37,600. If you instead lost that $50/week gambling (total loss: $26,000), the true cost isn't just $26,000 — it's the $37,600 you could have had, making the real cost $63,600 in lost wealth.",
  },
  {
    q: "Is gambling addiction a financial or mental health problem?",
    a: "Both. Problem gambling is classified as a behavioral addiction by the DSM-5 and activates the same brain reward circuits as substance addiction. The financial damage — lost savings, debt, bankruptcy — is the most visible consequence, but relationship breakdown, depression, and anxiety are equally prevalent. If gambling is causing financial stress, seeking help from the National Council on Problem Gambling (1-800-522-4700) or Gamblers Anonymous is recommended.",
  },
  {
    q: "What percentage of gamblers lose money over time?",
    a: "Over the long term, approximately 89–95% of casino gamblers lose money. The profitability of the gambling industry ($500B+ global revenue) is funded entirely by player losses. Even sports bettors — often the most 'skilled' form — show that less than 5% maintain long-term profits, and professional edge cases exist only in very specific, exploitable market inefficiencies.",
  },
  {
    q: "What should I do if I want to stop gambling?",
    a: "Practical steps: self-exclude from all gambling sites and venues (most jurisdictions have formal self-exclusion programs), delete betting apps, block gambling sites (Gamban, BetBlocker are free tools), replace the trigger behavior with an alternative, and seek support from a counsellor or support group. Cognitive behavioral therapy (CBT) has strong evidence for treating gambling disorder.",
  },
];

const STATS = [
  { stat: "5–10%", color: "text-emerald-600", accent: "bg-emerald-500", label: "typical house edge on sports bets (the 'vig') — your guaranteed long-run loss rate" },
  { stat: "89%+", color: "text-blue-600", accent: "bg-blue-500", label: "of regular casino gamblers lose money over a sustained period" },
  { stat: "$500B", color: "text-amber-600", accent: "bg-amber-500", label: "global gambling industry revenue — funded entirely by player losses" },
];

const CONTENT_CARDS = [
  {
    icon: "📉",
    title: "The house edge is relentless",
    body: "A 5% house edge means for every $100 wagered, you lose $5 on average. That doesn't sound catastrophic — but if you play through $1,000 in an evening (betting $10 rounds), you lose around $50 in expected value. Over a year of weekly sessions, those edges compound into thousands of dollars. The math is inescapable.",
  },
  {
    icon: "💹",
    title: "Investing the same money instead",
    body: "The US stock market has returned approximately 7% annually after inflation over long periods. $50/week invested at 7% for 20 years = $109,000. This calculator shows you the precise wealth gap between gambling that money and investing it — the real cost isn't what you lose, it's what you give up.",
  },
  {
    icon: "🆘",
    title: "Signs of problem gambling",
    body: "Warning signs include: betting more than you can afford to lose, chasing losses to 'win back' money, lying to family about gambling, missing bills or borrowing to gamble, and feeling anxious or depressed about gambling outcomes. These are not character flaws — they're symptoms of a recognised addiction. Help is available and effective.",
  },
];

const RELATED_CALCS = [
  { title: "Latte Factor Calculator", description: "What small daily habits cost over time.", href: "/tools/latte-factor", icon: "☕", accent: "bg-emerald-500/10" },
  { title: "Quit Smoking Calculator", description: "True annual and lifetime cost of smoking.", href: "/tools/quit-smoking-calculator", icon: "🚭", accent: "bg-blue-500/10" },
  { title: "Compound Interest Calculator", description: "See your money grow if invested instead.", href: "/tools/compound-interest-calculator", icon: "📈", accent: "bg-amber-500/10" },
  { title: "Missed Investment Calculator", description: "The cost of delaying any investment.", href: "/tools/missed-investment", icon: "⏳", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Gambling Loss Calculator",
      url: "https://worthulator.com/tools/gambling-loss-calculator",
      applicationCategory: "FinanceApplication",
      description: "See the true long-term cost of gambling habits and what that money would be worth if invested instead.",
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

export default function GamblingLossCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🎰"
        eyebrowText="Gambling Loss Calculator"
        title="What Is Your Gambling Habit Actually Costing You?"
        description="Enter your weekly gambling spend and how many years to project to see your total losses — and what that same money would be worth if invested at 7% instead."
        chips={["Total losses shown", "Investment comparison", "Opportunity cost calculated"]}
      >
        <GamblingLossWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text="The real cost of gambling isn't just what you lose — it's the <span class='font-semibold text-gray-900'>wealth you give up</span> by not investing that money instead." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The true mathematics of gambling" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Gambling Loss Calculator Works"
        formula="Total Loss = Weekly Spend × 52 × Years\nIf Invested = Annual Spend × ((1.07ⁿ − 1) ÷ 0.07)\nOpportunity Cost = Invested Value − Total Loss"
        paragraphs={[
          "The calculator assumes weekly spending is lost entirely (consistent with long-run expected outcomes given house edges). Annual spend is then projected as if invested at 7% annually — a common long-run US stock market return estimate — using the future value of an annuity formula.",
          "The opportunity cost is the difference: the wealth you could have built versus the money spent. This is the true financial cost of the habit over time.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
