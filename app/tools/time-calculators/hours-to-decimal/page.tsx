import type { Metadata } from "next";
import Link from "next/link";
import HoursToDecimalLoader from "./HoursToDecimalLoader";

export const metadata: Metadata = {
  title: "Hours to Decimal Calculator (Convert Time Instantly)",
  description:
    "Convert hours and minutes into decimal hours instantly. Perfect for timesheets, payroll, and billing.",
  keywords: [
    "hours to decimal calculator",
    "hour to decimal calculator",
    "calculate hours to decimals",
    "decimal to hours calculator",
    "convert time to decimal",
    "timesheet decimal calculator",
    "minutes to decimal hours",
  ],
  alternates: {
    canonical: "https://worthulator.com/tools/time-calculators/hours-to-decimal",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Hours to Decimal Calculator",
    description:
      "Convert hours and minutes into decimal hours instantly for timesheets, payroll, and billing.",
    url: "https://worthulator.com/tools/time-calculators/hours-to-decimal",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is 45 minutes in decimal hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "45 minutes equals 0.75 decimal hours. To work this out: 45 ÷ 60 = 0.75. So 1 hour 45 minutes would be 1.75.",
        },
      },
      {
        "@type": "Question",
        name: "How do you convert time to decimal hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Divide the minutes by 60 and add the result to the hours. For example, 2 hours 30 minutes: 30 ÷ 60 = 0.5, so 2 + 0.5 = 2.5 decimal hours.",
        },
      },
      {
        "@type": "Question",
        name: "Why use decimal hours for payroll?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Payroll systems and billing software multiply hours worked by an hourly rate. Decimal hours make this multiplication straightforward — 1.5 hours × $20/hr = $30. Time in HH:MM format can't be multiplied directly.",
        },
      },
    ],
  },
];

export default function HoursToDecimalPage() {
  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-10 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gray-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">

          {/* Left — copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
              Time Tools &middot; Payroll &amp; Billing
            </p>
            <h1 className="mt-4 text-[clamp(2.4rem,5.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-gray-950">
              Hours to Decimal Calculator
              <span className="mt-1 block text-xl font-semibold text-gray-400">
                Convert hours and minutes into decimal hours in seconds.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-500">
              Enter your hours and minutes and instantly see the decimal equivalent —
              ready to drop into timesheets, invoices, and payroll software.
            </p>
            <p className="mt-3 text-xs text-gray-400">
              Results update live. No button required.
            </p>
          </div>

          {/* Right — dark preview card */}
          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                Example &middot; 7 hours 30 minutes
              </p>
              <p className="relative mt-3 text-6xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">
                7.50
              </p>
              <p className="relative mt-1 text-sm text-gray-500">decimal hours</p>
              <div className="mt-5">
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/8">
                  <div className="h-full bg-emerald-400" style={{ width: "93.75%" }} />
                  <div className="h-full flex-1 bg-emerald-400/30" />
                </div>
                <div className="mt-2.5 flex justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />7 whole hours
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400/40" />30 min = 0.50
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                30 &divide; 60 = 0.50 &mdash; add to 7 to get{" "}
                <span className="font-semibold text-white/70">7.50</span>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── STAT CHIPS + CALCULATOR ─────────────────────────── */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {[
              { stat: "÷ 60",   color: "text-emerald-600", label: "is all you need — divide minutes by 60 then add to your hours" },
              { stat: "0.75",   color: "text-blue-500",    label: "is 45 minutes in decimal — the most common billing conversion" },
              { stat: "2 secs", color: "text-gray-700",    label: "to get your answer — no maths, no spreadsheet formula" },
            ].map((item) => (
              <div key={item.stat} className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
                <p className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}>{item.stat}</p>
                <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>

          <HoursToDecimalLoader />

          <p className="mt-4 text-xs leading-5 text-gray-400">
            Decimal hours are rounded to 2 decimal places. Results update live as you type.
          </p>
        </div>
      </section>

      {/* ── INSIGHT STRIP ───────────────────────────────────── */}
      <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
        <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
          Most payroll software and invoicing tools expect decimal hours &mdash;{" "}
          <span className="font-semibold text-gray-800">enter 1.75, not 1:45</span>.
        </p>
      </div>

      {/* ── WHAT THIS MEANS FOR YOU ─────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">What this means for you</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            HH:MM looks readable but breaks the moment you need to do maths on it.
            Decimal hours fix that in one step.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "🧾",
                title: "Invoice accurately",
                body: "2h 20m billed at $120/hr. In HH:MM you can't multiply directly. In decimal: 2.33 × $120 = $279.60. Exact, every time.",
              },
              {
                icon: "💼",
                title: "Fill timesheets correctly",
                body: "Xero, QuickBooks, Harvest, and most HR platforms expect decimal input. 1 hour 45 minutes goes in as 1.75 — not 1:45.",
              },
              {
                icon: "📊",
                title: "Sum hours in spreadsheets",
                body: "Adding decimal hours is instant: 1.5 + 2.75 + 3.25 = 7.50. HH:MM requires custom formulas and still trips people up.",
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

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">How it works</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            One formula. Three steps. Done.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Enter your hours",
                body: "Type in the whole number of hours. 3 hours is simply 3.00 in decimal. Nothing to convert yet.",
              },
              {
                step: "2",
                title: "Enter your minutes",
                body: "Add the minutes (0–59). The calculator divides them by 60 instantly — 30 min becomes 0.50, 45 min becomes 0.75.",
              },
              {
                step: "3",
                title: "Read your decimal",
                body: "The two are added together and displayed. Copy it straight into your timesheet, invoice, or spreadsheet.",
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

      {/* ── WHAT YOU CAN DO NEXT ─────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">What you can do next</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Once you have your decimal hours, here&rsquo;s how to put them to use.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Calculate your pay",
                body: "Multiply decimal hours by your hourly rate. 2.75 hours at $80/hr = $220. Exact to the penny — no rounding arguments.",
              },
              {
                step: "02",
                title: "Add up your week",
                body: "Convert each day's time to decimal, then sum them. 1.5 + 2.75 + 3.25 + 4.0 + 6.5 = 18.00 hours for the week.",
              },
              {
                step: "03",
                title: "Check for overtime",
                body: "Compare your total decimal hours against your overtime threshold (typically 40h). The maths is instant when everything is in decimal.",
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

      {/* ── SEO CONTENT ─────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-10 text-gray-600">

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">How to convert hours and minutes to decimal</h2>
            <p className="mt-4 leading-[1.85]">
              Converting time to decimal is a single-step calculation: divide the minutes by 60 and add
              the result to the whole hours. For example, 3 hours 45 minutes becomes
              3 + (45 &divide; 60) = 3 + 0.75 = <strong>3.75</strong>.
            </p>
            <p className="mt-4 leading-[1.85]">
              The reason this matters is that most software — payroll platforms, invoicing tools, and
              spreadsheets — treats time as a regular number. You can&rsquo;t multiply 2:30 by a pay rate.
              But you can multiply 2.5 by anything. Decimal hours are the bridge between how we read
              clocks and how computers do maths.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Minutes to decimal — quick reference</h2>
            <p className="mt-4 leading-[1.85]">
              The four most common quarter-hour values come up constantly in billing and payroll. Memorise
              these and you&rsquo;ll rarely need a calculator:
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">Minutes</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700">Decimal</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">Calculation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[5,10,15,20,25,30,35,40,45,50,55,60].map((m) => (
                    <tr key={m} className="bg-white">
                      <td className="px-5 py-3 text-gray-600">{m} min</td>
                      <td className="px-5 py-3 font-bold text-emerald-700">{(m / 60).toFixed(2)}</td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-400 hidden sm:table-cell">
                        {m} &divide; 60 = {(m / 60).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Why decimal hours matter for freelancers and payroll</h2>
            <p className="mt-4 leading-[1.85]">
              If you bill by the hour, getting decimal conversion right directly affects your income.
              Rounding 2 hours 40 minutes to &ldquo;2.5&rdquo; instead of the correct 2.67 loses
              10 minutes of pay every time. At $100/hr, that&rsquo;s $16.67 per entry. Over a month of
              daily billing, that adds up quickly.
            </p>
            <p className="mt-4 leading-[1.85]">
              For payroll departments, the same logic applies in reverse. Overpaying by consistently
              rounding up minutes can add thousands to annual payroll costs for larger teams. Accurate
              decimal conversion — especially for overtime calculations where even a few minutes can tip
              someone into a higher pay band — protects both sides.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  q: "What is 45 minutes in decimal hours?",
                  a: "45 minutes is 0.75 decimal hours. Divide 45 by 60 to get 0.75. So 1 hour 45 minutes = 1.75, and 2 hours 45 minutes = 2.75.",
                },
                {
                  q: "How do you convert time to decimal hours?",
                  a: "Divide the minutes by 60 and add to the hours. For example: 3 hours 20 minutes → 20 ÷ 60 = 0.333 → 3 + 0.333 = 3.33 decimal hours.",
                },
                {
                  q: "Why use decimal hours for payroll?",
                  a: "Payroll systems multiply hours by an hourly rate to calculate pay. This only works with decimal numbers. 1h 30m can't be directly multiplied — 1.5 can. Most payroll software expects decimal input.",
                },
                {
                  q: "What is 30 minutes in decimal?",
                  a: "30 minutes = 0.50 decimal hours. 30 ÷ 60 = 0.5. So 2 hours 30 minutes = 2.50 decimal hours.",
                },
                {
                  q: "How many decimal hours is 15 minutes?",
                  a: "15 minutes = 0.25 decimal hours. 15 ÷ 60 = 0.25. Quarter-hour increments are very common in billing: 0.25, 0.50, 0.75, 1.00.",
                },
                {
                  q: "Can I convert decimal hours back to minutes?",
                  a: "Yes — multiply the decimal part by 60. For example: 2.75 hours → 0.75 × 60 = 45 minutes → 2 hours 45 minutes.",
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

      {/* ── DISCLAIMER ──────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm leading-relaxed text-gray-400">
            Results are rounded to 2 decimal places. For payroll or legal purposes,
            verify calculations with your employer or payroll provider.
          </p>
        </div>
      </section>

      {/* ── RELATED TOOLS ───────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-lg font-bold text-gray-900">Related Time Calculators</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Decimal to Hours",        href: "/tools/time-calculators/decimal-to-hours",     note: "Convert decimal back to HH:MM" },
              { label: "Timesheet Calculator",    href: "/tools/time-calculators/timesheet-calculator", note: "Total up a full week of hours" },
              { label: "Overtime Pay Calculator", href: "/tools/overtime-pay-calculator",                note: "Work out your overtime earnings" },
              { label: "Hourly to Salary",        href: "/tools/hourly-to-salary-calculator",           note: "Convert your hourly rate to annual" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                <p className="text-sm font-bold text-gray-900">{tool.label}</p>
                <p className="mt-1 text-xs text-gray-500">{tool.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
