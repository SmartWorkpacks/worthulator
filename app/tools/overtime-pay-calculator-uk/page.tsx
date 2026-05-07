import type { Metadata } from "next";
import Link from "next/link";
import OvertimePayCalculator from "../overtime-pay-calculator/OvertimePayCalculatorLoader";
import LocaleSetter from "@/components/LocaleSetter";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Overtime Pay Calculator UK – Work Out Your Overtime Earnings Instantly",
  description:
    "Work out how much you earn in overtime in pounds. Enter your rate and hours and get instant results for enhanced rates and total weekly pay. UK calculator.",
  keywords: [
    "overtime pay calculator UK",
    "time and a half calculator UK",
    "overtime calculator UK pounds",
    "UK overtime pay",
    "overtime rate calculator England",
  ],
  alternates: { canonical: "https://worthulator.com/tools/overtime-pay-calculator-uk" },
  robots: { index: true, follow: true },
};

const relatedTools = [
  {
    slug: "hourly-to-salary-calculator-uk",
    name: "Hourly to Salary Calculator UK",
    desc: "Convert your hourly rate into an estimated annual salary in GBP.",
    anchor: "Convert hourly to annual salary ?",
    emoji: "??",
  },
  {
    slug: "take-home-pay-calculator",
    name: "Take Home Pay Calculator",
    desc: "See your net income after UK tax, NI, and deductions.",
    anchor: "Calculate your take-home pay ?",
    emoji: "??",
  },
  {
    slug: "budget-planner",
    name: "Budget Planner",
    desc: "Plan where your overtime earnings actually go each month.",
    anchor: "Plan your budget ?",
    emoji: "??",
  },
];

export default function OvertimePayCalculatorUKPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Overtime Pay Calculator UK",
      description:
        "Calculate overtime pay in GBP for UK workers. See weekly, monthly, and annual earnings including enhanced rates.",
      url: "https://worthulator.com/tools/overtime-pay-calculator-uk",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do UK employers have to pay overtime?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. There is no legal minimum overtime rate in the UK. Employers must ensure total pay does not fall below the National Minimum Wage, but any premium above that is a contractual matter.",
          },
        },
        {
          "@type": "Question",
          name: "What is time and a half in the UK?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Time and a half means you are paid 1.5× your normal hourly rate for overtime hours. For example, if your standard rate is £14/hr, time and a half is £21/hr.",
          },
        },
        {
          "@type": "Question",
          name: "Does working overtime affect my holiday pay in the UK?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Possibly. Following UK employment tribunal rulings, regular and consistent voluntary overtime may need to be factored into holiday pay calculations.",
          },
        },
        {
          "@type": "Question",
          name: "Is overtime pay taxable in the UK?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Overtime pay is treated the same as regular pay under PAYE and is subject to income tax and National Insurance contributions.",
          },
        },
        {
          "@type": "Question",
          name: "What is the maximum number of hours I can work per week in the UK?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Under the Working Time Regulations 1998, workers cannot be required to work more than an average of 48 hours per week unless they sign a written opt-out agreement.",
          },
        },
      ],
    },
  ];

  return (
    <>
      {/* Forces locale to UK so the calculator displays £ */}
      <LocaleSetter locale="UK" />

      <main className="bg-white text-gray-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

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
                Overtime Pay Calculator
                <span className="mt-1 block tracking-normal font-semibold text-gray-400">
                  Time and a half, enhanced rates, and double time — in pounds.
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-gray-500">
                Enter your hourly rate and total hours worked to see exactly how much your overtime
                earns — weekly, monthly, and annually — in GBP.
              </p>

              <RegionToggle
                current="uk"
                usPath="/tools/overtime-pay-calculator"
                ukPath="/tools/overtime-pay-calculator-uk"
                theme="light"
              />
            </div>

            {/* Right — preview stat card */}
            <div className="hidden lg:block">
              <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
                <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Example &middot; £15/hr &middot; 42h week
                </p>
                <p className="relative mt-3 text-5xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">
                  £607
                </p>
                <p className="relative mt-1 text-sm text-gray-500">
                  estimated weekly pay incl. overtime
                </p>
                <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-white/8">
                  <div className="h-full bg-emerald-400" style={{ width: "90%" }} />
                  <div className="h-full flex-1 bg-amber-400" />
                </div>
                <div className="mt-3 flex gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Regular
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Overtime
                  </span>
                </div>
                <p className="mt-5 text-xs text-gray-500">
                  2 overtime hours adds £45 — adjust below to see yours
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
                  stat: "1.5×",
                  color: "text-emerald-600",
                  label:
                    "is the common overtime rate in the UK, though there is no statutory minimum for overtime pay above NMW",
                },
                {
                  stat: "37.5h",
                  color: "text-amber-500",
                  label:
                    "is the UK standard full-time working week — overtime typically starts beyond your contracted hours",
                },
                {
                  stat: "20%+",
                  color: "text-blue-500",
                  label:
                    "increase in weekly pay possible just by working a few extra hours each week",
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
            <OvertimePayCalculator />
          </div>
        </section>

        {/* INSIGHT STRIP */}
        <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
          <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
            Even a few hours of overtime each week can add{" "}
            <span className="font-semibold text-gray-800">thousands of pounds</span> to your annual
            income. See exactly how much with this tool.
          </p>
        </div>

        {/* WHAT THIS MEANS */}
        <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              What this means for UK workers
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
              Unlike the US, the UK has no statutory minimum overtime rate. Employers must pay at
              least the National Minimum Wage for all hours worked, but overtime rates (time and a
              half, double time) are set by your employment contract.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: "?",
                  title: "When does overtime start?",
                  body: "Overtime in the UK starts when you work beyond your contracted hours — usually 37.5 or 40 hours/week. Check your contract for your specific threshold.",
                },
                {
                  icon: "??",
                  title: "What rate will you be paid?",
                  body: "Many UK employers pay 1.5× for weekday overtime and 2× for Sunday or Bank Holiday working, but this is not required by law — it depends on your contract.",
                },
                {
                  icon: "??",
                  title: "Small hours, big impact",
                  body: "At £15/hr with 1.5× overtime, working 5 extra hours each week adds over £5,850 gross per year. Use this calculator to see your exact figure.",
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

        {/* HOW IT WORKS */}
        <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">How it works</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Enter your hourly rate",
                  body: "Type in your base hourly wage before any overtime premium — this is the rate shown on your payslip or contract.",
                },
                {
                  step: "2",
                  title: "Set your weekly hours",
                  body: "Enter the total hours you worked that week, including overtime. The calculator automatically separates regular from overtime hours based on your contracted threshold.",
                },
                {
                  step: "3",
                  title: "Choose your multiplier",
                  body: "Select 1.5× (time and a half), 2× (double time), or enter a custom rate if your employer uses a flat enhanced rate or a different contractual arrangement.",
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

        {/* WHAT YOU CAN DO NEXT */}
        <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">What you can do next</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
              Once you know your overtime figure, here are the most valuable steps to take.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Check what your contract says",
                  body: "There is no legal overtime rate in the UK — your rate is entirely set by your contract. Review your employment contract or employee handbook to confirm exactly what rate applies and when overtime is triggered.",
                },
                {
                  step: "02",
                  title: "Factor in tax and NI",
                  body: "Overtime pay is taxed the same as regular pay under PAYE. Use the Take Home Pay Calculator to see exactly how much of your overtime you actually keep after income tax and National Insurance.",
                },
                {
                  step: "03",
                  title: "Understand how it affects holiday pay",
                  body: "If your overtime is regular and consistent, UK employment law may require your employer to include it in your holiday pay calculation. If you believe this applies to you, raise it with HR.",
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

        {/* SEO CONTENT */}
        <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl space-y-8 text-gray-600">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                How does overtime pay work in the UK?
              </h2>
              <p className="mt-4 leading-[1.85] text-gray-600">
                In the UK, overtime pay is governed by your employment contract rather than
                statutory law. There is no legal requirement to pay a premium rate for overtime —
                as long as your total pay for all hours worked doesn&apos;t fall below the National
                Minimum Wage or National Living Wage.
              </p>
              <p className="mt-4 leading-7">
                Most employers that do offer overtime pay use a rate of 1.5× (time and a half) for
                standard overtime and 2× (double time) for Sundays, Bank Holidays, or very long
                shifts. Some use a flat enhanced rate instead. Always check your contract or
                employee handbook for the exact terms that apply to you.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                Does overtime count towards pension and holiday pay in the UK?
              </h2>
              <p className="mt-4 leading-[1.85] text-gray-600">
                Following changes to UK employment law, regular voluntary overtime may need to be
                included when calculating holiday pay. The rules depend on whether overtime is
                contractual or truly voluntary, and how regular it is. For pension auto-enrolment,
                overtime pay may or may not be included in &quot;qualifying earnings&quot; depending
                on your scheme rules.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                Overtime and tax in the UK
              </h2>
              <p className="mt-4 leading-[1.85] text-gray-600">
                Overtime pay is subject to the same income tax and National Insurance contributions
                as your regular pay. If extra overtime pushes you into a higher tax band in a
                particular month, you may pay more tax on those earnings — though this typically
                evens out across the tax year under PAYE. This calculator shows gross figures only.
              </p>
            </div>

            {/* WORKED EXAMPLE */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                Worked example: 42-hour week at £15/hr
              </h2>
              <p className="mt-4 leading-7">
                Say your contracted hours are 40/week, your hourly rate is £15, and your employer
                pays 1.5× for overtime. Here is how your weekly pay breaks down:
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 text-left font-semibold text-gray-700">Component</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-700">Calculation</th>
                      <th className="px-5 py-3 text-right font-semibold text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-5 py-3 text-gray-600">Regular pay (40h)</td>
                      <td className="px-5 py-3 text-gray-500">40 × £15.00</td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-800">£600.00</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 text-gray-600">Overtime pay (2h × 1.5×)</td>
                      <td className="px-5 py-3 text-gray-500">2 × £22.50</td>
                      <td className="px-5 py-3 text-right font-semibold text-emerald-600">£45.00</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-5 py-3 font-semibold text-gray-800">Total weekly (gross)</td>
                      <td className="px-5 py-3 text-gray-500"></td>
                      <td className="px-5 py-3 text-right text-lg font-bold text-gray-950">£645.00</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 text-gray-600">Annual projection</td>
                      <td className="px-5 py-3 text-gray-500">£645 × 52</td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-800">£33,540</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-gray-400">Figures are gross. Use the Take Home Pay Calculator to see the net amount after PAYE and National Insurance.</p>
            </div>

            {/* NMW REFERENCE */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                National Minimum Wage &amp; National Living Wage 2025/26
              </h2>
              <p className="mt-4 leading-7">
                Regardless of what overtime rate your contract sets, your total pay across all
                hours worked must never fall below the applicable NMW/NLW rate. Here are the
                current rates:
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 text-left font-semibold text-gray-700">Age group</th>
                      <th className="px-5 py-3 text-right font-semibold text-gray-700">Hourly rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { group: "21 and over (National Living Wage)", rate: "£12.21" },
                      { group: "18–20", rate: "£10.00" },
                      { group: "Under 18", rate: "£7.55" },
                      { group: "Apprentice", rate: "£7.55" },
                    ].map((row) => (
                      <tr key={row.group}>
                        <td className="px-5 py-3 text-gray-600">{row.group}</td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-800">{row.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-gray-400">Rates effective April 2025. Check gov.uk for the latest figures.</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Important</p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                This calculator provides gross estimates only and does not account for income tax,
                National Insurance, pension contributions, or employer-specific policies. Consult
                your employer or an employment adviser for figures specific to your situation.
              </p>
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
                  q: "Do UK employers have to pay overtime?",
                  a: "No — there is no legal minimum overtime rate in the UK. Employers must ensure total pay across all hours worked does not fall below the National Minimum Wage, but any premium for overtime hours above that is a contractual matter. Always check your employment contract or employee handbook.",
                },
                {
                  q: "What is time and a half in the UK?",
                  a: "Time and a half means you are paid 1.5× your normal hourly rate for overtime hours. For example, if your standard rate is £14/hr, time and a half is £21/hr. Some employers use double time (2×) for Sundays, Bank Holidays, or extended overnight shifts.",
                },
                {
                  q: "Does working overtime affect my holiday pay in the UK?",
                  a: "Possibly. Following UK employment tribunal rulings, regular and consistent voluntary overtime may need to be factored into holiday pay calculations. If you regularly work overtime, you may be entitled to holiday pay that reflects your typical earnings, not just your contracted hours.",
                },
                {
                  q: "Is overtime pay taxable in the UK?",
                  a: "Yes. Overtime pay is treated the same as regular pay under PAYE. It is subject to income tax and National Insurance contributions. If your overtime pushes you over a tax band threshold in a given month, you may pay a higher rate on the excess, but this usually self-corrects over the tax year.",
                },
                {
                  q: "What is the maximum number of hours I can work per week in the UK?",
                  a: "Under the Working Time Regulations 1998, workers cannot be required to work more than an average of 48 hours per week (averaged over 17 weeks) unless they sign a written opt-out agreement. There is no legal limit on hours for those who opt out, but employers must still protect workers\u2019 health and safety.",
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

        {/* RELATED TOOLS */}
        <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-xl font-bold tracking-tight text-gray-950">Related tools</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="text-2xl">{tool.emoji}</span>
                  <h3 className="mt-3 text-sm font-bold text-gray-900">{tool.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{tool.desc}</p>
                  <p className="mt-3 text-xs font-semibold text-emerald-600 transition-colors group-hover:text-emerald-500">
                    {tool.anchor}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
