import type { Metadata } from "next";
import CarLoanWithInsights from "@/components/worthcore/CarLoanWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateCarLoan } from "@/calculations/finance/carLoan";
import { getAutoLoanNewAPR } from "@/lib/datasets/finance/fredBenchmarks";
import {
  NATIONAL_AVG_SALES_TAX,
  SALES_TAX_RATE_BY_NAME,
} from "@/lib/datasets/tax/salesTaxRates";

/* ── Step 5c: derive every number in the copy from live FRED APR + Tax
   Foundation rates so the worked examples auto-refresh on data updates. ───── */
const APR = getAutoLoanNewAPR();
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const carLoan = (o: Partial<Parameters<typeof calculateCarLoan>[0]>) =>
  calculateCarLoan(
    { vehiclePrice: 28000, downPayment: 3000, tradeIn: 0, interestRate: APR, termMonths: 60, state: "US Average", ...o },
    { salesTaxRate: NATIONAL_AVG_SALES_TAX, tradeInReducesTax: true },
  );
const EX = carLoan({});
const EX48 = carLoan({ termMonths: 48 });
const EX72 = carLoan({ termMonths: 72 });
const TX_RATE = SALES_TAX_RATE_BY_NAME["Texas"] ?? 8.2;
const CA_RATE = SALES_TAX_RATE_BY_NAME["California"] ?? 8.85;
const TX_TRADE_TAX = Math.round((28000 - 8000) * (TX_RATE / 100)); // trade-in credit
const CA_FULL_TAX = Math.round(28000 * (CA_RATE / 100)); // no trade-in credit
const TERM_INTEREST_GAP = EX72.totalInterest - EX48.totalInterest;
const STRETCH_SAVING = EX.monthlyPayment - EX72.monthlyPayment;
const STRETCH_INTEREST = EX72.totalInterest - EX.totalInterest;

export const metadata: Metadata = {
  title: "Car Loan Calculator 2026 – True Out-the-Door Payment with Sales Tax",
  description:
    "Calculate your real monthly car payment including your state's live sales tax, financed at the current FRED auto-loan APR. Sees the out-the-door cost other calculators miss — with the trade-in tax credit applied automatically.",
  keywords: ["car loan calculator", "auto loan calculator", "out the door car price", "car sales tax calculator", "monthly car payment calculator", "trade in tax credit", "car payment with tax"],
  alternates: { canonical: "https://worthulator.com/tools/car-loan-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How is a car loan payment calculated?",
    a: `First the out-the-door price is built: Out-the-Door = Vehicle Price + Sales Tax, where tax is your state's combined rate applied to the price (minus trade-in in most states). Then Loan Amount = Out-the-Door − Down Payment − Trade-In, and Monthly Payment = Loan × [r × (1+r)^n] / [(1+r)^n − 1], with r = APR ÷ 12 and n = months. Example: a $28,000 car at the ${NATIONAL_AVG_SALES_TAX}% US-average rate adds ${usd0(EX.salesTax)} sales tax → ${usd0(EX.outTheDoorPrice)} out-the-door. With $3,000 down you finance ${usd0(EX.loanAmount)}; at the live ${APR}% new-car APR over 60 months that's ${usd2(EX.monthlyPayment)}/month.`,
  },
  {
    q: "Why does this calculator add sales tax to the loan?",
    a: `Because almost everyone finances it. Most calculators quote a payment on the sticker price and ignore tax — then your real payment is higher at the dealer. On the $28,000 default, the ${NATIONAL_AVG_SALES_TAX}% US-average rate adds ${usd0(EX.salesTax)}, and because it's rolled into the loan it accrues about ${usd0(EX.taxFinancedInterest)} of interest over 5 years. We pull each state's live combined rate (Tax Foundation 2026) so the out-the-door number is the real one.`,
  },
  {
    q: "How does a trade-in lower my sales tax?",
    a: `In roughly 42 states your trade-in reduces the amount you're taxed on, not just the loan. On a $28,000 car with an $8,000 trade-in in Texas (${TX_RATE}%), tax applies to $20,000 → ${usd0(TX_TRADE_TAX)}. In California — one of the few states with no trade-in tax credit — you'd pay ${CA_RATE}% on the full $28,000 → ${usd0(CA_FULL_TAX)}. The calculator applies your state's rule automatically, so the trade-in credit can be worth ${usd0(CA_FULL_TAX - TX_TRADE_TAX)}+ on its own.`,
  },
  {
    q: "What is a good APR for a car loan in 2026?",
    a: `The calculator defaults to the live FRED 48-month new-car commercial-bank average (~${APR}%). For excellent credit (750+), new-car APRs typically run 5–7%; good credit (700–749) 7–9%; fair credit (650–699) 9–14%. Used-car rates run about 3 points higher than new for the same credit profile.`,
  },
  {
    q: "Should I choose a 60-month or 72-month loan?",
    a: `A longer term lowers the payment but adds real interest. On the ${usd0(EX.loanAmount)} default loan at ${APR}% APR: 48 months is ${usd2(EX48.monthlyPayment)}/mo (${usd0(EX48.totalInterest)} interest), 60 months is ${usd2(EX.monthlyPayment)}/mo (${usd0(EX.totalInterest)} interest), and 72 months is ${usd2(EX72.monthlyPayment)}/mo (${usd0(EX72.totalInterest)} interest). Stretching from 60 to 72 months saves ${usd0(STRETCH_SAVING)}/month but costs ${usd0(STRETCH_INTEREST)} more in interest — and keeps you underwater longer. Choose the shortest term you can comfortably afford.`,
  },
  {
    q: "How much car can I actually afford?",
    a: "A common rule: your total monthly car payment should stay under 10–15% of monthly take-home pay, and total cost of ownership (payment + insurance + fuel + maintenance) under 20%. Because this tool includes financed sales tax, the payment it shows is the one your budget actually has to absorb — use it to check the real number, not the sticker estimate.",
  },
];

const STATS = [
  { stat: usd0(EX.salesTax), color: "text-red-600",    accent: "bg-red-500",    label: `Sales tax on a $28,000 car at the ${NATIONAL_AVG_SALES_TAX}% US-average rate — financed into the loan and quietly earning ~${usd0(EX.taxFinancedInterest)} of interest` },
  { stat: `${APR}%`,         color: "text-amber-600",  accent: "bg-amber-500",  label: "Live FRED 48-month new-car APR used as the default rate" },
  { stat: "42",              color: "text-emerald-600",accent: "bg-emerald-500",label: "States that grant a trade-in sales-tax credit, cutting the taxable price by your trade-in value" },
];

const CONTENT_CARDS = [
  {
    icon: "🧾",
    title: "Sales tax is the line most calculators skip",
    body: `Your state's combined rate is applied to the price and rolled into the loan. On the $28,000 default at the ${NATIONAL_AVG_SALES_TAX}% US average, that's ${usd0(EX.salesTax)} added to the out-the-door price — and because it's financed, it accrues about ${usd0(EX.taxFinancedInterest)} of extra interest over 5 years. This tool pulls each state's live rate so the payment you see is the real one.`,
  },
  {
    icon: "🔄",
    title: "Your trade-in can cut the tax, not just the loan",
    body: `In ~42 states a trade-in reduces the taxable price. An $8,000 trade-in on a $28,000 car in Texas is taxed on just $20,000 (${usd0(TX_TRADE_TAX)}) — but in California, which gives no trade-in credit, you'd pay on the full $28,000 (${usd0(CA_FULL_TAX)}). The calculator applies your state's rule automatically, so the credit can be worth ${usd0(CA_FULL_TAX - TX_TRADE_TAX)}+ before it even touches the loan.`,
  },
  {
    icon: "📊",
    title: "Longer terms cost more — always",
    body: `On the ${usd0(EX.loanAmount)} default loan at ${APR}% APR, going from 48 to 72 months drops the payment from ${usd2(EX48.monthlyPayment)} to ${usd2(EX72.monthlyPayment)} — but interest climbs from ${usd0(EX48.totalInterest)} to ${usd0(EX72.totalInterest)}. That's ${usd0(TERM_INTEREST_GAP)} more for the same car, plus more years underwater. Pick the shortest term your budget can absorb.`,
  },
];

const RELATED_CALCS = [
  {
    title: "Loan Calculator",
    description: "Calculate payments and interest for any type of loan.",
    href: "/tools/loan-calculator",
    icon: "🏦",
    accent: "bg-blue-500/10",
  },
  {
    title: "Road Trip Cost Calculator",
    description: "Estimate fuel cost for any drive based on distance and MPG.",
    href: "/tools/road-trip-cost",
    icon: "⛽",
    accent: "bg-amber-500/10",
  },
  {
    title: "Savings Goal Calculator",
    description: "Calculate how much to save monthly to hit any financial target.",
    href: "/tools/savings-goal-calculator",
    icon: "🎯",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Mortgage Calculator",
    description: "Calculate your monthly mortgage payment and amortisation.",
    href: "/tools/mortgage-calculator",
    icon: "🏠",
    accent: "bg-violet-500/10",
  },
];

export default function CarLoanCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Car Loan Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your true out-the-door monthly car payment including live state sales tax, financed at the current FRED auto-loan APR, with the trade-in tax credit applied automatically.",
      url: "https://worthulator.com/tools/car-loan-calculator",
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
        eyebrowIcon="🚗"
        eyebrowText="Auto Finance · Loans"
        title="Car Loan Calculator"
        description="Pick your state to load its live sales tax rate, then enter the price, down payment, trade-in, and term. We finance the tax at the live FRED auto-loan APR to show your true out-the-door payment."
        chips={["Live state sales tax", "Live FRED auto APR", "True out-the-door payment"]}
      >
        <CarLoanWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`The sticker price is just the start. <span class="font-semibold text-gray-900">Sales tax adds ~${usd0(EX.salesTax)} to a $28,000 car and, once financed, quietly earns the lender another ~${usd0(EX.taxFinancedInterest)} in interest.</span> Know the out-the-door number before you sign.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What dealers don't volunteer about your car loan"
        subtitle="Monthly payment is only one number. Here are the three that actually matter."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Car Loan Calculator Works"
        formula={`Taxable Price = Vehicle Price − Trade-In   (− Trade-In only in trade-in-credit states)
Sales Tax     = Taxable Price × State Combined Rate
Out-the-Door  = Vehicle Price + Sales Tax

Loan Amount   = Out-the-Door − Down Payment − Trade-In

r = APR / 100 / 12   (monthly rate)
n = Loan Term (months)
Monthly Payment = Loan × [r × (1+r)^n] / [(1+r)^n − 1]

Total Interest = (Monthly Payment × n) − Loan Amount
Total Cash Cost = (Monthly Payment × n) + Down Payment

Worked example — $28,000 car, US-average ${NATIONAL_AVG_SALES_TAX}% tax, $3,000 down, ${APR}% APR, 60 mo:
Sales Tax = ${usd0(EX.salesTax)} · Out-the-Door = ${usd0(EX.outTheDoorPrice)} · Loan = ${usd0(EX.loanAmount)}
Monthly = ${usd2(EX.monthlyPayment)} · Interest = ${usd0(EX.totalInterest)} · Total Cash Cost = ${usd0(EX.totalCost)}`}
        steps={[
          { label: "Pick your state", description: "Loads the live combined sales tax rate (Tax Foundation 2026) and whether your state grants a trade-in tax credit." },
          { label: "Enter price, down payment, and trade-in", description: "In most states the trade-in lowers both the taxable price and the loan; the down payment lowers only the loan." },
          { label: "Set the APR and term", description: "The APR defaults to the live FRED 48-month new-car average (used cars run ~3 points higher)." },
          { label: "Read the out-the-door numbers", description: "Monthly payment, financed sales tax, amount financed, total interest, and total cash cost over the life of the loan." },
        ]}
        paragraphs={[
          `Most car payment calculators quote the sticker price and ignore sales tax — so the payment you plan around is lower than the one you sign for. This tool builds the out-the-door price first: it applies your state's live combined rate (and the trade-in credit where your state allows it), then finances that tax along with the car. On the $28,000 default, the ${NATIONAL_AVG_SALES_TAX}% US-average rate adds ${usd0(EX.salesTax)} and accrues roughly ${usd0(EX.taxFinancedInterest)} of interest over five years.`,
          "Two live data layers keep it honest: state sales tax from the Tax Foundation and the new-car APR from the St. Louis Fed (FRED), refreshed automatically. Getting pre-approved at a bank or credit union before you shop separates the price negotiation from the financing negotiation and gives you a real rate benchmark to beat.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for smart financial decisions."
        items={RELATED_CALCS}
      />
    </main>
  );
}
