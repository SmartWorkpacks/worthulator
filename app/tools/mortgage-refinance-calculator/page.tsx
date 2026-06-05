import type { Metadata } from "next";
import MortgageRefinanceWithInsights from "@/components/worthcore/MortgageRefinanceWithInsights";
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
  title: "Mortgage Refinance Calculator 2026 – Break-Even & Savings",
  description: "Is the bank actually doing you a favor? See if the 'new rate' actually saves you money after the fees.",
  keywords: ["mortgage refinance calculator", "refinance break even calculator", "should I refinance", "refinance savings calculator"],
  alternates: { canonical: "https://worthulator.com/tools/mortgage-refinance-calculator" },
};

const FAQS = [
  { q: "When does refinancing make sense?", a: "Generally when you can lower your rate by at least 0.75–1%, plan to stay in the home past the break-even point, and the closing costs are reasonable (2–3% of the loan)." },
  { q: "How are closing costs calculated?", a: "Refinance closing costs typically run 2–5% of the loan balance, covering appraisal, origination fees, title insurance, and recording fees. Some lenders offer 'no-closing-cost' refis that roll fees into the rate." },
  { q: "What is the break-even point?", a: "The month when your cumulative monthly savings equal your closing costs. If you move or sell before that point, refinancing costs you money net-net." },
  { q: "Does refinancing reset my loan term?", a: "Yes — unless you refinance into a shorter term. A 30-year refi restarts the clock. To avoid this, some borrowers refinance into a 15-year loan or continue making their original payment amount." },
  { q: "Will refinancing hurt my credit score?", a: "There's a small, temporary dip from the hard inquiry (5–10 points). Credit bureaus treat multiple mortgage inquiries within 45 days as a single inquiry, so shop around quickly." },
];

const STATS = [
  { stat: "~$150", color: "text-emerald-600", accent: "bg-emerald-500", label: "average monthly savings per refi in the US" },
  { stat: "30 mo", color: "text-amber-600",   accent: "bg-amber-500",   label: "typical break-even period" },
  { stat: "$3–5K", color: "text-rose-600",    accent: "bg-rose-500",    label: "average closing costs on a refinance" },
];

const CONTENT_CARDS = [
  { icon: "📐", title: "The break-even calculation", body: "Break-even = closing costs ÷ monthly savings. If it takes 36 months to break even and you plan to move in 2 years, refinancing costs you money overall." },
  { icon: "💵", title: "Cash-out vs rate-and-term", body: "Rate-and-term refis lower your rate or change your term. Cash-out refis let you borrow against equity — but increase your balance and reset amortisation." },
  { icon: "🚫", title: "When NOT to refinance", body: "If you're 20+ years into a 30-year mortgage, most of your remaining payments are principal. A new 30-year refi at a lower rate can actually cost more total interest." },
];

const RELATED_CALCS = [
  { icon: "🏦", accent: "bg-blue-500/10",    title: "Mortgage Calculator",       description: "See full P&I, PMI, and amortisation.",        href: "/tools/mortgage-calculator" },
  { icon: "🏠", accent: "bg-emerald-500/10", title: "Home Equity Calculator",    description: "How much of your home do you own?",            href: "/tools/home-equity-calculator" },
  { icon: "💰", accent: "bg-amber-500/10",   title: "House Affordability",       description: "Find a payment that fits your real budget.",   href: "/tools/house-affordability-calculator" },
  { icon: "🧾", accent: "bg-purple-500/10",  title: "Closing Cost Calculator",   description: "Estimate cash needed at the signing table.",   href: "/tools/closing-cost-calculator" },
];

export default function MortgageRefinanceCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="🏠"
        eyebrowText="Mortgage Refinance"
        title="Mortgage Refinance Calculator"
        description="Compare your current and new monthly payments, see how quickly you break even on closing costs, and find out if refinancing actually saves you money."
        chips={["Break-even month", "Monthly savings", "Net lifetime savings"]}
      >
        <MortgageRefinanceWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text="Refinancing only saves money if you stay in the home long enough to recoup closing costs — always calculate the break-even first." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Before you sign the refinance papers" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the break-even calculation works"
        formula={`New Monthly Payment = standard amortisation formula at new rate
Break-Even (months) = Closing Costs ÷ Monthly Payment Reduction
Net Savings         = Monthly Reduction × Remaining Months − Closing Costs`}
        paragraphs={[
          "Break-even (months) = closing costs ÷ (old payment − new payment). Net savings = monthly savings × months remaining − closing costs.",
          "If you sell or move before the break-even month, you lose money on the refinance. The longer you stay after break-even, the better the deal becomes.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
