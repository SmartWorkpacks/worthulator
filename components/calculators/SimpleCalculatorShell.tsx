import type { ReactNode } from "react";

/**
 * SimpleCalculatorShell
 *
 * Standardised page-level shell shared by all calculator pages.
 * Wraps the hero, calculator section, insight strip, and any
 * additional sections (explainer, FAQ, CTA, related tools) without
 * changing any visual appearance.
 *
 * Usage:
 *   <SimpleCalculatorShell
 *     title="My Calculator"
 *     subtitle="a short tagline."
 *     description="One paragraph explaining what the tool does."
 *     heroCard={<YourPreviewCard />}           // dark right-side preview (optional)
 *     statChips={<YourStatChipsRow />}         // 3-chip row above calculator (optional)
 *     calculator={<YourCalculatorComponent />}
 *     insightText={<>Some <strong>insight</strong> text.</>}  // optional strip
 *   >
 *     {/* explainer, FAQ, CTA, RelatedTools sections *\/}
 *   </SimpleCalculatorShell>
 */

interface SimpleCalculatorShellProps {
  /** JSON-LD structured data object — rendered as an inline script in the page */
  jsonLd?: object;
  /** Eyebrow label above the H1 — defaults to "Money · Income Tools" */
  category?: ReactNode;
  /** H1 text */
  title: string;
  /** Tagline rendered as a styled span on a new line inside the H1 */
  subtitle?: ReactNode;
  /** Paragraph(s) below the H1 */
  description: ReactNode;
  /** Right-column dark preview card in the hero (hidden on mobile, visible lg+) */
  heroCard?: ReactNode;
  /** Optional row of 3 stat chips rendered above the calculator */
  statChips?: ReactNode;
  /** The calculator component */
  calculator: ReactNode;
  /** Short insight sentence rendered in the grey strip below the calculator */
  insightText?: ReactNode;
  /** Explainer, FAQ, CTA, RelatedTools — anything that follows the calculator */
  children?: ReactNode;
}

export default function SimpleCalculatorShell({
  jsonLd,
  category = "Money · Income Tools",
  title,
  subtitle,
  description,
  heroCard,
  statChips,
  calculator,
  insightText,
  children,
}: SimpleCalculatorShellProps) {
  return (
    <main className="bg-white text-gray-900">

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-24 lg:px-16">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gray-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">

          {/* Left — copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
              {category}
            </p>
            <h1 className="mt-4 text-[clamp(2.4rem,5.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-gray-950">
              {title}
              {subtitle && (
                <span className="mt-2 block text-base font-medium tracking-normal text-gray-400 sm:text-lg">{subtitle}</span>
              )}
            </h1>
            <div className="mt-5 max-w-lg text-lg leading-relaxed text-gray-500">
              {description}
            </div>
          </div>

          {/* Right — preview stat card */}
          {heroCard && (
            <div className="hidden lg:block">{heroCard}</div>
          )}

        </div>
      </section>

      {/* ── CALCULATOR ────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          {statChips && (
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              {statChips}
            </div>
          )}
          {calculator}
        </div>
      </section>

      {/* ── INSIGHT STRIP ─────────────────────────────────────────── */}
      {insightText && (
        <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
          <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
            {insightText}
          </p>
        </div>
      )}

      {/* ── ADDITIONAL SECTIONS (explainer, FAQ, CTA, related tools) */}
      {children}

    </main>
  );
}
