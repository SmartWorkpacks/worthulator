import type { Metadata } from "next";
import Link from "next/link";
import OvertimePayCalculator from "./OvertimePayCalculatorLoader";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Overtime Pay Calculator – Work Out Your Overtime Earnings Instantly",
  description:
    "Work out how much you earn in overtime. Enter your rate and hours and get instant results for time and a half, double time, and total weekly pay.",
  alternates: { canonical: "https://www.worthulator.com/tools/overtime-pay-calculator" },
  robots: { index: true, follow: true },
};

const relatedTools = [
  {
    slug: "hourly-to-salary-calculator",
    name: "Hourly to Salary Calculator",
    desc: "Convert your hourly rate into an estimated annual salary.",
    anchor: "Convert hourly to annual salary →",
    emoji: "💼",
  },
  {
    slug: "take-home-pay-calculator",
    name: "Take Home Pay Calculator",
    desc: "See your net income after tax and deductions.",
    anchor: "Calculate your take-home pay →",
    emoji: "💰",
  },
  {
    slug: "budget-planner",
    name: "Budget Planner",
    desc: "Plan where your overtime earnings actually go each month.",
    anchor: "Plan your budget →",
    emoji: "📋",
  },
];

export default function OvertimePayCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Overtime Pay Calculator",
      description:
        "Calculate overtime pay, including time and a half and double time. See your weekly, monthly, and annual earnings instantly.",
      url: "https://www.worthulator.com/tools/overtime-pay-calculator",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How is overtime pay calculated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Multiply regular hours (up to 40) by your hourly rate, then add overtime hours multiplied by your rate and the overtime multiplier (typically 1.5×).",
          },
        },
        {
          "@type": "Question",
          name: "What is time and a half?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Time and a half means you earn 1.5 times your normal hourly rate for every overtime hour. It is the minimum overtime rate required by US federal law under the Fair Labor Standards Act for eligible hourly workers.",
          },
        },
        {
          "@type": "Question",
          name: "What is double time?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Double time (2×) means you earn twice your regular hourly rate for those hours. It is not federally mandated but is offered by some employers for holidays, extended shifts, or in California for hours worked beyond 12 in a single day.",
          },
        },
      ],
    },
  ];

  return (
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
              United States · Income Tools
            </p>
            <h1 className="mt-4 text-[clamp(2.4rem,5.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-gray-950">
              Overtime Pay Calculator
              <span className="mt-1 block tracking-normal font-semibold text-gray-400">
                Time and a half, double time, and enhanced rates.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-gray-500">
              Enter your hourly rate and total hours worked to see your overtime pay — weekly, monthly, and annually. Supports time-and-a-half, double time, and custom multipliers.
            </p>
            <RegionToggle
              current="us"
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
                Example &middot; $25/hr · 45h week
              </p>
              <p className="relative mt-3 text-5xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">
                $1,187
              </p>
              <p className="relative mt-1 text-sm text-gray-500">estimated weekly pay incl. overtime</p>
              <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-white/8">
                <div className="h-full bg-emerald-400" style={{ width: "84%" }} />
                <div className="h-full flex-1 bg-amber-400" />
              </div>
              <div className="mt-3 flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />Regular
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />Overtime
                </span>
              </div>
              <p className="mt-5 text-xs text-gray-500">
                5 overtime hours adds $187 &mdash; adjust below to see yours
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
              { stat: "1.5×",     color: "text-emerald-600", label: "is the standard overtime rate — time and a half for every hour over 40" },
              { stat: "40h",      color: "text-amber-500",   label: "is when overtime kicks in under the US Fair Labor Standards Act (FLSA)"  },
              { stat: "20%+",     color: "text-blue-500",    label: "increase in weekly pay possible just by working 8 hours of overtime"      },
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
          <span className="font-semibold text-gray-800">thousands of dollars</span> to your annual
          income. See exactly how much with this tool.
        </p>
      </div>

      {/* WHAT THIS MEANS */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            What this means for you
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Overtime can significantly change your take-home earnings. Understanding how it
            compounds helps you plan your income more accurately.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "⏱",
                title: "The 40-hour threshold",
                body: "Under the FLSA, most US hourly workers must be paid at least 1.5× their regular rate for every hour worked beyond 40 in a workweek.",
              },
              {
                icon: "📈",
                title: "Time and a half vs double",
                body: "Time and a half (1.5×) is the legal minimum for overtime in the US. Some employers offer double time (2×) for holidays or extended shifts.",
              },
              {
                icon: "💡",
                title: "Small hours, big impact",
                body: "5 hours of overtime per week at $25/hr adds over $9,750 annually compared to a straight 40-hour week. The compounding effect is significant.",
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
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Enter your hourly rate",
                body: "Type in your base hourly wage before any overtime premium.",
              },
              {
                step: "2",
                title: "Set your weekly hours",
                body: "Enter total hours worked, including overtime. Overtime auto-detects once you exceed 40 hours.",
              },
              {
                step: "3",
                title: "Choose your multiplier",
                body: "Select 1.5× (time and a half), 2× (double time), or enter a custom rate if your employer uses a different arrangement.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                  {item.step}
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-8 text-gray-600">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">What is overtime pay?</h2>
            <p className="mt-4 leading-[1.85] text-gray-600">
              Overtime pay is the additional compensation paid to an employee for hours worked
              beyond a standard threshold — typically 40 hours per week in the US. Under the Fair
              Labor Standards Act (FLSA), eligible employees must receive at least 1.5 times their
              regular hourly rate for those extra hours.
            </p>
            <p className="mt-4 leading-7">
              Not all workers are entitled to overtime. Salaried employees classified as
              &quot;exempt&quot; under FLSA rules may not qualify. Rules also differ by state and
              employer, so it&apos;s worth checking your specific situation.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Time and a half vs double time
            </h2>
            <p className="mt-4 leading-7">
              <strong className="font-semibold text-gray-800">Time and a half (1.5×)</strong> is
              the federally mandated minimum overtime rate for most US hourly workers. If you earn
              $20/hr, your time and a half rate is $30/hr for every overtime hour worked.
            </p>
            <p className="mt-4 leading-7">
              <strong className="font-semibold text-gray-800">Double time (2×)</strong> is not
              required by federal law but is offered by some employers — particularly for holidays,
              extended shifts, or California seventh-day overtime. At $20/hr, double time pays $40/hr.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              How is overtime calculated?
            </h2>
            <p className="mt-4 leading-7">
              The overtime pay formula is straightforward: regular hours (up to 40) multiplied by
              your hourly rate, plus overtime hours multiplied by your hourly rate and the overtime
              multiplier. Written out: <em>Overtime Pay = Overtime Hours × Hourly Rate × Multiplier</em>.
              This overtime hours calculator applies that formula instantly.
            </p>
            <p className="mt-4 leading-7">
              Weekly, monthly, and annual figures are projected from your weekly totals — useful for
              budgeting or comparing job offers that include different amounts of expected overtime.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Overtime pay formula
            </h2>
            <p className="mt-4 leading-7">
              Overtime pay is typically calculated using a standard overtime pay formula where hours
              worked beyond 40 are multiplied by a higher rate, such as time and a half (1.5×) or
              double time (2×). For example, at $25/hr with 5 overtime hours at 1.5×:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm leading-7 text-gray-600">
              <li>Regular pay: 40h × $25 = <strong className="text-gray-800">$1,000</strong></li>
              <li>Overtime pay: 5h × $25 × 1.5 = <strong className="text-gray-800">$187.50</strong></li>
              <li>Total weekly pay: <strong className="text-gray-800">$1,187.50</strong></li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Important
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Overtime rules vary by country, state, and employer. This calculator provides estimates
              only and does not account for taxes or employer-specific policies. Consult your employer
              or an employment lawyer for accurate figures.
            </p>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Frequently asked questions</h2>
            <div className="mt-6 space-y-5">
              {[
                {
                  q: "How is overtime pay calculated?",
                  a: "Use the overtime pay formula: multiply regular hours (up to 40) by your hourly rate, then add overtime hours multiplied by your rate and the overtime multiplier (typically 1.5×). This overtime calculator does it instantly as you adjust the sliders.",
                },
                {
                  q: "What is time and a half?",
                  a: "Time and a half means you earn 1.5 times your normal hourly rate for every overtime hour. It\u2019s the minimum overtime rate required by US federal law under the Fair Labor Standards Act for eligible hourly workers.",
                },
                {
                  q: "What is double time?",
                  a: "Double time (2×) means you earn twice your regular hourly rate for those hours. It\u2019s not federally mandated but is offered by some employers for holidays, extended shifts, or \u2014 in California \u2014 hours worked beyond 12 in a single day.",
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold tracking-tight text-gray-900">{item.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-500">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED TOOLS */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Related tools</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-2xl">{tool.emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-gray-900 group-hover:text-emerald-700">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-gray-500">{tool.desc}</p>
                </div>
                <span className="mt-auto text-xs font-semibold text-gray-400 transition-colors group-hover:text-emerald-600">
                  {tool.anchor}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
