/**
 * ─── StandardSEOSection ──────────────────────────────────────────────────────
 * Premium fintech-style content components for Worthulator simple calculators.
 * These are the STANDARD SIMPLE CALCULATOR CONTENT TEMPLATE components.
 *
 * Export list:
 *   InsightStrip     – Full-width dark premium callout banner (dark zone start)
 *   StatChipsRow     – Dark stat cards with per-stat color accents
 *   ContentCardGrid  – Dark insight cards with icon badges + hover polish
 *   SEOTextBlock     – Structured explainer with optional formula block + steps
 *   RelatedCalcCards – Curated internal link cards for related calculators
 *
 * Visual rhythm: InsightStrip → StatChipsRow → ContentCardGrid form a dark zone
 * (bg-gray-950). SEOTextBlock returns to white. FAQ on gray-50. RelatedCalcCards on white.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE
 * ─────────────────────────────────────────────────────────────────────────────
 *   <InsightStrip text='Your money has more time to <span class="font-semibold text-white">compound and grow</span>.' />
 *
 *   <StatChipsRow
 *     stats={[
 *       { stat: "10×",     color: "text-emerald-400", accent: "bg-emerald-500", label: "$10k at 7% for 30 years…" },
 *       { stat: "50%+",    color: "text-blue-400",    accent: "bg-blue-500",    label: "of final balance from interest" },
 *       { stat: "Month 1", color: "text-amber-400",   accent: "bg-amber-500",   label: "best time to start" },
 *     ]}
 *   />
 *
 *   <ContentCardGrid
 *     title="What this means for your money"
 *     subtitle="Compound interest rewards patience above almost everything else."
 *     cards={[
 *       { icon: "📈", title: "Power of compounding", body: "…" },
 *     ]}
 *   />
 *
 *   <SEOTextBlock
 *     title="How the Calculator Works"
 *     formula="FV = PV × (1 + r)ⁿ + PMT × (((1 + r)ⁿ − 1) / r)"
 *     steps={[{ label: "Enter your deposit", description: "The starting lump sum." }]}
 *     paragraphs={["This tool uses the standard compound interest formula…"]}
 *   />
 *
 *   <RelatedCalcCards
 *     items={[{ title: "Compound Interest", description: "…", href: "/tools/…", icon: "📊" }]}
 *   />
 */

import Link from "next/link";

// ─── InsightStrip ─────────────────────────────────────────────────────────────

interface InsightStripProps {
  text: string;
  /** Kept for backwards compatibility — ignored, always renders dark */
  bg?: string;
}

export function InsightStrip({ text }: InsightStripProps) {
  return (
    <div className="border-t border-gray-100 bg-emerald-50 px-5 py-8 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl flex items-start gap-4">
        {/* Left emerald accent bar */}
        <div className="shrink-0 mt-1 w-0.75 self-stretch rounded-full bg-emerald-500" />
        <p
          className="text-[1rem] font-medium leading-relaxed text-gray-600"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </div>
  );
}

// ─── StatChipsRow ─────────────────────────────────────────────────────────────

interface StatChip {
  stat: string;
  /** Tailwind text color class, e.g. "text-emerald-400" */
  color: string;
  label: string;
  /** Tailwind bg class for the top accent bar, e.g. "bg-emerald-500" */
  accent?: string;
}

interface StatChipsRowProps {
  stats: StatChip[];
  /** Kept for backwards compatibility — ignored */
  bg?: string;
}

export function StatChipsRow({ stats }: StatChipsRowProps) {
  return (
    <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl grid gap-4 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.stat}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 px-6 py-6 transition-all duration-200 hover:border-emerald-200 hover:bg-white hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Colored top accent line */}
            <div className={`absolute top-0 inset-x-0 h-0.75 ${item.accent ?? "bg-emerald-500"} rounded-t-2xl`} />
            <p className={`text-[2.75rem] font-extrabold tracking-tight leading-none ${item.color}`}>
              {item.stat}
            </p>
            <p className="mt-3 text-sm leading-[1.65] text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── ContentCardGrid ──────────────────────────────────────────────────────────

interface ContentCard {
  icon: string;
  title: string;
  body: string;
}

interface ContentCardGridProps {
  title: string;
  subtitle?: string;
  cards: ContentCard[];
  /** Kept for backwards compatibility — ignored */
  bg?: string;
}

export function ContentCardGrid({ title, subtitle, cards }: ContentCardGridProps) {
  return (
    <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">{title}</h2>
          {subtitle && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-emerald-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* Icon badge */}
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-xl">
                {card.icon}
              </span>
              <div className="mt-4 mb-3 h-px bg-gray-100" />
              <h3 className="text-sm font-semibold leading-snug text-gray-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-[1.75] text-gray-500">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SEOTextBlock ─────────────────────────────────────────────────────────────

interface SEOStep {
  label: string;
  description: string;
}

interface SEOTextBlockProps {
  title: string;
  paragraphs: string[];
  /** Optional formula rendered in a styled dark code block */
  formula?: string;
  /** Optional step-by-step breakdown items */
  steps?: SEOStep[];
  /** Kept for backwards compatibility — ignored */
  bg?: string;
}

export function SEOTextBlock({ title, paragraphs, formula, steps }: SEOTextBlockProps) {
  return (
    <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight text-gray-950 mb-8">{title}</h2>

        {/* Formula block */}
        {formula && (
          <div className="mb-8 overflow-x-auto rounded-2xl bg-gray-950 border border-white/6 px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-500 mb-3">Formula</p>
            <code className="font-mono text-sm text-emerald-300 leading-loose whitespace-pre-wrap">
              {formula}
            </code>
          </div>
        )}

        {/* Steps grid */}
        {steps && steps.length > 0 && (
          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.label} className="flex gap-3">
                <span className="shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prose paragraphs */}
        <div className="space-y-4 max-w-3xl">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-[1.85] text-gray-600">{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── RelatedCalcCards ─────────────────────────────────────────────────────────

export interface RelatedCalc {
  title: string;
  description: string;
  href: string;
  icon: string;
  /** Tailwind bg class for icon container, e.g. "bg-blue-500/10" */
  accent?: string;
}

interface RelatedCalcCardsProps {
  title?: string;
  subtitle?: string;
  items: RelatedCalc[];
}

export function RelatedCalcCards({
  title = "Related Calculators",
  subtitle,
  items,
}: RelatedCalcCardsProps) {
  return (
    <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight text-gray-950 mb-1">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1 mb-8">{subtitle}</p>}
        {!subtitle && <div className="mb-8" />}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all duration-200 hover:border-emerald-200 hover:bg-white hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-lg ${item.accent ?? "bg-emerald-500/10"}`}>
                {item.icon}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {item.title}
                </p>
                <p className="mt-1.5 text-xs leading-[1.65] text-gray-500">{item.description}</p>
              </div>
              <svg className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
