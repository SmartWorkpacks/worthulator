import type { Metadata } from "next";
import FireWithInsights from "@/components/worthcore/FireWithInsights";
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
  title: "FIRE Calculator 2026 – FIRE Number, Years to FIRE & Savings Rate",
  description:
    "Calculate your FIRE number (25× expenses), years to financial independence, savings rate, passive income now, and how many years $500/month extra saves. Based on the 4% rule (Bengen 1994 / Trinity Study).",
  keywords: [
    "FIRE calculator",
    "financial independence calculator",
    "FIRE number calculator",
    "retire early calculator",
    "4% rule calculator",
    "how much do I need to retire",
    "years to FIRE",
    "savings rate calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/fire-calculator" },
  robots: { index: true, follow: true },
};

// ── Default scenario verification ────────────────────────────────────────────
// monthlyExpenses = $4,000 | currentSavings = $50,000
// monthlySavings  = $2,000 | annualReturn   = 7%
//
// fireNumber        = $4,000 × 12 × 25 = $1,200,000
// savingsRate       = 2,000 / (2,000 + 4,000) × 100 = 33.3%
// percentFunded     = 50,000 / 1,200,000 × 100 = 4.2%
// passiveIncomeNow  = 50,000 × 0.04 / 12 = $167/mo
// yearsToFire       ≈ 19.6 years (month simulation: 235 months)
// yearsFasterWith500 ≈ 2.1 years ($2,500/mo → ~17.5 years)
// ─────────────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What is the FIRE number and how is $1,200,000 calculated?",
    a: "Your FIRE number is 25× your annual expenses — the portfolio size where a 4% annual withdrawal covers your spending indefinitely. With $4,000/month in expenses ($48,000/year), the FIRE number is $48,000 × 25 = $1,200,000. The 25× multiplier comes directly from the 4% rule: 1 ÷ 0.04 = 25. At $1,200,000, a 4% withdrawal delivers exactly $48,000/year = $4,000/month.",
  },
  {
    q: "How is the 19.6-year timeline calculated?",
    a: "The calculator runs a month-by-month compound growth simulation. Starting with $50,000, adding $2,000/month at a 7% annual return (0.5833%/month), the balance grows each month: Balance × 1.005833 + $2,000. After approximately 235 months (19.6 years), the balance crosses $1,200,000. The closed-form verification: n = ln((target × r + PMT) / (PV × r + PMT)) / ln(1 + r) ≈ 235 months.",
  },
  {
    q: "What is the 4% rule and where does it come from?",
    a: "The 4% rule was established by financial planner William Bengen in 1994, analyzing historical portfolio returns from 1926–1992. He found that a 4% annual withdrawal from a diversified stock/bond portfolio had never failed over any 30-year period. The Trinity Study (1998) confirmed this: a 50/50 stock-bond portfolio at 4% withdrawal succeeded 95%+ of the time over 30 years. Your FIRE number = annual expenses × 25 because 1/4% = 25.",
  },
  {
    q: "Why does the savings rate use investments ÷ (investments + expenses) instead of investments ÷ income?",
    a: "The FIRE movement defines savings rate as savings ÷ (savings + expenses) because it's income-independent and directly encodes the timeline. At the defaults ($2,000 invested, $4,000 expenses), the rate is 2,000 / (2,000 + 4,000) = 33.3%. Using income as the denominator inflates the number and hides the real driver: the higher your spending relative to savings, the longer your timeline. This definition also explains why a 50% savings rate means ~17 years regardless of whether you earn $40k or $200k.",
  },
  {
    q: "What does 'passive income now' mean — how is $167/month calculated?",
    a: "Passive income now is what your current savings would generate if you applied the 4% withdrawal rule today. At $50,000 invested: $50,000 × 0.04 = $2,000/year ÷ 12 = $167/month. This isn't money you're withdrawing — it shows you're already partially financially independent. Every $25,000 you add generates roughly $83/month more. When this monthly number equals your expenses ($4,000), you've reached FIRE.",
  },
  {
    q: "How does adding $500/month cut 2.1 years off the timeline?",
    a: "Increasing monthly investment from $2,000 to $2,500 shortens the timeline from ~19.6 years to ~17.5 years — a 2.1-year acceleration. The effect is non-linear: the extra $500/month doesn't just add $6,000/year; each dollar compounds for the full remaining period at 7%. Earlier $500/month contributions generate more than later ones because they compound longer. At a shorter baseline (say, 10 years), the same +$500/month would save less than 2 years; at a 30-year baseline, it would save more.",
  },
];

const STATS = [
  {
    stat: "25×",
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "The FIRE multiplier: 25× annual expenses = your FIRE number (1 ÷ 4% = 25)",
  },
  {
    stat: "50%",
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "The FIRE target savings rate — at 50% savings rate, timeline is ~17 years regardless of income",
  },
  {
    stat: "17yr",
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Years to FIRE at 50% savings rate — drops from 40+ years at 10%, proving savings rate beats salary",
  },
];

const CONTENT_CARDS = [
  {
    icon: "🔥",
    title: "Savings rate beats income — every time",
    body: "A high earner saving 5% and a modest earner saving 50% both spend 95% or 50% of their cash flow respectively — but their FIRE timelines are radically different: 66 years vs 17 years. The math is self-reinforcing: cutting expenses reduces the FIRE target AND raises the savings rate simultaneously, compressing the timeline from both ends.",
  },
  {
    icon: "📈",
    title: "The 4% rule: 25× for a reason",
    body: "William Bengen's 1994 research — and the Trinity Study in 1998 — found that withdrawing 4% of a diversified portfolio annually had a 95%+ success rate over every 30-year period from 1926–1992. Your FIRE number is 25× annual expenses because 1 ÷ 4% = 25. At $4,000/month ($48,000/year), that's $1,200,000 — a precise, research-backed target, not a round estimate.",
  },
  {
    icon: "🎯",
    title: "Lean FIRE, Fat FIRE, and Coast FIRE",
    body: "Lean FIRE: retire on $25–40k/year ($625k–$1M target). Fat FIRE: keep a high-spending lifestyle at $80–150k/year ($2M–$3.75M target). Coast FIRE: save enough early that compound growth carries you to FIRE without another dollar contributed. This calculator computes full FIRE. Use the Coast FIRE calculator for the coasting scenario.",
  },
];

const RELATED_CALCS = [
  {
    title: "Coast FIRE Calculator",
    description: "Find how much to save now so growth alone carries you to FIRE.",
    href: "/tools/coast-fire-calculator",
    icon: "🌊",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Millionaire Calculator",
    description: "How many years until your portfolio hits $1,000,000.",
    href: "/tools/millionaire-calculator",
    icon: "💰",
    accent: "bg-blue-500/10",
  },
  {
    title: "Savings Goal Calculator",
    description: "Project your savings growth to any target amount.",
    href: "/tools/savings-goal-calculator",
    icon: "🏦",
    accent: "bg-amber-500/10",
  },
  {
    title: "Missed Investment Calculator",
    description: "The compounding cost of delaying an investment.",
    href: "/tools/missed-investment-calculator",
    icon: "📉",
    accent: "bg-purple-500/10",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "FIRE Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate your FIRE number (25× expenses), years to financial independence, savings rate, percent funded, passive income now, and how many years $500/month extra saves — using the 4% rule (Bengen 1994 / Trinity Study 1998).",
      url: "https://worthulator.com/tools/fire-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

export default function FireCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SimpleCalculatorHero
        eyebrowIcon="🔥"
        eyebrowText="Investing · Financial Independence"
        title="FIRE Calculator"
        description="Enter your monthly expenses, current savings, and monthly investment to see your FIRE number (25× expenses), years to financial independence, savings rate, percent funded, passive income your savings generate today, and how many years $500/month extra saves."
        chips={["FIRE number (25× expenses)", "Years to FIRE", "Savings rate", "Passive income now"]}
      >
        <FireWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Your savings rate matters more than your salary — <span class="font-semibold text-gray-900">saving 50% reaches FIRE in ~17 years at any income level; saving 10% takes 40+ years.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="The math behind financial independence"
        subtitle="Why FIRE is a savings rate game, not an income game."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the FIRE Calculator Works"
        formula={`FIRE Number         = Monthly Expenses × 12 × 25
                  (25× because 1 ÷ 4% = 25 — the 4% safe withdrawal rule)

Savings Rate        = Monthly Investment ÷ (Monthly Investment + Monthly Expenses) × 100
                  (FIRE movement standard — income-independent)

Month-by-month simulation until balance ≥ FIRE Number:
  Balance(m+1)      = Balance(m) × (1 + AnnualReturn/100/12) + Monthly Investment
  yearsToFire       = months ÷ 12   (capped at 100 if never reached)

Passive Income Now  = Current Savings × 0.04 ÷ 12
                  (monthly income at 4% withdrawal applied to today's balance)

+$500/mo Saves      = yearsToFire(current) − yearsToFire(current + $500/mo)`}
        steps={[
          {
            label: "Enter your monthly expenses",
            description:
              "Total monthly spending — housing, food, transport, subscriptions, everything. This single number drives your FIRE number ($4,000/mo → $1,200,000) and the denominator of your savings rate. Reducing expenses is the most powerful lever: it cuts the target AND raises the savings rate simultaneously.",
          },
          {
            label: "Enter current savings",
            description:
              "Total invested assets today — index funds, 401(k), IRA, taxable brokerage accounts. Not home equity, emergency cash, or a savings account. Default $50,000 already generates $167/month in passive income at the 4% rule, and covers 4.2% of a $1,200,000 FIRE number.",
          },
          {
            label: "Set your monthly investment",
            description:
              "How much you add to investments each month. At $2,000/month with $4,000 in expenses, your savings rate is 33.3% — above average, but below the 50% FIRE target. Every $500 more per month cuts roughly 2 years off the default 19.6-year timeline.",
          },
          {
            label: "Choose expected annual return",
            description:
              "7% is the S&P 500's long-run inflation-adjusted average (Vanguard Capital Markets Model 2024: 6.9–7.9%). Use 5–6% for a conservative projection (mixed bonds/equities). The simulation runs monthly at AnnualReturn/12 per month.",
          },
          {
            label: "Read all six outputs",
            description:
              "FIRE number (25× annual expenses), years to FIRE (month simulation), savings rate (investments ÷ cash flow), percent funded (current savings as % of FIRE number), passive income now (what current savings generate today at the 4% rule), and years saved by adding $500/month.",
          },
        ]}
        paragraphs={[
          "At the default inputs — $4,000/month expenses, $50,000 current savings, $2,000/month invested, 7% return — the calculator produces a $1,200,000 FIRE number reached in 19.6 years, with a 33.3% savings rate. Your $50,000 in current savings already generates $167/month in passive income under the 4% rule. Adding $500/month accelerates the timeline by approximately 2.1 years.",
          "The 4% rule (Bengen 1994, Trinity Study 1998) underpins the FIRE number calculation: a 4% annual withdrawal from a 50/50 diversified portfolio has historically succeeded over every 30-year period since 1926 with 95%+ probability. FIRE number = 25× annual expenses because 1 ÷ 4% = 25. A more conservative 3.5% withdrawal (28× expenses) is appropriate for 40+ year retirements.",
          "Savings rate is calculated as investments ÷ (investments + expenses) — the FIRE movement standard. This definition is income-independent: a person earning $60k/year who saves $2,000/month and spends $4,000/month has the same 33.3% savings rate as a person earning $300k/year doing the same. At 50%, the timeline is roughly 17 years regardless of salary. This is why FIRE practitioners focus on controlling spending, not just growing income.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Tools for your path to financial independence."
        items={RELATED_CALCS}
      />
    </>
  );
}
