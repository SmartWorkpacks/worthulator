import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import SalaryBreakdownCalculatorLoader from "../salary-breakdown-calculator/SalaryBreakdownCalculatorLoader";

export const metadata: Metadata = {
  title: "Salary Breakdown Calculator UK – Work Out Your Tax and Take-Home Pay Instantly",
  description:
    "Work out how much income tax and National Insurance you pay. Enter your salary and get instant results for PAYE deductions and take-home pay. UK version.",
  keywords: [
    "salary breakdown calculator UK",
    "UK salary after tax",
    "income tax calculator UK",
    "National Insurance calculator",
    "PAYE calculator",
    "take home pay UK",
    "how much tax do I pay UK",
    "net salary calculator UK",
  ],
  alternates: {
    canonical: "https://worthulator.com/tools/salary-breakdown-calculator-uk",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Salary Breakdown Calculator (UK)",
    description:
      "Calculate your UK income tax, National Insurance, and monthly take-home pay using real HMRC bands.",
    url: "https://worthulator.com/tools/salary-breakdown-calculator-uk",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much income tax do I pay in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You pay 20% on income between £12,570 and £50,270 (basic rate), 40% between £50,270 and £125,140 (higher rate), and 45% above £125,140 (additional rate). The first £12,570 is your personal allowance and is tax-free.",
        },
      },
      {
        "@type": "Question",
        name: "What is National Insurance and how much do I pay?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "National Insurance (NI) is a UK payroll levy separate from income tax. Employees pay 8% on earnings between £12,570 and £50,270, and 2% on earnings above £50,270 (2024/25 rates).",
        },
      },
      {
        "@type": "Question",
        name: "Does a pension contribution reduce my tax and NI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. UK pension contributions made via salary sacrifice reduce both income tax and National Insurance, because they are deducted before PAYE is calculated. Personal pension contributions paid from net pay only receive income tax relief.",
        },
      },
      {
        "@type": "Question",
        name: "What is the personal allowance trap at £100,000?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Between £100,000 and £125,140 your personal allowance is tapered away at £1 for every £2 of income. This creates an effective marginal tax rate of 60% on that band. Pension contributions can reduce income below £100,000 and avoid this trap entirely.",
        },
      },
      {
        "@type": "Question",
        name: "What is an effective tax rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your effective tax rate is the total tax paid (income tax + NI) divided by your gross salary. It is always lower than your marginal rate because lower bands of income are taxed at lower rates. A higher-rate taxpayer on £60,000 typically has an effective rate of around 27–28%.",
        },
      },
      {
        "@type": "Question",
        name: "Does this calculator include Scottish income tax?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Scotland has its own income tax rates and bands which differ from the rest of the UK. This calculator uses England, Wales, and Northern Ireland PAYE rates. Scottish taxpayers should use HMRC's own calculator for precise figures.",
        },
      },
    ],
  },
];

const statChips = (
  <>
    {[
      {
        stat: "£12,570",
        color: "text-emerald-600",
        label: "personal allowance — the amount you earn completely tax-free every year (2025/26)",
      },
      {
        stat: "28%",
        color: "text-blue-500",
        label: "combined basic-rate burden: 20% income tax + 8% National Insurance on most taxable income",
      },
      {
        stat: "60%",
        color: "text-rose-500",
        label: "effective marginal rate inside the £100k–£125,140 personal allowance taper trap",
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

export default function SalaryBreakdownCalculatorUKPage() {
  return (
    <main className="bg-white text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SimpleCalculatorHero
        eyebrowIcon="£"
        eyebrowText="United Kingdom · Tax"
        title="Salary Breakdown Calculator"
        description="See exactly where your UK salary goes — income tax, National Insurance, pension, and your real take-home pay."
        chips={[
          "UK PAYE tax brackets applied correctly",
          "Shows National Insurance separately",
          "Includes pension contribution impact",
        ]}
      >
        <SalaryBreakdownCalculatorLoader defaultRegion="UK" />
      </SimpleCalculatorHero>

      <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
        <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
          On a <strong>£50,000 UK salary</strong> you take home approximately{" "}
          <strong>£3,091/month</strong> after income tax and National Insurance
          — an effective rate of 21%.
        </p>
      </div>

      {/* STAT CHIPS */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl grid gap-3 sm:grid-cols-3">
          {statChips}
        </div>
      </section>
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How UK salary tax is calculated
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            The UK uses a progressive PAYE (Pay As You Earn) system — you pay a
            higher rate only on income above each threshold, not on your whole salary.
            The calculation has three stages:
          </p>
          <div className="mt-6 space-y-3">
            {[
              {
                step: "1",
                label: "Deduct pension contributions",
                value:
                  "Pension contributions reduce the income that both income tax and National Insurance are calculated on.",
              },
              {
                step: "2",
                label: "Apply income tax bands",
                value:
                  "Each slice of income is taxed at the rate for that band — 0% on the personal allowance, then 20%, 40%, or 45% on higher slices.",
              },
              {
                step: "3",
                label: "Add National Insurance",
                value:
                  "NI is calculated separately — 8% on earnings between £12,570 and £50,270, then 2% on anything above.",
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

      {/* ── UK TAX BANDS ─────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            UK income tax and National Insurance rates (2024/25)
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            These are the PAYE bands applied to employees in England, Wales, and
            Northern Ireland. Scotland has its own income tax rates.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Income Tax
              </p>
              <div className="space-y-2">
                {[
                  { band: "Personal Allowance", range: "£0 – £12,570",         rate: "0%" },
                  { band: "Basic Rate",          range: "£12,570 – £50,270",    rate: "20%" },
                  { band: "Higher Rate",         range: "£50,270 – £125,140",   rate: "40%" },
                  { band: "Additional Rate",     range: "Above £125,140",       rate: "45%" },
                ].map(({ band, range, rate }) => (
                  <div
                    key={band}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <div>
                      <span className="font-semibold text-gray-700">{band}</span>
                      <span className="ml-2 text-gray-400">{range}</span>
                    </div>
                    <span className="font-bold text-emerald-600">{rate}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                National Insurance (Class 1)
              </p>
              <div className="space-y-2">
                {[
                  { band: "Below primary threshold", range: "Under £12,570",    rate: "0%" },
                  { band: "Main rate",               range: "£12,570 – £50,270", rate: "8%" },
                  { band: "Above upper limit",       range: "Above £50,270",    rate: "2%" },
                ].map(({ band, range, rate }) => (
                  <div
                    key={band}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm"
                  >
                    <div>
                      <span className="font-semibold text-gray-700">{band}</span>
                      <span className="ml-2 text-gray-400">{range}</span>
                    </div>
                    <span className="font-bold text-emerald-600">{rate}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-400">
                The personal allowance tapers from £100,000 to £125,140,
                creating an effective 60% marginal rate on that band.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PENSION ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How pension contributions reduce your UK tax
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Contributing to a workplace pension via salary sacrifice reduces the income
            that both income tax and National Insurance are calculated on — so you
            save tax at your marginal rate on every pound you contribute.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                income: "£40,000",
                contrib: "£4,000/yr (10%)",
                saving: "~£1,120 saved",
                note: "20% income tax + 8% NI = 28% effective saving on that slice.",
              },
              {
                income: "£55,000",
                contrib: "£5,500/yr (10%)",
                saving: "~£2,310 saved",
                note: "40% income tax + 2% NI = 42% effective saving on the higher-rate slice.",
              },
              {
                income: "£105,000",
                contrib: "£5,000/yr",
                saving: "~£3,100 saved",
                note: "Bringing income below £100k restores part of the personal allowance — effective saving rate up to 62%.",
              },
            ].map(({ income, contrib, saving, note }) => (
              <div
                key={income}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-bold text-gray-700">{income} salary</p>
                <p className="mt-1 text-xs text-gray-400">{contrib}</p>
                <p className="mt-2 text-base font-bold text-emerald-600">{saving}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            The annual pension allowance in 2024/25 is £60,000 (or 100% of earnings,
            whichever is lower). The examples above assume salary sacrifice — if you
            contribute from net pay instead, you only receive income tax relief, not
            NI savings.
          </p>
        </div>
      </section>

      {/* ── PERSONAL ALLOWANCE TRAP ──────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            The £100,000 personal allowance trap
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            The UK personal allowance (£12,570) tapers away for income above
            £100,000 — at £1 for every £2 of extra income. This means:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Effective 60% marginal rate",
                body: "Between £100,000 and £125,140 you pay 40% income tax on your earnings plus lose the personal allowance at the same time. The combined effect is a 60% effective marginal rate on that band.",
              },
              {
                title: "How to avoid it",
                body: "Making pension contributions that bring your adjusted net income below £100,000 restores the full personal allowance. This is one of the most tax-efficient things a higher earner can do.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-bold text-gray-700">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT THIS MEANS ──────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">What this means for you</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Three things that change how UK tax actually works in practice.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "🎯",
                title: "You don’t pay 40% on your whole salary",
                body: "If you earn £55,000, only the £4,730 above £50,270 is taxed at 40%. Everything below that is taxed at 20% or 0%. Your effective rate is well below your marginal rate.",
              },
              {
                icon: "🔒",
                title: "NI is charged on top of income tax",
                body: "National Insurance is a separate payroll levy calculated independently. Most basic-rate earners pay 20% income tax + 8% NI on their taxable income — a combined 28% on that band, not just 20%.",
              },
              {
                icon: "⚠️",
                title: "The £100k trap is real",
                body: "Between £100,000 and £125,140 your personal allowance tapers away. For every £2 above £100k you lose £1 of allowance — creating an effective 60% marginal rate. Pension contributions can avoid this entirely.",
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

      {/* ── WHAT YOU CAN DO NEXT ─────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">What you can do next</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Practical steps to legally reduce your UK tax and National Insurance bill.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Check your tax code",
                body: "HMRC issues a tax code telling your employer how much to deduct. An incorrect code — common after a job change, benefits update, or P11D filing — can mean overpaying thousands. Check your payslip and verify via the HMRC Personal Tax Account.",
              },
              {
                step: "02",
                title: "Use salary sacrifice for your pension",
                body: "Salary sacrifice contributions reduce both income tax and National Insurance. At the basic rate you save 28p per pound sacrificed (vs 20p from a personal pension). At the higher rate, the combined saving is 42p per pound.",
              },
              {
                step: "03",
                title: "Avoid the £100k trap",
                body: "If your income is near or above £100,000, pension contributions that bring adjusted net income below that threshold restore your full personal allowance. The effective saving rate can exceed 60p per pound — the most tax-efficient move available to most UK earners.",
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

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How much income tax do I pay on a £50,000 salary?",
                a: "On a £50,000 salary you pay 20% on income between £12,570 and £50,000 — that's £7,486. You also pay 8% National Insurance on earnings between £12,570 and £50,270, which adds around £3,014. Combined effective rate is about 21%.",
              },
              {
                q: "What is National Insurance and how much do I pay?",
                a: "National Insurance (NI) is a UK payroll levy separate from income tax. Employees pay 8% on earnings between £12,570 and £50,270, and 2% above £50,270 (2024/25 rates).",
              },
              {
                q: "Does a pension contribution reduce National Insurance?",
                a: "Only via salary sacrifice. If your employer deducts pension contributions from your gross pay before payroll runs, both income tax and NI are reduced. If you contribute to a personal pension from net pay, you only get income tax relief.",
              },
              {
                q: "What is the difference between my marginal and effective tax rate?",
                a: "Your marginal rate is the rate on your top slice of income. Your effective rate is the average across all your income — always lower. A £60,000 earner pays 40% on income above £50,270 but their overall effective rate is typically 26–28%.",
              },
              {
                q: "What is the personal allowance trap at £100,000?",
                a: "Between £100,000 and £125,140 your personal allowance tapers to zero, creating a 60% effective marginal tax rate. Pension contributions to bring adjusted net income below £100,000 can fully avoid this.",
              },
              {
                q: "Why doesn't this calculator include Scottish income tax?",
                a: "Scotland has its own income tax rates with different bands. This calculator uses England, Wales, and Northern Ireland PAYE rates. Scottish taxpayers will get different results and should use HMRC's tax calculator.",
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

      {/* ── DISCLAIMER ───────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Disclaimer</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            This calculator provides estimates based on 2024/25 HMRC rates for England,
            Wales, and Northern Ireland. It does not account for Scottish income tax,
            student loan repayments, marriage allowance, employer benefits, or other
            personal tax circumstances. Always verify with a qualified tax adviser
            before making financial decisions.
          </p>
        </div>
      </section>

      {/* ── RELATED ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">
            Related calculators
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Salary Breakdown Calculator (US)",
                href: "/tools/salary-breakdown-calculator",
                note: "US salary — federal tax, FICA, and 401(k)",
              },
              {
                label: "Take Home Pay Calculator (UK)",
                href: "/tools/take-home-pay-calculator-uk",
                note: "UK salary with full PAYE breakdown",
              },
              {
                label: "Hourly to Salary Calculator (UK)",
                href: "/tools/hourly-to-salary-calculator-uk",
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

    </main>
  );
}
