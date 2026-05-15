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
  title: "Student Loan Calculator 2026 – Monthly Payment & Total Interest",
  description: "Still paying for your 20s? See the exact date you finally get your own paycheck back.",
  keywords: ["student loan calculator", "student loan payment calculator", "student loan interest calculator", "student loan payoff calculator"],
  alternates: { canonical: "https://worthulator.com/tools/student-loan-calculator" },
};

const FAQS = [
  { q: "What is the average student loan interest rate?", a: "Federal undergraduate loans for 2024–25 are 6.53%. Graduate loans are 8.08%. Private loans vary widely — from 4% to 15%+ depending on your credit score and lender." },
  { q: "How long does it take to pay off student loans?", a: "The standard federal repayment plan is 10 years (120 months). Extended and income-driven plans can stretch to 20–25 years. Paying extra each month significantly shortens the timeline." },
  { q: "Should I pay more than the minimum?", a: "Yes. Even an extra $50–$100/month can save thousands in interest and cut years off your loan. Apply overpayments directly to principal for maximum impact." },
  { q: "Is student loan interest tax deductible?", a: "You can deduct up to $2,500 of student loan interest per year on your federal taxes if your income is under $85,000 (single) or $170,000 (married filing jointly)." },
  { q: "What's the difference between subsidised and unsubsidised loans?", a: "Subsidised loans don't accrue interest while you're in school. Unsubsidised loans start accruing from the day they're disbursed — meaning you may owe more than you originally borrowed." },
];

const STATS = [
  { stat: "$37,650", color: "text-rose-600",    accent: "bg-rose-500",    label: "average US student loan debt at graduation" },
  { stat: "43M",     color: "text-amber-600",   accent: "bg-amber-500",   label: "Americans carrying student loan debt" },
  { stat: "10 yrs",  color: "text-emerald-600", accent: "bg-emerald-500", label: "standard federal repayment term" },
];

const CONTENT_CARDS = [
  { title: "The interest trap", body: "On a $35,000 loan at 6.5% over 10 years, you'll pay over $12,000 in pure interest — about 35% more than you borrowed. The longer the term, the worse it gets." },
  { title: "Income-driven repayment", body: "Federal IDR plans cap payments at 10–20% of discretionary income. After 20–25 years, remaining balances may be forgiven — but forgiven amounts are currently taxable." },
  { title: "Refinancing pros & cons", body: "Refinancing to a lower private rate can save thousands, but you lose federal protections like IDR and PSLF. Only refinance if your income is stable and the rate drop is significant." },
];

const RELATED_CALCS = [
  { title: "Credit Card Payoff",   description: "Find your fastest path to $0 balance.",         href: "/tools/credit-card-payoff-calculator" },
  { title: "Debt Payoff Planner",  description: "Avalanche vs snowball — which saves more?",      href: "/tools/debt-payoff-calculator" },
  { title: "Budget Calculator",    description: "Map your money so payments don't hurt.",          href: "/tools/budget-calculator" },
  { title: "Net Worth Calculator", description: "Track your progress from debt to positive.",      href: "/tools/net-worth-calculator" },
];

export default function StudentLoanCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="🎓"
        eyebrowText="Student Loan"
        title="Student Loan Calculator"
        description="Enter your loan balance, interest rate, and repayment term to see your monthly payment, total interest, and true cost of your degree."
        chips={["Federal & private loans", "Monthly payment", "Total interest cost"]}
      >
        <CalculatorEngineLoader slug="student-loan-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="On a $35,000 loan at 6.5%, you'll pay over $12,000 in interest alone — nearly 35% more than you borrowed." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What every borrower should know" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How student loan interest works"
        paragraphs={[
          "Monthly payment = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1], where P is principal, r is monthly interest rate, and n is number of payments. This is the standard amortisation formula.",
          "Most of your early payments go toward interest. As the balance drops, more goes to principal. Paying extra targets the principal directly and collapses the amortisation schedule.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
