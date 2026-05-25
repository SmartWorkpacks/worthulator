"use client";

// ─── RechartsBarChart ─────────────────────────────────────────────────────────
//
// Reusable Recharts bar chart for Worthulator calculator pages.
// SSR-safe — no dynamic import needed (Recharts does not use window at module scope).
//
// Supports 5 variants via props:
//
// ── Variant 1: Vertical column (single series) ───────────────────────────────
//   <RechartsBarChart
//     title="Annual pay by hours"
//     data={[
//       { label: "40h", pay: 52000 },
//       { label: "50h", pay: 66625 },
//       { label: "60h", pay: 81250 },
//     ]}
//     bars={[{ key: "pay", name: "Annual pay", color: "#10b981" }]}
//     xKey="label"
//     yFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
//   />
//
// ── Variant 2: Horizontal bar ─────────────────────────────────────────────────
//   <RechartsBarChart
//     layout="horizontal"
//     data={[
//       { state: "Tennessee", rate: 9.55 },
//       { state: "Louisiana", rate: 9.47 },
//     ]}
//     bars={[{ key: "rate", name: "Rate", color: "#f59e0b" }]}
//     xKey="state"
//     yFormatter={(v) => `${v}%`}
//   />
//
// ── Variant 3: Stacked bar (multiple series) ──────────────────────────────────
//   <RechartsBarChart
//     stacked
//     data={[
//       { h: "40h", regular: 1000, overtime: 0 },
//       { h: "48h", regular: 1000, overtime: 300 },
//     ]}
//     bars={[
//       { key: "regular",  name: "Regular",  color: "#10b981" },
//       { key: "overtime", name: "Overtime", color: "#f59e0b" },
//     ]}
//     xKey="h"
//     yFormatter={(v) => `$${v}`}
//   />
//
// ── Variant 4: Grouped (side-by-side, multiple series) ───────────────────────
//   <RechartsBarChart
//     data={[
//       { rate: "$20/hr", "40h": 41600, "50h": 53300 },
//       { rate: "$25/hr", "40h": 52000, "50h": 66625 },
//     ]}
//     bars={[
//       { key: "40h", name: "40h/wk", color: "#94a3b8" },
//       { key: "50h", name: "50h/wk", color: "#10b981" },
//     ]}
//     xKey="rate"
//     yFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
//   />
//
// ── Variant 5: Column with reference line ─────────────────────────────────────
//   <RechartsBarChart
//     data={[{ m: "Jan", spend: 1200 }, { m: "Feb", spend: 1450 }]}
//     bars={[{ key: "spend", name: "Spend", color: "#38bdf8" }]}
//     xKey="m"
//     referenceLines={[{ y: 1500, label: "Budget", color: "#f43f5e" }]}
//     yFormatter={(v) => `$${v}`}
//   />
//
// RULES:
//   ✅ "use client" — required for Recharts ResponsiveContainer
//   ✅ SSR-safe — no dynamic import needed
//   ✅ No data fetching — all data passed as props
//
// ─────────────────────────────────────────────────────────────────────────────

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RechartsBarSeries {
  /** Key in each data object to read values from */
  key: string;
  /** Legend / tooltip label */
  name: string;
  /** Single hex colour, or array for per-bar colouring (single-series only) */
  color: string | string[];
  /** Bar corner radius (default 4) */
  radius?: number;
}

export interface RechartsBarReferenceLineProps {
  y?: number;
  x?: string | number;
  label?: string;
  color?: string;
}

export interface RechartsBarChartProps {
  /** Array of data objects */
  data: Record<string, unknown>[];
  /** Key in each data object used as the x-axis (category) value */
  xKey: string;
  /** Bar series definitions */
  bars: RechartsBarSeries[];
  /**
   * "vertical" (default) — normal column bar.
   * "horizontal"          — rotated with categories on the y-axis.
   */
  layout?: "vertical" | "horizontal";
  /** Stack all series on top of each other (default false) */
  stacked?: boolean;
  /** Card title */
  title?: string;
  /** Optional muted subtitle */
  subtitle?: string;
  /** Chart height in px (default 280) */
  height?: number;
  /** Bar width as a number (px) or percentage string e.g. "60%" */
  barSize?: number | string;
  /** Format the value axis tick labels */
  yFormatter?: (v: number) => string;
  /** Format tooltip value (defaults to yFormatter) */
  tooltipFormatter?: (v: number) => string;
  /** Show grid lines (default true) */
  showGrid?: boolean;
  /** Show legend (default true when >1 series) */
  showLegend?: boolean;
  /** Optional reference lines */
  referenceLines?: RechartsBarReferenceLineProps[];
  /** Optional className on the outer wrapper div */
  className?: string;
}

// ─── Shared styles ────────────────────────────────────────────────────────────

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

export default function RechartsBarChart({
  data,
  xKey,
  bars,
  layout = "vertical",
  stacked = false,
  title,
  subtitle,
  height = 280,
  barSize,
  yFormatter,
  tooltipFormatter,
  showGrid = true,
  showLegend,
  referenceLines = [],
  className,
}: RechartsBarChartProps) {
  const resolvedShowLegend = showLegend ?? bars.length > 1;
  const resolvedTooltipFormatter = tooltipFormatter ?? yFormatter;
  const isHorizontal = layout === "horizontal";

  // For horizontal layout, categories go on y-axis and values on x-axis
  const CategoryAxis = isHorizontal ? YAxis : XAxis;
  const ValueAxis    = isHorizontal ? XAxis : YAxis;

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <p className="text-sm font-semibold text-gray-800">{title}</p>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={isHorizontal ? "vertical" : "horizontal"}
          margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}

          {/* Category axis */}
          <CategoryAxis
            dataKey={isHorizontal ? xKey : undefined}
            type={isHorizontal ? "category" : undefined}
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            width={isHorizontal ? 110 : undefined}
          />

          {/* Value axis */}
          <ValueAxis
            dataKey={isHorizontal ? undefined : undefined}
            type={isHorizontal ? "number" : undefined}
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={yFormatter}
          />

          {/* Non-horizontal: XAxis needs dataKey */}
          {!isHorizontal && (
            <XAxis
              dataKey={xKey}
              tick={TICK_STYLE}
              axisLine={false}
              tickLine={false}
            />
          )}
          {!isHorizontal && (
            <YAxis
              tick={TICK_STYLE}
              axisLine={false}
              tickLine={false}
              tickFormatter={yFormatter}
            />
          )}

          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={
              resolvedTooltipFormatter
                ? (v: unknown) => [resolvedTooltipFormatter(Number(v)), ""]
                : undefined
            }
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
              label={
                rl.label
                  ? {
                      value: rl.label,
                      position: "insideTopRight",
                      style: { fontSize: 11, fill: rl.color ?? "#f43f5e" },
                    }
                  : undefined
              }
            />
          ))}

          {bars.map((b) => {
            const isMultiColor = Array.isArray(b.color);
            return (
              <Bar
                key={b.key}
                dataKey={b.key}
                name={b.name}
                fill={isMultiColor ? (b.color as string[])[0] : (b.color as string)}
                stackId={stacked ? "stack" : undefined}
                radius={[b.radius ?? 4, b.radius ?? 4, 0, 0]}
                barSize={barSize as number | undefined}
              >
                {isMultiColor &&
                  data.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={(b.color as string[])[idx % (b.color as string[]).length]}
                    />
                  ))}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
