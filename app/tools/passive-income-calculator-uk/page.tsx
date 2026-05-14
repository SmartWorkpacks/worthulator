import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import PassiveIncomeCalculatorLoader from "../passive-income-calculator/PassiveIncomeCalculatorLoader";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Passive Income Calculator UK – Work Out Your Investment Income Instantly",
  description:
    "Work out how much passive income your investments could generate in pounds. Enter your portfolio and return rate and get instant results for monthly income.",
  keywords: [
    "passive income calculator UK",
    "investment income calculator UK",
    "how much passive income can I generate UK",
    "4% rule calculator UK",
    "compound interest passive income UK",
    "financial independence UK",
    "dividend income calculator UK",
    "FIRE calculator UK",
  ],
  alternates: { canonical: "https://worthulator.com/tools/passive-income-calculator-uk" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Passive Income Calculator UK",
  description:
    "Calculate how much passive income your investments can generate in pounds based on compound growth, withdrawal rate, and inflation.",
  url: "https://worthulator.com/tools/passive-income-calculator-uk",
};

export default function PassiveIncomeCalculatorUKPage() {
  return (
    <main className="bg-white text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SimpleCalculatorHero
        eyebrowIcon="£"
        eyebrowText="United Kingdom · Finance Tools"
        title="Passive Income Calculator"
        description="See how much passive income your UK portfolio can generate in pounds — and how long it takes."
        chips={[
          "ISA, pension, and GIA compatible",
          "4% rule and compound growth projections",
          "Shows monthly and annual income in pounds",
        ]}
      >
        <PassiveIncomeCalculatorLoader currency="£" region="UK" />
        <div className="mt-6 flex justify-center">
          <RegionToggle
            current="uk"
            usPath="/tools/passive-income-calculator"
            ukPath="/tools/passive-income-calculator-uk"
            theme="light"
          />
        </div>
      </SimpleCalculatorHero>

      <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
        <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
          Starting with £10,000 and contributing £400/month at 7% for 20 years grows to{" "}
          <strong>£634,000</strong> — generating{" "}
          <strong>£2,113/month</strong> in passive income at the 4% rule.
        </p>
      </div>

      {/* ── UK-SPECIFIC CONTEXT ──────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Passive income planning in the UK
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            UK investors have access to tax-advantaged accounts that can significantly
            improve passive income outcomes over time. The most impactful are:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                name: "Stocks & Shares ISA",
                limit: "£20,000/year",
                note: "All gains and income within an ISA are completely free of UK tax — no capital gains tax, no dividend tax, and no income tax on withdrawals. The most powerful tax wrapper for long-term passive income building.",
              },
              {
                name: "Pension (SIPP / Workplace)",
                limit: "Up to 100% of earnings",
                note: "Contributions receive tax relief at your marginal rate — a 40% taxpayer effectively gets £100 of pension for £60 out of pocket. Accessible from age 57. Best for retirement-focused passive income.",
              },
              {
                name: "General Investment Account",
                limit: "No limit",
                note: "No contribution limit, but gains and income are taxable. The annual CGT allowance (£3,000 in 2026/27) allows some tax-free realisation each year. Use after maxing ISA and pension allowances.",
              },
            ].map(({ name, limit, note }) => (
              <div
                key={name}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-base font-bold text-gray-800">{name}</p>
                <p className="mt-1 text-xs font-semibold text-emerald-600">{limit}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            This calculator does not model the tax uplift from ISA or pension accounts.
            In practice, a £20,000/year ISA investor will accumulate significantly more
            than the pre-tax figures shown, because all returns compound without tax drag.
          </p>
        </div>
      </section>

      {/* ── DISCLAIMER ───────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Disclaimer</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            This calculator provides estimates only and does not constitute financial,
            investment, or tax advice. Past investment returns are not a guarantee of
            future performance. Tax rules, allowances, and rates may change. Always
            consult a qualified financial adviser before making investment decisions.
          </p>
        </div>
      </section>

      {/* ── RELATED ──────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Related calculators</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Passive Income Calculator (US)",
                href: "/tools/passive-income-calculator",
                note: "Same tool in dollars — US financial assumptions",
              },
              {
                label: "Hourly to Salary Calculator",
                href: "/tools/hourly-to-salary-calculator-uk",
                note: "Convert your hourly rate to an annual salary",
              },
              {
                label: "Take Home Pay Calculator",
                href: "/tools/take-home-pay-calculator-uk",
                note: "See your net salary after income tax and National Insurance",
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
