import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import SalaryBreakdownCalculatorLoader from "./SalaryBreakdownCalculatorLoader";

export const metadata: Metadata = {
  title: "Salary Breakdown Calculator � Work Out Your Tax and Take-Home Pay Instantly",
  description:
    "Work out how much tax you pay and what you actually take home. Enter your salary and get instant results for federal tax, FICA, and net pay. US version.",
  keywords: [
    "salary breakdown calculator",
    "US salary tax calculator",
    "federal income tax calculator",
    "FICA calculator",
    "take home pay US",
    "net salary calculator",
    "how much tax do I pay US",
    "paycheck breakdown calculator",
  ],
  alternates: {
    canonical: "https://worthulator.com/tools/salary-breakdown-calculator",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Salary Breakdown Calculator (US)",
    description:
      "Calculate your federal income tax, FICA, and monthly take-home pay for US salaries.",
    url: "https://worthulator.com/tools/salary-breakdown-calculator",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much federal income tax do I pay in the US?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The US uses progressive federal tax brackets � 10%, 12%, 22%, 24%, 32%, 35%, and 37%. You only pay the higher rates on the income above each threshold, not on your whole salary.",
        },
      },
      {
        "@type": "Question",
        name: "What is FICA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FICA is the Federal Insurance Contributions Act tax. It consists of Social Security (6.2% on wages up to $168,600) and Medicare (1.45% on all wages) � a combined 7.65% for most employees.",
        },
      },
      {
        "@type": "Question",
        name: "Does a 401(k) contribution reduce my taxes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Traditional 401(k) contributions reduce your federal taxable income dollar-for-dollar, so every dollar you contribute saves you tax at your marginal rate. They do not reduce FICA.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between single and married filing status?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Married filing jointly uses wider tax brackets, which typically results in lower total tax than filing single at the same combined income. This calculator supports both filing statuses.",
        },
      },
      {
        "@type": "Question",
        name: "Why doesn't this calculator include state income tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "State income tax rates vary from 0% (Texas, Florida, Nevada) to over 13% (California). This tool focuses on federal tax and FICA for a clean universal estimate. For state-specific results, use the Take Home Pay Calculator.",
        },
      },
      {
        "@type": "Question",
        name: "What is an effective tax rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your effective tax rate is the total tax paid (income tax + FICA) divided by your gross salary. It is always lower than your marginal rate because lower bands of income are taxed at lower rates.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 text-white shadow-2xl">
    <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
      Example � $80,000 salary (US, single)
    </p>
    <div className="mt-5 space-y-1">
      <p className="text-4xl font-bold tracking-tight">$5,102</p>
      <p className="text-sm font-semibold text-white/50">per month take-home</p>
    </div>
    <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
      <div className="flex justify-between">
        <span className="text-white/50">Federal Income Tax</span>
        <span className="font-semibold">$12,653/yr</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">FICA</span>
        <span className="font-semibold">$6,120/yr</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">Effective rate</span>
        <span className="font-semibold">23.5%</span>
      </div>
    </div>
  </div>
);

const statChips = (
  <>
    {[
      {
        stat: "$12,953",
        color: "text-emerald-600",
        label: "average federal income tax on an $80,000 salary (single filer, 2024)",
      },
      {
        stat: "7.65%",
        color: "text-blue-500",
        label: "combined FICA rate � 6.2% Social Security + 1.45% Medicare employee share",
      },
      {
        stat: "22%",
        color: "text-orange-500",
        label: "marginal federal rate on income between $47,150 and $100,525 (2024 single filer)",
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

export default function SalaryBreakdownCalculatorPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="Money � Tax"
      title="Salary Breakdown Calculator"
      subtitle="See exactly where your money goes � federal income tax, FICA, and your real take-home pay."
      description={
        <>
          Enter your annual salary, choose single or married filing status, and get
          an instant breakdown of federal income tax, Social Security, Medicare, and
          your monthly take-home pay. Add a 401(k) contribution to see how it reduces
          your tax bill.{" "}
          <span className="mt-2 block text-sm text-gray-400">
            Based on 2024 federal rates. Does not include state income tax. For
            planning purposes � verify with a tax adviser for personal advice.
          </span>
        </>
      }
      statChips={statChips}
      heroCard={heroCard}
      calculator={<SalaryBreakdownCalculatorLoader defaultRegion="US" />}
      insightText={
        <>
          On an <strong>$80,000 US salary</strong> (single filer) you take home
          approximately <strong>$5,102/month</strong> after federal income tax
          and FICA � an effective rate of 23.5%.
        </>
      }
    >

      {/* -- HOW IT'S CALCULATED --------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How salary tax is calculated
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Both the UK and US use progressive tax systems � you pay a higher
            rate only on the income above each threshold, not on your whole
            salary. The calculation has three stages:
          </p>
          <div className="mt-6 space-y-3">
            {[
              {
                step: "1",
                label: "Deduct pre-tax contributions",
                value:
                  "Pension (UK) or 401(k) (US) contributions reduce the income that tax is calculated on.",
              },
              {
                step: "2",
                label: "Apply income tax brackets",
                value:
                  "Each slice of your income is taxed at the rate for that band. Higher income means a higher rate on the top slice only.",
              },
              {
                step: "3",
                label: "Add payroll levies",
                value:
                  "National Insurance (UK) or FICA � Social Security + Medicare (US) � is calculated separately on top of income tax.",
              },
            ].map(({ step, label, value }) => (
              <div
                key={step}
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{label}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- US BRACKETS ------------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            US federal tax brackets and FICA (2024)
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Federal income tax is progressive. FICA (Social Security + Medicare)
            is applied separately as a flat percentage. State income tax is not
            included � rates vary from 0% (Texas, Florida) to over 13%
            (California).
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Federal Tax (Single filer)
              </p>
              <div className="space-y-2">
                {[
                  { range: "$0 � $11,600", rate: "10%" },
                  { range: "$11,600 � $47,150", rate: "12%" },
                  { range: "$47,150 � $100,525", rate: "22%" },
                  { range: "$100,525 � $191,950", rate: "24%" },
                  { range: "$191,950 � $243,725", rate: "32%" },
                  { range: "$243,725 � $609,350", rate: "35%" },
                  { range: "Above $609,350", rate: "37%" },
                ].map(({ range, rate }) => (
                  <div
                    key={range}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <span className="text-gray-500">{range}</span>
                    <span className="font-bold text-emerald-600">{rate}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                FICA
              </p>
              <div className="space-y-2">
                {[
                  { label: "Social Security", detail: "on wages up to $168,600", rate: "6.2%" },
                  { label: "Medicare",        detail: "on all wages",             rate: "1.45%" },
                  { label: "Total FICA",      detail: "combined employee share",  rate: "7.65%" },
                ].map(({ label, detail, rate }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <div>
                      <span className="font-semibold text-gray-700">{label}</span>
                      <span className="ml-2 text-gray-400">{detail}</span>
                    </div>
                    <span className="font-bold text-emerald-600">{rate}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Employers match FICA contributions � the employee only pays half
                the total 15.3%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -- PENSION / 401K --------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How pension and 401(k) contributions reduce your tax
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Contributing to a pension (UK) or traditional 401(k) (US) reduces
            the income that tax is calculated on � so every pound or dollar you
            save also saves you tax at your marginal rate.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                region: "UK � Pension",
                example:
                  "On a �60,000 salary, a 10% pension contribution (�6,000/yr) brings taxable income below the higher-rate threshold. Instead of paying 40% on that �6,000, you pay nothing. Saving �2,400 in tax.",
              },
              {
                region: "US � 401(k)",
                example:
                  "On an $80,000 salary, contributing 10% to a 401(k) ($8,000/yr) reduces federal taxable income to $72,000. At a 22% marginal rate, that saves approximately $1,760 in federal tax.",
              },
            ].map(({ region, example }) => (
              <div
                key={region}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-bold text-emerald-700">{region}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {example}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- WHAT THIS MEANS -------------------------------------------- */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">What this means for you</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Three things most people misunderstand about how US federal tax actually works.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "??",
                title: "Your marginal rate ? your real rate",
                body: "On an $80,000 salary your marginal rate is 22%, but your effective federal rate is around 15.8%. Only income above $47,150 is taxed at 22% � everything below is taxed at lower rates.",
              },
              {
                icon: "??",
                title: "Social Security has a ceiling",
                body: "The 6.2% Social Security tax only applies to wages up to $168,600 in 2024. Above that cap you stop paying SS � though Medicare (1.45%) has no ceiling and applies to all wages.",
              },
              {
                icon: "??",
                title: "Every 401(k) dollar saves tax now",
                body: "A traditional 401(k) contribution reduces your federal taxable income dollar-for-dollar. At a 22% marginal rate, $1,000 into your 401(k) saves $220 in federal tax � immediately, before any investment growth.",
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

      {/* -- WHAT YOU CAN DO NEXT --------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">What you can do next</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Practical steps to legally reduce your federal tax bill.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Check your W-4 withholding",
                body: "If your employer is withholding too much or too little, you'll get a large refund � or owe at filing time. Update your W-4 after a pay rise, marriage, or new dependant to stay accurate throughout the year.",
              },
              {
                step: "02",
                title: "Max your 401(k) first",
                body: "The 2024 limit is $23,000 ($30,500 if 50+). Every dollar goes in pre-tax, reducing taxable income at your marginal rate. If your employer matches contributions, that's an instant 50�100% return before any investment gains.",
              },
              {
                step: "03",
                title: "Compare single vs married filing",
                body: "Filing jointly gives wider brackets and a higher standard deduction. Use this calculator to model both statuses and see which produces the lower effective rate � especially useful in the year you get married.",
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

      {/* -- FAQ -------------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How much federal income tax do I pay on an $80,000 salary?",
                a: "On an $80,000 salary with no 401(k) contributions, you pay $12,653 in federal income tax using 2024 single-filer brackets (10%, 12%, and 22% on the relevant slices). FICA adds another $6,120, giving a combined effective rate of about 23.5%.",
              },
              {
                q: "What is FICA and how much do I pay?",
                a: "FICA covers Social Security (6.2% on wages up to $168,600) and Medicare (1.45% on all wages) � a combined 7.65% employee share. Your employer matches the same amount on top.",
              },
              {
                q: "Does a 401(k) contribution reduce my Social Security tax?",
                a: "No. Traditional 401(k) contributions reduce your federal income tax but not FICA. Social Security and Medicare are calculated on your gross wages before the 401(k) deduction.",
              },
              {
                q: "What is the difference between single and married filing status?",
                a: "Married filing jointly uses wider tax brackets. On the same total household income, a married couple typically pays less federal tax than two single filers. The calculator supports both status options.",
              },
              {
                q: "What is the difference between my marginal and effective tax rate?",
                a: "Your marginal rate is the rate on your top slice of income. Your effective rate is the average across all your income � always lower, because lower bands are taxed at lower rates. On an $80,000 salary, your marginal federal rate is 22% but your effective rate is around 15.8%.",
              },
              {
                q: "Why doesn't this calculator include state income tax?",
                a: "State income tax rates vary from 0% (Texas, Florida, Nevada) to over 13% (California) and require a separate calculation. This tool focuses on federal tax and FICA for a clean universal US estimate. For state-specific results, use the Take Home Pay Calculator.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold text-gray-800">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- DISCLAIMER ------------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Disclaimer</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            This calculator provides estimates based on 2024 US federal tax rates
            and is intended for general planning purposes only. It does not include
            state income tax, local taxes, itemised deductions, or other personal
            circumstances. Always verify with a qualified tax adviser before making
            financial decisions.
          </p>
        </div>
      </section>

      {/* -- RELATED ---------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">
            Related calculators
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Salary Breakdown Calculator (UK)",
                href: "/tools/salary-breakdown-calculator-uk",
                note: "UK salary � income tax, NI, and pension",
              },
              {
                label: "Take Home Pay Calculator",
                href: "/tools/take-home-pay-calculator",
                note: "US salary after federal + state tax",
              },
              {
                label: "Hourly to Salary Calculator",
                href: "/tools/hourly-to-salary-calculator",
                note: "Convert hourly rate to annual salary",
              },
            ].map(({ label, href, note }) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-emerald-700">{label}</p>
                <p className="mt-1 text-xs text-gray-400">{note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SimpleCalculatorShell>
  );
}
