import type { Metadata } from "next";
import DarkResultCard from "@/components/ui/DarkResultCard";
import RelatedTools from "@/components/RelatedTools";
import HourlyToSalaryCalculator from "./HourlyToSalaryCalculatorLoader";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Hourly to Salary Calculator – Work Out Your Annual Salary Instantly",
  description:
    "Work out your annual salary from your hourly rate. Enter your wage and hours worked and get instant results for yearly, monthly, and weekly income.",
  keywords: [
    "hourly to salary calculator",
    "hourly rate to annual salary",
    "convert hourly to salary",
    "hourly wage calculator",
    "annual salary calculator",
    "hourly to yearly salary",
  ],
  alternates: { canonical: "https://worthulator.com/tools/hourly-to-salary-calculator" },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Hourly to Salary Calculator",
    description:
      "Convert your hourly wage to an annual salary instantly. See your monthly and weekly income based on your hours and weeks worked.",
    url: "https://worthulator.com/tools/hourly-to-salary-calculator",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many hours are used in a full-time annual salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A standard full-time year is 2,080 hours — 40 hours per week multiplied by 52 weeks. This is the most common basis for converting an hourly rate to an annual salary.",
        },
      },
      {
        "@type": "Question",
        name: "Does this calculator include overtime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The calculation uses your stated hourly rate and hours per week only. Overtime is typically paid at a higher rate (e.g. 1.5x), so your actual earnings could be higher if you regularly work extra hours.",
        },
      },
      {
        "@type": "Question",
        name: "Is the salary shown before or after tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Before tax. The figure shown is your gross annual salary. To see your take-home pay after federal tax, state tax, Social Security, and Medicare, use our Take Home Pay Calculator.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate is this calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The conversion is mathematically exact based on the inputs you provide. Accuracy depends on how closely your actual working pattern matches what you enter — adjust hours and weeks to reflect your real situation.",
        },
      },
    ],
  },
];

const heroCard = (
  <DarkResultCard
    label="Example · $25/hr · 40 HRS/WK"
    value="$52,000"
    sub="annual salary (gross)"
    stats={[
      { value: "$4,333", label: "/ month" },
      { value: "$1,000", label: "/ week" },
      { value: "$200",   label: "/ day" },
    ]}
  />
);

const statChips = (
  <>
    {[
      { stat: "$25/hr",  color: "text-emerald-600", label: "is the approximate US median hourly wage in 2024" },
      { stat: "2,080",   color: "text-blue-500",    label: "hours in a standard full-time working year (40 hrs × 52 wks)" },
      { stat: "5 secs",  color: "text-orange-500",  label: "to convert any hourly rate to an annual salary with this tool" },
    ].map((item) => (
      <div key={item.stat} className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
        <p className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}>{item.stat}</p>
        <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
      </div>
    ))}
  </>
);

export default function HourlyToSalaryPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="United States · Income Tools"
      title="Hourly to Salary Calculator"
      subtitle="Convert your hourly wage into an annual salary, monthly income, and weekly pay in seconds."
      description={
        <>
          <p>
            Enter your hourly rate and hours per week to instantly see your equivalent
            annual salary, monthly pay, and weekly earnings. Useful for comparing job
            offers, negotiating a raise, or understanding what a contract role pays
            on a salaried basis.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-gray-400">
            <li>Adjustable hours per week and weeks worked per year</li>
            <li>Annual, monthly, weekly, and daily breakdowns</li>
            <li>Gross figures — use the Take Home Pay Calculator for after-tax</li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">
            For planning purposes only. Results show gross income before tax.
          </p>
          <RegionToggle
            current="us"
            usPath="/tools/hourly-to-salary-calculator"
            ukPath="/tools/hourly-to-salary-calculator-uk"
            theme="light"
          />
        </>
      }
      heroCard={heroCard}
      statChips={statChips}
      calculator={<HourlyToSalaryCalculator />}
      insightText={
        <>
          A standard full-time year is{" "}
          <span className="font-semibold text-gray-800">2,080 hours</span>{" "}
          (40 hrs × 52 weeks). Adjust weeks worked below to account for vacation or part-time schedules.
        </>
      }
    >

      {/* HOW THE CALCULATION WORKS */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            How does the hourly to salary calculation work?
          </h2>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            The conversion is straightforward: multiply your hourly rate by the number of hours you work each week, then multiply by the number of weeks you work in a year.
          </p>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            For example, if you earn $25 per hour and work 40 hours a week, your annual salary works out to $25 × 40 × 52 — which is $52,000. If you only work 50 weeks a year after taking two weeks of unpaid leave, that same rate gives you $50,000 instead. The difference adds up quickly.
          </p>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            You can adjust both your weekly hours and the number of weeks you work in the calculator above. Most tools assume 52 weeks and 40 hours — this one lets you be more precise.
          </p>
        </div>
      </section>

      {/* WHAT AFFECTS YOUR ANNUAL SALARY */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            What affects your annual salary?
          </h2>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            Your annual income from an hourly role depends on more than just the rate. A few things commonly change the final number:
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Hours per week",
                body: "Full-time is typically 40 hours a week in the US, but many roles run at 37.5, 32, or fewer hours. Even a small difference compounds over a year — 37.5 hours instead of 40 reduces your annual total by around 6%.",
              },
              {
                title: "Unpaid time off",
                body: "If you take two weeks of unpaid leave, you effectively work 50 weeks rather than 52. That&apos;s a 4% reduction to your annual income at the same hourly rate. Adjusting the weeks field in the calculator reflects this accurately.",
              },
              {
                title: "Overtime",
                body: "Regular overtime is typically paid at 1.5× your base rate and is not included here. If overtime is a consistent part of your work, your actual annual earnings will be higher than this estimate shows.",
              },
              {
                title: "Bonuses and allowances",
                body: "Many hourly roles include bonuses, shift differentials, or allowances that add to your total income. These are not factored into this calculation — the figure shown reflects your base hourly rate only.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <h3 className="text-base font-semibold tracking-tight text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMON SCENARIOS */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            Common hourly wage examples
          </h2>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            Someone earning around $15 per hour at full-time hours typically brings in just over $30,000 per year — a figure that comes up frequently in discussions around minimum wage and entry-level roles. A $20 hourly rate works out to roughly $41,600, while $25 an hour lands at $52,000 annually.
          </p>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            As hourly rates climb, the annual numbers grow quickly. At $35 per hour, a full-time worker earns around $72,800 per year. Rates of $40 or $50 an hour — common in skilled trades, nursing, or consulting — translate to $83,200 and $104,000 respectively. At $75 or more, annual income moves comfortably into the six-figure range.
          </p>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            These are all gross figures — before federal tax, state income tax, and payroll deductions. The amount that actually lands in your bank account will be lower depending on where you live and how you file.
          </p>
        </div>
      </section>

      {/* TAX CONTEXT */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            How does tax affect your salary?
          </h2>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            The annual figure shown is your gross income — what you earn before any taxes are taken out. In the US, several things reduce that number before it reaches your account.
          </p>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            Federal income tax uses a progressive bracket system, starting at 10% on the lowest earnings and rising to 37% at the highest incomes. Most people earning between $40,000 and $80,000 have an effective federal rate well below their marginal rate, because only earnings above each threshold are taxed at the higher rate.
          </p>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            On top of that, payroll taxes cover Social Security (6.2% up to $168,600) and Medicare (1.45% with no ceiling). These apply regardless of income level or filing status. State income tax varies widely — from 0% in Texas and Florida to over 13% in California.
          </p>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            To see your estimated take-home after all these deductions, use the{" "}
            <a
              href="/tools/take-home-pay-calculator"
              className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700"
            >
              Take Home Pay Calculator
            </a>
            {" "}— it accounts for your state, filing status, and FICA contributions.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How many hours are used in a full-time annual salary?",
                a: "The standard is 2,080 hours — 40 hours per week multiplied by 52 weeks. This is the most common basis for converting an hourly rate to an annual figure, though your actual hours may differ.",
              },
              {
                q: "Does this calculator include overtime?",
                a: "No. The calculation uses your stated rate and regular weekly hours only. Overtime is typically paid at 1.5×, so if overtime is a regular part of your role, your actual annual earnings will be higher than this estimate.",
              },
              {
                q: "Is the salary shown before or after tax?",
                a: "Before tax. The figure shown is your gross annual salary. To see your estimated net income after federal tax, state tax, Social Security, and Medicare, use the Take Home Pay Calculator.",
              },
              {
                q: "How accurate is this calculator?",
                a: "The maths is exact given the inputs you provide. Accuracy depends on how closely your actual working pattern matches what you enter. Adjust both your weekly hours and weeks worked to reflect your real situation.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold tracking-tight text-gray-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Disclaimer</h2>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            This calculator is provided for informational and educational purposes only. It does not constitute financial or tax advice.
          </p>
          <p className="mt-4 text-base leading-[1.85] text-gray-600">
            Results are based on the hours and rate you enter and represent gross income only. They do not account for overtime, bonuses, unpaid leave, employer benefits, or any tax deductions. For advice specific to your situation, consult a qualified financial or tax professional.
          </p>
        </div>
      </section>

      {/* RELATED TOOLS */}
      <RelatedTools currentTool="hourly-to-salary-calculator" />

    </SimpleCalculatorShell>
  );
}
