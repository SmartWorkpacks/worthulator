"use client";

import { useState } from "react";

export default function RentVsBuyLeadGen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "rent-vs-buy-calculator" }),
      });
    } catch {
      // Silent fail — never block UX on a network error
    }
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">
          Next steps
        </p>
        <h2 className="text-xl font-bold text-gray-900">
          Ready to Take Action on Your Numbers?
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-xl">
          Your estimate is a solid foundation. Here&apos;s how to turn it into a real decision.
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-5 grid gap-8 sm:grid-cols-2">

        {/* Left: benefit list + CTAs */}
        <div>
          <ul className="space-y-3">
            {[
              { icon: "🏠", text: "Compare live mortgage rates from multiple lenders" },
              { icon: "📊", text: "Get a personalised affordability estimate in minutes" },
              { icon: "💡", text: "Understand the true hidden costs before you commit" },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-base leading-5">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://www.bankrate.com/mortgages/mortgage-rates/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Compare mortgage rates
              <span className="text-emerald-200 text-xs">→</span>
            </a>
            <a
              href="https://www.credible.com/mortgage"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition"
            >
              See what you qualify for
            </a>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Links open external sites. Worthulator is not a lender and earns no commission.
          </p>
        </div>

        {/* Right: email capture */}
        <div className="rounded-xl bg-gray-50 border border-gray-100 px-5 py-4">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <span className="text-emerald-600 text-lg">✓</span>
              </div>
              <p className="font-semibold text-gray-800">You&apos;re on the list</p>
              <p className="mt-1 text-sm text-gray-500">
                We&apos;ll send you a quick summary of your results plus our homebuying checklist.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Get a summary of your results
              </p>
              <p className="text-xs text-gray-500 mb-4">
                We&apos;ll email you a clean breakdown of your rent vs buy numbers plus a
                homebuying checklist — no spam, ever.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send me the summary"}
                </button>
              </form>
              <p className="mt-2 text-xs text-gray-400 text-center">No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
