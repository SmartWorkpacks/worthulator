/**
 * ─── SimpleCalculatorTemplateLayout ────────────────────────────────────────────
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
 *   3. Hero section          – SimpleCalculatorHero component (shared, auto-updates)
 *   4. Calculator section    – the calculator component
 *   5. Insight strip         – single bold callout sentence
 *   6. Stat chips row        – 3 stat cards with colored accent bars
 *   7. Content card grid     – "What this means" 3-up insight cards
 *   8. SEO text block        – formula block + numbered steps + prose
 *   9. FAQ section           – accordion Q&A
 *  10. Related calculators   – 4-up curated internal link cards
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Metadata } from "next";
// import YourCalculatorLoader from "./YourCalculatorLoader";    // ← uncomment

import SimpleCalculatorHero from "./SimpleCalculatorHero";
import StandardFAQSection from "./StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
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
// color:  "text-emerald-600" | "text-blue-600" | "text-amber-600" | "text-red-500"
// accent: "bg-emerald-500"   | "bg-blue-500"   | "bg-amber-500"   | "bg-red-500"

const STATS = [
  { stat: "[X%]",    color: "text-emerald-600", accent: "bg-emerald-500", label: "[What this stat means in plain English]" },
  { stat: "[Y]",     color: "text-blue-600",    accent: "bg-blue-500",    label: "[Second stat explanation]" },
  { stat: "[Z sec]", color: "text-amber-600",   accent: "bg-amber-500",   label: "[Third stat explanation]" },
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

// ─── 5. Related calculators ───────────────────────────────────────────────────
// 4 curated internal links. Match accent colors to the destination tool's theme.
// accent options: "bg-emerald-500/10" | "bg-blue-500/10" | "bg-amber-500/10" | "bg-purple-500/10"

const RELATED_CALCS = [
  {
    title: "[Related Calculator 1]",
    description: "[One line — what it does / why it's useful after this one.]",
    href: "/tools/[slug-1]",
    icon: "📊",
    accent: "bg-emerald-500/10",
  },
  {
    title: "[Related Calculator 2]",
    description: "[One line description.]",
    href: "/tools/[slug-2]",
    icon: "💼",
    accent: "bg-blue-500/10",
  },
  {
    title: "[Related Calculator 3]",
    description: "[One line description.]",
    href: "/tools/[slug-3]",
    icon: "📉",
    accent: "bg-amber-500/10",
  },
  {
    title: "[Related Calculator 4]",
    description: "[One line description.]",
    href: "/tools/[slug-4]",
    icon: "🏡",
    accent: "bg-purple-500/10",
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

      {/* ── 3. HERO + 4. CALCULATOR ──────────────────────────────────── */}
      {/*
        SimpleCalculatorHero handles: gradient+grid bg, eyebrow badge,
        H1, description, feature chips, and the calculator wrapper.
        Change SimpleCalculatorHero.tsx once → all calculators update.

        RegionToggle: not currently supported in SimpleCalculatorHero —
        add it manually if the tool has a US/UK variant.
      */}
      <SimpleCalculatorHero
        eyebrowIcon="[ICON — e.g. $ % ↑]"
        eyebrowText="[CATEGORY] · [SUB-CATEGORY]"
        title="[TOOL NAME]"
        description="[One sentence — what does the user get? Focus on the outcome.]"
        chips={[
          "[Feature / benefit 1]",
          "[Feature / benefit 2]",
          "[Feature / benefit 3]",
        ]}
      >
        {/* <YourCalculatorLoader /> */}
        {/* ↑ Replace with your loader. Add <CalcDisclaimer text="..." /> inside
             your Calculator.tsx, beneath the WhatIfButtons in the results column. */}
      </SimpleCalculatorHero>

      {/* ── 5. INSIGHT STRIP ────────────────────────────────────────────── */}
      <InsightStrip
        text='[Single insight line. Example: Most people take home between <span class="font-semibold text-gray-900">60–70%</span> of their salary.]'
      />

      {/* ── 6. STAT CHIPS ───────────────────────────────────────────────── */}
      <StatChipsRow stats={STATS} />

      {/* ── 7. CONTENT CARDS ────────────────────────────────────────────── */}
      <ContentCardGrid
        title="What this means for you"
        subtitle="[One sentence framing why this matters to the user.]"
        cards={CONTENT_CARDS}
      />

      {/* ── 8. SEO TEXT BLOCK ───────────────────────────────────────────── */}
      {/*
        formula: optional — paste the actual formula string, multi-line with Where: block
        steps:   optional — 4–6 numbered steps explaining how to use the tool
        paragraphs: 2 short paragraphs of prose after the steps
      */}
      <SEOTextBlock
        title="How the [TOOL NAME] Works"
        formula={`[FORMULA HERE, e.g. FV = PV × (1 + r)ⁿ]

Where:
  [VAR1] = [Description]
  [VAR2] = [Description]`}
        steps={[
          { label: "[Step 1 label]", description: "[Step 1 description.]" },
          { label: "[Step 2 label]", description: "[Step 2 description.]" },
          { label: "[Step 3 label]", description: "[Step 3 description.]" },
          { label: "[Step 4 label]", description: "[Step 4 description.]" },
        ]}
        paragraphs={[
          "[Explain what the calculator models. Why is it more useful than alternatives? Written for humans.]",
          "[Second paragraph: data sources, tax rates, update frequency — whatever is relevant.]",
        ]}
      />

      {/* ── 9. FAQ ──────────────────────────────────────────────────────── */}
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      {/* ── 10. RELATED CALCULATORS ─────────────────────────────────────── */}
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="[One line — why these tools pair well with this one.]"
        items={RELATED_CALCS}
      />
    </main>
  );
}
