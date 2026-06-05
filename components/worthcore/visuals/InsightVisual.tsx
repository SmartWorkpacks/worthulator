"use client";

// ─── InsightVisual ─────────────────────────────────────────────────────────────
//
// Renders the visual primitive attached to a WorthCore Insight.
// Pattern: each insight renders [visual] → [title + body].
//
// Primitives (premium standard):
//   benchmark-bar   — two gradient bars (user vs benchmark) + delta chip
//   delta-card      — before → after + delta, with motion accents
//   projection-line — recharts gradient area chart, animated draw-in
//   donut           — recharts donut with center total + rounded segments
//
// Every primitive can render an optional live-data provenance caption
// (e.g. "Texas food costs · as of May 2026 · Live") so live data is visibly
// distinguished from static assumptions.
//
// RULES:
//   ✅ "use client" — recharts requires browser
//   ✅ No data fetching — all data passed as props
//   ✅ No useEffect / no setState — pure render
//   ✅ SSR-safe structure — no window references at module scope
//
// ─────────────────────────────────────────────────────────────────────────────

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type {
  InsightVisualization,
  BenchmarkBarVisualization,
  DeltaCardVisualization,
  ProjectionLineVisualization,
  DonutVisualization,
  InsightVisFormat,
  VisualCaption,
} from "@/lib/insights/types";

// ─── Formatter ────────────────────────────────────────────────────────────────

function fmtV(v: number, format: InsightVisFormat): string {
  if (format === "currency") {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000)     return `$${Math.round(v / 1_000)}k`;
    return `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
  if (format === "percent") return `${v.toFixed(1)}%`;
  return v.toLocaleString();
}

// ─── Live-data provenance caption ───────────────────────────────────────────────

function Caption({ caption }: { caption?: VisualCaption }) {
  if (!caption) return null;
  return (
    <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-medium text-gray-400">
      {caption.live && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
      )}
      <span className="truncate">
        {caption.text}
        {caption.asOf ? ` · as of ${caption.asOf}` : ""}
        {caption.live ? " · Live" : ""}
      </span>
    </div>
  );
}

// ─── BenchmarkBar ─────────────────────────────────────────────────────────────
// Two gradient horizontal bars: user value vs benchmark, with a delta chip.

function BenchmarkBar({ vis }: { vis: BenchmarkBarVisualization }) {
  const max      = Math.max(vis.userValue, vis.benchmarkValue) * 1.08 || 1;
  const userPct  = Math.min((vis.userValue      / max) * 100, 100);
  const benchPct = Math.min((vis.benchmarkValue / max) * 100, 100);
  const userIsBetter = vis.userValue <= vis.benchmarkValue;
  const diff = Math.abs(vis.userValue - vis.benchmarkValue);

  return (
    <div className="space-y-2.5 rounded-xl bg-gradient-to-b from-gray-50 to-gray-100/60 px-4 py-4 ring-1 ring-inset ring-gray-100">
      {/* Delta chip */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          You vs benchmark
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            userIsBetter ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {userIsBetter ? "−" : "+"}{fmtV(diff, vis.format)} {userIsBetter ? "lower" : "higher"}
        </span>
      </div>

      <Bar label={vis.userLabel} pct={userPct} value={fmtV(vis.userValue, vis.format)}
           tone={userIsBetter ? "good" : "warn"} emphasis />
      <Bar label={vis.benchmarkLabel} pct={benchPct} value={fmtV(vis.benchmarkValue, vis.format)}
           tone="neutral" />

      <Caption caption={vis.caption} />
    </div>
  );
}

function Bar({
  label, pct, value, tone, emphasis = false,
}: {
  label: string; pct: number; value: string; tone: "good" | "warn" | "neutral"; emphasis?: boolean;
}) {
  const fill =
    tone === "good"  ? "bg-gradient-to-r from-emerald-400 to-emerald-600" :
    tone === "warn"  ? "bg-gradient-to-r from-amber-300 to-amber-500" :
                       "bg-gradient-to-r from-gray-300 to-gray-400";
  return (
    <div className="flex items-center gap-3">
      <span className={`w-24 shrink-0 text-right text-[11px] leading-tight ${emphasis ? "font-semibold text-gray-600" : "font-medium text-gray-400"}`}>
        {label}
      </span>
      <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-gray-200/70">
        <div
          className={`flex h-full items-center justify-end rounded-full px-2.5 shadow-sm transition-[width] duration-700 ease-out ${fill}`}
          style={{ width: `${Math.max(pct, 8)}%` }}
        >
          <span className="whitespace-nowrap text-[11px] font-bold text-white drop-shadow-sm">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── DeltaCard ────────────────────────────────────────────────────────────────
// Before → After + Delta, with a gradient hero on the delta.

function DeltaCardVis({ vis }: { vis: DeltaCardVisualization }) {
  return (
    <div className="rounded-xl bg-gradient-to-b from-gray-50 to-gray-100/60 p-3 ring-1 ring-inset ring-gray-100">
      <div className="flex items-stretch gap-2">
        <div className="flex-1 rounded-xl border border-gray-200 bg-white p-3 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {vis.before.label}
          </p>
          <p className="text-lg font-black text-gray-600">{vis.before.value}</p>
        </div>

        <div className="flex items-center px-0.5 text-base text-gray-300 select-none">→</div>

        <div className="flex-1 rounded-xl border border-emerald-200 bg-white p-3 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
            {vis.after.label}
          </p>
          <p className="text-lg font-black text-emerald-600">{vis.after.value}</p>
        </div>

        <div className={`flex-1 rounded-xl border p-3 text-center shadow-sm ${
          vis.delta.positive
            ? "border-emerald-300 bg-gradient-to-b from-emerald-50 to-emerald-100/80"
            : "border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100/80"
        }`}>
          <p className={`mb-2 text-[10px] font-bold uppercase tracking-widest ${
            vis.delta.positive ? "text-emerald-600" : "text-amber-600"
          }`}>
            {vis.delta.label}
          </p>
          <p className={`text-lg font-black ${
            vis.delta.positive ? "text-emerald-700" : "text-amber-700"
          }`}>
            {vis.delta.value}
          </p>
        </div>
      </div>
      <Caption caption={vis.caption} />
    </div>
  );
}

// ─── ProjectionLine ───────────────────────────────────────────────────────────
// Recharts gradient area chart, animated draw-in.

function ProjectionLine({ vis }: { vis: ProjectionLineVisualization }) {
  const data  = vis.points.map((p) => ({ name: p.label, value: p.value }));
  const color = vis.color ?? "#10b981";
  const gradId = `grad-${color.replace("#", "")}`;

  return (
    <div className="rounded-xl bg-gradient-to-b from-gray-50 to-gray-100/60 px-3 pt-4 pb-2 ring-1 ring-inset ring-gray-100">
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={data} margin={{ top: 6, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => fmtV(v, vis.format)}
            width={48}
          />
          <Tooltip
            formatter={(v: unknown) => [fmtV(Number(v), vis.format), vis.yLabel ?? "Value"]}
            contentStyle={{
              fontSize: 11, borderRadius: 10, border: "1px solid #e5e7eb",
              backgroundColor: "#fff", color: "#111827", boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            }}
            cursor={{ stroke: color, strokeOpacity: 0.25, strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradId})`}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
      <Caption caption={vis.caption} />
    </div>
  );
}

// ─── Donut ────────────────────────────────────────────────────────────────────
// Recharts donut with rounded segments + center total label.

function DonutChart({ vis }: { vis: DonutVisualization }) {
  const data  = vis.segments.map((s) => ({ name: s.label, value: s.value }));
  const total = vis.segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="rounded-xl bg-gradient-to-b from-gray-50 to-gray-100/60 p-4 ring-1 ring-inset ring-gray-100">
      <div className="relative">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={2}
              cornerRadius={6}
              stroke="none"
              isAnimationActive
              animationDuration={800}
            >
              {vis.segments.map((s, i) => (
                <Cell key={i} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: unknown, name: unknown) => [fmtV(Number(v), vis.format), String(name)]}
              contentStyle={{
                fontSize: 11, borderRadius: 10, border: "1px solid #e5e7eb",
                backgroundColor: "#fff", color: "#111827", boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center total overlay */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-black text-gray-800">{fmtV(total, vis.format)}</span>
          {vis.centerLabel && (
            <span className="text-[10px] font-medium text-gray-400">{vis.centerLabel}</span>
          )}
        </div>
      </div>

      <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {vis.segments.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[11px] text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>
      <Caption caption={vis.caption} />
    </div>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

export default function InsightVisual({ vis }: { vis: InsightVisualization }) {
  switch (vis.type) {
    case "benchmark-bar":   return <BenchmarkBar   vis={vis} />;
    case "delta-card":      return <DeltaCardVis   vis={vis} />;
    case "projection-line": return <ProjectionLine vis={vis} />;
    case "donut":           return <DonutChart     vis={vis} />;
  }
}
