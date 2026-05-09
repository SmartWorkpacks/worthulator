"use client";

import { useState } from "react";

export default function LoanLeadGen() {
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
        body: JSON.stringify({ email, source: "loan-calculator" }),
      });
    } catch {
      // Silent fail — don't block UX
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
          Find the Best Loan for You
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-xl">
          Your estimate is a starting point. Compare real rates from multiple lenders and find
          the loan that costs you the least.
        </p>
      </div>

      {/* Benefits + CTAs */}
      <div className="px-6 py-5 grid gap-6 sm:grid-cols-2">
        {/* Benefits */}
        <div>
          <ul className="space-y-3">
            {[
              { icon: "📊", text: "Compare loan offers from multiple lenders side-by-side" },
              { icon: "✅", text: "Check eligibility in minutes — no hard credit pull" },
              { icon: "💰", text: "Find lower interest rates and save thousands over your term" },
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
              href="https://www.bankrate.com/loans/personal-loans/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Compare loan offers
              <span className="text-emerald-200 text-xs">→</span>
            </a>
            <a
              href="https://www.nerdwallet.com/personal-loans"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition"
            >
              Check your eligibility
            </a>
            <a
              href="https://www.credible.com/personal-loan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition"
            >
              Find lower rates
            </a>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Links open external sites. Worthulator is not a lender and earns no commission.
          </p>
        </div>

        {/* Soft email capture */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-5">
          {submitted ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-sm font-semibold text-gray-700">Got it!</p>
              <p className="mt-1 text-xs text-gray-500">
                We&apos;ll only send you genuinely useful content — no spam.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Email me this loan plan
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Get a summary of your results and tips on how to reduce your loan cost.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send my plan"}
                </button>
              </form>
              <p className="mt-3 text-xs text-gray-400">
                No spam, ever. Unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
