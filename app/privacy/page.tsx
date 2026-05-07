import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Worthulator",
  description:
    "How Worthulator collects, uses, and protects your data. We keep it simple.",
  alternates: { canonical: "https://worthulator.com/privacy" },
  robots: { index: true, follow: true },
};

const lastUpdated = "26 April 2026";

export default function PrivacyPage() {
  return (
    <main className="bg-[#fafaf9] text-gray-900">

      {/* HEADER */}
      <section className="border-b border-gray-100 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Legal</p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-gray-950">Privacy Policy</h1>
          <p className="mt-3 text-sm text-gray-400">Last updated: {lastUpdated}</p>
          <p className="mt-5 text-base leading-relaxed text-gray-500">
            We&apos;ve written this to be readable, not impenetrable. If something isn&apos;t clear,{" "}
            <a href="mailto:hello@worthulator.com" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
              email us
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">01 — Who we are</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Worthulator</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                Worthulator operates the website at worthulator.com (the &ldquo;Platform&rdquo;). This
                policy explains what data we collect, why we collect it, and how we use it.
              </p>
              <p>
                We don&apos;t sell data. We don&apos;t run algorithmic ad profiles. We try to collect
                as little as we need to make the Platform work and improve it.
              </p>
            </div>
          </div>

          {/* 2 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">02 — What we collect</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Data we collect and why</h2>
            <div className="mt-6 space-y-6">
              {[
                {
                  title: "Calculator inputs",
                  body: "Numbers you enter into our calculators (salary, hours, rates, etc.) are processed client-side in your browser. They are not sent to our servers or stored by us.",
                },
                {
                  title: "Lead-generation forms",
                  body: "Where you choose to submit a lead form, we collect your name, email address, location (where provided), and the inputs or query you supply. This data is used to generate your estimate, improve our tools, and — where you have explicitly consented — connect you with relevant service providers.",
                },
                {
                  title: "Usage analytics",
                  body: "We use privacy-first analytics to understand how pages are used — which tools get used, how often, and from where. This data is aggregated and anonymous. No individual user is tracked.",
                },
                {
                  title: "Cookies",
                  body: "We use minimal cookies. Some may be set by analytics tools. We do not use advertising or tracking cookies. You can block cookies in your browser settings without affecting calculator functionality.",
                },
                {
                  title: "Contact messages",
                  body: "If you email us, we store your email and the content of your message in order to respond. We don't add you to a marketing list unless you explicitly ask to be included.",
                },
                {
                  title: "LocalStorage",
                  body: "Some calculators save your most recent inputs to your browser's localStorage so you don't have to re-enter them on your next visit. This data never leaves your device.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">03 — Why we use your data</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Purposes &amp; legal basis</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>We process personal data for the following purposes:</p>
              <ul className="ml-5 list-disc space-y-2 text-sm">
                <li><span className="font-semibold text-gray-700">Generating estimates</span> — to process your inputs and return a result. Legal basis: <em>performance of a service / legitimate interest</em>.</li>
                <li><span className="font-semibold text-gray-700">Improving our tools</span> — aggregated, anonymised usage data helps us understand which calculators are most useful and where accuracy can be improved. Legal basis: <em>legitimate interest</em>.</li>
                <li><span className="font-semibold text-gray-700">Lead generation / connecting with providers</span> — where you have submitted a lead form and ticked the optional marketing consent box, we may share your information with selected service providers who may be able to assist you. Legal basis: <em>consent</em> (freely given, specific, and withdrawable at any time).</li>
                <li><span className="font-semibold text-gray-700">Responding to enquiries</span> — to reply to messages or support requests. Legal basis: <em>legitimate interest</em>.</li>
              </ul>
              <p>
                You can withdraw consent for marketing contact at any time by emailing{" "}
                <a href="mailto:hello@worthulator.com" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
                  hello@worthulator.com
                </a>
                .
              </p>
            </div>
          </div>

          {/* 4 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">04 — Data sharing with partners</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Who we share your data with</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                We may share your information with selected partners for service fulfilment
                — for example, to connect you with a relevant professional or provider — but
                only where you have explicitly opted in at the point of submission.
              </p>
              <p>
                We do not sell your personal data to third parties. We do not share your data
                with advertising networks or data brokers.
              </p>
            </div>
          </div>

          {/* 5 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">05 — Third-party services</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">External tools we use</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                We use a small number of third-party services to run and improve the Platform. Each
                is bound by its own privacy policy:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-sm">
                <li><span className="font-semibold text-gray-700">Analytics provider</span> — collects aggregated, anonymised page-view data.</li>
                <li><span className="font-semibold text-gray-700">Hosting provider</span> — serves the Platform and may log standard server-request data (IP address, browser type) for security and performance purposes.</li>
              </ul>
              <p>
                We don&apos;t use Facebook Pixel, Google Ads tracking, or any advertising network
                tracking on the Platform.
              </p>
            </div>
          </div>

          {/* 6 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">06 — Your rights</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">What you can ask us to do</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                If you&apos;re based in the EU, UK, or California, you have specific rights over
                your personal data. Even if you&apos;re not, we extend these to everyone:
              </p>
              <ul className="ml-5 list-disc space-y-2 text-sm">
                <li>Ask what data we hold about you</li>
                <li>Ask us to delete any data we hold about you</li>
                <li>Object to specific processing</li>
                <li>Get a copy of any data in a portable format</li>
              </ul>
              <p>
                To exercise any of these, email{" "}
                <a href="mailto:hello@worthulator.com" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
                  hello@worthulator.com
                </a>
                . We&apos;ll respond within 30 days.
              </p>
            </div>
          </div>

          {/* 7 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">07 — Data retention</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">How long we keep data</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                Analytics data is retained in aggregated form indefinitely. Contact messages are
                retained for up to 24 months. Server logs from our hosting provider are typically
                retained for 30–90 days depending on provider policy.
              </p>
              <p>
                Calculator inputs are never stored by us. Any data saved in your browser&apos;s
                localStorage stays there until you clear it.
              </p>
            </div>
          </div>

          {/* 8 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">08 — Changes</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">Updates to this policy</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-500">
              <p>
                If we make material changes to this policy, we&apos;ll update the date at the top
                of this page. Continuing to use the Platform after a change constitutes acceptance
                of the updated policy.
              </p>
              <p>
                Questions?{" "}
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
