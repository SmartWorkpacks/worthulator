import type { ReactNode } from "react";

// ─── Stat item (monthly / weekly / daily grid) ───────────────────────────────

export interface DarkStat {
  label: string;
  value: string;
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface DarkResultCardProps {
  /** Small uppercase label above the value */
  label: string;
  /** Primary large value (e.g. "$52,000") */
  value: string;
  /** Smaller text appended inline after value (e.g. "/ year") */
  valueSuffix?: string;
  /** Sub-line below value */
  sub?: string;
  /** Activates the emerald glow flash animation */
  flash?: boolean;
  /** Optional row of smaller stat items (e.g. monthly / weekly / daily) */
  stats?: DarkStat[];
  /** Extra content rendered below the sub-line (delta badges, insight text, etc.) */
  children?: ReactNode;
  /**
   * Compact mode: smaller text, no ambient glow blobs, rounded-xl border.
   * Use for inline "live estimate" snippets inside other cards.
   */
  compact?: boolean;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DarkResultCard({
  label,
  value,
  valueSuffix,
  sub,
  flash = false,
  stats,
  children,
  compact = false,
  className = "",
}: DarkResultCardProps) {
  return (
    <div
      className={[
        "relative overflow-hidden border bg-gray-950 transition-all duration-500",
        compact ? "rounded-xl px-5 py-4" : "rounded-2xl p-6 sm:p-8",
        flash
          ? "border-emerald-500/20 shadow-[0_24px_100px_rgba(0,0,0,0.55),0_0_40px_rgba(52,211,153,0.1)]"
          : "border-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Ambient glow blobs — full card only */}
      {!compact && (
        <>
          <div
            className={[
              "pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl transition-all duration-500",
              flash ? "scale-110 bg-emerald-500/25" : "scale-100 bg-emerald-500/15",
            ].join(" ")}
          />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-900/40 blur-3xl" />
        </>
      )}

      {/* Label */}
      <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
        {label}
      </p>

      {/* Primary value */}
      <p
        className={[
          "relative font-bold leading-none tracking-[-0.04em] transition-all duration-500",
          compact ? "mt-1 text-3xl" : "mt-3 text-[clamp(3rem,7vw,5rem)]",
          flash
            ? "text-emerald-300 [text-shadow:0_0_40px_rgba(52,211,153,0.6)]"
            : "text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]",
        ].join(" ")}
      >
        {value}
        {valueSuffix && (
          <span className="ml-2 text-sm font-normal text-gray-500">{valueSuffix}</span>
        )}
      </p>

      {/* Sub-line */}
      {sub && (
        <p className="relative mt-1.5 text-sm text-gray-400">{sub}</p>
      )}

      {/* Extra content (delta badge, insight text, etc.) */}
      {children && <div className="relative mt-3">{children}</div>}

      {/* Stats grid (monthly / weekly / daily) */}
      {stats && stats.length > 0 && (
        <div
          className="mt-4 grid gap-3 text-center"
          style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-lg font-bold text-emerald-400">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
