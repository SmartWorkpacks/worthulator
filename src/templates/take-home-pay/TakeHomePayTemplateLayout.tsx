/**
 * ─── TakeHomePayTemplateLayout ───────────────────────────────────────────────
 *
 * Full page.tsx template for TakeHomePayTemplate calculators.
 *
 * ARCHETYPE: Simple / utility / high-frequency calculators
 * USE FOR:   Percentage, margin, time, sales tax, hours-to-decimal,
 *            simple finance tools, lightweight business calculators.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO USE THIS TEMPLATE
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Copy to:  app/tools/[your-slug]/page.tsx
 *  2. Replace:  ALL [PLACEHOLDER] values with real content
 *  3. Import:   YourCalculatorLoader (dynamic import wrapper)
 *  4. Fill in:  FAQS, STATS, CARDS, jsonLd
 *  5. Remove:   This comment block
 *
 * COMPANION FILES (create alongside your page.tsx):
 *   YourCalculator.tsx        – "use client" component with all logic + state
 *   YourCalculatorLoader.tsx  – dynamic(() => import("./YourCalculator"), { ssr: false })
 *
 * SECTIONS IN THIS TEMPLATE:
 *   1. Metadata (SEO)
 *   2. JSON-LD structured data
 *   3. Hero section          – badge · H1 · subtitle · bullet points · region toggle
 *   4. Calculator section    – the calculator component itself
 *   5. Insight strip         – single-line stat below calculator
 *   6. Stat chips row        – 3 coloured stat chips
 *   7. Content card grid     – "What this means" 3-up cards
 *   8. Next steps section    – 3-up action cards
 *   9. SEO text block        – "How it works" prose
 *  10. FAQ section           – Q&A pairs
 *  11. Related tools         – RelatedTools component
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Metadata } from "next";
import RelatedTools from "@/components/RelatedTools";
// import YourCalculatorLoader from "./YourCalculatorLoader";    // ← uncomment
// import RegionToggle from "@/components/RegionToggle";         // ← if US/UK toggle needed

import StandardFAQSection from "./StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
} from "./StandardSEOSection";

// ─── 1. Metadata ─────────────────────────────────────────────────────────────
// Pattern: "[Tool Name] [Year] – [Value proposition in one line]"
// Title:   60 chars max   |   Description: 150 chars max

export const metadata: Metadata = {
  title: "[TOOL NAME] [YEAR] – [VALUE PROPOSITION IN ONE LINE]",
  description: "[1–2 sentence description. Focus on what the user gets, not what the tool is.]",
  keywords: ["[keyword 1]", "[keyword 2]", "[keyword 3]"],
  alternates: { canonical: "https://worthulator.com/tools/[slug]" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "[TOOL NAME] – [Short OG title, 60 chars]",
    description: "[OG description, 120 chars]",
    url: "https://worthulator.com/tools/[slug]",
    type: "website",
  },
};

// ─── 2. FAQ data ──────────────────────────────────────────────────────────────
// 4–6 questions. Written for humans. Schema.org FAQPage picks these up.

const FAQS = [
  {
    q: "[Question 1 — most common user question?]",
    a: "[Concise, helpful answer. 1–3 sentences.]",
  },
  {
    q: "[Question 2?]",
    a: "[Answer 2.]",
  },
  {
    q: "[Question 3?]",
    a: "[Answer 3.]",
  },
  {
    q: "[Question 4?]",
    a: "[Answer 4.]",
  },
];

// ─── 3. Stat chips ────────────────────────────────────────────────────────────
// 3 stats that give the page credibility. Use real numbers.
// color options: "text-emerald-600" | "text-red-500" | "text-blue-500" | "text-amber-600"

const STATS = [
  { stat: "[X%]",   color: "text-emerald-600", label: "[What this stat means in plain English]" },
  { stat: "[Y]",    color: "text-red-500",      label: "[Second stat explanation]" },
  { stat: "[Z sec]",color: "text-blue-500",     label: "[Third stat explanation]" },
];

// ─── 4. Content cards ─────────────────────────────────────────────────────────
// "What this means for you" — 3 educational cards explaining the topic.

const CONTENT_CARDS = [
  {
    icon: "📊",
    title: "[Concept 1]",
    body: "[Explain concept 1 in 2–3 sentences. No jargon. Focus on what the user needs to know.]",
  },
  {
    icon: "📉",
    title: "[Concept 2]",
    body: "[Explain concept 2.]",
  },
  {
    icon: "💡",
    title: "[Concept 3]",
    body: "[Explain concept 3.]",
  },
];

// ─── 5. Next steps cards ──────────────────────────────────────────────────────
// 3 links to related calculators or useful next actions.

const NEXT_STEPS = [
  {
    icon: "→",
    title: "[Next action 1]",
    body: "[Why this is useful after using this calculator.]",
    href: "/tools/[related-slug]",
  },
  {
    icon: "→",
    title: "[Next action 2]",
    body: "[Why useful.]",
    href: "/tools/[related-slug-2]",
  },
  {
    icon: "→",
    title: "[Next action 3]",
    body: "[Why useful.]",
    href: "/tools/[related-slug-3]",
  },
];

// ─── Page component ───────────────────────────────────────────────────────────

export default function CalculatorPage() {
  // ── JSON-LD ──────────────────────────────────────────────────────────────
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "[TOOL NAME]",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "[Tool description]",
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

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── 3. HERO ─────────────────────────────────────────────────────── */}
      {/*
        Keep this section tight:
        - Badge: emoji + category + region (e.g. "💰 Personal Finance · US")
        - H1: Tool name only — no subtitle crammed in
        - Subtitle p: ONE sentence — what the user gets
        - Body p: 1–2 lines — what it models
        - Bullets: 2–3 specific reasons to trust the tool
        - RegionToggle: if the tool has a US/UK variant
      */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gray-100/60 blur-3xl" />
        <div className="relative mx-auto max-w-2xl text-center">
          {/* Category badge + region */}
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            [CATEGORY] · [REGION]
          </p>
          {/* H1 */}
          <h1 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em] text-gray-950">
            [TOOL NAME]
          </h1>
          {/* Subtitle */}
          <p className="mt-4 text-base leading-7 text-gray-500">
            [One sentence. What does the user get? Focus on the outcome, not the tool.]
          </p>
          {/* Proof bullets */}
          <ul className="mt-6 inline-flex flex-col items-start gap-2 text-left">
            {[
              "[Specific benefit 1 — e.g. 'Covers all 50 US states']",
              "[Specific benefit 2 — e.g. 'Breaks down each deduction separately']",
              "[Specific benefit 3 — e.g. 'Free, instant, no sign-up needed']",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-gray-500">
                <span className="h-4 w-4 shrink-0 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Region toggle — remove if not US/UK dual tool */}
          {/* <div className="mt-6 flex justify-center">
            <RegionToggle
              current="us"
              usPath="/tools/[slug]"
              ukPath="/tools/[slug]-uk"
              theme="light"
            />
          </div> */}
        </div>
      </section>

      {/* ── 4. CALCULATOR ───────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          {/* <YourCalculatorLoader /> */}
          {/* ↑ Replace with your calculator loader. No border wrapper needed —
               the calculator component manages its own card styling. */}
        </div>
      </section>

      {/* ── 5. INSIGHT STRIP ────────────────────────────────────────────── */}
      <InsightStrip
        text='[Single insight line. Example: Most people take home between <span class="font-semibold text-gray-800">60–70%</span> of their salary.]'
      />

      {/* ── 6. STAT CHIPS ───────────────────────────────────────────────── */}
      <StatChipsRow stats={STATS} />

      {/* ── 7. CONTENT CARDS ────────────────────────────────────────────── */}
      <ContentCardGrid
        title="What this means for you"
        subtitle="[One sentence framing why this matters to the user.]"
        cards={CONTENT_CARDS}
      />

      {/* ── 8. NEXT STEPS ───────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">What you can do next</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Once you know your result, here are the most useful next steps.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {NEXT_STEPS.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg block"
              >
                <span className="text-xl">{item.icon}</span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. SEO TEXT BLOCK ───────────────────────────────────────────── */}
      <SEOTextBlock
        title="How the [TOOL NAME] Works"
        paragraphs={[
          "[Explain what the calculator models. Why is it more useful than alternatives? What assumptions does it make? Written for humans.]",
          "[Second paragraph. If relevant: what data sources or tax rates are used, how often they're updated.]",
        ]}
      />

      {/* ── 10. FAQ ─────────────────────────────────────────────────────── */}
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      {/* ── 11. RELATED TOOLS ───────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <RelatedTools />
        </div>
      </section>
    </main>
  );
}
