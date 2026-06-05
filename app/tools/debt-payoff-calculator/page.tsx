import type { Metadata } from "next";
import DebtPayoffCalculatorLoader from "./DebtPayoffCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateDebtPayoff } from "@/lib/calculators/debtPayoffEngine";
import { getCreditCardAPR, fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

/* ── Step 5c: derive every worked example from the live FRED credit-card APR
   so FAQ / stat chips / the comparison table / SEO auto-refresh on updates. ── */
const APR = getCreditCardAPR();
const AS_OF = fredBenchmarks.currentPeriodLabel;
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
const cc = (balance: number, monthly: number) =>
  calculateDebtPayoff({
    debts: [{ id: "cc", name: "Credit card", balance, interestRate: APR, minimumPayment: monthly }],
    strategy: "minimum",
  });
const moYr = (m: number) => `${m} mo (~${(m / 12).toFixed(1)} yr)`;
const P10_200 = cc(10000, 200);
const P10_300 = cc(10000, 300);
const P10_400 = cc(10000, 400);
const P10_500 = cc(10000, 500);
const P20_400 = cc(20000, 400);
const P20_500 = cc(20000, 500);
const FIRST_MONTH_INTEREST = Math.round((10000 * APR) / 100 / 12);
const PLAN = calculateDebtPayoff({
  debts: [
    { id: "card", name: "Credit card", balance: 5000, interestRate: APR, minimumPayment: 100 },
    { id: "car", name: "Car loan", balance: 12000, interestRate: 6.5, minimumPayment: 220 },
  ],
  extraMonthlyPayment: 200,
  strategy: "avalanche",
});

export const metadata: Metadata = {
  title: "Debt Payoff Calculator 2026 – Avalanche vs Snowball, Debt-Free Date",
  description:
    "Find your exact debt-free date across up to 6 debts using the avalanche or snowball method. The credit-card row opens at the live FRED average APR; see interest saved, months shaved off, and your burn-down timeline.",
  keywords: ["debt payoff calculator", "avalanche vs snowball", "debt snowball calculator", "debt free date calculator", "credit card payoff calculator"],
  alternates: { canonical: "https://worthulator.com/tools/debt-payoff-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is the debt avalanche method?",
    a: `The avalanche method targets the debt with the highest interest rate first, while paying minimums on everything else. Once the first debt is paid off, you roll that payment to the next highest-rate debt. This minimises total interest paid and is mathematically optimal. In the default plan (a $5,000 card at the live ~${APR}% APR plus a $12,000 car loan at 6.5%), avalanche attacks the card first.`,
  },
  {
    q: "What is the debt snowball method?",
    a: "The snowball method targets the smallest balance first, regardless of interest rate. Once the first debt is gone, you roll the freed payment to the next smallest. It's not always the cheapest, but the quick wins provide powerful psychological motivation. When your smallest debt is also your highest-rate one — as in the default plan — avalanche and snowball produce the identical result.",
  },
  {
    q: "Which method is better — avalanche or snowball?",
    a: "Mathematically, avalanche saves more money (this tool guarantees avalanche interest ≤ snowball interest). Psychologically, snowball keeps more people on track. Research suggests the snowball's quick wins lead to higher completion rates for many people. The best method is the one you actually stick to.",
  },
  {
    q: "How much does an extra $100/month actually help?",
    a: `Far more than most people expect. On $20,000 of credit-card debt at the current ~${APR}% average APR, paying a fixed $400/month takes about ${P20_400.debtFreeMonths} months (${(P20_400.debtFreeMonths / 12).toFixed(1)} years) and costs ${usd0(P20_400.totalInterestPaid)} in interest. Adding just $100/month — paying $500 instead — clears it in ${P20_500.debtFreeMonths} months and ${usd0(P20_500.totalInterestPaid)} of interest: roughly ${usd0(P20_400.totalInterestPaid - P20_500.totalInterestPaid)} saved and ${((P20_400.debtFreeMonths - P20_500.debtFreeMonths) / 12).toFixed(1)} years shaved off. Use the What-If buttons to see your own numbers.`,
  },
  {
    q: "What happens to freed-up minimum payments?",
    a: "In both the avalanche and snowball simulations, freed minimums 'snowball' — once a debt is eliminated, the payment you were making on it is redirected to the next priority debt the following month, on top of your extra payment. This rolling acceleration is what makes the last few debts disappear so fast. (The minimum-only baseline does not roll freed payments — that money returns to your pocket — which is what makes the 'interest saved' comparison meaningful.)",
  },
  {
    q: "Why does this calculator use fixed minimum payments?",
    a: "You enter a fixed dollar minimum per debt, so the simulation keeps that payment level steady rather than letting it shrink as the balance falls. Real credit-card minimums are often a declining percentage of the balance, which is exactly why they can stretch payoff to 20+ years — the payment keeps dropping. Entering a fixed minimum (and ideally adding an extra payment) models the disciplined approach that actually clears the debt.",
  },
  {
    q: "Should I pay off debt or invest?",
    a: `A common rule of thumb: if your debt's interest rate is higher than an expected investment return (say 7% for a diversified index fund), paying the debt is the better guaranteed return. High-interest consumer debt — credit cards at the current ~${APR}% average — should almost always be prioritised over new investing.`,
  },
];

const STATS = [
  { stat: `${APR}%`,   color: "text-red-600",     accent: "bg-red-500",     label: `Live FRED commercial-bank average credit card APR (${AS_OF}) — the rate the card row opens at by default` },
  { stat: usd0(P10_200.totalInterestPaid), color: "text-orange-600",  accent: "bg-orange-500",  label: `Interest on $10,000 at ${APR}% paying a fixed $200/mo — vs just ${usd0(P10_400.totalInterestPaid)} if you pay $400/mo` },
  { stat: usd0(PLAN.interestSaved),  color: "text-amber-600",   accent: "bg-amber-500",   label: `Interest saved on the default two-debt plan by adding $200/mo and using avalanche — ${PLAN.monthsSaved} months sooner` },
];

const CONTENT_CARDS = [
  {
    icon: "🏔️",
    title: "Avalanche: the math-optimal method",
    body: "Target your highest-rate debt first. Every dollar applied to a 22% APR card does more work than any dollar applied to a 6% car loan. Over years, this difference in interest compounds massively in your favour.",
  },
  {
    icon: "⛄",
    title: "Snowball: the psychology-driven method",
    body: "Small wins matter. Eliminating a debt completely triggers a dopamine response that keeps motivation high. Studies show many people who use the snowball method complete their debt payoff — even if they pay slightly more total interest.",
  },
  {
    icon: "💡",
    title: "The freed-payment snowball effect",
    body: "When you eliminate one debt, that minimum payment doesn't go back into daily spending — it attacks the next debt. This growing 'snowball' of freed payments accelerates payoff dramatically as you progress. The last few debts get eliminated very quickly.",
  },
];

const RELATED_CALCS = [
  {
    title: "Loan Calculator",
    description: "Calculate monthly payments and total cost on any loan.",
    href: "/tools/loan-calculator",
    icon: "🏦",
    accent: "bg-blue-500/10",
  },
  {
    title: "Mortgage Calculator",
    description: "Model your mortgage payments, amortisation, and total cost.",
    href: "/tools/mortgage-calculator",
    icon: "🏠",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Savings Calculator",
    description: "Build a savings projection with goals and monthly contributions.",
    href: "/tools/savings-calculator",
    icon: "💰",
    accent: "bg-amber-500/10",
  },
  {
    title: "ROI Calculator",
    description: "Calculate real investment returns after fees and inflation.",
    href: "/tools/roi-calculator",
    icon: "📈",
    accent: "bg-purple-500/10",
  },
];

export default function DebtPayoffCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Debt Payoff Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your debt-free date across up to 6 debts using the avalanche or snowball method, with the credit-card row defaulting to the live FRED average APR. Compare strategies and see interest saved.",
      url: "https://worthulator.com/tools/debt-payoff-calculator",
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
        eyebrowIcon="🏔️"
        eyebrowText="Debt · Payoff Planning"
        title="Debt Payoff Calculator"
        description="Find your exact debt-free date. Compare avalanche vs snowball strategies and see how much interest you can save."
        chips={["Avalanche & snowball strategies", "Debt-free date", "Interest saved vs minimum"]}
      >
        <DebtPayoffCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A $10,000 card at the live ${APR}% APR paying a fixed $200/month takes <span class="font-semibold text-gray-900">${P10_200.debtFreeMonths} months (~${(P10_200.debtFreeMonths / 12).toFixed(1)} years) and ${usd0(P10_200.totalInterestPaid)} in interest.</span> Doubling to $400/month cuts that to ${P10_400.debtFreeMonths} months and ${usd0(P10_400.totalInterestPaid)}.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Two strategies. One goal: debt freedom."
        subtitle="The right approach depends on your psychology as much as the math."
        cards={CONTENT_CARDS}
      />

      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-white/8 bg-gray-900 p-6 sm:p-8">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">Example scenario</p>
            <h2 className="mt-3 text-xl font-bold text-white">The same $10,000 debt — what your payment level changes</h2>
            <p className="mt-2 text-sm text-gray-400 mb-6">
              One $10,000 balance at the live {APR}% APR. The only thing that changes is the fixed monthly payment — and it changes everything. (Calculator simulation, minimum-only mode.)
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500">
                    <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-wide">Balance</th>
                    <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-wide">APR</th>
                    <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-wide">Fixed payment</th>
                    <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-wide">Time to pay off</th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wide">Total interest</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/5">
                    <td className="py-3 pr-6 font-semibold text-white">$10,000</td>
                    <td className="py-3 pr-6 text-gray-400">{APR}%</td>
                    <td className="py-3 pr-6 text-gray-400">$200/mo</td>
                    <td className="py-3 pr-6 text-gray-400">{moYr(P10_200.debtFreeMonths)}</td>
                    <td className="py-3 font-semibold text-red-400">{usd0(P10_200.totalInterestPaid)}</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="py-3 pr-6 font-semibold text-white">$10,000</td>
                    <td className="py-3 pr-6 text-gray-400">{APR}%</td>
                    <td className="py-3 pr-6 text-gray-400">$300/mo</td>
                    <td className="py-3 pr-6 text-gray-400">{moYr(P10_300.debtFreeMonths)}</td>
                    <td className="py-3 font-semibold text-amber-400">{usd0(P10_300.totalInterestPaid)}</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="py-3 pr-6 font-semibold text-white">$10,000</td>
                    <td className="py-3 pr-6 text-gray-400">{APR}%</td>
                    <td className="py-3 pr-6 text-gray-400">$400/mo</td>
                    <td className="py-3 pr-6 text-gray-400">{moYr(P10_400.debtFreeMonths)}</td>
                    <td className="py-3 font-semibold text-emerald-400">{usd0(P10_400.totalInterestPaid)}</td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="py-3 pr-6 font-semibold text-white">$10,000</td>
                    <td className="py-3 pr-6 text-gray-400">{APR}%</td>
                    <td className="py-3 pr-6 text-gray-400">$500/mo</td>
                    <td className="py-3 pr-6 text-gray-400">{moYr(P10_500.debtFreeMonths)}</td>
                    <td className="py-3 font-semibold text-emerald-400">{usd0(P10_500.totalInterestPaid)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Going from $200 to $400 a month more than triples your speed and cuts interest from {usd0(P10_200.totalInterestPaid)} to {usd0(P10_400.totalInterestPaid)} — a {usd0(P10_200.totalInterestPaid - P10_400.totalInterestPaid)} swing on the same balance. That is the entire game: the higher and steadier your payment, the less of your money the lender keeps.
            </p>
            <details className="mt-5">
              <summary className="cursor-pointer text-sm text-emerald-400 hover:text-emerald-300">How does monthly interest work on credit cards?</summary>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                Each month, your lender charges interest as <span className="font-mono text-gray-300">Balance × (APR ÷ 12)</span>. On a $10,000 balance at {APR}% APR that&apos;s about {usd0(FIRST_MONTH_INTEREST)} in the first month alone — so a $200 payment only knocks ~{usd0(200 - FIRST_MONTH_INTEREST)} off the balance. Raise the payment to $400 and ~{usd0(400 - FIRST_MONTH_INTEREST)} goes to principal every month, which is why the payoff time collapses.
              </p>
            </details>
          </div>
        </div>
      </section>

      <SEOTextBlock
        title="How the Debt Payoff Calculator Works"
        formula={`Monthly interest = Balance × (APR / 12 / 100)
Principal paid   = Payment − Monthly interest

Avalanche: sort active debts by interest rate (highest first)
Snowball:  sort active debts by balance (lowest first)

Freed minimum: when a debt reaches $0, its minimum rolls into the
priority debt's payment next month (on top of your extra payment).
Minimum-only baseline does NOT roll freed payments.

Interest saved = Minimum-only total interest − Strategy total interest

Worked example — default plan (card $5,000 @ live ${APR}% / $100 min,
car $12,000 @ 6.5% / $220 min), +$200 extra, avalanche:
Debt-free in ${PLAN.debtFreeMonths} months (${PLAN.debtFreeDate}) · ${usd0(PLAN.totalInterestPaid)} interest
vs minimum-only ${PLAN.minimumOnlyMonths} months / ${usd0(PLAN.minimumOnlyInterest)} → saves ${usd0(PLAN.interestSaved)} and ${PLAN.monthsSaved} months.`}
        steps={[
          { label: "Add your debts", description: "Enter each debt: name, balance, interest rate, and minimum payment." },
          { label: "Choose a strategy", description: "Avalanche saves the most money. Snowball provides the most motivation." },
          { label: "Set extra payments", description: "Even $50/month extra makes a dramatic difference on high-interest debt." },
          { label: "Add a lump sum", description: "Got a tax refund or bonus? Apply it immediately for maximum interest savings." },
          { label: "See your debt-free date", description: "The exact month and year you'll be completely debt-free, with interest saved." },
        ]}
        paragraphs={[
          `This calculator runs a full month-by-month simulation for both your chosen strategy and a minimum-only baseline, so you can see exactly what you save. The credit-card row opens at the live FRED commercial-bank average APR (~${APR}%, refreshed automatically) so your starting point reflects today's real rate. The burn-down chart shows your declining balance over time.`,
          "The 'freed minimum' mechanic is key: every time you eliminate one debt, that payment doesn't disappear — it's added to the attack on the next debt. This is why the final debts vanish so fast, and why starting is the hardest and most important step. Note that minimums here are fixed dollar amounts; real card minimums often shrink with the balance, which is precisely why they can trap people in 20+ year payoffs.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Tools to take control of your complete financial picture."
        items={RELATED_CALCS}
      />
    </main>
  );
}
