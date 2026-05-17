import type { Metadata } from "next";
import Image from "next/image";
import RelatedTools from "@/components/RelatedTools";
import TakeHomePayCalculator from "./TakeHomePayCalculatorLoader";
import RegionToggle from "@/components/RegionToggle";
import InsightTable from "@/components/insights/InsightTable";

export const metadata: Metadata = {
  title: "Take Home Pay Calculator (US) – See Your Exact Net Salary Instantly",
  description:
    "Use our free take home pay calculator to instantly see your net salary after federal and state taxes. Fast, accurate, and built for US workers.",
  keywords: [
    "take home pay calculator",
    "salary after tax calculator",
    "paycheck calculator",
    "net pay calculator",
    "after tax salary",
    "us take home pay calculator",
    "federal tax calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/take-home-pay-calculator" },
  robots: { index: true, follow: true },
};


export default function TakeHomePayPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Take Home Pay Calculator",
      description: "Calculate your take home pay after federal tax, state tax, Social Security, and Medicare.",
      url: "https://worthulator.com/tools/take-home-pay-calculator",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much tax do I pay in the US?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Federal income tax ranges from 10% to 37% depending on your taxable income and filing status. Social Security takes 6.2% (up to $168,600) and Medicare takes 1.45%. State income tax varies from 0% in Texas and Florida to over 13% in California.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between gross and net pay?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Gross pay is your salary before any deductions. Net pay (take-home pay) is what arrives in your bank account after federal tax, state tax, Social Security, and Medicare have been deducted.",
          },
        },
        {
          "@type": "Question",
          name: "Does this calculator include state taxes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — select your state in the calculator and the state income tax rate will be included in the estimate. State rates range from 0% to over 13% depending on where you live.",
          },
        },
        {
          "@type": "Question",
          name: "Why might my paycheck differ from this estimate?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "This tool uses general tax assumptions. Real paychecks reflect your W-4 withholding elections, 401(k) contributions, employer health insurance premiums, and other employer-specific deductions.",
          },
        },
      ],
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* HERO + CALCULATOR */}
      <div className="relative overflow-x-clip bg-linear-to-b from-[#f7faf8] to-white">
        <div className="pointer-events-none absolute -top-10 left-1/4 h-64 w-64 rounded-full bg-emerald-200/25 blur-[72px]" />
        <div className="pointer-events-none absolute top-0 right-1/4 h-48 w-48 rounded-full bg-cyan-100/20 blur-[56px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <section className="relative px-5 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl pt-7 pb-6 sm:pt-9 sm:pb-7">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-600">$</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">United States · Income Tools</span>
            </div>
            <h1 className="text-[2.25rem] font-bold leading-[1.1] tracking-[-0.03em] text-gray-950 sm:text-[3rem]">
              Take Home Pay Calculator
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-[1.65] text-gray-500">
              Enter your salary and state to instantly see your take-home pay after all federal and state deductions. Includes Social Security, Medicare, and filing status.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                "Covers all 50 US states and their tax rates",
                "Breaks down federal tax, state tax, FICA separately",
                "Works for hourly and salaried income",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
                >
                  <svg className="h-2.5 w-2.5 shrink-0 text-emerald-500" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-5">
              <RegionToggle
                current="us"
                usPath="/tools/take-home-pay-calculator"
                ukPath="/tools/take-home-pay-calculator-uk"
                theme="light"
              />
            </div>
          </div>
        </section>
        <section className="relative px-5 pt-2 pb-12 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <TakeHomePayCalculator initialCountry="US" />
            <p className="mt-5 text-xs leading-relaxed text-gray-400">
              Estimates only — not financial or tax advice. Actual deductions vary based on your W-4 elections, employer benefits, local taxes, and pre-tax contributions. Consult a payroll provider or tax professional for exact figures.
            </p>
          </div>
        </section>
      </div>

      {/* INSIGHT STRIP */}
      <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
        <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
          Most people take home between{" "}
          <span className="font-semibold text-gray-800">60–70% of their salary</span>{" "}
          depending on their tax rate and deductions. See exactly where yours sits.
        </p>
      </div>

      {/* STAT CHIPS — moved below the calculator */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl grid gap-3 sm:grid-cols-3">
          {[
            { stat: "60–70%",  color: "text-emerald-600", label: "is what most people actually take home from their salary" },
            { stat: "$4,000+", color: "text-red-500",     label: "lost to federal and state taxes on an average US salary every year" },
            { stat: "25 secs", color: "text-blue-500",    label: "to see your exact breakdown with this tool" },
          ].map((item) => (
            <div key={item.stat} className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
              <p className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}>{item.stat}</p>
              <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT THIS MEANS */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">What this means for you</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Your gross salary is not the same as the money that reaches your bank account. Understanding the gap helps you plan better.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "📊",
                title: "Gross vs net",
                body: "Your gross salary is before deductions. Your net pay — take-home — is what you actually receive. The gap is often 25–40% of your earnings.",
              },
              {
                icon: "📉",
                title: "Small rates, big impact",
                body: "A 5% change in tax rate on a £50,000 salary means £2,500 per year. Small percentage shifts compound significantly over a career.",
              },
              {
                icon: "💡",
                title: "Deductions add up",
                body: "Pension, NI, and other deductions can seem small month to month — but they reduce your take-home by thousands per year.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-gray-900">{item.title}</h3>
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
                title: "Reduce your deductions",
                body: "Review pension, healthcare, and other voluntary deductions. Optimising these can meaningfully increase your monthly take-home.",
                card: "bg-white border-gray-200",
                label: "text-gray-400",
              },
              {
                step: "02",
                title: "Increase your income",
                body: "Even a modest salary increase has a compounding effect. Use this calculator to see exactly how a raise changes your net pay.",
                card: "bg-white border-gray-200",
                label: "text-gray-400",
              },
              {
                step: "03",
                title: "Plan your budget",
                body: "Now you know your real take-home, you can build a budget around actual numbers — not an estimate you later have to adjust.",
                card: "bg-white border-gray-200",
                label: "text-gray-400",
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${item.card}`}
              >
                <span className={`text-xs font-bold uppercase tracking-widest ${item.label}`}>{item.step}</span>
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
                body: "Type in your gross annual salary — the figure before tax and deductions.",
              },
              {
                step: "2",
                title: "Set your rates",
                body: "Adjust the tax rate and other deductions (pension, NI, healthcare) using the sliders.",
              },
              {
                step: "3",
                title: "See your take-home",
                body: "The tool instantly calculates your net pay and breaks it down by year, month, and week.",
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

      <InsightTable slug="take-home-pay-calculator" />

      {/* STATE LINKS */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Calculate your take-home pay by state</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            State income tax varies widely across the US. Select your state to see a take-home estimate that accounts for local tax rates.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {([
              { code: "ca", name: "California" },
              { code: "tx", name: "Texas" },
              { code: "fl", name: "Florida" },
              { code: "ny", name: "New York" },
              { code: "wa", name: "Washington" },
              { code: "il", name: "Illinois" },
              { code: "pa", name: "Pennsylvania" },
              { code: "oh", name: "Ohio" },
              { code: "ga", name: "Georgia" },
              { code: "nc", name: "North Carolina" },
              { code: "mi", name: "Michigan" },
              { code: "nj", name: "New Jersey" },
            ] as { code: string; name: string }[]).map((s) => (
              <a
                key={s.code}
                href={`/tools/take-home-pay-calculator/${s.code}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Disclaimer</h2>
          <p className="mt-4 leading-[1.85] text-gray-600">
            This calculator is provided for informational and educational purposes only. It uses general assumptions based on publicly available federal and state tax data and may not reflect your actual tax liability.
          </p>
          <p className="mt-4 leading-[1.85] text-gray-600">
            It does not constitute financial, tax, or legal advice, and no professional relationship is formed by using this tool. Tax rules change frequently and individual circumstances vary. You should consult a qualified tax advisor or financial professional for advice specific to your situation.
          </p>
        </div>
      </section>

      {/* RELATED TOOLS */}
      <RelatedTools currentTool="take-home-pay-calculator" bg="bg-gray-50" />

    </main>
  );
}
