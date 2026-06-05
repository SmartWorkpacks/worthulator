import type { Metadata } from "next";
import RmdCalculatorLoader from "./RmdCalculatorLoader";
import { calculateRmd, distributionPeriodForAge } from "@/lib/calculators/rmdEngine";
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
  title: "RMD Calculator - Required Minimum Distribution (IRS Table)",
  description:
    "Calculate your Required Minimum Distribution from a traditional IRA or 401(k). Uses the current IRS Uniform Lifetime Table by age, with your withdrawal percentage, monthly equivalent, and a 10-year projection.",
  keywords: [
    "rmd calculator",
    "required minimum distribution calculator",
    "ira rmd calculator",
    "401k rmd calculator",
    "uniform lifetime table",
  ],
  alternates: { canonical: "https://worthulator.com/tools/rmd-calculator" },
  robots: { index: true, follow: true },
};

// Deterministic worked examples computed at build from the engine.
const EX = calculateRmd({ accountBalance: 500_000, age: 73, expectedReturnPct: 5 });
const EX_80 = calculateRmd({ accountBalance: 500_000, age: 80, expectedReturnPct: 5 });

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const FAQS = [
  {
    q: "What is a required minimum distribution (RMD)?",
    a: `An RMD is the minimum amount you must withdraw each year from a traditional IRA, 401(k), or similar pre-tax retirement account once you reach the required age. On a ${money(500_000)} balance at age 73 that's about ${money(EX.rmdAmount)}.`,
  },
  {
    q: "How is my RMD calculated?",
    a: `Take your prior year-end (December 31) account balance and divide by the IRS life-expectancy factor for your age from the Uniform Lifetime Table. At age 73 the factor is ${distributionPeriodForAge(73)}, so ${money(500_000)} ÷ ${distributionPeriodForAge(73)} = ${money(EX.rmdAmount)}.`,
  },
  {
    q: "At what age do RMDs start?",
    a: `Under SECURE 2.0, the required beginning age is 73 for anyone reaching 72 after 2022, rising to 75 in 2033. Your first RMD can be delayed until April 1 of the year after you turn 73, but every RMD after that is due by December 31.`,
  },
  {
    q: "What happens if I don't take my RMD?",
    a: `The IRS charges an excise tax of 25% of the amount you failed to withdraw — reduced to 10% if you correct the shortfall promptly. That makes the December 31 deadline well worth tracking.`,
  },
  {
    q: "Does the RMD percentage go up as I get older?",
    a: `Yes. The life-expectancy factor shrinks each year, so the required percentage rises. At 73 you withdraw about ${EX.rmdPct}% of the balance; by 80 the factor drops to ${distributionPeriodForAge(80)} and the requirement climbs to roughly ${EX_80.rmdPct}%.`,
  },
];

const STATS = [
  {
    stat: money(EX.rmdAmount),
    color: "text-rose-600",
    accent: "bg-rose-500",
    label: `RMD on a ${money(500_000)} balance at age 73`,
  },
  {
    stat: `${EX.rmdPct}%`,
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: `Withdrawal rate at 73 (factor ${EX.distributionPeriod})`,
  },
  {
    stat: money(EX.monthlyEquivalent),
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "Monthly equivalent if spread across the year",
  },
];

const CONTENT_CARDS = [
  {
    icon: "📅",
    title: "Required at 73",
    body: "Once you reach the required beginning age, the IRS makes you draw down pre-tax accounts so the deferred tax finally gets paid. This tool uses the current Uniform Lifetime Table.",
  },
  {
    icon: "➗",
    title: "Balance ÷ a factor",
    body: "Your RMD is simply last year's ending balance divided by your age's life-expectancy factor. Lower factor with age means a bigger required percentage each year.",
  },
  {
    icon: "⚠️",
    title: "Don't miss the deadline",
    body: "Skip or underpay an RMD and the excise tax is 25% of the shortfall. The projection shows roughly what to expect over the next decade so nothing sneaks up on you.",
  },
];

const RELATED_CALCS = [
  {
    title: "Interest Calculator",
    description: "Project growth on what stays invested.",
    href: "/tools/interest-calculator",
    icon: "📈",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Income Tax Calculator",
    description: "Estimate tax on your distributions.",
    href: "/tools/income-tax-calculator",
    icon: "📋",
    accent: "bg-blue-500/10",
  },
  {
    title: "Tax Calculator",
    description: "Your total tax burden for the year.",
    href: "/tools/tax-calculator",
    icon: "🧾",
    accent: "bg-rose-500/10",
  },
  {
    title: "CD Calculator",
    description: "Park a distribution in a fixed-rate CD.",
    href: "/tools/cd-calculator",
    icon: "🏦",
    accent: "bg-amber-500/10",
  },
];

export default function RmdCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "RMD Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate your Required Minimum Distribution using the IRS Uniform Lifetime Table, with withdrawal percentage, monthly equivalent, and a 10-year projection.",
      url: "https://worthulator.com/tools/rmd-calculator",
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
        eyebrowIcon="🧓"
        eyebrowText="Finance · Retirement"
        title="RMD Calculator"
        description="Calculate the required minimum distribution from your traditional IRA or 401(k). Enter your balance and age for this year's RMD using the IRS Uniform Lifetime Table, your withdrawal rate, and a 10-year projection."
        chips={["IRS Uniform Lifetime", "Withdrawal %", "10-year projection"]}
      >
        <RmdCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A ${money(500_000)} traditional IRA at age 73 requires withdrawing about <span class="font-semibold text-gray-900">${money(EX.rmdAmount)}</span> this year — roughly ${EX.rmdPct}% of the balance, or ${money(EX.monthlyEquivalent)} a month.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Required minimum distributions, made simple"
        subtitle="When they start, how they're figured, and why the deadline matters."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the RMD Calculator Works"
        formula={`factor = IRS Uniform Lifetime Table[age]
RMD    = priorYearEndBalance ÷ factor
rate   = 1 ÷ factor   (as a %)
projection (each future year):
    rmd      = balance ÷ factor(age)
    balance  = (balance − rmd) × (1 + return)`}
        steps={[
          { label: "Enter your balance", description: "Your account value on December 31 of last year." },
          { label: "Enter your age", description: "The age you reach during this calendar year." },
          { label: "Set an expected return", description: "Used only to project future years' RMDs." },
          { label: "Read your RMD", description: "Balance divided by your age's life-expectancy factor." },
          { label: "Review the projection", description: "See how the requirement trends over the next decade." },
        ]}
        paragraphs={[
          `This calculator uses the IRS Uniform Lifetime Table (effective 2022), which applies to most account holders. If your sole beneficiary is a spouse more than 10 years younger, the IRS Joint Life and Last Survivor Table gives a larger factor and a smaller RMD, so your actual figure may differ. RMDs apply to traditional IRAs, 401(k), 403(b), and similar pre-tax accounts — Roth IRAs have no RMD during the owner's lifetime.`,
          `Figures here are estimates for planning and aren't tax advice. Distributions from pre-tax accounts are generally taxable as ordinary income, and rules around first-year timing, multiple accounts, and aggregation can be nuanced. Confirm your exact amount with your plan administrator or a tax professional before withdrawing.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Plan the tax, the growth, and where your distribution goes next."
        items={RELATED_CALCS}
      />
    </main>
  );
}
