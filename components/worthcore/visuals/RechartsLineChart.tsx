"use client";

// ─── RechartsLineChart ────────────────────────────────────────────────────────
//
// Reusable Recharts line / area chart for Worthulator calculator pages.
// SSR-safe — no dynamic import needed (Recharts does not use window at module scope).
//
// Supports 5 variants via props:
//
// ── Variant 1: Simple line (single series) ────────────────────────────────────
//   <RechartsLineChart
//     title="Compound growth"
//     data={[{ x: "Yr 1", value: 1000 }, { x: "Yr 5", value: 6105 }]}
//     lines={[{ key: "value", name: "Balance", color: "#10b981" }]}
//     xKey="x"
//     yFormatter={(v) => `$${v.toLocaleString()}`}
//   />
//
// ── Variant 2: Area fill (single series) ─────────────────────────────────────
//   <RechartsLineChart
//     area
//     data={[{ x: "30h", pay: 750 }, { x: "40h", pay: 1000 }, { x: "50h", pay: 1375 }]}
//     lines={[{ key: "pay", name: "Weekly pay", color: "#10b981" }]}
//     xKey="x"
//     yFormatter={(v) => `$${v}`}
//   />
//
// ── Variant 3: Multi-line comparison ─────────────────────────────────────────
//   <RechartsLineChart
//     data={[
//       { month: "Jan", invested: 500, saved: 500, spent: 500 },
//       { month: "Dec", invested: 6200, saved: 6000, spent: 5880 },
//     ]}
//     lines={[
//       { key: "invested", name: "Invested",  color: "#10b981" },
//       { key: "saved",    name: "Savings",   color: "#f59e0b" },
//       { key: "spent",    name: "Spent",     color: "#94a3b8" },
//     ]}
//     xKey="month"
//     yFormatter={(v) => `$${v.toLocaleString()}`}
//   />
//
// ── Variant 4: Multi-area with reference line ─────────────────────────────────
//   <RechartsLineChart
//     area
//     data={[...]}
//     lines={[{ key: "annual", name: "Annual cost", color: "#f59e0b" }]}
//     xKey="spend"
//     referenceLines={[{ y: 1200, label: "Budget", color: "#f43f5e" }]}
//     yFormatter={(v) => `$${v}`}
//   />
//
// ── Variant 5: Straight (non-curved) line, no grid ───────────────────────────
//   <RechartsLineChart
//     data={[...]}
//     lines={[{ key: "rate", name: "Rate", color: "#38bdf8" }]}
//     xKey="year"
//     curve={false}
//     showGrid={false}
//     yFormatter={(v) => `${v}%`}
//   />
//
// RULES:
//   ✅ "use client" — required for Recharts ResponsiveContainer
//   ✅ SSR-safe — no dynamic import needed
//   ✅ No data fetching — all data passed as props
//
// ─────────────────────────────────────────────────────────────────────────────

import {
  LineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RechartsLineSeries {
  /** Key in each data object to read y-values from */
  key: string;
  /** Legend / tooltip label */
  name: string;
  /** Hex colour string */
  color: string;
  /** Stroke width (default 2) */
  strokeWidth?: number;
  /** Stroke dash array e.g. "4 2" for dashed lines */
  strokeDashArray?: string;
  /** Fill opacity for area variant (default 0.15) */
  fillOpacity?: number;
}

export interface RechartsReferenceLineProps {
  /** Horizontal reference line y-value */
  y?: number;
  /** Vertical reference line x-value */
  x?: string | number;
  label?: string;
  color?: string;
}

export interface RechartsLineChartProps {
  /** Array of data objects — each must contain xKey + all series keys */
  data: Record<string, unknown>[];
  /** Key in each data object to use as the x-axis value */
  xKey: string;
  /** Series definitions */
  lines: RechartsLineSeries[];
  /** Render as area fill below the line (default false) */
  area?: boolean;
  /** Card title shown above the chart */
  title?: string;
  /** Optional muted subtitle */
  subtitle?: string;
  /** Chart height in px (default 280) */
  height?: number;
  /** Format y-axis tick labels */
  yFormatter?: (v: number) => string;
  /** Format tooltip value (defaults to yFormatter) */
  tooltipFormatter?: (v: number) => string;
  /** X-axis label */
  xAxisLabel?: string;
  /** Y-axis label */
  yAxisLabel?: string;
  /** Draw a curve (default true) */
  curve?: boolean;
  /** Show grid lines (default true) */
  showGrid?: boolean;
  /** Show legend (default true when >1 series) */
  showLegend?: boolean;
  /** Optional horizontal/vertical reference lines */
  referenceLines?: RechartsReferenceLineProps[];
  /** Optional className on the outer wrapper div */
  className?: string;
}

// ─── Shared axis / tooltip styles ────────────────────────────────────────────

const TICK_STYLE = { fill: "#9ca3af", fontSize: 11 };
const TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  fontSize: 12,
  color: "#374151",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RechartsLineChart({
  data,
  xKey,
  lines,
  area = false,
  title,
  subtitle,
  height = 280,
  yFormatter,
  tooltipFormatter,
  xAxisLabel,
  yAxisLabel,
  curve = true,
  showGrid = true,
  showLegend,
  referenceLines = [],
  className,
}: RechartsLineChartProps) {
  const resolvedShowLegend = showLegend ?? lines.length > 1;
  const resolvedTooltipFormatter = tooltipFormatter ?? yFormatter;
  const curveType = curve ? "monotone" : "linear";

  // Shared children (axes, grid, tooltip, legend, reference lines)
  const sharedChildren = (
    <>
      {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
      <XAxis
        dataKey={xKey}
        tick={TICK_STYLE}
        axisLine={false}
        tickLine={false}
        label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -4, style: { fontSize: 11, fill: "#9ca3af" } } : undefined}
      />
      <YAxis
        tick={TICK_STYLE}
        axisLine={false}
        tickLine={false}
        tickFormatter={yFormatter}
        label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#9ca3af" } } : undefined}
      />
      <Tooltip
        contentStyle={TOOLTIP_STYLE}
        formatter={resolvedTooltipFormatter ? (v: unknown) => [resolvedTooltipFormatter(Number(v)), ""] : undefined}
      />
      {resolvedShowLegend && (
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
      )}
      {referenceLines.map((rl, i) => (
        <ReferenceLine
          key={i}
          x={rl.x}
          y={rl.y}
          stroke={rl.color ?? "#f43f5e"}
          strokeDasharray="4 3"
          label={rl.label ? { value: rl.label, position: "insideTopRight", style: { fontSize: 11, fill: rl.color ?? "#f43f5e" } } : undefined}
        />
      ))}
    </>
  );

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <p className="text-sm font-semibold text-gray-800">{title}</p>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {area ? (
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: xAxisLabel ? 20 : 4, left: 4 }}>
            <defs>
              {lines.map((l) => (
                <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={l.color} stopOpacity={l.fillOpacity ?? 0.18} />
                  <stop offset="95%" stopColor={l.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            {sharedChildren}
            {lines.map((l) => (
              <Area
                key={l.key}
                type={curveType}
                dataKey={l.key}
                name={l.name}
                stroke={l.color}
                strokeWidth={l.strokeWidth ?? 2}
                strokeDasharray={l.strokeDashArray}
                fill={`url(#grad-${l.key})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: xAxisLabel ? 20 : 4, left: 4 }}>
            {sharedChildren}
            {lines.map((l) => (
              <Line
                key={l.key}
                type={curveType}
                dataKey={l.key}
                name={l.name}
                stroke={l.color}
                strokeWidth={l.strokeWidth ?? 2}
                strokeDasharray={l.strokeDashArray}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
