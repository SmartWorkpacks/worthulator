import type { Metadata } from "next";
import RelatedTools from "@/components/RelatedTools";
import HourlyToSalaryCalculator from "../hourly-to-salary-calculator/HourlyToSalaryCalculatorLoader";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import LocaleSetter from "@/components/LocaleSetter";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Hourly to Salary Calculator UK – Work Out Your Annual Salary Instantly",
  description:
    "Work out your annual salary from your hourly rate in pounds. Enter your wage and hours worked and get instant results for yearly, monthly, and weekly income.",
  keywords: [
    "hourly to salary calculator UK",
    "hourly rate to annual salary UK",
    "convert hourly wage to yearly UK",
    "contractor day rate to salary UK",
    "hourly pay annual equivalent UK",
  ],
  alternates: { canonical: "https://www.worthulator.com/tools/hourly-to-salary-calculator-uk" },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Hourly to Salary Calculator UK",
    description:
      "Convert your hourly rate to an annual salary in pounds. See your monthly, weekly, and daily income. UK version.",
    url: "https://www.worthulator.com/tools/hourly-to-salary-calculator-uk",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I calculate my annual salary from an hourly rate in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply your hourly rate by your weekly contracted hours, then multiply by the number of weeks you work per year. The standard UK full-time formula is: hourly rate × 37.5 hours × 52 weeks.",
        },
      },
      {
        "@type": "Question",
        name: "What is the standard UK working week for salary calculations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most UK full-time contracts specify 37.5 hours per week, though some sectors use 40 hours. Your employment contract will specify your contracted hours — always use that figure for an accurate conversion.",
        },
      },
      {
        "@type": "Question",
        name: "Is this calculator showing gross or net salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gross only — before income tax, National Insurance, and pension contributions. To see your estimated take-home pay, use the Take Home Pay Calculator UK.",
        },
      },
      {
        "@type": "Question",
        name: "What is the UK National Living Wage 2025/26?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The National Living Wage for workers aged 21 and over is £12.21 per hour from April 2025. At 37.5 hours per week and 52 weeks per year, that equals approximately £23,810 per year gross.",
        },
      },
      {
        "@type": "Question",
        name: "Does holiday entitlement affect my annual salary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If you receive paid holiday, your annual salary already includes those weeks. If you are paid for actual hours worked only (e.g. on a zero-hours contract), reduce the weeks-per-year figure to reflect your actual working weeks.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
    <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
    <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
      Example &middot; £15/hr &middot; 37.5 hrs/wk
    </p>
    <p className="relative mt-3 text-5xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">
      £29,250
    </p>
    <p className="relative mt-1 text-sm text-gray-500">annual salary (gross)</p>
    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
      <div>
        <p className="text-lg font-bold text-emerald-400">£2,438</p>
        <p className="text-xs text-gray-500">/ month</p>
      </div>
      <div>
        <p className="text-lg font-bold text-emerald-400">£563</p>
        <p className="text-xs text-gray-500">/ week</p>
      </div>
      <div>
        <p className="text-lg font-bold text-emerald-400">£113</p>
        <p className="text-xs text-gray-500">/ day</p>
      </div>
    </div>
  </div>
);

const statChips = (
  <>
    {[
      {
        stat: "£15/hr",
        color: "text-emerald-600",
        label: "is approximately the UK median hourly wage for full-time workers in 2024",
      },
      {
        stat: "1,950",
        color: "text-blue-500",
        label: "hours in a standard full-time UK working year (37.5 hrs × 52 weeks)",
      },
      {
        stat: "5 secs",
        color: "text-orange-500",
        label: "to convert any hourly rate to an annual salary with this tool",
      },
    ].map((item) => (
      <div
        key={item.stat}
        className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
      >
        <p
          className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}
        >
          {item.stat}
        </p>
        <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
      </div>
    ))}
  </>
);

export default function HourlyToSalaryUKPage() {
  return (
    <>
      {/* Forces locale to UK so the calculator displays £ */}
      <LocaleSetter locale="UK" />

      <SimpleCalculatorShell
        jsonLd={jsonLd}
        category="United Kingdom · Income Tools"
        title="Hourly to Salary Calculator"
        subtitle="Convert your hourly wage into an annual salary, monthly income, and weekly pay in seconds."
        description={
          <>
            <p>
              Whether you&apos;re comparing job offers, negotiating a rate, or just want to know
              what your hourly pay adds up to over a year, enter your rate and hours above.
              The breakdown appears instantly in pounds.
            </p>
            <p className="mt-2 text-xs text-gray-400">
              For educational purposes only. Results show gross income before tax and National Insurance.
            </p>
            <RegionToggle
              current="uk"
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
            A standard full-time UK working year is{" "}
            <span className="font-semibold text-gray-800">1,950 hours</span>{" "}
            (37.5 hrs × 52 weeks). Adjust hours and weeks to match your contract.
          </>
        }
      >
        {/* HOW IT WORKS */}
        <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">How it works</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Enter your hourly rate",
                  body: "Type in your hourly wage in pounds — the rate shown on your payslip, contract, or job offer before any tax is taken.",
                },
                {
                  step: "2",
                  title: "Set your weekly hours and weeks",
                  body: "Use your contracted hours per week (typically 37.5 for UK full-time) and the number of weeks you actually work — deduct unpaid leave for an accurate result.",
                },
                {
                  step: "3",
                  title: "See your annual, monthly and weekly breakdown",
                  body: "Your equivalent annual salary, monthly, weekly, and daily pay update instantly. All figures are gross — before income tax and National Insurance.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW THE CALCULATION WORKS */}
        <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              How does the hourly to salary calculation work?
            </h2>
            <p className="mt-4 text-base leading-[1.85] text-gray-600">
              The conversion is simple: multiply your hourly rate by the number of hours you work each week, then multiply by the number of weeks you work in a year.
            </p>
            <p className="mt-4 text-base leading-[1.85] text-gray-600">
              For example, if you earn £15 per hour on a standard UK 37.5-hour contract, your annual salary works out to £15 × 37.5 × 52 — which is £29,250. If you earn £20 an hour on a 40-hour contract, that&apos;s £41,600 per year. The difference between a 37.5 and 40-hour week may sound small, but it adds up to over £1,300 at £15/hr.
            </p>
            <p className="mt-4 text-base leading-[1.85] text-gray-600">
              One thing to watch: the UK standard is 37.5 hours per week, not 40. If you enter 40 hours when your contract specifies 37.5, you&apos;ll overestimate your annual salary by about 6.7%. Always use the hours in your employment contract.
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
              Your total annual income depends on more than your hourly rate. Several factors commonly change the final figure:
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Hours per week",
                  body: "Most UK full-time contracts are 37.5 hours, though some sectors — including retail and healthcare — use 40. At £15/hr, that difference is worth over £1,300 per year. Always use your contracted hours, not a round number.",
                },
                {
                  title: "Holiday and unpaid leave",
                  body: "UK workers receive at least 28 days of statutory paid holiday. If you&apos;re paid hourly for actual hours worked only (common on zero-hours or casual contracts), reduce the weeks-per-year figure to your actual working weeks for a more accurate result.",
                },
                {
                  title: "Overtime",
                  body: "Overtime is not included in this calculation. If you regularly work extra hours — particularly at enhanced rates such as time-and-a-half — your actual annual earnings will be higher than this tool shows.",
                },
                {
                  title: "Bonuses and shift pay",
                  body: "Shift differentials, performance bonuses, and on-call allowances are common in UK workplaces but are not factored in here. The figure shown reflects your base hourly rate only.",
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

        {/* RATE REFERENCE TABLE */}
        <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">UK hourly rate reference</h2>
            <p className="mt-4 leading-7 text-gray-600">
              Quick reference for common UK hourly rates at the standard 37.5-hour week. All figures are gross (before tax and NI).
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">Hourly rate</th>
                    <th className="px-5 py-3 text-right font-semibold text-gray-700">Annual (37.5h)</th>
                    <th className="px-5 py-3 text-right font-semibold text-gray-700">Monthly</th>
                    <th className="hidden px-5 py-3 text-right font-semibold text-gray-700 sm:table-cell">Weekly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { rate: "£12.21 (NLW)", annual: "£23,810", monthly: "£1,984", weekly: "£458" },
                    { rate: "£13.00",       annual: "£25,350", monthly: "£2,113", weekly: "£488" },
                    { rate: "£15.00",       annual: "£29,250", monthly: "£2,438", weekly: "£563" },
                    { rate: "£18.00",       annual: "£35,100", monthly: "£2,925", weekly: "£675" },
                    { rate: "£20.00",       annual: "£39,000", monthly: "£3,250", weekly: "£750" },
                    { rate: "£25.00",       annual: "£48,750", monthly: "£4,063", weekly: "£938" },
                    { rate: "£30.00",       annual: "£58,500", monthly: "£4,875", weekly: "£1,125" },
                    { rate: "£35.00",       annual: "£68,250", monthly: "£5,688", weekly: "£1,313" },
                  ].map((row) => (
                    <tr key={row.rate} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{row.rate}</td>
                      <td className="px-5 py-3 text-right font-semibold text-emerald-700">{row.annual}</td>
                      <td className="px-5 py-3 text-right text-gray-600">{row.monthly}</td>
                      <td className="hidden px-5 py-3 text-right text-gray-600 sm:table-cell">{row.weekly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-400">Based on 37.5 hrs/week × 52 weeks. NLW = National Living Wage (April 2025, age 21+). Gross figures only.</p>
          </div>
        </section>

        {/* COMMON UK WAGE EXAMPLES */}
        <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Common hourly wage examples
            </h2>
            <p className="mt-4 text-base leading-[1.85] text-gray-600">
              Someone earning the National Living Wage of £12.21 per hour at 37.5 hours a week brings in around £23,800 per year — a figure that sits just above the UK personal allowance threshold. A £15 hourly rate works out to £29,250, while £20 an hour at full-time hours gives roughly £39,000 annually.
            </p>
            <p className="mt-4 text-base leading-[1.85] text-gray-600">
              For higher-paid roles, the numbers climb quickly. At £25 per hour, a 37.5-hour week produces around £48,750 per year — just below the 40% tax threshold. Rates of £30 or £35 an hour bring annual gross income to £58,500 and £68,250 respectively, both comfortably into the higher-rate tax band. Contractors often see rates of £50–£75 per hour, which can translate to six-figure annualised earnings even on a standard full-time basis.
            </p>
            <p className="mt-4 text-base leading-[1.85] text-gray-600">
              These are all gross figures before tax and National Insurance. The amount you actually take home will be lower — particularly as earnings move above £50,270, where the 40% PAYE band applies.
            </p>
          </div>
        </section>

        {/* UK TAX CONTEXT */}
        <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              How does tax affect your salary in the UK?
            </h2>
            <p className="mt-4 text-base leading-[1.85] text-gray-600">
              The annual salary shown here is gross — the amount before any deductions. In practice, most employees see three main deductions on their payslip.
            </p>
            <p className="mt-4 text-base leading-[1.85] text-gray-600">
              Income tax is collected via PAYE and uses a banded system. For 2025/26, earnings up to £12,570 are covered by the personal allowance and taxed at 0%. Earnings above that up to £50,270 are taxed at 20% (the basic rate), with income between £50,270 and £125,140 taxed at 40%. Only the earnings in each band are taxed at that rate — not your whole salary.
            </p>
            <p className="mt-4 text-base leading-[1.85] text-gray-600">
              National Insurance adds another layer. Employees pay 8% on earnings between £12,570 and £50,270, and 2% above that. Pension contributions — whether into a workplace scheme or a personal pension — reduce your taxable income and further change your take-home.
            </p>
            <p className="mt-4 text-base leading-[1.85] text-gray-600">
              To see your estimated net income after all of these deductions, use the{" "}
              <a
                href="/tools/take-home-pay-calculator-uk"
                className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700"
              >
                Take Home Pay Calculator UK
              </a>
              {" "}— it accounts for PAYE, National Insurance, and pension contributions.
            </p>
          </div>
        </section>

        {/* WHAT YOU CAN DO NEXT */}
        <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">What you can do next</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
              Now that you know your gross annual salary, here are the most useful next steps.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "See your actual take-home pay",
                  body: "Your gross salary and your take-home pay can differ by thousands of pounds a year. Use the Take Home Pay Calculator UK to see exactly what lands in your account after income tax, National Insurance, and pension.",
                },
                {
                  step: "02",
                  title: "Compare job offers accurately",
                  body: "When comparing a salaried offer with a contract or hourly role, make sure you're comparing net figures — not gross. A higher hourly rate doesn't always mean more take-home pay if the salaried role includes pension contributions or benefits.",
                },
                {
                  step: "03",
                  title: "Check you're above National Minimum Wage",
                  body: "The National Living Wage is £12.21/hr for workers aged 21+ from April 2025. If your effective hourly rate (including unpaid overtime or breaks) falls below this, your employer is breaking the law.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.step}</span>
                  <h3 className="mt-3 text-base font-semibold tracking-tight text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  q: "How do I calculate my annual salary from an hourly rate in the UK?",
                  a: "Multiply your hourly rate by your hours per week, then multiply by your weeks worked per year. The standard full-time formula is: hourly rate × 37.5 hours × 52 weeks = £72,800 for a £37.44/hr rate. Adjust the weeks figure to account for unpaid holiday or part-time arrangements.",
                },
                {
                  q: "What is the standard UK working week for salary calculations?",
                  a: "Most UK full-time contracts specify 37.5 hours per week, although some industries (including healthcare and retail) use 40 hours. Your employment contract will specify your contracted hours. Use the hours figure from your contract for an accurate conversion.",
                },
                {
                  q: "Does holiday entitlement affect my annual salary?",
                  a: "No — holiday pay is part of your salary, not in addition to it. Your annual salary already includes the pay you receive during the UK’s statutory minimum of 28 days (5.6 weeks) paid holiday. If you are paid hourly for actual hours worked only, deduct your holiday weeks from the total to get a more accurate gross figure.",
                },
                {
                  q: "What is the UK National Living Wage 2025/26?",
                  a: "The National Living Wage (for workers aged 21 and over) is £12.21 per hour from April 2025. At 37.5 hours per week and 52 weeks per year, that equals £23,810 per year gross. The National Minimum Wage for 18-20 year olds is £10.00/hr.",
                },
                {
                  q: "Is this calculator showing gross or net (take-home) salary?",
                  a: "This calculator shows gross salary only — before income tax, National Insurance, and pension deductions. To see your estimated take-home pay, use our Take Home Pay Calculator UK.",
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
              Results are based on the hours and rate you enter and represent gross income only. They do not account for overtime, bonuses, unpaid leave, employer benefits, or any tax or National Insurance deductions. For advice specific to your situation, consult a qualified financial or tax professional.
            </p>
          </div>
        </section>

        {/* RELATED TOOLS */}
        <RelatedTools currentTool="hourly-to-salary-calculator" />

      </SimpleCalculatorShell>
    </>
  );
}
