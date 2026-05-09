"use client";

import { useState } from "react";

export default function CompoundInterestLeadGen() {
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
        body: JSON.stringify({ email, source: "compound-interest-calculator" }),
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
          Start Growing Your Money Faster
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-xl">
          Your projection is only the beginning. Here&apos;s how to put that compounding power to
          work with the right platform.
        </p>
      </div>

      {/* Benefits + CTAs */}
      <div className="px-6 py-5 grid gap-6 sm:grid-cols-2">
        {/* Benefits */}
        <div>
          <ul className="space-y-3">
            {[
              { icon: "📈", text: "Compare investment platforms with different rates side-by-side" },
              { icon: "💸", text: "Low-cost index funds track S&P 500 returns (~7–10% historically)" },
              { icon: "🛡️", text: "Tax-advantaged accounts (ISA, 401k, Roth IRA) protect your gains" },
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
              href="https://www.bankrate.com/investing/best-online-brokers-for-beginners/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              Compare Investment Platforms
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="https://www.nerdwallet.com/best/investing/online-brokers-for-stock-trading"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition"
            >
              Start Investing Today
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Worthulator earns no commission from these links. We link only to established,
            independently reviewed resources.
          </p>
        </div>

        {/* Email capture */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
          {submitted ? (
            <div className="flex flex-col items-start gap-2">
              <span className="text-2xl">✅</span>
              <p className="text-sm font-semibold text-gray-800">Projection saved!</p>
              <p className="text-xs text-gray-500">
                We&apos;ll occasionally share tips on maximising compound growth. No spam, ever.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-sm font-semibold text-gray-800">
                Save your projection
              </p>
              <p className="text-xs text-gray-500">
                Enter your email and we&apos;ll send you a summary of your inputs and results.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition"
                >
                  {loading ? "…" : "Send"}
                </button>
              </div>
              <p className="text-xs text-gray-400">No spam. Unsubscribe any time.</p>
            </form>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
        <p className="text-xs text-gray-400">
          Investment results are not guaranteed. Past market performance does not guarantee
          future returns. This calculator provides estimates for educational purposes only and
          does not constitute financial advice.
        </p>
      </div>
    </section>
  );
}
