/**
 * ─── Worthulator Simple Calculator Page Template ─────────────────────────────
 *
 * This is the CANONICAL template for all simple Worthulator calculators.
 * Based on the approved Future Value Calculator reference implementation.
 *
 * Page structure (top → bottom):
 *   1. HERO       — gradient+grid bg, $ eyebrow, H1, description, feature chips
 *   2. CALCULATOR — CalculatorLoader component (handles loading + result reveal)
 *   3. INSIGHT    — InsightStrip: single bold callout sentence
 *   4. STATS      — StatChipsRow: 3 big stat cards with colored accent bars
 *   5. INSIGHTS   — ContentCardGrid: 3 icon+title+body insight cards
 *   6. EXPLAINER  — SEOTextBlock: formula block + numbered steps + prose
 *   7. FAQ        — StandardFAQSection: accordion Q&A
 *   8. RELATED    — RelatedCalcCards: 4-up curated internal link cards
 *
 * To use:
 *   1. Copy this file to app/tools/[slug]/page.tsx
 *   2. Replace all [PLACEHOLDER] values with real content
 *   3. Import your [CalculatorName]Loader component
 *   4. Fill in FAQS, STATS, CONTENT_CARDS, RELATED_CALCS, SEOTextBlock props
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Metadata } from "next";
// import YourCalculator from "@/components/calculators/YourCalculator";
// import YourLeadGen from "@/components/calculators/YourLeadGen";
import RelatedTools from "@/components/RelatedTools";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "[TOOL NAME] [YEAR] – [VALUE PROPOSITION]",
  description: "[1–2 sentence description. Focus on what the user gets, not what the tool is.]",
  keywords: ["[keyword 1]", "[keyword 2]"],
  alternates: { canonical: "https://worthulator.com/tools/[slug]" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "[TOOL NAME] – [Short OG title]",
    description: "[OG description]",
    url: "https://worthulator.com/tools/[slug]",
    type: "website",
  },
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "[Question 1?]",
    a: "[Answer 1.]",
  },
  {
    q: "[Question 2?]",
    a: "[Answer 2.]",
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "[TOOL NAME]",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description: "[Description]",
    url: "https://worthulator.com/tools/[slug]",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalculatorPage() {
  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      {/*
        Category badge: emoji + category name + region (e.g. "US market")
        H1: Tool name only — clean, no subtitle crammed in
        Subtitle p: One sentence, what the user gets
        Body p: 1–2 lines expanding on the value. No marketing fluff.
        Disclaimer: Short. "Educational purposes only. Not financial advice."
      */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-12 sm:px-8 sm:py-16 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-50/70 blur-[90px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              {/* [EMOJI] [CATEGORY] */}
              💰 Personal Finance
            </span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs font-medium text-gray-400">US market</span>
          </div>
          <h1 className="text-[clamp(2.4rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-gray-950">
            {/* [TOOL NAME] */}
            Tool Name Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-[clamp(1.05rem,2vw,1.25rem)] font-medium leading-snug text-gray-500">
            {/* One sentence. What does the user get? */}
            See exactly what [outcome] — based on your real numbers.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
            {/* 1–2 lines expanding. No hype. */}
            [Brief description of what makes this tool useful / what it models.]
          </p>
          <p className="mt-4 text-xs text-gray-400">
            For educational purposes only. Results are estimates, not financial advice.
          </p>
        </div>
      </section>

      {/* ── Calculator ────────────────────────────────────────────────────── */}
      {/*
        border-2 border-gray-400 rounded-2xl wraps the calculator component.
        Disclaimer sits outside the border, below.
      */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border-2 border-gray-400 overflow-hidden">
            {/* <YourCalculator /> */}
          </div>
          <p className="mt-3 text-xs leading-5 text-gray-400 px-1">
            Results are projections based on the assumptions you enter. Real outcomes depend on
            actual market conditions, tax laws, and individual circumstances.
            This is not financial advice.
          </p>
        </div>
      </section>

      {/* ── Lead Gen ──────────────────────────────────────────────────────── */}
      {/*
        Same border treatment as calculator section.
        bg-gray-50 section background to visually separate from calculator.
      */}
      <section className="bg-gray-50 px-5 py-10 sm:px-8 lg:px-16 border-t border-gray-100">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border-2 border-gray-400 overflow-hidden">
            {/* <YourLeadGen /> */}
          </div>
        </div>
      </section>

      {/* ── SEO / FAQ Content ─────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              How the [TOOL NAME] Works
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              [Explain what the calculator models, why it's more useful than alternatives,
              and what assumptions it makes. 2–3 paragraphs. Written for humans, not bots.]
            </p>

            {/* FAQ */}
            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-6 mt-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{faq.q}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Tools ─────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <RelatedTools currentTool="[slug]" />
        </div>
      </section>
    </main>
  );
}
