"use client";

/**
 * ─── StandardResultSection ───────────────────────────────────────────────────
 * TakeHomePayTemplate — Results area building blocks
 *
 * Export list:
 *   HeroResultCard   – Dark premium hero number with flash glow, delta badge,
 *                      stacked colour bar, and insight lines
 *   BreakdownTable   – Gross → deduction rows → net income table
 *   FrequencyCards   – Row of mini dark cards (Monthly / Weekly / Hourly / Daily)
 *   WhatIfButtons    – Scenario mutation buttons below the inputs
 *
 * These compose the right-hand (results) column of a TakeHomePayTemplate calculator.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE SKETCH
 * ─────────────────────────────────────────────────────────────────────────────
 *   <div className="flex flex-col gap-4">
 *     {!calculating && !calculated && <WorthulatorResultReveal />}
 *
 *     {calculated && (
 *       <HeroResultCard
 *         label="Your estimated take-home pay"
 *         formattedValue={formatCurrency(display, locale)}
 *         flash={flash}
 *         pctOfGross={pctNet}
 *         badge={`${effectiveRate}% effective tax rate`}
 *         changeAmount={changeAmount}
 *         showChange={showChange}
 *         formattedChange={`${changeAmount > 0 ? "+" : ""}${formatCurrency(Math.abs(changeAmount), locale)} / yr`}
 *         changePositive={changeAmount > 0}
 *         stackedSegments={stackedSegments}
 *         stackedLegend={stackedLegend}
 *         insights={["You earn more than ~68% of US workers."]}
 *       />
 *     )}
 *
 *     {calculated && (
 *       <BreakdownTable
 *         formattedGross={formatCurrency(salary, locale)}
 *         formattedNet={formatCurrency(net, locale)}
 *         netSubLabel="What you actually take home"
 *         rows={breakdowns.map(b => ({
 *           label: b.label,
 *           formattedValue: `-${formatCurrency(b.value, locale)}`,
 *           color: b.color,
 *         }))}
 *       />
 *     )}
 *
 *     {calculated && (
 *       <FrequencyCards
 *         cards={[
 *           { label: "Monthly",  formattedValue: formatCurrency(net/12, locale),    sub: "per month" },
 *           { label: "Weekly",   formattedValue: formatCurrency(net/52, locale),    sub: "per week"  },
 *           { label: "Hourly",   formattedValue: formatCurrency(net/52/40, locale), sub: "est. per hour" },
 *         ]}
 *       />
 *     )}
 *   </div>
 */

import { type ReactNode } from "react";

// ─── HeroResultCard ───────────────────────────────────────────────────────────

interface StackedSegment {
  /** Width as a percentage of the full bar, e.g. 68 */
  pct: number;
  /** Tailwind bg class, e.g. "bg-emerald-400" | "bg-red-400" | "bg-orange-300" | "bg-gray-300" */
  colorClass: string;
}

interface StackedLegendItem {
  label: string;
  /** Tailwind bg class matching the segment */
  colorClass: string;
}

interface HeroResultCardProps {
  /** Eyebrow label, e.g. "Your estimated take-home pay" */
  label: string;
  /** Pre-formatted value string, e.g. "$42,183" */
  formattedValue: string;
  /** Triggers the flash glow effect — set true on calculate, reset after ~500ms */
  flash?: boolean;
  /** Percentage of gross, e.g. 68 — shown as "X% of gross" */
  pctOfGross?: number;
  /** Optional badge text, e.g. "28.5% effective tax rate" */
  badge?: string;
  /** Numeric delta from previous calculation */
  changeAmount?: number;
  /** Whether to show the delta badge (fade out after ~1.8s) */
  showChange?: boolean;
  /** Pre-formatted change string, e.g. "+$2,400 / yr" */
  formattedChange?: string;
  changePositive?: boolean;
  /** Segments for the stacked colour bar (should add up to 100%) */
  stackedSegments?: StackedSegment[];
  stackedLegend?: StackedLegendItem[];
  /** Small insight lines below the number */
  insights?: string[];
  children?: ReactNode;
}

export function HeroResultCard({
  label,
  formattedValue,
  flash = false,
  pctOfGross,
  badge,
  changeAmount = 0,
  showChange = false,
  formattedChange,
  changePositive = true,
  stackedSegments,
  stackedLegend,
  insights,
  children,
}: HeroResultCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gray-950 p-6 sm:p-8 transition-all duration-500 ${
        flash
          ? "border-emerald-500/20 shadow-[0_24px_100px_rgba(0,0,0,0.55),0_0_40px_rgba(52,211,153,0.1)]"
          : "border-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      }`}
    >
      {/* Top-right ambient orb — scales slightly on flash */}
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl transition-all duration-500 ${
          flash ? "bg-emerald-500/25 scale-110" : "bg-emerald-500/15 scale-100"
        }`}
      />
      {/* Bottom-left dark orb */}
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-900/40 blur-3xl" />

      {/* Eyebrow */}
      <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
        {label}
      </p>

      {/* Main number */}
      <p
        className={`relative mt-3 text-[clamp(3.5rem,8vw,5.5rem)] font-bold leading-none tracking-[-0.04em] transition-all duration-500 ${
          flash
            ? "text-emerald-300 [text-shadow:0_0_40px_rgba(52,211,153,0.6)]"
            : "text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]"
        }`}
      >
        {formattedValue}
      </p>

      {/* Delta badge */}
      <div
        className={`relative mt-1 h-6 overflow-hidden transition-all duration-700 ${
          showChange ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        {changeAmount !== 0 && formattedChange && (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              changePositive
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {formattedChange}
          </span>
        )}
      </div>

      {/* Sub-label row */}
      {(pctOfGross !== undefined || badge) && (
        <div className="relative mt-2 flex flex-wrap items-center gap-2.5">
          {pctOfGross !== undefined && (
            <p className="text-sm font-medium text-gray-400">
              per year &nbsp;&middot;&nbsp;{" "}
              <span className="font-bold text-white">{pctOfGross}%</span> of gross
            </p>
          )}
          {badge && (
            <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Insight lines */}
      {insights?.map((line, i) => (
        <p key={i} className="relative mt-1 text-sm font-medium text-emerald-400">
          {line}
        </p>
      ))}

      {/* Stacked colour bar */}
      {stackedSegments && stackedSegments.length > 0 && (
        <>
          <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-white/8">
            {stackedSegments.map((seg, i) => (
              <div
                key={i}
                className={`h-full transition-all duration-700 ${seg.colorClass}`}
                style={{ width: `${seg.pct}%` }}
              />
            ))}
          </div>
          {stackedLegend && (
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
              {stackedLegend.map((item) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${item.colorClass}`} />
                  {item.label}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {children}
    </div>
  );
}

// ─── BreakdownTable ────────────────────────────────────────────────────────────

type RowColor = "red" | "orange" | "gray" | "blue" | "purple" | "amber" | "emerald";

interface BreakdownRow {
  label: string;
  /** Pre-formatted value string, including sign, e.g. "-$8,400" */
  formattedValue: string;
  color: RowColor;
}

interface BreakdownTableProps {
  grossLabel?: string;
  formattedGross: string;
  netLabel?: string;
  netSubLabel?: string;
  formattedNet: string;
  rows: BreakdownRow[];
}

const ROW_COLORS: Record<RowColor, { border: string; bg: string; dot: string; text: string }> = {
  red:     { border: "border-red-100",    bg: "bg-red-50",    dot: "bg-red-400",    text: "text-red-500"    },
  orange:  { border: "border-orange-100", bg: "bg-orange-50", dot: "bg-orange-400", text: "text-orange-500" },
  gray:    { border: "border-gray-200",   bg: "bg-gray-50",   dot: "bg-gray-400",   text: "text-gray-500"   },
  blue:    { border: "border-blue-100",   bg: "bg-blue-50",   dot: "bg-blue-400",   text: "text-blue-500"   },
  purple:  { border: "border-purple-100", bg: "bg-purple-50", dot: "bg-purple-400", text: "text-purple-500" },
  amber:   { border: "border-amber-100",  bg: "bg-amber-50",  dot: "bg-amber-400",  text: "text-amber-600"  },
  emerald: { border: "border-emerald-100",bg: "bg-emerald-50",dot: "bg-emerald-400",text: "text-emerald-600"},
};

export function BreakdownTable({
  grossLabel = "Gross Income",
  formattedGross,
  netLabel = "Net Income",
  netSubLabel = "What you actually take home",
  formattedNet,
  rows,
}: BreakdownTableProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <p className="mb-5 text-sm font-semibold text-gray-700">Full breakdown</p>
      <dl className="space-y-0">
        {/* Gross */}
        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5">
          <dt className="flex items-center gap-2.5 text-sm text-gray-600">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-300" />
            {grossLabel}
          </dt>
          <dd className="text-sm font-semibold text-gray-900">{formattedGross}</dd>
        </div>

        <div className="px-5 py-1 text-xs text-gray-300 select-none">&#8595;</div>

        {/* Deduction rows */}
        {rows.map((row, i) => {
          const c = ROW_COLORS[row.color] ?? ROW_COLORS.gray;
          return (
            <div key={row.label}>
              <div
                className={`flex items-center justify-between rounded-xl border px-4 py-3.5 ${c.border} ${c.bg}`}
              >
                <dt className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${c.dot}`} />
                  {row.label}
                </dt>
                <dd className={`text-sm font-semibold ${c.text}`}>{row.formattedValue}</dd>
              </div>
              {i < rows.length - 1 && (
                <div className="px-5 py-1 text-xs text-gray-300 select-none">&#8595;</div>
              )}
            </div>
          );
        })}

        <div className="px-5 py-1 text-xs text-gray-300 select-none">&#8595;</div>

        {/* Net */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5">
          <dt className="flex flex-col gap-0.5">
            <span className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-gray-950">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
              {netLabel}
            </span>
            {netSubLabel && (
              <span className="ml-5 text-xs text-gray-400">{netSubLabel}</span>
            )}
          </dt>
          <dd className="text-xl font-bold tracking-tight text-emerald-600">{formattedNet}</dd>
        </div>
      </dl>
    </div>
  );
}

// ─── FrequencyCards ────────────────────────────────────────────────────────────

interface FrequencyCard {
  label: string;
  formattedValue: string;
  sub: string;
}

interface FrequencyCardsProps {
  cards: FrequencyCard[];
}

export function FrequencyCards({ cards }: FrequencyCardsProps) {
  return (
    <div className={`grid gap-2 sm:gap-3 grid-cols-${Math.min(cards.length, 4)}`}>
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/6 bg-gray-900 p-3 sm:p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            {card.label}
          </p>
          <p className="mt-2 text-lg sm:text-2xl font-bold tracking-[-0.03em] text-emerald-400">
            {card.formattedValue}
          </p>
          <p className="mt-0.5 text-xs font-medium text-gray-500">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── WhatIfButtons ─────────────────────────────────────────────────────────────

type ScenarioSentiment = "pos" | "neg" | "neutral";

interface Scenario {
  label: string;
  sentiment: ScenarioSentiment;
  onClick: () => void;
}

interface WhatIfButtonsProps {
  title?: string;
  hint?: string;
  scenarios: Scenario[];
}

export function WhatIfButtons({
  title = "What if your inputs changed?",
  hint,
  scenarios,
}: WhatIfButtonsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      {hint && (
        <p className="mt-1 text-xs leading-5 text-gray-400">{hint}</p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {scenarios.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={s.onClick}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.97] hover:-translate-y-px hover:scale-[1.02] ${
              s.sentiment === "pos"
                ? "border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                : s.sentiment === "neg"
                ? "border-gray-200 bg-gray-50 text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
