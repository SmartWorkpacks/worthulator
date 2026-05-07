import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Worthulator",
  description:
    "The terms governing your use of Worthulator. Plain language, no surprises.",
  alternates: { canonical: "https://worthulator.com/terms" },
  robots: { index: true, follow: true },
};

const lastUpdated = "26 April 2026";

export default function TermsPage() {
  return (
    <main className="bg-[#fafaf9] text-gray-900">

      {/* HEADER */}
      <section className="border-b border-gray-100 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Legal</p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-gray-950">Terms of Service</h1>
          <p className="mt-3 text-sm text-gray-400">Last updated: {lastUpdated}</p>
          <p className="mt-5 text-base leading-relaxed text-gray-500">
            By using Worthulator, you agree to these terms. We&apos;ve written them to be
            readable. If something isn&apos;t clear, email{" "}
            <a href="mailto:hello@worthulator.com" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
              hello@worthulator.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-14">

          {/* 1 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">01 — The Platform</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">What Worthulator is</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                Worthulator provides online calculators and estimation tools for personal financial
                topics including salary, tax, overtime, investments, and spending habits. The Platform
                is operated for informational and educational purposes only.
              </p>
              <p>
                Access to the Platform is provided free of charge. We reserve the right to modify,
                restrict, or discontinue any part of it at any time without notice.
              </p>
            </div>
          </div>

          {/* 2 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">02 — Not financial advice</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Informational use only</h2>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-sm font-bold text-amber-900">Important</p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Nothing on Worthulator constitutes financial, tax, investment, or legal advice.
                All results are estimates based on the inputs you provide. They are not a substitute
                for advice from a qualified professional.
              </p>
            </div>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                Worthulator does not know your full financial situation. The calculations provided
                do not account for all variables that may affect your actual outcomes — including
                individual tax codes, employer policies, local regulations, and personal circumstances.
              </p>
              <p>
                Before making any significant financial decision, consult a licensed financial
                adviser, accountant, or tax professional.
              </p>
            </div>
          </div>

          {/* 3 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">03 — Accuracy</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Estimates, not guarantees</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                We work to keep our calculators accurate and up to date with current rates and
                legislation. However, tax rates, thresholds, and regulations change. Results shown
                may not reflect the most recent changes.
              </p>
              <p>
                We make no warranty — express or implied — that any result produced by the Platform
                is accurate, complete, current, or suitable for any particular purpose.
              </p>
            </div>
          </div>

          {/* 4 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">04 — Limitation of liability</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Our liability to you</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                To the fullest extent permitted by applicable law, Worthulator and its operators
                shall not be liable for any direct, indirect, incidental, consequential, or punitive
                damages arising from your use of the Platform or reliance on any result it produces.
              </p>
              <p>
                This includes, but is not limited to: financial loss, tax liability, missed
                opportunities, or decisions made based on calculator outputs.
              </p>
              <p>
                In jurisdictions that do not allow exclusion or limitation of certain liabilities,
                our liability is limited to the maximum extent permitted by law.
              </p>
            </div>
          </div>

          {/* 5 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">05 — Acceptable use</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">How you may use the Platform</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>You may use Worthulator for personal, informational, and non-commercial purposes. You may not:</p>
              <ul className="ml-5 list-disc space-y-2 text-sm">
                <li>Scrape, crawl, or extract data from the Platform in bulk without permission</li>
                <li>Attempt to reverse-engineer or copy Platform functionality for commercial use without permission</li>
                <li>Use the Platform in any way that interferes with its normal operation or the experience of other users</li>
                <li>Misrepresent outputs as official financial figures or professional advice</li>
              </ul>
            </div>
          </div>

          {/* 6 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">06 — Intellectual property</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Ownership</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                All content, design, code, and copy on Worthulator is owned by or licensed to
                Worthulator. All rights reserved. Nothing on the Platform grants you any licence
                to use our intellectual property beyond the ordinary use of the Platform itself.
              </p>
            </div>
          </div>

          {/* 7 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">07 — Third-party links</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">External links</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                The Platform may contain links to external websites. These are provided for
                convenience only. Worthulator has no control over and accepts no responsibility
                for the content, privacy practices, or accuracy of third-party sites.
              </p>
            </div>
          </div>

          {/* 8 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">08 — Data sharing &amp; service providers</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Sharing with third parties</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                Where you voluntarily submit information through a lead-generation form on the
                Platform, we may share that information with relevant service providers who
                may be able to assist with your enquiry. This will only occur where you have
                given explicit consent to such sharing at the point of submission.
              </p>
              <p>
                We do not sell your data. Any sharing is limited to the purpose for which you
                submitted your information. See our{" "}
                <a href="/privacy" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
                  Privacy Policy
                </a>{" "}
                for full details of how your data is handled.
              </p>
            </div>
          </div>

          {/* 9 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">09 — Your responsibility</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Verifying information independently</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                Results produced by the Platform are estimates only. You are responsible for
                verifying any information independently before acting on it. Worthulator
                cannot and does not account for your specific personal, financial, or legal
                circumstances.
              </p>
              <p>
                Before making any significant decision based on results shown on the Platform,
                always consult a qualified professional — such as a licensed financial adviser,
                accountant, solicitor, or tax professional.
              </p>
            </div>
          </div>

          {/* 10 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">10 — Changes</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Updates to these terms</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                We may update these terms at any time. The &ldquo;Last updated&rdquo; date at the
                top of this page will reflect any changes. Continued use of the Platform after an
                update constitutes acceptance of the revised terms.
              </p>
              <p>
                Questions about these terms?{" "}
                <a href="mailto:hello@worthulator.com" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
                  hello@worthulator.com
                </a>
              </p>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
