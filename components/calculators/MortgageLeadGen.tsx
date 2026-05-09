"use client";

import { useState } from "react";

export default function MortgageLeadGen() {
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
        body: JSON.stringify({ email, source: "mortgage-calculator" }),
      });
    } catch {
      // Silent fail — don't block UX on network error
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
          Compare Mortgage Options &amp; Get Pre-Approved
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-xl">
          Your estimate is a strong starting point. Here&apos;s how to turn it into a real approval.
        </p>
      </div>

      {/* Benefits + CTAs */}
      <div className="px-6 py-5 grid gap-6 sm:grid-cols-2">
        {/* Benefits */}
        <div>
          <ul className="space-y-3">
            {[
              { icon: "📊", text: "Compare live rates from multiple lenders side-by-side" },
              { icon: "✅", text: "Pre-qualify in minutes — no hard credit pull required" },
              { icon: "💰", text: "See closing cost estimates before you commit" },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-base leading-5">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
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

        {/* Soft email capture */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
          {submitted ? (
            <div className="flex flex-col items-start gap-2">
              <span className="text-2xl">✅</span>
              <p className="text-sm font-semibold text-gray-800">Got it — check your inbox.</p>
              <p className="text-xs text-gray-500">
                We&apos;ll send you a link to this calculation so you can revisit it anytime.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">
                Save your results
              </p>
              <p className="text-xs text-gray-500">
                Optional — enter your email and we&apos;ll send you a link to this calculation.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40 transition"
                >
                  {loading ? "…" : "Send"}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                No spam. Unsubscribe any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
