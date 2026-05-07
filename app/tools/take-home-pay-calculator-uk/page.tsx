import type { Metadata } from "next";
import RelatedTools from "@/components/RelatedTools";
import TakeHomePayCalculator from "../take-home-pay-calculator/TakeHomePayCalculatorLoader";
import LocaleSetter from "@/components/LocaleSetter";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Take Home Pay Calculator UK – Work Out Your Net Pay After Tax Instantly",
  description:
    "Work out your take-home pay after income tax and National Insurance. Enter your salary and get instant results for your monthly and annual net income. UK version.",
  keywords: [
    "take home pay calculator uk",
    "take home salary calculator",
    "net pay calculator",
    "after tax calculator uk",
    "salary after tax uk",
    "uk income tax calculator",
    "paye calculator",
    "national insurance calculator",
    "net salary calculator uk",
    "uk take home pay 2026",
  ],
  alternates: { canonical: "https://www.worthulator.com/tools/take-home-pay-calculator-uk" },
  robots: { index: true, follow: true },
};

export default function TakeHomePayUKPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Take Home Pay Calculator UK",
      description:
        "Calculate your UK take-home pay after PAYE income tax and National Insurance contributions.",
      url: "https://www.worthulator.com/tools/take-home-pay-calculator-uk",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much tax do I pay in the UK?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most UK workers pay 20% income tax on earnings between £12,571 and £50,270, and 8% National Insurance on the same band. If you earn over £50,270 you pay 40% income tax on the excess, and 2% NI.",
          },
        },
        {
          "@type": "Question",
          name: "What is National Insurance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "National Insurance (NI) is a tax on earnings that funds the state pension and other benefits. Employees pay Class 1 NI at 8% on earnings between £12,570 and £50,270 per year, and 2% on earnings above that.",
          },
        },
        {
          "@type": "Question",
          name: "How accurate is this calculator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "This calculator gives a close estimate for most standard employment situations using the 2025/26 tax year rates. It does not account for student loans, pension contributions, non-standard tax codes, or benefits-in-kind.",
          },
        },
        {
          "@type": "Question",
          name: "Does this include pension deductions?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. This calculator shows gross-to-net based on income tax and National Insurance only. Pension contributions are not included. To estimate take-home with pension, reduce your gross salary by your pension contribution percentage before entering it.",
          },
        },
      ],
    },
  ];

  return (
    <>
      {/* Forces locale to UK so the calculator switches to UK mode (PAYE/NI + £) */}
      <LocaleSetter locale="UK" />

      <main className="bg-white text-gray-900">
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-24 lg:px-16">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gray-100/60 blur-3xl" />

          <div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
            {/* Left — copy */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                United Kingdom · Income Tools
              </p>
              <h1 className="mt-4 text-[clamp(2.4rem,5.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-gray-950">
                Take Home Pay Calculator
                <span className="mt-1 block tracking-normal font-semibold text-gray-400">
                  See your net salary after income tax, National Insurance, and deductions.
                </span>
              </h1>
              <p className="mt-2 text-sm font-semibold tracking-tight text-emerald-600">
                Updated for the 2026–27 tax year.
              </p>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-gray-500">
                Enter your gross annual salary to see your exact take-home pay after PAYE income
                tax and National Insurance — broken down annually, monthly, and weekly. No
                sign-up. Results in seconds.
              </p>

              <RegionToggle
                current="uk"
                usPath="/tools/take-home-pay-calculator"
                ukPath="/tools/take-home-pay-calculator-uk"
                theme="light"
              />
            </div>

            {/* Right — preview stat card */}
            <div className="hidden lg:block">
              <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
                <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Example &middot; £35,000 salary
                </p>
                <p className="relative mt-3 text-5xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">
                  £27,486
                </p>
                <p className="relative mt-1 text-sm text-gray-500">estimated take-home per year</p>
                <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-white/8">
                  <div className="h-full bg-emerald-400" style={{ width: "79%" }} />
                  <div className="h-full bg-red-400" style={{ width: "12%" }} />
                  <div className="h-full flex-1 bg-orange-300" />
                </div>
                <div className="mt-3 flex gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Take-home
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    Income Tax
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-orange-300" />
                    NI
                  </span>
                </div>
                <p className="mt-5 text-xs text-gray-500">
                  79% of gross &mdash; adjust below to see yours
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  stat: "£12,570",
                  color: "text-emerald-600",
                  label:
                    "personal allowance for 2025/26 — earnings below this threshold are tax-free",
                },
                {
                  stat: "20%",
                  color: "text-red-500",
                  label:
                    "basic rate income tax on earnings between £12,571 and £50,270 under PAYE",
                },
                {
                  stat: "8%",
                  color: "text-amber-500",
                  label:
                    "National Insurance (Class 1) on earnings between £12,570 and £50,270 per year",
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
            </div>
            <TakeHomePayCalculator initialCountry="UK" />
          </div>
        </section>

        {/* INSIGHT STRIP */}
        <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
          <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
            Most UK workers take home between{" "}
            <span className="font-semibold text-gray-800">75–85% of their gross salary</span> —
            lower earners keep more because of the personal allowance; higher earners less due to
            the 40% tax band.
          </p>
        </div>

        {/* WHAT THIS MEANS */}
        <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              How UK take-home pay works
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
              Your UK take-home pay is your gross salary minus PAYE income tax and National
              Insurance contributions (NICs). Both are collected automatically by your employer
              through the HMRC payroll system.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: "💷",
                  title: "Personal allowance",
                  body: "Everyone gets a £12,570 tax-free personal allowance (2025/26). You only pay income tax on earnings above this — so your first £12,570 costs you nothing.",
                },
                {
                  icon: "📊",
                  title: "PAYE income tax bands",
                  body: "Basic rate (20%) applies to £12,571–£50,270. Higher rate (40%) applies to £50,271–£125,140. Additional rate (45%) applies above £125,140.",
                },
                {
                  icon: "🧾",
                  title: "National Insurance",
                  body: "Class 1 NI is 8% on earnings between £12,570 and £50,270, then 2% above. Unlike income tax, NI has no personal allowance — you pay from your first pound over the threshold.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU CAN DO NEXT */}
        <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">What you can do next</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
              Once you know your take-home pay, here are the most useful next steps.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Check your tax code",
                  body: "Millions of UK workers are on the wrong tax code and overpaying tax every month. Check your payslip and compare with HMRC's Personal Tax Account — a simple fix can mean hundreds back.",
                },
                {
                  step: "02",
                  title: "Explore salary sacrifice",
                  body: "Directing pre-tax salary into your pension or cycle-to-work scheme cuts both income tax and National Insurance. Higher-rate taxpayers save 42p in combined deductions for every £1 they sacrifice.",
                },
                {
                  step: "03",
                  title: "Build a budget around real figures",
                  body: "Now you know what actually lands in your account, you can build a monthly budget around real numbers — not the gross salary figure on your offer letter.",
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

        {/* HOW IT WORKS */}
        <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">How it works</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Enter your salary",
                  body: "Type in your gross annual salary — the figure before any tax or deductions, as shown on your offer letter or payslip.",
                },
                {
                  step: "2",
                  title: "See your breakdown instantly",
                  body: "The calculator applies the current PAYE income tax bands and National Insurance rates and shows your full deduction breakdown in real time.",
                },
                {
                  step: "3",
                  title: "Explore scenarios",
                  body: "Use the 'What if your salary changed?' panel to model the impact of a pay rise, a new job offer, or extra hours — all instantly.",
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

        {/* SEO CONTENT */}
        <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl space-y-10 text-gray-600">

            {/* H2 1 */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                How is take home pay calculated in the UK?
              </h2>
              <p className="mt-4 leading-[1.85]">
                Your take home pay — also called your net salary — is what remains from your gross
                salary after your employer has deducted PAYE income tax and National Insurance
                contributions (NICs). Both deductions are applied automatically through the HMRC
                payroll system before your salary reaches your bank account.
              </p>
              <p className="mt-4 leading-[1.85]">
                The calculation works in three steps. First, your personal allowance (£12,570 for
                2025/26) is subtracted from your gross salary to produce your{" "}
                <strong className="text-gray-800">taxable income</strong>. Second, PAYE income tax
                is applied to that taxable income using the banded rates below. Third, Class 1
                National Insurance is calculated separately — it applies to earnings above £12,570
                regardless of any other allowances.
              </p>
              <p className="mt-4 leading-[1.85]">
                For most standard employees, these two deductions account for virtually all the
                difference between gross and net pay. Other items — such as pension contributions,
                student loan repayments, or salary sacrifice arrangements — can reduce your
                take-home further but are not included in this calculator.
              </p>
            </div>

            {/* H2 2 */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                UK tax bands explained (2026)
              </h2>
              <p className="mt-4 leading-[1.85]">
                UK income tax is structured as a progressive banded system. You only pay the
                higher rate on earnings <em>above</em> each threshold — not on your entire salary.
                The following rates apply for the 2025/26 tax year (England, Wales, and Northern
                Ireland):
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-5 py-3 text-left font-semibold text-gray-700">Band</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-700">Earnings</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-700">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ["Personal allowance", "Up to £12,570", "0%"],
                      ["Basic rate", "£12,571 – £50,270", "20%"],
                      ["Higher rate", "£50,271 – £125,140", "40%"],
                      ["Additional rate", "Over £125,140", "45%"],
                    ].map(([band, range, rate]) => (
                      <tr key={band} className="bg-white">
                        <td className="px-5 py-3 font-medium text-gray-800">{band}</td>
                        <td className="px-5 py-3 text-gray-600">{range}</td>
                        <td className="px-5 py-3 font-semibold text-emerald-700">{rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 leading-[1.85]">
                National Insurance (Class 1 employee contributions) is charged at{" "}
                <strong className="text-gray-800">8%</strong> on weekly earnings between £242 and
                £967 (equivalent to £12,570–£50,270 annually), and{" "}
                <strong className="text-gray-800">2%</strong> on anything above that. There is no
                personal allowance equivalent for NI — you start paying from the first pound above
                the primary threshold.
              </p>
              <p className="mt-4 leading-[1.85]">
                Scotland sets its own income tax rates through the Scottish Parliament. Scottish
                taxpayers pay the Scottish rates (which have more bands) instead of the UK rates
                shown above. This calculator uses the England / Wales / Northern Ireland rates.
              </p>
            </div>

            {/* H2 3 */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                Example take home salaries in the UK
              </h2>
              <p className="mt-4 leading-[1.85]">
                To give you a benchmark, here are approximate take-home pay figures for common UK
                salary levels in 2025/26, based on the standard 1257L tax code with no other
                deductions:
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    gross: "£30,000",
                    net: "~£25,100",
                    monthly: "~£2,092/month",
                    pct: "84%",
                    color: "text-emerald-600",
                    detail: "Pays £3,486 income tax + £1,394 NI. Most of the salary sits in the basic-rate band.",
                  },
                  {
                    gross: "£50,000",
                    net: "~£39,500",
                    monthly: "~£3,292/month",
                    pct: "79%",
                    color: "text-amber-600",
                    detail: "Pays £7,486 income tax + £2,994 NI. Still fully within basic rate band.",
                  },
                  {
                    gross: "£100,000",
                    net: "~£68,500",
                    monthly: "~£5,708/month",
                    pct: "69%",
                    color: "text-red-500",
                    detail: "Pays ~£27,430 income tax + ~£4,010 NI. Higher rate applies from £50,271.",
                  },
                ].map((item) => (
                  <div
                    key={item.gross}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Gross {item.gross}
                    </p>
                    <p className={`mt-2 text-3xl font-bold tracking-tight ${item.color}`}>
                      {item.net}
                    </p>
                    <p className="text-sm text-gray-500">{item.monthly}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-400">
                      {item.pct} take-home
                    </p>
                    <p className="mt-3 text-xs leading-5 text-gray-400">{item.detail}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-gray-500">
                Use the calculator above to get a figure specific to your own salary. These
                examples assume the standard tax code, no pension deductions, and England/Wales/NI
                rates.
              </p>
            </div>

            {/* H2 4 */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                Net pay vs gross pay – what&apos;s the difference?
              </h2>
              <p className="mt-4 leading-[1.85]">
                <strong className="text-gray-800">Gross pay</strong> is your salary before any
                deductions — the figure your employer agrees to pay you and the number on your
                offer letter. <strong className="text-gray-800">Net pay</strong> (also called
                take-home pay) is what actually lands in your bank account after income tax,
                National Insurance, and any other deductions have been taken off.
              </p>
              <p className="mt-4 leading-[1.85]">
                The gap between the two can be substantial. For a £35,000 salary, the difference
                is roughly £7,500 per year — about 21% of gross pay. For a £70,000 earner, the
                gap grows to over £21,000 per year as the higher rate tax band kicks in.
              </p>
              <p className="mt-4 leading-[1.85]">
                This distinction matters for budgeting. When comparing job offers, negotiating a
                pay rise, or planning monthly outgoings, always work from your net figure — not
                the headline gross salary. Two people on the same gross salary can have different
                net pay depending on their tax code, pension arrangements, or student loan plan.
              </p>
            </div>

            {/* H2 5 */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                How to increase your take home pay
              </h2>
              <p className="mt-4 leading-[1.85]">
                There are several legitimate ways to increase the amount you actually take home
                each month without needing a pay rise:
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7">
                <li className="flex gap-3">
                  <span className="mt-0.5 text-emerald-500">▸</span>
                  <span>
                    <strong className="text-gray-800">Salary sacrifice.</strong> Directing part of
                    your pre-tax salary into a pension or cycle-to-work scheme reduces your taxable
                    income, cutting both income tax and National Insurance. A higher-rate taxpayer
                    saves 42p in tax and NI for every £1 they sacrifice.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-emerald-500">▸</span>
                  <span>
                    <strong className="text-gray-800">Check your tax code.</strong> Millions of UK
                    workers are on the wrong tax code, often paying more tax than necessary. Check
                    your payslip and verify your code with HMRC via your Personal Tax Account. An
                    emergency tax code (e.g. 1257L W1/M1) can mean you&apos;re being overtaxed
                    each month.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-emerald-500">▸</span>
                  <span>
                    <strong className="text-gray-800">Claim work expenses.</strong> If you incur
                    allowable expenses for work that your employer doesn&apos;t reimburse — such as
                    professional subscriptions, tools, or uniform costs — you can claim tax relief
                    through HMRC, reducing your overall tax bill.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-emerald-500">▸</span>
                  <span>
                    <strong className="text-gray-800">Marriage allowance.</strong> If you or your
                    spouse earns below the personal allowance, you may be able to transfer £1,260
                    of unused allowance to the higher earner — saving up to £252 per year.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-emerald-500">▸</span>
                  <span>
                    <strong className="text-gray-800">Increase your gross pay.</strong> Even a
                    modest salary increase has a meaningful effect once deductions are applied. Use
                    our{" "}
                    <a
                      href="/tools/hourly-to-salary-calculator-uk"
                      className="font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-500"
                    >
                      hourly to salary calculator
                    </a>{" "}
                    or{" "}
                    <a
                      href="/tools/overtime-pay-calculator-uk"
                      className="font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-500"
                    >
                      overtime pay calculator
                    </a>{" "}
                    to model the impact of a rate change or extra hours.
                  </span>
                </li>
              </ul>
            </div>

            {/* DISCLAIMER */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Important
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Estimates only. This tool does not account for personal tax codes, student loan
                repayments (Plan 1/2/4/5), pension contributions, benefits-in-kind, or other
                deductions. It is not financial or tax advice. Always check your payslip and
                consult HMRC or a qualified accountant for accurate figures.
              </p>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                Frequently asked questions
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    q: "How much tax do I pay in the UK?",
                    a: "Most UK workers pay 20% income tax on earnings between £12,571 and £50,270 (the basic rate band), plus 8% National Insurance on the same range. Earnings above £50,270 are taxed at 40% income tax and 2% NI. The first £12,570 is tax-free under the personal allowance.",
                  },
                  {
                    q: "What is National Insurance?",
                    a: "National Insurance (NI) is a compulsory tax on earnings that funds the state pension, NHS, and other social security benefits. Employees pay Class 1 NI at 8% on earnings between £12,570 and £50,270 per year, and 2% on earnings above that. There is no equivalent of the personal allowance for NI — contributions start from the first pound above the primary threshold.",
                  },
                  {
                    q: "How accurate is this calculator?",
                    a: "This calculator gives a close estimate for most standard employees using 2025/26 PAYE income tax and National Insurance rates, assuming the standard 1257L tax code and no additional deductions. It will not exactly match your payslip if you have a non-standard tax code, student loan repayments, pension contributions, salary sacrifice, or benefits-in-kind.",
                  },
                  {
                    q: "Does this include pension deductions?",
                    a: "No. This calculator shows gross-to-net based on income tax and National Insurance only. Workplace pension contributions (typically 5% employee, 3% employer under auto-enrolment) are not deducted. To estimate take-home with pension, reduce your gross salary by your contribution percentage before entering it into the calculator.",
                  },
                  {
                    q: "What tax code does this calculator use?",
                    a: "This calculator assumes the standard 1257L tax code, which gives you the full £12,570 personal allowance. If your payslip shows a different tax code — such as BR (no allowance), K (negative allowance), or an emergency code — your actual take-home will differ.",
                  },
                  {
                    q: "Does Scotland have different income tax rates?",
                    a: "Yes. Scotland sets its own income tax bands through the Scottish Parliament. Scottish rates differ from the rest of the UK and this calculator uses England/Wales/Northern Ireland rates only. Scottish taxpayers should refer to the Scottish Government website for their specific rates.",
                  },
                ].map((item) => (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="text-base font-semibold tracking-tight text-gray-900">
                      {item.q}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RELATED TOOLS */}
        <RelatedTools currentTool="take-home-pay-calculator" bg="bg-gray-50" />
      </main>
    </>
  );
}
