import type { Metadata } from "next";
import PaycheckCalculatorLoader from "./PaycheckCalculatorLoader";
import { calculatePaycheck } from "@/lib/calculators/paycheckEngine";
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
  title: "Paycheck Calculator 2026 - Take-Home Pay After Taxes by State",
  description:
    "Calculate your take-home paycheck after federal income tax, Social Security, Medicare, and state income tax. Supports every US state, filing status, pay frequency, and 401(k) contributions.",
  keywords: [
    "paycheck calculator",
    "take home pay calculator",
    "net pay calculator",
    "salary after tax",
    "paycheck calculator by state",
  ],
  alternates: { canonical: "https://worthulator.com/tools/paycheck-calculator" },
  robots: { index: true, follow: true },
};

const EXAMPLE = {
  country: "US" as const,
  grossAnnual: 65_000,
  payFrequency: "biweekly" as const,
  filingStatus: "single" as const,
  stateCode: "CA" as const,
  retirementPct: 5,
};

const EX = calculatePaycheck(EXAMPLE);
const EX_TX = calculatePaycheck({ ...EXAMPLE, stateCode: "TX" });
const EX_NO_401K = calculatePaycheck({ ...EXAMPLE, retirementPct: 0 });

const FAQS = [
  {
    q: "How does this paycheck calculator estimate take-home pay?",
    a: `It subtracts federal income tax (progressive IRS brackets after the standard deduction), Social Security (6.2%), Medicare (1.45%), state income tax, and any pre-tax 401(k) from your gross salary. For the worked example (${EXAMPLE.grossAnnual.toLocaleString()} gross, single, ${EXAMPLE.stateCode}, ${EXAMPLE.retirementPct}% 401(k)), take-home is $${EX.netAnnual.toLocaleString()}/yr — about $${EX.netPerPaycheck.toLocaleString()} per bi-weekly paycheck.`,
  },
  {
    q: "How much of my paycheck goes to taxes?",
    a: `In the worked example, total tax is $${EX.totalTax.toLocaleString()} — an effective rate of ${(EX.effectiveTaxRate * 100).toFixed(1)}% of gross, even though the marginal federal bracket is ${(EX.marginalRate * 100).toFixed(0)}%. Federal income tax is $${EX.federalIncomeTax.toLocaleString()}, Social Security $${EX.socialSecurity.toLocaleString()}, Medicare $${EX.medicare.toLocaleString()}, and ${EXAMPLE.stateCode} state tax $${EX.stateTax.toLocaleString()}.`,
  },
  {
    q: "Does my state change my take-home pay?",
    a: `Yes. The same $${EXAMPLE.grossAnnual.toLocaleString()} salary nets $${EX.netAnnual.toLocaleString()} in ${EXAMPLE.stateCode} but $${EX_TX.netAnnual.toLocaleString()} in a no-income-tax state like Texas — a difference of $${(EX_TX.netAnnual - EX.netAnnual).toLocaleString()}/yr driven entirely by state income tax.`,
  },
  {
    q: "Do 401(k) contributions lower my paycheck taxes?",
    a: `Traditional 401(k) contributions are pre-tax, so they reduce your taxable income for federal (and most state) income tax — but Social Security and Medicare are still charged on your full gross. Dropping the example's ${EXAMPLE.retirementPct}% 401(k) to 0% changes federal tax from $${EX.federalIncomeTax.toLocaleString()} to $${EX_NO_401K.federalIncomeTax.toLocaleString()}.`,
  },
  {
    q: "What is the difference between marginal and effective tax rate?",
    a: `Your marginal rate (${(EX.marginalRate * 100).toFixed(0)}% in the example) is the rate on your next dollar of taxable income. Your effective rate (${(EX.effectiveTaxRate * 100).toFixed(1)}%) is total tax divided by gross — always lower, because lower brackets, the standard deduction, and pre-tax deductions reduce the average.`,
  },
];

const STATS = [
  {
    stat: "6.2% + 1.45%",
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "Employee Social Security and Medicare (FICA) rates on gross wages",
  },
  {
    stat: `${EX.takeHomePct}%`,
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: `Take-home share for the worked example ($${EXAMPLE.grossAnnual.toLocaleString()}, single, ${EXAMPLE.stateCode})`,
  },
  {
    stat: "$14,600",
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Federal standard deduction (single) applied before income tax brackets",
  },
];

const CONTENT_CARDS = [
  {
    icon: "🧾",
    title: "Gross is not what you keep",
    body: "Federal tax, Social Security, Medicare, and state tax are stacked deductions. The gap between your salary headline and your deposited paycheck is usually 20-35%, depending on your state and income.",
  },
  {
    icon: "📍",
    title: "Your state can swing thousands",
    body: "No-income-tax states (TX, FL, WA, and others) keep more of every paycheck. High-rate states like California and New York take a visible bite. Same salary, very different take-home.",
  },
  {
    icon: "🏦",
    title: "Pre-tax 401(k) cuts income tax — not FICA",
    body: "Traditional 401(k) dollars lower your taxable income for federal and state income tax, but Social Security and Medicare are still charged on your full gross pay.",
  },
];

const RELATED_CALCS = [
  {
    title: "Take-Home Pay Calculator",
    description: "Full salary-to-net breakdown with regional tax models.",
    href: "/tools/take-home-pay-calculator",
    icon: "💵",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Income Tax Calculator",
    description: "Estimate your federal income tax bill by bracket.",
    href: "/tools/income-tax-calculator",
    icon: "🧾",
    accent: "bg-blue-500/10",
  },
  {
    title: "Annual Salary Calculator",
    description: "Convert hourly or per-paycheck pay into an annual figure.",
    href: "/tools/annual-salary-calculator",
    icon: "📅",
    accent: "bg-amber-500/10",
  },
  {
    title: "Net Income Calculator",
    description: "See income left after taxes and key deductions.",
    href: "/tools/net-income-calculator",
    icon: "📊",
    accent: "bg-violet-500/10",
  },
];

export default function PaycheckCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Paycheck Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate take-home pay after federal income tax, Social Security, Medicare, and state income tax for any US state, filing status, and pay frequency.",
      url: "https://worthulator.com/tools/paycheck-calculator",
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
        eyebrowIcon="💵"
        eyebrowText="Payroll · Take-Home Pay"
        title="Paycheck Calculator"
        description="See your real take-home pay after federal tax, Social Security, Medicare, and state income tax — for any state, filing status, pay schedule, and 401(k) rate."
        chips={["All 50 states + DC", "Federal + FICA + state", "401(k) pre-tax aware"]}
      >
        <PaycheckCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A $${EXAMPLE.grossAnnual.toLocaleString()} single salary in ${EXAMPLE.stateCode} nets about <span class="font-semibold text-gray-900">$${EX.netPerPaycheck.toLocaleString()} per bi-weekly paycheck</span> (${EX.takeHomePct}% take-home) — versus $${EX_TX.netPerPaycheck.toLocaleString()} in a no-tax state like Texas.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What actually comes out of your paycheck"
        subtitle="Four stacked deductions separate your salary from your deposit."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Paycheck Calculator Works"
        formula={`retirement     = min(gross × pct%, 401(k) limit)
federalTaxable = max(0, gross − retirement − standard deduction)
federalTax     = progressive sum over IRS brackets (by filing status)
socialSecurity = min(gross, wage base) × 6.2%
medicare       = gross × 1.45% (+0.9% above $200k single)
stateTax       = (gross − retirement) × state top marginal rate
net            = gross − retirement − federalTax − SS − medicare − stateTax
perPaycheck    = net ÷ pay periods per year`}
        steps={[
          { label: "Enter gross annual pay", description: "Your salary before any taxes or deductions." },
          { label: "Pick filing status and state", description: "Selects your federal brackets, standard deduction, and state income tax rate." },
          { label: "Set 401(k) contribution", description: "Pre-tax retirement reduces taxable income for income tax (but not FICA)." },
          { label: "Choose pay frequency", description: "Annual net is divided into weekly, bi-weekly, semi-monthly, or monthly paychecks." },
          { label: "Review the breakdown", description: "See where each dollar goes and how net pay scales with salary." },
        ]}
        paragraphs={[
          "This calculator is an estimate. State income tax uses each state's top marginal rate as a flat rate, so graduated-rate states are slightly overstated for lower earners, and it does not model local/city taxes, pre-tax health premiums, or specific withholding allowances.",
          "Tax brackets, the Social Security wage base, and FICA rates come from the IRS and SSA for the current tax year; UK figures use HMRC income tax bands and National Insurance. Use the result for planning and compare against your actual pay stub.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Pair this with adjacent pay and tax tools."
        items={RELATED_CALCS}
      />
    </main>
  );
}
