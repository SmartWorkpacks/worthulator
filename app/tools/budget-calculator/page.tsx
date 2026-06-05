import type { Metadata } from "next";
import { BudgetWithInsights } from "@/components/worthcore/BudgetWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateBudget } from "@/calculations/finance/budget";
import { NATIONAL_AVG_SALES_TAX } from "@/lib/datasets/tax/salesTaxRates";

/* ── Step 5c: derive the live sales-tax figures in the copy from the dataset ─ */
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
const EX = calculateBudget(
  { income: 5000, housing: 1500, food: 600, transport: 400, debt: 300, other: 500 },
  { salesTaxRate: NATIONAL_AVG_SALES_TAX, groceryExempt: false },
);
const EX_TAX_YR = EX.salesTaxAnnual ?? 0;
const EX_TAX_MO = EX.salesTaxMonthly ?? Math.round(EX_TAX_YR / 12);

export const metadata: Metadata = {
  title: "Budget Calculator 2026 – 50/30/20 Planner with Savings Rate",
  description:
    "Break down your take-home pay against the 50/30/20 rule, see your savings rate, and reveal the sales tax hidden inside your spending using your state's live combined rate.",
  keywords: ["budget calculator", "50/30/20 budget calculator", "monthly budget calculator", "savings rate calculator", "how much should I save", "needs wants savings"],
  alternates: { canonical: "https://worthulator.com/tools/budget-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is a healthy savings rate?",
    a: "Most planners recommend saving at least 20% of take-home pay (the 50/30/20 rule). The example budget here — $5,000 take-home with $3,300 of expenses — leaves $1,700, a 34% savings rate, comfortably above target. The US personal savings rate is just 4.6% (BEA, 2024), so any positive rate beats the average, and above 30% puts you on track for early financial independence.",
  },
  {
    q: "What is the 50/30/20 budget rule?",
    a: "It allocates take-home pay to 50% needs (housing, food, transport, debt), 30% wants (dining out, shopping, subscriptions), and 20% savings. In the default example, needs run 56% ($2,800), wants 10% ($500), and savings 34% ($1,700) — so essentials are slightly over the 50% line while savings are well ahead. The calculator benchmarks your actual split against these targets.",
  },
  {
    q: "Why does this calculator show sales tax inside my budget?",
    a: `Because it's a real, recurring cost most budgets never itemise. Using your state's live combined rate (Tax Foundation 2026), it estimates the tax on your taxable spending — discretionary goods, plus groceries in states that tax them. On the $5,000 example at the ${NATIONAL_AVG_SALES_TAX}% US-average rate, that's about ${usd0(EX_TAX_YR)}/year (~${usd0(EX_TAX_MO)}/month) hidden in your spending. Pick a grocery-exempt state and food drops out of the taxable base automatically.`,
  },
  {
    q: "How do I reduce my expense ratio?",
    a: "Attack your largest fixed expenses first — housing and transport often make up 40–60% of budgets. Downsizing, refinancing, or moving beats cutting small discretionary spends. Then audit subscriptions (the average household has 12+), food costs (meal prep vs takeout), and debt interest. In the default budget, housing alone is 30% of income — the single biggest lever.",
  },
  {
    q: "Should I include irregular expenses in my monthly budget?",
    a: "Yes — car insurance, annual subscriptions, and holiday spending should be divided by 12 and added as a monthly 'sinking fund' line in the Other category. Most budget shortfalls come not from daily overspending but from irregular costs that weren't planned for. Budget for them monthly so the cash is ready.",
  },
  {
    q: "What should I do if my budget shows overspending?",
    a: "Start with housing: if rent or mortgage is above 35% of take-home, you're likely in a structural deficit small cuts can't fix. Next, look at debt payments — high minimums crush flexibility (see the Debt Payoff Calculator). Then tackle subscriptions and food as the most controllable variables.",
  },
];

const STATS = [
  { stat: "50/30/20", color: "text-emerald-600", accent: "bg-emerald-500", label: "needs / wants / savings — the rule this calculator benchmarks your budget against" },
  { stat: "4.6%",     color: "text-blue-600",    accent: "bg-blue-500",    label: "actual US personal savings rate (BEA, 2024) — the 20% target is a stretch most people miss" },
  { stat: `${usd0(EX_TAX_YR)}/yr`,  color: "text-amber-600",   accent: "bg-amber-500",   label: `sales tax hidden in the example $5,000 budget at the ${NATIONAL_AVG_SALES_TAX}% US-average rate` },
];

const CONTENT_CARDS = [
  {
    icon: "🏠",
    title: "Housing is the biggest lever",
    body: "If your housing costs exceed 35% of take-home pay, no amount of latte-cutting will fix your budget. Your largest fixed expense has the largest impact. Even a $200/month reduction in rent saves $2,400/year — more than eliminating coffee, gym, and Netflix combined for most people.",
  },
  {
    icon: "📉",
    title: "Debt payments kill savings rate",
    body: "High minimum debt payments are the silent killer of savings rates. A $500/month debt payment on a 22% APR credit card costs $6,000/year with minimal progress on the principal. Prioritising high-interest debt payoff over investing (when rate > 7%) is mathematically sound — use the avalanche or snowball method.",
  },
  {
    icon: "🗓️",
    title: "Budget for irregular expenses monthly",
    body: "Car insurance, annual subscriptions, car registration, and holiday gifts feel like surprises — but they aren't. Divide annual irregular expenses by 12 and set aside that amount each month into a dedicated sinking fund. This eliminates budget emergencies and smooths cash flow.",
  },
];

const RELATED_CALCS = [
  { title: "Emergency Fund Calculator", description: "See how large your safety net should be.", href: "/tools/emergency-fund-calculator", icon: "🛡️", accent: "bg-emerald-500/10" },
  { title: "Debt Payoff Calculator", description: "See when you'll be debt-free.", href: "/tools/debt-payoff-calculator", icon: "💳", accent: "bg-blue-500/10" },
  { title: "Savings Goal Calculator", description: "Plan how long to save for any goal.", href: "/tools/savings-goal-calculator", icon: "🎯", accent: "bg-amber-500/10" },
  { title: "Subscription Auditor", description: "Find and cut recurring costs fast.", href: "/tools/subscription-auditor", icon: "🔍", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Budget Calculator",
      url: "https://worthulator.com/tools/budget-calculator",
      applicationCategory: "FinanceApplication",
      description: "Break down take-home pay against the 50/30/20 rule, see your savings rate, and reveal the sales tax hidden in your spending using your state's live combined rate.",
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

export default function BudgetCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="📊"
        eyebrowText="Budget · 50/30/20"
        title="Is Your Monthly Budget Actually Working?"
        description="Pick your state and enter your take-home income and expenses. See your savings rate against the 50/30/20 rule — and the sales tax quietly hidden inside your spending."
        chips={["50/30/20 benchmark", "Savings rate vs 20% target", "Live sales tax in spending"]}
      >
        <BudgetWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text={`On a $5,000 budget, $1,700 left over is a <span class='font-semibold text-gray-900'>34% savings rate</span> — but ~${usd0(EX_TAX_YR)}/year of that spending is sales tax most people never see. Housing, not coffee, is the biggest lever.`} />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="How to actually improve your budget" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Budget Calculator Works"
        formula={`Total Expenses = Housing + Food + Transport + Debt + Other
Leftover       = Income − Total Expenses
Savings Rate   = Leftover ÷ Income × 100

50/30/20 rule:
  Needs (housing+food+transport+debt) → target 50% of income
  Wants (other / discretionary)        → target 30%
  Savings (leftover)                   → target 20%

Sales tax (live): taxable = other + (groceries if state taxes them)
  Annual sales tax = taxable × state combined rate × 12

Worked example — $5,000 take-home, US-average ${NATIONAL_AVG_SALES_TAX}% rate:
Expenses $3,300 · Leftover $1,700 (34% savings rate)
Needs 56% · Wants 10% · Sales tax ~${usd0(EX_TAX_YR)}/yr`}
        paragraphs={[
          "This calculator sums your monthly expenses, subtracts them from take-home pay, and shows your leftover both in dollars and as a savings rate. It then maps your spending onto the 50/30/20 rule — needs, wants, and savings — and flags whichever bucket is out of line. In the default example, needs run 56% (just over the 50% target) while the 34% savings rate is well ahead of the 20% goal.",
          `The clever part is the live sales-tax layer: using your state's combined rate (Tax Foundation 2026), it estimates the tax baked into your taxable spending — discretionary goods plus groceries in states that tax them. On the $5,000 example that's about ${usd0(EX_TAX_YR)}/year you never see itemised. Choose a grocery-exempt state and food automatically drops out of the taxable base.`,
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
