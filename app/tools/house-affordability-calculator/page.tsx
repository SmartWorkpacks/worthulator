import type { Metadata } from "next";
import HouseAffordabilityWithInsights from "@/components/worthcore/HouseAffordabilityWithInsights";
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
  title: "House Affordability Calculator 2026 – How Much House Can You Afford?",
  description:
    "Find the maximum home price you can afford based on your gross income, down payment, mortgage rate, and loan term. Uses the 28% income rule.",
  keywords: ["house affordability calculator", "how much house can I afford", "home affordability calculator", "mortgage affordability", "buying power calculator"],
  alternates: { canonical: "https://worthulator.com/tools/house-affordability-calculator" },
};

const FAQS = [
  {
    q: "How do lenders determine how much house I can afford?",
    a: "Most lenders use the 28/36 rule: your mortgage payment should not exceed 28% of your gross monthly income, and total debt payments (mortgage + car + student loans) should not exceed 36%. This calculator uses the 28% front-end ratio as a baseline for the maximum home price.",
  },
  {
    q: "What is gross monthly income?",
    a: "Gross income is your income before taxes and deductions. If you earn $90,000/year, your gross monthly income is $7,500. For joint applicants (two incomes on the same mortgage), add both incomes together and enter the combined figure.",
  },
  {
    q: "Does the calculator include property tax and insurance?",
    a: "No — this calculator uses your principal and interest payment only against the 28% income rule. In practice, lenders include property taxes, homeowners insurance, and PMI in the 28% calculation. This means your actual buying power may be 10–20% lower once those costs are factored in.",
  },
  {
    q: "How does my down payment affect affordability?",
    a: "A larger down payment directly increases your maximum home price because it reduces the loan amount required. It also eliminates PMI (Private Mortgage Insurance) when you put down 20% or more, which further lowers your monthly payment and increases affordability.",
  },
  {
    q: "Should I buy the maximum I can afford?",
    a: "Buying at the maximum of your affordability leaves no buffer for interest rate rises, job changes, or unexpected expenses. A common guideline is to target a home at 3–4× your annual gross income and keep your mortgage payment below 25% of take-home pay, not gross income.",
  },
];

const STATS = [
  { stat: "28%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "of gross monthly income — the standard maximum mortgage payment guideline" },
  { stat: "20%",   color: "text-blue-600",    accent: "bg-blue-500",    label: "minimum down payment to avoid PMI and reduce your monthly payment" },
  { stat: "3–4×",  color: "text-amber-600",   accent: "bg-amber-500",   label: "annual salary — the conservative home price multiplier most advisors recommend" },
];

const CONTENT_CARDS = [
  {
    icon: "🏠",
    title: "The 28% rule is a ceiling, not a target",
    body: "Lenders will often approve you up to 28–31% of gross income, but that does not mean you should spend that much. Buying at maximum affordability leaves no room for a rate rise, job loss, or major home repair. Most financial advisors recommend keeping your mortgage under 25% of net (take-home) income.",
  },
  {
    icon: "📉",
    title: "Rate changes have a huge impact",
    body: "A 1% rise in mortgage rates reduces your buying power by roughly 10%. At 6%, a $2,000/month budget buys about $333,000 in loan. At 7%, the same payment only supports $300,000. Run the calculator at your current rate and 1–2% higher to understand your rate sensitivity.",
  },
  {
    icon: "💰",
    title: "Hidden costs beyond the mortgage",
    body: "Property taxes (0.5–2.5% of value per year), homeowners insurance ($1,200–$3,000/year), HOA fees, maintenance (budget 1% of home value annually), and closing costs (2–5%) all add to the true cost of homeownership. Factor these in before committing to a price point.",
  },
];

const RELATED_CALCS = [
  { title: "Mortgage Calculator",        description: "Calculate your exact monthly mortgage payment.",     href: "/tools/mortgage-calculator",         icon: "🏦", accent: "bg-emerald-500/10" },
  { title: "Down Payment Calculator",    description: "See how long to save your down payment.",           href: "/tools/down-payment-countdown",      icon: "🎯", accent: "bg-blue-500/10"    },
  { title: "Closing Cost Calculator",    description: "Estimate what you'll pay at closing.",              href: "/tools/closing-cost-calculator",     icon: "📋", accent: "bg-amber-500/10"   },
  { title: "Rent vs Buy Calculator",     description: "Is buying actually cheaper than renting?",         href: "/tools/rent-vs-buy-calculator",      icon: "⚖️", accent: "bg-pink-500/10"    },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "House Affordability Calculator",
      url: "https://worthulator.com/tools/house-affordability-calculator",
      applicationCategory: "FinanceApplication",
      description: "Find the maximum home price you can afford based on income, down payment, and mortgage rate using the 28% income rule.",
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

export default function HouseAffordabilityCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🏠"
        eyebrowText="Home Buying · Affordability"
        title="How Much House Can You Afford?"
        description="Enter your gross monthly income, down payment, mortgage rate, and loan term to find your maximum home price using the 28% income rule."
        chips={["Max home price", "Monthly payment cap", "28% income rule"]}
      >
        <HouseAffordabilityWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text="Most lenders cap your mortgage payment at 28% of gross income — but conservative buyers target 25% of take-home pay." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What really determines your buying power" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the House Affordability Calculator Works"
        formula={`Max Monthly Payment = Gross Monthly Income × 28%
r = Monthly Rate,  n = Loan Term in Months
Max Loan Amount     = Payment × ((1 − (1+r)^−n) ÷ r)
Max Home Price      = Max Loan Amount + Down Payment`}
        paragraphs={[
          "The calculator applies the 28% front-end ratio: your maximum monthly mortgage payment is 28% of your gross monthly income. It then uses the standard mortgage payment formula to back-calculate the maximum loan amount that fits within that payment at your chosen rate and term. Adding your down payment gives the maximum home price.",
          "This is a starting point, not a final answer. Actual lender approvals depend on your credit score, debt-to-income ratio, employment history, and the specific property. Use this number as a planning guide and consult a mortgage broker for a pre-approval figure.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
