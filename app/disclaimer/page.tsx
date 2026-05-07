import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | Worthulator",
  description:
    "Worthulator provides estimates, not financial advice. Results are for informational purposes only. Always verify with a qualified professional.",
  alternates: { canonical: "https://worthulator.com/disclaimer" },
  robots: { index: true, follow: true },
};

const lastUpdated = "26 April 2026";

export default function DisclaimerPage() {
  return (
    <main className="bg-[#fafaf9] text-gray-900">

      {/* HEADER */}
      <section className="border-b border-gray-100 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Legal</p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-gray-950">Disclaimer</h1>
          <p className="mt-3 text-sm text-gray-400">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* MAIN DISCLAIMER BOX */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-8">

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-7">
            <p className="text-base font-bold text-amber-900">
              Worthulator provides estimates, not advice.
            </p>
            <p className="mt-3 text-sm leading-7 text-amber-800">
              Every number this platform produces is an <strong>estimate</strong> based on the inputs
              you provide and publicly available tax rates and benchmarks. Results are intended
              for informational and educational purposes only.
            </p>
            <p className="mt-3 text-sm leading-7 text-amber-800">
              Nothing on Worthulator constitutes financial, tax, investment, or legal advice.
              It is not a substitute for advice from a qualified professional who understands
              your specific circumstances.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">No guarantees</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Results may not reflect your actual situation</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                Calculations on this platform are simplified models. They do not account for
                every variable that affects real-world financial outcomes — including individual
                tax codes, employer-specific rules, benefit arrangements, pension contributions,
                student loan plans, and local or regional variations.
              </p>
              <p>
                Tax rates and thresholds change. While we work to keep our calculators current,
                we cannot guarantee that every figure reflects the most recent legislation or
                regulatory guidance.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Use at your own risk</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Your responsibility to verify</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                By using Worthulator, you accept full responsibility for how you interpret and
                act on the results it provides. Worthulator and its operators are not responsible
                for any financial loss, tax liability, or other consequences resulting from
                reliance on calculator outputs.
              </p>
              <p>
                Before making any significant financial, tax, or career decision, we strongly
                recommend consulting a licensed financial adviser, accountant, or solicitor
                who can assess your full situation.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Third-party information</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">External data sources</h2>
            <div className="mt-4 text-base leading-relaxed text-gray-500">
              <p>
                Some calculators reference publicly available data — such as government tax tables,
                national averages, or published benchmarks. Worthulator makes no warranty regarding
                the accuracy, completeness, or currency of this third-party information.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-bold text-gray-900">Questions about this disclaimer?</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Email us at{" "}
              <a href="mailto:hello@worthulator.com" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
                hello@worthulator.com
              </a>
              . You can also read our full{" "}
              <Link href="/terms" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="/privacy" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
