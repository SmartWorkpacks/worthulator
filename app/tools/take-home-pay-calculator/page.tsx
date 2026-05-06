import type { Metadata } from "next";
import RelatedTools from "@/components/RelatedTools";
import TakeHomePayCalculator from "./TakeHomePayCalculatorLoader";
import RegionToggle from "@/components/RegionToggle";

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
  alternates: { canonical: "https://www.worthulator.com/tools/take-home-pay-calculator" },
  robots: { index: true, follow: true },
};


export default function TakeHomePayPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Take Home Pay Calculator",
      description: "Calculate your take home pay after federal tax, state tax, Social Security, and Medicare.",
      url: "https://www.worthulator.com/tools/take-home-pay-calculator",
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

      {/* HERO — 2-column */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-24 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gray-100/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">

          {/* Left — copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
              United States · Income Tools
            </p>
            <h1 className="mt-4 text-[clamp(2.4rem,5.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-gray-950">
              Take Home Pay Calculator
              <span className="block mt-1 tracking-normal text-gray-400 font-semibold">See your net salary after federal tax, state tax, and Social Security.</span>
            </h1>
            <p className="mt-3 text-base font-medium text-gray-600">
              Enter your salary and see exactly how much you take home after tax instantly.
            </p>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-500">
              Enter your gross salary to see your net income after federal tax, state income tax, Social Security, and Medicare — broken down annually, monthly, and weekly.
            </p>
            <p className="mt-3 text-xs text-gray-400">
              For educational purposes only. Estimates are based on general tax assumptions and may not reflect your exact situation.
            </p>
            <RegionToggle
              current="us"
              usPath="/tools/take-home-pay-calculator"
              ukPath="/tools/take-home-pay-calculator-uk"
              theme="light"
            />
          </div>

          {/* Right — preview stat card */}
          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Example &middot; $50,000 salary</p>
              <p className="relative mt-3 text-5xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">$32,500</p>
              <p className="relative mt-1 text-sm text-gray-500">estimated take-home per year</p>
              <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-white/8">
                <div className="h-full bg-emerald-400" style={{ width: "65%" }} />
                <div className="h-full bg-red-400" style={{ width: "20%" }} />
                <div className="h-full flex-1 bg-orange-300" />
              </div>
              <div className="mt-3 flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" />Take-home</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" />Tax</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-300" />Deductions</span>
              </div>
              <p className="mt-5 text-xs text-gray-500">65% of gross &mdash; adjust the sliders below to see yours</p>
            </div>
          </div>

        </div>
      </section>

      {/* CALCULATOR */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {[
              { stat: "60–70%",     color: "text-emerald-600", label: "is what most people actually take home from their salary" },
              { stat: "$4,000+",    color: "text-red-500",     label: "lost to federal and state taxes on an average US salary every year" },
              { stat: "25 secs",    color: "text-blue-500",    label: "to see your exact breakdown with this tool"               },
            ].map((item) => (
              <div key={item.stat} className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
                <p className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}>{item.stat}</p>
                <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
          <TakeHomePayCalculator initialCountry="US" />
          <p className="mt-4 text-xs leading-5 text-gray-400">
            This estimate is based on general federal and state tax rules and does not account for all deductions, credits, or personal circumstances. It is not financial or tax advice.
          </p>
        </div>
      </section>

      {/* INSIGHT STRIP */}
      <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
        <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
          Most people take home between{" "}
          <span className="font-semibold text-gray-800">60–70% of their salary</span>{" "}
          depending on their tax rate and deductions. See exactly where yours sits.
        </p>
      </div>

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

      {/* SEO CONTENT */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-10 text-gray-600">

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">How is take home pay calculated in the US?</h2>
            <p className="mt-4 leading-[1.85]">
              Your take home pay — sometimes called your after-tax salary or net income — is what lands in your bank account after your employer has deducted federal income tax, state income tax (where applicable), and payroll taxes. Understanding how each piece works makes it easier to plan your finances around what you actually earn.
            </p>
            <p className="mt-4 leading-[1.85]">
              Federal income tax is calculated on your taxable income using a progressive bracket system — only the portion of your salary within each bracket is taxed at that bracket&apos;s rate. On top of that, FICA contributions cover Social Security (6.2% up to an annual wage base of $168,600) and Medicare (1.45% on all earnings). If your state has an income tax, that is calculated separately and added to your total deductions.
            </p>
            <p className="mt-4 leading-[1.85]">
              For most workers earning $40,000–$80,000 in a moderate-tax state, take-home tends to work out to roughly 60–68% of gross income. Adjust for your state and filing status above to see where you land.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Federal tax brackets explained (2026)</h2>
            <p className="mt-4 leading-[1.85]">
              The US uses a marginal tax rate system. You do not pay the highest rate on your entire income — only on the portion that falls within each bracket:
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">Taxable income (single filer)</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {([
                    ["Up to $11,600",       "10%"],
                    ["$11,601 – $47,150",   "12%"],
                    ["$47,151 – $100,525",  "22%"],
                    ["$100,526 – $191,950", "24%"],
                    ["$191,951 – $243,725", "32%"],
                    ["$243,726 – $609,350", "35%"],
                    ["Over $609,350",       "37%"],
                  ] as [string, string][]).map(([range, rate]) => (
                    <tr key={range} className="bg-white">
                      <td className="px-5 py-3 text-gray-600">{range}</td>
                      <td className="px-5 py-3 font-semibold text-emerald-700">{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 leading-[1.85]">
              Married couples filing jointly have wider brackets — roughly double the thresholds for the 10% through 22% bands — which often results in a meaningfully higher take-home compared to two single filers at the same combined income.
            </p>
            <p className="mt-4 leading-[1.85]">
              Payroll taxes add another layer: Social Security at 6.2% on earnings up to $168,600 and Medicare at 1.45% with no ceiling. Together these represent an additional 7.65% on most earned income.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">How state taxes affect your take-home pay</h2>
            <p className="mt-4 leading-[1.85]">
              State income tax can have a surprisingly large effect on your net income. Nine states — Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming — charge no income tax on wages at all. In those states, your take-home is determined almost entirely by your federal bracket and FICA obligations.
            </p>
            <p className="mt-4 leading-[1.85]">
              At the other end, states like California (up to 13.3%), New Jersey (up to 10.75%), and New York (up to 10.9%) add a significant deduction on top of federal obligations. On a $100,000 salary, the difference between a no-tax state and California can amount to $8,000–$10,000 in annual take-home — roughly one month&apos;s salary.
            </p>
            <p className="mt-4 leading-[1.85]">
              Most states sit somewhere in the middle, charging between 3% and 6%. Select your state in the calculator above to see exactly how the combined federal and state rate affects your situation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Example take-home salaries in the US</h2>
            <p className="mt-4 leading-[1.85]">
              Someone earning around $50,000 in a moderate-tax state (roughly 5% state income tax) will typically take home somewhere between $33,000 and $35,000 per year — around 66–70% of their gross. The exact figure depends on their federal bracket, filing status, and whether they have pre-tax deductions like 401(k) contributions.
            </p>
            <p className="mt-4 leading-[1.85]">
              Higher incomes see a somewhat lower take-home percentage. Someone earning $75,000 might keep around 63–65% after all deductions, while a $100,000 earner typically takes home somewhere in the 60–63% range as more income falls into the 22–24% federal brackets. The US progressive system means only earnings above each threshold are taxed at the higher rate — but the gap between gross and net does widen noticeably at higher salary levels.
            </p>
            <p className="mt-4 leading-[1.85]">
              In a no-income-tax state like Texas or Florida, these percentages are typically 4–7 points higher. In a high-tax state like California or New York, they can be 5–8 points lower. Select your state in the calculator to see a figure that reflects where you actually live.
            </p>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  q: "How much tax do I pay in the US?",
                  a: "Federal income tax ranges from 10% to 37% depending on your income and filing status. Social Security takes 6.2% (up to $168,600) and Medicare takes 1.45%. State income tax varies from 0% in states like Texas and Florida to over 13% in California.",
                },
                {
                  q: "What is the difference between gross and net pay?",
                  a: "Gross pay is your salary before any deductions — the figure your employer agrees to pay you. Net pay (take-home pay) is what actually arrives in your bank account after federal tax, state income tax, Social Security, and Medicare. For most people, net pay is 60–70% of gross.",
                },
                {
                  q: "Does this calculator include state taxes?",
                  a: "Yes — select your state and the estimated state income tax rate for that state is included in the breakdown. State rates range from 0% (Texas, Florida, etc.) to over 13% (California), so this can make a meaningful difference to your estimated take-home.",
                },
                {
                  q: "Why might my paycheck differ from this estimate?",
                  a: "This tool uses general tax assumptions. Real paychecks reflect your W-4 withholding elections, 401(k) or HSA contributions, employer health insurance premiums, local city taxes, and other employer-specific deductions. Use this for a ballpark figure, not for exact payroll planning.",
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold tracking-tight text-gray-900">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

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
